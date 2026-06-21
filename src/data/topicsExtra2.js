import { T } from '../theme.js';
const CV = '#39ff9a', MLOPS = '#00ffd0', NLP = '#ff9d40';

// ════════════════════════════════════════════════════════════════════════
//  EXTRA TOPICS · BATCH 2 — Math, Systems, Networks, DB, CV, MLOps, DL, NLP
// ════════════════════════════════════════════════════════════════════════
export const EXTRA_TOPICS_2 = [

  // ── Math for ML ───────────────────────────────────────────────────────
  { id:'calculus-ml', cat:'math', title:'Calculus for ML', icon:'∂', viz:'gd', color:T.tl,
    tags:['Derivatives','Chain Rule','Gradients','Jacobian','Hessian','Backprop'],
    overview:'Calculus is the language of optimization in ML. Training = minimizing a loss by following its gradient downhill. You need derivatives (rate of change), the chain rule (the heart of backpropagation), gradients (direction of steepest ascent), and second-order info (Hessian) to understand curvature, convergence, and why learning rates matter.',
    points:[
      {t:'Derivative & gradient',d:'f\'(x) is the instantaneous slope. For multivariable f(x₁…xₙ), the gradient ∇f is the vector of partial derivatives — it points in the direction of steepest increase, and its negative is the direction of steepest decrease. Gradient descent steps x ← x − η∇f. ‖∇f‖ measures how steep things are; at a minimum ∇f = 0.'},
      {t:'Chain rule = backpropagation',d:'For composed functions, dz/dx = dz/dy · dy/dx. Neural nets are deep compositions; backprop applies the chain rule layer by layer from the loss backward, reusing intermediate results (reverse-mode autodiff). This computes all parameter gradients in one backward pass — O(network size), the reason deep learning is feasible.'},
      {t:'Jacobian & Hessian',d:'The Jacobian is the matrix of all first partials of a vector-valued function (∂outputᵢ/∂inputⱼ) — used to propagate gradients through vector ops. The Hessian is the matrix of second partials, describing curvature. Positive-definite Hessian ⇒ local minimum; its eigenvalues set the ideal step size and explain ill-conditioning.'},
      {t:'Convexity',d:'A convex function has a single global minimum (bowl shape) — gradient descent is guaranteed to reach it. Linear/logistic regression with convex loss are easy. Neural nets are non-convex (many local minima and saddle points), but in high dimensions most critical points are saddles, and SGD escapes them well.'},
      {t:'Common derivatives in ML',d:'d/dx σ(x) = σ(x)(1−σ(x)) (sigmoid). d/dx tanh = 1−tanh²x. d/dx ReLU = 1 if x>0 else 0. Softmax+cross-entropy gradient simplifies beautifully to (prediction − target). MSE gradient = 2(ŷ−y). Knowing these by heart demystifies what every layer\'s backward pass computes.'},
    ],
    complexity:'Backprop computes all gradients in O(network size) via reverse-mode autodiff',
    code:`// Numerical gradient check vs analytic gradient
const f = (x) => x[0]**2 + 3*x[0]*x[1] + x[1]**2;   // scalar field

// Analytic gradient: ∇f = [2x₀ + 3x₁, 3x₀ + 2x₁]
const gradAnalytic = (x) => [2*x[0] + 3*x[1], 3*x[0] + 2*x[1]];

// Numerical gradient (finite differences) — used to verify backprop
function gradNumeric(f, x, h = 1e-5) {
  return x.map((_, i) => {
    const a = [...x], b = [...x];
    a[i] += h; b[i] -= h;
    return (f(a) - f(b)) / (2 * h);     // central difference
  });
}
console.log(gradAnalytic([1, 2]));   // [8, 7]
console.log(gradNumeric(f, [1, 2])); // ≈ [8, 7]  → backprop is correct

// One gradient-descent step
let x = [3, -2], lr = 0.1;
const g = gradAnalytic(x);
x = x.map((xi, i) => xi - lr * g[i]);  // move downhill`
  },

  { id:'statistics-ml', cat:'math', title:'Statistics & Probability for ML', icon:'∫', viz:'none', color:T.tl,
    tags:['Distributions','Bayes','MLE','Hypothesis Testing','CLT','Variance'],
    overview:'Statistics turns data into beliefs and decisions. ML models are estimators; understanding distributions, Bayes\' theorem, maximum likelihood, and the bias-variance trade-off tells you why models behave as they do, how confident to be, and how to evaluate results rigorously rather than fooling yourself with noise.',
    points:[
      {t:'Key distributions',d:'Bernoulli/Binomial (coin flips, binary outcomes), Gaussian/Normal (the CLT magnet — sums of many effects), Poisson (rare event counts), Exponential (waiting times), Uniform, and Beta/Dirichlet (priors over probabilities). Knowing the right distribution is half of correctly modeling a problem.'},
      {t:'Bayes\' theorem',d:'P(A|B) = P(B|A)·P(A) / P(B). Posterior ∝ likelihood × prior. It updates beliefs with evidence and underpins Naive Bayes, Bayesian inference, A/B testing, and spam filters. The base-rate fallacy (ignoring P(A)) is why a 99%-accurate test for a rare disease still yields mostly false positives.'},
      {t:'MLE vs MAP',d:'Maximum Likelihood Estimation picks parameters maximizing P(data|θ) — most ML training is MLE (minimizing negative log-likelihood = cross-entropy / MSE). MAP adds a prior, maximizing P(θ|data) ∝ P(data|θ)P(θ); a Gaussian prior = L2 regularization, a Laplace prior = L1. Regularization is just Bayesian priors in disguise.'},
      {t:'Bias-variance trade-off',d:'Expected error = bias² + variance + irreducible noise. High bias = underfitting (too simple, misses signal); high variance = overfitting (too complex, fits noise). Increasing model capacity lowers bias but raises variance. Regularization, more data, and ensembling shift this balance. The double-descent curve refines this for huge models.'},
      {t:'Hypothesis testing & CLT',d:'The Central Limit Theorem says sample means approach a normal distribution regardless of the underlying distribution — enabling confidence intervals and z/t-tests. p-value = P(data this extreme | null hypothesis true). Beware p-hacking and multiple comparisons (Bonferroni correction). For ML A/B tests, also watch statistical power and effect size, not just significance.'},
    ],
    complexity:'Foundations for estimation, evaluation, and uncertainty quantification',
    code:`// Bayes' theorem: disease test with base rates
const pDisease = 0.001;          // prior: 0.1% have the disease
const sensitivity = 0.99;        // P(test+ | disease)
const specificity = 0.99;        // P(test- | healthy)

const pPosGivenDisease = sensitivity;
const pPosGivenHealthy = 1 - specificity;
const pPos = pPosGivenDisease * pDisease +
             pPosGivenHealthy * (1 - pDisease);

const pDiseaseGivenPos = (pPosGivenDisease * pDisease) / pPos;
console.log((pDiseaseGivenPos * 100).toFixed(1) + '%');  // ≈ 9.0% !
// Despite a 99% accurate test, a positive result means only ~9%
// chance of disease — because the disease is rare (base-rate fallacy).`
  },

  { id:'information-theory', cat:'math', title:'Information Theory', icon:'ℹ', viz:'none', color:T.tl,
    tags:['Entropy','Cross-Entropy','KL Divergence','Mutual Information','Bits'],
    overview:'Information theory (Shannon, 1948) quantifies uncertainty and information in bits. It directly defines the loss functions of modern ML: cross-entropy is the default classification loss, KL divergence drives variational inference and distillation, and entropy underlies decision-tree splits and exploration.',
    points:[
      {t:'Entropy — uncertainty in bits',d:'H(X) = −Σ p(x)·log₂ p(x). It is the average number of bits needed to encode outcomes, maximized by a uniform distribution and zero for a certain outcome. A fair coin has 1 bit; a loaded coin less. Decision trees split on the feature that most reduces entropy (information gain).'},
      {t:'Cross-entropy — the ML loss',d:'H(p,q) = −Σ p(x)·log q(x): the cost of encoding true distribution p using model distribution q. Minimizing cross-entropy = making predictions q match labels p. For one-hot labels it reduces to −log(q at the correct class) — the ubiquitous classification loss. It is always ≥ the true entropy H(p).'},
      {t:'KL divergence',d:'D_KL(p‖q) = Σ p(x)·log(p(x)/q(x)) = H(p,q) − H(p): the extra bits from using q instead of p. Always ≥ 0, zero iff p=q, and asymmetric (D_KL(p‖q) ≠ D_KL(q‖p)). Powers variational autoencoders (regularize latent to a prior), knowledge distillation, and RLHF/PPO penalties (stay near the reference policy).'},
      {t:'Mutual information',d:'I(X;Y) = H(X) − H(X|Y): how much knowing Y reduces uncertainty about X. Symmetric, zero iff independent. Used for feature selection (keep features informative about the label), representation learning (InfoNCE / contrastive objectives maximize a MI lower bound), and analyzing what layers encode.'},
      {t:'Perplexity & coding',d:'Perplexity = 2^(cross-entropy) = the effective branching factor of a language model — lower is better (a perplexity of 20 ≈ "as unsure as choosing among 20 equally-likely words"). Shannon\'s source coding theorem proves you cannot losslessly compress below the entropy; Huffman and arithmetic coding approach it.'},
    ],
    complexity:'Entropy/CE/KL computed in O(k) over k outcomes · Defines ML loss functions',
    code:`const log2 = x => Math.log(x) / Math.LN2;

// Entropy: average uncertainty in bits
const entropy = p => -p.reduce((s, pi) => s + (pi > 0 ? pi * log2(pi) : 0), 0);

// Cross-entropy: cost of coding p with model q
const crossEntropy = (p, q) => -p.reduce((s, pi, i) => s + (pi > 0 ? pi * log2(q[i]) : 0), 0);

// KL divergence: extra bits from using q instead of p
const klDivergence = (p, q) => p.reduce((s, pi, i) => s + (pi > 0 ? pi * log2(pi / q[i]) : 0), 0);

console.log(entropy([0.5, 0.5]));            // 1.0 bit  (fair coin)
console.log(entropy([0.9, 0.1]));            // 0.469 bits (predictable)
console.log(crossEntropy([1, 0], [0.7, 0.3]));// 0.515  (classification loss)
console.log(klDivergence([0.5,0.5],[0.9,0.1]));// 0.737  (distributions differ)`
  },

  // ── Systems ───────────────────────────────────────────────────────────
  { id:'memory-management', cat:'sys', title:'Memory Management', icon:'▤', viz:'none', color:T.or,
    tags:['Virtual Memory','Paging','TLB','Garbage Collection','Stack vs Heap'],
    overview:'How programs get, use, and release memory. Virtual memory gives each process its own private address space; paging maps it to physical RAM on demand; caches and the TLB make it fast; and allocators / garbage collectors manage the heap. Understanding this explains segfaults, memory leaks, cache misses, and GC pauses.',
    points:[
      {t:'Virtual memory & paging',d:'Each process sees a contiguous virtual address space, divided into fixed-size pages (typically 4KB). The OS + MMU map virtual pages to physical frames via page tables. Unused pages live on disk; accessing one triggers a page fault that loads it. This gives isolation, overcommit, and the illusion of more memory than physically exists.'},
      {t:'The TLB & locality',d:'Translating every address via multi-level page tables would be slow, so the Translation Lookaside Buffer caches recent translations. TLB misses are costly; huge pages reduce them. Combined with CPU caches (L1/L2/L3), this makes spatial and temporal locality crucial — sequential access is dramatically faster than random pointer chasing.'},
      {t:'Stack vs heap',d:'The stack holds function frames (locals, return addresses); allocation is a pointer bump, deallocation automatic on return — fast but bounded (stack overflow on deep recursion). The heap is for dynamic, long-lived objects; allocation is explicit (malloc/new) and slower, requiring a free-list or allocator and eventual deallocation.'},
      {t:'Allocators & fragmentation',d:'malloc implementations (ptmalloc, jemalloc, tcmalloc) manage free lists, size classes, and arenas to balance speed and fragmentation. External fragmentation = free memory scattered in unusable gaps; internal = padding waste within blocks. Slab allocators and pools optimize fixed-size objects.'},
      {t:'Garbage collection',d:'Managed languages reclaim unreachable memory automatically. Reference counting (Python, Swift) frees immediately but leaks cycles. Tracing GCs (Java, Go, JS) mark reachable objects from roots, then sweep. Generational GC exploits "most objects die young". Trade-offs: throughput vs pause time; concurrent/incremental collectors (Go, ZGC) minimize stop-the-world pauses.'},
    ],
    complexity:'Page access O(1) on TLB hit · Page fault ~ms (disk) · GC pause varies',
    code:`// Manual memory pool (free-list allocator) — avoids malloc churn
class MemoryPool {
  constructor(blockSize, numBlocks) {
    this.buffer = new ArrayBuffer(blockSize * numBlocks);
    this.blockSize = blockSize;
    this.free = [];                          // stack of free offsets
    for (let i = 0; i < numBlocks; i++) this.free.push(i * blockSize);
  }
  alloc() {                                  // O(1)
    if (!this.free.length) throw new Error('pool exhausted');
    return this.free.pop();                   // return an offset
  }
  free_(offset) { this.free.push(offset); }  // O(1) reclaim — no fragmentation
}
// Pools give predictable, fast (de)allocation for fixed-size objects —
// used in game engines, network buffers, and embedded systems.`
  },

  { id:'caching-systems', cat:'sys', title:'Caching & CDNs', icon:'⚡', viz:'none', color:T.or,
    tags:['Cache Strategies','Redis','CDN','Eviction','Consistency','TTL'],
    overview:'Caching stores expensive-to-fetch data closer to where it is needed, trading memory and staleness for speed. From CPU caches to Redis to global CDNs, the patterns repeat: what to cache, when to invalidate, how to evict, and how to keep caches consistent with the source of truth.',
    points:[
      {t:'Caching patterns',d:'Cache-aside (lazy): app checks cache, on miss loads from DB and populates — most common, but first request is slow and risks stale data. Read-through/write-through: the cache layer handles DB I/O synchronously (consistent, slower writes). Write-back: write to cache, flush to DB later (fast, risks data loss). Write-around: write to DB only, skip cache (avoids polluting cache with rarely-read data).'},
      {t:'Eviction policies',d:'When full, decide what to drop: LRU (least recently used — default, scan-vulnerable), LFU (least frequently used — keeps hot keys), FIFO, Random, and TTL-based expiry. Redis combines TTL + approximate LRU/LFU via sampling. Hybrids like W-TinyLFU power Caffeine/modern caches for high hit rates.'},
      {t:'Invalidation — the hard part',d:'"There are only two hard things in CS: cache invalidation and naming things." Strategies: TTL (simple, eventually consistent), explicit purge on write, versioned keys (key includes a version/hash so old entries are abandoned), and event-driven invalidation via pub/sub. Stampede protection: locks or request coalescing so one miss doesn\'t trigger thousands of DB hits.'},
      {t:'Distributed caching',d:'Redis/Memcached cache across servers. Consistent hashing distributes keys so adding/removing a node remaps only ~1/N keys (not all). Replication + sharding scale reads and capacity. Watch for hot keys (one key overwhelms a shard) and the thundering-herd problem on expiry.'},
      {t:'CDNs & edge',d:'Content Delivery Networks cache static (and increasingly dynamic) content at edge POPs near users, cutting latency and origin load. Cache-Control headers, ETags, and stale-while-revalidate govern freshness. Edge compute (Cloudflare Workers, Lambda@Edge) runs logic at the edge. Cache layers stack: browser → CDN → reverse proxy → app cache → DB.'},
    ],
    complexity:'Cache hit O(1) ~µs · Miss = full backend latency · Hit rate is the key metric',
    code:`// Cache-aside with TTL + single-flight (stampede protection)
class Cache {
  constructor() { this.store = new Map(); this.inflight = new Map(); }
  async get(key, loader, ttlMs = 60000) {
    const hit = this.store.get(key);
    if (hit && hit.exp > Date.now()) return hit.val;          // fresh hit

    if (this.inflight.has(key)) return this.inflight.get(key); // coalesce
    const p = (async () => {
      const val = await loader();                              // hit backend once
      this.store.set(key, { val, exp: Date.now() + ttlMs });
      this.inflight.delete(key);
      return val;
    })();
    this.inflight.set(key, p);
    return p;
  }
  invalidate(key) { this.store.delete(key); }                  // explicit purge
}`
  },

  // ── Networks ──────────────────────────────────────────────────────────
  { id:'tcp-ip', cat:'net', title:'TCP/IP & the Internet', icon:'⇄', viz:'none', color:T.bl,
    tags:['3-Way Handshake','Congestion Control','UDP','IP Routing','Reliability'],
    overview:'The protocol stack that runs the internet. IP routes packets between hosts (best-effort, unreliable); TCP layers reliability, ordering, and flow/congestion control on top; UDP stays lean for speed. Understanding the handshake, sliding windows, and congestion control explains latency, throughput, and why your connection stalls.',
    points:[
      {t:'The layered model',d:'Link (Ethernet/Wi-Fi, frames) → Internet (IP, packets, routing) → Transport (TCP/UDP, segments) → Application (HTTP, DNS, etc.). Each layer adds a header and treats the layer below as a pipe. Encapsulation: data is wrapped layer by layer on send, unwrapped on receive. IP is "best effort" — packets may be lost, duplicated, or reordered.'},
      {t:'TCP 3-way handshake',d:'SYN → SYN-ACK → ACK establishes a connection and synchronizes sequence numbers before any data flows. Teardown uses FIN/ACK (4-way). This setup cost (1 round trip) is why connection reuse and keep-alive matter; TCP Fast Open and QUIC reduce it. Sequence numbers enable ordering and duplicate detection.'},
      {t:'Reliability & flow control',d:'TCP numbers every byte; the receiver ACKs what it got. Unacked data is retransmitted after a timeout (RTO) or fast-retransmit on 3 duplicate ACKs. The sliding window lets multiple segments be in flight. Flow control: the receiver advertises a window size so a fast sender can\'t overwhelm a slow receiver.'},
      {t:'Congestion control',d:'To avoid collapsing the network, TCP probes capacity: slow start (exponential cwnd growth), congestion avoidance (linear growth), and multiplicative decrease on loss (AIMD). Variants: Reno, CUBIC (Linux default), and BBR (Google, models bandwidth × RTT instead of reacting to loss). This is why throughput ramps up and dips after packet loss.'},
      {t:'TCP vs UDP',d:'TCP: reliable, ordered, congestion-controlled — web, email, file transfer. UDP: connectionless, no guarantees, minimal overhead — DNS, video/voice, gaming, where speed beats perfection and apps handle loss themselves. QUIC (HTTP/3) runs reliable, multiplexed, encrypted streams over UDP, avoiding TCP head-of-line blocking.'},
    ],
    complexity:'Handshake = 1 RTT · Throughput ≈ window / RTT · Congestion control is adaptive',
    code:`// TCP 3-way handshake (conceptual state machine)
const states = {
  CLIENT: ['CLOSED', 'SYN_SENT', 'ESTABLISHED'],
  SERVER: ['LISTEN', 'SYN_RCVD', 'ESTABLISHED'],
};
// 1. Client → Server : SYN  (seq = x)
// 2. Server → Client : SYN-ACK (seq = y, ack = x+1)
// 3. Client → Server : ACK  (ack = y+1)   → connection ESTABLISHED

// Simplified AIMD congestion window
let cwnd = 1, ssthresh = 16;
function onAck()  { cwnd += cwnd < ssthresh ? cwnd : 1; }  // slow start → linear
function onLoss() { ssthresh = Math.max(cwnd / 2, 1); cwnd = 1; } // multiplicative decrease`
  },

  { id:'http-protocols', cat:'net', title:'HTTP, HTTPS & TLS', icon:'⊕', viz:'none', color:T.bl,
    tags:['HTTP/1.1','HTTP/2','HTTP/3','TLS','REST','Status Codes'],
    overview:'HTTP is the request/response protocol of the web. Over three decades it evolved from text-based HTTP/1.1 to multiplexed binary HTTP/2 to QUIC-based HTTP/3 — each fixing the previous bottleneck. TLS wraps it all in encryption. Knowing the model explains performance, caching, and security on the web.',
    points:[
      {t:'Request/response & methods',d:'A client sends a method + path + headers (+ body); the server returns a status + headers + body. Methods: GET (read, safe/idempotent), POST (create), PUT (replace, idempotent), PATCH (partial update), DELETE (idempotent). Idempotency matters for retries — a GET or PUT can be safely repeated; a POST may double-charge.'},
      {t:'Status codes',d:'2xx success (200 OK, 201 Created, 204 No Content), 3xx redirect (301 permanent, 304 Not Modified — cache hit), 4xx client error (400 bad request, 401 unauthorized, 403 forbidden, 404 not found, 429 too many requests), 5xx server error (500, 502 bad gateway, 503 unavailable). Correct codes are an API contract.'},
      {t:'HTTP/1.1 → 2 → 3',d:'HTTP/1.1: one request per connection at a time → head-of-line blocking; mitigated by 6 parallel connections and keep-alive. HTTP/2: binary framing, multiplexed streams over one connection, header compression (HPACK), server push. HTTP/3: runs over QUIC (UDP) to eliminate TCP-level head-of-line blocking and enable 0-RTT resumption.'},
      {t:'TLS & HTTPS',d:'TLS encrypts and authenticates. The handshake negotiates a cipher suite, validates the server\'s certificate (chain of trust to a CA), and derives session keys (ECDHE gives forward secrecy). TLS 1.3 cut the handshake to 1 RTT (0-RTT on resume). HTTPS = HTTP over TLS — now the default, also required for HTTP/2 and many browser APIs.'},
      {t:'Caching, cookies & REST',d:'Cache-Control, ETag, and Last-Modified govern caching and conditional requests (304). Cookies + tokens carry state over stateless HTTP. CORS controls cross-origin access. REST models resources with URLs + HTTP verbs + status codes; alternatives include GraphQL (client-shaped queries) and gRPC (HTTP/2 + protobuf, for service-to-service).'},
    ],
    complexity:'HTTP/1.1 head-of-line blocked · HTTP/2 multiplexed · HTTP/3 0-RTT over QUIC',
    code:`// A REST resource with correct verbs, status codes, and caching
// GET    /users/42        → 200 + user JSON     (safe, cacheable)
// POST   /users           → 201 + Location hdr  (create)
// PUT    /users/42        → 200/204             (idempotent replace)
// DELETE /users/42        → 204                 (idempotent)

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'max-age=60, stale-while-revalidate=300',
  'ETag': '"a1b2c3"',                 // conditional requests → 304
};
// Conditional GET: client sends If-None-Match: "a1b2c3"
//   → server replies 304 Not Modified (no body) if unchanged → saves bandwidth`
  },

  // ── Databases ─────────────────────────────────────────────────────────
  { id:'sql-mastery', cat:'db', title:'SQL Mastery', icon:'⊞', viz:'none', color:T.pk,
    tags:['Joins','Window Functions','CTEs','Aggregation','Query Optimization'],
    overview:'SQL is the declarative language of relational data: you describe what you want and the query planner figures out how. Mastery means joins, aggregation, window functions, CTEs, and reading execution plans — skills that separate "can query" from "can model and optimize data".',
    points:[
      {t:'Joins',d:'INNER (matching rows in both), LEFT/RIGHT OUTER (keep all of one side, NULLs for non-matches), FULL OUTER (all rows both sides), CROSS (cartesian product), and SELF join (a table to itself, e.g. employee→manager). The join key and index determine speed; a missing index turns a join into a nested-loop scan.'},
      {t:'Aggregation & GROUP BY',d:'COUNT, SUM, AVG, MIN, MAX collapse groups. GROUP BY defines the buckets; HAVING filters groups (WHERE filters rows before grouping — order matters). GROUPING SETS, ROLLUP, and CUBE produce subtotals. A classic bug: selecting a non-aggregated column not in GROUP BY.'},
      {t:'Window functions',d:'Compute across a "window" of rows WITHOUT collapsing them: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG/LEAD (previous/next row), running totals (SUM() OVER (ORDER BY …)), and moving averages. PARTITION BY resets per group. These solve "top N per category", "running balance", and "compare to previous period" elegantly.'},
      {t:'CTEs & subqueries',d:'Common Table Expressions (WITH …) name intermediate results for readability and reuse; RECURSIVE CTEs traverse hierarchies/graphs (org charts, bill-of-materials). Correlated subqueries reference the outer query per row (powerful but can be slow). Often a JOIN or window function is faster than a correlated subquery.'},
      {t:'Query optimization',d:'Read the plan with EXPLAIN/ANALYZE. Watch for sequential scans on big tables (add an index), nested loops on large joins (hash/merge join is better), and bad row estimates (update statistics). Indexes speed reads but slow writes; covering indexes serve a query without touching the table. SARGable predicates (no functions on indexed columns) let indexes be used.'},
    ],
    complexity:'Indexed lookup O(log n) · Full scan O(n) · Join depends on strategy & indexes',
    code:`-- Top 3 highest-paid employees PER department (window function)
WITH ranked AS (
  SELECT
    name, department, salary,
    DENSE_RANK() OVER (
      PARTITION BY department
      ORDER BY salary DESC
    ) AS rnk,
    AVG(salary) OVER (PARTITION BY department) AS dept_avg
  FROM employees
)
SELECT name, department, salary, dept_avg
FROM ranked
WHERE rnk <= 3
ORDER BY department, salary DESC;

-- Recursive CTE: walk an org chart from the CEO down
WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 1 AS depth FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.depth + 1
  FROM employees e JOIN chain c ON e.manager_id = c.id
)
SELECT * FROM chain ORDER BY depth;`
  },

  { id:'database-indexing', cat:'db', title:'Database Indexing & Transactions', icon:'⊟', viz:'none', color:T.pk,
    tags:['B+Tree','ACID','Isolation Levels','MVCC','CAP Theorem','Sharding'],
    overview:'How databases stay fast and correct under concurrency. Indexes (mostly B+ trees) turn O(n) scans into O(log n) lookups. Transactions give ACID guarantees; isolation levels trade consistency for concurrency; and distributed databases navigate the CAP theorem. This is the core of backend system design.',
    points:[
      {t:'B+ tree indexes',d:'Most relational indexes are B+ trees: high fan-out (hundreds of keys per node) means height 3–4 even for billions of rows, so lookups are ~O(log n) with few disk reads. Leaves are linked for fast range scans. Clustered index = table physically ordered by key (one per table); secondary indexes point back to it. Hash indexes give O(1) equality but no ranges.'},
      {t:'Index trade-offs',d:'Indexes speed reads but slow writes (every insert/update maintains them) and consume space. Composite index (a,b,c) serves queries filtering a, or a+b, or a+b+c (leftmost prefix) — not b alone. Covering indexes include all selected columns so the table isn\'t touched. Over-indexing hurts write-heavy workloads.'},
      {t:'ACID transactions',d:'Atomicity (all-or-nothing, via write-ahead logging + rollback), Consistency (constraints always hold), Isolation (concurrent txns don\'t corrupt each other), Durability (committed data survives crashes, via the WAL/fsync). These guarantees are what make money transfers and bookings safe.'},
      {t:'Isolation levels & MVCC',d:'From weak to strong: Read Uncommitted (dirty reads), Read Committed, Repeatable Read, Serializable. Anomalies prevented in order: dirty read → non-repeatable read → phantom read. MVCC (Postgres, MySQL InnoDB) keeps multiple row versions so readers never block writers — readers see a consistent snapshot. Serializable may use predicate locks or SSI.'},
      {t:'CAP & scaling',d:'CAP: under a network Partition, choose Consistency or Availability. CP systems (HBase, etcd) reject requests to stay consistent; AP systems (Cassandra, Dynamo) stay up but may serve stale data (eventual consistency). Scale reads with replicas, capacity with sharding (partition by key); cross-shard transactions are hard (2PC, sagas). PACELC extends CAP to the normal (no-partition) case: latency vs consistency.'},
    ],
    complexity:'Indexed lookup O(log n) · Range scan O(log n + k) · Txn overhead from locking/MVCC',
    code:`-- Composite & covering indexes
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
--   serves: WHERE user_id = ?  AND created_at > ?   (leftmost prefix)
--   does NOT serve: WHERE created_at > ?  alone

-- Covering index: query answered from the index only (no table fetch)
CREATE INDEX idx_cover ON orders(user_id, status) INCLUDE (total);
SELECT total FROM orders WHERE user_id = 7 AND status = 'paid';

-- A transaction: atomic money transfer (all-or-nothing)
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;                       -- ROLLBACK undoes both on any failure`
  },

  // ── Computer Vision ───────────────────────────────────────────────────
  { id:'object-detection', cat:'cv', title:'Object Detection', icon:'⊡', viz:'none', color:CV,
    tags:['YOLO','R-CNN','IoU','NMS','Anchor Boxes','mAP'],
    overview:'Object detection finds WHAT and WHERE — predicting bounding boxes + class labels for every object in an image. It splits into two-stage detectors (R-CNN family: accurate, slower) and one-stage detectors (YOLO, SSD: real-time). Key concepts: IoU, anchor boxes, non-max suppression, and mAP for evaluation.',
    points:[
      {t:'Two-stage: R-CNN family',d:'R-CNN → Fast R-CNN → Faster R-CNN. A Region Proposal Network suggests candidate boxes, then a head classifies and refines each. RoI Pooling/Align extracts fixed-size features per region. Accurate but slower. Mask R-CNN adds a segmentation branch for per-pixel masks (instance segmentation).'},
      {t:'One-stage: YOLO & SSD',d:'You Only Look Once divides the image into a grid; each cell directly predicts boxes + class probabilities in a single forward pass — real-time (30–150 FPS). SSD uses multi-scale feature maps. One-stage historically traded a little accuracy for huge speed; modern YOLO versions (v5–v10) close the gap and dominate production.'},
      {t:'IoU — Intersection over Union',d:'IoU = area(overlap) / area(union) of two boxes, ∈ [0,1]. It measures localization quality: a prediction counts as correct if IoU with ground truth ≥ a threshold (e.g. 0.5). IoU also drives anchor matching during training and NMS at inference.'},
      {t:'Non-Max Suppression (NMS)',d:'Detectors emit many overlapping boxes per object. NMS keeps the highest-confidence box, removes others with IoU above a threshold, and repeats. Soft-NMS decays scores instead of deleting. Without NMS you get dozens of duplicate boxes around each object.'},
      {t:'Anchors & mAP',d:'Anchor boxes are pre-defined box shapes/scales per location; the network predicts offsets from them (anchor-free detectors like FCOS/CenterNet skip these). Evaluation: Average Precision = area under the precision-recall curve per class; mAP averages AP across classes (and IoU thresholds, e.g. COCO\'s mAP@[.5:.95]). Higher mAP = better detector.'},
    ],
    complexity:'One-stage real-time (single pass) · Two-stage slower, higher accuracy',
    code:`// IoU and greedy Non-Max Suppression
function iou(a, b) {                       // boxes: [x1, y1, x2, y2]
  const x1 = Math.max(a[0], b[0]), y1 = Math.max(a[1], b[1]);
  const x2 = Math.min(a[2], b[2]), y2 = Math.min(a[3], b[3]);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const areaA = (a[2]-a[0]) * (a[3]-a[1]);
  const areaB = (b[2]-b[0]) * (b[3]-b[1]);
  return inter / (areaA + areaB - inter);
}
function nms(boxes, scores, iouThresh = 0.5) {
  const idx = scores.map((s, i) => i).sort((a, b) => scores[b] - scores[a]);
  const keep = [];
  while (idx.length) {
    const cur = idx.shift();
    keep.push(cur);
    for (let i = idx.length - 1; i >= 0; i--)
      if (iou(boxes[cur], boxes[idx[i]]) > iouThresh) idx.splice(i, 1);
  }
  return keep;                              // surviving box indices
}`
  },

  { id:'vision-transformers', cat:'cv', title:'Vision Transformers (ViT)', icon:'⊞', viz:'attention', color:CV,
    tags:['Patches','Self-Attention','CLS Token','DETR','CLIP','Segmentation'],
    overview:'Vision Transformers apply the transformer architecture to images by treating patches as tokens — challenging the long dominance of CNNs. With enough data they match or beat CNNs, capture global context from layer one, and unlock multimodal models like CLIP. They power modern detection, segmentation, and image-text systems.',
    points:[
      {t:'Images as sequences of patches',d:'ViT splits an image into fixed patches (e.g. 16×16), flattens and linearly projects each into a token embedding, prepends a learnable [CLS] token, and adds positional embeddings (patches have no inherent order). The sequence then flows through a standard transformer encoder — no convolutions.'},
      {t:'Global attention vs local convolution',d:'CNNs build up receptive fields gradually through stacked local kernels; ViT\'s self-attention relates every patch to every other patch from the first layer, capturing long-range/global context immediately. The cost: attention is O(n²) in the number of patches, so high-resolution images are expensive (windowed attention in Swin fixes this).'},
      {t:'Data hunger & inductive bias',d:'CNNs bake in translation equivariance and locality — strong priors that help on small datasets. ViT has weaker priors, so it needs large data (JFT-300M) or heavy augmentation/distillation (DeiT) to shine. Hybrid models and Swin Transformer reintroduce locality/hierarchy to get the best of both.'},
      {t:'Detection & segmentation',d:'DETR reframes detection as set prediction: a transformer + learned object queries directly output boxes, with bipartite (Hungarian) matching as the loss — no anchors or NMS. SegFormer/Segmenter/Mask2Former use transformer encoders for semantic and panoptic segmentation, often beating CNN baselines.'},
      {t:'Multimodal: CLIP & beyond',d:'CLIP trains an image encoder (ViT) and a text encoder jointly with a contrastive loss so matching image-text pairs align in a shared embedding space. This enables zero-shot classification ("a photo of a {label}") and powers text-to-image generation (the conditioning in diffusion models). ViTs are the visual backbone of modern multimodal AI.'},
    ],
    complexity:'Self-attention O(n²·d) in patches · Patchify O(1) · Scales with data',
    code:`# Vision Transformer patch embedding (PyTorch-style pseudocode)
import torch, torch.nn as nn

class PatchEmbed(nn.Module):
    def __init__(self, img=224, patch=16, dim=768):
        super().__init__()
        self.n_patches = (img // patch) ** 2          # 14×14 = 196 tokens
        self.proj = nn.Conv2d(3, dim, kernel_size=patch, stride=patch)
        self.cls = nn.Parameter(torch.zeros(1, 1, dim))         # [CLS] token
        self.pos = nn.Parameter(torch.zeros(1, self.n_patches + 1, dim))

    def forward(self, x):                              # x: [B, 3, 224, 224]
        x = self.proj(x).flatten(2).transpose(1, 2)    # [B, 196, 768]
        cls = self.cls.expand(x.shape[0], -1, -1)
        x = torch.cat([cls, x], dim=1) + self.pos      # prepend CLS + pos emb
        return x                                       # → transformer encoder`
  },

  // ── MLOps ─────────────────────────────────────────────────────────────
  { id:'ml-deployment', cat:'mlops', title:'ML Deployment & Serving', icon:'⚙', viz:'none', color:MLOPS,
    tags:['Docker','Kubernetes','Model Serving','CI/CD','Batch vs Online','Quantization'],
    overview:'Getting a trained model into production reliably. This spans packaging (Docker), orchestration (Kubernetes), serving patterns (online/batch/streaming), optimization (quantization, batching), and automation (CI/CD for models). A model is worthless until it serves predictions at the required latency, scale, and cost.',
    points:[
      {t:'Containerization',d:'Docker packages the model + code + exact dependencies into a reproducible image, eliminating "works on my machine". Pin versions, use slim base images, multi-stage builds to shrink size, and bake the model weights in (or pull from object storage at startup). The image is the deployable unit.'},
      {t:'Orchestration with Kubernetes',d:'K8s runs containers at scale: deployments (rolling updates, rollbacks), horizontal pod autoscaling (scale on CPU/GPU/QPS), health probes (liveness/readiness), and resource limits. For ML, GPU scheduling, node pools, and tools like KServe/Seldon add model-specific features (canary, A/B, autoscale-to-zero).'},
      {t:'Serving patterns',d:'Online/real-time: low-latency request/response (REST/gRPC) behind a load balancer — fraud checks, recommendations. Batch: score large datasets offline on a schedule — cheaper, higher throughput. Streaming: process events continuously (Kafka + Flink). Choose by latency SLA and freshness needs. Dedicated servers: TorchServe, TF Serving, Triton, vLLM (for LLMs).'},
      {t:'Inference optimization',d:'Dynamic batching groups concurrent requests to maximize GPU utilization. Quantization (FP16/INT8/INT4) shrinks models and speeds inference with minor accuracy loss. Distillation trains a small fast student. Caching, KV-cache (for LLMs), ONNX/TensorRT compilation, and speculative decoding cut latency and cost — often the difference between viable and not.'},
      {t:'CI/CD & model registry',d:'Automate test → build → deploy. A model registry (MLflow, W&B) versions models with metadata and lineage. Deployment strategies: shadow (run new model silently, compare), canary (route 5% traffic), blue-green (instant switch + rollback), A/B (measure business metrics). Reproducibility needs versioned code, data, and config — not just weights.'},
    ],
    complexity:'Latency (p50/p99), throughput (QPS), cost/inference, and availability are the SLOs',
    code:`# Minimal model-serving API (FastAPI) — containerize this with Docker
from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()
model = joblib.load("model.pkl")          # loaded once at startup

class Req(BaseModel):
    features: list[float]

@app.get("/healthz")                      # K8s readiness/liveness probe
def health(): return {"status": "ok"}

@app.post("/predict")
def predict(r: Req):
    pred = model.predict([r.features])[0]
    return {"prediction": float(pred)}

# Dockerfile (multi-stage, slim):
#   FROM python:3.11-slim
#   COPY requirements.txt . && RUN pip install --no-cache-dir -r requirements.txt
#   COPY . . && CMD ["uvicorn","app:app","--host","0.0.0.0","--port","8080"]`
  },

  { id:'ml-monitoring', cat:'mlops', title:'ML Monitoring & Drift', icon:'⚡', viz:'none', color:MLOPS,
    tags:['Data Drift','Concept Drift','Observability','Feature Store','Retraining'],
    overview:'Models decay silently in production as the world changes. Monitoring catches data drift, concept drift, and pipeline failures before they wreck business metrics. Combined with feature stores and automated retraining, it closes the ML lifecycle loop — the part that separates a demo from a durable system.',
    points:[
      {t:'Data drift',d:'The input distribution shifts from training (covariate shift): new user demographics, seasonality, a changed upstream feature. The model still "works" but on unfamiliar inputs. Detect with statistical tests (KS test, PSI — Population Stability Index, KL divergence) comparing live feature distributions to a training baseline, per feature.'},
      {t:'Concept drift',d:'The relationship between inputs and target changes — P(y|x) shifts even if P(x) is stable (fraud tactics evolve, user preferences change post-pandemic). Harder to detect without labels; monitor prediction distributions, proxy metrics, and delayed ground truth. Often requires retraining on recent data.'},
      {t:'What to monitor',d:'Three layers: (1) operational — latency, throughput, error rate, resource use (standard SRE); (2) data quality — schema, nulls, ranges, freshness, training/serving skew; (3) model quality — prediction distribution, confidence, and (when labels arrive) accuracy/AUC over time. Alert on drift and degradation, not just crashes.'},
      {t:'Feature stores',d:'A feature store (Feast, Tecton) centralizes feature definitions, serving them consistently for training (offline, point-in-time correct) and inference (online, low-latency) — eliminating training/serving skew, the most common silent ML bug. It also enables reuse, versioning, and backfills across teams.'},
      {t:'Retraining & the loop',d:'Trigger retraining on a schedule, on drift detection, or on performance drops. Pipelines (Airflow, Kubeflow, Dagster) automate ingest → validate → train → evaluate → deploy. Always gate on an evaluation set and ship via canary/shadow with rollback. Track everything (data + model + metrics) for reproducibility and auditing. This feedback loop is the heart of MLOps.'},
    ],
    complexity:'Drift tests O(n) per feature window · Continuous monitoring + retraining loop',
    code:`# Population Stability Index (PSI) — detect feature drift
import numpy as np

def psi(expected, actual, buckets=10):
    breaks = np.percentile(expected, np.linspace(0, 100, buckets + 1))
    breaks[0], breaks[-1] = -np.inf, np.inf
    e = np.histogram(expected, breaks)[0] / len(expected)
    a = np.histogram(actual,   breaks)[0] / len(actual)
    e, a = np.clip(e, 1e-6, None), np.clip(a, 1e-6, None)
    return np.sum((a - e) * np.log(a / e))

score = psi(train_feature, live_feature)
#  PSI < 0.1  → no significant drift
#  0.1–0.25   → moderate drift, investigate
#  > 0.25     → major drift → retrain`
  },

  // ── Deep Learning ─────────────────────────────────────────────────────
  { id:'rnn-lstm', cat:'dl', title:'RNNs, LSTM & GRU', icon:'↻', viz:'none', color:T.mg,
    tags:['Sequences','Vanishing Gradient','LSTM Gates','GRU','BPTT'],
    overview:'Recurrent networks process sequences by maintaining a hidden state that carries information across time steps. Vanilla RNNs struggle with long-range dependencies (vanishing gradients); LSTM and GRU add gating to remember and forget selectively. They ruled NLP and time-series before transformers — and still matter for streaming and on-device tasks.',
    points:[
      {t:'The recurrent idea',d:'At each step t, hₜ = f(W·xₜ + U·hₜ₋₁ + b): the new hidden state depends on the current input and the previous state. The same weights are reused across all time steps (weight sharing), so an RNN handles variable-length sequences and learns temporal patterns. The final state summarizes the whole sequence.'},
      {t:'Vanishing/exploding gradients',d:'Training uses Backpropagation Through Time — unrolling the network across steps. Gradients multiply by the recurrent weight repeatedly; if <1 they vanish (can\'t learn long dependencies), if >1 they explode (instability). This limits vanilla RNNs to short contexts. Gradient clipping tames explosion; gating fixes vanishing.'},
      {t:'LSTM gates',d:'Long Short-Term Memory adds a cell state (a gradient "highway") and three gates: forget (what to discard from the cell), input (what new info to write), and output (what to expose as the hidden state). The additive cell update lets gradients flow far back, enabling long-range memory. ~4× the parameters of a vanilla RNN.'},
      {t:'GRU — the lean alternative',d:'Gated Recurrent Unit merges the cell and hidden state and uses two gates (reset, update). Fewer parameters, faster to train, often comparable accuracy to LSTM. A good default when you want recurrence without LSTM\'s cost. Choice between them is usually empirical.'},
      {t:'Use cases & the transformer shift',d:'RNNs powered machine translation (seq2seq + attention), speech recognition, and time-series forecasting. Transformers replaced them for most NLP because attention parallelizes across the sequence (RNNs are inherently sequential) and captures long range better. RNNs persist where streaming, low latency, small models, or strict ordering matter.'},
    ],
    complexity:'O(seq_len) sequential (no parallelism over time) · O(d²) per step · memory O(seq_len)',
    code:`# One LSTM cell step (NumPy-style)
import numpy as np
def sigmoid(x): return 1 / (1 + np.exp(-x))

def lstm_step(x, h_prev, c_prev, W, U, b):
    z = W @ x + U @ h_prev + b              # combined gate pre-activations
    H = h_prev.shape[0]
    f = sigmoid(z[0:H])                       # forget gate
    i = sigmoid(z[H:2*H])                     # input gate
    o = sigmoid(z[2*H:3*H])                   # output gate
    g = np.tanh(z[3*H:4*H])                   # candidate cell
    c = f * c_prev + i * g                    # additive update = gradient highway
    h = o * np.tanh(c)                        # exposed hidden state
    return h, c
# The additive cell update (c = f*c + i*g) is why LSTMs remember
# long-range dependencies that vanilla RNNs forget.`
  },

  { id:'generative-models', cat:'dl', title:'Generative Models (GAN · VAE · Diffusion)', icon:'◎', viz:'none', color:T.mg,
    tags:['GAN','VAE','Diffusion','Latent Space','DDPM','Stable Diffusion'],
    overview:'Generative models learn a data distribution and sample new examples — images, audio, molecules. Three families dominate: GANs (sharp, adversarial, tricky to train), VAEs (principled latent spaces, blurrier), and diffusion models (current state of the art for images, powering DALL·E, Stable Diffusion, Midjourney).',
    points:[
      {t:'VAE — variational autoencoder',d:'An encoder maps inputs to a distribution over a latent space (mean + variance); a decoder reconstructs from samples. Loss = reconstruction + KL term pulling the latent toward a standard Gaussian prior. The reparameterization trick (z = μ + σ·ε) keeps it differentiable. Gives a smooth, sample-able latent space; outputs tend to be blurry.'},
      {t:'GAN — adversarial game',d:'A generator creates fakes; a discriminator judges real vs fake. They train adversarially — G improves to fool D, D improves to catch G — toward a Nash equilibrium. Produces sharp, realistic images but is unstable: mode collapse (G makes few varieties), vanishing discriminator gradients. Tricks: WGAN-GP, spectral norm, StyleGAN\'s architecture.'},
      {t:'Diffusion — denoising',d:'Forward process gradually adds Gaussian noise to data over T steps until it is pure noise. A network learns the reverse: predict and remove noise step by step (DDPM). Sampling starts from noise and iteratively denoises into an image. Training is stable (just a denoising regression), and quality + diversity beat GANs — now the dominant image paradigm.'},
      {t:'Conditioning & guidance',d:'Text-to-image conditions the denoiser on a text embedding (CLIP/T5). Classifier-free guidance interpolates between conditional and unconditional predictions to boost prompt adherence (higher guidance = more literal, less diverse). Latent diffusion (Stable Diffusion) runs the process in a compressed VAE latent space — far cheaper than pixel space.'},
      {t:'Trade-offs & uses',d:'VAEs: stable, great latents, blurrier — anomaly detection, representation learning. GANs: fast single-pass sampling, super sharp — super-resolution, style transfer, faces. Diffusion: best quality/diversity but slow (many steps; accelerated by DDIM, distillation, consistency models). Applications: art, data augmentation, drug/material design, video and 3D generation.'},
    ],
    complexity:'GAN/VAE: 1 forward pass to sample · Diffusion: T denoising steps (slower)',
    code:`# Diffusion: forward noising + training objective (PyTorch-style)
import torch
def add_noise(x0, t, betas):
    alpha_bar = torch.cumprod(1 - betas, dim=0)[t]      # ᾱ_t
    eps = torch.randn_like(x0)                            # target noise
    xt = alpha_bar.sqrt() * x0 + (1 - alpha_bar).sqrt() * eps
    return xt, eps                                        # noisy image, true noise

def training_step(model, x0, betas, T):
    t = torch.randint(0, T, (x0.size(0),))               # random timestep
    xt, eps = add_noise(x0, t, betas)
    eps_pred = model(xt, t)                               # predict the noise
    return ((eps_pred - eps) ** 2).mean()                # simple MSE loss
# Sampling: start from pure noise x_T ~ N(0, I), then iteratively
# subtract the predicted noise for t = T-1 ... 0  →  a clean image.`
  },

  // ── NLP & LLMs ────────────────────────────────────────────────────────
  { id:'rag-systems', cat:'nlp', title:'RAG & Vector Databases', icon:'⊛', viz:'none', color:NLP,
    tags:['Retrieval','Embeddings','Vector DB','Chunking','Reranking','Grounding'],
    overview:'Retrieval-Augmented Generation grounds an LLM in external knowledge: retrieve relevant documents, then condition generation on them. It reduces hallucination, adds fresh/private data without retraining, and provides citations. The backbone of most production LLM apps — chatbots over your docs, search, and copilots.',
    points:[
      {t:'Why RAG',d:'LLMs have a fixed training cutoff, no access to your private data, and hallucinate confidently. RAG injects relevant context at query time so the model answers from real sources — updatable instantly (just change the documents), cheaper than fine-tuning, and citable. Trade-off: retrieval quality caps answer quality ("garbage in, garbage out").'},
      {t:'Chunking & embedding',d:'Split documents into chunks (by tokens/sentences/semantics, often with overlap to preserve context). Embed each chunk into a vector with an embedding model (e.g. text-embedding-3, BGE). Chunk size matters: too small loses context, too big dilutes relevance and wastes the context window. Store vectors + metadata in a vector DB.'},
      {t:'Vector search (ANN)',d:'At query time, embed the question and find nearest-neighbor chunks by cosine similarity. Exact search is O(n·d); approximate nearest neighbor (HNSW graphs, IVF, product quantization) makes it sub-linear at billion scale. Vector DBs: Pinecone, Weaviate, Qdrant, Milvus, pgvector. Tune recall vs latency via index parameters.'},
      {t:'Retrieve → rerank → generate',d:'Retrieve top-k candidates (cheap bi-encoder), optionally rerank with a slower cross-encoder for precision, then stuff the best chunks into the prompt with the question. Hybrid search combines dense vectors with keyword (BM25) for exact terms/names. Good prompt templates instruct the model to answer only from context and cite sources.'},
      {t:'Advanced patterns & pitfalls',d:'Query rewriting/expansion, HyDE (embed a hypothetical answer), multi-hop retrieval, parent-document retrieval, and metadata filtering improve recall. Agentic RAG lets the model decide when/what to retrieve. Pitfalls: poor chunking, embedding/domain mismatch, lost-in-the-middle (models ignore mid-context), and stale indexes. Evaluate with retrieval metrics (recall@k) and answer faithfulness.'},
    ],
    complexity:'ANN search sub-linear (HNSW) · End-to-end latency = retrieve + rerank + generate',
    code:`# Minimal RAG pipeline (pseudocode)
def rag_answer(question, vector_db, llm, k=5):
    q_emb = embed(question)                          # 1. embed query
    chunks = vector_db.search(q_emb, top_k=k * 4)    # 2. ANN retrieve
    chunks = rerank(question, chunks)[:k]            # 3. cross-encoder rerank
    context = "\\n\\n".join(c.text for c in chunks)

    prompt = f'''Answer using ONLY the context. Cite sources.
If the answer isn't in the context, say you don't know.

Context:
{context}

Question: {question}'''
    return llm.generate(prompt), [c.source for c in chunks]  # answer + citations`
  },

  { id:'prompt-engineering', cat:'nlp', title:'Prompt Engineering & Agents', icon:'⊛', viz:'none', color:NLP,
    tags:['Few-Shot','Chain-of-Thought','ReAct','Tool Use','Structured Output'],
    overview:'Prompt engineering shapes LLM behavior through input design — no weight changes. Techniques range from zero/few-shot prompting to chain-of-thought reasoning to agentic loops with tools. As models grow more capable, well-structured prompts and tool access often beat fine-tuning for getting reliable, controllable results.',
    points:[
      {t:'Zero-shot, few-shot, and roles',d:'Zero-shot: just ask. Few-shot: include 2–5 worked examples to demonstrate the desired format/behavior (in-context learning — no training). A clear system/role message sets persona, constraints, and output format. Be specific: state the task, the format, the constraints, and what to do on uncertainty. Order and quality of examples matter.'},
      {t:'Chain-of-thought (CoT)',d:'Asking the model to "think step by step" before answering dramatically improves reasoning on math/logic by allocating intermediate computation. Variants: zero-shot CoT (the magic phrase), few-shot CoT (show reasoning in examples), self-consistency (sample several chains, majority-vote the answer), and tree-of-thought (explore branches). Reasoning models (o1-style) internalize this.'},
      {t:'Structured output & constraints',d:'Force machine-readable output: request JSON, provide a schema, or use constrained decoding / function-calling so outputs are valid by construction. This is essential for pipelines. Lower temperature for determinism. Validate and retry on parse failure. Many APIs offer native JSON-mode / tool schemas.'},
      {t:'Tool use & ReAct agents',d:'Give the model tools (search, calculator, code execution, APIs) it can call. ReAct interleaves Reasoning and Acting: think → call a tool → observe result → repeat until done. This grounds answers in real data and actions. Agent frameworks (LangChain, LlamaIndex, function-calling) orchestrate the loop, memory, and tool routing.'},
      {t:'Reliability & pitfalls',d:'Mitigate hallucination with grounding (RAG), "say I don\'t know" instructions, and verification steps. Guard against prompt injection (untrusted input overriding instructions) — separate system vs user content, sanitize tool outputs. Watch context-window limits, cost/latency of long prompts, and sensitivity to phrasing. Always evaluate prompts on a test set, not vibes.'},
    ],
    complexity:'No training cost · Latency/cost scale with prompt + output tokens · Iterate empirically',
    code:`# Few-shot + chain-of-thought + structured output
prompt = """You are a precise data extractor. Think step by step,
then output ONLY valid JSON: {"sentiment": "...", "score": 0-1}.

Example:
Review: "Loved it, works perfectly!"
Reasoning: strong positive language, no complaints.
Output: {"sentiment": "positive", "score": 0.95}

Review: "It broke after two days."
Reasoning: """

# Self-consistency: sample N chains, majority-vote the final answer
from collections import Counter
answers = [llm(prompt, temperature=0.7) for _ in range(5)]
final = Counter(extract_json(a)["sentiment"] for a in answers).most_common(1)[0][0]`
  },

  // ── Machine Learning ──────────────────────────────────────────────────
  { id:'naive-bayes-knn', cat:'ml', title:'Naive Bayes & k-NN', icon:'◑', viz:'none', color:T.rd,
    tags:['Bayes','Conditional Independence','Lazy Learning','Distance Metrics','Curse of Dimensionality'],
    overview:'Two classic, intuitive classifiers. Naive Bayes is a fast probabilistic model assuming feature independence — shockingly effective for text. k-Nearest Neighbors is a lazy, non-parametric method that classifies by majority vote of the closest training points. Both are simple, interpretable baselines every ML practitioner should know.',
    points:[
      {t:'Naive Bayes — the model',d:'Applies Bayes\' theorem with a "naive" assumption: features are conditionally independent given the class. P(class|features) ∝ P(class)·∏ P(featureᵢ|class). Despite the unrealistic independence assumption, it works remarkably well, trains in one pass O(n·d), and needs little data. Variants: Multinomial (counts, text), Bernoulli (binary), Gaussian (continuous features).'},
      {t:'Why it works for text',d:'Spam filtering and document classification treat word occurrences as features. Even though words aren\'t truly independent, the decision boundary is often still correct. Use log-probabilities to avoid underflow, and Laplace (add-1) smoothing so an unseen word doesn\'t zero out the whole product. Fast to train and serve.'},
      {t:'k-NN — lazy learning',d:'No training phase — just store the data. To classify a point, find its k nearest neighbors (by Euclidean/Manhattan/cosine distance) and take a majority vote (or distance-weighted vote). k controls bias-variance: small k = noisy/overfit, large k = smooth/underfit. Regression: average the neighbors\' values. Naturally handles multi-class and complex boundaries.'},
      {t:'k-NN costs & curse of dimensionality',d:'Prediction is O(n·d) per query (scan all points) — slow at scale; speed up with KD-trees/Ball-trees (low dim) or ANN (high dim). Features must be scaled (distance is dominated by large-range features). In high dimensions, distances concentrate — everything is roughly equidistant — so k-NN degrades (the curse of dimensionality); reduce dimensions first.'},
      {t:'When to use each',d:'Naive Bayes: text/spam/sentiment, high-dimensional sparse features, tiny datasets, real-time needs, strong baseline. k-NN: small/medium datasets, low dimensions, irregular decision boundaries, recommendation (similar items/users), and as a simple baseline. Both are great first models before reaching for heavier methods.'},
    ],
    complexity:'NB: train O(n·d), predict O(c·d) · k-NN: train O(1), predict O(n·d)',
    code:`# Gaussian Naive Bayes from scratch (core idea)
import numpy as np
class GaussianNB:
    def fit(self, X, y):
        self.classes = np.unique(y)
        self.mean, self.var, self.prior = {}, {}, {}
        for c in self.classes:
            Xc = X[y == c]
            self.mean[c]  = Xc.mean(axis=0)
            self.var[c]   = Xc.var(axis=0) + 1e-9      # avoid /0
            self.prior[c] = len(Xc) / len(X)
    def predict(self, X):
        out = []
        for x in X:
            best, best_lp = None, -np.inf
            for c in self.classes:                      # log P(c) + Σ log P(xᵢ|c)
                lp = np.log(self.prior[c]) + np.sum(
                    -0.5*np.log(2*np.pi*self.var[c]) -
                    (x - self.mean[c])**2 / (2*self.var[c]))
                if lp > best_lp: best, best_lp = c, lp
            out.append(best)
        return np.array(out)`
  },

  { id:'feature-engineering', cat:'ml', title:'Feature Engineering', icon:'◐', viz:'none', color:T.rd,
    tags:['Scaling','Encoding','Selection','Imputation','Leakage','Interactions'],
    overview:'"Applied ML is basically feature engineering." Transforming raw data into informative features often beats fancier models. It covers scaling, encoding categoricals, handling missing values, creating interactions, and selecting the features that matter — all while avoiding the silent killer: data leakage.',
    points:[
      {t:'Scaling & normalization',d:'Standardization (z-score: (x−μ)/σ) and min-max scaling put features on comparable ranges — essential for distance-based (k-NN, SVM, k-means) and gradient methods (faster convergence). Tree models don\'t need it. Log/Box-Cox transforms tame skew and heavy tails. Fit the scaler on TRAIN only, then apply to test (else leakage).'},
      {t:'Encoding categoricals',d:'One-hot for low-cardinality nominal features. Ordinal encoding for ordered categories. Target/mean encoding for high cardinality (encode by the target mean — powerful but leak-prone; use cross-fold/smoothing). Frequency encoding, hashing for huge vocabularies, and learned embeddings for very high cardinality (deep models). Beware unseen categories at inference.'},
      {t:'Missing values',d:'Understand why data is missing (random vs systematic). Strategies: drop (if rare), impute (mean/median/mode, or model-based like KNN/MICE), or add a "was-missing" indicator (the missingness itself can be predictive). Tree models (XGBoost) handle NaNs natively. Always impute using train statistics only.'},
      {t:'Creating & selecting features',d:'Domain-driven: ratios, differences, date parts (day-of-week, is-holiday), aggregations (per-user counts/means), text features (TF-IDF, n-grams), and polynomial/interaction terms. Selection: filter (correlation, mutual information, χ²), wrapper (recursive feature elimination), embedded (L1/Lasso, tree importances, SHAP). Fewer, better features reduce overfitting and cost.'},
      {t:'Data leakage — the silent killer',d:'Leakage = information from the future or the target sneaking into features, giving great validation scores that collapse in production. Causes: scaling/imputing before the train/test split, target encoding without folds, features computed using the label, time series shuffled instead of split by time, IDs that proxy the target. Always split FIRST, then transform; for time series, split chronologically.'},
    ],
    complexity:'Transforms typically O(n·d) · The highest-ROI step in most ML projects',
    code:`# Leak-free preprocessing with a scikit-learn Pipeline
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

num = Pipeline([("impute", SimpleImputer(strategy="median")),
                ("scale", StandardScaler())])
cat = Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore"))])

pre = ColumnTransformer([("num", num, num_cols),
                         ("cat", cat, cat_cols)])

# Fit on TRAIN only — the pipeline learns stats from train, applies to test.
# This prevents leakage because transforms are part of cross-validation.
model = Pipeline([("pre", pre), ("clf", SomeClassifier())])
model.fit(X_train, y_train)`
  },

];
