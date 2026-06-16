import { useState, useCallback, useRef, useEffect } from 'react';
import { T } from '../theme.js';
import CodeEditor, { runFreeformCode } from '../components/CodeEditor.jsx';
import { useProgressCtx } from '../context/ProgressContext.jsx';

// ── Responsive hook ────────────────────────────────────────────────────
function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' ? window.innerWidth < bp : false);
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return m;
}

// ── Language definitions ────────────────────────────────────────────────
const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript',  short: 'JS',    icon: '🟨', monacoLang: 'javascript', pistonLang: null,          pistonVer: null,     ext: 'js',    execMode: 'browser' },
  { value: 'typescript', label: 'TypeScript',  short: 'TS',    icon: '🟦', monacoLang: 'typescript', pistonLang: 'typescript',  pistonVer: '5.0.3',  ext: 'ts',    execMode: 'piston'  },
  { value: 'python',     label: 'Python',      short: 'Py',    icon: '🐍', monacoLang: 'python',     pistonLang: 'python',      pistonVer: '3.10.0', ext: 'py',    execMode: 'piston'  },
  { value: 'java',       label: 'Java',        short: 'Java',  icon: '☕', monacoLang: 'java',       pistonLang: 'java',        pistonVer: '15.0.2', ext: 'java',  execMode: 'piston'  },
  { value: 'cpp',        label: 'C++',         short: 'C++',   icon: '⚙️', monacoLang: 'cpp',        pistonLang: 'c++',         pistonVer: '10.2.0', ext: 'cpp',   execMode: 'piston'  },
  { value: 'c',          label: 'C',           short: 'C',     icon: '🔵', monacoLang: 'c',          pistonLang: 'c',           pistonVer: '10.2.0', ext: 'c',     execMode: 'piston'  },
  { value: 'csharp',     label: 'C#',          short: 'C#',    icon: '💜', monacoLang: 'csharp',     pistonLang: 'csharp',      pistonVer: '6.12.0', ext: 'cs',    execMode: 'piston'  },
  { value: 'go',         label: 'Go',          short: 'Go',    icon: '🩵', monacoLang: 'go',         pistonLang: 'go',          pistonVer: '1.16.2', ext: 'go',    execMode: 'piston'  },
  { value: 'rust',       label: 'Rust',        short: 'Rust',  icon: '🦀', monacoLang: 'rust',       pistonLang: 'rust',        pistonVer: '1.50.0', ext: 'rs',    execMode: 'piston'  },
  { value: 'kotlin',     label: 'Kotlin',      short: 'KT',    icon: '🟣', monacoLang: 'kotlin',     pistonLang: 'kotlin',      pistonVer: '1.6.20', ext: 'kt',    execMode: 'piston'  },
  { value: 'swift',      label: 'Swift',       short: 'Swift', icon: '🔶', monacoLang: 'swift',      pistonLang: 'swift',       pistonVer: '5.3.3',  ext: 'swift', execMode: 'piston'  },
  { value: 'ruby',       label: 'Ruby',        short: 'Ruby',  icon: '💎', monacoLang: 'ruby',       pistonLang: 'ruby',        pistonVer: '3.0.1',  ext: 'rb',    execMode: 'piston'  },
  { value: 'php',        label: 'PHP',         short: 'PHP',   icon: '🐘', monacoLang: 'php',        pistonLang: 'php',         pistonVer: '8.2.3',  ext: 'php',   execMode: 'piston'  },
  { value: 'perl',       label: 'Perl',        short: 'Perl',  icon: '🐪', monacoLang: 'perl',       pistonLang: 'perl',        pistonVer: '5.36.0', ext: 'pl',    execMode: 'piston'  },
  { value: 'lua',        label: 'Lua',         short: 'Lua',   icon: '🌙', monacoLang: 'lua',        pistonLang: 'lua',         pistonVer: '5.4.4',  ext: 'lua',   execMode: 'piston'  },
  { value: 'r',          label: 'R',           short: 'R',     icon: '📊', monacoLang: 'r',          pistonLang: 'r',           pistonVer: '4.1.1',  ext: 'r',     execMode: 'piston'  },
  { value: 'julia',      label: 'Julia',       short: 'Julia', icon: '🔴', monacoLang: 'julia',      pistonLang: 'julia',       pistonVer: '1.8.5',  ext: 'jl',    execMode: 'piston'  },
  { value: 'haskell',    label: 'Haskell',     short: 'HS',    icon: '🟪', monacoLang: 'haskell',    pistonLang: 'haskell',     pistonVer: '9.0.1',  ext: 'hs',    execMode: 'piston'  },
  { value: 'scala',      label: 'Scala',       short: 'Scala', icon: '🔺', monacoLang: 'scala',      pistonLang: 'scala',       pistonVer: '3.2.2',  ext: 'scala', execMode: 'piston'  },
  { value: 'elixir',     label: 'Elixir',      short: 'EX',    icon: '💧', monacoLang: 'elixir',     pistonLang: 'elixir',      pistonVer: '1.11.3', ext: 'ex',    execMode: 'piston'  },
  { value: 'clojure',    label: 'Clojure',     short: 'CLJ',   icon: '🟢', monacoLang: 'clojure',    pistonLang: 'clojure',     pistonVer: '1.10.3', ext: 'clj',   execMode: 'piston'  },
  { value: 'bash',       label: 'Bash',        short: 'SH',    icon: '🐚', monacoLang: 'shell',      pistonLang: 'bash',        pistonVer: '5.2.0',  ext: 'sh',    execMode: 'piston'  },
  { value: 'powershell', label: 'PowerShell',  short: 'PS',    icon: '🔷', monacoLang: 'powershell', pistonLang: 'powershell',  pistonVer: '7.1.4',  ext: 'ps1',   execMode: 'piston'  },
  { value: 'sql',        label: 'SQL',         short: 'SQL',   icon: '🗄️', monacoLang: 'sql',        pistonLang: null,          pistonVer: null,     ext: 'sql',   execMode: 'display' },
  { value: 'html',       label: 'HTML/CSS',    short: 'HTML',  icon: '🌐', monacoLang: 'html',       pistonLang: null,          pistonVer: null,     ext: 'html',  execMode: 'display' },
];

const LANG_MAP = Object.fromEntries(LANGUAGES.map(l => [l.value, l]));

const LANG_GROUPS = [
  { label: '⚡ Browser',       langs: ['javascript'] },
  { label: '🌐 Web',           langs: ['typescript', 'php', 'html', 'sql'] },
  { label: '🔥 Popular',       langs: ['python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust'] },
  { label: '📱 Mobile / JVM',  langs: ['kotlin', 'swift', 'scala'] },
  { label: '🧩 Scripting',     langs: ['ruby', 'perl', 'lua', 'bash', 'powershell', 'r', 'julia'] },
  { label: '🎓 Functional',    langs: ['haskell', 'elixir', 'clojure'] },
];

// ── Starter code templates ──────────────────────────────────────────────
const STARTERS = {
  javascript: `// JavaScript — runs instantly in your browser!
const greet = name => \`Hello, \${name}!\`;
console.log(greet("World"));

// Memoized Fibonacci
const fib = (n, memo = {}) =>
  n <= 1 ? n : (memo[n] ??= fib(n-1, memo) + fib(n-2, memo));
console.log("fib(10):", fib(10));
console.log("fib(40):", fib(40));`,

  typescript: `// TypeScript 5
interface Person { name: string; age: number; }
const greet = (p: Person): string => \`Hello \${p.name}, age \${p.age}\`;
console.log(greet({ name: "Alice", age: 30 }));

const fib = (n: number): number => n <= 1 ? n : fib(n-1) + fib(n-2);
console.log("fib(10):", fib(10));`,

  python: `# Python 3.10
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    return n if n <= 1 else fib(n-1) + fib(n-2)

print("Hello, World!")
print(f"fib(10) = {fib(10)}")
print(f"fib(40) = {fib(40)}")

squares = [x**2 for x in range(1, 11)]
print("Squares:", squares)

text = "hello world"
freq = {ch: text.count(ch) for ch in set(text) if ch != " "}
print("Char freq:", dict(sorted(freq.items())))`,

  java: `// Java 15
public class Main {
    static long fib(int n) {
        if (n <= 1) return n;
        long a = 0, b = 1;
        for (int i = 2; i <= n; i++) { long c = a+b; a = b; b = c; }
        return b;
    }

    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("fib(10) = " + fib(10));
        System.out.println("fib(40) = " + fib(40));

        int[] arr = {5, 3, 8, 1, 9, 2, 7};
        java.util.Arrays.sort(arr);
        System.out.print("Sorted: ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}`,

  cpp: `// C++ 17
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

long long fib(int n) {
    long long a = 0, b = 1;
    for (int i = 2; i <= n; i++) { long long c=a+b; a=b; b=c; }
    return n <= 1 ? n : b;
}

int main() {
    cout << "Hello, World!" << endl;
    cout << "fib(10) = " << fib(10) << endl;
    cout << "fib(40) = " << fib(40) << endl;
    vector<int> v = {5, 3, 8, 1, 9, 2, 7};
    sort(v.begin(), v.end());
    cout << "Sorted:";
    for (int x : v) cout << " " << x;
    cout << endl;
    return 0;
}`,

  c: `// C11
#include <stdio.h>

long long fib(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) { c=a+b; a=b; b=c; }
    return b;
}

int main() {
    printf("Hello, World!\\n");
    printf("fib(10) = %lld\\n", fib(10));
    printf("fib(40) = %lld\\n", fib(40));
    int arr[] = {5,3,8,1,9,2,7}, n=7;
    for (int i=0;i<n-1;i++)
        for (int j=0;j<n-i-1;j++)
            if(arr[j]>arr[j+1]){ int t=arr[j];arr[j]=arr[j+1];arr[j+1]=t; }
    printf("Sorted:");
    for (int i=0;i<n;i++) printf(" %d",arr[i]);
    printf("\\n");
    return 0;
}`,

  csharp: `// C# 10
using System;
using System.Linq;

class Program {
    static long Fib(int n) {
        long a=0,b=1;
        for(int i=2;i<=n;i++){long c=a+b;a=b;b=c;}
        return n<=1?n:b;
    }
    static void Main() {
        Console.WriteLine("Hello, World!");
        Console.WriteLine($"fib(10) = {Fib(10)}");
        Console.WriteLine($"fib(40) = {Fib(40)}");
        int[] arr={5,3,8,1,9,2,7};
        Array.Sort(arr);
        Console.WriteLine("Sorted: "+string.Join(" ",arr));
        Console.WriteLine("Evens: "+string.Join(", ",Enumerable.Range(1,10).Where(x=>x%2==0)));
    }
}`,

  go: `// Go 1.16
package main

import ("fmt"; "sort")

func fib(n int) int {
    if n <= 1 { return n }
    a, b := 0, 1
    for i := 2; i <= n; i++ { a, b = b, a+b }
    return b
}

func main() {
    fmt.Println("Hello, World!")
    fmt.Printf("fib(10) = %d\\n", fib(10))
    fmt.Printf("fib(40) = %d\\n", fib(40))
    arr := []int{5,3,8,1,9,2,7}
    sort.Ints(arr)
    fmt.Println("Sorted:", arr)
}`,

  rust: `// Rust 1.50
fn fib(n: u64) -> u64 {
    if n <= 1 { return n; }
    let (mut a, mut b) = (0u64, 1u64);
    for _ in 2..=n { let c=a+b; a=b; b=c; }
    b
}

fn main() {
    println!("Hello, World!");
    println!("fib(10) = {}", fib(10));
    println!("fib(40) = {}", fib(40));
    let mut v = vec![5, 3, 8, 1, 9, 2, 7];
    v.sort();
    println!("Sorted: {:?}", v);
    let sq: Vec<i32> = (1..=10).map(|x| x*x).collect();
    println!("Squares: {:?}", sq);
}`,

  kotlin: `// Kotlin 1.6
fun fib(n: Int): Long {
    var a = 0L; var b = 1L
    repeat(n) { val c = a+b; a=b; b=c }
    return a
}

fun main() {
    println("Hello, World!")
    println("fib(10) = \${fib(10)}")
    println("fib(40) = \${fib(40)}")
    println("Sorted: \${listOf(5,3,8,1,9,2,7).sorted()}")
    println("Squares: \${(1..10).map{it*it}}")
}`,

  swift: `// Swift 5.3
func fib(_ n: Int) -> Int {
    if n <= 1 { return n }
    var (a, b) = (0, 1)
    for _ in 2...n { (a, b) = (b, a+b) }
    return b
}
print("Hello, World!")
print("fib(10) =", fib(10))
print("fib(40) =", fib(40))
print("Sorted:", [5,3,8,1,9,2,7].sorted())
print("Squares:", (1...10).map { $0*$0 })`,

  ruby: `# Ruby 3.0
def fib(n)
  return n if n <= 1
  a, b = 0, 1
  (n-1).times { a, b = b, a+b }
  b
end
puts "Hello, World!"
puts "fib(10) = #{fib(10)}"
puts "fib(40) = #{fib(40)}"
puts "Sorted: #{[5,3,8,1,9,2,7].sort}"
puts "Squares: #{(1..10).map{|x| x**2}}"`,

  php: `<?php
// PHP 8.2
function fib(int $n): int {
    if ($n <= 1) return $n;
    $a = 0; $b = 1;
    for ($i=2;$i<=$n;$i++){$c=$a+$b;$a=$b;$b=$c;}
    return $b;
}
echo "Hello, World!\\n";
echo "fib(10) = ".fib(10)."\\n";
echo "fib(40) = ".fib(40)."\\n";
$arr=[5,3,8,1,9,2,7]; sort($arr);
echo "Sorted: ".implode(" ",$arr)."\\n";
echo "Squares: ".implode(", ",array_map(fn($x)=>$x*$x,range(1,10)))."\\n";
?>`,

  perl: `#!/usr/bin/perl
use strict; use warnings;
sub fib {
    my($n)=@_; return $n if $n<=1;
    my($a,$b)=(0,1);
    ($a,$b)=($b,$a+$b) for 2..$n; $b
}
print "Hello, World!\\n";
print "fib(10) = ".fib(10)."\\n";
print "fib(40) = ".fib(40)."\\n";
my @s=sort{$a<=>$b}(5,3,8,1,9,2,7);
print "Sorted: @s\\n";`,

  lua: `-- Lua 5.4
function fib(n)
  if n<=1 then return n end
  local a,b=0,1
  for i=2,n do a,b=b,a+b end
  return b
end
print("Hello, World!")
print("fib(10) =",fib(10))
print("fib(40) =",fib(40))
local t={5,3,8,1,9,2,7}
table.sort(t)
print("Sorted:",table.concat(t," "))`,

  r: `# R 4.1
fib <- function(n) {
  if(n<=1) return(n)
  a<-0; b<-1
  for(i in 2:n){c<-a+b;a<-b;b<-c}; b
}
cat("Hello, World!\\n")
cat("fib(10) =",fib(10),"\\n")
cat("fib(40) =",fib(40),"\\n")
cat("Sorted:",sort(c(5,3,8,1,9,2,7)),"\\n")
cat("Mean:",mean(c(2,4,4,5,5,7,9)),"SD:",round(sd(c(2,4,4,5,5,7,9)),3),"\\n")`,

  julia: `# Julia 1.8
function fib(n::Int)
  n<=1 && return n
  a,b=0,1
  for _ in 2:n; a,b=b,a+b; end; b
end
println("Hello, World!")
println("fib(10) = ", fib(10))
println("fib(40) = ", fib(40))
println("Sorted: ", sort([5,3,8,1,9,2,7]))
println("Squares: ", collect(map(x->x^2, 1:10)))`,

  haskell: `-- Haskell 9.0
module Main where
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

main :: IO ()
main = do
  putStrLn "Hello, World!"
  putStrLn $ "fib 10 = " ++ show (fibs !! 10)
  putStrLn $ "fib 40 = " ++ show (fibs !! 40)
  putStrLn $ "Squares: " ++ show (map(^2)[1..10])`,

  scala: `// Scala 3.2
@main def run(): Unit =
  def fib(n:Int):Long=
    def go(a:Long,b:Long,i:Int):Long=if i==0 then a else go(b,a+b,i-1)
    go(0,1,n)
  println("Hello, World!")
  println(s"fib(10) = \${fib(10)}")
  println(s"fib(40) = \${fib(40)}")
  println(s"Sorted: \${List(5,3,8,1,9,2,7).sorted}")
  println(s"Squares: \${(1 to 10).map(x=>x*x).toList}")`,

  elixir: `# Elixir 1.11
defmodule Main do
  def fib(0),do: 0
  def fib(1),do: 1
  def fib(n),do: fib(n-1)+fib(n-2)
  def run do
    IO.puts "Hello, World!"
    IO.puts "fib(10) = \#{fib(10)}"
    IO.puts "fib(20) = \#{fib(20)}"
    IO.puts "Sorted: \#{inspect(Enum.sort([5,3,8,1,9,2,7]))}"
    IO.puts "Squares: \#{inspect(Enum.map(1..10,&(&1*&1)))}"
  end
end
Main.run()`,

  clojure: `; Clojure 1.10
(defn fib[n](loop[a 0 b 1 i n](if(zero? i)a(recur b(+a b)(dec i)))))
(println "Hello, World!")
(println "fib(10) ="(fib 10))
(println "fib(40) ="(fib 40))
(println "Sorted:"(sort[5 3 8 1 9 2 7]))
(println "Squares:"(map #(* % %)(range 1 11)))`,

  bash: `#!/bin/bash
echo "Hello, World!"
fib(){
  local n=$1; [ $n -le 1 ] && echo $n && return
  local a=0 b=1
  for((i=2;i<=n;i++));do local c=$((a+b));a=$b;b=$c;done; echo $b
}
echo "fib(10) = $(fib 10)"
echo "fib(20) = $(fib 20)"
arr=(5 3 8 1 9 2 7)
sorted=($(printf '%s\n' "\${arr[@]}"|sort -n))
echo "Sorted: \${sorted[@]}"
echo "Date: $(date)"`,

  powershell: `# PowerShell 7
function Get-Fib([int]$n){
  $a,$b=0,1
  for($i=2;$i-le$n;$i++){$c=$a+$b;$a=$b;$b=$c}
  if($n-le 1){$n}else{$b}
}
Write-Host "Hello, World!"
Write-Host "fib(10) = $(Get-Fib 10)"
Write-Host "fib(40) = $(Get-Fib 40)"
$s=@(5,3,8,1,9,2,7)|Sort-Object
Write-Host "Sorted: $s"`,

  sql: `-- SQL (syntax highlight — no execution)
CREATE TABLE students (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(100) NOT NULL,
  score DECIMAL(5,2),
  grade CHAR(1)
);
INSERT INTO students(name,score,grade)VALUES
  ('Alice',95.5,'A'),('Bob',82.0,'B'),
  ('Carol',91.3,'A'),('Dave',74.8,'C');

-- Window functions
SELECT name, score,
  RANK() OVER (ORDER BY score DESC) AS rank,
  AVG(score) OVER () AS class_avg
FROM students;

SELECT grade, COUNT(*) AS cnt, AVG(score) AS avg
FROM students GROUP BY grade ORDER BY avg DESC;`,

  html: `<!-- HTML/CSS (display only) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
  <style>
    body{font-family:sans-serif;background:#0d1117;color:#e6edf3;padding:2rem;}
    h1{color:#58a6ff;}
    .card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:1rem;margin:1rem 0;}
    button{background:#238636;color:white;border:none;padding:.5rem 1rem;border-radius:6px;cursor:pointer;}
  </style>
</head>
<body>
  <h1>🧠 CS & ML Academy</h1>
  <div class="card">
    <h3>Welcome!</h3>
    <p>Sample HTML/CSS dark-theme layout.</p>
    <button onclick="alert('Hello!')">Click Me</button>
  </div>
</body>
</html>`,
};

// ── JS quick snippets ───────────────────────────────────────────────────
const JS_SNIPPETS = [
  { label: 'Hello World',  code: STARTERS.javascript },
  { label: 'Sort Algos',   code: `const bubble=a=>{const r=[...a];for(let i=0;i<r.length-1;i++)for(let j=0;j<r.length-i-1;j++)if(r[j]>r[j+1])[r[j],r[j+1]]=[r[j+1],r[j]];return r;};
const merge=a=>{if(a.length<=1)return a;const m=a.length>>1,L=merge(a.slice(0,m)),R=merge(a.slice(m)),res=[];let i=0,j=0;while(i<L.length&&j<R.length)res.push(L[i]<=R[j]?L[i++]:R[j++]);return[...res,...L.slice(i),...R.slice(j)];};
const arr=[64,34,25,12,22,11,90];
console.log("Original:", JSON.stringify(arr));
console.log("Bubble  :", JSON.stringify(bubble(arr)));
console.log("Merge   :", JSON.stringify(merge(arr)));` },
  { label: 'Binary Search', code: `const bs=(a,t)=>{let lo=0,hi=a.length-1;while(lo<=hi){const m=lo+((hi-lo)>>1);if(a[m]===t)return m;a[m]<t?lo=m+1:hi=m-1;}return-1;};
const N=1_000_000,a=Array.from({length:N},(_,i)=>i*2),t=999_998;
const t1=performance.now(),r1=bs(a,t),t2=performance.now(),r2=a.indexOf(t),t3=performance.now();
console.log(\`N = \${N.toLocaleString()} elements\`);
console.log(\`Binary: idx \${r1} in \${(t2-t1).toFixed(3)}ms\`);
console.log(\`Linear: idx \${r2} in \${(t3-t2).toFixed(3)}ms\`);` },
  { label: 'BFS / DFS',   code: `const g={0:[1,2],1:[0,3,4],2:[0,5],3:[1],4:[1,5],5:[2,4]};
const bfs=(g,s)=>{const v=new Set([s]),q=[s],o=[];while(q.length){const n=q.shift();o.push(n);for(const nb of g[n])if(!v.has(nb)){v.add(nb);q.push(nb);}}return o;};
const dfs=(g,s,v=new Set())=>{v.add(s);const o=[s];for(const nb of g[s])if(!v.has(nb))o.push(...dfs(g,nb,v));return o;};
console.log("BFS:", bfs(g,0).join(' → '));
console.log("DFS:", dfs(g,0).join(' → '));` },
  { label: 'DP Knapsack', code: `const knapsack=(w,v,C)=>{const n=w.length,dp=Array.from({length:n+1},()=>new Array(C+1).fill(0));for(let i=1;i<=n;i++)for(let c=0;c<=C;c++)dp[i][c]=w[i-1]<=c?Math.max(dp[i-1][c],dp[i-1][c-w[i-1]]+v[i-1]):dp[i-1][c];return dp[n][C];};
console.log("Knapsack max value:", knapsack([2,3,4,5,1,2],[3,4,5,6,1,2],10));` },
  { label: 'XOR Net',     code: `const sig=x=>1/(1+Math.exp(-x)),relu=x=>Math.max(0,x);
const mv=(M,v)=>M.map(r=>r.reduce((s,w,i)=>s+w*v[i],0));
class L{constructor(W,b,a=relu){this.W=W;this.b=b;this.a=a;}f(x){return mv(this.W,x).map((v,i)=>this.a(v+this.b[i]));}}
const l1=new L([[1,-1],[1,-1]],[0,-1]),l2=new L([[1,1]],[-1],sig);
[[0,0],[0,1],[1,0],[1,1]].forEach(i=>{const o=l2.f(l1.f(i));console.log(\`[\${i}]→\${o[0].toFixed(4)} (exp \${i[0]^i[1]})\`);});` },
  { label: 'Benchmark',   code: `const t=f=>{const s=performance.now();f();return(performance.now()-s).toFixed(3)+'ms';};
const n=100000,a=Array.from({length:n},()=>Math.random()*n|0);
console.log('n =',n.toLocaleString());
console.log('sort  :', t(()=>[...a].sort((a,b)=>a-b)));
console.log('filter:', t(()=>a.filter(x=>x%2===0)));
console.log('reduce:', t(()=>a.reduce((s,x)=>s+x,0)));
console.log('map   :', t(()=>a.map(x=>x*2)));` },
];

// ── Piston API ──────────────────────────────────────────────────────────
const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';
async function runWithPiston(ld, code) {
  const res = await fetch(PISTON_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: ld.pistonLang, version: ld.pistonVer, files: [{ name: `main.${ld.ext}`, content: code }], stdin: '', args: [] }),
  });
  if (!res.ok) throw new Error(`Piston ${res.status}`);
  return res.json();
}

const LC = { log: T.t1, error: T.rd, warn: T.or, info: T.cy, system: T.t3 };

// ── Component ────────────────────────────────────────────────────────────
export default function PlaygroundPage() {
  const isMobile  = useIsMobile(768);
  const [lang,     setLang]     = useState('javascript');
  const [code,     setCode]     = useState(STARTERS.javascript);
  const [output,   setOutput]   = useState([]);
  const [running,  setRunning]  = useState(false);
  const [elapsed,  setElapsed]  = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const { recordPlaygroundRun } = useProgressCtx();
  const t0 = useRef(null);

  const cur = LANG_MAP[lang];

  const changeLang = v => {
    setLang(v); setCode(STARTERS[v] || `// ${v}`);
    setOutput([]); setElapsed(null); setLangOpen(false);
  };

  const run = useCallback(async () => {
    if (cur.execMode === 'display') {
      setOutput([{ kind: 'system', text: `${cur.label} is for display/editing only — no execution available.` }]);
      return;
    }
    setRunning(true);
    setOutput([{ kind: 'system', text: `▶ Running ${cur.label}…` }]);
    t0.current = performance.now();

    try {
      if (cur.execMode === 'browser') {
        const result = await runFreeformCode(code);
        const ms = (performance.now() - t0.current).toFixed(1);
        setElapsed(ms);
        const logs = result.logs.length ? result.logs : [{ kind: 'log', text: '(no output)' }];
        if (result.error && !result.logs.find(l => l.kind === 'error')) logs.push({ kind: 'error', text: result.error });
        setOutput(logs);
        recordPlaygroundRun?.();
      } else {
        const data = await runWithPiston(cur, code);
        const ms = (performance.now() - t0.current).toFixed(0);
        setElapsed(ms);
        const lines = [];
        if (data.compile?.stderr) lines.push({ kind: 'error', text: '── Compile Error ──\n' + data.compile.stderr.trim() });
        if (data.compile?.output) lines.push({ kind: 'warn',  text: '── Compile Output ──\n' + data.compile.output.trim() });
        const out = (data.run?.stdout || '').trim();
        const err = (data.run?.stderr || '').trim();
        if (out) out.split('\n').forEach(l => lines.push({ kind: 'log',   text: l }));
        if (err) err.split('\n').forEach(l => lines.push({ kind: 'error', text: l }));
        if (!out && !err && !data.compile?.stderr) lines.push({ kind: 'system', text: '(no output)' });
        if (data.run?.signal) lines.push({ kind: 'warn', text: `Signal: ${data.run.signal}` });
        setOutput(lines);
        recordPlaygroundRun?.();
      }
    } catch (e) {
      setElapsed(null);
      setOutput([{ kind: 'error', text: `Error: ${e.message}\n\n(Piston API requires internet access)` }]);
    } finally {
      setRunning(false);
    }
  }, [code, cur, recordPlaygroundRun]);

  const clear = () => { setOutput([]); setElapsed(null); };
  const onKeyDown = e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }};

  const hasErrors  = output.some(l => l.kind === 'error');
  const editorH    = isMobile ? '300px' : '520px';
  const outputMaxH = isMobile ? '220px' : '440px';

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 12px 60px' : '0 20px 60px' }} onKeyDown={onKeyDown}>

      {/* ── Header ── */}
      <div style={{ padding: isMobile ? '14px 0 10px' : '24px 0 14px' }}>
        <div style={{ fontSize: 10, color: T.cy, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Interactive</div>
        <h1 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, color: T.t0, margin: '0 0 5px' }}>Code Playground</h1>
        <p style={{ color: T.t2, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
          {LANGUAGES.length} languages · JS runs in-browser · others via <span style={{ color: T.cy }}>Piston API</span>
          {!isMobile && <> · <kbd style={{ background: T.s2, border: `1px solid ${T.bd}`, borderRadius: 4, padding: '1px 5px', fontSize: 10, color: T.cy }}>⌘+Enter</kbd> to run</>}
        </p>
      </div>

      {/* ── Language selector ── */}
      {isMobile ? (
        <div style={{ marginBottom: 12 }}>
          {/* Current language button */}
          <button onClick={() => setLangOpen(o => !o)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 12, border: `1px solid ${langOpen ? T.cy : T.bd}`, background: T.s1, color: T.t0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }}>
            <span style={{ fontSize: 18 }}>{cur.icon}</span>
            <span style={{ fontWeight: 600 }}>{cur.label}</span>
            {cur.execMode === 'browser'  && <span style={{ fontSize: 10, color: T.gn, background: T.gn+'18', padding: '2px 7px', borderRadius: 8 }}>⚡ Instant</span>}
            {cur.execMode === 'display'  && <span style={{ fontSize: 10, color: T.t3, background: T.s3, padding: '2px 7px', borderRadius: 8 }}>View only</span>}
            {cur.execMode === 'piston'   && <span style={{ fontSize: 10, color: T.cy, background: T.cy+'12', padding: '2px 7px', borderRadius: 8 }}>🌐 API</span>}
            <span style={{ marginLeft: 'auto', color: T.t3, fontSize: 13 }}>{langOpen ? '▲' : '▼'}</span>
          </button>

          {/* Dropdown list */}
          {langOpen && (
            <div style={{ marginTop: 4, background: T.s1, border: `1px solid ${T.bd}`, borderRadius: 12, overflow: 'hidden', maxHeight: '65vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.7)' }}>
              {LANG_GROUPS.map(group => (
                <div key={group.label}>
                  <div style={{ padding: '8px 14px 4px', fontSize: 10, color: T.t3, textTransform: 'uppercase', letterSpacing: 1, background: T.s2, position: 'sticky', top: 0 }}>{group.label}</div>
                  {group.langs.map(lv => {
                    const ld = LANG_MAP[lv];
                    const active = lang === lv;
                    return (
                      <button key={lv} onClick={() => changeLang(lv)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', border: 'none', borderBottom: `1px solid ${T.bd}20`, background: active ? T.cy+'18' : 'transparent', color: active ? T.cy : T.t1, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, textAlign: 'left' }}>
                        <span style={{ fontSize: 18 }}>{ld.icon}</span>
                        <span style={{ fontWeight: active ? 700 : 400 }}>{ld.label}</span>
                        {ld.execMode === 'browser' && <span style={{ fontSize: 9, color: T.gn }}>⚡</span>}
                        {ld.execMode === 'display' && <span style={{ fontSize: 9, color: T.t3 }}>view</span>}
                        {active && <span style={{ marginLeft: 'auto', color: T.cy }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Desktop grouped pills */
        <div style={{ marginBottom: 14, background: T.s1, border: `1px solid ${T.bd}`, borderRadius: 12, padding: '12px 16px' }}>
          <div style={{ fontSize: 10, color: T.t3, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Select Language</div>
          {LANG_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: T.t3, marginBottom: 5 }}>{group.label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {group.langs.map(lv => {
                  const ld = LANG_MAP[lv];
                  const active = lang === lv;
                  const ac = ld.execMode === 'browser' ? T.ye : T.cy;
                  return (
                    <button key={lv} onClick={() => changeLang(lv)}
                      style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, transition: 'all .12s',
                        background: active ? ac+'20' : T.s2,
                        border: `1px solid ${active ? ac+'55' : T.bd}`,
                        color: active ? ac : T.t2, fontWeight: active ? 700 : 400 }}
                      onMouseEnter={e => { if(!active){e.currentTarget.style.borderColor=T.cy+'40';e.currentTarget.style.color=T.cy;}}}
                      onMouseLeave={e => { if(!active){e.currentTarget.style.borderColor=T.bd;e.currentTarget.style.color=T.t2;}}}>
                      {ld.icon} {ld.label}
                      {ld.execMode==='browser' && <span style={{fontSize:9,color:T.gn,background:T.gn+'18',padding:'1px 5px',borderRadius:8}}>⚡</span>}
                      {ld.execMode==='display' && <span style={{fontSize:9,color:T.t3,background:T.s3,padding:'1px 5px',borderRadius:8}}>view</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* JS example snippets */}
      {lang === 'javascript' && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: T.t3 }}>Examples:</span>
          {JS_SNIPPETS.map(s => (
            <button key={s.label} onClick={() => { setCode(s.code); setOutput([]); }}
              style={{ padding: '4px 11px', borderRadius: 20, border: `1px solid ${T.bd}`, background: T.s2, color: T.t2, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', transition: 'all .12s', whiteSpace: 'nowrap' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.cy;e.currentTarget.style.color=T.cy;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.bd;e.currentTarget.style.color=T.t2;}}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* ── IDE grid: stacked on mobile, side-by-side on desktop ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr minmax(260px, 370px)', gap: 12, alignItems: 'start' }}>

        {/* Editor panel */}
        <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.bd}` }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: isMobile ? '7px 10px' : '8px 14px', background: T.s2, borderBottom: `1px solid ${T.bd}` }}>
            {!isMobile && (
              <div style={{ display: 'flex', gap: 5, flexShrink: 0, marginRight: 4 }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
              </div>
            )}
            <span style={{ fontSize: 12, color: T.t2 }}>{cur.icon} {isMobile ? cur.short : cur.label}</span>
            <span style={{ fontSize: 10, color: T.t3 }}>main.{cur.ext}</span>
            <div style={{ flex: 1 }} />
            <button onClick={clear}
              style={{ padding: isMobile ? '4px 8px' : '4px 12px', borderRadius: 6, border: `1px solid ${T.bd}`, background: 'transparent', color: T.t2, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', flexShrink: 0 }}>
              Clear
            </button>
            <button onClick={run} disabled={running}
              style={{ padding: isMobile ? '5px 14px' : '5px 18px', borderRadius: 7, border: 'none', background: running ? T.t3 : T.gn, color: T.bg, cursor: running ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              {running
                ? <><span style={{ width: 10, height: 10, border: `2px solid ${T.bg}50`, borderTop: `2px solid ${T.bg}`, borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite', flexShrink: 0 }} />{!isMobile && 'Running…'}</>
                : isMobile ? '▶ Run' : '▶  Run'}
            </button>
          </div>
          <CodeEditor value={code} onChange={setCode} language={cur.monacoLang} height={editorH} />
        </div>

        {/* Output panel */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.bd}` }}>
          {/* Header */}
          <div style={{ padding: '8px 14px', background: T.s2, borderBottom: `1px solid ${T.bd}`, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: T.t2, fontWeight: 600 }}>Output</span>
            {output.length > 0 && (
              <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: hasErrors ? T.rd+'20' : T.gn+'15', color: hasErrors ? T.rd : T.gn, border: `1px solid ${(hasErrors?T.rd:T.gn)+'30'}` }}>
                {hasErrors ? '✗ Error' : `✓ ${output.filter(l=>l.kind==='log').length} lines`}
              </span>
            )}
            {elapsed && <span style={{ fontSize: 10, color: T.cy, marginLeft: 'auto' }}>⏱ {elapsed}ms</span>}
          </div>

          {/* Console body */}
          <div style={{ background: '#030810', padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: isMobile ? 11 : 12, minHeight: isMobile ? 120 : 180, maxHeight: outputMaxH, overflowY: 'auto' }}>
            {output.length === 0 ? (
              <div style={{ color: T.t3, fontSize: 12, lineHeight: 1.7 }}>
                {cur.execMode === 'display'
                  ? `📋 ${cur.label} — view-only, no execution.`
                  : cur.execMode === 'piston'
                    ? `▶ Click Run to execute ${cur.label} via Piston API…`
                    : '▶ Click Run or press ⌘+Enter to execute JavaScript…'}
              </div>
            ) : output.map((line, i) => (
              <div key={i} style={{ color: LC[line.kind] || T.t1, marginBottom: 3, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={{ color: T.t3, userSelect: 'none', fontSize: 10, paddingTop: 3, minWidth: 14, textAlign: 'right', flexShrink: 0 }}>{i+1}</span>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'inherit', flex: 1, lineHeight: 1.6 }}>{line.text}</pre>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '9px 14px', borderTop: `1px solid ${T.bd}`, background: T.s1 }}>
            <div style={{ fontSize: 10, color: T.t3, marginBottom: 4 }}>HOW IT WORKS</div>
            <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.6 }}>
              {cur.execMode === 'browser'
                ? '⚡ JS runs in a sandboxed iframe — instant, no server.'
                : cur.execMode === 'piston'
                  ? `🌐 ${cur.label} ${cur.pistonVer} runs on the free Piston API.`
                  : `📋 ${cur.label} shown for syntax reference only.`}
            </div>
            {!isMobile && <div style={{ fontSize: 10, color: T.t3, marginTop: 4 }}>⌘+Enter to run · Clear resets output</div>}
          </div>
        </div>
      </div>

      {isMobile && (
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: T.t3 }}>
          Tap ▶ Run to execute · Clear resets output
        </div>
      )}
    </div>
  );
}
