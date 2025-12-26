#!/bin/bash

# Car NFT Marketplace Quick Start Script

echo "🏎️  Car NFT Marketplace - Quick Start"
echo "======================================"
echo ""

# Check if Sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI not found. Please install it first:"
    echo "   https://docs.sui.io/guides/developer/getting-started/sui-install"
    exit 1
fi

echo "✅ Sui CLI found"
echo ""

# Step 1: Publish contract
echo "📝 Step 1: Publishing Smart Contract"
echo "------------------------------------"
sui client publish --gas-budget 10000000

# Extract Package ID (this is a simplified approach)
echo ""
echo "📌 IMPORTANT: Copy your Package ID from the output above"
echo "   (It will look like: Package ID: 0x...)"
echo ""
read -p "Enter your Package ID: " PACKAGE_ID

# Step 2: Setup frontend
echo ""
echo "⚙️  Step 2: Setting up Frontend"
echo "-------------------------------"
cd frontend

if [ ! -f "node_modules/.package-lock.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env.local
echo "VITE_PACKAGE_ID=$PACKAGE_ID" > .env.local
echo "VITE_NETWORK=testnet" >> .env.local
echo "✅ Environment configured"

echo ""
echo "✨ Setup Complete!"
echo "=================="
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "Happy coding! 🚀"
