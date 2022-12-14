#!/bin/bash

docker-compose -f mongo1MempoolExplorerBack.yml -f mempoolExplorerBack1Dev.yml -f mempoolExplorerFrontProd.yml down
