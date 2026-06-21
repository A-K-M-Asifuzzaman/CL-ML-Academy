import { T } from '../theme.js';

// ════════════════════════════════════════════════════════════════════════
//  EXTRA TOPICS — advanced depth across every category (merged into TOPICS)
// ════════════════════════════════════════════════════════════════════════
export const EXTRA_TOPICS = [

  // ── Data Structures ───────────────────────────────────────────────────
  { id:'union-find', cat:'ds', title:'Union-Find (DSU)', icon:'⊍', viz:'none', color:T.pu,
    tags:['Path Compression','Union by Rank','Connectivity','Kruskal','Cycle Detection'],
    overview:'Disjoint Set Union (Union-Find) tracks a partition of elements into disjoint sets with two near-constant-time operations: find (which set?) and union (merge two sets). With path compression + union by rank it runs in O(α(n)) amortized — α is the inverse Ackermann function, effectively ≤ 4 for any practical n. It is the engine behind Kruskal\'s MST, dynamic connectivity, and percolation.',
    points:[
      {t:'The forest representation',d:'Each set is a tree; every node points to a parent, and the root is the set representative. parent[root] = root. find(x) walks parent pointers to the root. Two elements are in the same set iff they share a root. Initially every element is its own singleton root.'},
      {t:'Path compression',d:'During find(x), re-point every node on the path directly to the root: parent[x] = find(parent[x]). This flattens the tree so future queries are O(1). Recursive one-liner, or iterative two-pass. Alone it gives O(log n) amortized; combined with rank it gives O(α(n)).'},
      {t:'Union by rank / size',d:'Always attach the shorter tree under the taller one (rank = upper bound on height), or the smaller tree under the larger (size). This keeps trees shallow: height ≤ log n even without compression. Tie-break: increment rank when both equal. Union by size is often preferred — it also answers "how big is this component?".'},
      {t:'Inverse Ackermann α(n)',d:'With both optimizations, m operations on n elements cost O(m·α(n)). α grows so slowly that α(n) ≤ 4 for n < 2^65536. Treat it as constant in practice. This is one of the most surprising results in algorithm analysis (Tarjan, 1975).'},
      {t:'Applications',d:'Kruskal\'s MST (union edges if they don\'t form a cycle), connected components in an undirected graph, cycle detection, "number of islands II" (dynamic), account merging, equation satisfiability (a==b, a!=b), and image/percolation connectivity. Weighted DSU also tracks relative offsets between elements.'},
    ],
    complexity:'find/union O(α(n)) amortized · Space O(n) · Build O(n)',
    code:`class DSU {
  constructor(n) {
    this.parent = Array.from({length: n}, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.size = new Array(n).fill(1);
    this.count = n; // number of disjoint sets
  }
  find(x) {                       // path compression
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]]; // halving
      x = this.parent[x];
    }
    return x;
  }
  union(a, b) {                   // union by rank
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;  // already connected → cycle
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    this.count--;
    return true;
  }
  connected(a, b) { return this.find(a) === this.find(b); }
}`
  },

  { id:'segment-tree', cat:'ds', title:'Segment Trees', icon:'⊿', viz:'none', color:T.pu,
    tags:['Range Query','Lazy Propagation','Point Update','RMQ','O(log n)'],
    overview:'A segment tree answers range queries (sum, min, max, gcd…) and applies updates in O(log n), where a prefix-sum array would need O(n) per update. It is a balanced binary tree over array segments: each node stores an aggregate of its range. With lazy propagation it supports range updates (add v to [l,r]) in O(log n) too.',
    points:[
      {t:'Structure',d:'Leaf i holds arr[i]. Each internal node covers [lo,hi] and stores merge(left.val, right.val). Stored in a flat array of size ~4n; node k has children 2k and 2k+1. Build is O(n) via post-order. The merge function defines the query: +, Math.min, Math.max, gcd, or even "count + max" tuples.'},
      {t:'Range query',d:'Recurse from the root. Three cases: (1) node range fully inside query → return node value; (2) fully outside → return identity (0 for sum, +∞ for min); (3) partial overlap → recurse both children and merge. Touches O(log n) nodes because at each level at most 2 "partial" nodes exist.'},
      {t:'Point update',d:'Walk to the leaf, update it, then re-merge on the way back up. O(log n). The key invariant: every node always equals merge of its children.'},
      {t:'Lazy propagation',d:'For range updates, store a pending "lazy" value at each node instead of touching every leaf. Apply it to the node, mark children lazy, and push down only when you next visit them. This turns range-add + range-sum into O(log n). Order matters: always push down before recursing into children.'},
      {t:'Variants & alternatives',d:'Fenwick tree (BIT) is simpler/faster for prefix sums but limited. Sparse tables give O(1) idempotent queries (min/max) on static arrays. Merge-sort trees / wavelet trees handle "k-th smallest in range". Persistent segment trees keep every historical version in O(log n) extra space.'},
    ],
    complexity:'Build O(n) · Query O(log n) · Update O(log n) · Space O(n)',
    code:`class SegTree {              // range sum, point update
  constructor(arr) {
    this.n = arr.length;
    this.t = new Array(2 * this.n).fill(0);
    for (let i = 0; i < this.n; i++) this.t[this.n + i] = arr[i];
    for (let i = this.n - 1; i > 0; i--) this.t[i] = this.t[2*i] + this.t[2*i+1];
  }
  update(i, val) {            // point assign
    i += this.n; this.t[i] = val;
    for (i >>= 1; i > 0; i >>= 1) this.t[i] = this.t[2*i] + this.t[2*i+1];
  }
  query(l, r) {               // sum of [l, r)
    let res = 0;
    for (l += this.n, r += this.n; l < r; l >>= 1, r >>= 1) {
      if (l & 1) res += this.t[l++];
      if (r & 1) res += this.t[--r];
    }
    return res;
  }
}`
  },

  { id:'balanced-trees', cat:'ds', title:'Balanced BSTs (AVL & Red-Black)', icon:'⚖', viz:'bst', color:T.pu,
    tags:['AVL','Red-Black','Rotations','Self-Balancing','O(log n)'],
    overview:'A plain BST degrades to O(n) on sorted input (it becomes a linked list). Self-balancing trees guarantee O(log n) height via rotations. AVL trees are strictly balanced (faster lookups); Red-Black trees are loosely balanced (fewer rotations on write) and back most standard-library ordered maps (C++ std::map, Java TreeMap).',
    points:[
      {t:'Rotations — the core primitive',d:'A rotation re-arranges three nodes to change height while preserving in-order ordering. Left-rotate(x): x\'s right child y becomes the new subtree root, x becomes y\'s left child, y\'s old left subtree becomes x\'s right. O(1) pointer surgery. Right-rotate is the mirror. Every balance fix is 1–2 rotations.'},
      {t:'AVL invariant',d:'For every node, |height(left) − height(right)| ≤ 1 (the balance factor ∈ {−1,0,+1}). After insert/delete, walk up updating heights; if a node becomes ±2, apply the matching rotation: LL→right, RR→left, LR→left-then-right, RL→right-then-left. Strict balance ⇒ height ≤ 1.44·log n ⇒ fastest lookups.'},
      {t:'Red-Black invariants',d:'(1) every node is red or black; (2) root and null leaves are black; (3) red nodes have black children (no two reds in a row); (4) every root→leaf path has the same number of black nodes. These guarantee height ≤ 2·log(n+1). Inserts fix violations via recoloring + ≤2 rotations; deletes ≤3.'},
      {t:'AVL vs Red-Black trade-off',d:'AVL: more rigid → shallower → faster reads, but more rotations on write. Red-Black: looser → slightly taller → fewer rotations → faster writes. Choose AVL for read-heavy workloads (lookup tables), Red-Black for write-heavy / general purpose (hence standard libraries).'},
      {t:'Where they appear',d:'Ordered maps/sets, the Linux kernel CFS scheduler (RB-tree of runnable tasks), interval trees, order-statistic trees (find k-th smallest by storing subtree sizes), and as the in-memory index for some databases. B-trees take over once data spills to disk.'},
    ],
    complexity:'Search / Insert / Delete O(log n) guaranteed · Space O(n) · Rotation O(1)',
    code:`// AVL insert with rebalancing (height-augmented nodes)
function height(n) { return n ? n.h : 0; }
function bf(n) { return n ? height(n.left) - height(n.right) : 0; }
function upd(n) { n.h = 1 + Math.max(height(n.left), height(n.right)); return n; }
function rotR(y) { const x = y.left; y.left = x.right; x.right = y; upd(y); return upd(x); }
function rotL(x) { const y = x.right; x.right = y.left; y.left = x; upd(x); return upd(y); }

function insert(node, key) {
  if (!node) return { key, left: null, right: null, h: 1 };
  if (key < node.key) node.left = insert(node.left, key);
  else if (key > node.key) node.right = insert(node.right, key);
  else return node;
  upd(node);
  const b = bf(node);
  if (b > 1 && key < node.left.key)  return rotR(node);          // LL
  if (b < -1 && key > node.right.key) return rotL(node);          // RR
  if (b > 1 && key > node.left.key)  { node.left = rotL(node.left); return rotR(node); }  // LR
  if (b < -1 && key < node.right.key){ node.right = rotR(node.right); return rotL(node); } // RL
  return node;
}`
  },

  { id:'lru-cache', cat:'ds', title:'LRU & LFU Caches', icon:'⏲', viz:'none', color:T.pu,
    tags:['Hash Map + DLL','Eviction','O(1)','Caching','System Design'],
    overview:'A cache with a capacity must evict entries when full. LRU (Least Recently Used) evicts the entry untouched for the longest time; LFU (Least Frequently Used) evicts the rarest. The classic interview result: implement LRU with O(1) get and put by combining a hash map with a doubly-linked list.',
    points:[
      {t:'Why hash map + doubly-linked list',d:'The hash map gives O(1) lookup from key → node. The doubly-linked list maintains recency order: most-recently-used at the head, least at the tail. A DLL allows O(1) removal of any node (you have its pointer) and O(1) move-to-front — a singly-linked list cannot remove in O(1).'},
      {t:'get(key)',d:'If absent → miss. If present → it just became most-recently-used, so unlink the node and re-insert at the head, then return its value. Both operations O(1).'},
      {t:'put(key, val)',d:'If key exists, update value and move to head. Else create a node, insert at head, add to map. If size exceeds capacity, remove the tail node (LRU victim) and delete it from the map. Sentinel head/tail dummy nodes eliminate null-checks.'},
      {t:'LFU is harder',d:'LFU needs O(1) by frequency: keep a map key→node, a map freq→DLL of nodes at that frequency, and track minFreq. On access, bump the node from its freq-list to freq+1\'s list. Evict from the minFreq list\'s tail. More bookkeeping but still O(1).'},
      {t:'Real systems',d:'Redis offers LRU, LFU, and TTL eviction (approximate, sampling-based to save memory). CPUs use pseudo-LRU for cache lines. OS page replacement uses the clock/second-chance approximation. Pure LRU is vulnerable to scans (one big sweep evicts everything) — hence ARC, 2Q, and W-TinyLFU hybrids.'},
    ],
    complexity:'get O(1) · put O(1) · Space O(capacity)',
    code:`class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();                 // key -> node
    this.head = { }; this.tail = { };     // sentinels
    this.head.next = this.tail; this.tail.prev = this.head;
  }
  _remove(n) { n.prev.next = n.next; n.next.prev = n.prev; }
  _addFront(n) {
    n.next = this.head.next; n.prev = this.head;
    this.head.next.prev = n; this.head.next = n;
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const n = this.map.get(key);
    this._remove(n); this._addFront(n);   // mark most-recent
    return n.val;
  }
  put(key, val) {
    if (this.map.has(key)) this._remove(this.map.get(key));
    const n = { key, val }; this._addFront(n); this.map.set(key, n);
    if (this.map.size > this.cap) {
      const lru = this.tail.prev;          // evict least-recent
      this._remove(lru); this.map.delete(lru.key);
    }
  }
}`
  },

  { id:'bloom-filter', cat:'ds', title:'Bloom Filters', icon:'⊚', viz:'none', color:T.pu,
    tags:['Probabilistic','No False Negatives','Space-Efficient','k Hashes','Membership'],
    overview:'A Bloom filter is a probabilistic set that answers "is x a member?" using a fraction of the memory a real set needs. It can say "definitely not present" or "probably present" — false positives are possible, false negatives never. Used to skip expensive lookups (disk, network) for keys that certainly do not exist.',
    points:[
      {t:'Structure & insert',d:'An m-bit array (all 0) plus k independent hash functions. To add x, compute k hashes h₁(x)…hₖ(x) mod m and set those k bits to 1. No element data is stored — only bits — which is why it is so compact.'},
      {t:'Query',d:'To test x, check the same k bit positions. If ANY is 0 → x was never inserted (definite no). If ALL are 1 → x is "probably" present (could be a collision of other elements\' bits = false positive). You then do the real (expensive) lookup only for "probably yes".'},
      {t:'False-positive math',d:'After inserting n items into m bits with k hashes, P(false positive) ≈ (1 − e^(−kn/m))^k. The optimal hash count is k = (m/n)·ln 2. With ~10 bits per element and k≈7 you get ~1% false positives. More bits or fewer items → lower error.'},
      {t:'Limitations & variants',d:'Standard Bloom filters can\'t delete (clearing bits would corrupt other keys). Counting Bloom filters use small counters instead of bits to allow removal. Cuckoo filters delete and have better locality. Scalable Bloom filters grow as n grows.'},
      {t:'Where used',d:'Databases (Cassandra, HBase, RocksDB, Bigtable) check a Bloom filter before hitting disk for a key. Browsers/Chrome used them for malicious-URL checks. CDNs and caches avoid one-hit-wonder caching. Spell-checkers, dedup pipelines, and network routers also use them.'},
    ],
    complexity:'Insert O(k) · Query O(k) · Space O(m) bits (k, m constant) · No false negatives',
    code:`class BloomFilter {
  constructor(size = 1024, k = 4) {
    this.size = size; this.k = k;
    this.bits = new Uint8Array(size);
  }
  _hashes(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (const c of str) {
      h1 = Math.imul(h1 ^ c.charCodeAt(0), 2654435761);
      h2 = Math.imul(h2 ^ c.charCodeAt(0), 1597334677);
    }
    const out = [];
    for (let i = 0; i < this.k; i++)              // double hashing
      out.push(Math.abs((h1 + i * h2)) % this.size);
    return out;
  }
  add(x)   { for (const i of this._hashes(x)) this.bits[i] = 1; }
  has(x)   { return this._hashes(x).every(i => this.bits[i] === 1); }
  // has() === false  → definitely absent
  // has() === true   → probably present (small false-positive chance)
}`
  },

  // ── Algorithms ────────────────────────────────────────────────────────
  { id:'shortest-paths', cat:'algo', title:'Shortest Path Algorithms', icon:'⤳', viz:'graph', color:T.gn,
    tags:['Dijkstra','Bellman-Ford','Floyd-Warshall','A*','Negative Edges'],
    overview:'Finding minimum-cost paths in weighted graphs. The right algorithm depends on the graph: Dijkstra for non-negative edges (single source), Bellman-Ford when negatives exist (and to detect negative cycles), Floyd-Warshall for all-pairs on small graphs, and A* when you have a heuristic to guide the search.',
    points:[
      {t:'Dijkstra — greedy with a heap',d:'Maintain tentative distances; repeatedly pop the closest unfinalized node from a min-heap and relax its edges (dist[v] = min(dist[v], dist[u]+w)). Once popped, a node\'s distance is final — this only holds because edges are non-negative. O((V+E) log V) with a binary heap. Fails with negative edges.'},
      {t:'Bellman-Ford — relax V−1 times',d:'Relax ALL edges V−1 times; the longest shortest-path has at most V−1 edges, so distances converge. O(V·E). A V-th pass that still relaxes something proves a negative cycle exists. Handles negative weights — essential for currency arbitrage and constraint systems.'},
      {t:'Floyd-Warshall — all pairs DP',d:'dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) for every intermediate k. Triple loop, O(V³), O(V²) space. Elegant for dense graphs ≤ ~500 nodes, transitive closure, and detecting negative cycles (dist[i][i] < 0).'},
      {t:'A* — heuristic-guided',d:'Like Dijkstra but pops the node minimizing f(n) = g(n) + h(n), where g is cost-so-far and h is an admissible (never-overestimating) heuristic to the goal. With a good h it explores far fewer nodes. Euclidean/Manhattan distance for grids. h=0 reduces A* to Dijkstra.'},
      {t:'Choosing one',d:'Non-negative + single source → Dijkstra. Negative edges or cycle detection → Bellman-Ford. All pairs, small dense graph → Floyd-Warshall. Single source, all weights equal → plain BFS (O(V+E)). Pathfinding with a goal + heuristic → A*. DAG → topological order + one relaxation pass (linear).'},
    ],
    complexity:'Dijkstra O((V+E)log V) · Bellman-Ford O(VE) · Floyd-Warshall O(V³)',
    code:`// Dijkstra with a binary min-heap (adjacency list: adj[u] = [[v, w], ...])
function dijkstra(adj, n, src) {
  const dist = new Array(n).fill(Infinity); dist[src] = 0;
  const pq = [[0, src]];                          // [distance, node]
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);               // (use a real heap in prod)
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;                     // stale entry
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}`
  },

  { id:'string-matching', cat:'algo', title:'String Matching (KMP · Z · Rabin-Karp)', icon:'⌕', viz:'none', color:T.gn,
    tags:['KMP','Z-Algorithm','Rolling Hash','Pattern Search','O(n+m)'],
    overview:'Finding a pattern of length m inside a text of length n. Naive search is O(nm). KMP, the Z-algorithm, and Rabin-Karp all achieve O(n+m) by never re-examining characters needlessly — using either prefix-function preprocessing or rolling hashes.',
    points:[
      {t:'Naive search and its waste',d:'Slide the pattern one position at a time; on a mismatch, restart comparison from the next text index. Worst case O(nm) (e.g. "aaaa…a" vs "aaa…b"). The waste: it forgets the characters it already matched. Smart algorithms reuse that information.'},
      {t:'KMP failure function',d:'Precompute lps[i] = length of the longest proper prefix of pattern[0..i] that is also a suffix. On a mismatch at pattern index j, jump j ← lps[j−1] instead of 0 — the matched overlap is reused. Build lps in O(m), search in O(n). Total O(n+m), never backs up in the text.'},
      {t:'Z-algorithm',d:'Z[i] = length of the longest substring starting at i that matches a prefix of the string. Computed in O(n) using a maintained [L,R] "Z-box". To search, run Z on pattern + "$" + text; any Z[i] ≥ m marks a match. Often simpler to code than KMP.'},
      {t:'Rabin-Karp rolling hash',d:'Hash the pattern and each length-m window of the text. Roll the window hash in O(1): subtract the leaving char, multiply by base, add the entering char. Compare hashes first, verify on match to rule out collisions. Expected O(n+m); shines for multi-pattern search and 2D pattern matching. Use double hashing to avoid worst case.'},
      {t:'Applications',d:'grep/text editors, plagiarism and diff tools, DNA/protein sequence search (often with suffix automata/arrays for many queries), detecting string rotations (s is a rotation of t iff s is a substring of t+t), and longest-repeated-substring problems.'},
    ],
    complexity:'KMP / Z O(n+m) · Rabin-Karp O(n+m) expected, O(nm) worst · Space O(m)',
    code:`// KMP: build failure function, then search
function buildLPS(p) {
  const lps = new Array(p.length).fill(0);
  let len = 0;
  for (let i = 1; i < p.length; ) {
    if (p[i] === p[len]) lps[i++] = ++len;
    else if (len) len = lps[len - 1];
    else lps[i++] = 0;
  }
  return lps;
}
function kmpSearch(text, pat) {
  const lps = buildLPS(pat), res = [];
  let i = 0, j = 0;
  while (i < text.length) {
    if (text[i] === pat[j]) { i++; j++; if (j === pat.length) { res.push(i - j); j = lps[j - 1]; } }
    else if (j) j = lps[j - 1];
    else i++;
  }
  return res;                       // all start indices of pat in text
}`
  },

  { id:'topological-sort', cat:'algo', title:'Topological Sort', icon:'⇗', viz:'graph', color:T.gn,
    tags:['DAG','Kahn','DFS','Dependency Order','Cycle Detection'],
    overview:'A topological ordering of a directed acyclic graph (DAG) lists every node before all nodes it points to. It answers "in what order can I do these dependent tasks?" — build systems, course prerequisites, package managers, and spreadsheet recalculation all rely on it. It exists iff the graph has no cycle.',
    points:[
      {t:'Kahn\'s algorithm (BFS)',d:'Compute in-degree (incoming edges) of every node. Put all in-degree-0 nodes in a queue. Repeatedly pop a node, append it to the order, and decrement neighbors\' in-degrees; any that hit 0 enter the queue. If you output fewer than V nodes, a cycle exists. O(V+E).'},
      {t:'DFS-based ordering',d:'Run DFS; when a node finishes (all descendants visited), push it onto a stack. The reversed finish order is a valid topological order. Detect cycles with a 3-color marking (white/gray/black): encountering a gray node means a back edge = cycle.'},
      {t:'Multiple valid orders',d:'A DAG usually has many valid topological orders. To get a deterministic / lexicographically smallest order, use a min-heap instead of a queue in Kahn\'s algorithm (O((V+E) log V)). Useful when ties must be broken predictably.'},
      {t:'Cycle = no ordering',d:'If the graph contains a directed cycle, no valid order exists (A before B before A is impossible). Both algorithms detect this: Kahn outputs < V nodes; DFS finds a gray back edge. This makes topo-sort a clean cycle detector for directed graphs.'},
      {t:'Applications',d:'Build/compile order (Make, Bazel), task schedulers with dependencies, course prerequisite planning, resolving symbol/link order, dataflow and spreadsheet recalculation, and as a preprocessing step for DAG shortest/longest paths (single linear relaxation pass).'},
    ],
    complexity:'Kahn / DFS O(V+E) · Space O(V) · Lexicographic order O((V+E) log V)',
    code:`// Kahn's algorithm — returns topo order or null if a cycle exists
function topoSort(numNodes, edges) {        // edges: [from, to]
  const adj = Array.from({length: numNodes}, () => []);
  const indeg = new Array(numNodes).fill(0);
  for (const [u, v] of edges) { adj[u].push(v); indeg[v]++; }

  const queue = [];
  for (let i = 0; i < numNodes; i++) if (indeg[i] === 0) queue.push(i);

  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) queue.push(v);
  }
  return order.length === numNodes ? order : null;   // null ⇒ cycle
}`
  },

  // ── Complexity ────────────────────────────────────────────────────────
  { id:'amortized-analysis', cat:'complex', title:'Amortized Analysis', icon:'∿', viz:'none', color:T.ye,
    tags:['Aggregate','Accounting','Potential','Dynamic Array','Worst-Case Average'],
    overview:'Amortized analysis measures the average cost per operation over a worst-case sequence — not the average over random inputs (that is average-case analysis). It explains why a dynamic array\'s push is "O(1) amortized" even though an occasional resize costs O(n). Three techniques: aggregate, accounting, and potential.',
    points:[
      {t:'Why it matters',d:'Some operations are usually cheap but occasionally expensive. Reporting only the worst single op (O(n)) is misleading if it happens rarely. Amortized cost = (total cost of n operations) / n, guaranteed even for the most adversarial sequence — a true upper bound, unlike average-case.'},
      {t:'Aggregate method',d:'Bound the total cost of any sequence of n operations, then divide by n. Dynamic array: n pushes trigger resizes at sizes 1,2,4,…,n, copying 1+2+4+…+n < 2n elements total. Total work O(n) over n pushes ⇒ O(1) amortized per push.'},
      {t:'Accounting (banker\'s) method',d:'Charge each operation an amortized cost; cheap ops "overpay" and store credit, expensive ops "spend" it. Invariant: stored credit never goes negative. For dynamic arrays, charge 3 per push — 1 to insert, 2 saved to pay for the future copy of this element and one older element during the next doubling.'},
      {t:'Potential method',d:'Define a potential function Φ(state) ≥ 0 measuring "stored energy". Amortized cost = actual cost + ΔΦ. Cheap ops raise Φ; expensive ops release it (ΔΦ ≪ 0) to cancel their real cost. The most general technique — used for splay trees, Fibonacci heaps, and union-find.'},
      {t:'Classic results',d:'Dynamic array push/pop: O(1) amortized. Binary counter increment: O(1) amortized (each bit flips half as often as the one below). Splay tree operations: O(log n) amortized. Fibonacci heap decrease-key: O(1) amortized. Union-Find: O(α(n)) amortized. Two-stack queue: O(1) amortized.'},
    ],
    complexity:'Amortized = total(n ops) / n — a worst-case guarantee per operation',
    code:`// Dynamic array — push is O(1) AMORTIZED despite O(n) resizes
class DynamicArray {
  constructor() { this.data = new Array(1); this.size = 0; this.cap = 1; }
  push(x) {
    if (this.size === this.cap) {        // resize: costs O(n), but rare
      this.cap *= 2;                      // doubling is the key
      const bigger = new Array(this.cap);
      for (let i = 0; i < this.size; i++) bigger[i] = this.data[i];
      this.data = bigger;
    }
    this.data[this.size++] = x;           // usually O(1)
  }
}
// Aggregate proof: n pushes copy 1+2+4+...+n < 2n elements total
//   total work O(n)  ⇒  O(1) amortized per push.
// (If you grew by +1 each time instead, copies = 1+2+...+n = O(n²) → O(n) each!)`
  },

  { id:'p-vs-np', cat:'complex', title:'P, NP & NP-Completeness', icon:'⊘', viz:'none', color:T.ye,
    tags:['P','NP','NP-Complete','Reductions','SAT','Halting Problem'],
    overview:'Complexity classes group problems by how hard they are to solve and verify. P = solvable in polynomial time. NP = solutions verifiable in polynomial time. The million-dollar question "P = NP?" asks whether every quickly-checkable problem is also quickly solvable. Understanding NP-completeness tells you when to stop looking for an exact fast algorithm and switch to heuristics.',
    points:[
      {t:'P — efficiently solvable',d:'Problems with an algorithm running in O(n^k) for some constant k: sorting, shortest paths, matching, linear programming, primality testing (AKS, 2002). "Tractable" in theory, though a huge exponent could still be impractical.'},
      {t:'NP — efficiently verifiable',d:'Given a candidate solution (a "certificate"), you can check it in polynomial time, even if finding it seems hard. Sudoku, SAT, Hamiltonian cycle, subset-sum: verifying a filled grid / satisfying assignment / tour is easy. P ⊆ NP. Whether NP ⊆ P is open.'},
      {t:'NP-complete — the hardest in NP',d:'A problem is NP-complete if it is in NP and every NP problem reduces to it in polynomial time. Cook–Levin (1971): SAT is NP-complete. So are 3-SAT, clique, vertex cover, Hamiltonian cycle, TSP (decision), knapsack, graph coloring. Solve ONE in polynomial time and you solve them ALL ⇒ P = NP.'},
      {t:'Reductions',d:'To prove problem B is NP-hard, reduce a known NP-complete problem A to B: transform any instance of A into an instance of B in poly time such that the answers match. This shows B is at least as hard as A. Reductions are how the NP-complete "web" of thousands of problems was built.'},
      {t:'Beyond NP & what to do',d:'NP-hard = at least as hard as NP-complete, not necessarily in NP (e.g. TSP optimization, the Halting Problem which is undecidable). PSPACE, EXPTIME lie further out. Faced with an NP-complete problem in practice: use approximation algorithms, heuristics (greedy, local search), exact solvers (ILP, SAT solvers) on small inputs, or exploit special structure.'},
    ],
    complexity:'P ⊆ NP ⊆ PSPACE ⊆ EXPTIME · NP-complete = NP ∩ NP-hard',
    code:`// Verifying an NP solution is EASY; finding it may be HARD.
// Subset-Sum: does any subset of nums sum to target?

// Verify a given certificate (subset) — polynomial O(n):
function verify(nums, subsetIndices, target) {
  const sum = subsetIndices.reduce((s, i) => s + nums[i], 0);
  return sum === target;          // trivially checkable ⇒ in NP
}

// Solve from scratch — exponential O(2^n) brute force:
function subsetSum(nums, target) {
  const n = nums.length;
  for (let mask = 0; mask < (1 << n); mask++) {       // every subset
    let s = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) s += nums[i];
    if (s === target) return true;
  }
  return false;
}
// No known polynomial algorithm. If you find one → you've proven P = NP.`
  },

  { id:'master-theorem', cat:'complex', title:'Recurrences & Master Theorem', icon:'⨏', viz:'none', color:T.ye,
    tags:['Divide & Conquer','T(n)=aT(n/b)+f(n)','Recursion Tree','Substitution'],
    overview:'Divide-and-conquer algorithms have running times described by recurrences like T(n) = a·T(n/b) + f(n). The Master Theorem is a cookbook that solves this common form instantly by comparing the work of recursion (n^(log_b a)) against the work done per level (f(n)).',
    points:[
      {t:'The recurrence form',d:'T(n) = a·T(n/b) + f(n): the problem splits into a subproblems each of size n/b, plus f(n) work to divide and combine. Merge sort: a=2, b=2, f(n)=O(n). Binary search: a=1, b=2, f(n)=O(1). Strassen matrix multiply: a=7, b=2, f(n)=O(n²).'},
      {t:'The critical exponent',d:'Let c* = log_b(a). This is the exponent of the leaves\' total work (there are a^(log_b n) = n^(log_b a) leaves). The theorem compares f(n) against n^(c*) to decide which term dominates the sum over all levels.'},
      {t:'Three cases',d:'Case 1: f(n) = O(n^(c*−ε)) → recursion dominates → T(n) = Θ(n^(c*)). Case 2: f(n) = Θ(n^(c*)·log^k n) → balanced → T(n) = Θ(n^(c*)·log^(k+1) n). Case 3: f(n) = Ω(n^(c*+ε)) and regular → top level dominates → T(n) = Θ(f(n)).'},
      {t:'Worked examples',d:'Merge sort: c*=log₂2=1, f(n)=Θ(n)=Θ(n¹) → Case 2 → Θ(n log n). Binary search: c*=log₂1=0, f(n)=Θ(1)=Θ(n⁰) → Case 2 → Θ(log n). T(n)=2T(n/2)+n²: c*=1, f=n² is bigger → Case 3 → Θ(n²). Strassen: c*=log₂7≈2.807, f=n² smaller → Case 1 → Θ(n^2.807).'},
      {t:'When it doesn\'t apply',d:'The Master Theorem needs the exact a·T(n/b)+f(n) shape with constant a,b. It fails for unequal splits (T(n)=T(n/3)+T(2n/3)+n — use the recursion-tree or Akra–Bazzi method), non-polynomial gaps between f and n^(c*), or subtract-and-conquer T(n)=T(n−1)+f(n). Then use substitution (guess + induction) or recursion trees.'},
    ],
    complexity:'Solves T(n)=aT(n/b)+f(n) by comparing f(n) with n^(log_b a)',
    code:`// Master Theorem decision helper (conceptual)
function masterTheorem(a, b, fExponent) {     // f(n) = Θ(n^fExponent)
  const critical = Math.log(a) / Math.log(b); // c* = log_b(a)
  if (fExponent < critical)
    return \`Case 1 → Θ(n^\${critical.toFixed(3)})\`;          // leaves dominate
  if (Math.abs(fExponent - critical) < 1e-9)
    return \`Case 2 → Θ(n^\${critical.toFixed(3)} · log n)\`;  // balanced
  return \`Case 3 → Θ(n^\${fExponent})\`;                      // root dominates
}
masterTheorem(2, 2, 1);  // Merge sort   → Θ(n log n)
masterTheorem(1, 2, 0);  // Binary search→ Θ(log n)
masterTheorem(7, 2, 2);  // Strassen     → Θ(n^2.807)`
  },

];
