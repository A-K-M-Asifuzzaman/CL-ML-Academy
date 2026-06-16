// Multi-type quiz database
// Types: 'mcq' | 'truefalse' | 'fill' | 'output' | 'order'

export const QUIZZES = [
  // ─── ARRAYS ─────────────────────────────────────────────────────────────
  {
    id: 'arr-q1', topicId: 'arrays', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 0,
    explanation: 'Array index access is O(1) because arrays store elements at contiguous memory addresses. The CPU can directly compute the address: base + i × sizeof(T).',
  },
  {
    id: 'arr-q2', topicId: 'arrays', type: 'truefalse', difficulty: 'easy', xp: 15,
    question: 'Prefix sum allows computing any range sum [l, r] in O(1) after O(n) preprocessing.',
    answer: true,
    explanation: 'Yes — after building prefix[i] = sum of arr[0..i-1] in O(n), rangeSum(l,r) = prefix[r+1] - prefix[l] runs in O(1).',
  },
  {
    id: 'arr-q3', topicId: 'arrays', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'What does the sliding window technique reduce the time complexity from?',
    options: ['O(n log n) to O(n)', 'O(n²) to O(n)', 'O(2ⁿ) to O(n)', 'O(n!) to O(n²)'],
    answer: 1,
    explanation: 'Sliding window converts O(n²) brute force (nested loops) to O(n) by maintaining a window that slides across the array, with each element entering and leaving exactly once.',
  },
  {
    id: 'arr-q4', topicId: 'arrays', type: 'output', difficulty: 'medium', xp: 30,
    question: 'What does this code output?',
    code: `const arr = [1,2,3,4,5];
const result = arr.reduce((acc, cur) => acc + cur, 0);
console.log(result);`,
    options: ['15', '10', '5', '120'],
    answer: 0,
    explanation: 'reduce sums all elements: 1+2+3+4+5 = 15.',
  },
  {
    id: 'arr-q5', topicId: 'arrays', type: 'fill', difficulty: 'hard', xp: 35,
    question: "Kadane's Algorithm finds the maximum subarray sum. Complete the formula: cur = Math.max(arr[i], ___ + arr[i])",
    answer: 'cur',
    caseSensitive: false,
    explanation: "cur = Math.max(arr[i], cur + arr[i]) — either start fresh at arr[i], or extend the current subarray.",
  },
  {
    id: 'arr-q6', topicId: 'arrays', type: 'mcq', difficulty: 'hard', xp: 35,
    question: 'In Two Pointers for sorted array pair sum, what is the time complexity?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    answer: 0,
    explanation: 'Two pointers traverse the array once — one from left, one from right — achieving O(n). This is better than the O(n log n) sort+binary-search approach.',
  },

  // ─── STRINGS ────────────────────────────────────────────────────────────
  {
    id: 'str-q1', topicId: 'strings', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'What is the time complexity of KMP pattern matching?',
    options: ['O(n × m)', 'O(n + m)', 'O(n log m)', 'O(m²)'],
    answer: 1,
    explanation: 'KMP preprocesses the pattern in O(m) to build the failure function, then matches in O(n). Total: O(n + m) vs O(n×m) naive.',
  },
  {
    id: 'str-q2', topicId: 'strings', type: 'truefalse', difficulty: 'easy', xp: 15,
    question: 'Sorting two strings and comparing them is the most space-efficient way to check for anagrams.',
    answer: false,
    explanation: 'Sorting uses O(n log n) time. A character frequency array (size 26) is O(n) time and O(1) extra space — more efficient in both dimensions.',
  },
  {
    id: 'str-q3', topicId: 'strings', type: 'output', difficulty: 'medium', xp: 30,
    question: 'What does this KMP failure function output for "abab"?',
    code: `const pattern = "abab";
const f = [0];
let k = 0, i = 1;
while (i < pattern.length) {
  if (pattern[i] === pattern[k]) f[i++] = ++k;
  else if (k > 0) k = f[k-1];
  else f[i++] = 0;
}
console.log(f.join(','));`,
    options: ['0,0,1,2', '0,1,2,3', '0,0,0,0', '1,2,1,2'],
    answer: 0,
    explanation: '"abab": a→0, b→0, a→1 (prefix "a"=suffix "a"), b→2 (prefix "ab"=suffix "ab"). Result: [0,0,1,2]',
  },
  {
    id: 'str-q4', topicId: 'strings', type: 'fill', difficulty: 'easy', xp: 20,
    question: 'The Manacher algorithm finds the longest palindromic substring in O(___).',
    answer: 'n',
    caseSensitive: false,
    explanation: 'Manacher\'s algorithm is O(n) — it uses previously computed palindrome information to avoid redundant comparisons.',
  },

  // ─── LINKED LISTS ───────────────────────────────────────────────────────
  {
    id: 'll-q1', topicId: 'linked-lists', type: 'mcq', difficulty: 'easy', xp: 20,
    question: "What is the space complexity of Floyd's cycle detection algorithm?",
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    answer: 0,
    explanation: "Floyd's uses only two pointers — slow and fast — regardless of list length. Space complexity is O(1).",
  },
  {
    id: 'll-q2', topicId: 'linked-lists', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'To find the middle of a linked list in one pass, which pointers do you use?',
    options: ['Two pointers: slow (1 step) and fast (2 steps)', 'Three pointers: prev, curr, next', 'One pointer with a counter', 'Recursive DFS'],
    answer: 0,
    explanation: 'Fast/slow pointers: when fast reaches the end, slow is at the middle. This is O(n/2) = O(n) in one pass.',
  },
  {
    id: 'll-q3', topicId: 'linked-lists', type: 'truefalse', difficulty: 'easy', xp: 15,
    question: 'Inserting a node at the HEAD of a linked list is O(1).',
    answer: true,
    explanation: 'O(1) — just create the new node, point its next to the current head, and update head. No traversal needed.',
  },
  {
    id: 'll-q4', topicId: 'linked-lists', type: 'output', difficulty: 'medium', xp: 30,
    question: 'How many pointer updates are needed to reverse a linked list of length n?',
    code: `// Reverse: prev=null, curr=head
// Each iteration: save next, curr.next=prev, prev=curr, curr=next
// Count: how many pointer assignments per iteration × n iterations?
// 4 assignments × n iterations = ?
console.log(4 * 5); // for n=5`,
    options: ['20', '5', '10', '15'],
    answer: 0,
    explanation: 'Each iteration does 4 pointer assignments: [1] next=curr.next, [2] curr.next=prev, [3] prev=curr, [4] curr=next. For n=5: 4×5=20.',
  },

  // ─── STACKS ─────────────────────────────────────────────────────────────
  {
    id: 'stk-q1', topicId: 'stacks', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'What does LIFO stand for in the context of stacks?',
    options: ['Last-In First-Out', 'List In Forward Order', 'Linear Index For Output', 'Last Index First Ordered'],
    answer: 0,
    explanation: 'LIFO = Last-In First-Out. The most recently pushed element is the first one popped. Like a stack of plates.',
  },
  {
    id: 'stk-q2', topicId: 'stacks', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'A monotonic DECREASING stack is useful for finding what?',
    options: ['Next Greater Element', 'Next Smaller Element', 'Maximum Subarray', 'Shortest Path'],
    answer: 0,
    explanation: 'A monotonic decreasing stack: when a larger element is found, everything smaller in the stack has found its Next Greater Element (the current element).',
  },
  {
    id: 'stk-q3', topicId: 'stacks', type: 'output', difficulty: 'medium', xp: 30,
    question: 'What is the result of evaluating this expression using a stack?',
    code: `// Postfix expression: 3 4 + 2 *
// Evaluate: push 3, push 4, + → pop and compute 3+4=7 push 7
//           push 2, * → pop and compute 7*2=14
console.log(14);`,
    options: ['14', '10', '24', '7'],
    answer: 0,
    explanation: 'Stack evaluation of "3 4 + 2 *": push 3, push 4, + → 7, push 2, * → 14.',
  },
  {
    id: 'stk-q4', topicId: 'stacks', type: 'truefalse', difficulty: 'easy', xp: 15,
    question: 'All recursive algorithms can be rewritten using an explicit stack.',
    answer: true,
    explanation: 'True — the call stack IS a stack. Any recursion can be simulated with an explicit stack, though the code becomes more complex. This avoids stack overflow for deep recursions.',
  },

  // ─── QUEUES ─────────────────────────────────────────────────────────────
  {
    id: 'que-q1', topicId: 'queues', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'Which graph traversal algorithm uses a queue?',
    options: ['BFS (Breadth-First Search)', 'DFS (Depth-First Search)', 'A* Search', 'Dijkstra with binary search'],
    answer: 0,
    explanation: 'BFS uses a queue to explore level by level. DFS uses a stack (or recursion). A queue ensures shortest-path property in unweighted graphs.',
  },
  {
    id: 'que-q2', topicId: 'queues', type: 'mcq', difficulty: 'hard', xp: 35,
    question: 'What data structure enables O(n) sliding window maximum?',
    options: ['Monotonic Deque', 'Min-Heap', 'Sorted Array', 'Hash Map'],
    answer: 0,
    explanation: 'A monotonic decreasing deque: front = current max, pop expired elements from front, pop smaller elements from back. O(n) total since each element is pushed/popped at most once.',
  },
  {
    id: 'que-q3', topicId: 'queues', type: 'fill', difficulty: 'easy', xp: 20,
    question: 'In a circular queue of capacity N, the rear index after enqueue is: (rear + 1) % ___',
    answer: 'N',
    caseSensitive: false,
    explanation: 'Modulo N wraps the index back to 0 when it reaches N, implementing the circular behavior.',
  },

  // ─── RECURSION ──────────────────────────────────────────────────────────
  {
    id: 'rec-q1', topicId: 'recursion', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'What are the THREE laws of recursion?',
    options: [
      'Must have base case; must change state toward base case; must call itself',
      'Must have loop; must have counter; must have return',
      'Must use stack; must have O(log n) depth; must be tail-recursive',
      'Must return void; must increment; must check boundary',
    ],
    answer: 0,
    explanation: 'The three laws: (1) Must have a base case — the stopping condition. (2) Must move toward the base case. (3) Must call itself recursively.',
  },
  {
    id: 'rec-q2', topicId: 'recursion', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'Fibonacci without memoization has what time complexity?',
    options: ['O(2ⁿ)', 'O(n)', 'O(n²)', 'O(n log n)'],
    answer: 0,
    explanation: 'fib(n) branches into fib(n-1) and fib(n-2), forming a binary tree of depth n → O(2ⁿ). With memoization, each unique n is computed once → O(n).',
  },
  {
    id: 'rec-q3', topicId: 'recursion', type: 'output', difficulty: 'medium', xp: 30,
    question: 'How many recursive calls does fib(5) make WITHOUT memoization?',
    code: `let calls = 0;
const fib = n => { calls++; return n<=1?n:fib(n-1)+fib(n-2); }
fib(5);
console.log(calls);`,
    options: ['15', '8', '5', '31'],
    answer: 0,
    explanation: 'fib(5) makes 15 total calls. The call tree has 2^(n+1)-1 nodes but many overlap. Count: fib(5)=1, fib(4)=1, fib(3)=2, fib(2)=3, fib(1)=4, fib(0)=4 → total 15.',
  },

  // ─── SORTING ────────────────────────────────────────────────────────────
  {
    id: 'srt-q1', topicId: 'sorting', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'What is the theoretical lower bound for comparison-based sorting?',
    options: ['Ω(n log n)', 'Ω(n)', 'Ω(n²)', 'Ω(log n)'],
    answer: 0,
    explanation: 'Ω(n log n) — proven by information theory: sorting n items requires distinguishing n! possible orderings, needing at least log₂(n!) ≈ n log n comparisons.',
  },
  {
    id: 'srt-q2', topicId: 'sorting', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'Which sort is NOT stable?',
    options: ['Quick Sort', 'Merge Sort', 'Insertion Sort', 'Bubble Sort'],
    answer: 0,
    explanation: "Quick Sort is NOT stable by default — equal elements may be swapped during partitioning. Merge Sort, Insertion Sort, and Bubble Sort maintain relative order of equal elements.",
  },
  {
    id: 'srt-q3', topicId: 'sorting', type: 'order', difficulty: 'medium', xp: 30,
    question: 'Order these sorts from BEST to WORST worst-case time complexity:',
    items: ['Merge Sort O(n log n)', 'Quick Sort O(n²)', 'Heap Sort O(n log n)', 'Bubble Sort O(n²)'],
    answer: [0, 2, 1, 3],
    explanation: 'Merge Sort and Heap Sort are both guaranteed O(n log n). Quick Sort degrades to O(n²) on bad pivots. Bubble Sort is always O(n²).',
  },
  {
    id: 'srt-q4', topicId: 'sorting', type: 'truefalse', difficulty: 'easy', xp: 15,
    question: 'Quick Sort\'s average case is O(n log n) but worst case is O(n²).',
    answer: true,
    explanation: 'True. Worst case occurs when pivot is always min/max (sorted input without randomization). Randomized pivot achieves O(n log n) expected with overwhelming probability.',
  },

  // ─── SEARCHING ──────────────────────────────────────────────────────────
  {
    id: 'src-q1', topicId: 'searching', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'Binary search on 1 billion items takes at most how many comparisons?',
    options: ['~30', '~1000', '~500 million', '~1 billion'],
    answer: 0,
    explanation: 'log₂(1,000,000,000) ≈ 30. Each step halves the search space. After 30 steps: 2³⁰ ≈ 1.07 billion > 1 billion. This is the power of O(log n).',
  },
  {
    id: 'src-q2', topicId: 'searching', type: 'mcq', difficulty: 'medium', xp: 25,
    question: '"Binary search on the ANSWER" is useful when you can efficiently check:',
    options: ['Is X feasible/sufficient?', 'Is X the minimum?', 'Is X sorted?', 'Is X prime?'],
    answer: 0,
    explanation: 'If you can check "Is X feasible?" in O(n), binary search the answer over [min, max] range for O(n log range) total. Classic: "minimum max-load", "ship in D days".',
  },
  {
    id: 'src-q3', topicId: 'searching', type: 'fill', difficulty: 'medium', xp: 25,
    question: 'To avoid integer overflow in binary search mid calculation, use: mid = lo + ((hi - lo) >> ___)',
    answer: '1',
    caseSensitive: false,
    explanation: '>> 1 is equivalent to integer division by 2. This avoids overflow that would occur with (lo+hi)/2 when lo+hi exceeds MAX_INT.',
  },

  // ─── DYNAMIC PROGRAMMING ────────────────────────────────────────────────
  {
    id: 'dp-q1', topicId: 'dp', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'What are the TWO required properties for a problem to be solvable with DP?',
    options: [
      'Optimal Substructure + Overlapping Subproblems',
      'Greedy Choice Property + Optimal Substructure',
      'Divide & Conquer + Memoization',
      'Monotonicity + Independence',
    ],
    answer: 0,
    explanation: 'DP requires: (1) Optimal Substructure — optimal solution built from optimal sub-solutions. (2) Overlapping Subproblems — same subproblems appear multiple times.',
  },
  {
    id: 'dp-q2', topicId: 'dp', type: 'truefalse', difficulty: 'medium', xp: 25,
    question: 'Top-down DP (memoization) and bottom-up DP (tabulation) always produce the same time complexity.',
    answer: true,
    explanation: 'Both solve each unique subproblem exactly once. The time complexity is O(number of unique states × cost per state). Space may differ slightly due to call stack overhead in top-down.',
  },
  {
    id: 'dp-q3', topicId: 'dp', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'What is the time complexity of 0/1 Knapsack DP?',
    options: ['O(n × W)', 'O(n log W)', 'O(2ⁿ)', 'O(n²)'],
    answer: 0,
    explanation: 'O(n × W) — n items × W capacity. Two nested loops: outer over items, inner over capacity. Space can be reduced to O(W) with rolling array.',
  },
  {
    id: 'dp-q4', topicId: 'dp', type: 'output', difficulty: 'hard', xp: 40,
    question: 'What does dp[5] equal after running coin change on [1,2,5] with amount=5?',
    code: `const coins = [1,2,5], amount = 5;
const dp = new Array(amount+1).fill(Infinity); dp[0] = 0;
for (let a=1; a<=amount; a++)
  for (const c of coins)
    if (c<=a) dp[a] = Math.min(dp[a], dp[a-c]+1);
console.log(dp[5]);`,
    options: ['1', '2', '3', '5'],
    answer: 0,
    explanation: 'dp[5] = 1: use one coin of value 5. dp[5] = min(dp[4]+1=2, dp[3]+1=2, dp[0]+1=1) = 1.',
  },

  // ─── HASH TABLES ────────────────────────────────────────────────────────
  {
    id: 'ht-q1', topicId: 'hash-tables', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'What is the average time complexity of hash table lookup?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 0,
    explanation: 'O(1) average with a good hash function and low load factor. Worst case is O(n) when all keys collide into the same bucket.',
  },
  {
    id: 'ht-q2', topicId: 'hash-tables', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'Java HashMap switches from chaining to _____ when a bucket has > 8 entries.',
    options: ['Red-Black Tree', 'AVL Tree', 'Sorted Array', 'Skip List'],
    answer: 0,
    explanation: 'Java 8+: when a bucket chain length exceeds 8, Java converts it to a Red-Black tree for O(log n) worst-case bucket operations instead of O(n).',
  },
  {
    id: 'ht-q3', topicId: 'hash-tables', type: 'truefalse', difficulty: 'easy', xp: 15,
    question: 'An LRU Cache can be implemented with O(1) get and put using a HashMap + doubly linked list.',
    answer: true,
    explanation: 'Yes — HashMap gives O(1) node lookup, doubly linked list gives O(1) move-to-front and removal. Python\'s OrderedDict does exactly this under the hood.',
  },

  // ─── TREES ──────────────────────────────────────────────────────────────
  {
    id: 'tre-q1', topicId: 'trees', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'Inorder traversal of a BST produces elements in what order?',
    options: ['Sorted ascending', 'Sorted descending', 'Random', 'Level-order'],
    answer: 0,
    explanation: 'BST inorder (Left → Root → Right) visits elements in sorted ascending order. This is why BSTs are powerful for sorted data operations.',
  },
  {
    id: 'tre-q2', topicId: 'trees', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'What is the time complexity of building a Segment Tree?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
    answer: 0,
    explanation: 'O(n) — mathematical proof: sum of nodes at all levels = n + n/2 + n/4 + ... = 2n → O(n). Queries and updates are O(log n).',
  },
  {
    id: 'tre-q3', topicId: 'trees', type: 'truefalse', difficulty: 'medium', xp: 25,
    question: 'An AVL tree guarantees O(log n) operations even in the worst case.',
    answer: true,
    explanation: 'AVL trees maintain height balance: |height(left) - height(right)| ≤ 1. This guarantees height ≤ 1.44 log n, so all operations are O(log n) worst case.',
  },
  {
    id: 'tre-q4', topicId: 'trees', type: 'order', difficulty: 'medium', xp: 30,
    question: 'Order these traversals for a tree with root=1, left=2, right=3:',
    items: ['Inorder: 2,1,3', 'Preorder: 1,2,3', 'Postorder: 2,3,1', 'Level-order: 1,2,3'],
    answer: [1, 0, 2, 3],
    explanation: 'Preorder (R,L,R): 1,2,3. Inorder (L,R,R): 2,1,3. Postorder (L,R,R): 2,3,1. Level-order (BFS): 1,2,3.',
  },

  // ─── GRAPHS ─────────────────────────────────────────────────────────────
  {
    id: 'grp-q1', topicId: 'graphs', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'What is the time complexity of BFS and DFS on a graph with V vertices and E edges?',
    options: ['O(V + E)', 'O(V × E)', 'O(V log E)', 'O(V²)'],
    answer: 0,
    explanation: 'Both BFS and DFS visit each vertex once (O(V)) and each edge once (O(E)), giving O(V + E). For dense graphs where E ≈ V², this is O(V²).',
  },
  {
    id: 'grp-q2', topicId: 'graphs', type: 'mcq', difficulty: 'medium', xp: 25,
    question: "Dijkstra's algorithm CANNOT handle:",
    options: ['Negative edge weights', 'Undirected graphs', 'Dense graphs', 'Large vertex counts'],
    answer: 0,
    explanation: "Dijkstra's greedy assumption breaks with negative weights — a path through a negative edge might be shorter than the already-settled shortest path. Use Bellman-Ford for negative weights.",
  },
  {
    id: 'grp-q3', topicId: 'graphs', type: 'truefalse', difficulty: 'medium', xp: 25,
    question: 'Topological sort only works on Directed Acyclic Graphs (DAGs).',
    answer: true,
    explanation: "True — topological sort requires a DAG. A cycle means there's no valid linear ordering (A must come before B and B must come before A). Kahn's algorithm detects cycles when not all nodes are processed.",
  },
  {
    id: 'grp-q4', topicId: 'graphs', type: 'fill', difficulty: 'medium', xp: 25,
    question: "Kahn's topological sort starts with all vertices whose in-degree is ___.",
    answer: '0',
    caseSensitive: false,
    explanation: "In-degree 0 means no prerequisites. Start by processing these vertices, then reduce neighbors' in-degrees. If any vertex reaches in-degree 0, enqueue it.",
  },

  // ─── BIG-O ──────────────────────────────────────────────────────────────
  {
    id: 'bigo-q1', topicId: 'big-o', type: 'order', difficulty: 'easy', xp: 25,
    question: 'Order these complexities from BEST (fastest) to WORST (slowest):',
    items: ['O(n!)', 'O(1)', 'O(n log n)', 'O(2ⁿ)'],
    answer: [1, 2, 3, 0],
    explanation: 'O(1) < O(n log n) < O(2ⁿ) < O(n!). Factorial grows faster than exponential: 10! = 3.6M vs 2¹⁰ = 1024.',
  },
  {
    id: 'bigo-q2', topicId: 'big-o', type: 'truefalse', difficulty: 'medium', xp: 25,
    question: 'O(3n + 100) simplifies to O(n).',
    answer: true,
    explanation: 'We drop constants (3) and lower-order terms (100). Big-O focuses on growth rate as n → ∞, so O(3n + 100) = O(n).',
  },
  {
    id: 'bigo-q3', topicId: 'big-o', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'A dynamic array (like JavaScript Array) has what amortized push complexity?',
    options: ['O(1) amortized', 'O(n) amortized', 'O(log n) amortized', 'O(1) worst case'],
    answer: 0,
    explanation: 'O(1) amortized — individual resize is O(n) but happens rarely (doubling). Over n pushes, total work = n + n/2 + n/4 + ... = 2n → O(1) per push amortized.',
  },
  {
    id: 'bigo-q4', topicId: 'big-o', type: 'mcq', difficulty: 'hard', xp: 35,
    question: "Master Theorem: T(n)=2T(n/2)+O(n) — which sort does this describe, and what's the complexity?",
    options: ['Merge Sort — O(n log n)', 'Quick Sort — O(n²)', 'Binary Search — O(log n)', 'Heap Sort — O(n)'],
    answer: 0,
    explanation: "a=2, b=2, f(n)=O(n), n^log_b(a)=n^1=n. f(n)=Θ(n^log_b(a)) → Case 2: O(n^k log n) = O(n log n). This is Merge Sort's recurrence.",
  },

  // ─── NEURAL NETWORKS ────────────────────────────────────────────────────
  {
    id: 'nn-q1', topicId: 'neural-nets', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'Why is ReLU preferred over Sigmoid in deep networks?',
    options: [
      'No vanishing gradient for positive inputs; computationally simple',
      'Bounded output prevents overflow',
      'Always differentiable',
      'Produces probabilities directly',
    ],
    answer: 0,
    explanation: 'Sigmoid saturates at 0 and 1, causing vanishing gradients in deep networks. ReLU max(0,x) has gradient=1 for positive inputs, avoiding this. Also just max() — very fast to compute.',
  },
  {
    id: 'nn-q2', topicId: 'neural-nets', type: 'truefalse', difficulty: 'medium', xp: 25,
    question: 'Batch Normalization normalizes activations to zero mean and unit variance, then applies learnable scale and shift.',
    answer: true,
    explanation: 'BatchNorm: normalize to μ=0, σ=1 per batch, then y = γ·x̂ + β where γ (scale) and β (shift) are learned. This allows the network to undo normalization if needed.',
  },
  {
    id: 'nn-q3', topicId: 'neural-nets', type: 'fill', difficulty: 'easy', xp: 20,
    question: 'The algorithm used to train neural networks by computing gradients layer-by-layer is called ___.',
    answer: 'backpropagation',
    caseSensitive: false,
    explanation: 'Backpropagation applies the chain rule to compute ∂L/∂W for each layer, flowing gradients backward from the loss through each layer to update weights.',
  },

  // ─── TRANSFORMERS ───────────────────────────────────────────────────────
  {
    id: 'tfm-q1', topicId: 'transformers', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'In attention, Q, K, V stand for:',
    options: ['Query, Key, Value', 'Quantize, Kernel, Vector', 'Quick, Kernel, Validation', 'Queue, Kind, Variable'],
    answer: 0,
    explanation: 'Q = what I\'m looking for, K = what I contain (others compare against me), V = what I contribute. Attention score = softmax(QKᵀ/√d_k) × V.',
  },
  {
    id: 'tfm-q2', topicId: 'transformers', type: 'truefalse', difficulty: 'medium', xp: 25,
    question: 'Transformers have no inherent notion of token position, so positional encodings must be added.',
    answer: true,
    explanation: "True — self-attention is permutation-equivariant (order-agnostic). Without positional encodings, 'The cat sat on the mat' and 'The mat sat on the cat' would produce the same representation.",
  },
  {
    id: 'tfm-q3', topicId: 'transformers', type: 'mcq', difficulty: 'hard', xp: 35,
    question: 'Self-attention complexity per layer is:',
    options: ['O(n²d)', 'O(nd²)', 'O(nd)', 'O(n²d²)'],
    answer: 0,
    explanation: 'O(n²d) — computing QKᵀ is n×d multiplied by d×n = n×n matrix (O(n²d)). This quadratic cost in sequence length n is why long-context models are expensive.',
  },

  // ─── ML BASICS ──────────────────────────────────────────────────────────
  {
    id: 'ml-q1', topicId: 'ml-basics', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'High bias (underfitting) means the model is:',
    options: ['Too simple to capture patterns', 'Memorizing training data', 'Overly complex', 'Using too many features'],
    answer: 0,
    explanation: 'High bias = underfitting. The model is too simple, missing important patterns. High variance = overfitting. Goal: sweet spot with low bias AND low variance.',
  },
  {
    id: 'ml-q2', topicId: 'ml-basics', type: 'fill', difficulty: 'medium', xp: 25,
    question: 'The gradient descent update rule is: θ ← θ - η___ where η is the learning rate.',
    answer: '∇L(θ)',
    caseSensitive: false,
    explanation: 'θ ← θ - η∇L(θ) — move parameters in the direction OPPOSITE to the gradient (which points uphill). η controls step size.',
  },
  {
    id: 'ml-q3', topicId: 'ml-basics', type: 'truefalse', difficulty: 'medium', xp: 25,
    question: 'L1 regularization (Lasso) tends to produce sparse weight vectors.',
    answer: true,
    explanation: 'L1 (|w|) drives small weights exactly to zero — sparse solutions. L2 (w²) shrinks weights but rarely zeros them. L1 is preferred when you believe many features are irrelevant.',
  },
  {
    id: 'ml-q4', topicId: 'ml-basics', type: 'mcq', difficulty: 'hard', xp: 35,
    question: 'Cross-entropy loss H(p,q) = -Σp log(q) is used for classification because:',
    options: [
      'It penalizes confident wrong predictions exponentially more',
      'It is always between 0 and 1',
      'It equals MSE for binary problems',
      'It is computationally cheapest',
    ],
    answer: 0,
    explanation: 'Cross-entropy: if true label p=1 but model predicts q≈0, loss → ∞. If model predicts correctly q≈1, loss → 0. This strongly penalizes confident wrong predictions, creating strong gradient signal for backprop.',
  },

  // ─── DATABASES ──────────────────────────────────────────────────────────
  {
    id: 'db-q1', topicId: 'databases', type: 'mcq', difficulty: 'easy', xp: 20,
    question: 'ACID stands for:',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Access, Control, Index, Data',
      'Async, Cache, Index, Deploy',
      'Array, Container, Index, Data',
    ],
    answer: 0,
    explanation: 'ACID: Atomicity (all-or-nothing), Consistency (valid state to valid state), Isolation (concurrent transactions appear serial), Durability (committed = persisted even after crash).',
  },
  {
    id: 'db-q2', topicId: 'databases', type: 'truefalse', difficulty: 'medium', xp: 25,
    question: 'A clustered index stores the actual data in B-tree order.',
    answer: true,
    explanation: 'A clustered index physically reorders the data rows by the indexed column. A table can have only ONE clustered index. Secondary (non-clustered) indexes store pointers to the actual row.',
  },
  {
    id: 'db-q3', topicId: 'databases', type: 'mcq', difficulty: 'hard', xp: 35,
    question: 'The CAP Theorem says distributed systems can guarantee at most:',
    options: ['2 of: Consistency, Availability, Partition Tolerance', 'All 3 simultaneously', '1 of the three', 'All 3 with eventual consistency'],
    answer: 0,
    explanation: 'CAP: you can only guarantee 2 of 3. CA (MySQL): no partition tolerance. CP (Zookeeper, HBase): may be unavailable during partition. AP (Cassandra, DynamoDB): may return stale data.',
  },

  // ─── OPERATING SYSTEMS ──────────────────────────────────────────────────
  {
    id: 'os-q1', topicId: 'operating-systems', type: 'mcq', difficulty: 'medium', xp: 25,
    question: 'Context switching between threads is faster than between processes because:',
    options: [
      'Threads share address space — no TLB flush needed',
      'Threads have smaller stack frames',
      'Threads run on GPUs',
      'Threads skip the OS scheduler',
    ],
    answer: 0,
    explanation: 'Process switch requires TLB flush (address space changes) which is expensive (~1000s of cycles). Thread switch within same process keeps TLB warm — only registers/stack need saving.',
  },
  {
    id: 'os-q2', topicId: 'operating-systems', type: 'truefalse', difficulty: 'easy', xp: 20,
    question: 'A page fault adds approximately 1-10ms of latency compared to a normal memory access.',
    answer: true,
    explanation: 'A page fault requires reading from disk (~1-10ms). A TLB hit is ~1ns. This 1 million× difference is why minimizing page faults is critical for performance.',
  },
  {
    id: 'os-q3', topicId: 'operating-systems', type: 'mcq', difficulty: 'hard', xp: 35,
    question: 'For deadlock to occur, all FOUR conditions must hold simultaneously. Which is NOT one of them?',
    options: ['Preemption', 'Mutual Exclusion', 'Hold and Wait', 'Circular Wait'],
    answer: 0,
    explanation: "The four Coffman conditions are: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. 'Preemption' alone is not a condition — it's 'NO preemption' that's required for deadlock.",
  },
];

export const getQuizzesByTopic = topicId => QUIZZES.filter(q => q.topicId === topicId);
export const getQuizById = id => QUIZZES.find(q => q.id === id);
export const QUIZ_TYPE_LABELS = {
  mcq: 'Multiple Choice',
  truefalse: 'True / False',
  fill: 'Fill in the Blank',
  output: 'Predict Output',
  order: 'Correct Order',
};
