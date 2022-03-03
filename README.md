# Open Source Interactive Mempool Visualizer

This is the full mempool visualizer & explorer running on <https://mempoolexplorer.com>. It is focused on visualizing where a transaction is in the mining queue, but also offers data about transaction dependency graphs, ignored transactions, and miners profit statistics.

![mempool](./resources/MempoolExplorer.png)

## Instalation

Mempool explorer can be self-hosted via docker-compose following the next steps:

1. You must have running a bitcoind node with this parameters enabled:

- rpcallowip=172.18.0.2
- rpcuser=anon
- rpcpassword=anon
- txindex=1
- zmqpubsequence=tcp://[yourLocalIPHere]:29000
- rpcbind=pc
