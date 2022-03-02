package com.mempoolexplorer.backend.threads;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Formatter;
import java.util.Iterator;
import java.util.Optional;

import com.mempoolexplorer.backend.BackendApp;
import com.mempoolexplorer.backend.components.containers.events.MempoolSeqEventQueueContainer;
import com.mempoolexplorer.backend.properties.BitcoindProperties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.zeromq.SocketType;
import org.zeromq.ZContext;
import org.zeromq.ZFrame;
import org.zeromq.ZMQ;
import org.zeromq.ZMQException;
import org.zeromq.ZMsg;

import lombok.extern.slf4j.Slf4j;
import zmq.ZError;

/**
 * Receives ZMQ sequence events and enqueue them. I prefer this approach of
 * having a blockingqueue instead of simply letting zmq buffer fill. When
 * bitcoind is started *all* mempool.dat is sent via ZMQ so zmq buffer can
 * overflow. I prefer this over ZMQ.Socket.setHWM(BIGNUMBERHERE) &&
 * ZMQ.Socket.setReceiveBufferSize(BIGNUMBERHERE). since I have the control.
 * 
 * Also I could have used a reactive platform (i.e. reactor and the like). but
 * seems too complicated for this use case.
 * 
 * Be aware that mempoolSequence starts in 1 and zmqSequence starts in 0
 * mempoolSequence=Optional[1], zmqSequence=0
 */
@Component
@Slf4j
public class ZMQSequenceEventReceiver extends StoppableThread {

    @Autowired
    private BitcoindProperties bitcoindProperties;

    @Autowired
    protected MempoolSeqEventQueueContainer blockingQueueContainer;

    @Override
    protected void doYourThing() throws InterruptedException {
        try (ZContext context = new ZContext(); ZMQ.Socket socket = context.createSocket(SocketType.SUB);) {
            boolean connected = socket
                    .connect("tcp://" + bitcoindProperties.getHost() + ":" + bitcoindProperties.getZmqPort());
            if (!connected) {
                log.error("CAN'T CONNECT TO BITCOIN ZMQ SOCKET IN {}:{}", bitcoindProperties.getHost(),
                        bitcoindProperties.getZmqPort());
                // We inevitably shutdown, this do not happen because bitcoind is not
                // reacheable, but because socket cannot be open.
                BackendApp.exit();
            }
            socket.subscribe("sequence");

            while (!isFinished()) {
                // Block until a message is received, there is no gain using a ZMQ.Poller to do
                // a "select" since there is only one socket.
                ZMsg msg = ZMsg.recvMsg(socket);

                if (msg == null) {
                    log.info("Main thread interrupted.");
                    // Thread has been interrupted. exit from loop
                    break;
                }

                if (msg.size() != 3) {
                    throw new IndexOutOfBoundsException("ZMQ message size should be 3 always");
                }

                Iterator<ZFrame> it = msg.iterator();
                String topic = new String(it.next().getData(), ZMQ.CHARSET);
                ByteBuffer body = ByteBuffer.wrap(it.next().getData());
                int zmqSequence = ByteBuffer.wrap(it.next().getData()).order(ByteOrder.LITTLE_ENDIAN).getInt();

                if (topic.compareTo("sequence") != 0) {
                    throw new IllegalArgumentException("ZMQ topic should be 'sequence' but it's: " + topic);
                }

                byte[] hash = new byte[32];
                body.get(hash, 0, 32);
                String hashStr = bin2hex(hash);
                byte[] op = new byte[1];
                body.get(op, 0, 1);
                MempoolEventEnum eventEnum;
                Integer memPoolSequence = null;
                switch (op[0]) {
                    case 'A':
                        eventEnum = MempoolEventEnum.TXADD;
                        body.position(33);
                        memPoolSequence = body.order(ByteOrder.LITTLE_ENDIAN).getInt();
                        break;
                    case 'R':
                        eventEnum = MempoolEventEnum.TXDEL;
                        body.position(33);
                        memPoolSequence = body.order(ByteOrder.LITTLE_ENDIAN).getInt();
                        break;
                    case 'C':
                        eventEnum = MempoolEventEnum.BLOCKCON;
                        break;
                    case 'D':
                        eventEnum = MempoolEventEnum.BLOCKDIS;
                        break;
                    default:
                        throw new IllegalArgumentException();
                }
                MempoolSeqEvent event = new MempoolSeqEvent(hashStr, eventEnum, Optional.ofNullable(memPoolSequence),
                        zmqSequence);
                blockingQueueContainer.getBlockingQueue().add(event);
            }
            log.info("Out of main loop ");
        } catch (ZMQException e) {
            // ZError.EINTR when thread waiting in socket has been interrupted.
            if (e.getErrorCode() == ZError.EINTR) {
                log.info("Thread interrupted for shutdown. (ZMsg.recvMsg(socket) interrupted.)");
            } else {
                throw e;
            }
        }
    }

    private String bin2hex(byte[] bytes) {
        try (Formatter f = new Formatter()) {
            for (byte c : bytes)
                f.format("%02X", c);
            return (f.toString().toLowerCase());
        }
    }
}
