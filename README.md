# 🧠 CS & ML Academy

> **The most comprehensive interactive computer science & machine learning learning platform.**
> From Arrays to LLMs — built for students who want to go beyond textbooks.

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Monaco](https://img.shields.io/badge/Monaco_Editor-IDE-007ACC?style=for-the-badge&logo=visual-studio-code)
![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## ✨ What Makes This Different

Most CS learning platforms give you static text. CS & ML Academy gives you:

| Feature | What You Get |
|---|---|
| **In-browser IDE** | Monaco Editor (VS Code engine) with a custom dark theme, syntax highlighting, and sandboxed execution |
| **Coding Challenges** | 25+ DSA/ML challenges with automated test runners, hints, and solution reveal |
| **Multi-type Quizzes** | MCQ · True/False · Fill-in-the-blank · Predict Output · Correct Order |
| **GSAP Animations** | Particle canvas, stagger entrances, XP bar animations, achievement toasts |
| **Gamification** | XP system, 10 levels (Novice → Fellow), 18 achievements, study streaks |
| **Progress Tracking** | Persistent across sessions via localStorage — bookmarks, notes, quiz scores |
| **Algorithm Visualizers** | 15 animated visualizers: sorting, graphs, neural networks, attention maps |
| **Roadmap** | Visual 5-phase learning path from beginner to ML engineer |
| **Big-O Reference** | Interactive complexity cheat sheet with live charts |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:3210
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── CodeEditor.jsx        # Monaco Editor + sandboxed iframe runner
│   ├── QuizBlock.jsx         # 5 quiz types with progress & explanations
│   ├── Navbar.jsx            # GSAP animated nav with XP chip & categories dropdown
│   ├── AchievementToast.jsx  # Slide-in achievement notifications
│   ├── UI.jsx                # SimControls, CodeBlock, Badge, PointCard
│   └── VizBlock.jsx          # Visualizer router (viz ID → component)
│
├── pages/
│   ├── HomePage.jsx          # Particle canvas, animated counters, daily challenge
│   ├── CategoryPage.jsx      # Topic listing per category
│   ├── TopicPage.jsx         # Content + Quiz + Challenges + Notes tabs
│   ├── PlaygroundPage.jsx    # Free-form coding with 8 presets + language selector
│   ├── ChallengePage.jsx     # Problem statement + IDE + automated test runner
│   ├── ChallengesPage.jsx    # Filterable/sortable challenge library
│   ├── DashboardPage.jsx     # XP progress, achievements, streak calendar
│   ├── SearchPage.jsx        # Full-text search across all topics
│   ├── RoadmapPage.jsx       # 5-phase structured learning roadmap
│   └── BigOPage.jsx          # Complexity reference with live chart
│
├── data/
│   ├── categories.js         # 13 topic categories with metadata
│   ├── topics.js             # 40+ topics with overview, points, code, complexity
│   ├── challenges.js         # 25+ coding challenges with test cases
│   └── quizzes.js            # 80+ quiz questions across 5 question types
│
├── hooks/
│   ├── useProgress.js        # XP, levels, achievements, streaks, localStorage
│   └── useSim.js             # Visualizer simulation engine (play/pause/seek)
│
├── context/
│   └── ProgressContext.jsx   # Global progress state (XP, achievements, notes)
│
├── visualizers/              # 15 interactive animated visualizers
│   ├── SortingViz.jsx        # Bubble/Selection/Insertion/Merge/Quick/Heap
│   ├── BSearchViz.jsx        # Binary search with LO/MID/HI markers
│   ├── LinkedListViz.jsx     # Node-by-node traversal animation
│   ├── StackViz.jsx          # Push/Pop with LIFO visualization
│   ├── QueueViz.jsx          # Enqueue/Dequeue with FIFO visualization
│   ├── RecursionViz.jsx      # Call stack visualization for fib(n)
│   ├── NQueensViz.jsx        # N-Queens backtracking on interactive board
│   ├── BSTViz.jsx            # BST insert + animated inorder traversal
│   ├── GraphViz.jsx          # BFS/DFS with live traversal order
│   ├── DPViz.jsx             # LCS DP table fill animation
│   ├── HashViz.jsx           # Hash table insert with bucket view
│   ├── BigOViz.jsx           # Complexity curve chart (O(1) → O(2^n))
│   ├── NeuralNetViz.jsx      # Live neural net with particle animation
│   ├── AttentionViz.jsx      # Transformer attention weights heatmap
│   └── GradDescentViz.jsx    # Gradient descent on selectable functions
│
├── generators/
│   └── index.js              # All algorithm generators (yield-based, step-by-step)
│
├── theme.js                  # Design tokens (colors, spacing)
└── index.css                 # Global styles, animations, utility classes
```

---

## 📚 Topics Covered (40+ and growing)

### Data Structures & Algorithms

| Category | Topics |
|---|---|
| **Core DS** | Arrays, Strings, Linked Lists, Stacks & Queues, Trees, Heaps, Hash Tables, Graphs, Tries, Fenwick Trees |
| **Algorithms** | Sorting (6 algorithms), Searching, Recursion, Dynamic Programming, Backtracking, Greedy, Bit Manipulation, Sliding Window, Two Pointers |
| **Complexity** | Big-O Analysis, Time/Space tradeoffs, Amortized Analysis |

### Machine Learning

| Category | Topics |
|---|---|
| **Foundations** | ML Fundamentals, Model Evaluation, Linear/Logistic Regression, Decision Trees, Ensemble Methods |
| **Deep Learning** | Neural Networks, CNNs, RNNs & LSTMs, Transformers & Attention |
| **Advanced** | Reinforcement Learning, Computer Vision, Embeddings & RAG |
| **Operations** | MLOps, Docker/Kubernetes, Model Serving, Experiment Tracking |

### Systems & Theory

| Category | Topics |
|---|---|
| **System Design** | Scalability, CAP Theorem, Caching, Database Sharding, Message Queues |
| **Distributed Systems** | Consensus (Raft/Paxos), Vector Clocks, Eventual Consistency, 2PC |
| **Concurrency** | Mutexes, Semaphores, Deadlock Prevention, Thread Pools, Async/Await |
| **Traditional Systems** | Operating Systems, Computer Networks, Databases |

### Math & NLP

| Category | Topics |
|---|---|
| **Math for ML** | Linear Algebra & PCA, Probability & Statistics, MLE/MAP, Information Theory |
| **NLP & LLMs** | Transformers, Word Embeddings (Word2Vec, GloVe, BERT), Sentence Transformers, RAG |

---

## 🔗 Routes

| Path | Page |
|---|---|
| `/` | Home — particle canvas, daily challenge, category grid |
| `/category/:catId` | All topics in a category |
| `/topic/:topicId` | Topic detail: content · quiz · challenges · notes tabs |
| `/challenges` | Filterable challenge library with stats |
| `/challenge/:id` | Problem + Monaco IDE + automated test runner |
| `/playground` | Free-form coding with 8 presets + console output |
| `/dashboard` | XP, level, achievements, streak calendar |
| `/search?q=...` | Full-text search across all topics |
| `/roadmap` | 5-phase structured learning path |
| `/bigo` | Big-O reference chart + complexity table |

---

## 🎮 Gamification System

### XP & Levels

| Level | Title | XP Required |
|---|---|---|
| 0 | Novice | 0 |
| 1 | Apprentice | 100 |
| 2 | Developer | 300 |
| 3 | Engineer | 700 |
| 4 | Architect | 1,500 |
| 5 | Principal | 3,000 |
| 6 | Staff | 5,000 |
| 7 | Distinguished | 7,500 |
| 8 | Emeritus | 10,000 |
| 9 | Fellow | — |

### XP Sources

| Action | XP Earned |
|---|---|
| Mark topic as read | +15 |
| Complete a quiz (easy) | +10 |
| Complete a quiz (medium) | +20 |
| Complete a quiz (hard) | +30 |
| Perfect quiz score bonus | +10 |
| Solve a challenge (easy) | +20 |
| Solve a challenge (medium) | +40 |
| Solve a challenge (hard) | +60 |
| Run code in playground | +2 (capped per day) |

### Achievements (18 total)

First Blood · Quiz Ace · Speed Demon · Problem Solver · Night Owl · Bookworm · Polyglot · Algorithm Master · ML Pioneer · Streak Warrior · Century Club · Perfectionist · Explorer · Grinder · Architect · Research Scholar · Full Stack Hero · Legend

---

## 🖥️ In-Browser Code Execution

Code runs in a **sandboxed iframe** — zero network access, zero DOM access to parent:

```
User Code
    │
    ▼
Sandboxed iframe (sandbox="allow-scripts")
    │  ├── Overrides console.log / console.error / console.warn
    │  ├── Wraps execution in try/catch with 5s timeout
    │  └── postMessage({ logs, error, returnValue }) → parent
    │
    ▼
Parent renders colored output (log=cyan, error=red, warn=orange)
```

Security guarantees:
- No `eval()` in the main window
- No access to parent DOM, cookies, or localStorage
- No network requests from user code
- Hard 5-second timeout kills infinite loops

---

## 🧩 Quiz Types

| Type | Description |
|---|---|
| **MCQ** | Multiple choice with 4 options |
| **True/False** | Binary judgment questions |
| **Fill-in-the-blank** | Type the answer, case-insensitive matching |
| **Predict Output** | Given a code snippet, what does it print? |
| **Correct Order** | Drag steps into the correct sequence |

Each quiz tracks score, XP earned, and shows per-question explanations.

---

## 🎬 Animation System (GSAP)

Key animations throughout the app:

| Component | Animation |
|---|---|
| Navbar | Slide down from top on mount |
| Home hero | Particle canvas with 60 nodes + connection lines |
| Category cards | Stagger entrance with `back.out(1.5)` ease |
| Animated counters | `gsap.to()` on numeric value |
| XP bar | `fromTo` width animation on dashboard |
| Achievement toast | Slide in from right, auto-dismiss at 3.5s |
| Challenge cards | Stagger entrance on filter change |
| Solve success | Cyan glow pulse on editor |
| Topic page | Fade-scale on mount, re-animate on tab change |

---

## ⚡ Performance

Vite manual chunk splitting keeps initial load fast:

| Chunk | Contents | Size (gzip) |
|---|---|---|
| `react-vendor` | react, react-dom, react-router-dom | ~140 KB |
| `monaco` | @monaco-editor/react, monaco-editor | ~200 KB (lazy) |
| `gsap` | gsap | ~30 KB |
| App code | Pages, data, components | ~80 KB |

Monaco is loaded on-demand — the home page never downloads it.

---

## 🎨 Design System

Custom cyber-punk dark palette defined in `src/theme.js`:

```js
T.bg  = '#060b14'  // Deep background
T.s1  = '#0a1020'  // Surface 1
T.s2  = '#0f1828'  // Surface 2
T.cy  = '#00e5ff'  // Cyan  — primary accent, links
T.gn  = '#39ff14'  // Green — success, correct
T.pk  = '#ff007c'  // Pink  — error, hot accent
T.or  = '#ff9d40'  // Orange — warning, medium difficulty
T.pu  = '#bf5fff'  // Purple — info, special
T.rd  = '#ff4444'  // Red   — danger, wrong
T.tl  = '#00d4d4'  // Teal  — secondary accent
T.bl  = '#4488ff'  // Blue  — links, info
```

CSS utilities: `.glass`, `.glow-cy/gn/pu/or`, `.neon-cy/gn/pu`, `.animated-gradient-text`, `.holo-card`, `.btn`, `.btn-primary`, `.skeleton`, `.card`

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework with hooks |
| Vite | 5 | Build tool with HMR and chunk splitting |
| React Router | v6 | Client-side routing |
| @monaco-editor/react | latest | VS Code's editor engine in-browser |
| GSAP | 3 | Professional animation library |
| CSS Custom Properties | — | Design system tokens |
| localStorage | — | Persistent progress (no backend needed) |

**Zero backend required.** Everything runs in the browser.

---

## 📦 Data Format Reference

### Adding a Topic (`src/data/topics.js`)

```js
{
  id: 'my-topic',
  cat: 'ds',              // ds | algo | ml | nlp | cv | sys | math
  title: 'My Topic',
  icon: '🎯',
  viz: 'none',            // or visualizer id (e.g. 'sorting', 'graph')
  color: '#00e5ff',
  tags: ['Tag1', 'Tag2'],
  overview: 'One paragraph summary...',
  points: [
    { t: 'Concept Title', d: 'Detailed explanation with complexity notes...' }
  ],
  complexity: 'Time: O(n log n) · Space: O(n)',
  code: `// Example implementation\nfunction example() {}`
}
```

### Adding a Challenge (`src/data/challenges.js`)

```js
{
  id: 'my-challenge',
  title: 'My Challenge',
  topicId: 'arrays',
  difficulty: 'medium',   // easy | medium | hard
  xp: 40,
  tags: ['Array', 'Two Pointer'],
  description: 'Problem statement with examples...',
  examples: [
    { input: '[1,2,3], target=5', output: '[0,2]', explanation: 'nums[0]+nums[2]=5' }
  ],
  constraints: ['1 ≤ n ≤ 10^4', 'Values are distinct'],
  hints: ['Try using a hash map', 'Think about complement values'],
  starter: `function twoSum(nums, target) {\n  // your code\n}`,
  testCases: [
    { input: [[2,7,11,15], 9], expected: [0,1] },
    { input: [[3,2,4], 6],     expected: [1,2] }
  ],
  comparator: 'sortedArray',   // optional: sortedArray | anagramGroups
  solutionCode: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map[comp] !== undefined) return [map[comp], i];
    map[nums[i]] = i;
  }
}`
}
```

### Adding a Quiz Question (`src/data/quizzes.js`)

```js
// MCQ
{
  id: 'q-arrays-1',
  topicId: 'arrays',
  type: 'mcq',            // mcq | truefalse | fill | output | order
  difficulty: 'medium',
  xp: 15,
  question: 'What is the time complexity of array access by index?',
  options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
  answer: 'O(1)',
  explanation: 'Arrays store elements at contiguous memory addresses. Given a base address and index, the target address = base + index × element_size — computed in constant time.'
}

// Predict Output
{
  id: 'q-js-output-1',
  topicId: 'arrays',
  type: 'output',
  difficulty: 'hard',
  xp: 25,
  question: 'What does this code print?',
  code: 'console.log([1,2,3].reduce((a,b) => a+b, 10));',
  options: ['6', '16', '10', 'Error'],
  answer: '16',
  explanation: 'reduce starts with accumulator=10, then adds 1+2+3=6, so 10+6=16.'
}
```

---

## 🗺️ Planned Features

- [ ] Python execution via Pyodide (WebAssembly)
- [ ] More language support in challenges (Java, C++)
- [ ] Interactive graph/tree visualizers for custom inputs
- [ ] Spaced repetition review system
- [ ] Social leaderboard — compare XP with peers
- [ ] AI-powered adaptive hints
- [ ] Mobile-first responsive redesign
- [ ] Offline PWA support

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/add-dp-challenge`
3. Follow the data format above for new topics/challenges/quizzes
4. Submit a PR with what you added and why

Good first contributions: adding quiz questions for existing topics, writing new challenge test cases, or documenting a CS concept not yet covered.

---

## 📄 License

MIT — free to use, fork, and build on. Attribution appreciated.

---

<div align="center">

**Built with passion for CS students worldwide**

*React 18 · Vite 5 · Monaco Editor · GSAP · Zero backend required*

</div>
