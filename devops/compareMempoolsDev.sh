#!/bin/bash

echo "bitcoind:" && \
~/programas/bitcoin-24.0/bin/bitcoin-cli --rpcconnect=pc getmempoolinfo && \
echo "" && echo "backend:" && curl http://172.18.0.2:8080/memPool/size && \
echo ""

