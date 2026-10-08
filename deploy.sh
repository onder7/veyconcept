#!/bin/bash

# Find docker-compose.yml
echo "=== Finding docker-compose.yml ==="
find /home -name docker-compose.yml -type f 2>/dev/null

echo ""
echo "=== Checking /home/onder ==="
ls -la /home/onder 2>/dev/null || echo "Directory not found"

echo ""
echo "=== Checking /root ==="
ls -la /root
