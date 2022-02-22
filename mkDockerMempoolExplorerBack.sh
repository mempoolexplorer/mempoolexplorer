#!/bin/bash

cd "$(dirname "$0")"
cd ../mempool-explorer-back
echo 
echo "Creating project image" $(pwd) "....."
# ./gradlew bootJar --no-daemon
./gradlew docker 
