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
          <title>Pay</title>
          <meta name="description" content="Crypto payment" />
          <link rel="icon" href="/favicon.ico" />
        </NextHead>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
