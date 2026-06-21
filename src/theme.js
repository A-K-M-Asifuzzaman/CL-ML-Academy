export const T = {
  // Clean neutral "zinc" dark base — modern SaaS (Linear / Vercel / shadcn)
  bg:'#09090b', s1:'#101012', s2:'#161618', s3:'#202023', s4:'#2a2a2e',
  bd:'#27272a', bd2:'#1b1b1e',
  // High-contrast, readable neutral text ramp
  t0:'#fafafa', t1:'#d4d4d8', t2:'#a1a1aa', t3:'#71717a',
  // Refined, restrained accent set (sky primary)
  cy:'#38bdf8', gn:'#4ade80', pu:'#a78bfa', or:'#fb923c',
  rd:'#f87171', ye:'#facc15', pk:'#f472b6', bl:'#60a5fa',
  mg:'#c084fc', tl:'#2dd4bf',
};

export const CAT_COLORS = {
  dsa: T.cy, algo: T.gn, ds: T.pu, complex: T.ye,
  sys: T.or, net: T.bl, db: T.pk, math: T.tl,
  ml: T.rd, dl: T.mg, nlp: '#ff9d40', cv: '#39ff9a', mlops: '#00ffd0',
};

export const shadow = (color, size = 8) =>
  `0 0 ${size}px ${color}80`;

export const glassBg = (color, alpha = 0.08) =>
  `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
