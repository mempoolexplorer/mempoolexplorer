#!/bin/bash

cd "$(dirname "$0")"
cd ../front
echo 
echo "npm install on:" $(pwd) "....."
npm install
