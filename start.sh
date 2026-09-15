#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="$DIR/bin:/Applications/ChatGPT.app/Contents/Resources/cua_node/bin:$PATH"
echo "==============================================================="
echo "   Finora — Personal AI Wealth Advisory Platform (₹ INR)"
echo "   Access real-time analytics from any device: http://localhost:3000"
echo "==============================================================="
exec "$DIR/bin/npx" vite --port 3000 --host
