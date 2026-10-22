#!/usr/bin/env bash
# Run the Python test client (start the server first).
cd "$(dirname "$0")"

pip install "python-socketio[client]"
python test-cli.py
