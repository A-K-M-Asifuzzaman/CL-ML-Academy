export const T = {
  // Aura — cinematic near-black glass base
  bg:'#0c0c0c', s1:'#101012', s2:'#161618', s3:'#202023', s4:'#2a2a2e',
  bd:'#27272a', bd2:'#1b1b1e',
  // High-contrast, readable neutral text ramp
  t0:'#fafafa', t1:'#d4d4d8', t2:'#a1a1aa', t3:'#71717a',
  // Aura accent set — electric cyan primary, brand blue, icy highlight, deep navies
  cy:'#00d2ff', gn:'#10b981', pu:'#a78bfa', or:'#f59e0b',
  rd:'#f87171', ye:'#facc15', pk:'#f472b6', bl:'#3D81E3',
  mg:'#c084fc', tl:'#A4F4FD',
  nv:'#0B2551', ink:'#091020', brand:'#3D81E3',
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
