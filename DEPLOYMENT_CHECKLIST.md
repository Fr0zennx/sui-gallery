# Deployment Checklist

Use this checklist to ensure everything is ready before going live.

## Pre-Deployment (Local Testing)

### Smart Contract Setup
- [ ] Sui CLI installed and working
- [ ] `sui client` can connect to network
- [ ] Wallet has testnet SUI tokens
- [ ] Can run: `sui client publish --gas-budget 10000000`
- [ ] Contract compiles without errors
- [ ] Move.toml has correct package name

### Contract Features
- [ ] Can mint NFTs successfully
- [ ] Mint fails with invalid speed (>100)
- [ ] Mint fails with invalid image_id
- [ ] Can list NFTs for sale
- [ ] Can purchase from marketplace
- [ ] Payment transfers to seller correctly
- [ ] NFT transfers to buyer correctly
- [ ] Events emit properly

### Frontend Setup
- [ ] Node.js 18+ installed
- [ ] npm install completes without errors
- [ ] All dependencies resolve correctly
- [ ] TypeScript compiles without errors
- [ ] No missing imports or unused variables

### Frontend Features
- [ ] Wallet connects successfully
- [ ] Can select car model
- [ ] Can mint NFT (requires contract deployment)
- [ ] Can view NFT in My Garage
- [ ] Can list NFT for sale
- [ ] Can view listings in Marketplace
- [ ] Can purchase NFT
- [ ] Error messages display properly
- [ ] Loading states work correctly
- [ ] Mobile responsive design works

### Configuration
- [ ] Package ID correctly set in .env.local
- [ ] Network set to testnet
- [ ] Can access http://localhost:5173
- [ ] Console shows no errors
- [ ] All network requests succeed

### Testing Workflow
- [ ] [ ] Mint → Appears in garage
- [ ] [ ] List → Appears in marketplace
- [ ] [ ] Purchase → Transfers complete
- [ ] [ ] Events logged correctly
- [ ] [ ] Can repeat multiple times

---

## Testnet Deployment

### Contract Deployment
- [ ] Contract publishes to testnet
- [ ] Capture and save Package ID
- [ ] Verify on Sui Explorer (testnet.suiscan.xyz)
- [ ] Can see Package object
- [ ] Can see published modules

### Frontend Configuration
- [ ] Update .env.local with Package ID
- [ ] Restart dev server (npm run dev)
- [ ] No console errors on page load
- [ ] Wallet connects to testnet
- [ ] Can mint NFT successfully

### Testnet Testing
- [ ] Complete mint workflow
- [ ] Complete sell workflow
- [ ] Complete purchase workflow
- [ ] Test with 2+ wallets if possible
- [ ] Test error scenarios
- [ ] Check Sui Explorer for events
- [ ] Monitor gas usage

---

## Frontend Production Build

### Build Preparation
- [ ] No console errors or warnings
- [ ] All environment variables set
- [ ] Package ID is correct
- [ ] Network is correct (testnet or mainnet)
- [ ] .gitignore includes .env.local

### Build Process
- [ ] Run: `npm run build`
- [ ] Build completes without errors
- [ ] dist/ folder generated
- [ ] dist/index.html exists
- [ ] All assets included in dist/

### Build Verification
- [ ] Run: `npm run preview`
- [ ] Open localhost:4173
- [ ] All features work as expected
- [ ] No errors in console
- [ ] Responsive design works

---

## Mainnet Preparation (Optional)

### Before Publishing Contract to Mainnet
- [ ] Thoroughly tested on testnet
- [ ] All features working correctly
- [ ] No known bugs or issues
- [ ] Have mainnet SUI for gas
- [ ] Consider contract audit (if high value)

### Mainnet Configuration
- [ ] Deploy contract to mainnet
- [ ] Update Package ID for mainnet
- [ ] Update VITE_NETWORK=mainnet
- [ ] Update network setting in code
- [ ] Update database/backend if any

### Mainnet Testing
- [ ] Test with small transactions first
- [ ] Monitor gas prices
- [ ] Verify all features work
- [ ] Check events on mainnet explorer
- [ ] Monitor for issues

---

## Vercel Deployment (Recommended)

### Prerequisites
- [ ] GitHub account
- [ ] Vercel account
- [ ] Repository pushed to GitHub

### Setup
- [ ] Create GitHub repository
- [ ] Push code to main branch
- [ ] Login to Vercel
- [ ] Connect GitHub account
- [ ] Select repository

### Configuration
- [ ] Set Build Command: `npm run build`
- [ ] Set Output Directory: `dist`
- [ ] Add Environment Variables:
  - [ ] VITE_PACKAGE_ID
  - [ ] VITE_NETWORK
- [ ] Review & Deploy

### Post-Deployment
- [ ] Deployment succeeds without errors
- [ ] Preview link works
- [ ] All features function on Vercel
- [ ] No console errors
- [ ] Responsive design works

### Custom Domain (Optional)
- [ ] Domain registered and configured
- [ ] DNS records updated
- [ ] SSL certificate issued
- [ ] HTTPS working
- [ ] Redirects configured

---

## Security Checklist

### Code Security
- [ ] No private keys in code
- [ ] No sensitive data in .env.example
- [ ] .env.local in .gitignore
- [ ] No hardcoded URLs (use env vars)
- [ ] Input validation on frontend
- [ ] Error messages don't leak info

### Contract Security
- [ ] Speed validation enforced
- [ ] Image ID validation enforced
- [ ] Payment verification required
- [ ] Proper error codes
- [ ] No arithmetic overflow risks
- [ ] Escrow pattern used correctly

### Infrastructure Security
- [ ] HTTPS enforced
- [ ] No console.log with sensitive data
- [ ] CSP headers configured
- [ ] CORS properly configured
- [ ] Rate limiting (if backend added)

---

## Documentation

- [ ] README.md is complete
- [ ] SETUP_GUIDE.md is current
- [ ] DEPLOYMENT_GUIDE.md reviewed
- [ ] ENV_CONFIG.md is accurate
- [ ] Comments in code are helpful
- [ ] No broken documentation links

---

## Performance & Optimization

### Frontend
- [ ] Lighthouse score > 80
- [ ] Page load time < 3 seconds
- [ ] Mobile performance acceptable
- [ ] No unused dependencies
- [ ] Images optimized
- [ ] Code splitting implemented

### Smart Contract
- [ ] No inefficient loops
- [ ] Minimal storage operations
- [ ] Gas costs reasonable
- [ ] No unnecessary function calls
- [ ] Event data not excessive

---

## Monitoring & Maintenance

### Post-Launch Monitoring
- [ ] Monitor error logs
- [ ] Track user feedback
- [ ] Monitor gas prices
- [ ] Check network status
- [ ] Monitor wallet connections

### Maintenance Schedule
- [ ] Weekly: Check for errors
- [ ] Weekly: Review transactions
- [ ] Monthly: Update dependencies
- [ ] Monthly: Security audit
- [ ] Quarterly: Performance review

---

## Final Sign-Off

### Before Going Live
- [ ] All testing complete
- [ ] All documentation ready
- [ ] Team agreement to deploy
- [ ] Backup of sensitive data
- [ ] Rollback plan prepared
- [ ] Support contacts established

### Launch
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Announce publicly (optional)
- [ ] Gather user feedback
- [ ] Plan improvements

### Post-Launch (24 Hours)
- [ ] No critical issues reported
- [ ] Transactions processing normally
- [ ] Events logging correctly
- [ ] Users can mint/sell/purchase
- [ ] No major bugs discovered

---

## Known Issues & Workarounds

| Issue | Status | Workaround |
|-------|--------|-----------|
| [Add if any] | Pending | [Add workaround] |

---

## Contacts & Resources

**Internal**
- Dev Lead: [Name]
- QA Lead: [Name]
- Ops Lead: [Name]

**External**
- Sui Discord: https://discord.gg/sui
- Sui Docs: https://docs.sui.io
- Support Email: [Add if any]

---

## Deployment Log

| Date | Version | Network | Status | Notes |
|------|---------|---------|--------|-------|
| 2025-12-26 | 1.0.0 | Testnet | ✅ Ready | Initial setup complete |
| | | Mainnet | ⏳ Pending | After testnet validation |

---

**Last Updated:** December 26, 2025
**Status:** Ready for Deployment ✅
