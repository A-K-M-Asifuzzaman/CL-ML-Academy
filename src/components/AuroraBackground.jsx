import { T } from '../theme.js';

/**
 * Clean, restrained backdrop (modern SaaS style):
 *  - one very faint accent glow at the top
 *  - a subtle dot grid that fades out
 * No moving neon blobs — quiet and premium, content stays the focus.
 */
export default function AuroraBackground() {
  return (
    <>
      {/* Soft top glow */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(60% 40% at 50% -10%, ${T.cy}10, transparent 70%), radial-gradient(50% 35% at 85% 5%, ${T.pu}0a, transparent 70%)`,
      }} />
      {/* Faint dot grid */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.5,
        backgroundImage: `radial-gradient(${T.bd} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, #000 20%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, #000 20%, transparent 75%)',
      }} />
    </>
  );
}
