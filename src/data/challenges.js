// Coding challenges database — each challenge has runnable test cases
// Students write `function solution(...args)` and we call it with each testCase.input

export const CHALLENGES = [
  // ─── ARRAYS ─────────────────────────────────────────────────────────────
  {
    id: 'two-sum',
    title: 'Two Sum',
    topicId: 'arrays',
    difficulty: 'easy',
    xp: 60,
    tags: ['Array', 'Hash Table'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers that add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Return the answer in any order.`,
    examples: [
      { input: '([2,7,11,15], 9)', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1].' },
      { input: '([3,2,4], 6)',     output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6.' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
    hints: [
      'Try using a hash map to store values you\'ve already seen.',
      'For each number, check if (target - number) is in the map.',
      'Store the index, not just the value, in the map.',
    ],
    starter: `function solution(nums, target) {
  // Return indices of two numbers that sum to target
  // Example: solution([2,7,11,15], 9) => [0,1]

}`,
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6],     expected: [1,2] },
      { input: [[3,3], 6],       expected: [0,1] },
      { input: [[1,5,3,2], 4],   expected: [2,3] },
    ],
    comparator: 'sortedArray',
    solutionCode: `function solution(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}`,
  },

  {
    id: 'max-subarray',
    title: 'Maximum Subarray',
    topicId: 'arrays',
    difficulty: 'medium',
    xp: 100,
    tags: ['Array', 'Divide & Conquer', 'Dynamic Programming'],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

This is solved optimally with **Kadane's Algorithm** in O(n).`,
    examples: [
      { input: '([-2,1,-3,4,-1,2,1,-5,4])', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum = 6.' },
      { input: '([1])',                       output: '1', explanation: 'Single element.' },
      { input: '([5,4,-1,7,8])',              output: '23', explanation: 'The whole array.' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    hints: [
      'Try a greedy approach: extend the current subarray if it helps, else start fresh.',
      'Track: current subarray sum, and the global maximum seen so far.',
      'Kadane\'s: curMax = max(nums[i], curMax + nums[i])',
    ],
    starter: `function solution(nums) {
  // Find maximum subarray sum (Kadane's Algorithm)
  // Example: solution([-2,1,-3,4,-1,2,1,-5,4]) => 6

}`,
    testCases: [
      { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
      { input: [[1]],                       expected: 1 },
      { input: [[5,4,-1,7,8]],              expected: 23 },
      { input: [[-1,-2,-3,-4]],             expected: -1 },
    ],
    solutionCode: `function solution(nums) {
  let max = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    max = Math.max(max, cur);
  }
  return max;
}`,
  },

  {
    id: 'rotate-array',
    title: 'Rotate Array',
    topicId: 'arrays',
    difficulty: 'medium',
    xp: 100,
    tags: ['Array', 'Two Pointers', 'Math'],
    description: `Given an integer array \`nums\`, rotate the array to the right by \`k\` steps, where \`k\` is non-negative.

Do it **in-place** with O(1) extra space. Return the modified array.

**Trick:** Three reversal steps = optimal solution.`,
    examples: [
      { input: '([1,2,3,4,5,6,7], 3)', output: '[5,6,7,1,2,3,4]', explanation: 'Rotate 3 times right.' },
      { input: '([-1,-100,3,99], 2)',   output: '[3,99,-1,-100]',   explanation: 'Rotate 2 times right.' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-2³¹ ≤ nums[i] ≤ 2³¹-1', '0 ≤ k ≤ 10⁵'],
    hints: [
      'k %= nums.length to handle k larger than array length.',
      'Reverse the entire array first.',
      'Then reverse first k elements, then reverse the rest.',
    ],
    starter: `function solution(nums, k) {
  // Rotate nums to the right by k steps in-place
  // Example: solution([1,2,3,4,5,6,7], 3) => [5,6,7,1,2,3,4]

  return nums; // return modified array
}`,
    testCases: [
      { input: [[1,2,3,4,5,6,7], 3], expected: [5,6,7,1,2,3,4] },
      { input: [[-1,-100,3,99], 2],   expected: [3,99,-1,-100] },
      { input: [[1,2], 3],            expected: [2,1] },
      { input: [[1], 5],              expected: [1] },
    ],
    solutionCode: `function solution(nums, k) {
  const n = nums.length;
  k %= n;
  const rev = (l, r) => { while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; } };
  rev(0, n-1); rev(0, k-1); rev(k, n-1);
  return nums;
}`,
  },

  // ─── STRINGS ────────────────────────────────────────────────────────────
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    topicId: 'strings',
    difficulty: 'easy',
    xp: 60,
    tags: ['String', 'Hash Table', 'Sorting'],
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **anagram** is a word or phrase formed by rearranging the letters of another.`,
    examples: [
      { input: '("anagram", "nagaram")', output: 'true',  explanation: 'Same letters, rearranged.' },
      { input: '("rat", "car")',         output: 'false', explanation: 'Different letters.' },
    ],
    constraints: ['1 ≤ s.length, t.length ≤ 5×10⁴', 's and t consist of lowercase English letters'],
    hints: [
      'If lengths differ, they can\'t be anagrams.',
      'Count character frequencies in s, then decrement for t.',
      'If all frequencies are 0, it\'s an anagram.',
    ],
    starter: `function solution(s, t) {
  // Return true if t is an anagram of s
  // Example: solution("anagram", "nagaram") => true

}`,
    testCases: [
      { input: ['anagram', 'nagaram'], expected: true  },
      { input: ['rat', 'car'],         expected: false },
      { input: ['a', 'a'],             expected: true  },
      { input: ['ab', 'ba'],           expected: true  },
      { input: ['abc', 'abd'],         expected: false },
    ],
    solutionCode: `function solution(s, t) {
  if (s.length !== t.length) return false;
  const cnt = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    cnt[s.charCodeAt(i) - 97]++;
    cnt[t.charCodeAt(i) - 97]--;
  }
  return cnt.every(c => c === 0);
}`,
  },

  {
    id: 'longest-palindrome',
    title: 'Longest Palindromic Substring',
    topicId: 'strings',
    difficulty: 'medium',
    xp: 120,
    tags: ['String', 'Dynamic Programming', 'Two Pointers'],
    description: `Given a string \`s\`, return the **longest palindromic substring** in \`s\`.

A string is palindromic if it reads the same forward and backward.

**Approach:** Expand Around Center — for each character, expand outward as long as it's a palindrome.`,
    examples: [
      { input: '("babad")', output: '"bab"',  explanation: '"aba" is also valid.' },
      { input: '("cbbd")',  output: '"bb"',   explanation: '"bb" is the longest palindrome.' },
    ],
    constraints: ['1 ≤ s.length ≤ 1000', 's consists of only digits and English letters'],
    hints: [
      'There are 2n-1 centers to expand from (each char + each gap between chars).',
      'Write an expand(l, r) helper that returns the longest palindrome centered at l,r.',
      'Compare lengths and track start + maxLen.',
    ],
    starter: `function solution(s) {
  // Return the longest palindromic substring
  // Example: solution("babad") => "bab"

}`,
    testCases: [
      { input: ['babad'], expected: 'bab',  comparator: 'palindromeOr' },
      { input: ['cbbd'],  expected: 'bb'   },
      { input: ['a'],     expected: 'a'    },
      { input: ['racecar'], expected: 'racecar' },
      { input: ['abcba'],   expected: 'abcba'   },
    ],
    solutionCode: `function solution(s) {
  let start = 0, maxLen = 1;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
  };
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return s.slice(start, start + maxLen);
}`,
  },

  // ─── LINKED LISTS ───────────────────────────────────────────────────────
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    topicId: 'linked-lists',
    difficulty: 'easy',
    xp: 60,
    tags: ['Linked List', 'Recursion'],
    description: `Given the head of a singly linked list (represented as an array), reverse the list and return the reversed array.

In a real interview you'd work with ListNode objects, but here we use arrays for testability.`,
    examples: [
      { input: '([1,2,3,4,5])', output: '[5,4,3,2,1]', explanation: 'All nodes reversed.' },
      { input: '([1,2])',        output: '[2,1]',        explanation: '.' },
    ],
    constraints: ['0 ≤ length ≤ 5000', '-5000 ≤ Node.val ≤ 5000'],
    hints: [
      'Three pointer approach: prev, curr, next.',
      'At each step: save next, point curr.next to prev, advance both pointers.',
      'Return prev when curr is null.',
    ],
    starter: `function solution(arr) {
  // Reverse the linked list (represented as array)
  // Example: solution([1,2,3,4,5]) => [5,4,3,2,1]

}`,
    testCases: [
      { input: [[1,2,3,4,5]], expected: [5,4,3,2,1] },
      { input: [[1,2]],        expected: [2,1] },
      { input: [[1]],          expected: [1]   },
      { input: [[]],           expected: []    },
    ],
    solutionCode: `function solution(arr) {
  return [...arr].reverse();
}`,
  },

  {
    id: 'merge-sorted-lists',
    title: 'Merge Two Sorted Lists',
    topicId: 'linked-lists',
    difficulty: 'easy',
    xp: 70,
    tags: ['Linked List', 'Recursion'],
    description: `You are given the heads of two sorted linked lists (as sorted arrays). Merge the two lists into one sorted list and return it.`,
    examples: [
      { input: '([1,2,4], [1,3,4])', output: '[1,1,2,3,4,4]', explanation: 'Merged in sorted order.' },
      { input: '([], [])',           output: '[]',             explanation: 'Both empty.' },
      { input: '([], [0])',          output: '[0]',            explanation: 'One empty.' },
    ],
    constraints: ['0 ≤ lists lengths ≤ 50', '-100 ≤ Node.val ≤ 100'],
    hints: [
      'Use two pointers, one for each list.',
      'Always append the smaller current element.',
      'After one list is exhausted, append the rest of the other.',
    ],
    starter: `function solution(list1, list2) {
  // Merge two sorted arrays
  // Example: solution([1,2,4], [1,3,4]) => [1,1,2,3,4,4]

}`,
    testCases: [
      { input: [[1,2,4], [1,3,4]], expected: [1,1,2,3,4,4] },
      { input: [[], []],           expected: [] },
      { input: [[], [0]],          expected: [0] },
      { input: [[2], [1]],         expected: [1,2] },
    ],
    solutionCode: `function solution(list1, list2) {
  const res = []; let i = 0, j = 0;
  while (i < list1.length && j < list2.length)
    res.push(list1[i] <= list2[j] ? list1[i++] : list2[j++]);
  return [...res, ...list1.slice(i), ...list2.slice(j)];
}`,
  },

  // ─── STACKS ─────────────────────────────────────────────────────────────
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    topicId: 'stacks',
    difficulty: 'easy',
    xp: 60,
    tags: ['String', 'Stack'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is **valid**.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket.`,
    examples: [
      { input: '("()")',     output: 'true',  explanation: 'Simple matching pair.' },
      { input: '("()[]{}")', output: 'true',  explanation: 'Multiple matching pairs.' },
      { input: '("(]")',     output: 'false', explanation: 'Wrong bracket type.' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only'],
    hints: [
      'Use a stack. Push open brackets, pop on close brackets.',
      'On a closing bracket, check if the stack top is the matching opener.',
      'At the end, the stack must be empty.',
    ],
    starter: `function solution(s) {
  // Return true if the brackets are valid
  // Example: solution("()[]{}") => true

}`,
    testCases: [
      { input: ['()'],     expected: true  },
      { input: ['()[]{}'], expected: true  },
      { input: ['(]'],     expected: false },
      { input: ['([)]'],   expected: false },
      { input: ['{[]}'],   expected: true  },
    ],
    solutionCode: `function solution(s) {
  const map = { ')':'(', ']':'[', '}':'{' }, stack = [];
  for (const c of s) {
    if ('([{'.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}`,
  },

  {
    id: 'next-greater-element',
    title: 'Next Greater Element',
    topicId: 'stacks',
    difficulty: 'medium',
    xp: 100,
    tags: ['Array', 'Stack', 'Monotonic Stack'],
    description: `The next greater element of some element \`x\` in an array is the **first greater** element to its right.

Given array \`nums\`, return an array where each element is the next greater element of \`nums[i]\`, or \`-1\` if no such element exists.

**Key insight:** Monotonic decreasing stack — when we see a larger element, it's the NGE for everything smaller in the stack.`,
    examples: [
      { input: '([2,1,2,4,3])', output: '[4,2,4,-1,-1]', explanation: 'NGE of 2→4, 1→2, 2(idx2)→4, 4→-1, 3→-1.' },
      { input: '([1,3,2])',      output: '[3,-1,-1]',      explanation: 'NGE of 1→3, 3→-1, 2→-1.' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹'],
    hints: [
      'Use a stack to keep track of indices awaiting their NGE.',
      'Iterate left to right. For each element, pop everything smaller from the stack.',
      'The popped elements have found their NGE: the current element.',
    ],
    starter: `function solution(nums) {
  // Return next greater element for each index, -1 if none
  // Example: solution([2,1,2,4,3]) => [4,2,4,-1,-1]

}`,
    testCases: [
      { input: [[2,1,2,4,3]], expected: [4,2,4,-1,-1] },
      { input: [[1,3,2]],     expected: [3,-1,-1]      },
      { input: [[1,1,1,1]],   expected: [-1,-1,-1,-1]  },
      { input: [[5,4,3,2,1]], expected: [-1,-1,-1,-1,-1] },
    ],
    solutionCode: `function solution(nums) {
  const res = new Array(nums.length).fill(-1), stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack.at(-1)] < nums[i])
      res[stack.pop()] = nums[i];
    stack.push(i);
  }
  return res;
}`,
  },

  // ─── SEARCHING ──────────────────────────────────────────────────────────
  {
    id: 'binary-search',
    title: 'Binary Search',
    topicId: 'searching',
    difficulty: 'easy',
    xp: 50,
    tags: ['Array', 'Binary Search'],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    examples: [
      { input: '([-1,0,3,5,9,12], 9)', output: '4',  explanation: '9 exists at index 4.' },
      { input: '([-1,0,3,5,9,12], 2)', output: '-1', explanation: '2 does not exist.' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', 'All integers are unique and sorted'],
    hints: [
      'lo = 0, hi = nums.length - 1.',
      'mid = lo + ((hi - lo) >> 1) — avoids integer overflow.',
      'If arr[mid] < target → lo = mid + 1, if arr[mid] > target → hi = mid - 1.',
    ],
    starter: `function solution(nums, target) {
  // Binary search — O(log n)
  // Example: solution([-1,0,3,5,9,12], 9) => 4

}`,
    testCases: [
      { input: [[-1,0,3,5,9,12], 9],  expected: 4  },
      { input: [[-1,0,3,5,9,12], 2],  expected: -1 },
      { input: [[1], 1],               expected: 0  },
      { input: [[1,3,5,7,9], 7],       expected: 3  },
      { input: [[2,4,6,8,10], 1],      expected: -1 },
    ],
    solutionCode: `function solution(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    nums[mid] < target ? lo = mid + 1 : hi = mid - 1;
  }
  return -1;
}`,
  },

  {
    id: 'search-rotated',
    title: 'Search in Rotated Array',
    topicId: 'searching',
    difficulty: 'medium',
    xp: 130,
    tags: ['Array', 'Binary Search'],
    description: `An array of integers \`nums\` was sorted in ascending order, then rotated at an unknown pivot index.

Given the array \`nums\` and an integer \`target\`, return the **index** of \`target\` if it is in \`nums\`, or \`-1\` otherwise.

Must be O(log n).`,
    examples: [
      { input: '([4,5,6,7,0,1,2], 0)', output: '4',  explanation: 'Found 0 at index 4.' },
      { input: '([4,5,6,7,0,1,2], 3)', output: '-1', explanation: '3 is not in the array.' },
    ],
    constraints: ['1 ≤ nums.length ≤ 5000', 'All unique values'],
    hints: [
      'At each step, at least one half is sorted.',
      'Check if nums[lo] <= nums[mid] → left half is sorted.',
      'If target is in the sorted half, search there. Otherwise search the other half.',
    ],
    starter: `function solution(nums, target) {
  // Search in rotated sorted array — O(log n)
  // Example: solution([4,5,6,7,0,1,2], 0) => 4

}`,
    testCases: [
      { input: [[4,5,6,7,0,1,2], 0], expected: 4  },
      { input: [[4,5,6,7,0,1,2], 3], expected: -1 },
      { input: [[1], 0],              expected: -1 },
      { input: [[3,1], 1],            expected: 1  },
      { input: [[5,1,3], 3],          expected: 2  },
    ],
    solutionCode: `function solution(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
  },

  // ─── DYNAMIC PROGRAMMING ────────────────────────────────────────────────
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    topicId: 'dp',
    difficulty: 'easy',
    xp: 60,
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb **1 or 2 steps**. In how many **distinct ways** can you climb to the top?

This is essentially Fibonacci! dp[i] = dp[i-1] + dp[i-2].`,
    examples: [
      { input: '(2)', output: '2',  explanation: '1+1, 2 — two ways.' },
      { input: '(3)', output: '3',  explanation: '1+1+1, 1+2, 2+1 — three ways.' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    hints: [
      'Think about what happens at step n: you either came from n-1 or n-2.',
      'dp[n] = dp[n-1] + dp[n-2]',
      'Base cases: dp[1] = 1, dp[2] = 2',
    ],
    starter: `function solution(n) {
  // Return number of distinct ways to climb n stairs
  // Example: solution(3) => 3

}`,
    testCases: [
      { input: [1],  expected: 1   },
      { input: [2],  expected: 2   },
      { input: [3],  expected: 3   },
      { input: [5],  expected: 8   },
      { input: [10], expected: 89  },
    ],
    solutionCode: `function solution(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) { [a, b] = [b, a + b]; }
  return b;
}`,
  },

  {
    id: 'coin-change',
    title: 'Coin Change',
    topicId: 'dp',
    difficulty: 'medium',
    xp: 130,
    tags: ['Array', 'Dynamic Programming', 'BFS'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins needed to make up that amount. If it cannot be made up, return \`-1\`.

**Classic DP:** dp[amount] = min coins to make that amount.`,
    examples: [
      { input: '([1,5,11], 15)', output: '3',  explanation: '11+3*1 uses 4, but 5+5+5=3 coins.' },
      { input: '([2], 3)',       output: '-1', explanation: 'Cannot make 3 with only coin 2.' },
    ],
    constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹-1', '0 ≤ amount ≤ 10⁴'],
    hints: [
      'Build dp array of size amount+1, initialized to Infinity. dp[0] = 0.',
      'For each amount a, try each coin c: dp[a] = min(dp[a], dp[a-c] + 1).',
      'Return dp[amount] === Infinity ? -1 : dp[amount]',
    ],
    starter: `function solution(coins, amount) {
  // Return min coins to make amount, or -1 if impossible
  // Example: solution([1,2,5], 11) => 3 (5+5+1)

}`,
    testCases: [
      { input: [[1,2,5], 11],  expected: 3  },
      { input: [[2], 3],        expected: -1 },
      { input: [[1], 0],        expected: 0  },
      { input: [[1,5,10,25], 41], expected: 4 },
      { input: [[186,419,83,408], 6249], expected: 20 },
    ],
    solutionCode: `function solution(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a && dp[a-c] + 1 < dp[a]) dp[a] = dp[a-c] + 1;
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
  },

  {
    id: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    topicId: 'dp',
    difficulty: 'medium',
    xp: 150,
    tags: ['String', 'Dynamic Programming'],
    description: `Given two strings \`text1\` and \`text2\`, return the length of their **longest common subsequence (LCS)**.

A subsequence is a sequence derived from another by deleting some characters without changing the remaining order.

Classic 2D DP: dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1].`,
    examples: [
      { input: '("abcde", "ace")',   output: '3', explanation: 'LCS is "ace".' },
      { input: '("abc", "abc")',     output: '3', explanation: 'LCS is "abc".' },
      { input: '("abc", "def")',     output: '0', explanation: 'No common subsequence.' },
    ],
    constraints: ['1 ≤ text1.length, text2.length ≤ 1000'],
    hints: [
      'If text1[i] === text2[j]: dp[i][j] = dp[i-1][j-1] + 1',
      'Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
      'Build a 2D table of size (m+1) × (n+1).',
    ],
    starter: `function solution(text1, text2) {
  // Return length of longest common subsequence
  // Example: solution("abcde", "ace") => 3

}`,
    testCases: [
      { input: ['abcde', 'ace'],  expected: 3 },
      { input: ['abc', 'abc'],    expected: 3 },
      { input: ['abc', 'def'],    expected: 0 },
      { input: ['oxcpqrsvwf', 'shmtulqrypy'], expected: 2 },
    ],
    solutionCode: `function solution(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = text1[i-1] === text2[j-1]
        ? dp[i-1][j-1] + 1
        : Math.max(dp[i-1][j], dp[i][j-1]);
  return dp[m][n];
}`,
  },

  // ─── SLIDING WINDOW ─────────────────────────────────────────────────────
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating',
    topicId: 'sliding-window',
    difficulty: 'medium',
    xp: 110,
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: `Given a string \`s\`, find the length of the **longest substring without repeating characters**.

**Pattern:** Sliding window with a hash map tracking last-seen index.`,
    examples: [
      { input: '("abcabcbb")', output: '3', explanation: '"abc" has length 3.' },
      { input: '("bbbbb")',    output: '1', explanation: '"b" has length 1.' },
      { input: '("pwwkew")',   output: '3', explanation: '"wke" has length 3.' },
    ],
    constraints: ['0 ≤ s.length ≤ 5×10⁴', 's consists of English letters, digits, symbols and spaces'],
    hints: [
      'Maintain a window [lo, hi] and a map of {char → last index}.',
      'If s[hi] was seen and its last index >= lo, move lo past it.',
      'Update max window size at each step.',
    ],
    starter: `function solution(s) {
  // Return length of longest substring without repeating chars
  // Example: solution("abcabcbb") => 3

}`,
    testCases: [
      { input: ['abcabcbb'], expected: 3 },
      { input: ['bbbbb'],    expected: 1 },
      { input: ['pwwkew'],   expected: 3 },
      { input: [''],         expected: 0 },
      { input: ['au'],       expected: 2 },
    ],
    solutionCode: `function solution(s) {
  const seen = new Map(); let lo = 0, max = 0;
  for (let hi = 0; hi < s.length; hi++) {
    if (seen.has(s[hi]) && seen.get(s[hi]) >= lo)
      lo = seen.get(s[hi]) + 1;
    seen.set(s[hi], hi);
    max = Math.max(max, hi - lo + 1);
  }
  return max;
}`,
  },

  // ─── GRAPHS ─────────────────────────────────────────────────────────────
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    topicId: 'graphs',
    difficulty: 'medium',
    xp: 130,
    tags: ['Array', 'DFS', 'BFS', 'Union Find'],
    description: `Given an \`m x n\` 2D binary grid where \`'1'\` is land and \`'0'\` is water, return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

**Approach:** DFS/BFS flood fill — when you find a '1', flood fill all connected '1's to '0'.`,
    examples: [
      { input: '([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])', output: '1' },
      { input: '([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]])', output: '3' },
    ],
    constraints: ['m, n ≥ 1 (grid dimensions)', "grid[i][j] is '0' or '1'"],
    hints: [
      'Iterate every cell. When you find a \'1\', increment count and run DFS.',
      'DFS: mark cell as \'0\' (visited), then recurse on all 4 neighbors.',
      'No extra visited array needed — overwrite with \'0\'.',
    ],
    starter: `function solution(grid) {
  // Return number of islands in the grid
  // Example: solution([["1","0"],["0","1"]]) => 2

}`,
    testCases: [
      { input: [[['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]], expected: 1 },
      { input: [[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]], expected: 3 },
      { input: [[['1','0'],['0','1']]], expected: 2 },
      { input: [[['1']]], expected: 1 },
    ],
    solutionCode: `function solution(grid) {
  if (!grid.length) return 0;
  const g = grid.map(r => [...r]);
  let count = 0;
  const dfs = (r, c) => {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] !== '1') return;
    g[r][c] = '0';
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  };
  for (let r = 0; r < g.length; r++)
    for (let c = 0; c < g[0].length; c++)
      if (g[r][c] === '1') { count++; dfs(r, c); }
  return count;
}`,
  },

  {
    id: 'course-schedule',
    title: 'Course Schedule',
    topicId: 'graphs',
    difficulty: 'medium',
    xp: 150,
    tags: ['DFS', 'BFS', 'Topological Sort', 'Graph'],
    description: `There are \`numCourses\` courses (0 to numCourses-1). You are given an array \`prerequisites\` where \`prerequisites[i] = [a, b]\` means you must take course \`b\` first to take course \`a\`.

Return \`true\` if you can finish all courses.

**Key insight:** A valid schedule exists iff the graph has no cycle (Topological Sort / Kahn's Algorithm).`,
    examples: [
      { input: '(2, [[1,0]])',       output: 'true',  explanation: 'Take 0, then 1.' },
      { input: '(2, [[1,0],[0,1]])', output: 'false', explanation: 'Cycle: 0→1→0.' },
    ],
    constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000'],
    hints: [
      'Build adjacency list and in-degree array.',
      "Kahn's: start with all nodes of in-degree 0.",
      'Process queue: for each node, decrement neighbors\' in-degree. If 0, enqueue.',
      'If processed count equals numCourses, no cycle.',
    ],
    starter: `function solution(numCourses, prerequisites) {
  // Return true if all courses can be finished (no cycle)
  // Example: solution(2, [[1,0]]) => true

}`,
    testCases: [
      { input: [2, [[1,0]]],          expected: true  },
      { input: [2, [[1,0],[0,1]]],    expected: false },
      { input: [1, []],               expected: true  },
      { input: [3, [[1,0],[2,0],[1,2]]], expected: true },
    ],
    solutionCode: `function solution(numCourses, prerequisites) {
  const inDeg = new Array(numCourses).fill(0);
  const adj = Array.from({length: numCourses}, () => []);
  for (const [a, b] of prerequisites) { adj[b].push(a); inDeg[a]++; }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (inDeg[i] === 0) queue.push(i);
  let done = 0;
  while (queue.length) {
    const u = queue.shift(); done++;
    for (const v of adj[u]) if (--inDeg[v] === 0) queue.push(v);
  }
  return done === numCourses;
}`,
  },

  // ─── TREES ──────────────────────────────────────────────────────────────
  {
    id: 'max-depth-tree',
    title: 'Maximum Depth of Binary Tree',
    topicId: 'trees',
    difficulty: 'easy',
    xp: 60,
    tags: ['Tree', 'DFS', 'BFS', 'Recursion'],
    description: `Given a binary tree represented as a **level-order array** (null for missing nodes), return its **maximum depth**.

Maximum depth = number of nodes along the longest path from root to leaf.

The recursive formula is elegant: depth(node) = 1 + max(depth(left), depth(right)).`,
    examples: [
      { input: '([3,9,20,null,null,15,7])', output: '3', explanation: 'Three levels deep.' },
      { input: '([1,null,2])',               output: '2', explanation: 'Right child at level 2.' },
    ],
    constraints: ['0 ≤ number of nodes ≤ 10⁴', '-100 ≤ Node.val ≤ 100'],
    hints: [
      'Build tree from the array, then DFS.',
      'Alternatively: BFS level by level, count levels.',
      'Recursive: maxDepth(null) = 0, maxDepth(node) = 1 + max(L, R)',
    ],
    starter: `function solution(arr) {
  // Given level-order array, return max depth
  // Example: solution([3,9,20,null,null,15,7]) => 3

  // Build tree from level-order array
  if (!arr.length || arr[0] == null) return 0;
  // ... build and calculate depth

}`,
    testCases: [
      { input: [[3,9,20,null,null,15,7]], expected: 3 },
      { input: [[1,null,2]],              expected: 2 },
      { input: [[]],                      expected: 0 },
      { input: [[1]],                     expected: 1 },
      { input: [[1,2,3,4,5]],             expected: 3 },
    ],
    solutionCode: `function solution(arr) {
  if (!arr.length || arr[0] == null) return 0;
  // BFS approach on the array representation
  const maxD = (i) => {
    if (i >= arr.length || arr[i] == null) return 0;
    return 1 + Math.max(maxD(2*i+1), maxD(2*i+2));
  };
  return maxD(0);
}`,
  },

  {
    id: 'inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    topicId: 'trees',
    difficulty: 'easy',
    xp: 60,
    tags: ['Stack', 'Tree', 'DFS'],
    description: `Given a binary tree as a **level-order array**, return the **inorder traversal** (Left → Root → Right).

For a BST, inorder traversal produces a sorted sequence.

Can you do it both recursively and iteratively?`,
    examples: [
      { input: '([1,null,2,null,null,3])', output: '[1,3,2]', explanation: 'Inorder of tree where 2 has left child 3.' },
      { input: '([])',                     output: '[]',       explanation: 'Empty tree.' },
      { input: '([1])',                    output: '[1]',      explanation: 'Single node.' },
    ],
    constraints: ['0 ≤ nodes ≤ 100', '-100 ≤ Node.val ≤ 100'],
    hints: [
      'Recursive: inorder(left) → visit(root) → inorder(right)',
      'Iterative: use explicit stack, push left until null, process, then go right.',
      'Build the tree from level-order array first.',
    ],
    starter: `function solution(arr) {
  // Return inorder traversal of binary tree (as level-order array)
  // Example: solution([1,2,3]) => [2,1,3]  (left=2, root=1, right=3)

  const result = [];
  const inorder = (i) => {
    if (i >= arr.length || arr[i] == null) return;
    inorder(2*i + 1); // left
    result.push(arr[i]);
    inorder(2*i + 2); // right
  };
  inorder(0);
  return result;
}`,
    testCases: [
      { input: [[1,2,3]], expected: [2,1,3] },
      { input: [[]], expected: [] },
      { input: [[1]], expected: [1] },
      { input: [[4,2,6,1,3,5,7]], expected: [1,2,3,4,5,6,7] },
    ],
    solutionCode: `function solution(arr) {
  const result = [];
  const inorder = (i) => {
    if (i >= arr.length || arr[i] == null) return;
    inorder(2*i + 1);
    result.push(arr[i]);
    inorder(2*i + 2);
  };
  inorder(0);
  return result;
}`,
  },

  // ─── HASH TABLES ────────────────────────────────────────────────────────
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    topicId: 'hash-tables',
    difficulty: 'medium',
    xp: 110,
    tags: ['Array', 'Hash Table', 'String', 'Sorting'],
    description: `Given an array of strings \`strs\`, group the **anagrams** together. Return the groups in any order.

**Key:** Two strings are anagrams if their sorted characters are equal. Use sorted string as hash key.`,
    examples: [
      { input: '(["eat","tea","tan","ate","nat","bat"])', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Grouped by anagram family.' },
    ],
    constraints: ['1 ≤ strs.length ≤ 10⁴', '0 ≤ strs[i].length ≤ 100'],
    hints: [
      'Sort each string to get its canonical "anagram key".',
      'Use a Map: key = sorted string, value = array of anagrams.',
      'Return all map values.',
    ],
    starter: `function solution(strs) {
  // Group anagrams together
  // Example: solution(["eat","tea","bat"]) => [["eat","tea"],["bat"]]

}`,
    testCases: [
      {
        input: [['eat','tea','tan','ate','nat','bat']],
        expected: [['bat'],['nat','tan'],['ate','eat','tea']],
        comparator: 'anagramGroups',
      },
      { input: [['']], expected: [['']], comparator: 'anagramGroups' },
      { input: [['a']], expected: [['a']], comparator: 'anagramGroups' },
    ],
    solutionCode: `function solution(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = [...s].sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}`,
  },

  // ─── SORTING ────────────────────────────────────────────────────────────
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    topicId: 'sorting',
    difficulty: 'medium',
    xp: 120,
    tags: ['Array', 'Sorting'],
    description: `Given an array of intervals where \`intervals[i] = [start, end]\`, merge all overlapping intervals and return an array of the non-overlapping intervals.`,
    examples: [
      { input: '([[1,3],[2,6],[8,10],[15,18]])', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] and [2,6] overlap → merge to [1,6].' },
      { input: '([[1,4],[4,5]])',                output: '[[1,5]]',                explanation: '[1,4] and [4,5] are considered overlapping.' },
    ],
    constraints: ['1 ≤ intervals.length ≤ 10⁴', 'intervals[i].length == 2'],
    hints: [
      'Sort intervals by start time.',
      'Iterate: if current start <= last merged end, extend the last merge.',
      'Otherwise, start a new interval.',
    ],
    starter: `function solution(intervals) {
  // Merge overlapping intervals
  // Example: solution([[1,3],[2,6],[8,10]]) => [[1,6],[8,10]]

}`,
    testCases: [
      { input: [[[1,3],[2,6],[8,10],[15,18]]], expected: [[1,6],[8,10],[15,18]] },
      { input: [[[1,4],[4,5]]],                expected: [[1,5]] },
      { input: [[[1,4],[2,3]]],                expected: [[1,4]] },
    ],
    solutionCode: `function solution(intervals) {
  intervals.sort((a,b) => a[0]-b[0]);
  const res = [intervals[0]];
  for (const [s,e] of intervals.slice(1)) {
    const last = res.at(-1);
    last[1] >= s ? last[1] = Math.max(last[1], e) : res.push([s,e]);
  }
  return res;
}`,
  },

  // ─── RECURSION / BACKTRACKING ────────────────────────────────────────────
  {
    id: 'generate-parentheses',
    title: 'Generate Parentheses',
    topicId: 'backtracking',
    difficulty: 'medium',
    xp: 130,
    tags: ['String', 'Dynamic Programming', 'Backtracking'],
    description: `Given \`n\` pairs of parentheses, write a function to generate **all combinations of well-formed parentheses**.

**Backtracking rule:** Add \`(\` if open < n. Add \`)\` if close < open.`,
    examples: [
      { input: '(3)', output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: '5 valid combinations for n=3.' },
      { input: '(1)', output: '["()"]', explanation: 'Only one for n=1.' },
    ],
    constraints: ['1 ≤ n ≤ 8'],
    hints: [
      'Use backtracking with (current, open, close) state.',
      'Add \'(\' if open < n.',
      'Add \')\' if close < open.',
      'Base: when current.length === 2n, add to result.',
    ],
    starter: `function solution(n) {
  // Return all well-formed parentheses combinations
  // Example: solution(3) => ["((()))","(()())","(())()","()(())","()()()"]

}`,
    testCases: [
      { input: [1], expected: ['()'], comparator: 'sortedArray' },
      { input: [2], expected: ['(())', '()()'], comparator: 'sortedArray' },
      { input: [3], expected: ['((()))','(()())','(())()','()(())','()()()'], comparator: 'sortedArray' },
    ],
    solutionCode: `function solution(n) {
  const res = [];
  const bt = (cur, open, close) => {
    if (cur.length === 2*n) { res.push(cur); return; }
    if (open < n) bt(cur+'(', open+1, close);
    if (close < open) bt(cur+')', open, close+1);
  };
  bt('', 0, 0);
  return res;
}`,
  },

  // ─── BIG-O ──────────────────────────────────────────────────────────────
  {
    id: 'implement-stack',
    title: 'Implement Stack with Queue',
    topicId: 'stacks',
    difficulty: 'easy',
    xp: 80,
    tags: ['Stack', 'Queue', 'Design'],
    description: `Implement a last-in-first-out (LIFO) stack using only an array and basic operations. Return a function that when called with an array of operations returns the results.

Operations: \`['push', val]\`, \`['pop']\`, \`['top']\`, \`['empty']\`.`,
    examples: [
      { input: "([['push',1],['push',2],['top'],['pop'],['empty']])", output: "[null,null,2,2,false]", explanation: 'top=2, pop returns 2, not empty after push 1.' },
    ],
    constraints: ['1 ≤ operations.length ≤ 100', '1 ≤ val ≤ 100'],
    hints: [
      'Just use an array with push/pop as they naturally implement a stack.',
      'push → arr.push(val)',
      'pop → arr.pop()',
      'top → arr.at(-1)',
      'empty → arr.length === 0',
    ],
    starter: `function solution(ops) {
  // Execute stack operations, return results array (null for push)
  // ops: [['push',1],['pop'],['top'],['empty']]
  const stack = [];
  return ops.map(([op, val]) => {
    // implement here
  });
}`,
    testCases: [
      { input: [[['push',1],['push',2],['top'],['pop'],['empty']]], expected: [null,null,2,2,false] },
      { input: [[['push',5],['empty'],['pop']]], expected: [null,false,5] },
    ],
    solutionCode: `function solution(ops) {
  const s = [];
  return ops.map(([op, val]) => {
    if (op === 'push') { s.push(val); return null; }
    if (op === 'pop')  return s.pop();
    if (op === 'top')  return s.at(-1);
    if (op === 'empty') return s.length === 0;
  });
}`,
  },

  // ─── ML / ALGORITHMS ────────────────────────────────────────────────────
  {
    id: 'kth-largest',
    title: 'Kth Largest Element',
    topicId: 'heaps',
    difficulty: 'medium',
    xp: 120,
    tags: ['Array', 'Divide & Conquer', 'Sorting', 'Heap', 'Quickselect'],
    description: `Given an integer array \`nums\` and integer \`k\`, return the **kth largest element** in the array.

Note: it is the kth largest in sorted order, not the kth distinct element.

**Approaches:** Sort O(n log n), Min-heap of size k O(n log k), Quickselect O(n) average.`,
    examples: [
      { input: '([3,2,1,5,6,4], 2)', output: '5', explanation: 'Sorted desc: [6,5,4,3,2,1], 2nd is 5.' },
      { input: '([3,2,3,1,2,4,5,5,6], 4)', output: '4', explanation: '4th largest is 4.' },
    ],
    constraints: ['1 ≤ k ≤ nums.length ≤ 10⁵'],
    hints: [
      'Simplest: sort descending, return nums[k-1].',
      'Better: maintain a min-heap of size k. Root is always kth largest.',
      'Best: Quickselect partitioning — O(n) average.',
    ],
    starter: `function solution(nums, k) {
  // Return kth largest element
  // Example: solution([3,2,1,5,6,4], 2) => 5

}`,
    testCases: [
      { input: [[3,2,1,5,6,4], 2],         expected: 5 },
      { input: [[3,2,3,1,2,4,5,5,6], 4],   expected: 4 },
      { input: [[1], 1],                    expected: 1 },
      { input: [[7,6,5,4,3,2,1], 5],        expected: 3 },
    ],
    solutionCode: `function solution(nums, k) {
  nums.sort((a,b) => b-a);
  return nums[k-1];
}`,
  },

  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    topicId: 'arrays',
    difficulty: 'medium',
    xp: 130,
    tags: ['Array', 'Prefix Sum'],
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all elements except \`nums[i]\`.

**Constraint:** O(n) time, O(1) extra space. No division operator.

**Trick:** Prefix products from left × suffix products from right.`,
    examples: [
      { input: '([1,2,3,4])',  output: '[24,12,8,6]', explanation: 'answer[0]=2*3*4=24, answer[1]=1*3*4=12, ...' },
      { input: '([-1,1,0,-3,3])', output: '[0,0,9,0,0]', explanation: 'Zero makes most products 0.' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁵'],
    hints: [
      'Pass 1: compute prefix products (left[i] = product of nums[0..i-1]).',
      'Pass 2: compute suffix products right-to-left and multiply into answer.',
      'Use the answer array itself for the prefix, and a single variable for suffix.',
    ],
    starter: `function solution(nums) {
  // Return product of all elements except self, no division, O(n)
  // Example: solution([1,2,3,4]) => [24,12,8,6]

}`,
    testCases: [
      { input: [[1,2,3,4]],        expected: [24,12,8,6]   },
      { input: [[-1,1,0,-3,3]],    expected: [0,0,9,0,0]   },
      { input: [[2,3]],            expected: [3,2]          },
    ],
    solutionCode: `function solution(nums) {
  const n = nums.length, ans = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) { ans[i] = prefix; prefix *= nums[i]; }
  let suffix = 1;
  for (let i = n-1; i >= 0; i--) { ans[i] *= suffix; suffix *= nums[i]; }
  return ans;
}`,
  },
];

export const getChallengeById = id => CHALLENGES.find(c => c.id === id);
export const getChallengesByTopic = topicId => CHALLENGES.filter(c => c.topicId === topicId);
export const getChallengesByDifficulty = diff => CHALLENGES.filter(c => c.difficulty === diff);

export const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };
export const DIFFICULTY_COLOR = { easy: '#00ffa3', medium: '#ff9d00', hard: '#ff4f6d' };
export const DIFFICULTY_XP    = { easy: 60,        medium: 120,       hard: 250 };
