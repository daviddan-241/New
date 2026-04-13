import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import '../styles/globals.css';
import '../src/appkit-config';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiAdapter } from '../src/appkit-config';
import { useIsMounted } from '../hooks';

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();
  if (!isMounted) return null;
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <NextHead>
          <title>APEX Genesis — NFT + Token Mint</title>
          <meta name="description" content="Mint APEX Genesis passes — NFTs bundled with exclusive $APEX tokens. Limited 8,888 supply across ETH and Solana." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content="APEX Genesis Mint" />
          <meta property="og:description" content="8,888 unique NFT passes with token bundles. Live mint on ETH + Solana." />
          <link rel="icon" href="/favicon.ico" />
        </NextHead>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
