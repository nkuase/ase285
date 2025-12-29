#!/bin/bash

npm install
# Simple run script for ORDB Todo App
# This script starts the server with SQLite by default

echo "Starting ORDB Todo App..."
echo "Database: ${DB_TYPE:-sqlite}"
echo "Port: ${PORT:-5500}"
echo ""

# Start the server
npm start
