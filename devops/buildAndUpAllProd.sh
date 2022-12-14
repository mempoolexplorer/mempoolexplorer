#!/bin/bash

docker-compose -f bitcoind.yml -f mongo1MempoolExplorerBack.yml -f mempoolExplorerBack1Prod.yml -f mempoolExplorerFrontProd.yml up -d --build
