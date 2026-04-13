import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAppKitAccount } from '@reown/appkit/react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { label?: string; balance?: 'show' | 'hide'; size?: string };
    }
  }
}

const MintButton = dynamic(
  () => import('../components/MintButton').then((m) => m.MintButton),
  { ssr: false },
);

const TOTAL_SUPPLY = 8888;
const MINTED_COUNT = 5241;
const MINT_PRICE_ETH = '0.08';
const MINT_PRICE_SOL = '1.2';

const NftArt = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      paddingBottom: '100%',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 0 60px rgba(124,58,237,0.4), 0 0 120px rgba(6,182,212,0.15)',
      animation: 'float 6s ease-in-out infinite',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(135deg, #0d0520 0%, #0a0a1e 40%, #0d1520 100%)',
      }}
    />
    {/* Animated orbs */}
    <div
      style={{
        position: 'absolute',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)',
        top: '-60px',
        left: '-60px',
        animation: 'orb-move 8s ease-in-out infinite',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)',
        bottom: '-40px',
        right: '-40px',
        animation: 'orb-move 10s ease-in-out infinite reverse',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        animation: 'orb-move 12s ease-in-out infinite 2s',
      }}
    />
    {/* Hexagon grid */}
    <svg
      viewBox="0 0 400 400"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }}
    >
      <defs>
        <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon
            points="30,2 58,17 58,47 30,62 2,47 2,17"
            fill="none"
            stroke="rgba(124,58,237,0.8)"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#hex)" />
    </svg>
    {/* Center logo */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '30px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(6,182,212,0.8))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(6,182,212,0.3)',
          animation: 'pulse-glow 3s ease-in-out infinite',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <span style={{ fontSize: '52px', lineHeight: 1 }}>⬡</span>
      </div>
    </div>
    {/* Scanline effect */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
        pointerEvents: 'none',
      }}
    />
    {/* Bottom label */}
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          APEX Genesis
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>#???</div>
      </div>
      <div
        style={{
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(124,58,237,0.4)',
          border: '1px solid rgba(124,58,237,0.6)',
          fontSize: '11px',
          color: '#c4b5fd',
          fontWeight: 600,
        }}
      >
        LIVE
      </div>
    </div>
  </div>
);

const StatCard = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) => (
  <div
    className="card-hover"
    style={{
      flex: '1 1 140px',
      padding: '20px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        fontSize: '22px',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #a78bfa, #67e8f9)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '4px',
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
      {label}
    </div>
    {sub && (
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
        {sub}
      </div>
    )}
  </div>
);

export default function Home() {
  const { isConnected: ethConnected } = useAccount();
  const { caipAddress } = useAppKitAccount();
  const [mintCount, setMintCount] = useState(MINTED_COUNT);
  const isSolana =
    typeof caipAddress === 'string' && caipAddress.startsWith('solana:');
  const isConnected = ethConnected || isSolana;

  const progressPct = Math.round((mintCount / TOTAL_SUPPLY) * 100);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#030712',
        color: 'white',
      }}
    >
      {/* ── Nav ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(3,7,18,0.8)',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
            }}
          >
            ⬡
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '18px',
              letterSpacing: '-0.3px',
              background: 'linear-gradient(135deg, #a78bfa, #67e8f9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            APEX
          </span>
        </div>

        {/* Links – hidden on mobile */}
        <div
          className="nav-links"
          style={{ display: 'flex', gap: '28px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}
        >
          {['About', 'Roadmap', 'FAQ'].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{ transition: 'color 0.2s' }}
              onMouseEnter={(e) => ((e.target as any).style.color = 'white')}
              onMouseLeave={(e) =>
                ((e.target as any).style.color = 'rgba(255,255,255,0.5)')
              }
            >
              {l}
            </a>
          ))}
        </div>

        {/* Wallet button */}
        <appkit-button label="Connect Wallet" balance="hide" size="sm" />
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '60px 24px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        {/* NFT Art */}
        <div style={{ maxWidth: '460px', margin: '0 auto', width: '100%' }}>
          <NftArt />
        </div>

        {/* Mint Panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Badge */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(124,58,237,0.2)',
                border: '1px solid rgba(124,58,237,0.4)',
                fontSize: '12px',
                color: '#a78bfa',
                fontWeight: 600,
              }}
            >
              🔥 LIVE MINT
            </span>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.3)',
                fontSize: '12px',
                color: '#67e8f9',
                fontWeight: 600,
              }}
            >
              ETH + SOL
            </span>
          </div>

          {/* Title */}
          <div>
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-1px',
                marginBottom: '12px',
              }}
            >
              APEX{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #67e8f9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Genesis
              </span>
            </h1>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '15px',
                lineHeight: 1.7,
                maxWidth: '420px',
              }}
            >
              8,888 unique generative passes granting lifetime access to the APEX
              ecosystem — exclusive drops, alpha channels, and on-chain governance.
            </p>
          </div>

          {/* Mint card */}
          <div
            style={{
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Price row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  Mint Price
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>
                  {MINT_PRICE_ETH} ETH{' '}
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>
                    / {MINT_PRICE_SOL} SOL
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  Remaining
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>
                  {(TOTAL_SUPPLY - mintCount).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '8px',
                }}
              >
                <span>{mintCount.toLocaleString()} minted</span>
                <span>{progressPct}%</span>
              </div>
              <div
                style={{
                  height: '8px',
                  borderRadius: '99px',
                  background: 'rgba(255,255,255,0.07)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    borderRadius: '99px',
                    background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.25)',
                  marginTop: '6px',
                }}
              >
                {TOTAL_SUPPLY.toLocaleString()} total supply
              </div>
            </div>

            {/* Traits row */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {['Max 5 / wallet', 'ERC-721A', 'On-chain metadata'].map((t) => (
                <span
                  key={t}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTA */}
            {isConnected ? (
              <MintButton onMintSuccess={() => setMintCount((c) => c + 1)} />
            ) : (
              <div style={{ width: '100%' }}>
                <appkit-button label="Connect Wallet to Mint" balance="hide" />
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.25)',
                    marginTop: '10px',
                  }}
                >
                  Supports MetaMask, Coinbase, Phantom, Solflare & 300+ wallets
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px 60px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <StatCard label="Floor Price" value="0.24 ETH" sub="↑ 12% today" />
          <StatCard label="Total Volume" value="1,841 ETH" />
          <StatCard label="Unique Holders" value="3,209" />
          <StatCard label="Listed" value="8.4%" sub="of supply" />
        </div>
      </section>

      {/* ── About ── */}
      <section
        id="about"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '80px 24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
          }}
        >
          {[
            {
              icon: '🔐',
              title: 'Exclusive Access',
              desc: 'Every APEX Genesis pass grants lifetime access to private alpha groups, early mint allowlists, and token-gated community events.',
            },
            {
              icon: '⚡',
              title: 'On-Chain Governance',
              desc: 'Holders vote on treasury allocations, future collection directions, and protocol upgrades through our decentralized DAO.',
            },
            {
              icon: '🌐',
              title: 'Cross-Chain',
              desc: 'APEX Genesis supports both EVM chains and Solana, with bridges planned for seamless multi-chain asset movement.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="card-hover"
              style={{
                padding: '28px',
                borderRadius: '18px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '14px' }}>{item.icon}</div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.7 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section
        id="roadmap"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 800,
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            Roadmap
          </h2>
          {[
            { phase: 'Phase 1', title: 'Genesis Mint', status: 'active', items: ['8,888 passes minted', 'Holder snapshot', 'Private Discord unlock'] },
            { phase: 'Phase 2', title: 'Ecosystem Launch', status: 'upcoming', items: ['DAO governance live', 'Token airdrop to holders', 'Partner collection collab'] },
            { phase: 'Phase 3', title: 'Cross-Chain Expansion', status: 'upcoming', items: ['Solana bridge deploy', 'Mobile app beta', 'On-chain generative art upgrade'] },
          ].map((r, i) => (
            <div
              key={r.phase}
              style={{
                display: 'flex',
                gap: '20px',
                marginBottom: i < 2 ? '32px' : 0,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background:
                      r.status === 'active'
                        ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                        : 'rgba(255,255,255,0.1)',
                    border: r.status === 'active' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    flexShrink: 0,
                    boxShadow:
                      r.status === 'active'
                        ? '0 0 20px rgba(124,58,237,0.5)'
                        : 'none',
                  }}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    style={{
                      width: '1px',
                      flex: 1,
                      background: 'rgba(255,255,255,0.08)',
                      marginTop: '8px',
                      minHeight: '32px',
                    }}
                  />
                )}
              </div>
              <div style={{ paddingTop: '4px', flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>
                  {r.phase}
                </div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>
                  {r.title}
                  {r.status === 'active' && (
                    <span
                      style={{
                        marginLeft: '10px',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        background: 'rgba(16,185,129,0.2)',
                        border: '1px solid rgba(16,185,129,0.4)',
                        fontSize: '11px',
                        color: '#34d399',
                        fontWeight: 600,
                      }}
                    >
                      Active
                    </span>
                  )}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {r.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: r.status === 'active' ? '#a78bfa' : 'rgba(255,255,255,0.2)' }}>
                        {r.status === 'active' ? '✓' : '○'}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '80px 24px',
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 800,
            marginBottom: '36px',
            textAlign: 'center',
          }}
        >
          FAQ
        </h2>
        {[
          { q: 'What blockchain is APEX Genesis on?', a: 'APEX Genesis is a cross-chain collection supporting Ethereum (EVM) and Solana. You can mint with any major wallet on either network.' },
          { q: 'How many can I mint per wallet?', a: 'Each wallet can mint up to 5 APEX Genesis passes during the public sale.' },
          { q: 'What wallets are supported?', a: 'We support 300+ wallets including MetaMask, Coinbase Wallet, Rainbow, Phantom, Solflare, Trust Wallet, and more via WalletConnect.' },
          { q: 'When do I receive my NFT?', a: 'Your APEX Genesis pass is delivered to your wallet immediately after the transaction is confirmed on-chain.' },
        ].map((item) => (
          <details
            key={item.q}
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '20px 0',
            }}
          >
            <summary
              style={{
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.85)',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {item.q}
              <span style={{ color: '#a78bfa', flexShrink: 0 }}>+</span>
            </summary>
            <p
              style={{
                marginTop: '12px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7,
              }}
            >
              {item.a}
            </p>
          </details>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '32px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>⬡</span>
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'rgba(255,255,255,0.6)' }}>
            APEX Genesis
          </span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Twitter', 'Discord', 'OpenSea'].map((s) => (
            <a
              key={s}
              href="#"
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.3)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as any).style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={(e) => ((e.target as any).style.color = 'rgba(255,255,255,0.3)')}
            >
              {s}
            </a>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
          © 2024 APEX Genesis. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
