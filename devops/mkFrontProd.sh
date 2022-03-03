#!/bin/bash

cd "$(dirname "$0")"
cd ../front
echo 
echo "npm build on:" $(pwd) "....."
export REACT_APP_GATEWAY=https://172.18.0.2:8443
export HTTPS=true
export SSL_CRT_FILE=~/.rsassl/localhost.crt
export SSL_KEY_FILE=~/.rsassl/localhost.key
npm run build
