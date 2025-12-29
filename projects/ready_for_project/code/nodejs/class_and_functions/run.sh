#!/bin/bash
# Run main.js 10 times

for i in {1..10}
do
  echo "---- Run $i ----"
  node onerror.js
  echo                # blank line for readability
done