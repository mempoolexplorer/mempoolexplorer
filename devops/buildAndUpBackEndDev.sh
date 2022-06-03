#!/bin/bash

docker-compose -f mongo1MempoolExplorerBack.yml -f mempoolExplorerBack1Dev.yml up -d --build
