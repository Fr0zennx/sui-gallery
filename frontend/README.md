# Car NFT Marketplace Frontend

A React-based dApp for trading Car NFTs on the Sui blockchain.

## Features

- **Visual Selector**: Browse and select from 3 car models (Red Speedster, Midnight Drifter, Desert Nomad)
- **Mint NFTs**: Create new Car NFTs with custom names and speeds (1-100 km/h)
- **My Garage**: View your owned Car NFTs and list them for sale
- **Marketplace**: Browse listings from other users and purchase Car NFTs
- **Wallet Integration**: Full Sui wallet support via dApp Kit

## Setup

### Prerequisites

- Node.js 18+
- Sui wallet installed (Sui Wallet, Ethos Wallet, etc.)

### Installation

1. Clone and install dependencies:

```bash
cd frontend
npm install
```

2. Set your Package ID:

```bash
cp .env.example .env.local
# Edit .env.local and add your PACKAGE_ID from Sui contract deployment
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm run preview
```

## Configuration

### Environment Variables

- `VITE_PACKAGE_ID`: Your deployed contract package ID (required)
- `VITE_NETWORK`: Network to connect to (testnet/mainnet, default: testnet)

## Components

- **ConnectWallet**: Wallet connection interface
- **VisualSelector**: Car model selection grid
- **MintForm**: NFT minting form with validation
- **MyGarage**: User's NFT collection and listing interface
- **Marketplace**: Shared listings display and purchase interface

## Styling

Built with Tailwind CSS featuring:
- Dark theme (black background)
- Neon orange (#ff8c00) highlights
- Smooth hover effects and transitions
- Responsive grid layouts

## Contract Integration

The frontend calls these contract functions:
- `mint_car_nft(name, speed, image_id)` - Mint new NFT
- `list_for_sale(nft, price)` - List NFT on marketplace
- `purchase(listing, payment)` - Buy listed NFT

## Network

Default network: **Testnet**

To switch to mainnet, update the network configuration in `src/main.tsx`

## Error Handling

The app includes error handling for:
- Invalid form inputs
- Transaction failures
- Network errors
- Wallet disconnection
