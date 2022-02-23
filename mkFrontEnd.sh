#!/bin/bash

cd "$(dirname "$0")"
cd ../mempool-explorer
echo 
echo "Building Frontend at:" $(pwd) "....."
npm run build
