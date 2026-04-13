import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  bsc,
  gnosis,
  solana,
} from '@reown/appkit/networks';
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

export const networks = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  bsc,
  gnosis,
  solana,
] as const;

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

const solanaAdapter = new SolanaAdapter({ wallets: [] });

createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks,
  projectId,
  metadata: {
    name: 'APEX Genesis',
    description: 'Mint your APEX Genesis pass — 8,888 unique cross-chain NFTs',
    url:
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://apexgenesis.xyz',
    icons: ['/favicon.ico'],
  },
  features: {
    analytics: false,
    email: false,
    socials: [],
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7c3aed',
    '--w3m-border-radius-master': '14px',
  },
});
