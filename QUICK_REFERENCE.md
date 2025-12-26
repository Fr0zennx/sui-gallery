# Quick Reference Card

## 🚀 Quick Commands

### Smart Contract
```bash
# Publish to testnet
sui client publish --gas-budget 10000000

# Check contract on explorer
# https://testnet.suiscan.xyz/object/[PACKAGE_ID]
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment
```bash
# Create config (replace with your Package ID)
echo "VITE_PACKAGE_ID=0x..." > frontend/.env.local
echo "VITE_NETWORK=testnet" >> frontend/.env.local
```

---

## 🎯 Key Files

| File | Purpose | Edit When |
|------|---------|-----------|
| `Move.toml` | Contract config | Changing package name |
| `sources/nft_shop.move` | Smart contract | Adding contract features |
| `frontend/src/App.tsx` | Main React component | Changing UI layout |
| `frontend/.env.local` | Environment variables | Using different Package ID |
| `frontend/src/components/*.tsx` | UI components | Customizing design |

---

## 📋 Car Models Data

```typescript
// From App.tsx
const carModels = [
  { id: 1, name: 'Red Speedster', speed: '95', imageUrl: 'https://ipfs.io/ipfs/car_red' },
  { id: 2, name: 'Midnight Drifter', speed: '85', imageUrl: 'https://ipfs.io/ipfs/car_blue' },
  { id: 3, name: 'Desert Nomad', speed: '75', imageUrl: 'https://ipfs.io/ipfs/car_black' },
]
```

---

## 🔧 Contract Functions

### Mint NFT
```
mint_car_nft(name_bytes, speed, image_id, ctx)
- name_bytes: vector<u8> (UTF-8 encoded string)
- speed: u64 (1-100)
- image_id: u64 (1, 2, or 3)
```

### List for Sale
```
list_for_sale(nft, price, ctx)
- nft: CarNFT
- price: u64 (in MIST, 1 SUI = 1,000,000,000 MIST)
```

### Purchase
```
purchase(listing, payment, ctx)
- listing: Listing (shared object)
- payment: Coin<SUI>
```

---

## 🎨 Component Hierarchy

```
App
├── ConnectWallet (if not connected)
├── Header
├── VisualSelector
├── Navigation Tabs
└── Tab Content
    ├── MintForm
    ├── MyGarage
    └── Marketplace
```

---

## 🔐 Error Codes

| Code | Name | Meaning |
|------|------|---------|
| 1 | ERR_INVALID_IMAGE_ID | image_id ∉ {1,2,3} |
| 2 | ERR_SPEED_TOO_LOW | speed < 1 |
| 3 | ERR_SPEED_TOO_HIGH | speed > 100 |
| 4 | ERR_INSUFFICIENT_FUNDS | payment < price |

---

## 🌐 Network Configuration

### Testnet (Development)
```
Network: testnet
Explorer: testnet.suiscan.xyz
RPC: fullnode.testnet.sui.io:443
Faucet: Discord #testnet-faucet
```

### Mainnet (Production)
```
Network: mainnet
Explorer: suiscan.xyz
RPC: fullnode.mainnet.sui.io:443
Gas: Real SUI required
```

---

## 📊 Transaction Flow

```
User connects wallet
    ↓
User selects car model
    ↓
User fills mint form (name, speed)
    ↓
Clicks "Mint NFT"
    ↓
Contract validates speed (1-100)
    ↓
Contract validates image_id (1-3)
    ↓
NFT created and transferred to user
    ↓
Event emitted
    ↓
MyGarage updated
    ↓
User can now list for sale
```

---

## 🔍 Important URLs

| Resource | URL |
|----------|-----|
| Sui Docs | https://docs.sui.io |
| Move Book | https://move-language.github.io/move/ |
| Testnet Explorer | https://testnet.suiscan.xyz |
| Mainnet Explorer | https://suiscan.xyz |
| dApp Kit | https://sdk.mysten.dev/dapp-kit |
| Sui Discord | https://discord.gg/sui |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Package not found" | Check Package ID in .env.local |
| "Insufficient funds" | Request testnet SUI from faucet |
| "Wallet not connecting" | Install Sui Wallet extension |
| "npm ERR!" | Delete node_modules, run npm install |
| "Port 5173 in use" | Kill process or use different port |
| "Environment not loading" | Restart dev server after creating .env.local |

---

## 🚀 Deployment Steps (TL;DR)

1. Publish contract: `sui client publish --gas-budget 10000000`
2. Copy Package ID
3. Set in .env.local: `VITE_PACKAGE_ID=0x...`
4. Test locally: `npm run dev`
5. Build: `npm run build`
6. Deploy frontend to Vercel
7. Done! 🎉

---

## 📚 Documentation Map

```
README.md (Start here!)
    ├── SETUP_GUIDE.md (Step-by-step setup)
    ├── DEPLOYMENT_GUIDE.md (Production deployment)
    ├── ENV_CONFIG.md (Environment variables)
    ├── COMPLETION_SUMMARY.md (Feature overview)
    ├── DEPLOYMENT_CHECKLIST.md (Before going live)
    └── QUICK_REFERENCE.md (This file)
```

---

## 💡 Pro Tips

✅ Always test on testnet before mainnet
✅ Save your Package ID in a safe place
✅ Check gas prices before transactions
✅ Monitor events in explorer
✅ Keep .env.local secret (it's in .gitignore)
✅ Use React Query for data fetching
✅ Test with 2+ wallets for completeness

---

## 🎓 Learning Resources

| Topic | Resource |
|-------|----------|
| Sui Basics | [Sui Docs](https://docs.sui.io) |
| Move Language | [Move Book](https://move-language.github.io/move/) |
| React + Web3 | [dApp Kit Docs](https://sdk.mysten.dev/dapp-kit) |
| Tailwind CSS | [Tailwind Docs](https://tailwindcss.com) |
| React Hooks | [React Docs](https://react.dev) |

---

## 🗓️ Typical Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Setup | 15 min | Install deps, deploy contract |
| Testing | 1-2 hrs | Test all features |
| Customization | 1-3 hrs | Update images, styling |
| Deployment | 30 min | Build and deploy frontend |
| Monitoring | Ongoing | Watch for issues |

---

**Last Updated:** December 26, 2025
**Version:** 1.0.0
**Status:** ✅ Ready to Use
