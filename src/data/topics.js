import { T } from '../theme.js';

export const TOPICS = [
  // ── Core DSA ──────────────────────────────────────────────────────────
  { id:'arrays', cat:'dsa', title:'Arrays', icon:'▦', viz:'sorting', color:T.cy,
    tags:['O(1) access','Contiguous','Prefix Sum','Two Pointers','Kadane','Dutch Flag'],
    overview:'Arrays are the most fundamental data structure — a contiguous block of memory storing fixed-size sequences. They offer O(1) random access making them the backbone of nearly every algorithm. Deep mastery means knowing 10+ patterns: prefix sum, sliding window, two pointers, Kadane, Dutch national flag, binary search on arrays, and more.',
    points:[
      {t:'Memory Layout & Cache Behavior',d:'Elements occupy contiguous addresses. arr[i] is at base + i×sizeof(T). The CPU prefetches cache lines (typically 64 bytes = 16 ints). Sequential access = near 100% cache hit rate. Sparse random access = cache misses that cost 100-300 CPU cycles each. This is why O(n) array traversal often beats O(log n) pointer-chasing on linked lists in practice — cache effects dominate.'},
      {t:'Prefix Sum — O(1) range queries',d:'Build prefix[i] = arr[0]+arr[1]+...+arr[i-1] in O(n). Range sum [l,r] = prefix[r+1]-prefix[l] in O(1). 2D prefix sum handles rectangle queries. Applications: sliding window sum, subarray count with condition, number of subarrays with XOR = k (combine with hash map). Key invariant: prefix[0]=0 simplifies boundary handling.'},
      {t:'Sliding Window — the pattern',d:'Fixed size: maintain window of size k, subtract outgoing element, add incoming. O(n). Variable size: two pointers lo/hi. Expand hi for valid windows, shrink lo when invalid. Crucial insight: when condition breaks, shrink from lo — NEVER reset to lo=hi. Problems: longest substring without repeat, minimum window substring, max consecutive ones III. Template: while(hi<n): window.add(arr[hi++]); while(invalid): window.remove(arr[lo++]); update best.'},
      {t:'Two Pointers — convergence & divergence',d:'Convergence: lo=0, hi=n-1, move toward each other. For sorted arrays: two-sum O(n) instead of O(n²). Three-sum: fix one element, two-pointer the rest O(n²). Container with most water. Divergence (fast/slow): detect cycles, find middle of array. Same-direction: remove duplicates in-place. Key: ALWAYS clarify whether array is sorted first — that determines which variant.'},
      {t:'Kadane\'s Algorithm — max subarray',d:'dp[i] = max subarray ending at i = max(arr[i], dp[i-1]+arr[i]). Since we only need dp[i-1], use a single variable. O(n) time O(1) space. Extension: maximum product subarray — track both min and max because negative×negative=positive. Extension: circular array — answer is either max subarray of arr[] OR totalSum - min subarray of arr[].'},
      {t:'Dutch National Flag — 3-way partition',d:'3 pointers: lo, mid, hi. Invariant: arr[0..lo-1]=0, arr[lo..mid-1]=1, arr[mid..hi] unsorted, arr[hi+1..n-1]=2. Process arr[mid]: if 0 swap with lo, advance both. If 1 advance mid. If 2 swap with hi, retreat hi only (mid stays). O(n) single pass. Generalizes quicksort pivot partitioning. Real-world: sort objects with 3 color categories.'},
      {t:'Interval Problems — merge & sweep',d:'Sort by start time O(n log n). Merge overlapping: if intervals[i].start <= prev.end, merge (extend end). Count meeting rooms: split into events, sort, sweep with counter +1 on start -1 on end. Non-overlapping removal: greedy — sort by end time, always keep interval ending earliest. Key: sort by END for greedy, sort by START for merging.'},
      {t:'Binary Search on Arrays',d:'Not just for finding values — binary search on the ANSWER solves a class of problems. Pattern: define check(x) = "is x feasible?" in O(n), then binary search x over [min_val, max_val]. Examples: minimum number of days to make m bouquets; koko eating bananas (min eating speed); ship packages within D days. Rotated sorted array: one half is always sorted — determine which, then eliminate.'},
    ],
    complexity:'Access O(1) · Search O(n) unsorted / O(log n) sorted · Insert/Delete O(n) · Space O(n)',
    code:`// Array Fundamentals & Patterns

// Prefix Sum — O(n) build, O(1) range queries
const buildPrefix = arr => {
  const p = new Array(arr.length + 1).fill(0);
  for (let i = 0; i < arr.length; i++) p[i+1] = p[i] + arr[i];
  return p;
};
const rangeSum = (p, l, r) => p[r+1] - p[l]; // inclusive [l..r]

// Sliding Window — longest subarray with sum <= k
const longestSubarray = (arr, k) => {
  let lo = 0, sum = 0, best = 0;
  for (let hi = 0; hi < arr.length; hi++) {
    sum += arr[hi];
    while (sum > k) sum -= arr[lo++];
    best = Math.max(best, hi - lo + 1);
  }
  return best;
};

// Two Pointers — pair with target sum (sorted array) O(n)
const twoSum = (sorted, target) => {
  let lo = 0, hi = sorted.length - 1;
  while (lo < hi) {
    const s = sorted[lo] + sorted[hi];
    if (s === target) return [lo, hi];
    s < target ? lo++ : hi--;
  }
  return null;
};

// Kadane's Algorithm — max subarray sum O(n)
const maxSubarray = arr => {
  let max = arr[0], cur = arr[0];
  for (let i = 1; i < arr.length; i++) {
    cur = Math.max(arr[i], cur + arr[i]);
    max = Math.max(max, cur);
  }
  return max;
};`
  },
  { id:'strings', cat:'dsa', title:'Strings', icon:'≡', viz:'none', color:T.gn,
    tags:['KMP','Rabin-Karp','Palindromes','Anagrams','Z-algorithm','Suffix Array'],
    overview:'Strings are character sequences and one of the most common interview topics. Master 6 technique families: brute force with hash maps (anagrams, character counting), two pointers (palindromes, valid palindrome II), sliding window (minimum window substring), KMP/Z-algorithm (pattern matching), trie (autocomplete), and suffix arrays (advanced, competitive programming).',
    points:[
      {t:'Character Frequency Maps — foundation',d:'Most string problems reduce to counting characters. Use Map or 26-element int array (faster). Sliding window + frequency map: add incoming char, remove outgoing, check validity in O(1). Minimum window substring: window is valid when all required chars satisfied. Key: track count of "satisfied" requirements to avoid O(26) validity check — O(1) per step. Total O(n).'},
      {t:'KMP Pattern Matching — O(n+m)',d:'Precompute failure function lps[i] = length of longest proper prefix that is also suffix of pattern[0..i]. Build in O(m). On mismatch at j, jump to lps[j-1] — never restart from 0. Total time O(n+m). The insight: if we matched k characters and fail at k, the overlap tells us we already matched lps[k-1] characters. Used in: find all occurrences, string rotations (is s2 a rotation of s1? check if s2 appears in s1+s1).'},
      {t:'Z-Algorithm — O(n)',d:'Z[i] = length of longest substring starting at i that is also a prefix of the whole string. Build in O(n) with Z-box maintenance. Find pattern P in text T: compute Z of P+"$"+T. Any Z[i] >= len(P) is a match. Simpler to implement than KMP. Also: Z[0] = len(string) by convention.'},
      {t:'Rabin-Karp Rolling Hash',d:'Hash of window = (hash_left - arr[lo] * BASE^(k-1)) * BASE + arr[hi]. Update in O(1). Expected O(n+m), worst O(nm) on hash collisions — fix with double hashing (two different moduli). Great for: multiple pattern search simultaneously, find duplicate substrings, longest common substring.'},
      {t:'Palindromes — 3 approaches',d:'(1) Expand from center: O(n²) time O(1) space. For odd: center at i. For even: center between i and i+1. (2) Manacher O(n): maintain rightmost palindrome boundary and mirror property. (3) DP table: dp[i][j] = true if s[i..j] is palindrome. dp[i][j] = dp[i+1][j-1] && s[i]==s[j]. Fill diagonally. O(n²) time and space. Real-world use: palindrome partitioning, palindrome pairs.'},
      {t:'Anagrams & Permutations',d:'Sorted anagram: sort both O(n log n). Frequency map: O(n). Sliding window anagram: maintain freq map of pattern. For each window of size k in text, if freqs match → anagram. Track "satisfied" count to check in O(1). Find all anagram indices: classic sliding window. Group anagrams: sorted string as hash key, O(n × m log m). Count distinct anagram groups: O(nm log m).'},
      {t:'Suffix Arrays & Longest Repeating Substring',d:'Suffix array: sorted array of all suffixes. Build in O(n log n) with radix sort or O(n) with SA-IS. LCP array: LCP[i] = longest common prefix between suffix[i] and suffix[i-1]. Longest repeating substring = max(LCP). Longest common substring of two strings: concatenate with separator, build SA+LCP, find max LCP across different strings. Competitive programming essential.'},
      {t:'String Hashing — practical tricks',d:'Rolling hash = Σ(s[i] × BASE^(n-1-i)) mod MOD. Polynomial hash. Prefix hash: hash[i] = hash[i-1]*BASE + s[i]. Substring hash [l,r] = (hash[r+1] - hash[l]*BASE^(r-l+1)) mod MOD. Use: find duplicate substrings, string matching, longest palindromic substring via binary search + hashing O(n log n). Anti-hack: use two different mod values simultaneously.'},
    ],
    complexity:'KMP O(n+m) · Z-algo O(n) · Rabin-Karp O(n+m) avg · Manacher O(n) · Suffix Array O(n log n)',
    code:`// KMP Pattern Matching — O(n+m)
const buildFailure = pat => {
  const f = [0]; let k = 0, i = 1;
  while (i < pat.length) {
    if (pat[i] === pat[k]) f[i++] = ++k;
    else if (k > 0) k = f[k-1];
    else f[i++] = 0;
  }
  return f;
};

const kmpSearch = (text, pattern) => {
  const fail = buildFailure(pattern);
  const matches = []; let j = 0;
  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = fail[j-1];
    if (text[i] === pattern[j]) j++;
    if (j === pattern.length) {
      matches.push(i - j + 1);
      j = fail[j-1];
    }
  }
  return matches;
};

// Longest Palindromic Substring — Expand from center O(n^2)
const longestPalindrome = s => {
  let start = 0, maxLen = 1;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r-l-1; start = l+1; }
  };
  for (let i = 0; i < s.length; i++) { expand(i,i); expand(i,i+1); }
  return s.slice(start, start + maxLen);
};`
  },
  { id:'linked-lists', cat:'dsa', title:'Linked Lists', icon:'◈', viz:'linkedlist', color:T.pu,
    tags:["Pointers","Floyd's Cycle","Reverse","Merge K Lists","LRU Cache","O(1) Insert"],
    overview:"Linked lists store elements in nodes connected by pointers — non-contiguous memory, O(1) insert/delete at known positions, but O(n) access. Interview favorites: reverse, detect cycle, find middle, merge K sorted lists, LRU cache design, reorder list. The sentinel/dummy node technique eliminates edge cases.",
    points:[
      {t:'Dummy/Sentinel Node Pattern',d:'Add a dummy node before head: dummy.next = head. This eliminates null-check edge cases when the head itself might be deleted or when building a new list. At the end, return dummy.next. Canonical usage: merge two sorted lists, remove Nth from end, partition list. Every linked list problem — reach for dummy first.'},
      {t:"Floyd's Cycle Detection — deep dive",d:'Phase 1: slow (1 step) and fast (2 steps). If they meet, cycle exists. Why do they always meet inside cycle? If cycle length C and tail distance F, fast laps slow in C steps, meeting at distance 2F mod C from cycle start. Phase 2 insight: reset slow to head, advance both 1 step per move — they meet at CYCLE ENTRY. Proof: let L = distance to cycle entry, C = cycle length. Meeting point μ satisfies L ≡ μ mod C. So resetting slow and advancing both 1 step, they cover L steps and meet at entry. Practical: find cycle length — once meeting point found, count steps back to same node.'},
      {t:'Reverse — 4 variants you must know',d:'(1) Full reverse: prev=null, save next, flip pointer, advance. O(n) O(1). (2) Reverse K groups: reverse K nodes, recurse on remainder, connect. O(n). (3) Reverse between positions L and R: traverse to L-1, reverse R-L+1 nodes, reconnect. (4) Palindrome check: find middle, reverse second half, compare, restore. All O(n) O(1) space. Edge case: single node or two nodes — test separately.'},
      {t:'Fast/Slow Pointers — all applications',d:'Find middle: fast=2 slow=1. When fast reaches end, slow is at middle. For even length, slow stops at left-middle. Remove Nth from end: advance fast by N+1 steps (or N with dummy), then move both until fast is null. K-th from end: advance by K. Intersection of two lists: advance longer list by |len1-len2|, then advance both — first common node is intersection. O(n) O(1).'},
      {t:'Merge K Sorted Lists — two approaches',d:'(1) Min-heap of (val, node): O(n log k) time O(k) space. Each pop gives minimum, push next node. (2) Divide and conquer: merge pairs of lists recursively. O(n log k) time O(log k) space (recursion). Note: naive sequential merge is O(nk). For k=1000 lists with n=1000 each: heap gives 10^6×10 = 10M ops vs 10^9 for naive. Always use heap or D&C.'},
      {t:'LRU Cache — linked list + hash map',d:'Doubly linked list + hash map. Map: key → node. List: most recent at head, LRU at tail. Get: O(1) — find node via map, move to head. Put: O(1) — if exists: update + move to head. If new: add to head + add to map. If over capacity: remove tail + remove from map. This exact pattern appears in OS page replacement and CPU cache algorithms. Template for all O(1) cache designs.'},
      {t:'Reorder List & Other Hard Patterns',d:'Reorder L0→L1→…→Ln-1→Ln to L0→Ln→L1→Ln-1: (1) find middle, (2) reverse second half, (3) merge alternately. Copy list with random pointer: first pass create node copies interleaved (A→A\'→B→B\'), second pass fix random pointers, third pass separate. Skip list: probabilistic data structure where each node has multiple forward pointers at different levels. O(log n) expected for all ops — alternative to balanced BST.'},
    ],
    complexity:'Access O(n) · Insert/Delete at known node O(1) · Search O(n) · Merge K lists O(n log k) · Space O(n)',
    code:`class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

// Reverse — O(n), O(1) space
const reverse = head => {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
};

// Floyd's Cycle Detection
const hasCycle = head => {
  let slow = head, fast = head;
  while (fast?.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
};

// Merge Two Sorted Lists — O(m+n)
const mergeSorted = (l1, l2) => {
  const dummy = new ListNode(0); let cur = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
    else                  { cur.next = l2; l2 = l2.next; }
    cur = cur.next;
  }
  cur.next = l1 || l2;
  return dummy.next;
};`
  },
  { id:'stacks', cat:'dsa', title:'Stacks', icon:'⧉', viz:'stack', color:T.or,
    tags:['LIFO','Monotonic Stack','DFS','Shunting-yard','Min Stack','O(1) ops'],
    overview:'A stack is LIFO (Last-In-First-Out). Stacks are fundamental to recursion simulation, expression evaluation, syntax checking, and the monotonic stack pattern which is one of the highest-frequency interview patterns. The monotonic stack reduces many O(n²) "next greater/smaller" problems to O(n).',
    points:[
      {t:'Monotonic Stack — the killer pattern',d:'Maintain a stack in monotonically increasing or decreasing order. For each new element: pop elements violating the order — each popped element has FOUND its answer (the current element is their next greater/smaller). Push current element. Total O(n) since each element pushes/pops at most once. Increasing stack: next greater element (find gas station, daily temperatures). Decreasing stack: next smaller element. Classic: largest rectangle in histogram — for each bar, find nearest shorter bar on each side via two monotonic stacks, or one left-to-right pass.'},
      {t:'Largest Rectangle in Histogram — O(n)',d:'For each bar[i], the largest rectangle using bar[i] as the shortest bar extends from the previous shorter bar (left boundary) to the next shorter bar (right boundary). Monotonic stack stores indices in increasing height order. When a shorter bar is found, pop and calculate: width = i - stack.top() - 1, area = height[popped] * width. Push current index. This problem appears as a sub-problem in "Maximal Rectangle in Binary Matrix" — convert each row to histogram heights, then apply.'},
      {t:'Min Stack — O(1) getMin',d:'Two stacks: main and min. Push to main always. Push to min only when x <= min.top() (or always, using more space). Pop from main always. Pop from min when main.top() == min.top(). Variation: store differences from min in main stack with a single variable for current min. This is the space-efficient approach. Same pattern: max stack, min/max stack simultaneously.'},
      {t:'Expression Parsing — shunting-yard',d:'Infix → Postfix (RPN): operands go directly to output. Operators: pop higher-or-equal precedence operators first, then push current. Left paren: push. Right paren: pop until left paren. Then evaluate postfix: push operands, pop 2 on operator, push result. Calculate with expressions: handle unary minus (treat as 0-x), handle whitespace. Basic calculator problems require tracking sign and handling nested parentheses with a sign stack.'},
      {t:'DFS Iterative — avoiding stack overflow',d:'Replace call stack with explicit stack. Push start. While stack non-empty: pop node, process, push unvisited neighbors. For correct order (matching recursive DFS): push neighbors in REVERSE order. For trees: push right child first (so left is processed first). Key difference from BFS: use stack instead of queue. Real-world: file system traversal, topological sort, finding strongly connected components (Kosaraju uses two DFS passes).'},
      {t:'Parsing & Decode Strings',d:'Decode string k[s]: when digit, parse full number. When "[", push current string and repeat count. When "]", pop and repeat. Current character: append to current string. This generalizes to all nested bracket parsing. JSON parser, HTML validator, and many compiler tokenizers use this exact stack-based parsing pattern. Nested structure depth = stack size.'},
    ],
    complexity:'Push/Pop/Peek O(1) · Monotonic stack O(n) total · Expression parsing O(n) · Space O(n)',
    code:`class Stack {
  #data = [];
  push(x)   { this.#data.push(x); }
  pop()     { return this.#data.pop(); }
  peek()    { return this.#data.at(-1); }
  isEmpty() { return this.#data.length === 0; }
}

// Balanced Parentheses — O(n)
const isBalanced = s => {
  const map = { ')':'(', ']':'[', '}':'{' }, stack = [];
  for (const c of s) {
    if ('([{'.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
};

// Next Greater Element — Monotonic Stack O(n)
const nextGreater = arr => {
  const res = new Array(arr.length).fill(-1), stack = [];
  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[stack.at(-1)] < arr[i])
      res[stack.pop()] = arr[i];
    stack.push(i);
  }
  return res;
};

// Min Stack — O(1) getMin
class MinStack {
  #main = []; #min = [];
  push(x) { this.#main.push(x); this.#min.push(Math.min(x, this.#min.at(-1) ?? x)); }
  pop()   { this.#main.pop(); this.#min.pop(); }
  top()   { return this.#main.at(-1); }
  getMin(){ return this.#min.at(-1); }
}`
  },
  { id:'queues', cat:'dsa', title:'Queues', icon:'≋', viz:'queue', color:T.bl,
    tags:['FIFO','BFS','Priority Queue','Circular Buffer'],
    overview:'A queue is FIFO (First-In-First-Out). Essential for BFS traversal, task scheduling, and stream processing. Beyond basic queues: deque (double-ended), circular buffer, and priority queue backed by a heap.',
    points:[
      {t:'Core Operations O(1)',d:'enqueue(x): add to rear. dequeue(): remove from front. Circular array with two pointers gives O(1) for both.'},
      {t:'Priority Queue',d:'Heap-backed. Min-heap: always dequeue minimum. O(log n) enqueue/dequeue, O(1) peek. Powers Dijkstra, A*, top-K problems.'},
      {t:'Sliding Window Max',d:'Deque of indices, front = current window max. Pop front if out of window. Pop back if current >= back element. O(n) total.'},
    ],
    complexity:'Enqueue/Dequeue O(1) · Priority Queue O(log n) · Space O(n)',
    code:`// Circular Queue — O(1) all operations
class CircularQueue {
  constructor(cap) {
    this.data = new Array(cap);
    this.front = 0; this.rear = 0;
    this.size = 0; this.cap = cap;
  }
  enqueue(x) {
    if (this.size === this.cap) throw Error('Full');
    this.data[this.rear] = x;
    this.rear = (this.rear + 1) % this.cap;
    this.size++;
  }
  dequeue() {
    if (!this.size) throw Error('Empty');
    const val = this.data[this.front];
    this.front = (this.front + 1) % this.cap;
    this.size--;
    return val;
  }
}

// Sliding Window Maximum — O(n)
const slidingMax = (arr, k) => {
  const dq = [], res = [];
  for (let i = 0; i < arr.length; i++) {
    while (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && arr[dq.at(-1)] < arr[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) res.push(arr[dq[0]]);
  }
  return res;
};`
  },
  { id:'recursion', cat:'dsa', title:'Recursion & Divide & Conquer', icon:'↺', viz:'recursion', color:T.ye,
    tags:['Base Case','Call Stack','Master Theorem','Memoization','Divide & Conquer','Recurrence'],
    overview:'Recursion is a function calling itself with a smaller version of the same problem. Understanding recursion deeply unlocks trees, graphs, backtracking, divide & conquer, and dynamic programming. The Master Theorem analytically solves recurrence relations that appear in virtually every D&C algorithm.',
    points:[
      {t:'Recursion Tree & Recurrence Analysis',d:'Draw a recursion tree: each node = function call, branches = recursive calls. Total work = sum across all levels. Fibonacci T(n)=T(n-1)+T(n-2)+O(1): tree has 2^n nodes → O(2^n). Merge sort T(n)=2T(n/2)+O(n): log n levels, O(n) work each → O(n log n). This visualization is key to understanding WHY algorithms have their complexity before applying the Master Theorem formally.'},
      {t:'Master Theorem — T(n) = aT(n/b) + f(n)',d:'Compare f(n) with n^(log_b(a)): Case 1: f(n) = O(n^(log_b a - ε)) → T(n) = Θ(n^log_b a). Work dominated by leaves. Case 2: f(n) = Θ(n^log_b a) → T(n) = Θ(n^log_b a × log n). Equal work at each level. Case 3: f(n) = Ω(n^(log_b a + ε)) AND regularity → T(n) = Θ(f(n)). Root dominates. Examples: Merge sort a=2,b=2,f=n → n^1 = f(n) → Case 2 → O(n log n). Binary search a=1,b=2,f=1 → n^0=1=f → Case 2 → O(log n). Strassen matrix mult a=7,b=2,f=n² → n^2.81 > n² → Case 1 → O(n^2.81).'},
      {t:'Memoization vs Tabulation',d:'Both implement DP. Top-down (memoization): natural recursive structure, only compute needed states, cache with Map/array. Bottom-up (tabulation): fill table from base cases up, all states computed, better cache performance (no recursion overhead). Fibonacci top-down: O(n) with map. Bottom-down: O(n) with array, or O(1) space tracking only prev two. When to use which: top-down for sparse state spaces; bottom-up when all states needed and order is clear.'},
      {t:'Divide & Conquer — design principles',d:'Divide into a subproblems each of size n/b. Conquer recursively. Combine in O(f(n)). Key examples: (1) Closest pair of points: divide by median x, solve halves, merge by checking strip of width 2δ — O(n log n). (2) Karatsuba multiplication: reduce 4 multiplications to 3 → O(n^1.58) vs O(n²) naive. (3) Fast Fourier Transform: DFT in O(n log n) by halving even/odd indices recursively. (4) QuickSelect: find k-th smallest in expected O(n) — like quicksort but only recurse on one side.'},
      {t:'Recursion Patterns — template library',d:'All-subsets: at each index, include or exclude → O(2^n). All permutations: swap current with each index → O(n!). All combinations of size k: backtrack with start pointer → O(C(n,k)). Tree problems: usually return value from recursive call and process at each node. Graph problems: visited set + DFS. Counting distinct ways: usually DP but can start with recursive+memo. Key: identify if subproblems OVERLAP (→ DP) or are INDEPENDENT (→ D&C).'},
      {t:'Tail Recursion & TCO',d:'Tail recursive: recursive call is the LAST computation (no pending work). Tail Call Optimization (TCO): compiler replaces call stack frame instead of adding new one → O(1) space. JavaScript: TCO in strict mode (not all engines). Common tail-recursive patterns: accumulator parameter carries partial result. Fibonacci tail-recursive: fib(n, a=0, b=1) → if n==0 return a; return fib(n-1, b, a+b). Trampoline technique: simulate TCO in languages without it.'},
    ],
    complexity:'Naive recursion O(b^d) · Memoized O(unique states × work per state) · D&C: use Master Theorem · Stack space O(depth)',
    code:`// Memoized Fibonacci — O(n)
const fib = (() => {
  const memo = new Map([[0,0],[1,1]]);
  return function f(n) {
    if (memo.has(n)) return memo.get(n);
    const res = f(n-1) + f(n-2);
    memo.set(n, res);
    return res;
  };
})();

// Power set — O(2^n)
const powerSet = arr => {
  if (!arr.length) return [[]];
  const [first, ...rest] = arr;
  const withoutFirst = powerSet(rest);
  return [...withoutFirst, ...withoutFirst.map(s => [first, ...s])];
};

// Tower of Hanoi — O(2^n)
const hanoi = (n, from='A', to='C', aux='B') => {
  if (n === 1) { console.log("Move disk 1: " + from + "to" + to); return; }
  hanoi(n-1, from, aux, to);
  console.log("Move disk " + n + ": " + from + " to " + to);
  hanoi(n-1, aux, to, from);
};`
  },
  { id:'backtracking', cat:'dsa', title:'Backtracking', icon:'↩', viz:'nqueens', color:T.rd,
    tags:['N-Queens','Pruning','Sudoku','State Space'],
    overview:'Backtracking systematically explores all possible solutions by building candidates incrementally and abandoning those that fail constraints. Template: Choose → Explore → Unchoose.',
    points:[
      {t:'Template',d:'makeChoice → recurse → undoChoice. The undo step is what makes it backtracking vs simple recursion.'},
      {t:'N-Queens',d:'Place N queens so none attack each other. For each row, try each column, check safety, recurse. Backtrack if stuck. Prune via isConflict() check.'},
      {t:'Sudoku Solver',d:'Find empty cell, try 1-9, check row/col/box, recurse. Backtrack when no digit works. With constraint propagation, solves most puzzles instantly.'},
      {t:'Pruning',d:'Forward checking: immediately eliminate inconsistent values. Branch and bound: track best solution, prune worse branches.'},
    ],
    complexity:'O(b^d) where b=branching factor, d=depth. Pruning reduces practical runtime dramatically',
    code:`// N-Queens — O(N!)
const solveNQueens = n => {
  const board = Array.from({length:n}, () => Array(n).fill('.'));
  const solutions = [];
  const safe = (row, col) => {
    for (let r = 0; r < row; r++) {
      if (board[r][col] === 'Q') return false;
      if (board[r][col-row+r] === 'Q') return false;
      if (board[r][col+row-r] === 'Q') return false;
    }
    return true;
  };
  const place = row => {
    if (row === n) { solutions.push(board.map(r => r.join(''))); return; }
    for (let col = 0; col < n; col++) {
      if (safe(row, col)) {
        board[row][col] = 'Q';
        place(row + 1);
        board[row][col] = '.'; // backtrack
      }
    }
  };
  place(0);
  return solutions;
};

// Combination Sum
const combinationSum = (candidates, target) => {
  const result = [], path = [];
  candidates.sort((a,b) => a-b);
  const bt = (start, remaining) => {
    if (remaining === 0) { result.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;
      path.push(candidates[i]);
      bt(i, remaining - candidates[i]);
      path.pop();
    }
  };
  bt(0, target);
  return result;
};`
  },
  { id:'bit-manipulation', cat:'dsa', title:'Bit Manipulation', icon:'⊻', viz:'none', color:T.or,
    tags:['XOR','Bitmask','Power of 2','Brian Kernighan'],
    overview:'Bit manipulation operates directly on binary representations — often O(1) for operations that would otherwise be O(n). Essential for low-level programming, competitive programming tricks, and cryptography.',
    points:[
      {t:'Basic Operations',d:'AND (&): 1 if both 1. OR (|): 1 if either 1. XOR (^): 1 if different. NOT (~): flip all. Left shift (<<): multiply by 2. Right shift (>>): divide by 2.'},
      {t:'Common Tricks',d:'Check bit k: (n>>k)&1. Set: n|(1<<k). Clear: n&~(1<<k). Toggle: n^(1<<k). Remove lowest set bit: n&(n-1). Isolate lowest set bit: n&(-n).'},
      {t:'XOR Properties',d:'a^a=0, a^0=a. Commutative and associative. Find single non-duplicate: XOR all elements. Swap without temp: a^=b; b^=a; a^=b.'},
      {t:'Bitmask DP',d:'When state = subset of n elements, use bitmask for state. 2^n states. Iterate all subsets: for(let s=mask;s;s=(s-1)&mask).'},
    ],
    complexity:'Individual bit ops O(1) · Count bits O(log n) naive, O(1) with table · Bitmask DP O(2^n × n)',
    code:`// Bit Manipulation Toolkit
const checkBit  = (n,k) => (n >> k) & 1;
const setBit    = (n,k) => n | (1 << k);
const clearBit  = (n,k) => n & ~(1 << k);
const toggleBit = (n,k) => n ^ (1 << k);
const isPow2    = n     => n > 0 && !(n & (n-1));
const lowBit    = n     => n & (-n);
const popcount  = n     => { let c=0; while(n){c++;n&=n-1;} return c; };

// XOR tricks
const findSingle = nums => nums.reduce((a,b) => a^b, 0);
const missingNum = arr => {
  let xor = arr.length;
  arr.forEach((v,i) => xor ^= i ^ v);
  return xor;
};

// All subsets via bitmask
const allSubsets = arr => {
  const n=arr.length, result=[];
  for(let mask=0; mask<(1<<n); mask++) {
    const subset=[];
    for(let i=0;i<n;i++) if(mask>>i&1) subset.push(arr[i]);
    result.push(subset);
  }
  return result;
};`
  },

  // ── Algorithms ────────────────────────────────────────────────────────
  { id:'sorting', cat:'algo', title:'Sorting Algorithms', icon:'⊞', viz:'sorting', color:T.gn,
    tags:['Bubble','Merge','Quick','Heap','Counting','Radix','Stability','Ω(n log n) lower bound'],
    overview:'Sorting is foundational. The theoretical lower bound for comparison-based sorting is Ω(n log n) — provable via decision tree argument (n! possible orderings → tree must have height ≥ log₂(n!)  ≥ n log n by Stirling). Non-comparison sorts (counting, radix) break this barrier when input constraints allow.',
    points:[
      {t:'The Ω(n log n) Lower Bound',d:'Any comparison-based sort must make at least Ω(n log n) comparisons in the worst case. Proof: model as a binary decision tree where each leaf is a permutation. There are n! leaves so tree height ≥ log₂(n!) ≈ n log n (Stirling). No comparison sort can beat this. But non-comparison sorts (counting, radix) don\'t compare elements — they use key structure to sort in O(n+k) or O(d(n+k)).'},
      {t:'Merge Sort — guarantees & external sort',d:'Divide at midpoint, sort each half recursively, merge. O(n log n) all cases (best, avg, worst). O(n) auxiliary space. STABLE — equal elements maintain original order. Best for: linked lists (no random access needed), external sort (data too large for RAM — merge from disk). TimSort (Python/Java default): hybrid merge+insertion that exploits natural runs in O(n) to O(n log n). Merge is the key primitive for K-way merge in priority queues.'},
      {t:'Quick Sort — why fastest in practice',d:'Choose pivot (random or median-of-3), partition with Lomuto or Hoare scheme, recurse on both parts. Average O(n log n), O(n²) worst on sorted/reverse input with bad pivot. O(log n) stack space. UNSTABLE. Fastest in practice because of cache efficiency (in-place, good locality) and small constant. Randomized pivot eliminates adversarial O(n²). 3-way partition (Dutch flag) handles duplicate keys: O(n) when all elements equal. Java uses dual-pivot quicksort for primitives.'},
      {t:'Heap Sort — guaranteed in-place',d:'Phase 1: Build max-heap in O(n) (heapify from bottom up — NOT O(n log n) as intuition suggests; proof: sum of height×(n/2^h) telescopes to O(n)). Phase 2: n times: extract max O(log n), place at end. Total O(n log n) guaranteed, O(1) space, UNSTABLE. Poor cache performance vs quicksort due to non-sequential access pattern in heapify. Use when: guaranteed O(n log n) + in-place required (embedded systems, real-time systems).'},
      {t:'Counting Sort & Radix Sort — breaking Ω(n log n)',d:'Counting sort: O(n+k) where k = value range. Count frequencies, compute prefix sums (positions), place elements. STABLE. Works only for integer keys with bounded range. Radix sort: sort digit-by-digit from LSD to MSD using stable counting sort each pass. O(d(n+k)) where d=digits, k=base. For 32-bit integers with base 256: 4 passes of O(n+256) = O(n). Destroys the Ω(n log n) barrier by using digit structure rather than comparisons.'},
      {t:'Selection Algorithms & Partial Sort',d:'k-th smallest: QuickSelect O(n) average via partition — only recurse on one side containing k. Median-of-medians: O(n) worst case (complex constant). Partial sort (top-K elements): use min-heap of size K. For each element: if > heap.min(), replace min and heapify. O(n log k). Streaming top-K: same heap approach works on infinite streams. Merge K sorted arrays: K-way merge with min-heap, O(n log k).'},
      {t:'Practical Sort Decision Guide',d:'General purpose: prefer built-in sort (TimSort). Large nearly-sorted data: insertion sort O(n) for nearly sorted, or TimSort. Linked list: merge sort (no random access). Integer keys with small range: counting sort. Large integers/strings by prefix: radix sort. Need guaranteed O(n log n) + O(1) space: heap sort. Need stable O(n log n): merge sort. Real-time with latency constraints: avoid quicksort (O(n²) possible), use heapsort or merge sort.'},
    ],
    complexity:'Bubble/Selection/Insertion O(n²) · Merge/Heap O(n log n) · Quick O(n log n) avg O(n²) worst · Counting/Radix O(n+k)',
    code:`// Merge Sort — O(n log n), O(n) space, Stable
const mergeSort = arr => {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const L = mergeSort(arr.slice(0, mid));
  const R = mergeSort(arr.slice(mid));
  const res = []; let i = 0, j = 0;
  while (i < L.length && j < R.length)
    res.push(L[i] <= R[j] ? L[i++] : R[j++]);
  return [...res, ...L.slice(i), ...R.slice(j)];
};

// Quick Sort — O(n log n) avg, in-place
const quickSort = (arr, lo=0, hi=arr.length-1) => {
  if (lo >= hi) return;
  const ri = lo + Math.floor(Math.random()*(hi-lo+1));
  [arr[ri], arr[hi]] = [arr[hi], arr[ri]];
  const pivot = arr[hi]; let i = lo - 1;
  for (let j=lo; j<hi; j++)
    if (arr[j] <= pivot) [arr[++i], arr[j]] = [arr[j], arr[i]];
  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
  const pi = i + 1;
  quickSort(arr, lo, pi-1);
  quickSort(arr, pi+1, hi);
  return arr;
};`
  },
  { id:'searching', cat:'algo', title:'Searching Algorithms', icon:'⌕', viz:'bsearch', color:T.cy,
    tags:['Binary Search','O(log n)','Search on Answer','Rotated Array'],
    overview:'Binary search is one of the most important algorithms — O(log n) means finding an element in 1 billion items takes just 30 comparisons. It extends far beyond sorted arrays: binary search on the answer solves entire problem classes.',
    points:[
      {t:'Binary Search Core',d:'Requires sorted array. Each step eliminates half the search space. Terminates in log₂(n) steps. For n=1B: at most 30 comparisons.'},
      {t:'Three Templates',d:'Exact match: while(lo<=hi). Find leftmost (lower_bound): while(lo<hi), hi=mid when a[mid]>=target. Find rightmost: while(lo<hi), lo=mid+1 when a[mid]<=target.'},
      {t:'Search on Answer',d:"If you can check 'is X feasible?' in O(n), binary search X over [min,max]. Used for: minimum max-load, ship packages in D days, Koko eating bananas."},
    ],
    complexity:'Binary Search O(log n) · Search on Answer O(n log(range)) · Space O(1) iterative',
    code:`// Standard binary search
const binarySearch = (arr, target) => {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) return mid;
    arr[mid] < target ? lo = mid + 1 : hi = mid - 1;
  }
  return -1;
};

// Lower bound — first index where arr[i] >= target
const lowerBound = (arr, target) => {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    arr[mid] < target ? lo = mid + 1 : hi = mid;
  }
  return lo;
};

// Binary Search on Answer — ship packages in D days
const shipInDays = (weights, D) => {
  const feasible = cap => {
    let days = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) { days++; load = 0; }
      load += w;
    }
    return days <= D;
  };
  let lo = Math.max(...weights), hi = weights.reduce((a,b)=>a+b);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    feasible(mid) ? hi = mid : lo = mid + 1;
  }
  return lo;
};`
  },
  { id:'greedy', cat:'algo', title:'Greedy Algorithms', icon:'↑', viz:'none', color:T.tl,
    tags:['Activity Selection','Huffman','Local Optimal','Exchange Argument'],
    overview:'Greedy makes the locally optimal choice at each step, trusting it leads to global optimum. When it works, greedy is beautifully simple and efficient. Must prove greedy choice property and optimal substructure.',
    points:[
      {t:'Activity Selection',d:'Sort by finish time, greedily select earliest finishing compatible activity. O(n log n). Classic proof by exchange argument.'},
      {t:'Huffman Coding',d:'Build optimal prefix-free binary code. Min-heap: merge two lowest-frequency nodes repeatedly. O(n log n). Used in JPEG, MP3, ZIP.'},
      {t:'When Greedy Fails',d:'Coin change with arbitrary denominations: {1,3,4} target=6. Greedy: 4+1+1=3 coins. Optimal: 3+3=2 coins. Must use DP!'},
    ],
    complexity:'Usually O(n log n) due to sorting',
    code:`// Activity Selection — max non-overlapping intervals O(n log n)
const activitySelection = intervals => {
  const sorted = [...intervals].sort((a,b) => a.end - b.end);
  const selected = [sorted[0]]; let lastEnd = sorted[0].end;
  for (let i=1; i<sorted.length; i++) {
    if (sorted[i].start >= lastEnd) {
      selected.push(sorted[i]);
      lastEnd = sorted[i].end;
    }
  }
  return selected;
};

// Jump Game — minimum jumps O(n)
const minJumps = nums => {
  let jumps=0, curEnd=0, farthest=0;
  for (let i=0; i<nums.length-1; i++) {
    farthest = Math.max(farthest, i+nums[i]);
    if (i === curEnd) { jumps++; curEnd = farthest; }
  }
  return jumps;
};

// Merge Intervals — O(n log n)
const mergeIntervals = intervals => {
  if (!intervals.length) return [];
  intervals.sort((a,b) => a[0]-b[0]);
  const result = [intervals[0]];
  for (const [s,e] of intervals.slice(1)) {
    const last = result.at(-1);
    last[1] >= s ? last[1] = Math.max(last[1],e) : result.push([s,e]);
  }
  return result;
};`
  },
  { id:'dp', cat:'algo', title:'Dynamic Programming', icon:'▣', viz:'dp', color:T.pu,
    tags:['Memoization','Tabulation','LCS','Knapsack','Coin Change','LIS','Matrix Chain','State Machine DP'],
    overview:'Dynamic Programming solves problems by breaking them into overlapping subproblems, solving each exactly once, and combining results. It transforms exponential brute force into polynomial. DP is arguably the most important algorithm technique for coding interviews — covering 6 major patterns: linear DP, grid DP, string DP, knapsack, interval DP, and state machine DP.',
    points:[
      {t:'Two Required Properties & State Design',d:'Optimal Substructure: optimal solution is built from optimal solutions to subproblems. Overlapping Subproblems: same subproblems recur (unlike D&C). State design is the hardest part — state must contain EXACTLY enough information to determine the optimal value without knowing how you got there. Common mistakes: forgetting a necessary dimension (e.g., number of transactions in stock problem), including unnecessary dimensions (exponential blowup). Verify: given state, can you compute transition without extra information?'},
      {t:'Linear DP — 1D patterns',d:'Fibonacci-style: dp[i] depends on dp[i-1], dp[i-2]. House robber: dp[i] = max(dp[i-2]+nums[i], dp[i-1]). Climbing stairs. Jump game: dp[i] = max reachable index. LIS (Longest Increasing Subsequence): dp[i] = length of LIS ending at i = max(dp[j]+1 for j<i where arr[j]<arr[i]). O(n²) with this DP, O(n log n) with patience sorting (binary search on tails array). Edit distance: dp[i][j] is 2D but transitions are 1D-like.'},
      {t:'Knapsack Variants — must know all four',d:'(1) 0/1 Knapsack: each item used at most once. Iterate weights BACKWARDS to prevent reuse. (2) Unbounded Knapsack (coin change): each item used unlimited times. Iterate weights FORWARDS. (3) Bounded Knapsack: each item used at most k times. Binary grouping trick converts to 0/1 in O(n log k). (4) 2D Knapsack: two constraints (weight AND volume). Nested loops over both. Key: recognize which type by whether items can repeat. Many problems are secretly knapsack variants: target sum, partition equal subset, perfect squares.'},
      {t:'String DP — LCS, Edit Distance, Palindromes',d:'LCS dp[i][j]: if chars match, dp[i-1][j-1]+1; else max(dp[i-1][j], dp[i][j-1]). Edit distance dp[i][j]: if match, dp[i-1][j-1]; else 1+min(insert, delete, replace) = 1+min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1]). Longest palindromic subsequence = LCS(s, reverse(s)). Minimum insertions to make palindrome = n - LPS. Palindromic substrings dp[i][j] = dp[i+1][j-1] && s[i]==s[j]. Fill diagonally (length 1, then 2, ...). Space optimization: many 2D string DPs reduce to O(n) with rolling array since dp[i][*] only depends on dp[i-1][*].'},
      {t:'Interval DP — O(n³)',d:'Define dp[i][j] = optimal value for subarray [i..j]. Base case: single elements dp[i][i]. Fill by increasing length: for len in 2..n, for i in 0..n-len, j=i+len-1, try all split points k. Matrix chain multiplication: dp[i][j] = min cost to multiply matrices i..j. Optimal BST: dp[i][j] = min cost when keys[i..j] are in BST. Burst balloons: dp[i][j] = max coins when bursting all balloons between i and j (LAST balloon gives isolatable subproblems). Palindrome partitioning minimum cuts.'},
      {t:'State Machine DP — k transactions, cooldown',d:'Model each state as a node, transitions as edges. Best time to buy stocks with k transactions: state = (day, num_transactions, holding). dp[k][0] = max profit on day d with k transactions, not holding. dp[k][1] = holding. Transitions: sell: dp[k][0] = max(dp[k][0], dp[k][1]+price). Buy: dp[k][1] = max(dp[k][1], dp[k-1][0]-price). With cooldown: add state for resting day. With fee: subtract fee on sell. Memorize the k=infinity case: greedy (take every upswing). k=1: track min so far.'},
      {t:'DP Optimization Techniques',d:'Space optimization: if dp[i] only depends on dp[i-1], use two variables or rolling array (2 rows). O(nm) → O(n). Divide and conquer optimization: when dp[i][j] = min(dp[i-1][k]+cost[k][j]) and the optimal split point is monotone → O(n² log n) → O(n²). Convex hull trick (Li Chao tree): when cost function is linear in optimization variable → O(n log n). Knuth\'s optimization: specific condition reduces O(n³) interval DP to O(n²). Bitmask DP: when n ≤ 20, use 2^n states with O(n) per state.'},
    ],
    complexity:'1D DP O(n) · 2D DP O(n²) or O(nm) · Knapsack O(n×W) · Interval DP O(n³) · Bitmask DP O(2^n × n)',
    code:`// Coin Change — minimum coins O(n×amount)
const coinChange = (coins, amount) => {
  const dp = new Array(amount+1).fill(Infinity); dp[0] = 0;
  for (let a=1; a<=amount; a++)
    for (const c of coins)
      if (c <= a && dp[a-c]+1 < dp[a]) dp[a] = dp[a-c]+1;
  return dp[amount] === Infinity ? -1 : dp[amount];
};

// LCS — Longest Common Subsequence O(mn)
const lcs = (s1, s2) => {
  const m=s1.length, n=s2.length;
  const dp = Array.from({length:m+1}, () => Array(n+1).fill(0));
  for (let i=1; i<=m; i++)
    for (let j=1; j<=n; j++)
      dp[i][j] = s1[i-1]===s2[j-1]
        ? dp[i-1][j-1]+1
        : Math.max(dp[i-1][j], dp[i][j-1]);
  return dp[m][n];
};

// 0/1 Knapsack — O(n×W), O(W) space
const knapsack = (weights, values, W) => {
  const dp = new Array(W+1).fill(0);
  for (let i=0; i<weights.length; i++)
    for (let w=W; w>=weights[i]; w--)
      dp[w] = Math.max(dp[w], dp[w-weights[i]] + values[i]);
  return dp[W];
};`
  },
  { id:'sliding-window', cat:'algo', title:'Sliding Window', icon:'⊓', viz:'none', color:T.tl,
    tags:['O(n)','Variable Window','Fixed Window','Deque'],
    overview:'Sliding window maintains a contiguous subarray/substring that slides over data. Pattern: expand right pointer always; shrink left when condition violated. Converts O(n²) to O(n).',
    points:[
      {t:'Fixed Window',d:'Window of exactly k elements. Sum: add arr[hi], remove arr[hi-k]. Max: use monotonic deque for O(1) updates.'},
      {t:'Variable Window — Longest',d:'Expand hi always. Shrink lo when condition violated. Track max window size when valid.'},
      {t:'Variable Window — Shortest',d:'Expand hi until condition met. Shrink lo while condition holds. Track minimum window.'},
    ],
    complexity:'O(n) — each element enters and exits window exactly once',
    code:`// Longest substring without repeating chars — O(n)
const lengthOfLongestSubstring = s => {
  const seen = new Map(); let lo = 0, max = 0;
  for (let hi = 0; hi < s.length; hi++) {
    if (seen.has(s[hi]) && seen.get(s[hi]) >= lo)
      lo = seen.get(s[hi]) + 1;
    seen.set(s[hi], hi);
    max = Math.max(max, hi - lo + 1);
  }
  return max;
};

// Minimum window substring — O(n)
const minWindow = (s, t) => {
  const need = new Map(); for(const c of t) need.set(c,(need.get(c)||0)+1);
  let lo=0, have=0, want=need.size, res='';
  for (let hi=0; hi<s.length; hi++) {
    const c=s[hi];
    if (need.has(c)) { need.set(c,need.get(c)-1); if(need.get(c)===0) have++; }
    while (have===want) {
      const w=s.slice(lo,hi+1); if(!res||w.length<res.length) res=w;
      const lc=s[lo++]; if(need.has(lc)){if(need.get(lc)===0)have--;need.set(lc,need.get(lc)+1);}
    }
  }
  return res;
};`
  },

  // ── Data Structures ───────────────────────────────────────────────────
  { id:'hash-tables', cat:'ds', title:'Hash Tables', icon:'⊞', viz:'hash', color:T.ye,
    tags:['O(1) avg','Hash Function','Chaining','Load Factor'],
    overview:'Hash tables provide O(1) average insert, delete, and lookup. They map keys to values using a hash function. Understanding collisions and load factors separates engineers who use HashMaps from those who understand them.',
    points:[
      {t:'Hash Function',d:'Maps key → array index. Good hash: fast, uniform distribution, deterministic. Polynomial rolling hash for strings.'},
      {t:'Chaining',d:'Each bucket is a linked list. O(1+α) average where α=load factor=n/m. Java HashMap converts to Red-Black tree when bucket > 8 entries.'},
      {t:'Open Addressing',d:'Linear probing, quadratic probing, double hashing. Cache-friendly. Max load factor ~0.7 before rehashing.'},
      {t:'LRU Cache',d:'HashMap + doubly linked list. O(1) get and put. Get: move to front. Put: evict LRU (tail) if full.'},
    ],
    complexity:'Insert/Delete/Search O(1) avg, O(n) worst · Space O(n)',
    code:`// LRU Cache — O(1) all operations
class LRUCache {
  constructor(capacity) {
    this.cap = capacity; this.cache = new Map();
    this.head = {key:null,val:null,prev:null,next:null};
    this.tail = {key:null,val:null,prev:null,next:null};
    this.head.next = this.tail; this.tail.prev = this.head;
  }
  #remove(node) { node.prev.next = node.next; node.next.prev = node.prev; }
  #insertFront(node) {
    node.next=this.head.next; node.prev=this.head;
    this.head.next.prev=node; this.head.next=node;
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key);
    this.#remove(node); this.#insertFront(node);
    return node.val;
  }
  put(key, val) {
    if (this.cache.has(key)) this.#remove(this.cache.get(key));
    else if (this.cache.size >= this.cap) {
      const lru = this.tail.prev;
      this.#remove(lru); this.cache.delete(lru.key);
    }
    const node = {key, val, prev:null, next:null};
    this.#insertFront(node); this.cache.set(key, node);
  }
}`
  },
  { id:'trees', cat:'ds', title:'Trees & BST', icon:'⊠', viz:'bst', color:T.gn,
    tags:['BST','AVL','Red-Black','Segment Tree','LCA','Trie','Traversals','Serialization'],
    overview:'Trees are hierarchical structures with O(log n) operations when balanced. BST enables sorted data operations. Balanced BSTs (AVL, Red-Black) guarantee O(log n) worst case. Segment trees solve range queries. Tree problems have a universal recursive pattern: compute left subtree result, compute right subtree result, combine at current node.',
    points:[
      {t:'BST Operations & Deletion',d:'Search: compare, go left if smaller, right if larger. O(log n) balanced. Insert: find position, create leaf. Delete: (1) Leaf: just remove. (2) One child: replace node with child. (3) Two children: find inorder successor (smallest in right subtree), copy its value to current node, delete successor (which has at most one right child). WHY successor? It\'s the smallest value larger than current — maintains BST property. Also works with inorder predecessor (largest in left subtree).'},
      {t:'Four Traversals — know exactly what each gives',d:'Inorder (L→Root→R): gives SORTED sequence for BST. Used to validate BST, find kth smallest. Preorder (Root→L→R): gives sequence where parent always before children — perfect for serialization/deserialization. Postorder (L→R→Root): process children before parent — used for deletion, directory size calculation, expression tree evaluation. Level order (BFS): visit by levels — used for right side view, zigzag traversal, maximum width. Key interview insight: inorder of BST = sorted array.'},
      {t:'AVL Trees — rotations in detail',d:'Maintain |height(L)-height(R)| ≤ 1 at every node. After insert/delete, walk up to root checking balance. Four rotation types: (LL case) right rotation at unbalanced node. (RR case) left rotation. (LR case) left rotation on left child THEN right rotation on current. (RL case) right rotation on right child THEN left rotation on current. Each rotation is O(1). Rebalancing is O(log n) total per operation. In practice: AVL is more strictly balanced than Red-Black → faster lookups, slower inserts.'},
      {t:'Red-Black Trees — production standard',d:'5 properties: (1) Every node red or black. (2) Root is black. (3) Leaves (NIL) are black. (4) Red node has two black children. (5) All paths from node to NIL have same number of black nodes. Black height = black nodes on any root-to-leaf path. Max height ≤ 2 × log(n+1). Used in: Java TreeMap/TreeSet, C++ std::map, Linux kernel scheduler. Insertion: color new node red, fix violations with rotations and recoloring. O(log n) guaranteed.'},
      {t:'Lowest Common Ancestor (LCA)',d:'Naive: O(n) per query — find paths from root to each node, compare. Better: O(log n) per query with binary lifting. Precompute anc[v][k] = 2^k-th ancestor of v. Build in O(n log n). Query: lift both nodes to same depth, then lift together until same. O(log n). Euler tour + sparse table: O(n log n) preprocess, O(1) query. LCA applications: finding distances in trees, range minimum query, and as a building block for advanced algorithms.'},
      {t:'Segment Tree — range queries with updates',d:'Build: O(n) bottom-up. tree[i] = aggregate of range. tree[1] = entire array. tree[i]\'s range is sum of tree[2i] and tree[2i+1] ranges. Range query [l,r]: if current range fully in [l,r], return tree[node]. If no overlap, return identity. Otherwise query both children and combine. O(log n). Point update: update leaf, propagate up. O(log n). Range update: lazy propagation — mark nodes as "to-be-updated", propagate lazily. O(log n) with lazy. Supports: sum, min, max, GCD, XOR, product, any associative operation.'},
      {t:'Tree DP — universal pattern',d:'Most tree problems: define what the recursive function returns, combine children results. (1) Max path sum: return (max single path through this node). Calculate (left contrib + right contrib + val) as candidate for answer. (2) Diameter: at each node, diameter either passes through or doesn\'t. Return height to parent. (3) Tree DP for LIS: heavy-light decomposition reduces tree path queries to array queries. (4) Rerooting: compute dp values for each node as root without re-running DFS — use two DFS passes. (5) Binary tree cameras: greedy on tree, 3 states per node.'},
    ],
    complexity:'BST avg O(log n), worst O(n) · AVL/RB O(log n) always · Segment tree O(n) build, O(log n) ops · LCA O(log n) with binary lifting',
    code:`class BST {
  constructor() { this.root = null; }
  insert(val) { this.root = this._ins(this.root, val); }
  _ins(node, val) {
    if (!node) return {val, left:null, right:null};
    if (val < node.val) node.left  = this._ins(node.left,  val);
    if (val > node.val) node.right = this._ins(node.right, val);
    return node;
  }
  inorder(node=this.root, res=[]) {
    if (node) { this.inorder(node.left,res); res.push(node.val); this.inorder(node.right,res); }
    return res;
  }
}

// Segment Tree — range sum with point update
class SegTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4*this.n).fill(0);
    this.build(arr, 0, 0, this.n-1);
  }
  build(arr, node, s, e) {
    if (s===e) {this.tree[node]=arr[s]; return;}
    const m=(s+e)>>1;
    this.build(arr,2*node+1,s,m); this.build(arr,2*node+2,m+1,e);
    this.tree[node]=this.tree[2*node+1]+this.tree[2*node+2];
  }
  update(i,val,node=0,s=0,e=this.n-1) {
    if (s===e) {this.tree[node]=val; return;}
    const m=(s+e)>>1;
    i<=m?this.update(i,val,2*node+1,s,m):this.update(i,val,2*node+2,m+1,e);
    this.tree[node]=this.tree[2*node+1]+this.tree[2*node+2];
  }
  query(l,r,node=0,s=0,e=this.n-1) {
    if (r<s||e<l) return 0;
    if (l<=s&&e<=r) return this.tree[node];
    const m=(s+e)>>1;
    return this.query(l,r,2*node+1,s,m)+this.query(l,r,2*node+2,m+1,e);
  }
}`
  },
  { id:'graphs', cat:'ds', title:'Graphs', icon:'◎', viz:'graph', color:T.pk,
    tags:['BFS','DFS','Dijkstra','Bellman-Ford','Topological Sort','SCC','MST','Union-Find'],
    overview:"Graphs G=(V,E) model relationships between entities — social networks, road maps, dependencies, the internet. Master: BFS (shortest unweighted path), DFS (cycle detection, SCC, topological sort), Dijkstra (shortest weighted path), Bellman-Ford (negative weights), Kruskal/Prim (MST), and Union-Find (connectivity). Each solves a distinct class of problems.",
    points:[
      {t:'Graph Representations & When to Use',d:'Adjacency List: O(V+E) space. Iterate neighbors in O(degree). Best for sparse graphs (real-world: most graphs). Implementation: array of arrays or Map. Adjacency Matrix: O(V²) space. O(1) edge existence check. Best for dense graphs, Floyd-Warshall. Edge List: just sorted list of (u,v,w). Used in Kruskal\'s MST. Implicit graph: grid/state space where neighbors are computed on-the-fly — never build explicit graph. When V=10^5 and E=10^6, always use adjacency list; matrix would need 10^10 entries.'},
      {t:'BFS — multi-source, 0-1 BFS',d:'Standard BFS: queue-based, level-by-level, O(V+E). Shortest path in unweighted/unit-weight graph. Multi-source BFS: push ALL source nodes simultaneously → finds distance from nearest source. Used for: distance to nearest 0 in binary matrix, walls and gates, rotting oranges. 0-1 BFS: edges have weight 0 or 1. Use deque instead of queue: push to front for 0-weight, back for 1-weight. O(V+E) instead of O((V+E)log V) from Dijkstra. Applications: minimum jumps to reach target, shortest path with at most k edge removals.'},
      {t:'DFS — beyond simple traversal',d:'DFS timestamps: entry[v] (when first visited) and exit[v] (when finished). Edge classification: Tree edge (child not visited), Back edge (to ancestor — indicates cycle in directed graph), Forward edge (to descendant), Cross edge (unrelated). Cycle in directed graph: DFS finds back edge. Cycle in undirected: finds edge to visited-not-parent node. Find bridges and articulation points: Tarjan\'s algorithm uses low values = minimum entry time reachable. DFS tree + low values → O(V+E).'},
      {t:'Dijkstra — correctness & limitations',d:'Greedy: extract minimum distance node from priority queue, relax outgoing edges. Correctness depends on non-negative weights — negative weights can break the invariant that once a node is extracted, its distance is final. O((V+E) log V) with binary heap, O(V²) with simple array (better for dense graphs). Bidirectional Dijkstra: run from both source and target, stop when they meet → practical 2x speedup. A*: add heuristic h(n) ≤ actual distance → focuses search, O((V+E) log V) but visits fewer nodes.'},
      {t:'Bellman-Ford & SPFA — negative weights',d:'Relax ALL edges V-1 times (longest simple path has V-1 edges). If V-th relaxation changes anything → negative cycle. O(VE). SPFA (Shortest Path Faster Algorithm): BFS-like Bellman-Ford, only re-relax nodes whose distance changed. Average O(E) but O(VE) worst. Floyd-Warshall: all-pairs shortest path in O(V³). dp[i][j][k] = shortest path from i to j using only nodes {1..k}. Negative cycle detection: negative diagonal value. Applications: currency arbitrage detection (log weights, check negative cycle).'},
      {t:'Topological Sort & Kahn\'s Algorithm',d:'Only for DAGs (Directed Acyclic Graphs). DFS-based: add node to result after all descendants processed (reverse postorder). Kahn\'s algorithm: (1) Compute in-degree of all nodes. (2) Enqueue nodes with in-degree 0. (3) Process: dequeue, add to result, decrement neighbors\' in-degree, enqueue those hitting 0. If result size < V → cycle exists. Applications: task scheduling, build systems (make, webpack), course prerequisites, spreadsheet evaluation order.'},
      {t:'SCC — Kosaraju & Tarjan',d:'Strongly Connected Component: every node reachable from every other. Kosaraju\'s: (1) DFS on G, record finish times. (2) Transpose G. (3) DFS on G^T in reverse finish order — each DFS tree is one SCC. O(V+E). Tarjan\'s: single DFS with stack and low-link values. When low[v]==disc[v], v is root of SCC — pop stack until v. O(V+E). SCCs form DAG (condensation graph) — useful for 2-SAT, dependency analysis. 2-SAT solution: model each clause as implications, find SCCs, check if x and ¬x in same SCC (→ unsatisfiable).'},
      {t:'Minimum Spanning Tree — Kruskal vs Prim',d:'MST: V-1 edges connecting all nodes with minimum total weight. Kruskal\'s: sort edges by weight, greedily add if doesn\'t form cycle (Union-Find). O(E log E). Best for sparse graphs. Prim\'s: grow MST from start node, always add cheapest edge to un-MST node. O((V+E) log V) with heap, O(V²) naive (best for dense). Union-Find for Kruskal: path compression + union by rank → nearly O(1) per operation (inverse Ackermann α(n)). Applications: network design, clustering, Borůvka\'s algorithm for parallel MST.'},
    ],
    complexity:'BFS/DFS O(V+E) · Dijkstra O((V+E)logV) · Bellman-Ford O(VE) · Floyd-Warshall O(V³) · MST O(E logE)',
    code:`// Dijkstra's — O((V+E) log V)
const dijkstra = (n, edges, src) => {
  const adj = Array.from({length:n}, ()=>[]);
  for(const [u,v,w] of edges) {adj[u].push([v,w]); adj[v].push([u,w]);}
  const dist = new Array(n).fill(Infinity); dist[src] = 0;
  const pq = [[0, src]];
  while(pq.length) {
    pq.sort(([a],[b])=>a-b);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u])
      if (dist[u]+w < dist[v]) {dist[v]=dist[u]+w; pq.push([dist[v],v]);}
  }
  return dist;
};

// Union-Find for cycle detection / MST
class DSU {
  constructor(n) {this.parent=Array.from({length:n},(_,i)=>i); this.rank=new Array(n).fill(0);}
  find(x) {return this.parent[x]===x?x:(this.parent[x]=this.find(this.parent[x]));}
  union(a,b) {
    const [pa,pb]=[this.find(a),this.find(b)];
    if(pa===pb) return false;
    if(this.rank[pa]<this.rank[pb]) this.parent[pa]=pb;
    else if(this.rank[pa]>this.rank[pb]) this.parent[pb]=pa;
    else {this.parent[pb]=pa; this.rank[pa]++;}
    return true;
  }
}`
  },
  { id:'heaps', cat:'ds', title:'Heaps & Priority Queues', icon:'△', viz:'none', color:T.or,
    tags:['Min-Heap','Max-Heap','Top-K','Build O(n)'],
    overview:'A heap is a complete binary tree with heap property. Root = minimum/maximum. Stored as array for cache efficiency. Powers priority queues used in Dijkstra, Huffman coding, and top-K problems.',
    points:[
      {t:'Array Representation',d:'Node at i: left child at 2i+1, right child at 2i+2, parent at (i-1)/2. Cache-friendly — children adjacent in memory.'},
      {t:'Build Heap O(n)',d:'Sift down from last internal node (n/2-1) to root. Mathematical proof: series converges to O(n), not O(n log n).'},
      {t:'Top-K Pattern',d:'K largest: min-heap of size K. For each element, if larger than heap top, replace and sift down. O(n log K). Much better than O(n log n) full sort when K << n.'},
      {t:'Median of Stream',d:'Two heaps: max-heap for lower half, min-heap for upper half. Balance after each insert. O(log n) insert, O(1) median.'},
    ],
    complexity:'Insert O(log n) · Extract O(log n) · Peek O(1) · Build O(n)',
    code:`class MinHeap {
  #h=[];
  #p=i=>(i-1)>>1; #l=i=>2*i+1; #r=i=>2*i+2;
  push(v) {this.#h.push(v); this.#up(this.#h.length-1);}
  pop()   {const m=this.#h[0],l=this.#h.pop();if(this.#h.length){this.#h[0]=l;this.#dn(0);}return m;}
  peek()  {return this.#h[0];}
  size()  {return this.#h.length;}
  #up(i)  {while(i>0&&this.#h[this.#p(i)]>this.#h[i]){const p=this.#p(i);[this.#h[i],this.#h[p]]=[this.#h[p],this.#h[i]];i=p;}}
  #dn(i)  {const n=this.#h.length;let m=i;const l=this.#l(i),r=this.#r(i);if(l<n&&this.#h[l]<this.#h[m])m=l;if(r<n&&this.#h[r]<this.#h[m])m=r;if(m!==i){[this.#h[i],this.#h[m]]=[this.#h[m],this.#h[i]];this.#dn(m);}}
}

// Top-K Largest — O(n log k)
const topK = (nums, k) => {
  const h = new MinHeap();
  for (const n of nums) { h.push(n); if (h.size()>k) h.pop(); }
  const res=[]; while(h.size()) res.push(h.pop());
  return res.reverse();
};`
  },

  // ── Complexity ────────────────────────────────────────────────────────
  { id:'big-o', cat:'complex', title:'Big-O Notation', icon:'Ω', viz:'bigo', color:T.ye,
    tags:['Time Complexity','Space Complexity','Amortized','Master Theorem'],
    overview:"Big-O describes how algorithm runtime or memory usage scales with input size n. It's the universal language for algorithm analysis. Master this to predict performance and communicate in technical interviews.",
    points:[
      {t:'O(1) Constant',d:'Independent of n. Array index, hash table get/set, stack push/pop.'},
      {t:'O(log n) Logarithmic',d:'Halves problem each step. log₂(1,000,000,000) = 30 steps! Binary search, BST ops, heap ops.'},
      {t:'O(n log n) Linearithmic',d:'Optimal comparison sort lower bound. Merge sort, heap sort, quicksort average.'},
      {t:'Amortized Analysis',d:'Average cost per operation over a sequence. Dynamic array doubling: single resize is O(n) but amortized O(1) per push.'},
      {t:'Master Theorem',d:'T(n)=aT(n/b)+f(n). Compare f(n) with n^log_b(a): smaller → case 1 O(n^k); equal → case 2 O(n^k log n); larger → case 3 O(f(n)).'},
    ],
    complexity:'O(1)<O(log n)<O(√n)<O(n)<O(n log n)<O(n²)<O(2^n)<O(n!)',
    code:`/* Big-O Quick Reference
O(1)      arr[i], hash.get(k), stack.push(x)
O(log n)  Binary search, BST ops, heap ops
O(n)      Linear scan, string copy
O(n logn) Merge/quick/heap sort, FFT
O(n^2)    Nested loops, naive string match
O(2^n)    Subsets, fib without memo
O(n!)     Permutations, backtracking all paths

Rules:
- Drop constants:   O(3n) -> O(n)
- Drop lower terms: O(n^2 + n) -> O(n^2)
- Different inputs: O(a + b) not O(n)
*/

// O(1) space in-place sort
const bubbleSort = arr => {
  const n = arr.length;
  for (let i=0; i<n-1; i++)
    for (let j=0; j<n-i-1; j++)
      if (arr[j] > arr[j+1]) [arr[j],arr[j+1]] = [arr[j+1],arr[j]];
  return arr;
};

// Amortized O(1) dynamic array
class DynamicArray {
  constructor() { this.data=[]; this.size=0; this.cap=1; }
  push(x) {
    if (this.size===this.cap) {
      // O(n) resize, but amortized O(1) per push
      const newData = new Array(this.cap*2);
      for(let i=0;i<this.size;i++) newData[i]=this.data[i];
      this.data=newData; this.cap*=2;
    }
    this.data[this.size++]=x;
  }
}`
  },

  // ── Neural Networks (Deep Learning) ──────────────────────────────────
  { id:'neural-nets', cat:'dl', title:'Neural Networks', icon:'◉', viz:'neuralnet', color:T.mg,
    tags:['Backpropagation','Activation','Gradient Descent','Layers'],
    overview:'Artificial neural networks are universal function approximators composed of layers of interconnected neurons. Learning happens via backpropagation — computing gradients of the loss using the chain rule and updating weights via gradient descent.',
    points:[
      {t:'Forward Pass',d:'Input → Layer 1: z=Wx+b, a=σ(z) → ... → Output → Loss. Each layer transforms representation. Deeper = more abstract features.'},
      {t:'Activation Functions',d:'ReLU: max(0,x) — sparse, no vanishing gradient. Sigmoid: 1/(1+e^-x) — saturates. Tanh: zero-centered. GELU: smooth ReLU, used in transformers. Softmax: probability distribution.'},
      {t:'Backpropagation',d:'Chain rule applied backward: ∂L/∂W = ∂L/∂a × ∂a/∂z × ∂z/∂W. Gradients flow backward through same computational graph.'},
      {t:'Batch Normalization',d:'Normalize activations to zero mean, unit variance per batch. Learnable scale/shift. Enables higher learning rates, regularization effect.'},
    ],
    complexity:'Forward O(n×d×h) · Backprop same FLOPs · Training O(epochs×n×params)',
    code:`// Neural network layer from scratch
const sigmoid = x => 1/(1+Math.exp(-x));
const relu    = x => Math.max(0, x);
const softmax = v => {
  const m=Math.max(...v), e=v.map(x=>Math.exp(x-m));
  const s=e.reduce((a,b)=>a+b);
  return e.map(x=>x/s);
};

class Dense {
  constructor(inSize, outSize) {
    const std = Math.sqrt(2/inSize); // He init
    this.W = Array.from({length:outSize}, () =>
      Array.from({length:inSize}, ()=>(Math.random()-.5)*2*std));
    this.b = new Array(outSize).fill(0);
  }
  forward(x) {
    this.x = x;
    this.z = this.W.map(row =>
      row.reduce((s,w,i)=>s+w*x[i], 0) + this.b[...]);
    return this.z.map(v => relu(v));
  }
  backward(dOut, lr) {
    const dZ = dOut.map((g,i) => g * (this.z[i]>0?1:0));
    this.W = this.W.map((row,i) =>
      row.map((w,j) => w - lr*dZ[i]*this.x[j]));
    return this.x.map((_,j) =>
      dZ.reduce((s,g,i)=>s+g*this.W[i][j], 0));
  }
}`
  },
  { id:'transformers', cat:'nlp', title:'Transformers & Attention', icon:'⊛', viz:'attention', color:'#ff9d40',
    tags:['Self-Attention','Multi-Head','Positional Encoding','LLMs'],
    overview:"The Transformer (2017) replaced sequential RNNs with parallel self-attention, enabling training on massive text corpora. Every modern LLM (GPT-4, Claude, Gemini) is a transformer. 'Attention is All You Need' changed AI forever.",
    points:[
      {t:'Self-Attention Intuition',d:"Each token looks at all other tokens to gather context. 'bank' in 'river bank' vs 'bank account' gets different representations based on surrounding words."},
      {t:'Query-Key-Value',d:'Q = what I am looking for, K = what I contain, V = what I will contribute. Score = softmax(QKᵀ/√d_k). Output = score-weighted sum of V.'},
      {t:'Multi-Head Attention',d:'Run h attention heads in parallel with different weight matrices. Each head specializes: one for syntax, one for semantics. Concatenate and project.'},
      {t:'Positional Encoding',d:'Transformers have no inherent position sense. Add sinusoidal signal: PE(pos,2i) = sin(pos/10000^(2i/d)). Learned embeddings also used.'},
    ],
    complexity:'Self-attention O(n²d) · FFN O(nd²) · Inference with KV-cache O(nd) per token',
    code:`// Scaled Dot-Product Attention
const attention = (Q, K, V, causal=false) => {
  const dk = Q[0].length;
  const scores = Q.map(q => K.map(k =>
    q.reduce((s,v,i)=>s+v*k[i], 0)/Math.sqrt(dk)));
  if (causal) // mask future positions for decoder
    scores.forEach((row,i) => row.forEach((_,j)=>{if(j>i) scores[i][j]=-Infinity;}));
  const weights = scores.map(row => {
    const m=Math.max(...row), e=row.map(v=>Math.exp(v-m));
    const s=e.reduce((a,b)=>a+b);
    return e.map(v=>v/s);
  });
  return weights.map(w =>
    V[0].map((_,j) => w.reduce((s,wi,i)=>s+wi*V[i][j], 0)));
};

// Positional Encoding
const posEncoding = (maxLen, dModel) =>
  Array.from({length:maxLen}, (_,pos) =>
    Array.from({length:dModel}, (_,i) =>
      i%2===0 ? Math.sin(pos/Math.pow(10000,i/dModel))
              : Math.cos(pos/Math.pow(10000,(i-1)/dModel))));`
  },
  { id:'ml-basics', cat:'ml', title:'Machine Learning Basics', icon:'◑', viz:'none', color:T.rd,
    tags:['Supervised','Gradient Descent','Regularization','Cross-Validation'],
    overview:'Machine learning enables systems to learn from data. Core concepts: loss functions, gradient descent, bias-variance tradeoff, regularization, and proper evaluation prevent false confidence in model quality.',
    points:[
      {t:'Loss Functions',d:'Regression: MSE=(1/n)Σ(y-ŷ)². Classification: Cross-entropy=-Σy·log(ŷ). Lower is better. The choice determines what optimal means.'},
      {t:'Gradient Descent',d:'θ ← θ - η∇L(θ). Learning rate η: too small = slow, too large = diverge. Mini-batch (32-512): balance accuracy and speed.'},
      {t:'Bias-Variance',d:'Underfitting (high bias): model too simple. Overfitting (high variance): memorizes training data. Sweet spot: validation curve minimum.'},
      {t:'Regularization',d:'L1 (Lasso): sparse weights. L2 (Ridge): small weights. Dropout: random zero-out during training. Early stopping: stop when validation loss increases.'},
    ],
    complexity:'Training O(n×d×epochs) · Inference O(d) linear · Cross-validation O(k × training_time)',
    code:`// Linear Regression with gradient descent
class LinearRegression {
  constructor({lr=0.01, epochs=1000}={}) {
    this.lr=lr; this.epochs=epochs; this.w=null; this.b=0;
  }
  fit(X, y) {
    const n=X.length, d=X[0].length;
    this.w = new Array(d).fill(0);
    for (let e=0; e<this.epochs; e++) {
      const preds = X.map(x => x.reduce((s,xi,i)=>s+xi*this.w[i],0)+this.b);
      const errors = preds.map((p,i)=>p-y[i]);
      const dw = this.w.map((_,j)=>errors.reduce((s,e,i)=>s+e*X[i][j],0)/n);
      const db = errors.reduce((s,e)=>s+e,0)/n;
      this.w = this.w.map((w,j)=>w-this.lr*dw[j]);
      this.b -= this.lr*db;
    }
  }
  predict(X) { return X.map(x=>x.reduce((s,xi,i)=>s+xi*this.w[i],0)+this.b); }
}

// K-fold cross validation
const kFoldCV = (X, y, model, k=5) => {
  const n=X.length, foldSize=Math.floor(n/k), scores=[];
  for(let i=0;i<k;i++){
    const valIdxs=Array.from({length:foldSize},(_,j)=>i*foldSize+j);
    const valSet=new Set(valIdxs);
    model.fit(X.filter((_,j)=>!valSet.has(j)), y.filter((_,j)=>!valSet.has(j)));
    scores.push(model.score(valIdxs.map(j=>X[j]), valIdxs.map(j=>y[j])));
  }
  return scores.reduce((a,b)=>a+b)/k;
};`
  },
  { id:'cnn', cat:'dl', title:'CNNs — Convolutional Networks', icon:'⊟', viz:'none', color:T.cy,
    tags:['Convolution','Pooling','Transfer Learning','ResNet'],
    overview:'CNNs exploit spatial structure in images: nearby pixels are related, and patterns appear at multiple locations. Shared filters detect local patterns efficiently. Deeper layers learn increasingly abstract features.',
    points:[
      {t:'Convolution',d:'Slide k×k filter over input. Element-wise multiply with patch, sum. Multiple filters → multiple feature maps. Parameters: k×k×C_in×C_out (+biases).'},
      {t:'Spatial Hierarchy',d:'Layer 1: edges. Layer 2: textures. Layer 3: object parts. Layer 4+: whole objects. Each layer has larger receptive field.'},
      {t:'ResNet Skip Connections',d:'output = F(x) + x. If gradient vanishes through F, it flows through x. Enables training of 50-1000+ layer networks without vanishing gradients.'},
      {t:'Transfer Learning',d:'Use pretrained CNN (ImageNet) as feature extractor. Replace final layers, fine-tune on your data. Works well with only 100-1000 images.'},
    ],
    complexity:'Conv layer O(k²×C_in×C_out×H×W) · ResNet-50: 25M params ~100MB',
    code:`// Convolution (educational — use GPU libs in practice)
const conv2d = (input, kernel, stride=1, padding=0) => {
  const [H,W]=[input.length, input[0].length], k=kernel.length;
  const padded = Array.from({length:H+2*padding}, (_,i) =>
    Array.from({length:W+2*padding}, (_,j) => {
      const ri=i-padding, cj=j-padding;
      return (ri>=0&&ri<H&&cj>=0&&cj<W) ? input[ri][cj] : 0;
    }));
  const [OH,OW]=[Math.floor((H+2*padding-k)/stride+1), Math.floor((W+2*padding-k)/stride+1)];
  return Array.from({length:OH}, (_,i) =>
    Array.from({length:OW}, (_,j) => {
      let sum=0;
      for(let fi=0;fi<k;fi++) for(let fj=0;fj<k;fj++)
        sum+=padded[i*stride+fi][j*stride+fj]*kernel[fi][fj];
      return sum;
    }));
};

// Max Pooling
const maxPool = (f, k=2, stride=2) => {
  const [H,W]=[f.length,f[0].length];
  return Array.from({length:Math.floor((H-k)/stride+1)}, (_,i) =>
    Array.from({length:Math.floor((W-k)/stride+1)}, (_,j) => {
      let max=-Infinity;
      for(let fi=0;fi<k;fi++) for(let fj=0;fj<k;fj++)
        max=Math.max(max, f[i*stride+fi][j*stride+fj]);
      return max;
    }));
};`
  },
  { id:'databases', cat:'db', title:'Databases', icon:'⊗', viz:'none', color:T.pk,
    tags:['SQL','ACID','Indexing','NoSQL','CAP'],
    overview:'Databases organize and store data for efficient retrieval. Relational databases enforce ACID properties. NoSQL offers flexible schemas for distributed systems. Understanding indexing, normalization, and the CAP theorem is essential for backend engineering.',
    points:[
      {t:'ACID Properties',d:'Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions), Durability (committed = persisted). Foundation of reliable transactions.'},
      {t:'B-Tree Indexing',d:'O(log n) lookup, range queries, insertion, deletion. Node fits one disk page (4-16KB). Clustered index: data stored in B-tree order. Secondary index: pointer to row.'},
      {t:'Normalization',d:'1NF: atomic values. 2NF: no partial key dependencies. 3NF: no transitive dependencies. BCNF: every determinant is candidate key. Reduces redundancy and anomalies.'},
      {t:'CAP Theorem',d:'Distributed system: at most 2 of Consistency, Availability, Partition Tolerance. CA: traditional SQL. CP: Zookeeper. AP: Cassandra, DynamoDB.'},
    ],
    complexity:'B-tree O(log n) · Hash index O(1) equality · Full scan O(n) · Join O(n×m) naive, O(n+m) hash join',
    code:`-- SQL: Advanced patterns

-- Window Functions
SELECT emp_id, department, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg,
  LAG(salary) OVER (ORDER BY hire_date) AS prev_salary
FROM employees;

-- Recursive CTE — org chart
WITH RECURSIVE hierarchy AS (
  SELECT id, name, manager_id, 0 AS depth
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, h.depth+1
  FROM employees e JOIN hierarchy h ON e.manager_id = h.id
)
SELECT REPEAT('  ', depth) || name AS chart FROM hierarchy ORDER BY depth;

-- Covering index (all needed cols in index — no heap access)
CREATE INDEX idx_cover ON orders(user_id, created_at, total);

-- Partial index (index only active users)
CREATE INDEX idx_active ON users(email) WHERE active = true;`
  },
  { id:'big-o-notation', cat:'complex', title:'Time & Space Complexity', icon:'⊡', viz:'bigo', color:T.ye,
    tags:['Analysis','Recurrence','Amortized','Best/Average/Worst'],
    overview:'Complexity analysis determines how algorithms scale. Understanding best, average, and worst case time complexity — and how to calculate it — is fundamental for algorithm design and selection.',
    points:[
      {t:'How to Calculate',d:'Count operations as function of n. Drop constants and lower-order terms. Nested loops multiply complexities. Different inputs = different variables: O(a+b) for two arrays.'},
      {t:'Recurrence Relations',d:'Express T(n) in terms of T(smaller). Merge sort: T(n)=2T(n/2)+O(n). Solve with recursion tree or Master Theorem.'},
      {t:'Amortized Analysis',d:'Average cost over sequence of operations. Dynamic array: single resize O(n) but total n pushes = O(n) → O(1) amortized. Banker/Physicist/Aggregate methods.'},
      {t:'Space Complexity',d:'Auxiliary space only (not input). O(1): in-place. O(log n): recursive (call stack). O(n): storing copy. O(n²): 2D DP table.'},
    ],
    complexity:'See Big-O Notation page for complete complexity reference',
    code:`/* Complexity Analysis Examples */

// O(n log n) — single sort determines complexity
const findDuplicates = arr => {
  arr.sort((a,b)=>a-b);  // O(n log n)
  const dups = [];
  for (let i=1; i<arr.length; i++)  // O(n)
    if (arr[i]===arr[i-1]) dups.push(arr[i]);
  return dups; // Total: O(n log n)
};

// O(n) using hash set — better!
const findDuplicatesLinear = arr => {
  const seen=new Set(), dups=[];
  for (const x of arr)
    seen.has(x) ? dups.push(x) : seen.add(x);
  return dups; // O(n) time, O(n) space
};

// Recursion tree analysis
// fib(n) = fib(n-1) + fib(n-2)
// Tree has 2^n nodes → O(2^n) without memo
// With memo: each unique n computed once → O(n)

// Master Theorem examples:
// T(n) = 2T(n/2) + O(n)  → a=2,b=2,k=1 → O(n log n) [Merge Sort]
// T(n) = T(n/2) + O(1)   → a=1,b=2,k=0 → O(log n) [Binary Search]
// T(n) = 4T(n/2) + O(n)  → a=4,b=2,k=2 → O(n^2) [Matrix Multiply naive]`
  },
  { id:'operating-systems', cat:'sys', title:'Operating Systems', icon:'⊙', viz:'none', color:T.or,
    tags:['Processes','Scheduling','Memory','Deadlock','File Systems'],
    overview:'The OS manages hardware resources and provides services to applications. Core concepts: processes, threads, virtual memory, CPU scheduling, deadlock, and file systems explain why software behaves the way it does.',
    points:[
      {t:'Process vs Thread',d:'Process: own address space, heap, stack. Thread: shares heap with siblings, has own stack/registers. Thread context switch ~5x faster than process.'},
      {t:'CPU Scheduling',d:'CFS (Linux): Completely Fair Scheduler. Red-black tree ordered by virtual runtime. Round Robin: time quantum. Priority: starvation risk → aging solution.'},
      {t:'Virtual Memory',d:'Each process sees private virtual address space. MMU translates virtual→physical via page tables. TLB caches translations. Page fault: load from disk (~1ms = 100,000x slower than TLB hit).'},
      {t:'Deadlock',d:'Four conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. All must hold. Prevention: break any condition. Detection: resource allocation graph cycle.'},
    ],
    complexity:'Context switch ~5-15μs · TLB miss ~100 cycles · Page fault ~1-10ms',
    code:`// OS Concepts in code

// Round-Robin Scheduler simulation
const roundRobin = (processes, quantum=20) => {
  const ready=[...processes.map(p=>({...p,remaining:p.burst}))];
  const gantt=[]; let time=0;
  while(ready.some(p=>p.remaining>0)){
    for(const p of ready){
      if(p.remaining<=0) continue;
      const run=Math.min(p.remaining,quantum);
      gantt.push({pid:p.pid,start:time,end:time+run});
      time+=run; p.remaining-=run;
    }
  }
  return gantt;
};

// Semaphore (conceptual)
class Semaphore {
  #count; #queue=[];
  constructor(n) { this.#count=n; }
  async wait() {
    if (this.#count > 0) { this.#count--; return; }
    return new Promise(r => this.#queue.push(r));
  }
  signal() {
    if (this.#queue.length) this.#queue.shift()();
    else this.#count++;
  }
}

// Virtual Memory translation (conceptual)
class VirtualMemory {
  constructor(pageSize=4096) { this.pageSize=pageSize; this.pageTable=new Map(); this.nextFrame=0; }
  translate(vAddr) {
    const pageNum=Math.floor(vAddr/this.pageSize), offset=vAddr%this.pageSize;
    if(!this.pageTable.has(pageNum)) {
      console.log('PAGE FAULT — loading from disk');
      this.pageTable.set(pageNum, this.nextFrame++);
    }
    return this.pageTable.get(pageNum)*this.pageSize + offset;
  }
}`
  },
  { id:'computer-networks', cat:'net', title:'Computer Networks', icon:'⊕', viz:'none', color:T.bl,
    tags:['OSI Model','TCP/IP','HTTP/3','DNS','TLS'],
    overview:'Computer networking is the infrastructure of modern computing. From physical bits to HTTP requests, seven layers of abstraction work together to deliver data reliably across the globe. Essential for backend development and distributed systems.',
    points:[
      {t:'TCP 3-Way Handshake',d:'1. Client→Server: SYN(seq=x). 2. Server→Client: SYN-ACK(seq=y,ack=x+1). 3. Client→Server: ACK(ack=y+1). Connection established! Four-way FIN for teardown.'},
      {t:'HTTP/2 vs HTTP/3',d:'HTTP/2: multiplexed streams over single TCP, header compression (HPACK), server push. HTTP/3: QUIC (UDP-based), 0-RTT connection, independent streams — no TCP head-of-line blocking.'},
      {t:'TLS 1.3',d:'1 RTT vs 2 RTT for TLS 1.2. Client hello → Server hello+cert+finished → Client finished. ECDHE for key exchange. Certificate chain validates up to trusted CA.'},
      {t:'DNS Resolution',d:'Browser cache → OS cache → Recursive resolver → Root NS → TLD NS → Authoritative NS. Records: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT.'},
    ],
    complexity:'DNS lookup 50-200ms first, <1ms cached · TCP handshake 1 RTT · TLS 1.3 adds 1 RTT · HTTP/2 ~10ms after connection',
    code:`// Network programming patterns

// Retry with exponential backoff + jitter
const fetchWithRetry = async (url, maxRetries=5) => {
  for(let i=0; i<maxRetries; i++){
    try { return await fetch(url); }
    catch(e) {
      if(i===maxRetries-1) throw e;
      const delay = (2**i)*100 + Math.random()*100;
      await new Promise(r=>setTimeout(r, delay));
    }
  }
};

// WebSocket with reconnection
class ReconnectingWS {
  constructor(url) { this.url=url; this.connect(); }
  connect() {
    this.ws=new WebSocket(this.url);
    this.ws.onclose=()=>setTimeout(()=>this.connect(), 1000+Math.random()*2000);
    this.ws.onmessage=e=>this.onmessage?.(e);
  }
  send(data) { if(this.ws.readyState===WebSocket.OPEN) this.ws.send(data); }
}

// Rate Limiter — Token Bucket
class TokenBucket {
  constructor(capacity, refillRate) {
    this.tokens=capacity; this.capacity=capacity;
    this.refillRate=refillRate; this.lastRefill=Date.now();
  }
  consume(tokens=1) {
    const now=Date.now(), elapsed=(now-this.lastRefill)/1000;
    this.tokens=Math.min(this.capacity, this.tokens+elapsed*this.refillRate);
    this.lastRefill=now;
    if(this.tokens>=tokens) { this.tokens-=tokens; return true; }
    return false;
  }
}`
  },
  { id:'linear-algebra', cat:'math', title:'Linear Algebra for ML', icon:'∥', viz:'none', color:T.tl,
    tags:['Matrices','SVD','PCA','Dot Product','Eigenvalues'],
    overview:"Linear algebra is the mathematical foundation of ML. Every neural network layer is a matrix multiplication. Attention is matrix operations. PCA is eigendecomposition. Understanding high-dimensional spaces is essential for ML intuition.",
    points:[
      {t:'Dot Product & Similarity',d:'v·w = Σvᵢwᵢ = |v||w|cos(θ). Cosine similarity: (v·w)/(|v||w|) ∈ [-1,1]. Foundation of word embeddings and recommendation systems.'},
      {t:'SVD: A = UΣVᵀ',d:'Any matrix decomposes into orthogonal U, diagonal Σ (singular values), orthogonal Vᵀ. Applications: PCA, recommendation systems, image compression, pseudo-inverse.'},
      {t:'Gradient as Vector',d:'∇f(x) = vector of partial derivatives. Points in direction of steepest ascent. ||∇f|| = rate of increase. Gradient descent: x ← x - η∇f(x).'},
      {t:'Matrix Multiplication',d:'(AB)ᵢⱼ = ΣₖAᵢₖBₖⱼ. Not commutative. O(mnk) naive. CUDA GPUs parallelize across thousands of cores. Foundation of every deep learning forward pass.'},
    ],
    complexity:'MatMul O(mnk) · Eigendecomp O(n³) · SVD O(min(m,n)²×max(m,n))',
    code:`// Linear Algebra for ML

const dot     = (a,b) => a.reduce((s,v,i)=>s+v*b[i], 0);
const norm    = v => Math.sqrt(dot(v,v));
const cosine  = (a,b) => dot(a,b)/(norm(a)*norm(b)||1);
const softmax = v => { const m=Math.max(...v),e=v.map(x=>Math.exp(x-m)),s=e.reduce((a,b)=>a+b);return e.map(x=>x/s); };

// Matrix multiply — O(mnk)
const matMul = (A,B) => {
  const [m,k,n]=[A.length,A[0].length,B[0].length];
  const C=Array.from({length:m},()=>new Array(n).fill(0));
  for(let i=0;i<m;i++) for(let j=0;j<n;j++) for(let l=0;l<k;l++) C[i][j]+=A[i][l]*B[l][j];
  return C;
};

// PCA — find directions of maximum variance
class PCA {
  constructor(k) { this.k=k; }
  fit(X) {
    const n=X.length, d=X[0].length;
    this.mean=X[0].map((_,j)=>X.reduce((s,r)=>s+r[j],0)/n);
    const Xc=X.map(r=>r.map((v,j)=>v-this.mean[j]));
    const C=Array.from({length:d},(_,i)=>Array.from({length:d},(_,j)=>
      Xc.reduce((s,r)=>s+r[i]*r[j],0)/(n-1)));
    this.components=[];
    for(let comp=0;comp<this.k;comp++){
      let v=new Array(d).fill(0); v[comp]=1; let lambda=0;
      for(let iter=0;iter<200;iter++){
        const Av=C.map(row=>row.reduce((s,c,j)=>s+c*v[j],0));
        lambda=norm(Av); v=Av.map(x=>x/(lambda||1));
      }
      this.components.push(v);
    }
    return this;
  }
  transform(X){
    const Xc=X.map(r=>r.map((v,j)=>v-this.mean[j]));
    return Xc.map(r=>this.components.map(pc=>r.reduce((s,v,i)=>s+v*pc[i],0)));
  }
}`
  },
  { id:'mlops', cat:'mlops', title:'MLOps & Deployment', icon:'⚡', viz:'none', color:'#00ffd0',
    tags:['Docker','Kubernetes','CI/CD','Monitoring','Feature Store'],
    overview:"MLOps bridges machine learning and DevOps. It covers model serving, monitoring, versioning, and the full ML lifecycle. The gap between 'works in notebook' and 'works at scale' is MLOps.",
    points:[
      {t:'Model Serving Patterns',d:'REST API (FastAPI): synchronous, simple. gRPC: binary protocol, 10x faster. Batch inference: millions offline. Streaming: real-time with Kafka. Edge: TFLite/ONNX for on-device.'},
      {t:'Containerization',d:'Docker: package model + dependencies + runtime. Reproducible across environments. Kubernetes orchestrates: auto-scaling, self-healing, load balancing.'},
      {t:'Model Monitoring',d:'Data drift: input distribution shifts from training. Concept drift: relationship between features and target changes. Alert when metrics degrade. SLA: p50/p99 latency.'},
      {t:'A/B Testing',d:'Shadow mode: new model runs but does not serve. Canary: route 5% traffic. A/B: split 50/50, measure business metrics. Statistical significance required.'},
    ],
    complexity:'Latency SLA <100ms user-facing · Throughput 1000+ QPS · Quantization 4x smaller, 2x faster',
    code:`# FastAPI Model Serving
from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()
model = joblib.load('model.pkl')

class PredictRequest(BaseModel):
    features: list[float]

@app.post("/predict")
async def predict(req: PredictRequest):
    pred = model.predict([req.features])[0]
    prob = model.predict_proba([req.features])[0].max()
    return {"prediction": int(pred), "confidence": float(prob)}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Dockerfile
# FROM python:3.11-slim
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install -r requirements.txt
# COPY . .
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# MLflow tracking
import mlflow
with mlflow.start_run():
    mlflow.log_params({"lr": 0.01, "epochs": 100})
    mlflow.log_metrics({"accuracy": 0.94, "f1": 0.92})
    mlflow.sklearn.log_model(model, "model")`
  },

  // ── Additional Topics — System Design ─────────────────────────────────
  { id:'system-design', cat:'sys', title:'System Design', icon:'🏗️', viz:'none', color:T.or,
    tags:['Scalability','CAP Theorem','Load Balancing','Caching','Microservices'],
    overview:'System design interviews test your ability to architect large-scale distributed systems. Master the patterns used at companies like Google, Amazon, and Meta to serve millions of users with 99.99% uptime.',
    points:[
      {t:'Scalability Patterns',d:'Vertical scaling (more RAM/CPU) hits limits. Horizontal scaling (more machines) requires stateless services, consistent hashing, load balancing. Rule of thumb: design for 10x your current traffic.'},
      {t:'CAP Theorem',d:'Consistency: all nodes see the same data. Availability: every request gets a response. Partition Tolerance: system works despite network splits. Pick 2: CA (MySQL), CP (Zookeeper), AP (Cassandra).'},
      {t:'Caching Strategies',d:'Cache-aside (Lazy): app reads cache first, misses load DB. Write-through: write to cache+DB synchronously. Write-back: write to cache, async flush to DB. Redis/Memcached for O(1) key-value.'},
      {t:'Database Sharding',d:'Horizontal partitioning: split data across multiple DB instances. Hash sharding: shard = hash(key) % N. Range sharding: by date/ID range. Problems: cross-shard joins, rebalancing, hot spots.'},
      {t:'Message Queues',d:'Kafka/RabbitMQ decouple producers from consumers. Pub-sub: fanout to many consumers. Point-to-point: single consumer. Kafka: append-only log, replay, exactly-once semantics.'},
    ],
    complexity:'Design target: 99.99% uptime = 52 min downtime/year · p99 latency <100ms · RPO/RTO for disaster recovery',
    code:`// Rate Limiter — Token Bucket Algorithm
class TokenBucket {
  constructor(capacity, refillRate) {
    this.tokens = capacity;
    this.capacity = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }
  consume(tokens = 1) {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
    if (this.tokens >= tokens) { this.tokens -= tokens; return true; }
    return false;
  }
}

// Consistent Hashing (simplified)
class ConsistentHash {
  constructor(nodes = [], replicas = 100) {
    this.ring = new Map();
    this.replicas = replicas;
    nodes.forEach(n => this.addNode(n));
  }
  hash(key) {
    let h = 5381;
    for (const c of key) h = ((h << 5) + h) + c.charCodeAt(0);
    return Math.abs(h) % 360;
  }
  addNode(node) {
    for (let i = 0; i < this.replicas; i++) {
      const pos = this.hash(\`\${node}:\${i}\`);
      this.ring.set(pos, node);
    }
  }
  getNode(key) {
    const pos = this.hash(key);
    const sorted = [...this.ring.keys()].sort((a,b)=>a-b);
    const found = sorted.find(p => p >= pos) ?? sorted[0];
    return this.ring.get(found);
  }
}

// LRU Cache
class LRUCache {
  constructor(cap) { this.cap=cap; this.cache=new Map(); }
  get(k) {
    if (!this.cache.has(k)) return -1;
    const v=this.cache.get(k); this.cache.delete(k); this.cache.set(k,v);
    return v;
  }
  put(k,v) {
    this.cache.delete(k);
    if (this.cache.size>=this.cap) this.cache.delete(this.cache.keys().next().value);
    this.cache.set(k,v);
  }
}`,
  },

  { id:'concurrency', cat:'sys', title:'Concurrency & Parallelism', icon:'⚙️', viz:'none', color:T.tl,
    tags:['Mutex','Semaphore','Deadlock','Thread Pool','Async/Await'],
    overview:'Concurrency (multiple tasks in progress) vs Parallelism (multiple tasks executing simultaneously). Understanding race conditions, locks, and concurrent data structures is essential for writing correct multi-threaded code.',
    points:[
      {t:'Race Conditions',d:'Occur when outcome depends on thread execution order. Example: counter++ is NOT atomic — read-modify-write can interleave. Fix: mutex, atomic operations, or message passing.'},
      {t:'Mutex vs Semaphore',d:'Mutex: mutual exclusion, only one thread at a time, owner-release semantics. Semaphore: counter, allows N concurrent accesses, signaling between threads. Binary semaphore ≈ mutex.'},
      {t:'Deadlock Conditions',d:'ALL four Coffman conditions must hold: (1) Mutual Exclusion, (2) Hold & Wait, (3) No Preemption, (4) Circular Wait. Prevention: always acquire locks in same order.'},
      {t:'Thread Pool',d:'Pre-spawned worker threads avoid overhead of creating threads per task. Queue tasks; workers pick them up. Java ForkJoinPool, Python ThreadPoolExecutor. Optimal size: CPU threads for CPU-bound, more for I/O-bound.'},
      {t:'Async/Await & Event Loop',d:'JavaScript: single-threaded with event loop. Async functions return Promises. await yields control without blocking. Node.js handles millions of concurrent I/O connections this way.'},
    ],
    complexity:'Context switch ~5-15μs · Lock acquisition <100ns uncontended · Thread creation ~1ms · Process creation ~10ms',
    code:`// Promise.all for parallel execution
const fetchAll = async (urls) => {
  const results = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));
  return results;
};

// Mutex simulation in JS (for educational purposes)
class Mutex {
  #queue = [];
  #locked = false;
  async acquire() {
    return new Promise(resolve => {
      if (!this.#locked) { this.#locked = true; resolve(); }
      else this.#queue.push(resolve);
    });
  }
  release() {
    if (this.#queue.length) this.#queue.shift()();
    else this.#locked = false;
  }
}

// Producer-Consumer with async generator
async function* producer(items) {
  for (const item of items) {
    await new Promise(r => setTimeout(r, 100));
    yield item;
  }
}

async function consumer(gen) {
  for await (const item of gen) {
    console.log('Processing:', item);
  }
}

// Worker pool pattern
class WorkerPool {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  async run(task) {
    if (this.running >= this.concurrency) {
      await new Promise(r => this.queue.push(r));
    }
    this.running++;
    try { return await task(); }
    finally {
      this.running--;
      if (this.queue.length) this.queue.shift()();
    }
  }
}`,
  },

  { id:'distributed-systems', cat:'sys', title:'Distributed Systems', icon:'🌐', viz:'none', color:T.bl,
    tags:['Consensus','Raft','Paxos','Eventual Consistency','Vector Clocks'],
    overview:'Distributed systems coordinate multiple machines to work as one. The fundamental challenge: partial failures — some nodes fail while others keep running. Master consensus protocols, consistency models, and fault tolerance.',
    points:[
      {t:'Consensus Protocols',d:'Raft: leader election + log replication. 3 roles: Leader, Follower, Candidate. Term-based elections. Leader sends heartbeats. Paxos: more complex but foundational. etcd, Consul, Zookeeper use Raft.'},
      {t:'Consistency Models',d:'Strong: linearizability — reads always see latest write. Eventual: all replicas converge given no new writes. Causal: respect cause-effect ordering. Read-your-writes: see your own writes. Session: consistency within a session.'},
      {t:'Vector Clocks',d:'Track causal history. Each node i has timestamp V[i]. On send: increment V[i], attach V. On receive: V[j] = max(V[j], recv[j]) for all j. Detects concurrent vs causal ordering without global clock.'},
      {t:'Two-Phase Commit (2PC)',d:'Phase 1: Coordinator sends Prepare to all participants. Each votes Yes/No. Phase 2: if all Yes → Commit; else → Abort. Problem: blocking if coordinator crashes after prepare.'},
    ],
    complexity:'Network latency 1-100ms · Consensus round trips O(n) messages · Raft leader election O(log n) expected · Replication overhead ~10-20% throughput reduction',
    code:`// Simplified Raft log replication (conceptual)
class RaftNode {
  constructor(id, peers) {
    this.id = id; this.peers = peers;
    this.state = 'follower'; // follower | candidate | leader
    this.term = 0; this.log = []; this.commitIdx = -1;
    this.votes = new Set(); this.leader = null;
  }
  startElection() {
    this.state = 'candidate'; this.term++;
    this.votes = new Set([this.id]);
    this.peers.forEach(p => p.requestVote(this.id, this.term));
  }
  requestVote(candidateId, term) {
    if (term > this.term) { this.term = term; this.state = 'follower'; }
    return term >= this.term ? { granted: true } : { granted: false };
  }
  receiveVote() {
    this.votes.add(arguments[0]);
    if (this.votes.size > (this.peers.length + 1) / 2 && this.state === 'candidate') {
      this.becomeLeader();
    }
  }
  becomeLeader() {
    this.state = 'leader';
    console.log(\`Node \${this.id} became leader for term \${this.term}\`);
  }
}

// Vector clock
class VectorClock {
  constructor(nodes) { this.clock = Object.fromEntries(nodes.map(n => [n, 0])); }
  tick(nodeId) { this.clock[nodeId]++; return {...this.clock}; }
  merge(other) {
    for (const k in this.clock) this.clock[k] = Math.max(this.clock[k], other[k] || 0);
    return this;
  }
  happensBefore(other) {
    return Object.keys(this.clock).every(k => this.clock[k] <= other[k]) &&
           Object.keys(this.clock).some(k => this.clock[k] < other[k]);
  }
}`,
  },

  // ── Computer Vision ────────────────────────────────────────────────────
  { id:'computer-vision', cat:'cv', title:'Computer Vision', icon:'👁️', viz:'none', color:'#39ff9a',
    tags:['CNNs','Object Detection','Segmentation','ViT','YOLO'],
    overview:'Computer vision enables machines to interpret visual information from images and video. From face recognition to medical imaging, CV powers billions of real-world applications. Modern CV uses deep learning — primarily CNNs and Vision Transformers.',
    points:[
      {t:'Image Classification',d:'Input: image → Output: class label + confidence. CNN architecture: Conv layers extract features, pooling downsamples, FC layers classify. ImageNet accuracy: humans 5% error → ResNet 3.5% → EfficientNet 1.8%.'},
      {t:'Object Detection',d:'Locate AND classify multiple objects. Two-stage: R-CNN → RPN proposals → classify (slow, accurate). One-stage: YOLO, SSD — direct bbox regression (fast, real-time 30+ FPS). YOLO v8: real-time state-of-art.'},
      {t:'Semantic Segmentation',d:'Classify each pixel. Encoder-decoder: U-Net (medical), DeepLab (autonomous driving). FCN: replace FC with 1×1 conv for pixel-wise output. DeepLabv3+: atrous convolution for multi-scale context.'},
      {t:'Vision Transformers (ViT)',d:'Split image into 16×16 patches → flatten → embed → add position encoding → transformer encoder. ViT-Huge matches/beats CNN on ImageNet with enough data. CLIP: trains image-text pairs for zero-shot.'},
      {t:'Generative Models',d:'GAN: generator vs discriminator adversarial training. Diffusion (DALL-E, Stable Diffusion): learn to denoise. VAE: encode to latent space, decode. ControlNet: conditioning on depth/edges/pose.'},
    ],
    complexity:'ResNet-50: 25M params, 4GFLOPs/image · YOLO inference: 3ms per image · Segmentation: O(HW) per pixel',
    code:`// Image preprocessing pipeline (NumPy-style in JS)
const preprocess = (imageData, targetSize = [224, 224]) => {
  // Normalize to [0,1] and apply ImageNet mean/std
  const mean = [0.485, 0.456, 0.406];
  const std  = [0.229, 0.224, 0.225];
  // imageData: Uint8Array of RGBA values
  const pixels = [];
  for (let i = 0; i < imageData.length; i += 4) {
    pixels.push(
      (imageData[i]   / 255 - mean[0]) / std[0], // R
      (imageData[i+1] / 255 - mean[1]) / std[1], // G
      (imageData[i+2] / 255 - mean[2]) / std[2]  // B
    );
  }
  return pixels; // CHW format for tensor
};

// Non-Maximum Suppression for object detection
const nms = (boxes, scores, iouThreshold = 0.5) => {
  const order = [...scores.keys()].sort((a,b) => scores[b]-scores[a]);
  const keep = [];
  const suppressed = new Set();
  for (const i of order) {
    if (suppressed.has(i)) continue;
    keep.push(i);
    for (const j of order) {
      if (suppressed.has(j) || i === j) continue;
      if (iou(boxes[i], boxes[j]) > iouThreshold) suppressed.add(j);
    }
  }
  return keep;
};

const iou = ([x1,y1,x2,y2], [x3,y3,x4,y4]) => {
  const ix1=Math.max(x1,x3), iy1=Math.max(y1,y3);
  const ix2=Math.min(x2,x4), iy2=Math.min(y2,y4);
  const inter = Math.max(0,ix2-ix1) * Math.max(0,iy2-iy1);
  const a1=(x2-x1)*(y2-y1), a2=(x4-x3)*(y4-y3);
  return inter / (a1+a2-inter);
};`,
  },

  // ── NLP Additional ─────────────────────────────────────────────────────
  { id:'embeddings', cat:'nlp', title:'Word & Sentence Embeddings', icon:'📐', viz:'none', color:'#ff9d40',
    tags:['Word2Vec','GloVe','BERT','Sentence-BERT','Cosine Similarity'],
    overview:'Embeddings map discrete tokens (words, sentences, code) to continuous vector spaces where semantic relationships are preserved geometrically. "king" - "man" + "woman" ≈ "queen" in vector space. Foundational for all modern NLP.',
    points:[
      {t:'Word2Vec',d:'Skip-gram: predict context from word. CBOW: predict word from context. Trained on billions of words. Interesting property: semantic arithmetic. Negative sampling makes training tractable.'},
      {t:'GloVe',d:'Global Vectors: factorize word-context co-occurrence matrix. Captures both local context (Word2Vec) and global statistics. 300-d vectors trained on 840B tokens. Still competitive baseline.'},
      {t:'Contextual Embeddings (BERT)',d:'Unlike static (Word2Vec), BERT produces different embeddings for the same word in different contexts: "bank" in "river bank" vs "bank account". Pretrain: masked LM + next sentence prediction.'},
      {t:'Sentence Transformers',d:'Siamese network with BERT backbone. Trained on natural language inference pairs. Cosine similarity of embeddings = semantic similarity. Much faster than BERT cross-encoding for retrieval.'},
      {t:'RAG (Retrieval Augmented Generation)',d:'Store docs as embeddings in vector DB (Pinecone, Chroma, Weaviate). At query time: embed query, find top-K similar docs, inject into LLM prompt. Reduces hallucination, adds real-time knowledge.'},
    ],
    complexity:'Word2Vec training: O(V×d×T) where V=vocab, d=dimensions, T=tokens · BERT inference: O(n²d) · ANN search: O(log n) with HNSW index',
    code:`// Cosine similarity between embeddings
const cosine = (a, b) => {
  const dot = a.reduce((s,v,i) => s + v*b[i], 0);
  const na  = Math.sqrt(a.reduce((s,v) => s + v*v, 0));
  const nb  = Math.sqrt(b.reduce((s,v) => s + v*v, 0));
  return dot / (na * nb);
};

// Simplified Word2Vec skip-gram training (one step)
const skipgramStep = (centerWord, contextWord, embeddings, lr = 0.01) => {
  const v_c = embeddings[centerWord]; // center vector
  const u_o = embeddings[contextWord]; // context vector
  const score = v_c.reduce((s,v,i) => s + v*u_o[i], 0);
  const prob = 1 / (1 + Math.exp(-score)); // sigmoid
  const error = prob - 1; // for positive pair
  // Update embeddings
  for (let i = 0; i < v_c.length; i++) {
    embeddings[centerWord][i]  -= lr * error * u_o[i];
    embeddings[contextWord][i] -= lr * error * v_c[i];
  }
};

// Vector arithmetic: king - man + woman ≈ queen
const vectorArith = (king, man, woman, vocab, embeddings) => {
  const result = embeddings[king].map((v,i) =>
    v - embeddings[man][i] + embeddings[woman][i]
  );
  // Find nearest neighbor
  return vocab.map(w => ({ word: w, sim: cosine(result, embeddings[w]) }))
              .sort((a,b) => b.sim - a.sim)
              .slice(0, 5);
};

// K-Nearest Neighbors in embedding space (brute force)
const knn = (query, corpus, k = 5) =>
  corpus.map((item, i) => ({ i, score: cosine(query, item.embedding) }))
        .sort((a,b) => b.score - a.score)
        .slice(0, k);`,
  },

  // ── Probability & Statistics ───────────────────────────────────────────
  { id:'probability', cat:'math', title:'Probability & Statistics for ML', icon:'📊', viz:'none', color:T.tl,
    tags:['Bayes Theorem','Distributions','MLE','Hypothesis Testing','Information Theory'],
    overview:"Probability theory is the mathematics of uncertainty — essential for understanding ML models, algorithms, and decision-making under uncertainty. From Bayes' theorem to information entropy, these concepts underpin every model you build.",
    points:[
      {t:"Bayes' Theorem",d:'P(A|B) = P(B|A)×P(A) / P(B). Prior × Likelihood / Evidence = Posterior. Naive Bayes classifier: P(class|features) ∝ P(class) × ∏P(feature|class). Assumes feature independence.'},
      {t:'Key Distributions',d:'Gaussian N(μ,σ²): continuous, symmetric, CLT. Bernoulli/Binomial: binary outcomes. Poisson: count events per interval. Exponential: time between events. Categorical: multi-class. Each models different real-world phenomena.'},
      {t:'MLE & MAP',d:'Maximum Likelihood: θ* = argmax P(data|θ). MAP adds prior: θ* = argmax P(data|θ)×P(θ). MLE with Gaussian prior = L2 regularization. MLE with Laplace prior = L1 regularization.'},
      {t:'Hypothesis Testing',d:'Null hypothesis H0. p-value: probability of seeing data this extreme if H0 is true. α=0.05 threshold. Type I error (false positive): reject true H0. Type II error (false negative): fail to reject false H0.'},
      {t:'Information Theory',d:'Entropy H(X) = -Σp(x)log₂p(x): average bits to encode. Cross-entropy loss = H(p,q) = -Σp log q. KL divergence KL(P||Q) = Σp log(p/q): measures distribution difference. Mutual information I(X;Y) = H(X) - H(X|Y).'},
    ],
    complexity:'MLE optimization: O(n×d) per gradient step · Inference: O(d) for linear models · Monte Carlo sampling: O(n²) for variance estimation',
    code:`// Probability & Statistics utilities

// Gaussian PDF
const gaussianPDF = (x, mu, sigma) =>
  (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x-mu)/sigma)**2);

// Entropy H(p) = -Σ p log₂(p)
const entropy = probs => -probs.reduce((s,p) => s + (p>0 ? p*Math.log2(p) : 0), 0);

// KL Divergence KL(P||Q)
const kl = (P, Q) => P.reduce((s,p,i) => s + (p>0 ? p*Math.log(p/(Q[i]||1e-10)) : 0), 0);

// Cross-entropy loss
const crossEntropy = (y_true, y_pred) =>
  -y_true.reduce((s,y,i) => s + y*Math.log(Math.max(y_pred[i], 1e-10)), 0);

// Naive Bayes classifier (text)
class NaiveBayes {
  constructor() { this.classCounts={}; this.wordCounts={}; this.total=0; }
  train(docs, labels) {
    docs.forEach((doc, i) => {
      const cls = labels[i];
      this.classCounts[cls] = (this.classCounts[cls]||0) + 1;
      this.wordCounts[cls] = this.wordCounts[cls] || {};
      doc.split(' ').forEach(w => {
        this.wordCounts[cls][w] = (this.wordCounts[cls][w]||0) + 1;
      });
      this.total++;
    });
  }
  predict(doc) {
    const words = doc.split(' ');
    return Object.keys(this.classCounts)
      .map(cls => {
        let logP = Math.log(this.classCounts[cls] / this.total);
        words.forEach(w => {
          const count = (this.wordCounts[cls][w]||0) + 1; // Laplace smoothing
          const total = Object.values(this.wordCounts[cls]).reduce((s,v)=>s+v,0);
          logP += Math.log(count / (total + Object.keys(this.wordCounts[cls]).length));
        });
        return { cls, logP };
      })
      .sort((a,b) => b.logP - a.logP)[0].cls;
  }
}`,
  },

  // ── Tries ─────────────────────────────────────────────────────────────
  { id:'tries', cat:'ds', title:'Tries (Prefix Trees)', icon:'⊤', viz:'none', color:T.pk,
    tags:['Prefix Search','Autocomplete','String','O(m) ops','Compressed Trie'],
    overview:'A Trie (retrieval tree) stores strings character by character in a tree structure. O(m) for insert/search/delete where m = string length — independent of the number of keys! Perfect for autocomplete, spell checking, and IP routing.',
    points:[
      {t:'Core Structure',d:'Each node: char → children map. isEnd flag. Insert: walk path creating nodes. Search: walk path, check isEnd. Prefix search: walk path, return all words in subtree.'},
      {t:'Autocomplete',d:'Store all words in trie. For prefix "pre": walk to "pre" node, DFS collect all isEnd nodes in subtree. With sorted insertion, O(k) to get k suggestions after O(m) prefix walk.'},
      {t:'Compressed Trie (Radix Tree)',d:'Compress single-child chains into edge labels. Reduces space from O(SIGMA × N) to O(N). Used in: IP routing (longest prefix match), Linux VFS. Patricia Trie: maximally compressed.'},
      {t:'Bitwise Trie',d:'Each bit of integer is a character. Insert 32-bit int in 32 steps. Maximum XOR pair: for each number, greedily choose opposite bits in trie. O(32×N) = O(N).'},
    ],
    complexity:'Insert/Search/Delete O(m) · Space O(SIGMA×N×m) worst, O(N×m) average · Autocomplete O(m+k) · Compressed Trie O(N) space',
    code:`class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; this.count = 0; }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      node.children[ch] ??= new TrieNode();
      node = node.children[ch];
      node.count++;
    }
    node.isEnd = true;
  }

  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }

  // Autocomplete: all words with given prefix
  autocomplete(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    const results = [];
    const dfs = (n, path) => {
      if (n.isEnd) results.push(path);
      for (const [ch, child] of Object.entries(n.children)) dfs(child, path + ch);
    };
    dfs(node, prefix);
    return results;
  }

  // Count words with given prefix
  countPrefix(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return 0;
      node = node.children[ch];
    }
    return node.count;
  }
}`,
  },

  // ── Fenwick Tree ──────────────────────────────────────────────────────
  { id:'fenwick-tree', cat:'ds', title:'Fenwick Tree (BIT)', icon:'⊞', viz:'none', color:T.gn,
    tags:['Binary Indexed Tree','Prefix Sum','O(log n)','Range Update','Point Query'],
    overview:'Binary Indexed Tree (BIT/Fenwick Tree) answers prefix sum queries and point updates in O(log n) with just an array and bit tricks. Often simpler to code than a Segment Tree while achieving the same complexity for these operations.',
    points:[
      {t:'The lowbit Trick',d:'lowbit(i) = i & (-i): extracts the lowest set bit. This determines which range each BIT node covers. Node i covers [i-lowbit(i)+1, i]. This is the key to the O(log n) complexity.'},
      {t:'Prefix Sum Query',d:'query(i) = sum of arr[1..i]. Start at i, add bit[i], then jump i -= lowbit(i) until i=0. Makes at most log(i) jumps since each jump removes lowest set bit.'},
      {t:'Point Update',d:'update(i, delta): add delta at position i. Start at i, add delta to bit[i], jump i += lowbit(i). Propagates update to all ancestors. O(log n) hops.'},
      {t:'2D Fenwick Tree',d:'Extend to 2D: prefix sum of rectangle [1..r][1..c]. Nested update/query loops. O(log²n) per operation. Used for 2D range sum queries with updates.'},
    ],
    complexity:'Point update O(log n) · Prefix query O(log n) · Range sum O(log n) · Space O(n) · Build O(n log n)',
    code:`class FenwickTree {
  constructor(n) { this.n = n; this.tree = new Array(n + 1).fill(0); }

  update(i, delta) {       // 1-indexed
    for (; i <= this.n; i += i & (-i))
      this.tree[i] += delta;
  }

  query(i) {               // prefix sum [1..i]
    let s = 0;
    for (; i > 0; i -= i & (-i))
      s += this.tree[i];
    return s;
  }

  rangeQuery(l, r) { return this.query(r) - this.query(l - 1); }

  // Build from array O(n log n)
  build(arr) {
    for (let i = 0; i < arr.length; i++) this.update(i + 1, arr[i]);
  }
}

// 2D Fenwick Tree for rectangle sum queries
class FenwickTree2D {
  constructor(m, n) {
    this.m=m; this.n=n;
    this.tree=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  }
  update(r,c,v) {
    for (let i=r; i<=this.m; i+=i&(-i))
      for (let j=c; j<=this.n; j+=j&(-j))
        this.tree[i][j]+=v;
  }
  query(r,c) {
    let s=0;
    for (let i=r; i>0; i-=i&(-i))
      for (let j=c; j>0; j-=j&(-j))
        s+=this.tree[i][j];
    return s;
  }
  rangeQuery(r1,c1,r2,c2) {
    return this.query(r2,c2)-this.query(r1-1,c2)-this.query(r2,c1-1)+this.query(r1-1,c1-1);
  }
}`,
  },

  // ── Reinforcement Learning ─────────────────────────────────────────────
  { id:'reinforcement-learning', cat:'ml', title:'Reinforcement Learning', icon:'🎮', viz:'none', color:T.rd,
    tags:['Q-Learning','Policy Gradient','DQN','PPO','Multi-Armed Bandit'],
    overview:'RL trains agents to make sequential decisions by interacting with an environment. The agent learns a policy that maximizes cumulative reward. RL powers game-playing AIs (AlphaGo, OpenAI Five), robotics, and RLHF in LLMs.',
    points:[
      {t:'Markov Decision Process',d:'State S, Action A, Transition P(s\'|s,a), Reward R(s,a,s\'). Agent goal: maximize expected discounted return: G = Σγᵗrₜ. Discount γ ∈ [0,1] balances immediate vs future rewards.'},
      {t:'Q-Learning',d:'Q(s,a) = expected return starting from state s, taking action a. Bellman equation: Q(s,a) = r + γ max_a Q(s\',a\'). Model-free, off-policy. Tabular: table of (state,action) pairs. DQN: neural network approximates Q.'},
      {t:'Policy Gradient',d:'Directly parameterize policy π_θ(a|s). REINFORCE: ∇θ E[G] = E[G ∇θ log π_θ(a|s)]. High variance — use baseline. Actor-Critic: use value function baseline. PPO: clip policy update for stability.'},
      {t:'Multi-Armed Bandit',d:'K slot machines with unknown payout. Explore vs Exploit dilemma. ε-greedy: exploit best arm with prob 1-ε, explore random arm with prob ε. UCB: pick arm with highest upper confidence bound. Thompson sampling: Bayesian approach.'},
      {t:'RLHF for LLMs',d:'Reinforcement Learning from Human Feedback: (1) SFT on demonstrations. (2) Train reward model from human preferences. (3) PPO to maximize reward model score while KL-penalizing deviation from SFT policy. Used in ChatGPT/Claude.'},
    ],
    complexity:'Q-learning convergence: O(|S||A|) table · DQN: depends on network size · PPO: O(iterations × trajectory length × network FLOPs)',
    code:`// Q-Learning for GridWorld
class QLearning {
  constructor(states, actions, alpha=0.1, gamma=0.99, epsilon=0.1) {
    this.Q = {};
    for (const s of states)
      this.Q[s] = Object.fromEntries(actions.map(a=>[a,0]));
    this.alpha=alpha; this.gamma=gamma; this.epsilon=epsilon;
    this.actions=actions;
  }

  chooseAction(state) {
    if (Math.random() < this.epsilon)
      return this.actions[Math.floor(Math.random()*this.actions.length)];
    return Object.entries(this.Q[state]).sort(([,a],[,b])=>b-a)[0][0];
  }

  update(s, a, r, s_next, done) {
    const maxQ = done ? 0 : Math.max(...Object.values(this.Q[s_next]));
    const td_error = r + this.gamma * maxQ - this.Q[s][a];
    this.Q[s][a] += this.alpha * td_error;
    return Math.abs(td_error); // return TD error for monitoring
  }
}

// Multi-Armed Bandit — UCB1
class UCB1 {
  constructor(k) {
    this.k=k; this.counts=new Array(k).fill(0); this.values=new Array(k).fill(0); this.t=0;
  }
  select() {
    this.t++;
    // Choose unexplored arms first
    const unexplored=this.counts.findIndex(c=>c===0);
    if(unexplored!==-1) return unexplored;
    // UCB score: Q(a) + sqrt(2 ln t / N(a))
    return this.values.map((v,i)=>v+Math.sqrt(2*Math.log(this.t)/this.counts[i])).reduce((b,v,i,a)=>v>a[b]?i:b,0);
  }
  update(arm, reward) {
    this.counts[arm]++;
    this.values[arm]+=(reward-this.values[arm])/this.counts[arm]; // running average
  }
}`,
  },

  // ── Ensemble Methods ───────────────────────────────────────────────────
  { id:'ensemble-methods', cat:'ml', title:'Ensemble Methods', icon:'🌲', viz:'none', color:T.gn,
    tags:['Random Forest','XGBoost','LightGBM','CatBoost','AdaBoost','Gradient Boosting'],
    overview:'Ensemble methods combine multiple models to achieve better predictive performance than any single model. Three major paradigms: Bagging (parallel, reduces variance), Boosting (sequential, reduces bias), and Stacking (meta-learning). XGBoost, LightGBM, and CatBoost dominate Kaggle competitions and production ML.',
    points:[
      {t:'Random Forest — Bagging + Feature Randomness',d:'Each tree trained on bootstrap sample (~63.2% of data, 36.8% OOB). At each split, only √n or log₂n random features considered — this decorrelates trees. Variance formula: Var(RF) = ρσ² + (1-ρ)σ²/M. As M→∞, variance → ρσ² (irreducible). OOB error = free cross-validation using excluded 37%. Feature importance: Gini Importance (biased toward high-cardinality) vs Permutation Importance (shuffle feature, measure accuracy drop — more reliable). Extra Trees: random thresholds instead of optimal splits → lower variance, higher bias, much faster training.'},
      {t:'AdaBoost — Adaptive Boosting',d:'Algorithm: (1) Init weights w₁(i)=1/N. (2) Train weak learner, compute weighted error εₜ=Σwᵢ·𝟙[yᵢ≠ŷᵢ]. (3) Compute learner weight αₜ=½ln((1-εₜ)/εₜ). (4) Update sample weights: wᵢ←wᵢ·exp(-αₜyᵢhₜ(xᵢ)), renormalize. (5) Final: H(x)=sign(Σαₜhₜ(x)). Minimizes exponential loss exp(-yF(x)). Sensitive to outliers (high weight assigned to misclassified). SAMME for multiclass: αₜ=ln((1-εₜ)/εₜ)+ln(K-1). Foundation of face detection (Viola-Jones).'},
      {t:'Gradient Boosting — Functional Gradient Descent',d:'Sequentially fit trees to negative gradient (pseudo-residuals) of loss function. Key insight: gradient descent in function space, not parameter space. Init: F₀(x)=argmin Σ L(yᵢ,γ). Each step: rᵢₘ=-[∂L(yᵢ,F(xᵢ))/∂F(xᵢ)]|F=Fₘ₋₁. Fit tree to residuals, update Fₘ=Fₘ₋₁+η·fₘ. For MSE loss: residuals are literally (y-ŷ). For log loss: residuals are (y-p). Shrinkage (η<1) + subsampling prevents overfitting. n_estimators=300-1000, max_depth=3-6, learning_rate=0.01-0.1.'},
      {t:'XGBoost — Second-Order Optimization',d:'Objective: Obj(θ)=ΣL(yᵢ,ŷᵢ)+ΣΩ(fₖ) where Ω(f)=γT+½λ||w||². Uses second-order Taylor expansion: L≈gᵢfₜ(xᵢ)+½hᵢfₜ²(xᵢ). Optimal leaf weights: w*ⱼ=-Gⱼ/(Hⱼ+λ) where Gⱼ=Σgᵢ, Hⱼ=Σhᵢ. Split gain: ½[G²L/(H_L+λ)+G²R/(H_R+λ)-G²P/(H_P+λ)]-γ. For regression: gᵢ=ŷᵢ-yᵢ, hᵢ=1. For classification: gᵢ=pᵢ-yᵢ, hᵢ=pᵢ(1-pᵢ). Key features: L1+L2 regularization, handles missing values natively, parallel split finding, backward pruning. Dominant framework for tabular data.'},
      {t:'LightGBM — Three Speed Innovations',d:'(1) GOSS (Gradient-based One-Side Sampling): keep top a% large-gradient instances + random b% small-gradient (amplified by (1-a)/b). Reduces data without losing much accuracy. (2) EFB (Exclusive Feature Bundling): bundle mutually exclusive sparse features (especially one-hot encoded). Reduces feature count. (3) Leaf-wise tree growth: expand highest-loss leaf instead of level-wise. Gets better accuracy with same #leaves but can overfit on small data. Complexity: O(data×bins) vs XGBoost O(N log N). Native categorical feature support. Best for: 100k+ rows, memory constraints, speed.'},
      {t:'CatBoost — Ordered Statistics + Symmetric Trees',d:'(1) Ordered Target Statistics: category→mean target using only preceding rows in random permutation (prevents target leakage that plagues other target encoders). (2) Ordered Boosting: residuals computed from models trained on other data points, not current. Reduces prediction shift. (3) Symmetric (Oblivious) Trees: same split condition at each level of tree. Faster prediction, less overfitting, enables GPU training. Comparison: XGBoost=level-wise, LightGBM=leaf-wise, CatBoost=symmetric. Best for: many categorical features, minimal hyperparameter tuning, small-medium datasets.'},
      {t:'Stacking — Meta-Learning',d:'Train base learners (level 0) on training data. Use K-fold CV to generate out-of-fold predictions as meta-features (prevents leakage). Train meta-learner (level 1) on meta-features to learn optimal combination. Key insight: meta-learner learns which base models are reliable for which examples. Simple meta-learners (linear regression, ridge) often best — prevents overfitting. Blending: simpler variant using held-out validation set for meta-features. Multi-level stacking rarely improves beyond 2 levels.'},
    ],
    complexity:'RF training O(T×n×log n×√d) · XGBoost O(T×n×d×k) where k=bins · Inference RF O(T×d) · Stacking O(K×base_training) for meta-features',
    code:`// XGBoost leaf weight optimization (conceptual)
const xgboostLeafWeight = (gradients, hessians, lambda = 1.0) => {
  const G = gradients.reduce((s, g) => s + g, 0);
  const H = hessians.reduce((s, h) => s + h, 0);
  return -G / (H + lambda); // optimal weight for this leaf
};

const splitGain = (GL, HL, GR, HR, GP, HP, lambda=1, gamma=0) =>
  0.5 * (GL*GL/(HL+lambda) + GR*GR/(HR+lambda) - GP*GP/(HP+lambda)) - gamma;

// AdaBoost from scratch
class AdaBoost {
  constructor(n_estimators = 50) {
    this.n = n_estimators; this.alphas = []; this.learners = [];
  }
  fit(X, y, weakLearner) {
    const N = X.length;
    let weights = new Array(N).fill(1/N);
    for (let t = 0; t < this.n; t++) {
      const h = weakLearner(X, y, weights);
      const preds = X.map(x => h.predict(x));
      const err = weights.reduce((s, w, i) => s + (preds[i] !== y[i] ? w : 0), 0);
      const alpha = 0.5 * Math.log((1 - err) / (err + 1e-10));
      weights = weights.map((w, i) => w * Math.exp(-alpha * y[i] * preds[i]));
      const Z = weights.reduce((s, w) => s + w, 0);
      weights = weights.map(w => w / Z);
      this.alphas.push(alpha); this.learners.push(h);
    }
  }
  predict(x) {
    const score = this.learners.reduce((s, h, i) => s + this.alphas[i] * h.predict(x), 0);
    return Math.sign(score);
  }
}

// Gradient Boosting residuals (MSE loss)
const gradientBoostingStep = (preds, targets) =>
  targets.map((y, i) => y - preds[i]); // negative gradient of MSE = residuals`,
  },

  // ── Support Vector Machines ────────────────────────────────────────────
  { id:'svm', cat:'ml', title:'Support Vector Machines', icon:'✦', viz:'none', color:T.pk,
    tags:['Margin','Kernel Trick','RBF','Soft Margin','SVM','SVR'],
    overview:'SVMs find the maximum-margin hyperplane separating classes. The kernel trick implicitly maps data to infinite-dimensional spaces where linear separation is possible — making SVMs powerful for non-linear problems without ever computing the high-dimensional coordinates.',
    points:[
      {t:'Hard-Margin SVM — Geometric Intuition',d:'Find hyperplane w·x+b=0 maximizing margin 2/||w||. Decision boundary equidistant from nearest points of each class (support vectors). Formulation: minimize ½||w||² subject to yᵢ(w·xᵢ+b)≥1 for all i. Support vectors are the ONLY points that matter — removing non-support vectors doesn\'t change the model. Geometric margin = 1/||w||. The margin-maximizing constraint prevents overfitting better than just minimizing training error.'},
      {t:'Soft-Margin SVM — Handling Non-Separable Data',d:'Add slack variables ξᵢ≥0: minimize ½||w||²+C·Σξᵢ subject to yᵢ(w·xᵢ+b)≥1-ξᵢ. C is regularization parameter: high C = try to separate all points (small margin, overfitting risk), low C = allow misclassifications (large margin, more general). Hinge loss: L(y,f(x))=max(0,1-y·f(x)). L(y,f)=0 when correctly classified with margin≥1; otherwise = distance to margin boundary. SVM minimizes: (1/n)Σhinge(yᵢ,fᵢ) + (1/2C)||w||².'},
      {t:'Dual Formulation & Support Vectors',d:'Lagrangian dual: maximize Σαᵢ - ½Σᵢ,ⱼαᵢαⱼyᵢyⱼxᵢ·xⱼ subject to 0≤αᵢ≤C and Σαᵢyᵢ=0. KKT conditions: αᵢ>0 only for support vectors (points on or inside margin). Decision function: f(x)=sign(Σαᵢyᵢ(xᵢ·x)+b). CRITICAL: the dual only involves dot products xᵢ·x — the kernel trick replaces this! Support vectors are typically 10-30% of training data; the rest have αᵢ=0.'},
      {t:'Kernel Trick — Infinite Dimensions',d:'Replace dot product xᵢ·xⱼ with K(xᵢ,xⱼ)=φ(xᵢ)·φ(xⱼ). We never compute φ(x) explicitly! Common kernels: Linear K(x,z)=x·z. Polynomial K(x,z)=(γ x·z+r)^d. RBF/Gaussian K(x,z)=exp(-γ||x-z||²) — infinite-dimensional feature space, universal approximator. Sigmoid K(x,z)=tanh(γ x·z+r). Mercer\'s theorem: K is valid kernel iff K matrix is positive semi-definite. RBF γ: high=complex decision boundary (overfit), low=smooth (underfit). SVMs are kernel methods; this kernel trick extends to other algorithms too.'},
      {t:'Multi-class & SVR',d:'Multi-class: OvR (one binary SVM per class, k SVMs for k classes, predict highest score) or OvO (k(k-1)/2 SVMs, majority vote). SVR (regression): find tube of width ε where no penalty for errors inside tube. ε-insensitive loss: 0 if |y-f(x)|≤ε, else |y-f(x)|-ε. Minimize ½||w||²+C·Σ(ξᵢ+ξᵢ*) where ξᵢ,ξᵢ* are upper/lower slack variables.'},
      {t:'SVM vs Logistic Regression',d:'Both linear classifiers with regularization. Key differences: SVM uses hinge loss (geometric margin), LR uses log loss (probabilistic). SVM only depends on support vectors (sparse), LR uses all data points. SVM with RBF kernel handles non-linear well; LR needs explicit feature engineering. SVM: no probability output by default (Platt scaling adds it). Performance: similar on many datasets, SVM often wins with clear margin + small datasets, LR with large datasets due to O(n) training vs SVM\'s O(n²) to O(n³). SVM slow for n>100k.'},
    ],
    complexity:'Linear SVM O(n×d) to O(n²×d) · RBF SVM O(n²) to O(n³) training · Prediction O(n_sv × d) · SVR same as SVC',
    code:`// SVM Decision Boundary (linear, 2D) — simplified
class LinearSVM {
  constructor(C = 1.0, lr = 0.001, epochs = 1000) {
    this.C = C; this.lr = lr; this.epochs = epochs;
  }
  fit(X, y) {
    const d = X[0].length;
    this.w = new Array(d).fill(0); this.b = 0;
    for (let e = 0; e < this.epochs; e++) {
      for (let i = 0; i < X.length; i++) {
        const score = X[i].reduce((s, xi, j) => s + xi * this.w[j], 0) + this.b;
        const margin = y[i] * score;
        if (margin < 1) { // inside or wrong side of margin
          this.w = this.w.map((wj, j) => wj - this.lr * (wj - this.C * y[i] * X[i][j]));
          this.b += this.lr * this.C * y[i];
        } else { // correctly classified with margin
          this.w = this.w.map(wj => wj - this.lr * wj);
        }
      }
    }
  }
  predict(x) {
    return Math.sign(x.reduce((s, xi, j) => s + xi * this.w[j], 0) + this.b);
  }
  margin() { return 2 / Math.sqrt(this.w.reduce((s, w) => s + w*w, 0)); }
}

// RBF Kernel
const rbfKernel = (x, z, gamma = 0.5) => {
  const dist2 = x.reduce((s, xi, i) => s + (xi - z[i])**2, 0);
  return Math.exp(-gamma * dist2);
};

// Kernel SVM prediction (after training with dual)
const kernelSVMPredict = (x, supportVectors, alphas, labels, b, kernel) =>
  Math.sign(supportVectors.reduce((s, sv, i) =>
    s + alphas[i] * labels[i] * kernel(sv, x), 0) + b);`,
  },

  // ── Clustering & Unsupervised ──────────────────────────────────────────
  { id:'clustering', cat:'ml', title:'Clustering & Unsupervised Learning', icon:'◎', viz:'none', color:T.tl,
    tags:['K-Means','DBSCAN','GMM','Hierarchical','Silhouette','Elbow Method'],
    overview:'Unsupervised learning discovers hidden structure in unlabeled data. Clustering groups similar points together. Each algorithm has different assumptions about cluster shape: K-Means assumes spherical, GMM assumes Gaussian ellipsoids, DBSCAN finds arbitrary shapes and identifies noise.',
    points:[
      {t:'K-Means — Lloyd\'s Algorithm',d:'(1) Initialize K centroids (random or K-Means++ — choose next centroid proportional to distance² from existing centroids, ensures spread). (2) Assign each point to nearest centroid. (3) Recompute centroids as cluster means. (4) Repeat until convergence (centroids don\'t change). Inertia (WCSS): Σⱼ Σᵢ∈Cⱼ ||xᵢ-μⱼ||². Minimizes inertia, not a globally optimal objective. Complexity O(nkdi) where n=points, k=clusters, d=dims, i=iterations. Fails: non-spherical clusters, different cluster sizes/densities, many outliers. Fix with DBSCAN or GMM.',},
      {t:'K-Means Evaluation — Elbow & Silhouette',d:'Elbow method: plot inertia vs K, look for "elbow" where inertia reduction slows. Not always clear. Silhouette score s(i)=(b(i)-a(i))/max(a(i),b(i)) where a(i)=mean distance to same cluster, b(i)=mean distance to nearest other cluster. Range [-1,1]: 1=perfect, 0=on boundary, -1=wrong cluster. Silhouette coefficient = mean over all points. Davies-Bouldin index: ratio of within-cluster scatter to between-cluster separation (lower=better). Calinski-Harabasz: between-cluster/within-cluster dispersion ratio (higher=better).'},
      {t:'DBSCAN — Density-Based Spatial Clustering',d:'Parameters: ε (neighborhood radius), MinPts (density threshold). Core point: ≥MinPts in ε-ball. Border: in ε-ball of core but <MinPts itself. Noise: neither. Cluster = maximal set of density-connected core+border points. Advantages: no need to specify K, arbitrary shapes, automatic outlier detection (label -1). Weaknesses: sensitive to ε and MinPts selection, struggles with varying densities. Parameter selection: k-distance graph (sort distances to k-th nearest neighbor, elbow = optimal ε). HDBSCAN: hierarchical extension, adapts to varying densities, more robust parameters.'},
      {t:'Gaussian Mixture Models — Soft Clustering',d:'Each cluster modeled as Gaussian N(μₖ,Σₖ) with mixture weight πₖ. Joint likelihood: P(x)=Σₖ πₖN(x|μₖ,Σₖ). EM Algorithm: E-step: compute responsibilities rᵢₖ=πₖN(xᵢ|μₖ,Σₖ)/Σⱼπⱼ N(xᵢ|μⱼ,Σⱼ). M-step: Nₖ=Σrᵢₖ, πₖ=Nₖ/N, μₖ=Σrᵢₖxᵢ/Nₖ, Σₖ=Σrᵢₖ(xᵢ-μₖ)(xᵢ-μₖ)ᵀ/Nₖ. Covariance types: full (elliptical), tied (same shape), diag (axis-aligned), spherical (circular). GMM gives P(cluster|point) — probabilistic, unlike K-Means hard assignments. Use BIC/AIC to select K.'},
      {t:'Hierarchical Clustering — Dendrogram',d:'Agglomerative (bottom-up): start with N clusters, merge closest pair. Linkage criteria determine "closest": Single=min distance (chain-like, elongated), Complete=max distance (compact, balanced), Average=mean distance, Ward=minimize within-cluster variance (most similar to K-Means results). Divisive (top-down): start with 1 cluster, recursively split. Complexity: O(n² log n) time, O(n²) space. Dendrogram: y-axis=merge distance. Cut at height h → K clusters. Advantage: no K needed upfront, full hierarchy available.'},
      {t:'Association Rule Learning — Apriori & FP-Growth',d:'Market basket analysis: find items frequently bought together. Metrics: Support=P(A∪B)=|A∪B|/N (frequency). Confidence=P(B|A)=Support(A∪B)/Support(A). Lift=Confidence/Support(B): >1=positive association, =1=independent, <1=negative. Apriori property: all subsets of frequent itemset are frequent (antimonotonicity) → prune supersets of infrequent sets. Multiple database scans, exponential candidate generation. FP-Growth: builds compressed FP-Tree, only 2 scans, mine conditional pattern bases recursively. FP-Growth 100x faster on large datasets.'},
    ],
    complexity:'K-Means O(nkdi) · DBSCAN O(n log n) with spatial index, O(n²) naive · GMM-EM O(K×n×d²×iterations) · Hierarchical O(n² log n) · FP-Growth O(n×d) database scans',
    code:`// K-Means from scratch
class KMeans {
  constructor(k, maxIter = 100) { this.k = k; this.maxIter = maxIter; }

  fit(X) {
    // K-Means++ initialization
    this.centroids = [X[Math.floor(Math.random() * X.length)]];
    while (this.centroids.length < this.k) {
      const dists = X.map(x => Math.min(...this.centroids.map(c =>
        x.reduce((s, xi, i) => s + (xi - c[i])**2, 0))));
      const total = dists.reduce((s, d) => s + d, 0);
      let r = Math.random() * total, cumSum = 0;
      for (let i = 0; i < X.length; i++) {
        cumSum += dists[i];
        if (cumSum >= r) { this.centroids.push(X[i]); break; }
      }
    }
    for (let iter = 0; iter < this.maxIter; iter++) {
      const labels = this.predict(X);
      const newCentroids = Array.from({length: this.k}, (_, k) => {
        const pts = X.filter((_, i) => labels[i] === k);
        if (!pts.length) return this.centroids[k];
        return X[0].map((_, d) => pts.reduce((s, p) => s + p[d], 0) / pts.length);
      });
      if (JSON.stringify(newCentroids) === JSON.stringify(this.centroids)) break;
      this.centroids = newCentroids;
    }
    return this;
  }

  predict(X) {
    return X.map(x => {
      const dists = this.centroids.map(c => x.reduce((s, xi, i) => s + (xi - c[i])**2, 0));
      return dists.indexOf(Math.min(...dists));
    });
  }

  inertia(X) {
    const labels = this.predict(X);
    return X.reduce((s, x, i) =>
      s + x.reduce((ss, xi, d) => ss + (xi - this.centroids[labels[i]][d])**2, 0), 0);
  }
}

// Silhouette score for one point
const silhouettePoint = (i, X, labels) => {
  const k = labels[i];
  const sameCluster = X.filter((_, j) => j !== i && labels[j] === k);
  const a = sameCluster.length
    ? sameCluster.reduce((s, p) => s + Math.sqrt(X[i].reduce((ss, xi, d) => ss + (xi - p[d])**2, 0)), 0) / sameCluster.length
    : 0;
  const otherClusters = [...new Set(labels)].filter(c => c !== k);
  const b = Math.min(...otherClusters.map(c => {
    const pts = X.filter((_, j) => labels[j] === c);
    return pts.reduce((s, p) => s + Math.sqrt(X[i].reduce((ss, xi, d) => ss + (xi - p[d])**2, 0)), 0) / pts.length;
  }));
  return (b - a) / Math.max(a, b);
};`,
  },

  // ── Dimensionality Reduction ──────────────────────────────────────────
  { id:'dimensionality-reduction', cat:'ml', title:'Dimensionality Reduction', icon:'⊖', viz:'none', color:T.cy,
    tags:['PCA','t-SNE','UMAP','SVD','Eigenvalues','Manifold Learning'],
    overview:'High-dimensional data is sparse, distances become meaningless (curse of dimensionality), and visualization is impossible. Dimensionality reduction finds compact low-dimensional representations preserving structure. Linear methods (PCA, LDA) are fast and interpretable. Non-linear methods (t-SNE, UMAP) reveal complex manifold structure.',
    points:[
      {t:'PCA — Maximum Variance Directions',d:'Algorithm: (1) Center data: X̄=X-μ. (2) Compute covariance matrix C=X̄ᵀX̄/(n-1) — symmetric, positive semi-definite. (3) Eigendecomposition: C=VΛVᵀ where columns of V are principal components (eigenvectors), diagonal of Λ are explained variances (eigenvalues). (4) Sort by eigenvalue descending. (5) Project: Z=X̄V_k where V_k selects top k components. Explained variance ratio: λᵢ/Σλⱼ. Cumulative sum: keep components until 90-95% variance explained. PCA finds orthogonal directions of maximum variance. NOT optimal for classification — use LDA for that.'},
      {t:'PCA — When to Use & Limitations',d:'Good for: removing multicollinearity before regression, visualization (2D/3D), compression (fewer features), noise reduction (top components capture signal, noise spreads across all). Limitations: destroys interpretability (new features = linear combos of originals), fails to capture non-linear structure, sensitive to feature scaling (ALWAYS standardize first), doesn\'t maximize class separation. Alternative: Kernel PCA applies kernel trick for non-linear PCA. Incremental PCA for data too large for RAM. Randomized PCA (sklearn\'s default) O(n×d×k) vs O(n×d²) full.'},
      {t:'t-SNE — Non-linear Visualization',d:'Models similarity between points as probability: P(j|i)=exp(-||xᵢ-xⱼ||²/2σᵢ²)/Σₖ≠ᵢexp(-||xᵢ-xₖ||²/2σᵢ²). In low-dim: Q(j|i) uses t-distribution (1/(1+||yᵢ-yⱼ||²)) — heavier tails prevent crowding. Minimize KL(P||Q) via gradient descent. Perplexity: target number of neighbors (5-50, default 30). Strong at revealing cluster structure. Limitations: O(n²) memory/time, stochastic (different runs → different results), cannot transform new data, distances between clusters NOT meaningful (only within-cluster structure preserved), sensitive to perplexity.'},
      {t:'UMAP — Fast Topology-Preserving Reduction',d:'Mathematical foundation: fuzzy topological data analysis. Constructs weighted k-NN graph in high-dim with exponential weight decay. Optimizes low-dim embedding to match high-dim fuzzy topology by minimizing cross-entropy between graphs. Preserves both local AND global structure (unlike t-SNE). Parameters: n_neighbors (5-15=local, 50-200=global), min_dist (0=tight clusters, 0.9=scattered), n_components (2 for visualization). 100x faster than t-SNE on large datasets. Can transform new data. Produces more meaningful inter-cluster layout. Used for: EDA, preprocessing before supervised learning, visualization of embeddings.'},
      {t:'SVD — Matrix Factorization Foundation',d:'A=UΣVᵀ. U: m×m orthogonal (left singular vectors). Σ: m×n diagonal (singular values, descending). Vᵀ: n×n orthogonal (right singular vectors). Truncated SVD: keep top k singular values → best rank-k approximation (Eckart-Young theorem). PCA from SVD: V columns = principal components, singular values = √(eigenvalues of XᵀX). Applications: (1) Recommender systems (matrix completion). (2) Latent Semantic Analysis (document-term matrix). (3) Image compression (k×8 bytes vs original m×n×8). (4) Pseudo-inverse for over/underdetermined systems. (5) Noise filtering by zeroing small singular values.'},
      {t:'LDA — Supervised Dimensionality Reduction',d:'Linear Discriminant Analysis: finds projection maximizing class separability. Between-class scatter: S_B=Σₖnₖ(μₖ-μ)(μₖ-μ)ᵀ. Within-class scatter: S_W=Σₖ Σᵢ∈Cₖ(xᵢ-μₖ)(xᵢ-μₖ)ᵀ. Maximize J(W)=|WᵀS_BW|/|WᵀS_WW|. Solution: top eigenvectors of S_W⁻¹S_B. Max k-1 components for k classes. Assumes Gaussian distributions within classes, equal covariance matrices (if violated, use QDA with separate covariances). LDA can also be used for classification directly (not just DR).'},
    ],
    complexity:'PCA O(n×d²+d³) full or O(n×d×k) randomized · t-SNE O(n² log n) · UMAP O(n^1.14) approx · SVD O(min(m,n)²×max(m,n))',
    code:`// PCA from scratch using power iteration
class PCA {
  constructor(nComponents) { this.k = nComponents; this.components = null; this.mean = null; }

  fit(X) {
    const n = X.length, d = X[0].length;
    // Center data
    this.mean = Array.from({length: d}, (_, j) => X.reduce((s, row) => s + row[j], 0) / n);
    const Xc = X.map(row => row.map((v, j) => v - this.mean[j]));
    // Covariance matrix
    const C = Array.from({length: d}, (_, i) =>
      Array.from({length: d}, (_, j) =>
        Xc.reduce((s, row) => s + row[i] * row[j], 0) / (n - 1)));
    // Power iteration for top k eigenvectors
    this.components = [];
    for (let comp = 0; comp < this.k; comp++) {
      let v = Array.from({length: d}, () => Math.random() - 0.5);
      for (let iter = 0; iter < 100; iter++) {
        let Av = C.map(row => row.reduce((s, c, j) => s + c * v[j], 0));
        // Deflate previous components
        this.components.forEach(pc => {
          const proj = Av.reduce((s, a, i) => s + a * pc[i], 0);
          Av = Av.map((a, i) => a - proj * pc[i]);
        });
        const norm = Math.sqrt(Av.reduce((s, a) => s + a*a, 0));
        v = Av.map(a => a / norm);
      }
      this.components.push(v);
    }
    return this;
  }

  transform(X) {
    const Xc = X.map(row => row.map((v, j) => v - this.mean[j]));
    return Xc.map(row => this.components.map(pc => row.reduce((s, v, i) => s + v * pc[i], 0)));
  }

  explainedVariance(X) {
    const Xc = X.map(row => row.map((v, j) => v - this.mean[j]));
    const totalVar = Xc[0].map((_, j) => {
      const vals = Xc.map(row => row[j]);
      const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
      return vals.reduce((s, v) => s + (v - mean)**2, 0) / (vals.length - 1);
    }).reduce((s, v) => s + v, 0);
    return this.components.map(pc => {
      const projected = Xc.map(row => row.reduce((s, v, i) => s + v * pc[i], 0));
      const pVar = projected.reduce((s, v) => s + v*v, 0) / (Xc.length - 1);
      return pVar / totalVar;
    });
  }
}`,
  },

  // ── Explainable AI ─────────────────────────────────────────────────────
  { id:'xai', cat:'ml', title:'Explainable AI (XAI)', icon:'🔍', viz:'none', color:T.ye,
    tags:['SHAP','LIME','Feature Importance','Interpretability','Fairness','GDPR'],
    overview:'XAI makes ML decisions understandable to humans. As models deploy in high-stakes domains (medical diagnosis, credit scoring, criminal justice), explaining predictions is both an ethical and legal requirement. GDPR Article 22 mandates "right to explanation" for automated decisions.',
    points:[
      {t:'Why Interpretability Matters',d:'The interpretability-accuracy tradeoff: glass-box (linear, decision tree) vs black-box (ensemble, DNN). Real-world failure modes: (1) Model learned spurious correlations (COVID pneumonia model learned to predict pneumonia from hospital metadata, not X-rays). (2) Racial bias in COMPAS recidivism tool. (3) Feedback loops in ad recommendation. Three audiences: data scientists (debugging), business stakeholders (trust), regulators (compliance). GDPR Article 22: automated decisions must be explainable. FDA AI guidelines: three-tier risk classification.'},
      {t:'SHAP — Shapley Additive Explanations',d:'Game theory approach: φᵢ(f,x)=Σ_{S⊆F\\{i}} (|S|!(|F|-|S|-1)!/|F|!)×[f(S∪{i})-f(S)]. Each feature receives a Shapley value = its average marginal contribution across all possible feature coalitions. Properties (axioms): (1) Efficiency: Σφᵢ=f(x)-E[f] (sum to prediction difference from baseline). (2) Symmetry: equal contributions get equal values. (3) Dummy: zero contribution features get φ=0. (4) Additivity: linear combination of models → linear combination of SHAP values. TreeSHAP: O(TLD²) vs exponential naive, exact for tree models. DeepSHAP: backpropagation-based for DNNs. KernelSHAP: model-agnostic via weighted regression.'},
      {t:'LIME — Local Interpretable Model-Agnostic Explanations',d:'Objective: ξ(x)=argmin_{g∈G} L(f,g,πₓ)+Ω(g) where L is fidelity loss, πₓ is locality kernel, Ω is complexity. Algorithm: (1) Sample perturbed instances around x (turn features on/off or add Gaussian noise). (2) Get black-box predictions for perturbed instances. (3) Weight by proximity: πₓ(z)=exp(-||x-z||²/σ²). (4) Fit weighted linear model on perturbed data. (5) Coefficients = local importances. For text: toggle words. For images: toggle superpixels. Fast but potentially unstable — small changes in sampling can change explanations significantly.'},
      {t:'Global vs Local Explanations',d:'Global (model-level): understand overall model behavior. Techniques: feature importance (impurity-based or permutation), PDP (Partial Dependence Plot), ICE (Individual Conditional Expectation), ALE (Accumulated Local Effects, unbiased for correlated features). Local (instance-level): explain single prediction. Techniques: SHAP per instance, LIME, counterfactuals ("what minimal change to input would flip prediction?"). Counterfactual closeness: x*=argmin||x-x*||₂ s.t. f(x*)=y_target. Sparse counterfactuals (L1 norm): fewest feature changes. Diverse counterfactuals: multiple actionable alternatives.'},
      {t:'Fairness Metrics & Bias Detection',d:'Group fairness criteria: (1) Demographic Parity: P(ŷ=1|A=0)=P(ŷ=1|A=1) — equal positive rates. (2) Equal Opportunity: TPR equal across groups — equal true positive rates. (3) Equalized Odds: both TPR and FPR equal. (4) Individual Fairness: similar individuals get similar predictions. Key insight (Impossibility theorem): Demographic parity + Equal Opportunity + Calibration cannot all hold simultaneously when base rates differ across groups. Bias sources: historical bias in training data, measurement bias, aggregation bias, representation bias. Debiasing: reweighting, adversarial debiasing, calibration by group.'},
      {t:'Model Evaluation for XAI',d:'Faithfulness: does explanation reflect actual model behavior? Test: remove top SHAP features, measure prediction change. Stability: do similar inputs get similar explanations? Robustness score = explanation consistency under input perturbations. Comprehensibility: can a human understand? Rule length, complexity metrics. Actionability: are suggested changes feasible? (Can\'t change age/race). Causal vs correlational: post-hoc explanations may identify correlates, not causes. Ground truth comparison: for simulated models with known structure, compare explanations to true feature importance.'},
    ],
    complexity:'TreeSHAP O(TLD²) exact · KernelSHAP O(2^d) exact, O(n×k) sampling approximation · LIME O(n_samples × model_inference) · PDP O(n×grid_size)',
    code:`// SHAP value estimation — sampling approach (model-agnostic)
const estimateSHAP = (model, x, backgroundData, nSamples = 100) => {
  const d = x.length;
  const shapValues = new Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let totalContrib = 0;
    for (let s = 0; s < nSamples; s++) {
      // Random coalition S not including feature i
      const coalition = Array.from({length: d}, (_, j) => j !== i && Math.random() > 0.5);
      const bg = backgroundData[Math.floor(Math.random() * backgroundData.length)];
      // With feature i
      const xWith = x.map((v, j) => coalition[j] ? v : (j === i ? v : bg[j]));
      // Without feature i
      const xWithout = x.map((v, j) => coalition[j] ? v : bg[j]);
      totalContrib += model(xWith) - model(xWithout);
    }
    shapValues[i] = totalContrib / nSamples;
  }
  return shapValues;
};

// LIME — Local linear approximation
const lime = (model, x, nSamples = 500, sigma = 1.0) => {
  const d = x.length;
  const samples = [], predictions = [], weights = [];
  for (let s = 0; s < nSamples; s++) {
    const perturbed = x.map(v => v + (Math.random() - 0.5) * sigma * 2);
    samples.push(perturbed);
    predictions.push(model(perturbed));
    const dist2 = perturbed.reduce((sum, v, i) => sum + (v - x[i])**2, 0);
    weights.push(Math.exp(-dist2 / (sigma**2)));
  }
  // Weighted least squares (simplified)
  const wX = samples.map((s, i) => s.map(v => v * Math.sqrt(weights[i])));
  const wY = predictions.map((p, i) => p * Math.sqrt(weights[i]));
  // Return feature importance coefficients
  return { samples, predictions, weights };
};

// Permutation Feature Importance
const permutationImportance = (model, X, y, metric, nRepeats = 5) => {
  const baseline = metric(y, X.map(x => model(x)));
  return X[0].map((_, featureIdx) => {
    const importances = [];
    for (let r = 0; r < nRepeats; r++) {
      const shuffled = [...X];
      const permuted = shuffled.map(row => {
        const randomRow = X[Math.floor(Math.random() * X.length)];
        return row.map((v, j) => j === featureIdx ? randomRow[j] : v);
      });
      const score = metric(y, permuted.map(x => model(x)));
      importances.push(baseline - score);
    }
    return importances.reduce((s, v) => s + v, 0) / nRepeats;
  });
};`,
  },

  // ── Deep Learning Optimization ─────────────────────────────────────────
  { id:'dl-optimization', cat:'dl', title:'Deep Learning Optimization', icon:'∇', viz:'none', color:T.mg,
    tags:['Adam','SGD','Learning Rate','Momentum','Weight Decay','Batch Size','Double Descent'],
    overview:'Training deep networks is hard: vanishing/exploding gradients, saddle points, sharp minima, and learning rate sensitivity. Modern optimizers (Adam, AdamW) and training techniques (warmup, cosine decay, gradient clipping) make this tractable. Understanding the loss landscape is key to good training.',
    points:[
      {t:'SGD with Momentum — Foundation',d:'Vanilla SGD: θₜ=θₜ₋₁-η∇L(θₜ₋₁). Problem: oscillates in directions with high curvature. SGD with Momentum: vₜ=βvₜ₋₁+∇L, θₜ=θₜ₋₁-ηvₜ. Momentum β=0.9 means exponential moving average of gradients. Velocity accumulates in consistent directions, dampens oscillations. Nesterov Momentum (NAG): compute gradient at lookahead position θ-βv: ∇L(θ-βv). Can be thought of as gradient at where we\'re heading, not where we are. Faster convergence on convex functions. Optimal LR for SGD scales linearly with batch size (linear scaling rule).'},
      {t:'Adam — Adaptive Moment Estimation',d:'Maintains first moment (mean) m and second moment (uncentered variance) v: mₜ=β₁mₜ₋₁+(1-β₁)gₜ, vₜ=β₂vₜ₋₁+(1-β₂)gₜ². Bias correction: m̂=m/(1-β₁ᵗ), v̂=v/(1-β₂ᵗ). Update: θₜ=θₜ₋₁-η·m̂/(√v̂+ε). Defaults: β₁=0.9, β₂=0.999, ε=1e-8, η=3e-4. Intuition: per-parameter learning rate scaled by square root of recent gradient magnitudes. Features doing large gradients get smaller effective LR. Scales like √batch_size (not linearly). AdamW: separate weight decay from gradient update (L2 reg ≠ weight decay in Adam).'},
      {t:'Learning Rate Schedules',d:'Warmup: start with very small LR, linearly increase for first N steps (typical: 1000-4000 steps). Critical for transformers — helps stabilize early training when weight norms are random. Linear decay: after warmup, decrease linearly to 0. Cosine decay: LR(t)=η_min+(η_max-η_min)×(1+cos(πt/T))/2. Smoother than linear, better generalization. Step decay: multiply by factor (0.1) at fixed epochs. Cyclical LR (1cycle): increase then decrease in one cycle — enables super-convergence. Learning rate finder: increase LR exponentially per batch, plot loss vs LR, pick LR where loss decreases fastest.'},
      {t:'Gradient Problems — Vanishing & Exploding',d:'Vanishing: gradients shrink exponentially with depth. Sigmoid/tanh saturate → gradient ≈ 0. Fix: ReLU, residual connections, gradient clipping. Exploding: gradients grow exponentially. Fix: gradient clipping (clip by norm: g̃=g×max_norm/||g|| when ||g||>max_norm), careful weight init, batch norm. Weight initialization: Xavier/Glorot: W~Uniform(-√(6/(fan_in+fan_out)), +√(6/(fan_in+fan_out))) for tanh. He/Kaiming: W~N(0,2/fan_in) for ReLU. Proper init keeps activations near zero mean, unit variance throughout network.'},
      {t:'Batch Normalization & Layer Norm',d:'BatchNorm: normalize over batch dimension. x̂=\(x-μ_B)/√(σ²_B+ε), then scale/shift: y=γx̂+β. Learnable γ,β. During inference: use running statistics. Benefits: higher LR, acts as regularizer (noise from batch statistics), reduces sensitivity to weight init. Problem: depends on batch size, doesn\'t work well with RNNs, bad for small batches. LayerNorm: normalize over feature dimension per sample. Works with any batch size, better for sequences (transformers). GroupNorm: normalize over channel groups, good for vision with small batches.'},
      {t:'Double Descent & Modern Understanding',d:'Classical: bias-variance tradeoff predicts U-shaped test error curve. Modern: with overparameterized models (params >> data points), error descends again — better generalization! The interpolation threshold (where training error = 0) is the "double descent peak." Beyond it, models are overparameterized but generalize well due to implicit regularization of gradient descent (finds min-norm solution). Neural Tangent Kernel (NTK): infinite-width networks evolve as linear models during training. Edge of Stability: gradient descent often operates near the edge of stability (step size ≈ 2/λ_max of Hessian) — adaptive escape from sharp minima.'},
    ],
    complexity:'Adam O(params) per step · SGD same · LR warmup O(warmup_steps) · Gradient clipping O(params) · BatchNorm O(batch_size × features)',
    code:`// Adam optimizer from scratch
class Adam {
  constructor(params, lr=3e-4, beta1=0.9, beta2=0.999, eps=1e-8, weightDecay=0) {
    this.params = params; this.lr = lr;
    this.beta1 = beta1; this.beta2 = beta2; this.eps = eps;
    this.weightDecay = weightDecay;
    this.m = params.map(p => new Array(p.length).fill(0));
    this.v = params.map(p => new Array(p.length).fill(0));
    this.t = 0;
  }
  step(grads) {
    this.t++;
    const bc1 = 1 - this.beta1 ** this.t; // bias correction
    const bc2 = 1 - this.beta2 ** this.t;
    this.params.forEach((param, pi) => {
      param.forEach((_, j) => {
        const g = grads[pi][j] + this.weightDecay * param[j]; // AdamW
        this.m[pi][j] = this.beta1 * this.m[pi][j] + (1 - this.beta1) * g;
        this.v[pi][j] = this.beta2 * this.v[pi][j] + (1 - this.beta2) * g * g;
        const mHat = this.m[pi][j] / bc1;
        const vHat = this.v[pi][j] / bc2;
        param[j] -= this.lr * mHat / (Math.sqrt(vHat) + this.eps);
      });
    });
  }
}

// Cosine LR schedule with warmup
const cosineLR = (step, warmupSteps, totalSteps, minLR, maxLR) => {
  if (step < warmupSteps) return maxLR * step / warmupSteps; // linear warmup
  const progress = (step - warmupSteps) / (totalSteps - warmupSteps);
  return minLR + (maxLR - minLR) * 0.5 * (1 + Math.cos(Math.PI * progress));
};

// Gradient clipping by norm
const clipGradNorm = (grads, maxNorm) => {
  const totalNorm = Math.sqrt(grads.flat().reduce((s, g) => s + g*g, 0));
  if (totalNorm > maxNorm) {
    const scale = maxNorm / totalNorm;
    return grads.map(g => g.map(v => v * scale));
  }
  return grads;
};

// He initialization for ReLU
const heInit = (fanIn, fanOut) => {
  const std = Math.sqrt(2 / fanIn);
  return Array.from({length: fanOut}, () =>
    Array.from({length: fanIn}, () => (Math.random() - 0.5) * 2 * std));
};`,
  },

  // ── Scaling Laws ────────────────────────────────────────────────────────
  { id:'scaling-laws', cat:'dl', title:'Scaling Laws & LLMs', icon:'📈', viz:'none', color:'#ff9d40',
    tags:['Chinchilla','Emergent Abilities','Compute-Optimal','GPT','Fine-Tuning','RLHF'],
    overview:'Scaling laws describe how model performance improves predictably with model size, data, and compute. The Chinchilla paper overturned earlier assumptions, showing data scales equally with model size for compute-optimal training. Understanding these laws guides building large language models efficiently.',
    points:[
      {t:'Power Law Scaling',d:'Neural language model loss follows power laws: L(N)=Aα/Nᵅ (model size), L(D)=Bβ/Dᵝ (dataset size), L(C)=Cγ/Cᵞ (compute). These fit over many orders of magnitude. Kaplan et al. (2020): loss L(N,D)=[(Nc/N)^αN + (Dc/D)^αD + L∞] where L∞ is irreducible entropy. Larger models are more sample-efficient — they reach lower loss with less data. Takeaway: if compute is fixed, use it on larger models with less data (Kaplan). This was overturned by Chinchilla.'},
      {t:'Chinchilla — Compute-Optimal Training',d:'Hoffmann et al. (2022): For fixed compute budget C≈6ND (FLOPs), optimal allocation is equal scaling: N ∝ C^0.5 and D ∝ C^0.5. Parameter count should scale linearly with token budget (not ~quadratically as Kaplan suggested). Finding: GPT-3 (175B params) was undertrained — should use ~175B×20=3.5T tokens. Chinchilla (70B params, 1.4T tokens) outperforms GPT-3 (175B, 300B tokens). Practical rule: ~20 tokens per parameter for compute-optimal training. LLaMA applied this principle. Post-inference compute matters too — smaller models trained on more tokens are better at inference.'},
      {t:'Emergent Abilities — Phase Transitions',d:'Abilities absent in small models appear discontinuously at scale thresholds. Wei et al. (2022): 8-shot BIG-Bench tasks show near-random performance below ~10²² FLOPs, then jump to above-chance. Emergent examples: arithmetic (appears ~100B params), multi-step reasoning, code generation, calibration, few-shot learning. Controversy: Schaeffer et al. (2023) argue emergence is artifact of metrics (discontinuous metrics create apparent emergence). With continuous metrics, smooth improvement. Still debated. Implication: can\'t reliably predict capabilities from smaller models — unexpected capability jumps possible.'},
      {t:'LLM Architecture & Training',d:'Decoder-only transformer: GPT-style. Encoder-decoder: T5/BART. Encoder-only: BERT (masked LM). Modern LLMs: GPT-4, Claude, Gemini — decoder-only, 100B-1T parameters. Key choices: RoPE (Rotary Position Embedding) vs learned vs ALiBi. GQA (Grouped Query Attention) reduces KV cache. SwiGLU activation (better than ReLU for LLMs). RMSNorm instead of LayerNorm. Flash Attention: O(n) memory instead of O(n²) via tiling. Training: AdamW + cosine LR with warmup, gradient clipping, mixed precision (BF16), distributed training (tensor/pipeline/data parallelism).'},
      {t:'Fine-Tuning & Alignment',d:'SFT (Supervised Fine-Tuning): train on instruction-following demonstrations. Reduces task-specific training needed. LoRA (Low-Rank Adaptation): freeze base model, train low-rank matrices ΔW=BA where B∈R^{d×r}, A∈R^{r×k}, r<<min(d,k). Only train r×(d+k) params instead of d×k. QLoRA: 4-bit quantize base model + LoRA adapters in BF16. RLHF: (1) Train reward model R(x,y) from human preference pairs. (2) PPO: maximize E[R(x,y)] - β KL[π_θ||π_ref]. The KL penalty prevents reward hacking. DPO (Direct Preference Optimization): bypass RL, directly optimize on preference pairs. More stable than PPO. Used in Claude, Llama-2.'},
      {t:'Inference & Deployment',d:'KV Cache: cache attention keys/values from prior tokens, O(nd) per new token instead of O(n²d). Enables long contexts. Quantization: INT8 reduces memory 2x with minimal quality loss. GPTQ/AWQ: 4-bit quantization for 4x compression. Speculative decoding: small "draft" model generates candidates, large model verifies in parallel — 2-3x speedup. Prefill (prompt processing): parallelizable, fast. Decode (generation): sequential, slow — bottleneck. Flash Attention 2: 50-75% utilization on A100 (vs 25% standard). Continuous batching: don\'t wait for entire batch to finish. vLLM: PagedAttention for KV cache fragmentation. LMM serving systems: triton, TGI, vLLM, TensorRT-LLM.'},
    ],
    complexity:'Training: 6ND FLOPs for N params, D tokens · Inference: 2N FLOPs per token (with KV cache) · Memory: ~2 bytes/param (BF16) + KV cache ~4n_layers×n_heads×d_head×seq_len',
    code:`// Scaling law loss estimation (Chinchilla model)
const chinchillaLoss = (N, D, alpha_N = 0.34, alpha_D = 0.28, E = 1.69) => {
  // L(N,D) = E + A/N^alpha_N + B/D^alpha_D
  // E = irreducible entropy, from Chinchilla paper
  const A = 406.4, B = 410.7;
  return E + A / Math.pow(N, alpha_N) + B / Math.pow(D, alpha_D);
};

// Compute-optimal N and D for given compute budget C (FLOPs)
// C ≈ 6 * N * D for transformer training
const computeOptimal = (C) => {
  // From Chinchilla: N_opt ≈ (C / 6)^0.5 (simplified)
  const N_opt = Math.sqrt(C / 6);
  const D_opt = C / (6 * N_opt); // = N_opt tokens
  return { N_opt, D_opt, tokensPerParam: D_opt / N_opt };
};

// LoRA weight update
const loraForward = (x, W_frozen, A, B, scale = 1.0) => {
  // Forward: h = xW + x(BA)·scale
  const xW = x.map(xi => W_frozen.map(col => xi.reduce((s, v, j) => s + v * col[j], 0)));
  const xA = x.map(xi => A.map(row => row.reduce((s, v, j) => s + xi[j] * v, 0)));
  const xAB = xA.map(xi => B.map(col => xi.reduce((s, v, j) => s + v * col[j], 0)));
  return xW.map((row, i) => row.map((v, j) => v + scale * xAB[i][j]));
};

// Cosine learning rate with warmup for LLM training
const llmLRSchedule = (step, { warmupSteps = 2000, maxSteps = 100000, maxLR = 3e-4, minLR = 3e-5 } = {}) => {
  if (step < warmupSteps) return maxLR * (step / warmupSteps);
  const progress = (step - warmupSteps) / (maxSteps - warmupSteps);
  return minLR + 0.5 * (maxLR - minLR) * (1 + Math.cos(Math.PI * Math.min(progress, 1)));
};

// Speculative decoding (conceptual)
const speculativeDecode = async (prompt, draftModel, verifierModel, K = 4) => {
  let output = prompt;
  while (true) {
    // Draft model generates K tokens speculatively
    const draft = await draftModel.generate(output, K);
    // Verifier checks all K tokens in parallel
    const verified = await verifierModel.verify(output, draft);
    // Accept tokens up to first rejection
    const accepted = verified.filter((ok, i) => i === 0 || verified[i-1]).map(ok => ok);
    output += draft.slice(0, accepted.length).join('');
    if (accepted.length < K) break; // regenerate on rejection
  }
  return output;
};`,
  },

  // ── Deep Learning Frameworks ────────────────────────────────────────────
  { id:'dl-frameworks', cat:'dl', title:'Deep Learning Frameworks', icon:'⚙', viz:'none', color:T.cy,
    tags:['PyTorch','TensorFlow','JAX','ONNX','CUDA','Autograd'],
    overview:'Deep learning frameworks provide automatic differentiation, GPU acceleration, and high-level neural network building blocks. PyTorch dominates research; TensorFlow/Keras dominates production. JAX is gaining ground for research with its functional, composable design.',
    points:[
      {t:'PyTorch — Eager Execution & Autograd',d:'Define-by-run (eager): computation graph built dynamically as code executes. Pythonic, easy debugging. Autograd: tracks operations on tensors with requires_grad=True. Backward pass via .backward() computes all gradients. Tape-based differentiation. torch.nn: Module hierarchy for networks. torch.optim: standard optimizers. DataLoader: batching, shuffling, multiprocessing. torch.compile (2.0): JIT compilation for 2x+ speedup. Distributed: DDP (DistributedDataParallel) for multi-GPU, FSDP for model sharding. Research standard: >70% of ML papers.'},
      {t:'TensorFlow & Keras — Production Ecosystem',d:'Define-and-run (graph mode): tf.function compiles to static graph for optimization. Eager mode by default in TF2. Keras: high-level API, Sequential and Functional APIs for model building. tf.data: efficient input pipelines with prefetching, caching. TF Serving: production model serving with REST/gRPC. TFLite: mobile and edge inference, quantization, hardware acceleration. TF.js: browser and Node.js inference. SavedModel format for cross-platform deployment. TFX: full ML pipeline. TensorBoard: training visualization. Dominant in production and mobile.'},
      {t:'JAX — Functional Transformations',d:'NumPy-compatible but with four key transforms: jit() (JIT compilation to XLA), grad() (exact gradients, higher-order diffs), vmap() (vectorize over batch dimension without loops), pmap() (parallelize over devices). Composable: jit(grad(vmap(f))). Stateless: JAX functions are pure, no in-place mutation. Random state explicit (not global). XLA backend: GPU + TPU optimized. Ecosystem: Flax (neural nets), Optax (optimizers), Haiku (neural nets), Chex (testing). Used in AlphaFold, PaLM training. Key insight: vmap replaces for loops over batches, enabling clean functional code.'},
      {t:'Automatic Differentiation — How It Works',d:'Forward mode: compute derivative alongside function, propagate dual numbers (x+εx\'). O(n) passes for n outputs. Backward mode (backprop): compute all partial derivatives in one backward pass. O(1) passes for scalar loss. Computational graph: nodes = operations, edges = data flow. Forward pass stores intermediate values. Backward pass applies chain rule: ∂L/∂xᵢ=Σⱼ(∂L/∂yⱼ)(∂yⱼ/∂xᵢ). Higher-order derivatives: grad(grad(f)) works in PyTorch/JAX. Jacobian: torch.autograd.functional.jacobian. Hessian: jacobian(jacobian(f)). Used for meta-learning, influence functions.'},
      {t:'GPU Acceleration & CUDA',d:'CUDA: NVIDIA parallel programming model. Kernel: function executed by thousands of GPU threads simultaneously. Thread hierarchy: Grid→Block→Thread. Shared memory per block (fast, limited). Global memory (large, slower). cuBLAS: optimized BLAS for GPU (matrix operations). cuDNN: primitives for convolution, pooling, attention, normalization. Memory bottleneck: GPU HBM bandwidth ~2TB/s (A100). Compute bound vs memory bound: attention is memory bound, FFN layers are compute bound. Flash Attention: tile computation to fit in SRAM, O(n) memory vs O(n²). Mixed precision: BF16 forward, FP32 gradient accumulation.'},
      {t:'ONNX & Model Export',d:'Open Neural Network Exchange: standard format for ML models across frameworks. Export PyTorch→ONNX: torch.onnx.export(). Run with onnxruntime on CPU/GPU. Optimize with onnxruntime optimizations. TensorRT: NVIDIA inference optimizer, kernel fusion, INT8 quantization, 3-5x speedup. TFLite: TensorFlow mobile format, 4-8x smaller, hardware delegates (GPU, NPU). CoreML: Apple Silicon optimization. OpenVINO: Intel hardware. BentoML, Triton Inference Server: model serving abstraction. The interoperability chain: train in PyTorch → export ONNX → optimize with TensorRT → serve with Triton.'},
    ],
    complexity:'PyTorch forward O(params×batch) · Backward O(params×batch) same FLOPs · GPU speedup 50-500x vs CPU for matmuls · Mixed precision 2x memory reduction',
    code:`// PyTorch-style neural network in pure JS (educational)
class Module {
  constructor() { this.training = true; this.params = []; }
  train() { this.training = true; return this; }
  eval() { this.training = false; return this; }
}

class Linear extends Module {
  constructor(inFeatures, outFeatures, bias = true) {
    super();
    const std = Math.sqrt(2 / inFeatures); // He init
    this.weight = Array.from({length: outFeatures}, () =>
      Array.from({length: inFeatures}, () => (Math.random() - 0.5) * 2 * std));
    this.bias = bias ? new Array(outFeatures).fill(0) : null;
    this.params = [this.weight, ...(this.bias ? [this.bias] : [])];
  }
  forward(x) {
    return this.weight.map((row, i) =>
      row.reduce((s, w, j) => s + w * x[j], 0) + (this.bias ? this.bias[i] : 0));
  }
}

class ReLU extends Module {
  forward(x) { return Array.isArray(x) ? x.map(v => Math.max(0, v)) : Math.max(0, x); }
}

class Sequential extends Module {
  constructor(...layers) { super(); this.layers = layers; }
  forward(x) { return this.layers.reduce((h, layer) => layer.forward(h), x); }
  parameters() { return this.layers.flatMap(l => l.params || []); }
}

// Dropout (training only)
class Dropout extends Module {
  constructor(p = 0.5) { super(); this.p = p; }
  forward(x) {
    if (!this.training) return x;
    return x.map(v => Math.random() > this.p ? v / (1 - this.p) : 0);
  }
}

// JAX-style vmap (vectorize function over batch)
const vmap = (fn) => (batch) => batch.map(item => fn(item));

// JAX-style grad (numerical gradient for educational purposes)
const grad = (fn, eps = 1e-5) => (params) => {
  const f0 = fn(params);
  return params.map((p, i) => {
    const paramsPlus = [...params]; paramsPlus[i] = p + eps;
    return (fn(paramsPlus) - f0) / eps;
  });
};`,
  },

  // ── Model Evaluation & Feature Engineering ─────────────────────────────
  { id:'model-evaluation', cat:'ml', title:'Model Evaluation & Feature Engineering', icon:'📋', viz:'none', color:T.or,
    tags:['ROC-AUC','Cross-Validation','Precision','Recall','F1','Target Encoding','Pipelines'],
    overview:'Model evaluation determines if your model actually works and generalizes. Feature engineering transforms raw data into representations that learning algorithms can exploit. The classic saying: "garbage in, garbage out" — better features often matter more than better algorithms.',
    points:[
      {t:'Classification Metrics — Choosing Correctly',d:'Accuracy: (TP+TN)/(total). Misleading for imbalanced data (95% negative class → 95% accuracy predicting all negative). Precision=TP/(TP+FP): minimizes false alarms. Recall/Sensitivity=TP/(TP+FN): minimizes missed detections. F1=2PR/(P+R): harmonic mean, balances both. Medical example: screening for cancer, FN (missed cancer) is catastrophic → maximize recall. Spam filter, FP (blocking legitimate email) is costly → maximize precision. MCC (Matthews Correlation Coefficient) = (TP×TN-FP×FN)/√((TP+FP)(TP+FN)(TN+FP)(TN+FN)): balanced metric, range [-1,1], best for imbalanced.'},
      {t:'ROC Curve, AUC & PR Curve',d:'ROC (Receiver Operating Characteristic): plot TPR vs FPR at all classification thresholds. AUC=area under ROC curve [0.5, 1.0]. AUC=0.5 random, AUC=1.0 perfect. AUC = P(model ranks random positive > random negative). Threshold-independent metric. Problem with imbalanced data: high AUC possible even with poor minority class detection. PR Curve (Precision-Recall): plot Precision vs Recall. PR-AUC (Average Precision) better for imbalanced. F1 at specific threshold = single point on PR curve. Youden\'s J = Sensitivity+Specificity-1: threshold maximizing distance from chance line.'},
      {t:'Cross-Validation — Preventing Data Leakage',d:'k-Fold CV: split data into k folds, train on k-1, validate on 1, repeat k times. Average CV score is unbiased estimate of generalization. Stratified k-Fold: preserve class distribution in each fold (critical for imbalanced). Time series: must use forward-chaining CV — train on past, validate on future. Never shuffle. Leave-One-Out (LOO): k=n folds, high variance. Data leakage: test information leaks into training. Sources: scaling before splitting (use scale inside CV), feature selection before CV, target encoding without protection. Fix: sklearn Pipeline ensures transformers only fit on training data.'},
      {t:'Feature Engineering — Transformations',d:'Numerical: StandardScaler (z-score, needed for SVM/LR/KNN/PCA), MinMaxScaler (range [0,1], preserves zeros), RobustScaler (uses IQR, outlier-resistant), log transform for skewed distributions (income, counts), Box-Cox for general normality. Categorical: OneHotEncoding (creates binary columns, good for LR/SVM, sparse), Label encoding (only for ordinal), Target encoding (category → mean target, leakage risk → use CV), Frequency encoding (category → count, good for trees), Embeddings for high-cardinality. Missing values: mean/median imputation, KNNImputer, model-based, indicator variable for missingness pattern.'},
      {t:'Feature Selection Methods',d:'Filter methods (before model): Pearson correlation (removes correlated features), mutual information (captures non-linear deps), chi-square test (categorical vs target), ANOVA F-test (numerical vs categorical target). Wrapper methods (with model): Recursive Feature Elimination (RFE) — train model, remove lowest importance feature, repeat. Expensive but powerful. Embedded methods (during model): L1 regularization (Lasso) zeros out unimportant features, tree feature importances, SHAP values. Variance thresholding: remove near-constant features. VIF (Variance Inflation Factor): remove multicollinear features (VIF>10). PCA: unsupervised feature compression.'},
      {t:'Imbalanced Learning',d:'Oversampling: SMOTE (Synthetic Minority Oversampling): interpolate between existing minority samples. Not just copying. ADASYN: more synthetic samples in harder-to-learn regions. Undersampling: TomekLinks (remove overlapping majority samples), ClusterCentroids (replace cluster of majority with centroid). Algorithmic: class_weight parameter in sklearn (weight misclassification of minority class more). threshold tuning: lower classification threshold to increase recall. Ensemble: BalancedRandomForest, EasyEnsemble, BalancedBaggingClassifier. Evaluation: never use accuracy — use F1, PR-AUC, MCC.'},
    ],
    complexity:'k-Fold CV: O(k × training time) · SMOTE O(n_minority × k) · RFE O(n_features² × training) · Feature selection O(n_features × n_samples)',
    code:`// Cross-validation with preprocessing pipeline
class Pipeline {
  constructor(steps) { this.steps = steps; }
  fitTransform(X, y) {
    let data = X;
    this.steps.forEach(([name, step]) => {
      if (step.fit) step.fit(data, y);
      if (step.transform) data = step.transform(data);
    });
    return data;
  }
  transform(X) {
    let data = X;
    this.steps.forEach(([_, step]) => {
      if (step.transform) data = step.transform(data);
    });
    return data;
  }
}

// Stratified K-Fold
const stratifiedKFold = (X, y, k = 5) => {
  const classes = [...new Set(y)];
  const folds = Array.from({length: k}, () => ({ X: [], y: [] }));
  classes.forEach(cls => {
    const indices = y.map((yi, i) => yi === cls ? i : -1).filter(i => i >= 0);
    // Shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    indices.forEach((idx, i) => {
      folds[i % k].X.push(X[idx]);
      folds[i % k].y.push(y[idx]);
    });
  });
  return folds;
};

// Confusion matrix and metrics
const confusionMatrix = (yTrue, yPred) => {
  const classes = [...new Set([...yTrue, ...yPred])].sort();
  const cm = Array.from({length: classes.length}, () => new Array(classes.length).fill(0));
  yTrue.forEach((t, i) => cm[classes.indexOf(t)][classes.indexOf(yPred[i])]++);
  return { cm, classes };
};

const classificationMetrics = (yTrue, yPred, cls) => {
  const tp = yTrue.filter((y, i) => y === cls && yPred[i] === cls).length;
  const fp = yTrue.filter((y, i) => y !== cls && yPred[i] === cls).length;
  const fn = yTrue.filter((y, i) => y === cls && yPred[i] !== cls).length;
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1 = 2 * precision * recall / (precision + recall) || 0;
  return { precision, recall, f1, tp, fp, fn };
};

// Standard scaler
class StandardScaler {
  fit(X) {
    const n = X.length, d = X[0].length;
    this.mean = Array.from({length: d}, (_, j) => X.reduce((s, row) => s + row[j], 0) / n);
    this.std = Array.from({length: d}, (_, j) => {
      const m = this.mean[j];
      return Math.sqrt(X.reduce((s, row) => s + (row[j] - m)**2, 0) / (n - 1));
    });
    return this;
  }
  transform(X) {
    return X.map(row => row.map((v, j) => (v - this.mean[j]) / (this.std[j] || 1)));
  }
}`,
  },

  // ── Transformers Deep Dive ──────────────────────────────────────────────
  { id:'transformers-deep', cat:'nlp', title:'Transformers — Deep Dive', icon:'⊛', viz:'attention', color:'#ff9d40',
    tags:['BERT','GPT','T5','Flash Attention','RoPE','Fine-Tuning','RAG'],
    overview:'Transformers power every modern LLM. "Attention is All You Need" (2017) introduced the architecture. BERT pioneered bidirectional pretraining; GPT proved autoregressive scaling; T5 unified encoder-decoder; LLaMA showed efficiency. Understanding each component enables building and fine-tuning frontier models.',
    points:[
      {t:'Attention — Mathematical Deep Dive',d:'Input: Q∈R^{n×d_k}, K∈R^{n×d_k}, V∈R^{n×d_v}. Attention(Q,K,V)=softmax(QKᵀ/√d_k)V. The √d_k scaling: without it, dot products grow large with d_k → softmax saturates → vanishing gradients. Multi-Head: run h heads in parallel with different projection matrices W^Q_i, W^K_i, W^V_i∈R^{d×d_k}. Concatenate h outputs, project: MultiHead(Q,K,V)=Concat(head₁,...,headₕ)W^O. Each head can learn different attention patterns: one for syntactic, one for coreference, etc. Cross-Attention (encoder-decoder): Q from decoder, K and V from encoder output.'},
      {t:'Transformer Block Architecture',d:'Sub-layers: (1) Multi-Head Self-Attention. (2) Feed-Forward Network: FFN(x)=max(0,xW₁+b₁)W₂+b₂ with 4× expansion (d_ff=4×d_model). Pre-Norm (modern): LayerNorm before sublayer: x+sublayer(LayerNorm(x)). Post-Norm (original): x+LayerNorm(sublayer(x)). Pre-Norm more stable for deep networks. KV Cache: during inference, cache K,V for each layer. Memory = 2×n_layers×n_heads×d_head×seq_len×2 bytes (BF16). Grouped Query Attention (GQA): share K,V heads across groups of Q heads → reduces KV cache size significantly (LLaMA 2 70B).'},
      {t:'Positional Encodings — From Sinusoidal to RoPE',d:'Original Sinusoidal: PE(pos,2i)=sin(pos/10000^{2i/d}), PE(pos,2i+1)=cos(pos/10000^{2i/d}). Fixed, no parameters. Learned: embed position as learnable vector. Can\'t generalize beyond training length. ALiBi: add linear bias to attention scores, no position encodings, generalizes to longer sequences. RoPE (Rotary Position Embedding): encode position by rotating Q and K vectors in 2D subspaces. Relative positions matter, not absolute. Generalizes to longer sequences with rope scaling. Standard in LLaMA, Mistral, Qwen. Key property: attention(q_m, k_n) only depends on m-n (relative position).'},
      {t:'BERT vs GPT vs T5 — Pretraining Paradigms',d:'BERT: encoder-only. Masked Language Model (MLM): randomly mask 15% of tokens, predict them. Next Sentence Prediction (NSP): predict if sentence B follows A (less useful). Bidirectional context → great for classification, NER, QA. Can\'t generate. GPT: decoder-only. Causal LM: predict next token autoregressively. Unidirectional → great for generation. Few-shot prompting emerges at scale. T5 (Text-to-Text Transfer Transformer): encoder-decoder. All tasks framed as text→text. Unified multitask training. SpanBERT: span masking more effective than token masking. RoBERTa: BERT trained correctly (more data, no NSP, larger batches). ALBERT: parameter sharing across layers.'},
      {t:'Efficient Transformers & Flash Attention',d:'Standard attention: O(n²) time and memory (store n×n attention matrix). Flash Attention (Dao et al. 2022): tile computation into blocks that fit in SRAM. Recompute attention weights during backward pass instead of storing. O(n) memory, same O(n²) compute but 3-5x wall clock speedup due to I/O reduction. Flash Attention 2: 50-75% GPU utilization on A100. Sparse Attention (BigBird, Longformer): O(n) by attending only to local window + global tokens. Linformer: project K,V to lower dimension → O(n) attention. Sliding Window Attention: Mistral uses this for long context.'},
      {t:'Fine-Tuning Strategies',d:'Full fine-tuning: update all parameters. Best quality, expensive (same memory as pretraining). Feature extraction: freeze pretrained layers, only train task head. Fast but limited adaption. LoRA: low-rank adapter matrices added to attention layers. Typical rank r=4-16. Only train 0.1-1% of parameters. QLoRA: 4-bit quantized base + BF16 LoRA. Fits 65B model on single A100. Instruction tuning: fine-tune on instruction-following pairs. Enables zero-shot task generalization. FLAN-T5: T5 fine-tuned on 1000+ tasks. Chain-of-Thought (CoT) fine-tuning: training on reasoning traces improves multi-step reasoning.'},
    ],
    complexity:'Attention O(n²d) · FFN O(nd²) · Flash Attention O(n) memory, O(n²d) compute · KV Cache O(n_layers × n_kv_heads × d × seq_len) · LoRA O(r(d+k)) params',
    code:`// Full Transformer block implementation
const layerNorm = (x, gamma, beta, eps = 1e-5) => {
  const mean = x.reduce((s, v) => s + v, 0) / x.length;
  const variance = x.reduce((s, v) => s + (v - mean)**2, 0) / x.length;
  const normalized = x.map(v => (v - mean) / Math.sqrt(variance + eps));
  return normalized.map((v, i) => gamma[i] * v + beta[i]);
};

// Scaled dot-product attention with causal mask
const scaledDotProductAttention = (Q, K, V, mask = null) => {
  const dK = Q[0].length;
  const scale = 1 / Math.sqrt(dK);
  // Compute attention scores
  const scores = Q.map(q => K.map(k =>
    q.reduce((s, qi, i) => s + qi * k[i], 0) * scale));
  // Apply causal mask (lower triangular)
  if (mask) scores.forEach((row, i) => row.forEach((_, j) => {
    if (j > i) scores[i][j] = -Infinity;
  }));
  // Softmax
  const weights = scores.map(row => {
    const maxScore = Math.max(...row.filter(v => isFinite(v)));
    const exp = row.map(v => isFinite(v) ? Math.exp(v - maxScore) : 0);
    const sum = exp.reduce((s, v) => s + v, 0);
    return exp.map(v => v / sum);
  });
  // Weighted sum of values
  return weights.map(w =>
    V[0].map((_, j) => w.reduce((s, wi, i) => s + wi * V[i][j], 0)));
};

// RoPE (Rotary Position Embedding)
const applyRoPE = (x, position, dim) => {
  const result = [...x];
  for (let i = 0; i < dim; i += 2) {
    const theta = position / Math.pow(10000, i / dim);
    const cos = Math.cos(theta), sin = Math.sin(theta);
    result[i]   = x[i] * cos - x[i+1] * sin;
    result[i+1] = x[i] * sin + x[i+1] * cos;
  }
  return result;
};

// KV Cache simulation
class KVCache {
  constructor(nLayers, nHeads, headDim) {
    this.nLayers = nLayers; this.nHeads = nHeads; this.headDim = headDim;
    this.keys   = Array.from({length: nLayers}, () => []);
    this.values = Array.from({length: nLayers}, () => []);
  }
  append(layer, k, v) {
    this.keys[layer].push(k);
    this.values[layer].push(v);
  }
  get(layer) { return { K: this.keys[layer], V: this.values[layer] }; }
  memoryBytes() {
    const seqLen = this.keys[0]?.length ?? 0;
    return 2 * this.nLayers * this.nHeads * this.headDim * seqLen * 2; // BF16=2bytes
  }
}`,
  },


  // ── NLP Fundamentals & Pipeline ────────────────────────────────────────
  { id:'nlp-fundamentals', cat:'nlp', title:'NLP Fundamentals & Pipeline', icon:'💬', viz:'none', color:T.gn,
    tags:['Tokenization','NER','POS Tagging','Sentiment','Text Classification','spaCy','NLTK'],
    overview:'Natural Language Processing (NLP) gives computers the ability to understand human language. Modern NLP blends classical linguistics (grammar, morphology, parsing) with statistical and deep learning approaches. The NLP pipeline transforms raw text into structured representations for downstream tasks.',
    points:[
      {t:'The NLP Pipeline',d:'Raw text → (1) Sentence segmentation: split by punctuation+rules. (2) Tokenization: split into tokens (words/subwords/characters). Word tokenization misses morphology. Subword (BPE, WordPiece, SentencePiece): balance vocabulary size vs coverage. BPE: merge most frequent character pairs iteratively until vocab size reached. WordPiece: maximize language model likelihood of training data. (3) Text normalization: lowercase, remove punctuation, stemming (porter: running→run) or lemmatization (ran→run, context-aware). (4) Stopword removal (for bag-of-words tasks). (5) Feature extraction or embedding lookup.'},
      {t:'Named Entity Recognition (NER)',d:'Identify and classify named entities: Person, Organization, Location, Date, Money, etc. BIO tagging scheme: B-PER (beginning), I-PER (inside), O (outside). Model: BiLSTM-CRF or fine-tuned BERT. CRF (Conditional Random Field) on top ensures valid tag transitions (can\'t have I-PER after O). spaCy: pretrained NER pipeline, 70-90% F1 on typical text. BERT NER: fine-tune on CoNLL-2003, achieves 92%+ F1. Challenges: ambiguity ("Jordan" = person or country?), nested entities, new entity types.'},
      {t:'POS Tagging & Parsing',d:'Part-of-Speech: label each token (NN=noun, VB=verb, JJ=adjective, DT=determiner, etc.). Penn Treebank tagset: 45 tags. HMM: P(tags|words) ∝ P(words|tags)P(tags). Emission × Transition probabilities, Viterbi algorithm O(n×|T|²). Neural: BiLSTM or BERT, 97%+ accuracy. Dependency Parsing: directed tree where each word has one head (parent). Universal Dependencies: cross-lingual standard. Constituency Parsing: hierarchical phrase-structure tree (NP, VP, PP). Used for: information extraction, question answering, relation extraction.'},
      {t:'Text Classification & Sentiment Analysis',d:'Text classification: assign label to document (topic, intent, language, toxicity). Pipeline: bag-of-words (TF-IDF) → logistic regression/SVM (strong baseline), or pretrained transformer. TF-IDF: TF(t,d)×IDF(t)=count(t,d)/total(d)×log(N/df(t)). Captures term importance. Sentiment: positive/negative/neutral. Lexicon-based (VADER): score by sentiment word dictionary. ML-based: BERT fine-tuned on SST-2 achieves 94%+ accuracy. Aspect-based: "battery bad, screen good" → (battery, negative), (screen, positive). Challenges: sarcasm, negation, domain shift.'},
      {t:'Machine Translation & Seq2Seq',d:'Statistical MT: phrase-based translation tables + language model. Attention (2014): soft alignment between source and target. Encoder-Decoder with attention: context vector = weighted sum of all encoder hidden states. Attention weight = softmax(score(decoder_state, encoder_state_i)). Scores: dot product, additive (Bahdanau), or multiplicative. Transformer MT: multi-head attention, trained on millions of sentence pairs. BLEU score: n-gram precision + brevity penalty. Limitations: domain mismatch, rare words, gender/number agreement. Neural MT beats phrase-based on most language pairs.'},
      {t:'Question Answering & Information Extraction',d:'Extractive QA: find answer span in passage. SQuAD 2.0: 100k+ QA pairs. BERT: predict start/end positions of answer span via linear layer on top of [CLS]. Fine-tuned BERT achieves 91%+ F1. Generative QA (RAG): retrieve relevant docs, generate answer. Open-domain QA: retrieve from Wikipedia then answer. Relation Extraction: (entity1, relation, entity2) triples from text. Pattern-based vs supervised. OpenIE: unsupervised extraction. Coreference Resolution: link "he" to "Barack Obama" using cluster model. OntoNotes benchmark: 75%+ F1 with neural models.'},
      {t:'Topic Modeling & Text Summarization',d:'LDA (Latent Dirichlet Allocation): generative model. Documents = mixtures of topics. Topics = distributions over words. EM inference. Hyperparameters α (doc-topic sparsity), β (topic-word sparsity). NMF: non-negative matrix factorization of document-term matrix. BERTopic: BERT embeddings + UMAP + HDBSCAN + TF-IDF topic labels. Extractive summarization: TextRank (graph of sentence similarities, PageRank). Abstractive: seq2seq with attention (BART, T5). ROUGE score: measures n-gram overlap with reference summary. ROUGE-1, ROUGE-2, ROUGE-L (longest common subsequence).'},
    ],
    complexity:'Tokenization O(n) · POS (HMM/Viterbi) O(n×|T|²) · BERT inference O(n²d) · TF-IDF O(n×vocab) · BPE training O(n×vocab²)',
    code:`// BPE Tokenization (simplified)
const trainBPE = (corpus, targetVocabSize) => {
  // Start with character vocabulary
  let vocab = new Map();
  corpus.split(' ').forEach(word => {
    const chars = [...word].join(' ') + ' </w>';
    vocab.set(chars, (vocab.get(chars) || 0) + 1);
  });
  while (vocab.size < targetVocabSize) {
    // Count bigram frequencies
    const bigrams = new Map();
    for (const [word, count] of vocab) {
      const tokens = word.split(' ');
      for (let i = 0; i < tokens.length - 1; i++) {
        const pair = tokens[i] + '|' + tokens[i+1];
        bigrams.set(pair, (bigrams.get(pair) || 0) + count);
      }
    }
    if (!bigrams.size) break;
    // Find most frequent bigram
    const [bestPair] = [...bigrams.entries()].sort((a, b) => b[1] - a[1])[0];
    const [a, b] = bestPair.split('|');
    const merged = a + b;
    // Merge all occurrences
    const newVocab = new Map();
    for (const [word, count] of vocab) {
      const newWord = word.replace(new RegExp(a + ' ' + b, 'g'), merged);
      newVocab.set(newWord, count);
    }
    vocab = newVocab;
  }
  return vocab;
};

// TF-IDF from scratch
const computeTFIDF = (documents) => {
  const N = documents.length;
  const tokenized = documents.map(doc => doc.toLowerCase().split(/\W+/).filter(Boolean));
  // Term frequencies
  const tf = tokenized.map(tokens => {
    const freq = {};
    tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
    return Object.fromEntries(Object.entries(freq).map(([t, c]) => [t, c / tokens.length]));
  });
  // Inverse document frequencies
  const allTerms = [...new Set(tokenized.flat())];
  const idf = Object.fromEntries(allTerms.map(term => {
    const df = tokenized.filter(tokens => tokens.includes(term)).length;
    return [term, Math.log((N + 1) / (df + 1)) + 1]; // smoothed
  }));
  // TF-IDF matrix
  return tf.map(docTF =>
    Object.fromEntries(allTerms.map(term => [term, (docTF[term] || 0) * idf[term]])));
};

// Viterbi for HMM POS tagging (simplified)
const viterbi = (words, states, initProb, transProb, emitProb) => {
  const n = words.length, m = states.length;
  const dp = Array.from({length: n}, () => new Array(m).fill(0));
  const bp = Array.from({length: n}, () => new Array(m).fill(0));
  // Initialize
  states.forEach((s, i) => dp[0][i] = (initProb[s] || 1e-10) * (emitProb[s]?.[words[0]] || 1e-10));
  // Forward
  for (let t = 1; t < n; t++) {
    states.forEach((s, j) => {
      const scores = states.map((prev, i) =>
        dp[t-1][i] * (transProb[prev]?.[s] || 1e-10) * (emitProb[s]?.[words[t]] || 1e-10));
      dp[t][j] = Math.max(...scores);
      bp[t][j] = scores.indexOf(dp[t][j]);
    });
  }
  // Backtrack
  const tags = new Array(n);
  tags[n-1] = dp[n-1].indexOf(Math.max(...dp[n-1]));
  for (let t = n-2; t >= 0; t--) tags[t] = bp[t+1][tags[t+1]];
  return tags.map(i => states[i]);
};

// ROUGE-N evaluation score
const rougeN = (hypothesis, reference, n = 1) => {
  const ngrams = (text, n) => {
    const tokens = text.split(' ');
    const grams = [];
    for (let i = 0; i <= tokens.length - n; i++) grams.push(tokens.slice(i, i+n).join(' '));
    return grams;
  };
  const hypGrams = ngrams(hypothesis, n);
  const refGrams = ngrams(reference, n);
  const refSet = new Map();
  refGrams.forEach(g => refSet.set(g, (refSet.get(g) || 0) + 1));
  const matches = hypGrams.filter(g => refSet.has(g) && refSet.get(g) > 0)
    .reduce((s, g) => { refSet.set(g, refSet.get(g) - 1); return s + 1; }, 0);
  const precision = matches / hypGrams.length || 0;
  const recall = matches / refGrams.length || 0;
  const f1 = 2 * precision * recall / (precision + recall) || 0;
  return { precision, recall, f1 };
};`,
  },


  // ── HuggingFace Transformers ────────────────────────────────────────────
  { id:'huggingface', cat:'dl', title:'HuggingFace Transformers', icon:'🤗', viz:'none', color:'#ff9d40',
    tags:['Pipeline','AutoModel','Trainer','BERT','GPT','T5','LoRA','Model Hub','Fine-Tuning'],
    overview:'HuggingFace Transformers is the de-facto standard library for state-of-the-art ML. With 1M+ pretrained models on the Hub, it gives every developer access to frontier AI: BERT, GPT, Whisper, DALL-E, SAM and more. Three core abstractions — Config, Model, Preprocessor — unlock any task in a few lines of code.',
    points:[
      {t:'Three Core Abstractions',d:'(1) PreTrainedConfig: JSON file defining model architecture — number of layers, attention heads, hidden size, vocabulary size. Load: AutoConfig.from_pretrained("bert-base-uncased"). (2) PreTrainedModel: the neural network weights. Base model returns raw hidden states. Task-specific heads (ForCausalLM, ForSequenceClassification, ForTokenClassification, ForQuestionAnswering) convert hidden states to task outputs. Load: AutoModel.from_pretrained("model-id"). (3) Preprocessor: tokenizers (text → token ids), image processors (pixels → tensors), feature extractors (audio → spectrograms). Auto classes infer the right class from the model name automatically.'},
      {t:'Pipeline API — One Line Inference',d:'pipeline(task, model=None, device=None): highest-level abstraction. Handles tokenization, model inference, and postprocessing. Tasks: "text-generation", "text-classification", "token-classification", "question-answering", "summarization", "translation", "fill-mask", "zero-shot-classification", "image-classification", "object-detection", "image-segmentation", "automatic-speech-recognition", "text-to-speech", "image-to-text", "document-question-answering". Example: pipe=pipeline("automatic-speech-recognition","openai/whisper-large-v3") → transcribes any audio. pipeline("zero-shot-classification","facebook/bart-large-mnli") → classify text into any labels without training!'},
      {t:'AutoModel & AutoTokenizer — Dynamic Architecture',d:'AutoModel.from_pretrained() reads config.json, infers architecture, loads weights. device_map="auto" distributes across available GPUs/CPU. dtype="auto" loads in stored dtype (BF16, FP16, FP32) avoiding double-loading. torch_dtype=torch.float16 for inference on GPU. Tokenizer: from_pretrained() loads vocabulary + tokenization rules. Tokenizer returns input_ids, attention_mask, token_type_ids as PyTorch/TF tensors. Batch encoding handles padding/truncation. Fast tokenizers: Rust-based, 10-100x faster than Python. Special tokens: [CLS], [SEP], [PAD], [MASK], <s>, </s> — model-specific.'},
      {t:'Trainer API — Full Training Loop',d:'TrainingArguments: controls everything — output_dir, learning_rate (2e-5 for fine-tuning), per_device_train_batch_size, num_train_epochs, warmup_ratio, weight_decay, logging_steps, eval_strategy, save_strategy, load_best_model_at_end, fp16/bf16, gradient_accumulation_steps, dataloader_num_workers. Trainer wraps model + dataset + tokenizer + data_collator + compute_metrics. Handles: multi-GPU (DDP), gradient accumulation, mixed precision, gradient clipping, LR scheduling, checkpointing, early stopping. trainer.train() → trainer.evaluate() → trainer.push_to_hub(). SFTTrainer (TRL library) for instruction fine-tuning. compute_metrics function: receives EvalPrediction with predictions+labels, returns dict of metric names.'},
      {t:'Fine-Tuning Patterns — Full vs PEFT',d:'Full fine-tuning: update all parameters. Best quality for large domain shifts. Needs same GPU RAM as pretraining. DistilBERT (66M) fits on consumer GPU. PEFT (Parameter-Efficient Fine-Tuning library): LoRA, QLoRA, IA³, Prefix Tuning, Prompt Tuning. LoRA: get_peft_model(model, LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj","v_proj"])). Adds only ~0.1-1% trainable parameters. QLoRA: BitsAndBytesConfig(load_in_4bit=True) + LoRA. Fine-tune 70B model on single A100. Dataset preparation: datasets.load_dataset() + .map(tokenize_fn, batched=True). DataCollatorForLanguageModeling, DataCollatorWithPadding for batching. EarlyStoppingCallback stops when eval metric plateaus.'},
      {t:'Model Hub — 1M+ Models',d:'huggingface.co/models: filter by task, language, library, license. Push models: model.push_to_hub("username/model-name"). Model card: README.md with training details, evaluation results, intended use, limitations. Spaces: deploy models with Gradio/Streamlit UI. Inference API: test any model via REST endpoint. Datasets: 100k+ datasets with dataset cards. model.config.to_json_file() saves configuration. model.save_pretrained(path), tokenizer.save_pretrained(path) for local storage. Offline mode: TRANSFORMERS_OFFLINE=1, HF_DATASETS_OFFLINE=1. Quantization: AutoModelForCausalLM.from_pretrained(..., load_in_8bit=True) via bitsandbytes. GPTQ/AWQ support for 4-bit. BF16: better range than FP16, no overflow.'},
      {t:'Supported Models & Tasks',d:'Language Models: LLaMA 3, Mistral, Qwen 2.5, Gemma 2, Phi-3 (text generation, reasoning). Classification: BERT, RoBERTa, DistilBERT, ALBERT (NLU tasks, fast). Generation+NLU: T5, FLAN-T5, BART (summarization, translation, QA). Vision: ViT, DeiT, DINO v2, SAM (image classification, segmentation). Object Detection: RT-DETR, DETR. Speech: Whisper (ASR, 100 languages), SpeechT5 (TTS). Multimodal: LLaVA, Qwen-VL, BLIP-2, PaliGemma (vision-language). Audio: CLAP (audio-text), MusicGen (audio generation). Quantized: TheBloke GGUF models for llama.cpp. Generation config: temperature, top_p, top_k, repetition_penalty, do_sample, beam_search.'},
    ],
    complexity:'Pipeline inference: O(seq_len²) per layer · Fine-tuning BERT: ~1hr/epoch on RTX 3090 · LoRA training: 10x less VRAM than full fine-tuning · Tokenization: O(n) with fast tokenizer',
    code:`# Full fine-tuning workflow with HuggingFace Transformers
# (Python — the standard for HuggingFace usage)

# === 1. CLASSIFICATION FINE-TUNING ===
from transformers import (
    AutoModelForSequenceClassification, AutoTokenizer,
    TrainingArguments, Trainer, DataCollatorWithPadding
)
from datasets import load_dataset
import numpy as np, evaluate

model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

dataset = load_dataset("rotten_tomatoes")
tokenize = lambda ex: tokenizer(ex["text"], truncation=True, max_length=512)
dataset = dataset.map(tokenize, batched=True)

accuracy = evaluate.load("accuracy")
def compute_metrics(eval_pred):
    preds = np.argmax(eval_pred.predictions, axis=1)
    return accuracy.compute(predictions=preds, references=eval_pred.label_ids)

training_args = TrainingArguments(
    output_dir="./results",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    bf16=True,  # BF16 mixed precision
)
trainer = Trainer(
    model=model, args=training_args,
    train_dataset=dataset["train"], eval_dataset=dataset["validation"],
    processing_class=tokenizer,
    data_collator=DataCollatorWithPadding(tokenizer),
    compute_metrics=compute_metrics,
)
trainer.train()
trainer.push_to_hub("my-sentiment-model")

# === 2. PIPELINE INFERENCE (one-liners) ===
from transformers import pipeline

# Text generation
gen = pipeline("text-generation", model="meta-llama/Llama-2-7b-hf", device_map="auto")
gen("The future of AI is", max_new_tokens=50, temperature=0.7, do_sample=True)

# Zero-shot classification (no training needed!)
zsc = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
zsc("I love playing football", candidate_labels=["sports", "cooking", "technology"])

# Speech recognition
asr = pipeline("automatic-speech-recognition", model="openai/whisper-large-v3")
asr("audio.mp3")  # returns {'text': '...'}

# === 3. QLORA FINE-TUNING (efficient) ===
from transformers import BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, TaskType
import torch

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    quantization_config=bnb_config,
    device_map="auto",
)
lora_config = LoraConfig(
    r=16, lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.1,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # e.g., 0.6% trainable

# === 4. GENERATION CONFIG ===
from transformers import GenerationConfig

gen_config = GenerationConfig(
    max_new_tokens=512,
    do_sample=True,
    temperature=0.7,
    top_p=0.9,
    top_k=50,
    repetition_penalty=1.1,
    pad_token_id=tokenizer.eos_token_id,
)
outputs = model.generate(**inputs, generation_config=gen_config)`,
  },

];

export const getTopicById = id => TOPICS.find(t => t.id === id);
export const getTopicsByCategory = cat => TOPICS.filter(t => t.cat === cat);
