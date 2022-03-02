#!/bin/bash

cd "$(dirname "$0")"
cd ../mempool-explorer-front
echo 
echo "Running Frontend at:" $(pwd) "....."
export REACT_APP_GATEWAY=https://172.18.0.2:8443
export HTTPS=true
export SSL_CRT_FILE=../../.rsassl/localhost.crt
export SSL_KEY_FILE=../../.rsassl/localhost.key
export BROWSER=google-chrome 
npm start
