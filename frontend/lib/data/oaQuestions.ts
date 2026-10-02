export interface CodingExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface CodingTestCase {
  id: number;
  input: string;
  expected: string;
  function_call: string;
}

export interface OAQuestion {
  id: string;
  title: string;
  category: "Aptitude" | "DBMS" | "Computer Networks" | "Operating Systems" | "DSA & Coding" | "OOPs";
  company: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  codeSnippet?: string;
  solutionCode?: string;
  askedInYear?: string;
  // LeetCode-specific fields
  isCoding?: boolean;
  examples?: CodingExample[];
  constraints?: string[];
  starterCodes?: {
    python: string;
    javascript: string;
    cpp: string;
    java: string;
  };
  testCases?: CodingTestCase[];
}

export interface CompanyInsight {
  name: string;
  logoUrl?: string;
  color: string;
  views: string;
  upcomingOADate: string;
  tier: "Tier 1 (High Package)" | "Tier 2 (Product/Fintech)" | "Tier 3 (IT Services)";
  keyTopics: string[];
  totalQuestions: number;
}

export interface OACalendarEvent {
  id: string;
  company: string;
  role: string;
  date: string;
  time: string;
  status: "Registration Open" | "Upcoming" | "Closing Soon" | "Completed";
  type: "On-Campus" | "Off-Campus" | "National Hiring";
  eligibleBatches: string;
}

export const COMPANY_INSIGHTS: CompanyInsight[] = [
  {
    name: "Barclays",
    color: "from-sky-500 to-blue-600",
    views: "10.4k views",
    upcomingOADate: "Sep 05, 2026",
    tier: "Tier 2 (Product/Fintech)",
    keyTopics: ["SQL Joins", "OS Thread Synchronization", "CN TCP/IP", "DP on Trees"],
    totalQuestions: 24,
  },
  {
    name: "Google",
    color: "from-red-500 via-amber-400 to-emerald-500",
    views: "18.2k views",
    upcomingOADate: "Sep 12, 2026",
    tier: "Tier 1 (High Package)",
    keyTopics: ["Graph Algorithms", "Segment Trees", "System Design", "Aptitude Puzzles"],
    totalQuestions: 42,
  },
  {
    name: "Titan",
    color: "from-purple-600 to-indigo-600",
    views: "6.3k views",
    upcomingOADate: "Sep 18, 2026",
    tier: "Tier 2 (Product/Fintech)",
    keyTopics: ["DBMS Normalization", "Array Sliding Window", "Logical Reasoning"],
    totalQuestions: 15,
  },
  {
    name: "Qualcomm",
    color: "from-blue-600 to-indigo-800",
    views: "8.7k views",
    upcomingOADate: "Sep 22, 2026",
    tier: "Tier 1 (High Package)",
    keyTopics: ["C/C++ Pointers", "OS Memory Paging", "Bit Manipulation", "Computer Networks"],
    totalQuestions: 28,
  },
  {
    name: "Microsoft",
    color: "from-cyan-500 to-blue-600",
    views: "15.9k views",
    upcomingOADate: "Sep 28, 2026",
    tier: "Tier 1 (High Package)",
    keyTopics: ["Trie Data Structure", "DBMS Transactions", "Probability", "Binary Search"],
    totalQuestions: 38,
  },
  {
    name: "Cisco",
    color: "from-teal-500 to-cyan-600",
    views: "9.1k views",
    upcomingOADate: "Oct 02, 2026",
    tier: "Tier 2 (Product/Fintech)",
    keyTopics: ["Subnetting & Routing", "Sockets", "OS Process Deadlocks", "String Matching"],
    totalQuestions: 22,
  },
  {
    name: "Texas Instruments",
    color: "from-emerald-600 to-teal-700",
    views: "7.4k views",
    upcomingOADate: "Oct 08, 2026",
    tier: "Tier 1 (High Package)",
    keyTopics: ["C Embedded Concepts", "Bitwise Tricks", "Aptitude Math", "Data Structures"],
    totalQuestions: 19,
  },
  {
    name: "TCS Ninja / Digital",
    color: "from-pink-600 to-rose-600",
    views: "25.1k views",
    upcomingOADate: "Sep 01, 2026",
    tier: "Tier 3 (IT Services)",
    keyTopics: ["Numerical Ability", "Verbal English", "DBMS SQL Query", "Basic Coding"],
    totalQuestions: 50,
  },
];

export const OA_CALENDAR_EVENTS: OACalendarEvent[] = [
  {
    id: "cal-1",
    company: "TCS Digital / Prime",
    role: "System Engineer & Developer",
    date: "Sep 01, 2026",
    time: "10:00 AM IST",
    status: "Closing Soon",
    type: "National Hiring",
    eligibleBatches: "2026 / 2027 Passing",
  },
  {
    id: "cal-2",
    company: "Barclays",
    role: "Technology Analyst 2026",
    date: "Sep 05, 2026",
    time: "02:00 PM IST",
    status: "Registration Open",
    type: "On-Campus",
    eligibleBatches: "CS / IT / AI-DS",
  },
  {
    id: "cal-3",
    company: "Google STEP / SWE",
    role: "Software Engineering Intern",
    date: "Sep 12, 2026",
    time: "06:00 PM IST",
    status: "Registration Open",
    type: "Off-Campus",
    eligibleBatches: "Pre-final / Final Year",
  },
  {
    id: "cal-4",
    company: "Qualcomm",
    role: "Associate Software Engineer",
    date: "Sep 22, 2026",
    time: "11:00 AM IST",
    status: "Upcoming",
    type: "On-Campus",
    eligibleBatches: "ECE / CS / IT",
  },
];

export const OA_QUESTIONS: OAQuestion[] = [
  // --- Aptitude ---
  {
    id: "apt-1",
    title: "Work & Time - Synergistic Efficiency",
    category: "Aptitude",
    company: "Barclays",
    difficulty: "Easy",
    tags: ["Time & Work", "Aptitude", "Ratio"],
    description: "A can complete a piece of software project in 12 days. B is 50% more efficient than A. In how many days can B complete the same project working alone?",
    options: ["6 days", "8 days", "9 days", "10 days"],
    correctOptionIndex: 1,
    explanation: "Ratio of efficiency of A to B = 100 : 150 = 2 : 3. Since Time is inversely proportional to efficiency, Time taken by B = 12 * (2 / 3) = 8 days.",
    askedInYear: "2025",
  },
  {
    id: "apt-2",
    title: "Probability - Server Latency Failures",
    category: "Aptitude",
    company: "Microsoft",
    difficulty: "Medium",
    tags: ["Probability", "Combinatorics", "Aptitude"],
    description: "In a microservices cluster of 5 servers, 2 servers are faulty. If 3 servers are picked at random to route a request, what is the probability that at least one faulty server is selected?",
    options: ["7/10", "9/10", "3/5", "1/2"],
    correctOptionIndex: 1,
    explanation: "Probability of picking NO faulty server (all 3 non-faulty out of 3 total non-faulty) = C(3,3) / C(5,3) = 1 / 10. Therefore, P(at least 1 faulty) = 1 - 1/10 = 9/10.",
    askedInYear: "2025",
  },
  {
    id: "apt-3",
    title: "Permutations - Network Router Ports",
    category: "Aptitude",
    company: "Cisco",
    difficulty: "Medium",
    tags: ["Combinatorics", "Aptitude"],
    description: "In how many distinct ways can 6 distinct network cables be plugged into 6 router ports such that cable 1 and cable 2 are never plugged into adjacent ports?",
    options: ["240", "480", "504", "720"],
    correctOptionIndex: 1,
    explanation: "Total permutations = 6! = 720. Number of ways cable 1 and 2 are TOGETHER = 2! * 5! = 2 * 120 = 240. Ways where they are NOT adjacent = 720 - 240 = 480.",
    askedInYear: "2025",
  },

  // --- DBMS ---
  {
    id: "dbms-1",
    title: "ACID Properties & Isolation Levels",
    category: "DBMS",
    company: "Barclays",
    difficulty: "Medium",
    tags: ["Transactions", "ACID", "SQL"],
    description: "Which transaction isolation level prevents 'Dirty Reads' but allows 'Non-Repeatable Reads'?",
    options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
    correctOptionIndex: 1,
    explanation: "'Read Committed' ensures that any data read was committed at the moment it is read, preventing Dirty Reads. However, another transaction can modify the data between two reads, causing Non-Repeatable Reads.",
    askedInYear: "2025",
  },
  {
    id: "dbms-2",
    title: "SQL Nth Highest Salary Query",
    category: "DBMS",
    company: "Titan",
    difficulty: "Medium",
    tags: ["SQL", "Subqueries", "Window Functions"],
    description: "Which SQL query correctly retrieves the 2nd highest salary from an `Employee` table without using `LIMIT`?",
    options: [
      "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
      "SELECT salary FROM Employee ORDER BY salary DESC OFFSET 1;",
      "SELECT DISTINCT salary FROM Employee GROUP BY salary HAVING COUNT(*) = 2;",
      "SELECT salary FROM Employee WHERE ROWNUM = 2;"
    ],
    correctOptionIndex: 0,
    explanation: "The subquery `SELECT MAX(salary) FROM Employee` returns the highest salary. The outer query selects the MAX salary strictly less than the highest salary, yielding the exact 2nd highest salary standard across ANSI SQL.",
    codeSnippet: "-- Table Schema:\n-- Employee(id INT, name VARCHAR(50), salary INT)",
    askedInYear: "2025",
  },
  {
    id: "dbms-3",
    title: "Database Indexing - B+ Tree Traversal",
    category: "DBMS",
    company: "Google",
    difficulty: "Hard",
    tags: ["B+ Tree", "Indexing", "Performance"],
    description: "Why are B+ Trees preferred over B-Trees for database disk-based indexing?",
    options: [
      "B+ Trees store data pointers only in leaf nodes, enabling larger fan-out and sequential range scans via leaf node pointers.",
      "B+ Trees have smaller height than binary search trees only.",
      "B+ Trees do not require rebalancing during insertions.",
      "B-Trees cannot handle duplicate key values."
    ],
    correctOptionIndex: 0,
    explanation: "In B+ Trees, internal nodes only store key search pointers while ALL record pointers and actual data are stored at the leaf level. Leaves are linked sequentially, making range queries (BETWEEN x AND y) extremely fast.",
    askedInYear: "2024",
  },

  // --- Computer Networks ---
  {
    id: "cn-1",
    title: "TCP 3-Way Handshake Protocols",
    category: "Computer Networks",
    company: "Qualcomm",
    difficulty: "Easy",
    tags: ["TCP/IP", "Networking", "Handshake"],
    description: "In the TCP 3-way handshake, what flags are sent in the second packet from the Server to the Client?",
    options: ["SYN", "ACK", "SYN-ACK", "FIN-ACK"],
    correctOptionIndex: 2,
    explanation: "Step 1: Client -> SYN. Step 2: Server -> SYN-ACK (acknowledging client SYN and sending server SYN). Step 3: Client -> ACK.",
    askedInYear: "2025",
  },
  {
    id: "cn-2",
    title: "CIDR Subnetting Calculation",
    category: "Computer Networks",
    company: "Cisco",
    difficulty: "Medium",
    tags: ["Subnetting", "IP Routing", "CIDR"],
    description: "Given an IP address 192.168.10.0/26, how many usable host IP addresses are available in this subnet?",
    options: ["64", "62", "30", "128"],
    correctOptionIndex: 1,
    explanation: "A /26 subnet leaves 32 - 26 = 6 bits for hosts. Total addresses = 2^6 = 64. Usable host IPs = 64 - 2 (subtracting Network ID and Broadcast address) = 62 usable IPs.",
    askedInYear: "2025",
  },
  {
    id: "cn-3",
    title: "DNS Resolution Protocol Stack",
    category: "Computer Networks",
    company: "Microsoft",
    difficulty: "Easy",
    tags: ["DNS", "UDP", "Protocols"],
    description: "Which transport protocol is primarily used by DNS for standard client query resolution and why?",
    options: [
      "TCP, because DNS requires guaranteed packet order.",
      "UDP on port 53, because it is fast, low overhead for small request-response payloads.",
      "HTTP/2 over TLS strictly.",
      "ICMP broadcast queries."
    ],
    correctOptionIndex: 1,
    explanation: "DNS query responses are generally small (< 512 bytes) and fit in a single packet. UDP port 53 avoids handshake overhead, making DNS lookups fast.",
    askedInYear: "2024",
  },

  // --- Operating Systems ---
  {
    id: "os-1",
    title: "Deadlock Prevention - Banker's Algorithm",
    category: "Operating Systems",
    company: "Qualcomm",
    difficulty: "Hard",
    tags: ["Deadlock", "Bankers Algorithm", "OS"],
    description: "Which condition among the 4 Coffman conditions is violated by the Banker's Algorithm to avoid deadlocks?",
    options: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Circular Wait"],
    correctOptionIndex: 3,
    explanation: "The Banker's Algorithm checks resource allocation states dynamically to ensure the system NEVER enters an unsafe state, thereby breaking the Circular Wait condition.",
    askedInYear: "2025",
  },
  {
    id: "os-2",
    title: "Page Faults & LRU Cache Mechanics",
    category: "Operating Systems",
    company: "Texas Instruments",
    difficulty: "Medium",
    tags: ["Virtual Memory", "Paging", "LRU"],
    description: "Consider a virtual memory system with 3 page frames. For page reference string: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 using LRU, how many page faults occur?",
    options: ["7", "9", "10", "12"],
    correctOptionIndex: 2,
    explanation: "Tracing frame contents with 3 frames under LRU results in exactly 10 page faults for this reference string.",
    askedInYear: "2024",
  },

  // --- DSA & Coding (LeetCode-Style OA Challenges) ---
  {
    id: "dsa-1",
    title: "Sliding Window Maximum (K-Window)",
    category: "DSA & Coding",
    company: "Google",
    difficulty: "Hard",
    tags: ["Deque", "Sliding Window", "Monotonic Queue", "Arrays"],
    description: "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.",
    isCoding: true,
    examples: [
      {
        input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
        output: "[3,3,5,5,6,7]",
        explanation: "Window position                Max\n---------------               -----\n[1  3  -1] -3  5  3  6  7       3\n 1 [3  -1  -3] 5  3  6  7       3\n 1  3 [-1  -3  5] 3  6  7       5\n 1  3  -1 [-3  5  3] 6  7       5\n 1  3  -1  -3 [5  3  6] 7       6\n 1  3  -1  -3  5 [3  6  7]      7"
      },
      {
        input: "nums = [1], k = 1",
        output: "[1]"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "1 <= k <= nums.length",
      "Optimal Time Complexity: O(N)",
      "Optimal Space Complexity: O(k)"
    ],
    starterCodes: {
      python: `from collections import deque

def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    # Return array of maximum values for each window
    q = deque()
    res = []
    for i, n in enumerate(nums):
        while q and nums[q[-1]] < n:
            q.pop()
        q.append(i)
        if q[0] <= i - k:
            q.popleft()
        if i >= k - 1:
            res.append(nums[q[0]])
    return res
`,
      javascript: `function maxSlidingWindow(nums, k) {
    const res = [];
    const deque = []; // store indices
    for (let i = 0; i < nums.length; i++) {
        while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }
        deque.push(i);
        if (deque[0] <= i - k) deque.shift();
        if (i >= k - 1) res.push(nums[deque[0]]);
    }
    return res;
}`,
      cpp: `#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> result;
        for (int i = 0; i < nums.size(); i++) {
            while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
            dq.push_back(i);
            if (dq.front() <= i - k) dq.pop_front();
            if (i >= k - 1) result.push_back(nums[dq.front()]);
        }
        return result;
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || k <= 0) return new int[0];
        int n = nums.length;
        int[] r = new int[n - k + 1];
        int ri = 0;
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < nums.length; i++) {
            while (!q.isEmpty() && q.peek() < i - k + 1) q.poll();
            while (!q.isEmpty() && nums[q.peekLast()] < nums[i]) q.pollLast();
            q.offer(i);
            if (i >= k - 1) r[ri++] = nums[q.peek()];
        }
        return r;
    }
}`
    },
    testCases: [
      { id: 1, input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", expected: "[3, 3, 5, 5, 6, 7]", function_call: "maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)" },
      { id: 2, input: "nums = [1], k = 1", expected: "[1]", function_call: "maxSlidingWindow([1], 1)" }
    ],
    explanation: "A monotonic decreasing deque stores indices of elements in decreasing order of value. When the window slides, elements older than i - k are purged from the front. Each index enters and leaves the deque at most once, yielding strictly O(N) runtime.",
    askedInYear: "2025"
  },
  {
    id: "dsa-2",
    title: "Longest Substring Without Repeating Characters",
    category: "DSA & Coding",
    company: "Barclays",
    difficulty: "Medium",
    tags: ["Hash Map", "Two Pointers", "Sliding Window", "Strings"],
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    isCoding: true,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.'
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
      "Optimal Time Complexity: O(N)",
      "Optimal Space Complexity: O(min(m, n))"
    ],
    starterCodes: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    seen = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in seen:
            left = max(left, seen[char] + 1)
        seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len
`,
      javascript: `function lengthOfLongestSubstring(s) {
    const map = new Map();
    let left = 0, maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        if (map.has(s[right])) {
            left = Math.max(left, map.get(s[right]) + 1);
        }
        map.set(s[right], right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> charMap;
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            if (charMap.count(s[right])) {
                left = max(left, charMap[s[right]] + 1);
            }
            charMap[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c)) {
                left = Math.max(left, map.get(c) + 1);
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`
    },
    testCases: [
      { id: 1, input: 's = "abcabcbb"', expected: "3", function_call: 'lengthOfLongestSubstring("abcabcbb")' },
      { id: 2, input: 's = "bbbbb"', expected: "1", function_call: 'lengthOfLongestSubstring("bbbbb")' },
      { id: 3, input: 's = "pwwkew"', expected: "3", function_call: 'lengthOfLongestSubstring("pwwkew")' }
    ],
    explanation: "Maintain a sliding window [left, right] where characters are unique. A Hash Table stores the most recent index of each character, allowing the left pointer to jump directly past duplicates in O(1) amortized time.",
    askedInYear: "2025"
  },
  {
    id: "oa-google-1",
    title: "Network Routing & Min Latency (Dijkstra Variant)",
    category: "DSA & Coding",
    company: "Google",
    difficulty: "Hard",
    tags: ["Graph", "Dijkstra", "Heap", "Priority Queue"],
    description: "You are given a network of `n` nodes labeled from `1` to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (u, v, w)`, where `u` is the source node, `v` is the target node, and `w` is the time it takes for a signal to travel from source to target.\n\nWe will send a signal from a given node `k`. Return the minimum time it takes for all the `n` nodes to receive the signal. If it is impossible for all the `n` nodes to receive the signal, return `-1`.",
    isCoding: true,
    examples: [
      {
        input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
        output: "2",
        explanation: "Signal starts at node 2. Reaches node 1 at time 1, node 3 at time 1, and node 4 at time 2. Total time = 2."
      },
      {
        input: "times = [[1,2,1]], n = 2, k = 1",
        output: "1"
      },
      {
        input: "times = [[1,2,1]], n = 2, k = 2",
        output: "-1",
        explanation: "Node 1 cannot be reached from node 2."
      }
    ],
    constraints: [
      "1 <= k <= n <= 100",
      "1 <= times.length <= 6000",
      "times[i].length == 3",
      "1 <= u, v <= n",
      "u != v",
      "0 <= w <= 100",
      "All the pairs (u, v) are unique."
    ],
    starterCodes: {
      python: `import heapq

def networkDelayTime(times: list[list[int]], n: int, k: int) -> int:
    graph = {}
    for u, v, w in times:
        if u not in graph: graph[u] = []
        graph[u].append((v, w))
    
    pq = [(0, k)]
    dist = {}
    while pq:
        d, node = heapq.heappop(pq)
        if node in dist: continue
        dist[node] = d
        for neighbor, weight in graph.get(node, []):
            if neighbor not in dist:
                heapq.heappush(pq, (d + weight, neighbor))
                
    return max(dist.values()) if len(dist) == n else -1
`,
      javascript: `function networkDelayTime(times, n, k) {
    // Dijkstra's algorithm for shortest network path
    return -1;
}`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        // Implement Dijkstra algorithm
        return -1;
    }
};`,
      java: `import java.util.*;

class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        // Implement Dijkstra algorithm
        return -1;
    }
}`
    },
    testCases: [
      { id: 1, input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", expected: "2", function_call: "networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2)" },
      { id: 2, input: "times = [[1,2,1]], n = 2, k = 1", expected: "1", function_call: "networkDelayTime([[1,2,1]], 2, 1)" },
      { id: 3, input: "times = [[1,2,1]], n = 2, k = 2", expected: "-1", function_call: "networkDelayTime([[1,2,1]], 2, 2)" }
    ],
    explanation: "Standard Dijkstra's Single Source Shortest Path (SSSP) algorithm using a min-heap priority queue. If the number of visited nodes equals n, return the maximum distance among all nodes.",
    askedInYear: "2025"
  },
  {
    id: "oa-amazon-1",
    title: "Warehouse Logistics: Merge Overlapping Shipments",
    category: "DSA & Coding",
    company: "Amazon",
    difficulty: "Medium",
    tags: ["Array", "Sorting", "Intervals"],
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    isCoding: true,
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4",
      "Time Complexity: O(N log N)",
      "Space Complexity: O(N)"
    ],
    starterCodes: {
      python: `def mergeIntervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged
`,
      javascript: `function mergeIntervals(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const cur of intervals) {
        if (!merged.length || merged[merged.length - 1][1] < cur[0]) {
            merged.push(cur);
        } else {
            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], cur[1]);
        }
    }
    return merged;
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged;
        for (auto& interval : intervals) {
            if (merged.empty() || merged.back()[1] < interval[0]) {
                merged.push_back(interval);
            } else {
                merged.back()[1] = max(merged.back()[1], interval[1]);
            }
        }
        return merged;
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        LinkedList<int[]> merged = new LinkedList<>();
        for (int[] interval : intervals) {
            if (merged.isEmpty() || merged.getLast()[1] < interval[0]) {
                merged.add(interval);
            } else {
                merged.getLast()[1] = Math.max(merged.getLast()[1], interval[1]);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}`
    },
    testCases: [
      { id: 1, input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1, 6], [8, 10], [15, 18]]", function_call: "mergeIntervals([[1,3],[2,6],[8,10],[15,18]])" },
      { id: 2, input: "[[1,4],[4,5]]", expected: "[[1, 5]]", function_call: "mergeIntervals([[1,4],[4,5]])" }
    ],
    explanation: "Sorting intervals by starting boundary enables sequential single-pass merging. If current start <= previous end, update the previous end with max(prev.end, current.end).",
    askedInYear: "2025"
  },
  {
    id: "oa-tcs-1",
    title: "TCS Digital Coding: Trapping Rain Water",
    category: "DSA & Coding",
    company: "TCS Ninja / Digital",
    difficulty: "Hard",
    tags: ["Two Pointers", "Dynamic Programming", "Stack", "Arrays"],
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    isCoding: true,
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped."
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9"
      }
    ],
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5",
      "Time Complexity: O(N)",
      "Space Complexity: O(1)"
    ],
    starterCodes: {
      python: `def trap(height: list[int]) -> int:
    if not height: return 0
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water
`,
      javascript: `function trap(height) {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            height[left] >= leftMax ? (leftMax = height[left]) : (water += leftMax - height[left]);
            left++;
        } else {
            height[right] >= rightMax ? (rightMax = height[right]) : (water += rightMax - height[right]);
            right--;
        }
    }
    return water;
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int left_max = 0, right_max = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= left_max) left_max = height[left];
                else water += left_max - height[left];
                left++;
            } else {
                if (height[right] >= right_max) right_max = height[right];
                else water += right_max - height[right];
                right--;
            }
        }
        return water;
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`
    },
    testCases: [
      { id: 1, input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6", function_call: "trap([0,1,0,2,1,0,1,3,2,1,2,1])" },
      { id: 2, input: "[4,2,0,3,2,5]", expected: "9", function_call: "trap([4,2,0,3,2,5])" }
    ],
    explanation: "Two pointers converging from left and right boundaries allow tracking maximum water levels with strictly O(1) auxiliary space and single-pass O(N) runtime.",
    askedInYear: "2025"
  }
];
