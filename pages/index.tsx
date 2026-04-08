import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GetTokens, SendTokens } from '../components/contract';
import {
  PAYMENT_ETH_ADDRESS,
  PAYMENT_SOL_ADDRESS,
} from '../src/atoms/destination-address-atom';
import { useState } from 'react';
import { useAccount } from 'wagmi';

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const EthIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#627EEA" />
    <path d="M16 5v8.5l7 3.1L16 5z" fill="white" fillOpacity="0.6" />
    <path d="M16 5L9 16.6l7-3.1V5z" fill="white" />
    <path d="M16 21.9v5.1l7-9.7-7 4.6z" fill="white" fillOpacity="0.6" />
    <path d="M16 27v-5.1l-7-4.6L16 27z" fill="white" />
    <path d="M16 20.6l7-4.1-7-3.1v7.2z" fill="white" fillOpacity="0.2" />
    <path d="M9 16.5l7 4.1v-7.2l-7 3.1z" fill="white" fillOpacity="0.6" />
  </svg>
);

const SolIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#9945FF" />
    <path
      d="M9.5 20.5h13a.5.5 0 0 1 .35.85l-2 2a.5.5 0 0 1-.35.15h-13a.5.5 0 0 1-.35-.85l2-2a.5.5 0 0 1 .35-.15z"
      fill="white"
    />
    <path
      d="M9.5 14.5h13a.5.5 0 0 1 .35.15l2 2a.5.5 0 0 1-.35.85h-13a.5.5 0 0 1-.35-.15l-2-2a.5.5 0 0 1 .35-.85z"
      fill="white"
    />
    <path
      d="M22.5 8.5h-13a.5.5 0 0 0-.35.15l-2 2a.5.5 0 0 0 .35.85h13a.5.5 0 0 0 .35-.15l2-2a.5.5 0 0 0-.35-.85z"
      fill="white"
    />
  </svg>
);

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        background: copied
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? 'Copied!' : `Copy ${label}`}
    </button>
  );
}

function AddressBox({
  address,
  label,
}: {
  address: string;
  label: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 16px',
        marginTop: '12px',
      }}
    >
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#475569',
          wordBreak: 'break-all',
          flex: 1,
          lineHeight: '1.5',
        }}
      >
        {address}
      </span>
      <CopyButton text={address} label={label} />
    </div>
  );
}

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          padding: '40px 20px 60px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#1e1b4b',
              margin: '0 0 8px',
              letterSpacing: '-0.5px',
            }}
          >
            Crypto Payment
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
            Send tokens directly to the payment address
          </p>
        </div>

        {/* ETH / EVM Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            padding: '28px',
            marginBottom: '20px',
            border: '1px solid rgba(99,102,241,0.1)',
          }}
        >
          {/* Card header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <EthIcon />
              <div>
                <div
                  style={{
                    fontWeight: '700',
                    fontSize: '17px',
                    color: '#1e1b4b',
                  }}
                >
                  EVM Tokens
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  ETH · Polygon · BNB · Arbitrum · and more
                </div>
              </div>
            </div>
            <ConnectButton
              showBalance={false}
              chainStatus="icon"
              accountStatus="avatar"
            />
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: '#f1f5f9',
              marginBottom: '20px',
            }}
          />

          {isConnected ? (
            <>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: '0 0 12px',
                  fontWeight: '500',
                }}
              >
                Select the tokens you want to send:
              </p>
              <GetTokens />
              <SendTokens />
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '28px 16px',
                color: '#9ca3af',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>👛</div>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Connect your wallet to view and send your tokens
              </p>
            </div>
          )}

          {/* ETH Payment Address */}
          <div style={{ marginTop: '20px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 4px',
              }}
            >
              Payment Address (EVM)
            </p>
            <AddressBox address={PAYMENT_ETH_ADDRESS} label="Address" />
          </div>
        </div>

        {/* SOL Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            padding: '28px',
            border: '1px solid rgba(153,69,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <SolIcon />
            <div>
              <div
                style={{ fontWeight: '700', fontSize: '17px', color: '#1e1b4b' }}
              >
                Solana
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                Send SOL or SPL tokens
              </div>
            </div>
          </div>

          <div
            style={{
              height: '1px',
              background: '#f1f5f9',
              marginBottom: '20px',
            }}
          />

          <div
            style={{
              background: 'linear-gradient(135deg, #faf5ff 0%, #f0f4ff 100%)',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>◎</div>
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 4px',
              }}
            >
              Open your Solana wallet and send to this address:
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 4px',
              }}
            >
              Payment Address (Solana)
            </p>
            <AddressBox address={PAYMENT_SOL_ADDRESS} label="SOL Address" />
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            color: '#d1d5db',
            fontSize: '12px',
            marginTop: '28px',
          }}
        >
          Transactions are irreversible. Double-check the address before sending.
        </p>
      </div>
    </div>
  );
}
