#!/bin/bash

if [ -z "$1" ]; then
    echo "Required parameter: topic"
    exit 1
fi

docker exec -it kafka \
  kafka-console-producer \
    --broker-list kafka:29094 \
    --topic $1 \
    --property "parse.key=true" \
    --property "key.separator=#"