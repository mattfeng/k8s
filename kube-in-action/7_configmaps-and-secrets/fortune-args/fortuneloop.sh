#!/bin/bash

trap "exit" SIGINT
INTERVAL=$1

echo "Configured to generate new forune every $INTERVAL seconds"
mkdir -p /var/htdocs
while :
do
    echo "$(date) Writing forune to /var/htdocs/index.html"
    /usr/games/fortune > /var/htdocs/index.html

    sleep $INTERVAL
done
