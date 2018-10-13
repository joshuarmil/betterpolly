#!/bin/bash
node back-end/bin/www &
server=$!
echo $result
while true; do
	result=$(curl -g http://localhost:3000/status)
	if [ "$result" == "UP" ]; then
		echo "Server UP"
		break
	fi
done
node selenium-tests/test_homepage_exists_wsl.js
pnode=$(pidof node)
kill -9 $pnode
