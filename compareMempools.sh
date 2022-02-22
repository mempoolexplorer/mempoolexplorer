#!/bin/bash

echo "bitcoind:" && \
~/programas/bitcoin-22.0/bin/bitcoin-cli --rpcconnect=pc getmempoolinfo && \
echo "" && echo "localhost:" && curl http://localhost:8080/memPool/size && \
echo ""

