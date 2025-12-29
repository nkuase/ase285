#!/bin/bash
# Run random_promise.js 10 times

for i in {1..10}
do
  echo "---- Run $i ----"
  node random_promise.js
  echo ""
done