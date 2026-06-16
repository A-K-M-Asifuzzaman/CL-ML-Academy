import { T } from '../theme.js';

export const CATEGORIES = [
  { id:'dsa',     label:'Core DSA',          color:T.cy,       icon:'◈', description:'Arrays, Strings, Linked Lists, Stacks, Queues, Recursion, Backtracking, Bit Manipulation' },
  { id:'algo',    label:'Algorithms',         color:T.gn,       icon:'⚙', description:'Sorting, Searching, Greedy, Divide & Conquer, Dynamic Programming, Sliding Window, Two Pointers' },
  { id:'ds',      label:'Data Structures',    color:T.pu,       icon:'◉', description:'Hash Tables, Trees, BST, AVL, Heaps, Graphs, Tries, Segment Trees, Fenwick Trees, Bloom Filters' },
  { id:'complex', label:'Complexity',         color:T.ye,       icon:'Ω', description:'Big-O, Time & Space Analysis, P vs NP, Amortized Analysis, Master Theorem' },
  { id:'sys',     label:'Systems',            color:T.or,       icon:'⊙', description:'Operating Systems, Concurrency, Memory Management, Distributed Systems, System Design' },
  { id:'net',     label:'Networks',           color:T.bl,       icon:'⊕', description:'OSI Model, TCP/IP, HTTP/HTTPS, DNS, Routing, Network Security' },
  { id:'db',      label:'Databases',          color:T.pk,       icon:'⊗', description:'SQL, NoSQL, Indexing, Normalization, Transactions, ACID, CAP Theorem' },
  { id:'math',    label:'Math for ML',        color:T.tl,       icon:'∑', description:'Linear Algebra, Probability, Statistics, Calculus, Optimization, Information Theory' },
  { id:'ml',      label:'Machine Learning',   color:T.rd,       icon:'◑', description:'Supervised, Unsupervised, RL, Decision Trees, SVM, K-Means, Model Evaluation' },
  { id:'dl',      label:'Deep Learning',      color:T.mg,       icon:'◎', description:'Neural Networks, CNN, RNN, LSTM, GANs, Diffusion Models, AVL, Fine-Tuning, LoRA' },
  { id:'nlp',     label:'NLP & LLMs',         color:'#ff9d40',  icon:'⊛', description:'Embeddings, Transformers, Attention, BERT, GPT, LLMs, Prompt Engineering, RAG' },
  { id:'cv',      label:'Computer Vision',    color:'#39ff9a',  icon:'⊡', description:'Image Processing, CNNs, Object Detection, Segmentation, ViT' },
  { id:'mlops',   label:'MLOps',              color:'#00ffd0',  icon:'⚡', description:'Docker, Kubernetes, CI/CD, Model Serving, Monitoring, Feature Stores' },
];

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id);
