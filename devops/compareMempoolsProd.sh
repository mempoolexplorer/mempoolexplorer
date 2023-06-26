#!/bin/bash

echo "bitcoindInDocker:" && \
~/programas/bitcoin-24.0/bin/bitcoin-cli --rpcconnect=172.18.0.5 getmempoolinfo && \
echo "" && echo "backend:" && curl http://172.18.0.2:8080/memPool/size && \
echo "" && echo "mempool-server backend:" && curl http://172.18.0.8:8000/mempoolServer/size && \
echo ""

