import { useState, useEffect, useRef } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import type { Provider as SolanaProvider } from '@reown/appkit-adapter-solana/react';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  PAYMENT_ETH_ADDRESS,
  PAYMENT_SOL_ADDRESS,
} from '../src/atoms/destination-address-atom';

const MINT_PRICE_ETH = '0.08';
const MINT_PRICE_SOL = 1.2;

type Status = 'idle' | 'pending' | 'success' | 'error';

interface Props {
  onMintSuccess?: () => void;
}

export const MintButton = ({ onMintSuccess }: Props) => {
  const { isConnected: ethConnected } = useAccount();
  const { caipAddress } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<SolanaProvider>('solana');
  const { sendTransaction } = useSendTransaction();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isSolana =
    typeof caipAddress === 'string' && caipAddress.startsWith('solana:');
  const isConnected = ethConnected || isSolana;

  const mintEth = async () => {
    setStatus('pending');
    setErrorMsg('');
    try {
      await sendTransaction(
        {
          to: PAYMENT_ETH_ADDRESS as `0x${string}`,
          value: parseEther(MINT_PRICE_ETH),
        },
        {
          onSuccess: () => {
            setStatus('success');
            onMintSuccess?.();
          },
          onError: (e: any) => {
            setStatus('error');
            setErrorMsg(e?.shortMessage || e?.message || 'Transaction failed');
          },
        },
      );
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.shortMessage || e?.message || 'Transaction failed');
    }
  };

  const mintSol = async () => {
    if (!walletProvider) return;
    setStatus('pending');
    setErrorMsg('');
    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      const pubkeyStr = (walletProvider as any).publicKey?.toString?.();
      if (!pubkeyStr) throw new Error('No public key');
      const pubkey = new PublicKey(pubkeyStr);
      const { blockhash } = await connection.getLatestBlockhash();
      const tx = new Transaction();
      tx.recentBlockhash = blockhash;
      tx.feePayer = pubkey;
      tx.add(
        SystemProgram.transfer({
          fromPubkey: pubkey,
          toPubkey: new PublicKey(PAYMENT_SOL_ADDRESS),
          lamports: Math.floor(MINT_PRICE_SOL * LAMPORTS_PER_SOL),
        }),
      );
      await (walletProvider as any).sendTransaction(tx, connection);
      setStatus('success');
      onMintSuccess?.();
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.message || 'Transaction failed');
    }
  };

  const handleMint = () => {
    if (isSolana) mintSol();
    else mintEth();
  };

  if (!isConnected) return null;

  if (status === 'success') {
    return (
      <div
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '14px',
          background: 'rgba(16,185,129,0.15)',
          border: '1px solid rgba(16,185,129,0.4)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '6px' }}>🎉</div>
        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '15px' }}>
          Mint Successful!
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>
          Your APEX Genesis pass is on its way
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button
        onClick={handleMint}
        disabled={status === 'pending'}
        className="mint-btn"
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '14px',
          border: 'none',
          background:
            status === 'pending'
              ? 'rgba(124,58,237,0.5)'
              : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #06b6d4 100%)',
          color: 'white',
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0.3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: status === 'pending' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'pending' ? (
          <>
            <span
              style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }}
            />
            Confirm in Wallet...
          </>
        ) : (
          <>
            ⚡ Mint Now —{' '}
            {isSolana ? `${MINT_PRICE_SOL} SOL` : `${MINT_PRICE_ETH} ETH`}
          </>
        )}
      </button>

      {status === 'error' && errorMsg && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            fontSize: '13px',
            textAlign: 'center',
          }}
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
};
