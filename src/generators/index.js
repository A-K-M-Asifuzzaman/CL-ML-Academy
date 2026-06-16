/* ════════════════════════════════════════
   ALL ALGORITHM GENERATORS
   Each is a generator function that yields
   animation frames (state snapshots).
════════════════════════════════════════ */

// ── SORTING ─────────────────────────────
export function* genBubble(arr) {
  const a=[...arr],n=a.length,sorted=new Set();
  for(let i=0;i<n-1;i++){
    for(let j=0;j<n-i-1;j++){
      yield{arr:[...a],hi:[j,j+1],sw:null,sorted:[...sorted],msg:`Pass ${i+1}: compare a[${j}]=${a[j]} vs a[${j+1}]=${a[j+1]}`};
      if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];yield{arr:[...a],hi:null,sw:[j,j+1],sorted:[...sorted],msg:`Swap! ${a[j+1]} > ${a[j]}`};}
    }
    sorted.add(n-1-i);
  }
  sorted.add(0);
  yield{arr:[...a],sorted:[...Array(n).keys()],msg:'✅ Bubble Sort complete!',done:true};
}

export function* genSelection(arr) {
  const a=[...arr],n=a.length,sorted=new Set();
  for(let i=0;i<n-1;i++){
    let mi=i;
    yield{arr:[...a],scan:i,mi,sorted:[...sorted],msg:`Find minimum in [${i}..${n-1}]`};
    for(let j=i+1;j<n;j++){
      yield{arr:[...a],hi:[mi,j],mi,sorted:[...sorted],msg:`a[${j}]=${a[j]} vs min=${a[mi]}`};
      if(a[j]<a[mi]){mi=j;yield{arr:[...a],mi,sorted:[...sorted],msg:`New min=${a[mi]} at [${mi}]`};}
    }
    if(mi!==i){[a[i],a[mi]]=[a[mi],a[i]];yield{arr:[...a],sw:[i,mi],sorted:[...sorted],msg:`Swap min ${a[i]} → pos ${i}`};}
    sorted.add(i);
  }
  sorted.add(n-1);
  yield{arr:[...a],sorted:[...Array(n).keys()],msg:'✅ Selection Sort complete!',done:true};
}

export function* genInsertion(arr) {
  const a=[...arr],n=a.length;
  for(let i=1;i<n;i++){
    let j=i;
    yield{arr:[...a],key:j,sorted:[...Array(i).keys()],msg:`Insert a[${i}]=${a[i]}`};
    while(j>0&&a[j]<a[j-1]){
      yield{arr:[...a],key:j,hi:[j,j-1],msg:`${a[j]}<${a[j-1]}, shift right`};
      [a[j],a[j-1]]=[a[j-1],a[j]];j--;
    }
  }
  yield{arr:[...a],sorted:[...Array(n).keys()],msg:'✅ Insertion Sort complete!',done:true};
}

export function* genMerge(arr) {
  const steps=[];const a=[...arr];
  function mrg(l,m,r){
    const L=a.slice(l,m+1),R=a.slice(m+1,r+1);
    steps.push({arr:[...a],rng:[l,r],msg:`Merge [${l}..${m}] + [${m+1}..${r}]`});
    let i=0,j=0,k=l;
    while(i<L.length&&j<R.length){
      steps.push({arr:[...a],rng:[l,r],cmp:[l+i,m+1+j],msg:`${L[i]} ≤ ${R[j]}?`});
      a[k++]=L[i]<=R[j]?L[i++]:R[j++];
      steps.push({arr:[...a],rng:[l,r],msg:`Placed ${a[k-1]}`});
    }
    while(i<L.length){a[k++]=L[i++];steps.push({arr:[...a],rng:[l,r],msg:'Copy left remainder'});}
    while(j<R.length){a[k++]=R[j++];steps.push({arr:[...a],rng:[l,r],msg:'Copy right remainder'});}
  }
  function ms(l,r){
    if(l>=r)return;
    const m=(l+r)>>1;
    steps.push({arr:[...a],div:[l,m,r],msg:`Divide [${l}..${r}] → [${l}..${m}],[${m+1}..${r}]`});
    ms(l,m);ms(m+1,r);mrg(l,m,r);
  }
  ms(0,a.length-1);
  steps.push({arr:[...a],sorted:[...Array(a.length).keys()],msg:'✅ Merge Sort complete!',done:true});
  for(const s of steps)yield s;
}

export function* genQuick(arr) {
  const steps=[];const a=[...arr];
  function part(lo,hi){
    const piv=a[hi];let i=lo-1;
    steps.push({arr:[...a],piv:hi,rng:[lo,hi],msg:`Pivot=${piv}`});
    for(let j=lo;j<hi;j++){
      steps.push({arr:[...a],piv:hi,rng:[lo,hi],hi:[j],msg:`a[${j}]=${a[j]} ≤ pivot?`});
      if(a[j]<=piv){i++;if(i!==j){[a[i],a[j]]=[a[j],a[i]];steps.push({arr:[...a],sw:[i,j],rng:[lo,hi],msg:`Swap ${a[i]}↔${a[j]}`});}}
    }
    [a[i+1],a[hi]]=[a[hi],a[i+1]];
    steps.push({arr:[...a],placed:i+1,rng:[lo,hi],msg:`Pivot ${a[i+1]} placed at ${i+1}`});
    return i+1;
  }
  function qs(lo,hi){if(lo>=hi)return;const pi=part(lo,hi);qs(lo,pi-1);qs(pi+1,hi);}
  qs(0,a.length-1);
  steps.push({arr:[...a],sorted:[...Array(a.length).keys()],msg:'✅ Quick Sort complete!',done:true});
  for(const s of steps)yield s;
}

export function* genHeapSort(arr) {
  const a=[...arr],n=a.length,placed=new Set();
  function* sift(sz,i){
    let lg=i,l=2*i+1,r=2*i+2;
    if(l<sz&&a[l]>a[lg])lg=l;
    if(r<sz&&a[r]>a[lg])lg=r;
    if(lg!==i){
      yield{arr:[...a],hi:[i,lg],placed:[...placed],msg:`Heapify: swap ${a[i]}↔${a[lg]}`};
      [a[i],a[lg]]=[a[lg],a[i]];
      yield{arr:[...a],placed:[...placed],msg:'After swap'};
      yield* sift(sz,lg);
    }
  }
  for(let i=Math.floor(n/2)-1;i>=0;i--)yield* sift(n,i);
  yield{arr:[...a],placed:[...placed],msg:`Max-heap built! Root=${a[0]}`};
  for(let i=n-1;i>0;i--){
    [a[0],a[i]]=[a[i],a[0]];placed.add(i);
    yield{arr:[...a],sw:[0,i],placed:[...placed],msg:`Extract max=${a[i]} → pos ${i}`};
    yield* sift(i,0);
  }
  placed.add(0);
  yield{arr:[...a],sorted:[...Array(n).keys()],placed:[...placed],msg:'✅ Heap Sort complete!',done:true};
}

// ── SEARCHING ───────────────────────────
export function* genBinarySearch(arr, target) {
  const a=[...arr].sort((x,y)=>x-y);
  let lo=0,hi=a.length-1;
  yield{arr:a,lo,hi,mid:null,target,found:null,msg:`Binary Search for ${target}`};
  while(lo<=hi){
    const mid=(lo+hi)>>1;
    yield{arr:a,lo,hi,mid,target,found:null,msg:`mid=${mid}, a[mid]=${a[mid]}, range [${lo}..${hi}]`};
    if(a[mid]===target){yield{arr:a,lo,hi,mid,target,found:mid,msg:`🎉 Found ${target} at index ${mid}!`,done:true};return;}
    else if(a[mid]<target){lo=mid+1;yield{arr:a,lo,hi,mid,target,msg:`${a[mid]}<${target} → search RIGHT [${lo}..${hi}]`};}
    else{hi=mid-1;yield{arr:a,lo,hi,mid,target,msg:`${a[mid]}>${target} → search LEFT [${lo}..${hi}]`};}
  }
  yield{arr:a,found:-1,msg:`❌ ${target} not found`,done:true};
}

// ── GRAPHS ──────────────────────────────
export function* genBFS(adj, start, nc) {
  const vis=new Array(nc).fill(false),dist=new Array(nc).fill(-1),q=[start],order=[];
  vis[start]=true;dist[start]=0;
  yield{vis:[...vis],q:[...q],cur:null,order:[...order],dist:[...dist],edge:null,msg:`Start BFS from node ${start}`};
  while(q.length){
    const u=q.shift();order.push(u);
    yield{vis:[...vis],q:[...q],cur:u,order:[...order],dist:[...dist],edge:null,msg:`Visit node ${u} (dist=${dist[u]})`};
    for(const v of(adj[u]||[])){
      if(!vis[v]){vis[v]=true;dist[v]=dist[u]+1;q.push(v);
        yield{vis:[...vis],q:[...q],cur:u,order:[...order],dist:[...dist],edge:[u,v],msg:`Discover ${v} via ${u} (dist=${dist[v]})`};}
    }
  }
  yield{vis:[...vis],q:[],cur:null,order:[...order],dist:[...dist],msg:`✅ BFS done! Order: [${order.join('→')}]`,done:true};
}

export function* genDFS(adj, start, nc) {
  const vis=new Array(nc).fill(false),order=[],stk=[{n:start,p:null}];
  yield{vis:[...vis],stk:[start],cur:null,order:[...order],msg:`Start DFS from node ${start}`};
  while(stk.length){
    const{n:u,p}=stk.pop();
    if(vis[u])continue;
    vis[u]=true;order.push(u);
    yield{vis:[...vis],stk:stk.map(x=>x.n),cur:u,order:[...order],edge:p!=null?[p,u]:null,msg:`Visit node ${u}`};
    for(const v of[...(adj[u]||[])].reverse())if(!vis[v])stk.push({n:v,p:u});
  }
  yield{vis:[...vis],stk:[],cur:null,order:[...order],msg:`✅ DFS done! Order: [${order.join('→')}]`,done:true};
}

export function* genDijkstra(adjW, start, nc) {
  const dist=new Array(nc).fill(Infinity),vis=new Array(nc).fill(false);
  dist[start]=0;
  const pq=[[0,start]];
  yield{dist:[...dist],vis:[...vis],cur:null,edge:null,msg:`Dijkstra from node ${start}`};
  while(pq.length){
    pq.sort(([a],[b])=>a-b);
    const[d,u]=pq.shift();
    if(vis[u])continue;vis[u]=true;
    yield{dist:[...dist],vis:[...vis],cur:u,edge:null,msg:`Visit node ${u} (dist=${d})`};
    for(const[v,w]of(adjW[u]||[])){
      if(!vis[v]&&dist[u]+w<dist[v]){
        dist[v]=dist[u]+w;pq.push([dist[v],v]);
        yield{dist:[...dist],vis:[...vis],cur:u,edge:[u,v],msg:`Relax edge ${u}→${v}: dist[${v}]=${dist[v]}`};
      }
    }
  }
  yield{dist:[...dist],vis:[...vis],cur:null,msg:`✅ Done! Distances: [${dist.map(d=>d===Infinity?'∞':d).join(',')}]`,done:true};
}

export function* genKruskal(edges, nc) {
  const parent=Array.from({length:nc},(_,i)=>i),rank=new Array(nc).fill(0);
  const find=x=>{while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;};
  const union=(a,b)=>{const[pa,pb]=[find(a),find(b)];if(pa===pb)return false;if(rank[pa]<rank[pb])parent[pa]=pb;else if(rank[pa]>rank[pb])parent[pb]=pa;else{parent[pb]=pa;rank[pa]++;}return true;};
  const sorted=[...edges].sort((a,b)=>a[2]-b[2]);
  const mstEdges=[],rejected=[];let totalW=0;
  yield{edges,mstEdges:[],rejected:[],cur:null,totalW:0,msg:`Kruskal's: sort ${edges.length} edges by weight`};
  for(const[u,v,w]of sorted){
    yield{edges,mstEdges:[...mstEdges],rejected:[...rejected],cur:[u,v,w],totalW,msg:`Consider edge ${u}↔${v} (w=${w}): cycle check`};
    if(union(u,v)){mstEdges.push([u,v,w]);totalW+=w;yield{edges,mstEdges:[...mstEdges],rejected:[...rejected],cur:null,added:[u,v,w],totalW,msg:`✅ Added! MST weight: ${totalW}`};}
    else{rejected.push([u,v,w]);yield{edges,mstEdges:[...mstEdges],rejected:[...rejected],cur:null,rej:[u,v,w],totalW,msg:`❌ Rejected — creates cycle`};}
    if(mstEdges.length===nc-1)break;
  }
  yield{edges,mstEdges:[...mstEdges],rejected:[...rejected],totalW,msg:`✅ MST complete! Total weight: ${totalW}`,done:true};
}

// ── TREES ───────────────────────────────
export function insertBST(root, val, d=0) {
  if(!root)return{val,left:null,right:null,d};
  if(val<root.val)return{...root,left:insertBST(root.left,val,d+1)};
  if(val>root.val)return{...root,right:insertBST(root.right,val,d+1)};
  return root;
}

export function* genBSTInorder(root) {
  function* helper(node){
    if(!node)return;
    yield{type:'go-left',node:node.val,msg:`Go left from ${node.val}`};
    yield* helper(node.left);
    yield{type:'visit',node:node.val,msg:`Visit ${node.val}`};
    yield{type:'go-right',node:node.val,msg:`Go right from ${node.val}`};
    yield* helper(node.right);
  }
  yield* helper(root);
  yield{type:'done',msg:'✅ Inorder traversal complete!',done:true};
}

// ── LINKED LIST ─────────────────────────
export function* genLLTraversal(vals) {
  for(let i=0;i<vals.length;i++)
    yield{cur:i,vis:[...Array(i).keys()],msg:`Pointer at node[${i}] = ${vals[i]}`};
  yield{cur:null,vis:[...Array(vals.length).keys()],msg:'✅ Traversal complete → NULL',done:true};
}

// ── STACK / QUEUE ────────────────────────
export function* genStack(ops) {
  const stk=[];
  for(const op of ops){
    if(op.t==='push'){
      yield{stk:[...stk],op:'push',val:op.v,msg:`PUSH ${op.v}`};
      stk.push(op.v);
      yield{stk:[...stk],op:'pushed',val:op.v,msg:`Stack: [${stk.join(',')}] Top=${stk.at(-1)}`};
    }else{
      if(!stk.length){yield{stk:[...stk],op:'underflow',msg:'Underflow! Stack empty'};continue;}
      const v=stk.at(-1);
      yield{stk:[...stk],op:'pop',val:v,msg:`POP → removing ${v}`};
      stk.pop();
      yield{stk:[...stk],op:'popped',val:v,msg:`Stack: [${stk.join(',')}]`};
    }
  }
  yield{stk:[...stk],op:'done',msg:'✅ All operations done',done:true};
}

export function* genQueue(ops) {
  const q=[];
  for(const op of ops){
    if(op.t==='enq'){
      yield{q:[...q],op:'enq',val:op.v,msg:`ENQUEUE ${op.v} at rear`};
      q.push(op.v);
      yield{q:[...q],op:'enqd',val:op.v,msg:`Queue: [${q.join(',')}] Front=${q[0]}`};
    }else{
      if(!q.length){yield{q:[...q],op:'underflow',msg:'Queue empty!'};continue;}
      const v=q[0];
      yield{q:[...q],op:'deq',val:v,msg:`DEQUEUE → removing front ${v}`};
      q.shift();
      yield{q:[...q],op:'deqd',val:v,msg:`Queue: [${q.join(',')}]`};
    }
  }
  yield{q:[...q],op:'done',msg:'✅ All operations done',done:true};
}

// ── DYNAMIC PROGRAMMING ─────────────────
export function* genLCS(s1, s2) {
  const m=s1.length,n=s2.length;
  const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
  yield{dp:dp.map(r=>[...r]),i:null,j:null,msg:`LCS("${s1}","${s2}") — init ${m+1}×${n+1} table`};
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
    yield{dp:dp.map(r=>[...r]),i,j,msg:`dp[${i}][${j}]: '${s1[i-1]}' vs '${s2[j-1]}'`};
    if(s1[i-1]===s2[j-1]){dp[i][j]=dp[i-1][j-1]+1;yield{dp:dp.map(r=>[...r]),i,j,match:true,msg:`Match! dp[${i}][${j}]=${dp[i][j]}`};}
    else{dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);yield{dp:dp.map(r=>[...r]),i,j,match:false,msg:`No match. dp[${i}][${j}]=${dp[i][j]}`};}
  }
  yield{dp:dp.map(r=>[...r]),i:null,j:null,msg:`✅ LCS length = ${dp[m][n]}`,done:true,lcs:dp[m][n]};
}

// ── RECURSION ────────────────────────────
export function* genFib(n) {
  const stk=[];
  function* f(n,d=0){
    stk.push({n,d});
    yield{stk:[...stk],ret:null,d,n,msg:`fib(${n}) called — depth ${d+1}`};
    if(n<=1){yield{stk:[...stk],ret:n,d,n,base:true,msg:`Base: fib(${n})=${n}`};stk.pop();return n;}
    yield{stk:[...stk],d,n,msg:`fib(${n}) → fib(${n-1})+fib(${n-2})`};
    const l=yield* f(n-1,d+1),r=yield* f(n-2,d+1),res=l+r;
    yield{stk:[...stk],ret:res,d,n,msg:`fib(${n})=${l}+${r}=${res}`};
    stk.pop();return res;
  }
  yield* f(Math.min(n,6));
  yield{stk:[],msg:'✅ Recursion complete!',done:true};
}

// ── N-QUEENS BACKTRACKING ────────────────
export function* genNQueens(n) {
  const board=Array.from({length:n},()=>Array(n).fill(0));
  const safe=(r,c)=>{for(let i=0;i<r;i++){if(board[i][c])return false;if(c-(r-i)>=0&&board[i][c-(r-i)])return false;if(c+(r-i)<n&&board[i][c+(r-i)])return false;}return true;};
  function* place(row){
    if(row===n){yield{board:board.map(r=>[...r]),found:true,msg:`✅ Solution found!`,done:true};return;}
    for(let col=0;col<n;col++){
      yield{board:board.map(r=>[...r]),try:[row,col],msg:`Try queen at row ${row}, col ${col}`};
      if(safe(row,col)){board[row][col]=1;yield{board:board.map(r=>[...r]),placed:[row,col],msg:`Place queen at (${row},${col})`};
        yield* place(row+1);if(board[0].some((v,i)=>i===0?v:false)&&row===0)return;
        board[row][col]=0;yield{board:board.map(r=>[...r]),remove:[row,col],msg:`Backtrack! Remove from (${row},${col})`};}
    }
  }
  yield* place(0);
}

// ── SIEVE ────────────────────────────────
export function* genSieve(limit) {
  const sieve=new Array(limit+1).fill(true);sieve[0]=sieve[1]=false;
  const primes=[];
  yield{sieve:[...sieve],cur:null,primes:[],msg:`Sieve of Eratosthenes: find all primes ≤ ${limit}`};
  for(let p=2;p*p<=limit;p++){
    if(!sieve[p])continue;
    yield{sieve:[...sieve],cur:p,primes:[...primes],msg:`p=${p} is prime — mark multiples as composite`};
    for(let m=p*p;m<=limit;m+=p){
      if(sieve[m]){sieve[m]=false;yield{sieve:[...sieve],cur:p,marking:m,primes:[...primes],msg:`Mark ${m}=${p}×${m/p} composite`};}
    }
  }
  for(let i=2;i<=limit;i++)if(sieve[i])primes.push(i);
  yield{sieve:[...sieve],cur:null,primes:[...primes],msg:`✅ Found ${primes.length} primes`,done:true};
}

// ── CONVEX HULL ──────────────────────────
export function* genConvexHull(points) {
  const pts=[...points].sort((a,b)=>a.x-b.x||a.y-b.y);
  const cross=(O,A,B)=>(A.x-O.x)*(B.y-O.y)-(A.y-O.y)*(B.x-O.x);
  yield{points,hull:[],considering:null,phase:'start',msg:`Convex Hull: ${points.length} points`};
  const lower=[];
  for(const p of pts){
    while(lower.length>=2&&cross(lower.at(-2),lower.at(-1),p)<=0){lower.pop();yield{points,hull:[...lower],considering:p,phase:'lower',msg:`Remove last — left turn`};}
    lower.push(p);
    yield{points,hull:[...lower],considering:p,phase:'lower',msg:`Add (${p.x.toFixed(0)},${p.y.toFixed(0)}) to lower hull`};
  }
  const upper=[];
  for(let i=pts.length-1;i>=0;i--){
    const p=pts[i];
    while(upper.length>=2&&cross(upper.at(-2),upper.at(-1),p)<=0){upper.pop();yield{points,hull:[...lower,...upper],considering:p,phase:'upper',msg:`Remove`};}
    upper.push(p);
    yield{points,hull:[...lower,...upper],considering:p,phase:'upper',msg:`Add to upper hull`};
  }
  upper.pop();lower.pop();
  const hull=[...lower,...upper];
  yield{points,hull,considering:null,phase:'done',msg:`✅ Convex hull: ${hull.length} vertices`,done:true};
}

// ── LRU CACHE ────────────────────────────
export function* genLRU(capacity, ops) {
  const cache=new Map();
  yield{cache:[],capacity,op:null,msg:`LRU Cache (capacity=${capacity}): MRU at front`};
  for(const op of ops){
    if(op.type==='get'){
      if(cache.has(op.key)){
        const val=cache.get(op.key);cache.delete(op.key);cache.set(op.key,val);
        yield{cache:[...cache.entries()],capacity,op,hit:true,msg:`GET ${op.key} → ${val} ✅ HIT — moved to front`};
      }else{
        yield{cache:[...cache.entries()],capacity,op,hit:false,msg:`GET ${op.key} → -1 ❌ MISS`};
      }
    }else if(op.type==='put'){
      if(cache.has(op.key))cache.delete(op.key);
      else if(cache.size>=capacity){
        const evicted=cache.keys().next().value;cache.delete(evicted);
        yield{cache:[...cache.entries()],capacity,op,evicted,msg:`PUT ${op.key}=${op.val}: evict LRU "${evicted}"`};
      }
      cache.set(op.key,op.val);
      yield{cache:[...cache.entries()],capacity,op,msg:`PUT ${op.key}=${op.val} → stored at front`};
    }
  }
  yield{cache:[...cache.entries()],capacity,op:null,msg:'✅ All operations complete',done:true};
}

// ── GCD ──────────────────────────────────
export function* genGCD(a, b) {
  yield{a,b,step:0,msg:`GCD(${a},${b}) — Euclidean Algorithm`};
  let step=0;
  while(b!==0){
    const r=a%b,q=Math.floor(a/b);
    yield{a,b,r,q,step:++step,msg:`${a} = ${q}×${b} + ${r} → GCD(${a},${b})=GCD(${b},${r})`};
    a=b;b=r;
  }
  yield{a,b,gcd:a,step,msg:`✅ GCD = ${a}`,done:true};
}

// ── FENWICK TREE ─────────────────────────
export function* genFenwick(arr) {
  const n=arr.length;const bit=new Array(n+1).fill(0);
  const update=(i,delta)=>{for(let x=i;x<=n;x+=x&(-x))bit[x]+=delta;};
  const query=(i)=>{let s=0;for(let x=i;x>0;x-=x&(-x))s+=bit[x];return s;};
  yield{arr,bit:[...bit],phase:'build',i:null,msg:`Fenwick Tree: build from ${n} elements`};
  for(let i=0;i<n;i++){
    update(i+1,arr[i]);
    yield{arr,bit:[...bit],phase:'build',i,msg:`Add arr[${i}]=${arr[i]} via i+(i&-i) propagation`};
  }
  yield{arr,bit:[...bit],phase:'query',msg:'BIT built! Now query prefix sums O(log n)'};
  const queries=[[1,4],[2,6],[0,n-1]];
  for(const[l,r]of queries){
    const ans=query(r+1)-(l>0?query(l):0);
    yield{arr,bit:[...bit],phase:'query',ql:l,qr:r,ans,msg:`rangeSum(${l},${r}) = ${ans}`};
  }
  yield{arr,bit:[...bit],phase:'done',msg:'✅ Fenwick Tree operations complete!',done:true};
}

// ── TOPOLOGICAL SORT ─────────────────────
export function* genTopoSort(nodes, edges) {
  const adj=new Map(nodes.map(n=>[n,[]])),inDeg=new Map(nodes.map(n=>[n,0]));
  for(const[u,v]of edges){adj.get(u).push(v);inDeg.set(v,inDeg.get(v)+1);}
  const queue=nodes.filter(n=>inDeg.get(n)===0),result=[],processed=new Set();
  yield{inDeg:Object.fromEntries(inDeg),queue:[...queue],result:[...result],cur:null,edge:null,msg:`Init: in-degree 0 nodes → queue: [${queue.join(',')}]`};
  while(queue.length){
    const u=queue.shift();processed.add(u);result.push(u);
    yield{inDeg:Object.fromEntries(inDeg),queue:[...queue],result:[...result],cur:u,edge:null,processed:new Set(processed),msg:`Process ${u}`};
    for(const v of adj.get(u)||[]){
      inDeg.set(v,inDeg.get(v)-1);
      yield{inDeg:Object.fromEntries(inDeg),queue:[...queue],result:[...result],cur:u,edge:[u,v],processed:new Set(processed),msg:`Reduce in-degree of ${v}: now ${inDeg.get(v)}`};
      if(inDeg.get(v)===0){queue.push(v);yield{inDeg:Object.fromEntries(inDeg),queue:[...queue],result:[...result],cur:u,edge:[u,v],processed:new Set(processed),msg:`${v} in-degree=0 → enqueue`};}
    }
  }
  const hasCycle=result.length<nodes.length;
  yield{inDeg:Object.fromEntries(inDeg),queue:[],result:[...result],cur:null,processed:new Set(processed),msg:hasCycle?`❌ Cycle detected!`:`✅ Topological order: [${result.join('→')}]`,done:true,hasCycle};
}

// ── UNION FIND ───────────────────────────
export function* genUnionFind(ops, n) {
  const parent=Array.from({length:n},(_,i)=>i),rank=new Array(n).fill(0),size=new Array(n).fill(1);
  const find=x=>{const path=[];while(parent[x]!==x){path.push(x);x=parent[x];}for(const p of path)parent[p]=x;return x;};
  yield{parent:[...parent],rank:[...rank],size:[...size],op:null,msg:`Init: ${n} nodes, each its own component`};
  for(const op of ops){
    if(op.t==='union'){
      const[pa,pb]=[find(op.a),find(op.b)];
      yield{parent:[...parent],rank:[...rank],size:[...size],op,a:op.a,b:op.b,pa,pb,msg:`Union(${op.a},${op.b}): roots are ${pa} and ${pb}`};
      if(pa===pb){yield{parent:[...parent],rank:[...rank],size:[...size],op,msg:'Already connected!'};continue;}
      if(rank[pa]<rank[pb]){parent[pa]=pb;size[pb]+=size[pa];}
      else if(rank[pa]>rank[pb]){parent[pb]=pa;size[pa]+=size[pb];}
      else{parent[pb]=pa;rank[pa]++;size[pa]+=size[pb];}
      yield{parent:[...parent],rank:[...rank],size:[...size],op,msg:`Merged! Component size: ${Math.max(size[pa],size[pb])}`};
    }else if(op.t==='connected'){
      const[pa,pb]=[find(op.a),find(op.b)];
      yield{parent:[...parent],rank:[...rank],size:[...size],op,msg:`Connected(${op.a},${op.b}): ${pa===pb?'✅ YES':'❌ NO'}`};
    }
  }
  const components=new Set(Array.from({length:n},(_,i)=>find(i))).size;
  yield{parent:[...parent],rank:[...rank],size:[...size],msg:`✅ Done! ${n} nodes, ${components} components`,done:true};
}

// ── GRADIENT DESCENT ─────────────────────
export function* genGradientDescent(fn, grad, start, lr, steps) {
  let x=start;
  yield{x,fx:fn(x),grad:null,step:0,msg:`Start at x=${x.toFixed(3)}, f(x)=${fn(x).toFixed(4)}`};
  for(let i=1;i<=steps;i++){
    const g=grad(x);
    yield{x,fx:fn(x),grad:g,step:i,msg:`Step ${i}: gradient=${g.toFixed(4)}, x=${x.toFixed(3)}-${lr}×${g.toFixed(4)}`};
    x=x-lr*g;
    yield{x,fx:fn(x),grad:g,step:i,msg:`After step ${i}: x=${x.toFixed(4)}, f(x)=${fn(x).toFixed(6)}`};
    if(Math.abs(g)<1e-4){yield{x,fx:fn(x),grad:g,step:i,msg:`✅ Converged! x≈${x.toFixed(4)}`,done:true};return;}
  }
  yield{x,fx:fn(x),grad:grad(x),msg:`✅ Done! x=${x.toFixed(4)}, f(x)=${fn(x).toFixed(6)}`,done:true};
}

// ── BLOOM FILTER ─────────────────────────
export function* genBloomFilter(items, queries, m=24, hashes=3) {
  const bits=new Array(m).fill(0);
  const hashFns=Array.from({length:hashes},(_,seed)=>s=>{let h=seed*31;for(const c of s)h=(h*31+c.charCodeAt(0))%m;return((h%m)+m)%m;});
  yield{bits:[...bits],op:null,item:null,positions:[],msg:`Bloom Filter: m=${m} bits, k=${hashes} hash functions`};
  for(const item of items){
    const positions=hashFns.map(h=>h(item));
    yield{bits:[...bits],op:'insert',item,positions,msg:`Insert "${item}": hash → positions [${positions.join(',')}]`};
    positions.forEach(p=>{bits[p]=1;});
    yield{bits:[...bits],op:'inserted',item,positions,msg:`Set bits at [${positions.join(',')}]`};
  }
  for(const q of queries){
    const positions=hashFns.map(h=>h(q));
    const allSet=positions.every(p=>bits[p]===1);
    yield{bits:[...bits],op:'query',item:q,positions,result:allSet,msg:`Query "${q}": ${allSet?'MAYBE present ✓':'DEFINITELY NOT ✗'}`};
  }
  yield{bits:[...bits],op:'done',msg:'✅ Bloom filter demo complete!',done:true};
}

// ── K-MEANS ──────────────────────────────
export function* genKMeans(points, k) {
  const pts=[...points];
  let centroids=pts.slice(0,k).map(p=>({...p}));
  let labels=new Array(pts.length).fill(0);
  yield{pts,centroids:[...centroids],labels:[...labels],iter:0,msg:`Init ${k} centroids`};
  for(let it=0;it<12;it++){
    const newLabels=pts.map(p=>centroids.reduce((bi,c,i)=>{const d=Math.hypot(p.x-c.x,p.y-c.y);return d<Math.hypot(p.x-centroids[bi].x,p.y-centroids[bi].y)?i:bi;},0));
    yield{pts,centroids:[...centroids],labels:[...newLabels],iter:it+1,msg:'Assign points to nearest centroid'};
    const newCentroids=centroids.map((_,i)=>{const cl=pts.filter((_,j)=>newLabels[j]===i);return cl.length?{x:cl.reduce((s,p)=>s+p.x,0)/cl.length,y:cl.reduce((s,p)=>s+p.y,0)/cl.length}:centroids[i];});
    if(centroids.every((c,i)=>Math.hypot(c.x-newCentroids[i].x,c.y-newCentroids[i].y)<0.5)){
      yield{pts,centroids:newCentroids,labels:newLabels,iter:it+1,msg:'✅ Converged!',done:true};return;
    }
    yield{pts,centroids:newCentroids,labels:newLabels,iter:it+1,msg:`Update centroids (iteration ${it+1})`};
    centroids=newCentroids;labels=newLabels;
  }
  yield{pts,centroids,labels,msg:'✅ K-Means done!',done:true};
}
