# Environment Configuration Examples

## Option 1: Environment Variables (.env.local)

Create `frontend/.env.local`:

```env
# Sui Package Configuration
VITE_PACKAGE_ID=0x0123456789abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Network Selection: testnet or mainnet
VITE_NETWORK=testnet

# Optional: Custom RPC URL (defaults to public Sui RPC)
# VITE_RPC_URL=https://fullnode.testnet.sui.io:443
```

---

## Option 2: Direct Code Configuration

Edit `frontend/src/App.tsx`:

```typescript
// Line 21 - Update this constant with your Package ID
const PACKAGE_ID = '0x0123456789abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
```

Edit `frontend/src/main.tsx`:

```typescript
// Change the defaultNetwork parameter
<SuiClientProvider networks={networks} defaultNetwork="testnet">
  {/* Change "testnet" to "mainnet" for production */}
</SuiClientProvider>
```

---

## Option 3: Getting Your Package ID

### After Publishing to Testnet

Run:
```bash
sui client publish --gas-budget 10000000
```

Output will contain:
```
Package ID: 0x0123456789abcdef...
```

Copy this value to your configuration.

### Verify on Explorer

Visit: https://testnet.suiscan.xyz/
Search for your Package ID to confirm deployment.

---

## Network Configuration

### Testnet
```env
VITE_NETWORK=testnet
VITE_PACKAGE_ID=0xYOUR_TESTNET_PACKAGE_ID
```

- Used for development and testing
- Free SUI from [faucet](https://discord.gg/sui)
- Full feature parity with mainnet
- Recommended for initial deployment

### Mainnet
```env
VITE_NETWORK=mainnet
VITE_PACKAGE_ID=0xYOUR_MAINNET_PACKAGE_ID
```

- Production network
- Real SUI required
- Deploy after testing thoroughly
- Update before going live

---

## Vercel Deployment Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
VITE_PACKAGE_ID=0x0123456789abcdef...
VITE_NETWORK=testnet
```

---

## Example: Complete .env.local

```env
# ==========================================
# Sui Car NFT Marketplace Configuration
# ==========================================

# Contract Package ID (REQUIRED)
# Get this from: sui client publish
# Example: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
VITE_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE

# Network Configuration (testnet or mainnet)
# Use testnet for development
# Use mainnet for production
VITE_NETWORK=testnet

# RPC Endpoint (Optional - uses default if not set)
# Testnet RPC: https://fullnode.testnet.sui.io:443
# Mainnet RPC: https://fullnode.mainnet.sui.io:443
# VITE_RPC_URL=https://fullnode.testnet.sui.io:443

# ==========================================
# End Configuration
# ==========================================
```

---

## Troubleshooting Configuration

### Issue: "Package not found" Error
**Check:**
1. Package ID format (should be 66 hex characters)
2. Contract published successfully
3. Network matches (testnet vs mainnet)
4. Package ID not wrapped in quotes

### Issue: Wallet on Wrong Network
**Solution:**
1. Match VITE_NETWORK to your wallet's network
2. Switch wallet to testnet if VITE_NETWORK=testnet
3. Or update VITE_NETWORK to mainnet if wallet is on mainnet

### Issue: Environment Variables Not Loading
**Solution:**
1. Ensure file is named `.env.local` (not .env)
2. Restart dev server after creating .env.local
3. Check for typos in variable names

---

## Testing Configuration

### Local Test Configuration
```env
VITE_PACKAGE_ID=0x[YOUR_LOCAL_TESTNET_PACKAGE_ID]
VITE_NETWORK=testnet
```

### Staging Configuration
```env
VITE_PACKAGE_ID=0x[YOUR_STAGING_PACKAGE_ID]
VITE_NETWORK=testnet
```

### Production Configuration
```env
VITE_PACKAGE_ID=0x[YOUR_MAINNET_PACKAGE_ID]
VITE_NETWORK=mainnet
```

---

## Environment Variable Security

⚠️ **Important:**
- `.env.local` is in .gitignore (not committed)
- Never commit real Package IDs to public repos
- Use .env.example for templates
- Rotate credentials if exposed

---

## Next Steps

1. Create your `.env.local` file
2. Fill in your Package ID
3. Select appropriate network
4. Start development server: `npm run dev`
5. Verify configuration works
6. Update for production deployment

---

For more details, see:
- [SETUP_GUIDE.md](SETUP_GUIDE.md)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
