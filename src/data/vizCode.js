/* ════════════════════════════════════════════════════════════════════════
   SYNCED VISUALIZER CODE
   For each algorithm a short reference implementation (`code`) plus a
   `lineOf(state)` mapper that returns the 0-based line index currently
   "executing" for the live simulation step. This drives the line-by-line
   highlight next to every animation. Return -1 for no active line.
════════════════════════════════════════════════════════════════════════ */

const has = (v) => v !== undefined && v !== null;

export const VIZ_CODE = {
  // ── SORTING ────────────────────────────────────────────────────────────
  bubble: {
    title: 'Bubble Sort',
    code: [
      'for (let i = 0; i < n - 1; i++) {',
      '  for (let j = 0; j < n - i - 1; j++) {',
      '    if (a[j] > a[j + 1]) {',
      '      swap(a[j], a[j + 1]);',
      '    }',
      '  }',
      '}',
      'return a;',
    ],
    lineOf: (s) => (s.done ? 7 : s.sw ? 3 : s.hi ? 2 : 1),
  },
  selection: {
    title: 'Selection Sort',
    code: [
      'for (let i = 0; i < n - 1; i++) {',
      '  let min = i;',
      '  for (let j = i + 1; j < n; j++) {',
      '    if (a[j] < a[min]) min = j;',
      '  }',
      '  swap(a[i], a[min]);',
      '}',
      'return a;',
    ],
    lineOf: (s) => (s.done ? 7 : has(s.sw) ? 5 : s.hi ? 3 : has(s.scan) ? 1 : 2),
  },
  insertion: {
    title: 'Insertion Sort',
    code: [
      'for (let i = 1; i < n; i++) {',
      '  let key = a[i], j = i;',
      '  while (j > 0 && a[j - 1] > key) {',
      '    a[j] = a[j - 1]; j--;',
      '  }',
      '  a[j] = key;',
      '}',
      'return a;',
    ],
    lineOf: (s) => (s.done ? 7 : s.hi ? 3 : has(s.key) ? 1 : 2),
  },
  merge: {
    title: 'Merge Sort',
    code: [
      'function mergeSort(lo, hi) {',
      '  if (lo >= hi) return;',
      '  const mid = (lo + hi) >> 1;',
      '  mergeSort(lo, mid);',
      '  mergeSort(mid + 1, hi);',
      '  merge(lo, mid, hi);',
      '}',
    ],
    lineOf: (s) => (s.done ? 6 : s.div ? 2 : (s.cmp || s.rng) ? 5 : 0),
  },
  quick: {
    title: 'Quick Sort',
    code: [
      'function quickSort(lo, hi) {',
      '  const pivot = a[hi];',
      '  let i = lo - 1;',
      '  for (let j = lo; j < hi; j++) {',
      '    if (a[j] <= pivot) {',
      '      i++; swap(a[i], a[j]);',
      '    }',
      '  }',
      '  swap(a[i + 1], a[hi]);',
      '}',
    ],
    lineOf: (s) =>
      s.done ? 9 : has(s.placed) ? 8 : s.sw ? 5 : s.hi ? 4 : has(s.piv) ? 1 : 3,
  },
  heap: {
    title: 'Heap Sort',
    code: [
      'buildMaxHeap(a);',
      'for (let end = n - 1; end > 0; end--) {',
      '  swap(a[0], a[end]);',
      '  siftDown(a, 0, end);',
      '}',
      'return a;',
    ],
    lineOf: (s) => (s.done ? 5 : s.sw ? 2 : s.hi ? 3 : 0),
  },

  // ── SEARCH ─────────────────────────────────────────────────────────────
  bsearch: {
    title: 'Binary Search',
    code: [
      'let lo = 0, hi = n - 1;',
      'while (lo <= hi) {',
      '  const mid = (lo + hi) >> 1;',
      '  if (a[mid] === target) return mid;',
      '  else if (a[mid] < target) lo = mid + 1;',
      '  else hi = mid - 1;',
      '}',
      'return -1;',
    ],
    lineOf: (s) => {
      if (s.found === -1) return 7;
      if (has(s.found) && s.found >= 0) return 3;
      if (!has(s.mid)) return 0;
      if (/RIGHT/.test(s.msg || '')) return 4;
      if (/LEFT/.test(s.msg || '')) return 5;
      return 2;
    },
  },

  // ── GRAPHS ─────────────────────────────────────────────────────────────
  bfs: {
    title: 'Breadth-First Search',
    code: [
      'queue = [start];',
      'visited[start] = true;',
      'while (queue.length) {',
      '  const u = queue.shift();',
      '  for (const v of adj[u]) {',
      '    if (!visited[v]) {',
      '      visited[v] = true;',
      '      queue.push(v);',
      '    }',
      '  }',
      '}',
    ],
    lineOf: (s) => (s.done ? 10 : s.edge ? 7 : has(s.cur) ? 3 : 0),
  },
  dfs: {
    title: 'Depth-First Search',
    code: [
      'stack = [start];',
      'while (stack.length) {',
      '  const u = stack.pop();',
      '  if (visited[u]) continue;',
      '  visited[u] = true;',
      '  for (const v of adj[u]) stack.push(v);',
      '}',
    ],
    lineOf: (s) => (s.done ? 6 : s.edge ? 5 : has(s.cur) ? 4 : 0),
  },
  dijkstra: {
    title: "Dijkstra's Shortest Path",
    code: [
      'dist[start] = 0;',
      'pq = [[0, start]];',
      'while (pq.length) {',
      '  const [d, u] = pq.popMin();',
      '  for (const [v, w] of adj[u]) {',
      '    if (dist[u] + w < dist[v]) {',
      '      dist[v] = dist[u] + w;',
      '      pq.push([dist[v], v]);',
      '    }',
      '  }',
      '}',
    ],
    lineOf: (s) => (s.done ? 10 : s.edge ? 6 : has(s.cur) ? 3 : 0),
  },

  // ── BACKTRACKING ───────────────────────────────────────────────────────
  nqueens: {
    title: 'N-Queens (Backtracking)',
    code: [
      'function place(row) {',
      '  if (row === n) return true;',
      '  for (let col = 0; col < n; col++) {',
      '    if (safe(row, col)) {',
      '      board[row][col] = 1;',
      '      if (place(row + 1)) return true;',
      '      board[row][col] = 0;',
      '    }',
      '  }',
      '}',
    ],
    lineOf: (s) =>
      (s.done || s.found) ? 1 : s.remove ? 6 : s.placed ? 4 : s['try'] ? 2 : 3,
  },

  // ── DYNAMIC PROGRAMMING ────────────────────────────────────────────────
  lcs: {
    title: 'Longest Common Subsequence',
    code: [
      'for (let i = 1; i <= m; i++) {',
      '  for (let j = 1; j <= n; j++) {',
      '    if (s1[i - 1] === s2[j - 1])',
      '      dp[i][j] = dp[i - 1][j - 1] + 1;',
      '    else',
      '      dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);',
      '  }',
      '}',
      'return dp[m][n];',
    ],
    lineOf: (s) =>
      s.done ? 8 : s.match === true ? 3 : (s.match === false && s.i) ? 5 : (s.i && s.j) ? 2 : 0,
  },
  edit: {
    title: 'Edit Distance',
    code: [
      'for (let i = 1; i <= m; i++) {',
      '  for (let j = 1; j <= n; j++) {',
      '    if (s1[i - 1] === s2[j - 1])',
      '      dp[i][j] = dp[i - 1][j - 1];',
      '    else',
      '      dp[i][j] = 1 + min(ins, del, sub);',
      '  }',
      '}',
      'return dp[m][n];',
    ],
    lineOf: (s) => (s.done ? 8 : (s.i > 0 && s.j > 0) ? (s.match ? 3 : 5) : 0),
  },
  coin: {
    title: 'Coin Change',
    code: [
      'dp[0] = 0;',
      'for (const coin of coins) {',
      '  for (let i = coin; i <= amount; i++) {',
      '    if (dp[i - coin] + 1 < dp[i])',
      '      dp[i] = dp[i - coin] + 1;',
      '  }',
      '}',
      'return dp[amount];',
    ],
    lineOf: (s) => (s.done ? 7 : (has(s.coin) && s.i > 0) ? 4 : has(s.coin) ? 2 : 0),
  },
  knapsack: {
    title: '0/1 Knapsack',
    code: [
      'for (let i = 1; i <= n; i++) {',
      '  for (let w = 0; w <= cap; w++) {',
      '    if (weight[i - 1] <= w)',
      '      dp[i][w] = max(skip, take);',
      '    else',
      '      dp[i][w] = dp[i - 1][w];',
      '  }',
      '}',
      'return dp[n][cap];',
    ],
    lineOf: (s) => (s.done ? 8 : s.i > 0 ? 3 : 0),
  },

  // ── RECURSION ──────────────────────────────────────────────────────────
  fib: {
    title: 'Fibonacci (Recursion)',
    code: [
      'function fib(n) {',
      '  if (n <= 1) return n;',
      '  return fib(n - 1) + fib(n - 2);',
      '}',
    ],
    lineOf: (s) => (s.base ? 1 : has(s.ret) ? 2 : 0),
  },

  // ── OPTIMIZATION ───────────────────────────────────────────────────────
  gd: {
    title: 'Gradient Descent',
    code: [
      'let x = start;',
      'for (let step = 1; step <= N; step++) {',
      '  const g = gradient(x);',
      '  x = x - lr * g;',
      '  if (Math.abs(g) < tol) break;',
      '}',
      'return x;',
    ],
    lineOf: (s) =>
      s.done ? 6 : (has(s.grad) && /After/.test(s.msg || '')) ? 3 : has(s.grad) ? 2 : (s.step === 0 ? 0 : 1),
  },
};
