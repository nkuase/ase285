#!/bin/bash
# Run onerror.js 10 times (it fails randomly)
cd "$(dirname "$0")"

for i in {1..10}
do
  echo "---- Run $i ----"
  node onerror.js
  echo                # blank line for readability
done
