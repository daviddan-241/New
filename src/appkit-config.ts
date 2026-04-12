import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, polygon, bsc, arbitrum, optimism, base } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit';

const projectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'placeholder-project-id';

const networks = [mainnet, polygon, bsc, arbitrum, optimism, base] as const;

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: 'dark',
});
