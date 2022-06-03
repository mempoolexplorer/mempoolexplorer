#!/bin/bash

docker-compose -f mongo1MempoolExplorerBack.yml -f mempoolExplorerBack1Prod.yml up -d --build
