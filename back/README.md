# Backend configuration

These are the key variables when configuring the backend service. Note that their current values are defined [here](https://github.com/mempoolexplorer/mempoolexplorer/blob/main/devops/mempoolExplorerBack1Dev.yml) and [here](https://github.com/mempoolexplorer/mempoolexplorer/blob/main/devops/mempoolExplorerBack1Prod.yml)

- bitcoindadapter.refreshBTIntervalMilliSec: Interval for refreshing the Block template offered by bitcoind.
- bitcoindadapter.refreshSmartFeesIntervalMilliSec: Interval for refreshing the smart fees offered by bitcoind.
- bitcoindadapter.refreshBCIIntervalMilliSec: Interval for refreshing the block chain info offered by bitcoind.
- txmempool.liveMiningQueueRefreshEachMillis: Interval for refreshing the mining queue offered in the webpage. Note that the refresh operation can be costly when the mempool is heavily loaded so a bigger delay can happen in this situation.
- txmempool.miningQueueMaxNumBlocks: The maximum queued blocks that will be calculated when refreshing the mining queue. This is to limit the amount of work done on each refreshing, but can ignore low fee transactions.
- txmempool.liveMiningQueueMaxTxs: The maximum transactions that will be calculated when refreshing the mining queue. This is to limit the amount of work done on each refreshing, but can ignore low fee transactions.
- txmempool.maxTxsToCalculateTxsGraphs: Transactions graphs are costly to calculate, when mempool is above this transaction count, transactions graphs are not calculated.
- txmempool.maxLiveDataBufferSize: Maximum data about algorithm differences in each block. For debug only, not used actually.
- txmempool.numTimesTxIgnoredToMissed: Number of times a transaction must be ignored to be considered a missing transaction.
- txmempool.totalSatVBLostToMissed: Total satoshis per Virtual Byte lost that a ignored transaction must have to be considered missing. Set as 0 to forget about it. For debug purposes.
- txmempool.numTxMinedButNotInMemPoolToRaiseAlarm: An internal alarm is logged in case a mined block arrives with more than 10 txs that were not in our mempool. For debug purposes.
