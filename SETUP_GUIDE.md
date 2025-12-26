# Sui Car NFT Marketplace - Complete Setup Guide

## Project Overview

This is a full-stack dApp for minting, listing, and purchasing Car NFTs on the Sui blockchain using Move smart contracts and React frontend.

## Project Structure

```
Sui Gallery/
├── Move.toml                 # Smart contract package config
├── sources/
│   └── nft_shop.move        # Car NFT marketplace module
└── frontend/                # React dApp
    ├── src/
    │   ├── App.tsx          # Main application component
    │   ├── main.tsx         # Entry point
    │   ├── index.css        # Tailwind styles
    │   └── components/
    │       ├── ConnectWallet.tsx
    │       ├── VisualSelector.tsx
    │       ├── MintForm.tsx
    │       ├── MyGarage.tsx
    │       └── Marketplace.tsx
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── tsconfig.json
    ├── package.json
    └── README.md
```

## Step 1: Smart Contract Deployment

### 1.1 Publish to Testnet

```bash
# Navigate to project root
cd "c:\Users\burak\Desktop\projects\speedrun-sui-projeleri\Sui Gallery"

# Publish the contract
sui client publish --gas-budget 10000000

# Save the Package ID from the output
# Example: "Package ID: 0xYOUR_PACKAGE_ID"
```

### 1.2 Record Package ID

After publishing, you'll receive a **Package ID**. This is critical for frontend integration.

Example output:
```
Created Objects:
  - ID: 0x... , Type: 0x2::package::Package
Package ID: 0x0123456789abcdef...
```

## Step 2: Frontend Setup

### 2.1 Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- React & React DOM
- Vite (build tool)
- Tailwind CSS (styling)
- @mysten/dapp-kit (Sui integration)
- @mysten/sui (Sui SDK)
- @tanstack/react-query (data fetching)

### 2.2 Configure Package ID

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your Package ID
# VITE_PACKAGE_ID=0x0123456789abcdef...
```

**OR** update `src/App.tsx` line 21:
```typescript
const PACKAGE_ID = '0x0123456789abcdef...' // Your package ID here
```

### 2.3 Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Step 3: Using the Application

### 3.1 Connect Wallet

1. Open the app
2. Click "Connect [Wallet Name]"
3. Approve connection in your wallet

### 3.2 Mint NFT

1. Go to "Mint NFT" tab
2. Select a car model from the visual selector
3. Enter car name (any string)
4. Enter speed (1-100)
5. Click "Mint NFT"
6. Approve transaction in wallet

### 3.3 Sell on Marketplace

1. Go to "My Garage" tab
2. View your minted NFTs
3. Enter desired sale price in SUI
4. Click "Sell on Market"
5. Approve transaction

### 3.4 Purchase from Marketplace

1. Go to "Marketplace" tab
2. Browse available listings
3. Click "Buy Now" on desired car
4. Approve payment transaction (ensure wallet has enough SUI)

## Car Models Reference

| ID | Name | Speed | IPFS URL |
|----|------|-------|----------|
| 1 | Red Speedster | 95 km/h | https://ipfs.io/ipfs/car_red |
| 2 | Midnight Drifter | 85 km/h | https://ipfs.io/ipfs/car_blue |
| 3 | Desert Nomad | 75 km/h | https://ipfs.io/ipfs/car_black |

## Contract Functions

### mint_car_nft
```
Entry function to mint a new Car NFT
Parameters:
  - name_bytes: vector<u8> - Car name as bytes
  - speed: u64 - Speed 1-100 km/h
  - image_id: u64 - Image ID (1, 2, or 3)
```

### list_for_sale
```
List an owned NFT for sale
Parameters:
  - nft: CarNFT - The NFT to list
  - price: u64 - Price in MIST (1 SUI = 1,000,000,000 MIST)
```

### purchase
```
Purchase a listed NFT
Parameters:
  - listing: Listing - Shared listing object
  - payment: Coin<SUI> - Payment in SUI
```

## Error Codes (Move Contract)

| Code | Error | Meaning |
|------|-------|---------|
| 1 | ERR_INVALID_IMAGE_ID | Image ID must be 1, 2, or 3 |
| 2 | ERR_SPEED_TOO_LOW | Speed must be >= 1 |
| 3 | ERR_SPEED_TOO_HIGH | Speed must be <= 100 |
| 4 | ERR_INSUFFICIENT_FUNDS | Payment doesn't match listing price |

## Building for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

## Troubleshooting

### "Package not found"
- Ensure you're using the correct Package ID
- Verify the contract was published successfully
- Check that you're on the correct network (testnet)

### "Insufficient funds"
- Ensure your wallet has enough SUI tokens
- Request testnet SUI from the faucet if needed

### "Object not found"
- Wait a few seconds for transaction finality
- Refresh the page to reload object state

### Wallet not connecting
- Ensure a Sui-compatible wallet is installed
- Try using Sui Wallet or Ethos Wallet
- Check that extensions are enabled

## Development Notes

- Frontend uses React 18 with TypeScript
- Styling via Tailwind CSS with custom neon-orange theme
- State management via React Query for smart contract interactions
- Transaction signing via dApp Kit hooks

## Next Steps

1. Customize car images in the `carModels` array in App.tsx
2. Add additional car properties (color, manufacturer, etc.)
3. Implement advanced marketplace features (filters, sorting, auctions)
4. Deploy frontend to production hosting
5. Enhance UI with real car artwork/GIFs

## Resources

- [Sui Documentation](https://docs.sui.io)
- [Move Book](https://move-language.github.io/move/)
- [dApp Kit Docs](https://sdk.mysten.dev/dapp-kit)
- [Tailwind CSS](https://tailwindcss.com)
