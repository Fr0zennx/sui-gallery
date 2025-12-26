# Deployment Guide - Car NFT Marketplace

## Prerequisites

- Sui CLI installed ([Guide](https://docs.sui.io/guides/developer/getting-started/sui-install))
- Sui wallet with testnet SUI (request from [faucet](https://discord.gg/sui))
- Node.js 18+
- Git

## Phase 1: Smart Contract Deployment

### 1. Publish to Testnet

```bash
cd "c:\Users\burak\Desktop\projects\speedrun-sui-projeleri\Sui Gallery"

sui client publish --gas-budget 10000000
```

**Expected Output:**
```
Compiling car_market v0.1.0 ...
Including dependency Sui
Compiling dependency Sui
...
Created Objects:
  - ID: 0x... , Type: 0x2::package::Package
  - ID: 0x... , Type: 0x2::package::UpgradeCap
  - ID: 0x... , Type: car_market::nft_shop::Listing (Shared)
...
Transaction Digest: 0x...
Package ID: 0x0123456789abcdef...
```

**Save the Package ID** - You'll need it for the frontend.

### 2. Verify Contract on Explorer

Visit: https://testnet.suiscan.xyz/
Search for your Package ID to verify publication.

---

## Phase 2: Frontend Development Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local`:
```bash
VITE_PACKAGE_ID=0x0123456789abcdef...  # Your Package ID from Phase 1
VITE_NETWORK=testnet
```

Or edit `src/App.tsx` line 21:
```typescript
const PACKAGE_ID = '0x0123456789abcdef...'
```

### 3. Test Locally

```bash
npm run dev
```

Access at: http://localhost:5173

---

## Phase 3: Frontend Deployment (Vercel)

### 1. Create GitHub Repository

```bash
cd "..\.."
git init
git add .
git commit -m "Initial commit: Sui Car NFT Marketplace"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/car-nft-marketplace.git
git push -u origin main
```

### 2. Deploy to Vercel

Visit: https://vercel.com/new

1. Connect GitHub account
2. Select your repository
3. Framework: Vite
4. Environment Variables:
   ```
   VITE_PACKAGE_ID=0x0123456789abcdef...
   VITE_NETWORK=testnet
   ```
5. Click Deploy

### 3. Custom Domain (Optional)

In Vercel dashboard:
- Go to Settings → Domains
- Add your custom domain
- Update DNS records

---

## Phase 4: Production Network (Mainnet)

### 1. Update Contract Package ID

After publishing to mainnet, update:

```typescript
// src/App.tsx
const PACKAGE_ID = 'YOUR_MAINNET_PACKAGE_ID'
```

Update environment:
```
VITE_PACKAGE_ID=0xMAINNET_PACKAGE_ID
VITE_NETWORK=mainnet
```

### 2. Update main.tsx Network

```typescript
// src/main.tsx
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
}

// Change default from 'testnet' to 'mainnet'
<SuiClientProvider networks={networks} defaultNetwork="mainnet">
```

### 3. Rebuild and Deploy

```bash
npm run build
# Push to GitHub
git add .
git commit -m "Switch to mainnet"
git push
# Vercel will auto-deploy
```

---

## Testing Checklist

### Mint Functionality
- [ ] Connect wallet
- [ ] Select car model
- [ ] Enter valid car name
- [ ] Enter speed 1-100
- [ ] Successfully mint NFT
- [ ] NFT appears in My Garage
- [ ] Event logged in contract

### Listing Functionality
- [ ] View NFT in My Garage
- [ ] Enter valid price
- [ ] Successfully list for sale
- [ ] Listing appears in Marketplace
- [ ] Can see NFT details (name, speed)

### Purchase Functionality
- [ ] View listing in Marketplace
- [ ] Have sufficient SUI balance
- [ ] Click "Buy Now"
- [ ] Transaction succeeds
- [ ] NFT transferred to buyer
- [ ] Payment sent to seller

### Error Handling
- [ ] Invalid image ID rejected
- [ ] Invalid speed (>100) rejected
- [ ] Insufficient funds error shown
- [ ] Disconnected wallet handled gracefully

---

## Performance Optimization

### 1. Image Optimization

Replace placeholder emojis with actual car images:

```typescript
// src/App.tsx
const carModels: CarModel[] = [
  {
    id: 1,
    name: 'Red Speedster',
    imageUrl: 'https://your-cdn.com/car-red.png',  // Your CDN
  },
  // ...
]
```

### 2. Gas Optimization

For production, adjust in Move contract:
- Batch multiple mints to save gas
- Implement Dutch auction for listings

### 3. Caching

Increase React Query cache time:

```typescript
// src/components/Marketplace.tsx
queryKey: ['listings', packageId],
queryFn: async () => { /* ... */ },
staleTime: 30000,  // 30 seconds
cacheTime: 60000,  // 1 minute
```

---

## Troubleshooting Deployment

### Issue: Package not found
```
Error: Package with ID 0x... not found
```
**Solution:** Verify Package ID is correct and contract published successfully

### Issue: Insufficient gas
```
Error: Gas budget exceeded
```
**Solution:** Increase `--gas-budget` value:
```bash
sui client publish --gas-budget 50000000
```

### Issue: Frontend can't reach contract
```
Error: Failed to fetch object
```
**Solution:**
1. Verify Package ID in env vars
2. Check network is correct (testnet vs mainnet)
3. Ensure wallet is on same network

### Issue: Transaction timeout
```
Error: Transaction not finalized
```
**Solution:** Increase RPC timeout or check network status

---

## Monitoring & Analytics

### Enable Analytics

Add to `src/main.tsx`:
```typescript
import { analytics } from './utils/analytics'

analytics.init('YOUR_TRACKING_ID')
```

### Monitor Contract Events

Subscribe to contract events:
```typescript
// View events in Sui Explorer
https://testnet.suiscan.xyz/?query=tx[YOUR_TX_DIGEST]
```

---

## Maintenance

### Regular Updates

1. **Update Dependencies**
   ```bash
   npm update
   npm audit
   ```

2. **Monitor Gas Fees**
   - Optimize contract if gas costs too high

3. **Check Listings Expiry**
   - Implement listing expiration mechanism

4. **Backup Strategy**
   - Regularly commit to GitHub
   - Document any contract upgrades

---

## Support & Resources

- **Sui Docs:** https://docs.sui.io
- **Explorer:** https://testnet.suiscan.xyz
- **Discord:** https://discord.gg/sui
- **Twitter:** @SuiNetwork

---

## Security Checklist

- [ ] Package ID not exposed in client code
- [ ] Use HTTPS for production
- [ ] Validate all user inputs
- [ ] Test with various wallet providers
- [ ] Review Move contract for vulnerabilities
- [ ] Implement rate limiting on backend (if added)
- [ ] Regular security audits

---

Deployment Complete! 🎉
