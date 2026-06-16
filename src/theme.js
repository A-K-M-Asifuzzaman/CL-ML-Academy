export const T = {
  bg:'#060b14', s1:'#0b1120', s2:'#0f1830', s3:'#162040', s4:'#1e2d50',
  bd:'#2a3a5c', bd2:'#1e2d50',
  t0:'#f0f6ff', t1:'#c8d6f0', t2:'#7a90b8', t3:'#4a5e88',
  cy:'#00e5ff', gn:'#00ffa3', pu:'#b388ff', or:'#ff9d00',
  rd:'#ff4f6d', ye:'#ffd600', pk:'#ff6eb4', bl:'#4db8ff',
  mg:'#e040fb', tl:'#00e5cc',
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
