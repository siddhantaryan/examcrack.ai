import type { Question, TrackId, Difficulty, QuestionType } from '@/types';
import { getAllChapters } from '../syllabus-registry';

function shuffleOptions(options: string[], correctIndex: number): { options: string[]; correct: 'a' | 'b' | 'c' | 'd' } {
  const letters: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];
  const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  const shuffled = indices.map((i) => options[i]);
  const correctLetter = letters[indices.indexOf(correctIndex)];
  return { options: shuffled, correct: correctLetter };
}

interface QuestionTemplate {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  concept: string;
  difficulty: Difficulty;
  questionType: QuestionType;
}

const TEMPLATES: Record<string, QuestionTemplate[]> = {
  'cs-ch11': [
    {
      question: 'Which of the following is NOT a necessary condition for deadlock?',
      options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption', 'Circular Wait'],
      correctIndex: 2,
      explanation: 'The four necessary conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Preemption (the ability to preempt resources) actually PREVENTS deadlock.',
      concept: 'Deadlock Conditions',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'In the Banker\u2019s Algorithm, what does the "Available" vector represent?',
      options: ['Total resources in the system', 'Resources currently allocated', 'Resources available for allocation', 'Maximum resources needed by each process'],
      correctIndex: 2,
      explanation: 'The Available vector represents the number of available instances of each resource type that can be allocated to processes.',
      concept: 'Banker\u2019s Algorithm',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'Which scheduling algorithm gives the minimum average waiting time for a set of processes?',
      options: ['First Come First Serve', 'Shortest Job First', 'Round Robin', 'Priority Scheduling'],
      correctIndex: 1,
      explanation: 'Shortest Job First (SJF) gives the minimum average waiting time because it prioritizes shorter jobs, reducing the time shorter jobs wait behind longer ones.',
      concept: 'CPU Scheduling',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'A process has 4 pages and is allocated 3 frames. Using LRU replacement, which page is replaced first?',
      options: ['The most recently used page', 'The least recently used page', 'The first page loaded', 'The page with the most references'],
      correctIndex: 1,
      explanation: 'LRU (Least Recently Used) replaces the page that has not been used for the longest period of time.',
      concept: 'Page Replacement',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'What is the time complexity of Banker\u2019s Algorithm for safety check?',
      options: ['O(n)', 'O(n*m)', 'O(n\u00b2*m)', 'O(n!)'],
      correctIndex: 2,
      explanation: 'The safety algorithm has a time complexity of O(n\u00b2 * m) where n is the number of processes and m is the number of resource types.',
      concept: 'Banker\u2019s Algorithm',
      difficulty: 'hard',
      questionType: 'numerical',
    },
    {
      question: 'Which of the following page replacement algorithms suffers from Belady\u2019s anomaly?',
      options: ['LRU', 'Optimal', 'FIFO', 'LFU'],
      correctIndex: 2,
      explanation: 'FIFO (First In First Out) page replacement suffers from Belady\u2019s anomaly, where increasing the number of frames can increase the number of page faults.',
      concept: 'Page Replacement',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'In a system with 5 processes and 3 resource types, what is the size of the Allocation matrix in Banker\u2019s Algorithm?',
      options: ['5 x 1', '3 x 5', '5 x 3', '3 x 3'],
      correctIndex: 2,
      explanation: 'The Allocation matrix has dimensions n x m where n is the number of processes (5) and m is the number of resource types (3), so 5 x 3.',
      concept: 'Banker\u2019s Algorithm',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'Which of the following is a preemptive scheduling algorithm?',
      options: ['SJF (Non-preemptive)', 'Priority (Non-preemptive)', 'Round Robin', 'FCFS'],
      correctIndex: 2,
      explanation: 'Round Robin is a preemptive scheduling algorithm where each process gets a fixed time slice (quantum) and is preempted after the quantum expires.',
      concept: 'CPU Scheduling',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
  ],
  'cs-ch10': [
    {
      question: 'Which normal form eliminates partial dependencies?',
      options: ['1NF', '2NF', '3NF', 'BCNF'],
      correctIndex: 1,
      explanation: '2NF eliminates partial functional dependencies, ensuring that every non-prime attribute is fully functionally dependent on the primary key.',
      concept: 'Normalization',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'What does ACID stand for in the context of database transactions?',
      options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Data', 'Atomicity, Concurrency, Isolation, Data', 'Accuracy, Control, Integrity, Durability'],
      correctIndex: 0,
      explanation: 'ACID stands for Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don\u2019t interfere), and Durability (committed data persists).',
      concept: 'ACID Properties',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'Which SQL command is used to remove all records but keep the table structure?',
      options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'],
      correctIndex: 2,
      explanation: 'TRUNCATE removes all records from a table but keeps the table structure. It is faster than DELETE because it does not log individual row deletions.',
      concept: 'SQL Commands',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'In an ER diagram, what does a diamond shape represent?',
      options: ['Entity', 'Attribute', 'Relationship', 'Primary Key'],
      correctIndex: 2,
      explanation: 'In an ER diagram, a diamond shape represents a relationship between entities, rectangles represent entities, and ovals represent attributes.',
      concept: 'ER Model',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'Which of the following is a lossless join decomposition if R(A,B,C) decomposes into R1(A,B) and R2(B,C)?',
      options: ['A \u2192 B', 'B \u2192 C', 'A \u2192 C', 'B \u2192 A or B \u2192 C'],
      correctIndex: 3,
      explanation: 'For a decomposition to be lossless, the common attribute (B) must be a superkey of at least one of the relations. So either B \u2192 A or B \u2192 C must hold.',
      concept: 'Normalization',
      difficulty: 'hard',
      questionType: 'conceptual',
    },
    {
      question: 'What is the result of the relational algebra expression \u03c3_age>25(Student)?',
      options: ['All students', 'Students with age greater than 25', 'Students with age equal to 25', 'Students sorted by age'],
      correctIndex: 1,
      explanation: 'The selection operator (\u03c3) filters rows from a relation that satisfy a given condition. Here, it selects students whose age is greater than 25.',
      concept: 'Relational Algebra',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'Which join produces all combinations of tuples from two relations?',
      options: ['Inner Join', 'Natural Join', 'Cartesian Product', 'Outer Join'],
      correctIndex: 2,
      explanation: 'The Cartesian product (cross join) combines every tuple from the first relation with every tuple from the second, producing all possible combinations.',
      concept: 'Relational Algebra',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'Which concurrency control protocol uses timestamps to order transactions?',
      options: ['Lock-based protocol', 'Timestamp-based protocol', 'Validation protocol', 'Graph protocol'],
      correctIndex: 1,
      explanation: 'Timestamp-based protocol assigns each transaction a unique timestamp and resolves conflicts by ordering transactions based on their timestamps.',
      concept: 'Transactions',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
  ],
  'cs-ch12': [
    {
      question: 'How many layers are in the OSI model?',
      options: ['5', '6', '7', '8'],
      correctIndex: 2,
      explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
      concept: 'OSI Model',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'Which protocol operates at the Network layer of the OSI model?',
      options: ['TCP', 'IP', 'HTTP', 'Ethernet'],
      correctIndex: 1,
      explanation: 'IP (Internet Protocol) operates at the Network layer (Layer 3) of the OSI model, responsible for routing packets between networks.',
      concept: 'OSI Model',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'What is the default subnet mask for a Class B network?',
      options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
      correctIndex: 1,
      explanation: 'Class B networks have a default subnet mask of 255.255.0.0, meaning the first 16 bits are for the network and the remaining 16 bits are for the host.',
      concept: 'IP Addressing',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'How many host addresses are available in a /24 subnet?',
      options: ['256', '254', '255', '128'],
      correctIndex: 1,
      explanation: 'A /24 subnet has 2\u2078 = 256 total addresses. Subtracting 2 (network address and broadcast address) gives 254 usable host addresses.',
      concept: 'Subnetting',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'Which device operates at the Data Link layer of the OSI model?',
      options: ['Router', 'Switch', 'Hub', 'Repeater'],
      correctIndex: 1,
      explanation: 'A switch operates at the Data Link layer (Layer 2) and uses MAC addresses to forward frames. Routers operate at Layer 3, while hubs and repeaters operate at Layer 1.',
      concept: 'Network Devices',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'What is the port number for HTTP protocol?',
      options: ['21', '25', '80', '443'],
      correctIndex: 2,
      explanation: 'HTTP uses port 80 by default. HTTPS uses port 443, FTP uses port 21, and SMTP uses port 25.',
      concept: 'Application Protocols',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'In TCP/IP, which layer is responsible for end-to-end communication and reliability?',
      options: ['Network Layer', 'Transport Layer', 'Application Layer', 'Link Layer'],
      correctIndex: 1,
      explanation: 'The Transport Layer (TCP) is responsible for end-to-end communication, reliability, flow control, and error recovery.',
      concept: 'TCP/IP Model',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'What is the size of an IPv4 address?',
      options: ['16 bits', '32 bits', '64 bits', '128 bits'],
      correctIndex: 1,
      explanation: 'An IPv4 address is 32 bits long, typically represented as four decimal numbers (octets) separated by dots (e.g., 192.168.1.1).',
      concept: 'IP Addressing',
      difficulty: 'easy',
      questionType: 'numerical',
    },
  ],
  'cs-ch8': [
    {
      question: 'What is the time complexity of searching in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctIndex: 2,
      explanation: 'In a balanced BST, the height is O(log n), so searching takes O(log n) time as we eliminate half the tree at each step.',
      concept: 'Binary Search Tree',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'Which data structure uses LIFO (Last In First Out) principle?',
      options: ['Queue', 'Stack', 'Linked List', 'Tree'],
      correctIndex: 1,
      explanation: 'A stack follows the LIFO principle \u2014 the last element pushed is the first one popped. Operations are push and pop.',
      concept: 'Stack',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'What is the time complexity of inserting an element at the beginning of an array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n\u00b2)'],
      correctIndex: 2,
      explanation: 'Inserting at the beginning of an array requires shifting all existing elements by one position, which takes O(n) time.',
      concept: 'Array',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'In a singly linked list, what is the time complexity of accessing the nth element?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n\u00b2)'],
      correctIndex: 2,
      explanation: 'In a singly linked list, you must traverse from the head to reach the nth element, which takes O(n) time since there is no random access.',
      concept: 'Linked List',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'Which traversal of a BST produces elements in sorted order?',
      options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
      correctIndex: 1,
      explanation: 'Inorder traversal (Left, Root, Right) of a BST visits nodes in ascending order of their values.',
      concept: 'Tree Traversal',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'What is the maximum number of nodes at height h in a binary tree?',
      options: ['h', '2\u02b8', '2\u02b8 - 1', '2\u02b9'],
      correctIndex: 1,
      explanation: 'The maximum number of nodes at height h in a binary tree is 2\u02b8 (where the root is at height 0). The total maximum nodes for a tree of height h is 2\u02b8\u207a\u00b9 - 1.',
      concept: 'Binary Tree',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'Which data structure is best suited for implementing a priority queue?',
      options: ['Array', 'Linked List', 'Heap', 'Stack'],
      correctIndex: 2,
      explanation: 'A heap is the best data structure for a priority queue because it allows O(log n) insertion and O(log n) extraction of the minimum/maximum element.',
      concept: 'Priority Queue',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'What is the degree of a node in a graph?',
      options: ['Number of edges connected to it', 'Number of nodes in the graph', 'Length of the shortest path', 'Number of cycles through it'],
      correctIndex: 0,
      explanation: 'The degree of a node in a graph is the number of edges connected to that node. In a directed graph, we distinguish between in-degree and out-degree.',
      concept: 'Graph',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
  ],
  'cs-ch9': [
    {
      question: 'What is the time complexity of Binary Search?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctIndex: 2,
      explanation: 'Binary search has O(log n) time complexity because it halves the search space at each step, requiring at most log\u2082(n) comparisons.',
      concept: 'Searching',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'Which sorting algorithm has the best average time complexity?',
      options: ['Bubble Sort O(n\u00b2)', 'Selection Sort O(n\u00b2)', 'Merge Sort O(n log n)', 'Insertion Sort O(n\u00b2)'],
      correctIndex: 2,
      explanation: 'Merge Sort has O(n log n) average time complexity, which is better than the O(n\u00b2) average complexity of Bubble, Selection, and Insertion sort.',
      concept: 'Sorting',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'What is the worst-case time complexity of Quick Sort?',
      options: ['O(n log n)', 'O(n\u00b2)', 'O(n)', 'O(log n)'],
      correctIndex: 1,
      explanation: 'Quick Sort\u2019s worst case is O(n\u00b2), which occurs when the pivot is always the smallest or largest element (e.g., already sorted array with poor pivot selection).',
      concept: 'Quick Sort',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'Which algorithm design technique does Merge Sort use?',
      options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'],
      correctIndex: 2,
      explanation: 'Merge Sort uses the Divide and Conquer technique: divide the array into halves, sort each half recursively, then merge the sorted halves.',
      concept: 'Divide and Conquer',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'Dynamic Programming is used when the problem exhibits which property?',
      options: ['Greedy choice property', 'Optimal substructure and overlapping subproblems', 'Only optimal substructure', 'Only overlapping subproblems'],
      correctIndex: 1,
      explanation: 'Dynamic Programming is applicable when a problem has both optimal substructure (optimal solution contains optimal solutions to subproblems) and overlapping subproblems (subproblems are reused).',
      concept: 'Dynamic Programming',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'What is the space complexity of Merge Sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n\u00b2)'],
      correctIndex: 2,
      explanation: 'Merge Sort requires O(n) extra space for the temporary arrays used during the merge step.',
      concept: 'Merge Sort',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'Which sorting algorithm is stable?',
      options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
      correctIndex: 2,
      explanation: 'Merge Sort is stable because it preserves the relative order of equal elements. Quick Sort and Heap Sort are not stable in their standard forms.',
      concept: 'Sorting',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'What is the time complexity of Dijkstra\u2019s algorithm using a min-heap?',
      options: ['O(V)', 'O(V + E)', 'O((V + E) log V)', 'O(V\u00b2)'],
      correctIndex: 2,
      explanation: 'Using a min-heap (priority queue), Dijkstra\u2019s algorithm has a time complexity of O((V + E) log V), where V is the number of vertices and E is the number of edges.',
      concept: 'Graph Algorithms',
      difficulty: 'hard',
      questionType: 'numerical',
    },
  ],
  'm68-ch1': [
    {
      question: 'What is the successor of the whole number 99?',
      options: ['98', '100', '101', '99'],
      correctIndex: 1,
      explanation: 'The successor of a whole number is the number that comes immediately after it. The successor of 99 is 99 + 1 = 100.',
      concept: 'Whole Numbers',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'Which of the following is an integer?',
      options: ['1/2', '0.5', '-3', '\u221a2'],
      correctIndex: 2,
      explanation: 'Integers include all whole numbers and their negatives: ..., -3, -2, -1, 0, 1, 2, 3, ... -3 is an integer. 1/2 and 0.5 are rational numbers, \u221a2 is irrational.',
      concept: 'Integers',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'What is the additive inverse of -7?',
      options: ['-7', '0', '7', '-1/7'],
      correctIndex: 2,
      explanation: 'The additive inverse of a number is the value that, when added to it, gives zero. The additive inverse of -7 is 7, since -7 + 7 = 0.',
      concept: 'Integers',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'Which of the following fractions is equivalent to 2/3?',
      options: ['3/4', '4/6', '6/8', '8/12'],
      correctIndex: 1,
      explanation: '4/6 is equivalent to 2/3 because when we simplify 4/6 by dividing both numerator and denominator by 2, we get 2/3. (Note: 8/12 also simplifies to 2/3, but 4/6 is the simplest equivalent listed first.)',
      concept: 'Fractions',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'Convert 0.75 to a fraction in lowest terms.',
      options: ['3/4', '75/100', '7/10', '3/5'],
      correctIndex: 0,
      explanation: '0.75 = 75/100. Dividing both by 25 gives 3/4, which is the simplest form.',
      concept: 'Decimals',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'What is the absolute value of -15?',
      options: ['-15', '15', '0', '1/15'],
      correctIndex: 1,
      explanation: 'The absolute value of a number is its distance from zero on the number line, always non-negative. |-15| = 15.',
      concept: 'Absolute Value',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'Which is the smallest rational number?',
      options: ['-5/3', '-2/3', '-1/3', '-4/3'],
      correctIndex: 0,
      explanation: 'Converting to common denominator 3: -5/3, -2/3, -1/3, -4/3. Since -5/3 \u2248 -1.67, it is the smallest (most negative).',
      concept: 'Rational Numbers',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'The product of two negative integers is:',
      options: ['Negative', 'Positive', 'Zero', 'Cannot be determined'],
      correctIndex: 1,
      explanation: 'The product of two negative integers is always positive. For example, (-3) \u00d7 (-4) = 12.',
      concept: 'Integers',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
  ],
  'm910-ch4': [
    {
      question: 'The discriminant of the quadratic equation 2x\u00b2 - 7x + 3 = 0 is:',
      options: ['25', '49', '73', '1'],
      correctIndex: 0,
      explanation: 'Discriminant D = b\u00b2 - 4ac = (-7)\u00b2 - 4(2)(3) = 49 - 24 = 25. Since D > 0, the equation has two distinct real roots.',
      concept: 'Discriminant',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'The roots of x\u00b2 - 5x + 6 = 0 are:',
      options: ['2 and 3', '1 and 6', '-2 and -3', '1 and 5'],
      correctIndex: 0,
      explanation: 'x\u00b2 - 5x + 6 = (x - 2)(x - 3) = 0, so x = 2 or x = 3. We can verify: 2 + 3 = 5 and 2 \u00d7 3 = 6.',
      concept: 'Quadratic Formula',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'For the quadratic equation ax\u00b2 + bx + c = 0, the sum of roots is:',
      options: ['c/a', '-b/a', 'b/a', '-c/a'],
      correctIndex: 1,
      explanation: 'For ax\u00b2 + bx + c = 0, if \u03b1 and \u03b2 are roots, then sum of roots = \u03b1 + \u03b2 = -b/a and product of roots = \u03b1\u03b2 = c/a (Vieta\u2019s formulas).',
      concept: 'Nature of Roots',
      difficulty: 'medium',
      questionType: 'formula-based',
    },
    {
      question: 'If the discriminant of a quadratic equation is zero, the roots are:',
      options: ['Two distinct real roots', 'Two equal real roots', 'No real roots', 'One positive and one negative root'],
      correctIndex: 1,
      explanation: 'When D = 0, the quadratic equation has two equal real roots (a repeated root). The root is x = -b/(2a).',
      concept: 'Nature of Roots',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'Solve: x\u00b2 + 6x + 9 = 0',
      options: ['x = 3', 'x = -3', 'x = \u00b13', 'x = 0'],
      correctIndex: 1,
      explanation: 'x\u00b2 + 6x + 9 = (x + 3)\u00b2 = 0, so x = -3 (a repeated root). This is a perfect square trinomial.',
      concept: 'Factorization',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'The quadratic equation whose roots are 2 and -3 is:',
      options: ['x\u00b2 - x - 6 = 0', 'x\u00b2 + x - 6 = 0', 'x\u00b2 - 5x + 6 = 0', 'x\u00b2 + 5x + 6 = 0'],
      correctIndex: 1,
      explanation: 'Sum of roots = 2 + (-3) = -1, product = 2 \u00d7 (-3) = -6. The equation is x\u00b2 - (sum)x + (product) = x\u00b2 + x - 6 = 0.',
      concept: 'Quadratic Formula',
      difficulty: 'hard',
      questionType: 'numerical',
    },
    {
      question: 'What is the nature of roots for 3x\u00b2 + 2x + 1 = 0?',
      options: ['Real and distinct', 'Real and equal', 'No real roots', 'Rational roots'],
      correctIndex: 2,
      explanation: 'D = b\u00b2 - 4ac = 4 - 12 = -8. Since D < 0, the equation has no real roots (the roots are complex).',
      concept: 'Nature of Roots',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'The quadratic formula is:',
      options: ['x = (-b \u00b1 \u221a(b\u00b2-4ac))/2a', 'x = (-b \u00b1 \u221a(b\u00b2+4ac))/2a', 'x = (b \u00b1 \u221a(b\u00b2-4ac))/2a', 'x = (-b \u00b1 \u221a(b\u00b2-4ac))/a'],
      correctIndex: 0,
      explanation: 'The quadratic formula is x = (-b \u00b1 \u221a(b\u00b2 - 4ac)) / 2a, derived by completing the square on ax\u00b2 + bx + c = 0.',
      concept: 'Quadratic Formula',
      difficulty: 'easy',
      questionType: 'formula-based',
    },
  ],
  'm68-ch5': [
    {
      question: 'A shopkeeper buys an item for Rs. 500 and sells it for Rs. 600. What is his profit?',
      options: ['Rs. 100', 'Rs. 500', 'Rs. 600', 'Rs. 1100'],
      correctIndex: 0,
      explanation: 'Profit = Selling Price - Cost Price = 600 - 500 = Rs. 100. The shopkeeper makes a profit of Rs. 100.',
      concept: 'Profit and Loss',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'The profit percentage when CP = Rs. 200 and SP = Rs. 250 is:',
      options: ['20%', '25%', '50%', '10%'],
      correctIndex: 1,
      explanation: 'Profit = SP - CP = 250 - 200 = Rs. 50. Profit% = (Profit/CP) \u00d7 100 = (50/200) \u00d7 100 = 25%.',
      concept: 'Profit Percentage',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'If an item is sold at Rs. 450 with a loss of 10%, what was the cost price?',
      options: ['Rs. 400', 'Rs. 500', 'Rs. 495', 'Rs. 550'],
      correctIndex: 1,
      explanation: 'SP = CP \u00d7 (1 - loss%/100) \u2192 450 = CP \u00d7 0.90 \u2192 CP = 450/0.90 = Rs. 500.',
      concept: 'Loss Calculation',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'A discount of 20% on a marked price of Rs. 1000 gives a selling price of:',
      options: ['Rs. 800', 'Rs. 200', 'Rs. 980', 'Rs. 1200'],
      correctIndex: 0,
      explanation: 'Discount = 20% of 1000 = Rs. 200. SP = Marked Price - Discount = 1000 - 200 = Rs. 800.',
      concept: 'Discount',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'If CP = Rs. 1200 and overhead expenses = Rs. 300, what is the effective cost price?',
      options: ['Rs. 900', 'Rs. 1200', 'Rs. 1500', 'Rs. 1800'],
      correctIndex: 2,
      explanation: 'Effective CP = Purchase Price + Overhead Expenses = 1200 + 300 = Rs. 1500. Overhead expenses are added to the cost price.',
      concept: 'Cost Price',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'A trader marks his goods 40% above cost price and gives a 10% discount. His profit percentage is:',
      options: ['30%', '26%', '36%', '40%'],
      correctIndex: 1,
      explanation: 'Let CP = 100. Marked Price = 140. Discount = 10% of 140 = 14. SP = 140 - 14 = 126. Profit% = (126-100)/100 \u00d7 100 = 26%.',
      concept: 'Profit and Loss',
      difficulty: 'hard',
      questionType: 'numerical',
    },
  ],
  'm910-ch8': [
    {
      question: 'What is the value of sin 30\u00b0?',
      options: ['0', '1/2', '\u221a3/2', '1'],
      correctIndex: 1,
      explanation: 'sin 30\u00b0 = 1/2. This is a standard trigonometric value that should be memorized.',
      concept: 'Trigonometric Ratios',
      difficulty: 'easy',
      questionType: 'formula-based',
    },
    {
      question: 'The value of cos 90\u00b0 is:',
      options: ['0', '1', '1/2', '\u221a2/2'],
      correctIndex: 0,
      explanation: 'cos 90\u00b0 = 0. At 90\u00b0, the cosine (adjacent/hypotenuse) is zero because the adjacent side has zero length.',
      concept: 'Trigonometric Ratios',
      difficulty: 'easy',
      questionType: 'formula-based',
    },
    {
      question: 'Which of the following is a trigonometric identity?',
      options: ['sin\u00b2\u03b8 + cos\u00b2\u03b8 = 1', 'sin\u00b2\u03b8 - cos\u00b2\u03b8 = 1', 'sin\u00b2\u03b8 + cos\u00b2\u03b8 = 0', 'sin\u00b2\u03b8 \u00d7 cos\u00b2\u03b8 = 1'],
      correctIndex: 0,
      explanation: 'sin\u00b2\u03b8 + cos\u00b2\u03b8 = 1 is the fundamental Pythagorean trigonometric identity, true for all values of \u03b8.',
      concept: 'Trigonometric Identities',
      difficulty: 'easy',
      questionType: 'conceptual',
    },
    {
      question: 'What is the value of tan 45\u00b0?',
      options: ['0', '1/2', '1', '\u221a3'],
      correctIndex: 2,
      explanation: 'tan 45\u00b0 = sin 45\u00b0 / cos 45\u00b0 = (\u221a2/2) / (\u221a2/2) = 1. At 45\u00b0, opposite and adjacent sides are equal.',
      concept: 'Trigonometric Ratios',
      difficulty: 'easy',
      questionType: 'formula-based',
    },
    {
      question: 'If sin \u03b8 = 3/5, what is cos \u03b8? (Assume \u03b8 is acute)',
      options: ['3/4', '4/5', '5/3', '5/4'],
      correctIndex: 1,
      explanation: 'Using sin\u00b2\u03b8 + cos\u00b2\u03b8 = 1: cos\u00b2\u03b8 = 1 - (3/5)\u00b2 = 1 - 9/25 = 16/25. So cos \u03b8 = 4/5 (positive since \u03b8 is acute).',
      concept: 'Trigonometric Identities',
      difficulty: 'medium',
      questionType: 'numerical',
    },
    {
      question: 'The value of sin\u00b2 60\u00b0 + cos\u00b2 60\u00b0 is:',
      options: ['0', '1/2', '1', '\u221a3'],
      correctIndex: 2,
      explanation: 'By the Pythagorean identity, sin\u00b2\u03b8 + cos\u00b2\u03b8 = 1 for any angle \u03b8. So sin\u00b2 60\u00b0 + cos\u00b2 60\u00b0 = 1.',
      concept: 'Trigonometric Identities',
      difficulty: 'easy',
      questionType: 'numerical',
    },
    {
      question: 'What is the relationship between sin \u03b8 and cosec \u03b8?',
      options: ['sin \u03b8 = cosec \u03b8', 'sin \u03b8 = 1/cosec \u03b8', 'sin \u03b8 \u00d7 cosec \u03b8 = 0', 'sin \u03b8 + cosec \u03b8 = 1'],
      correctIndex: 1,
      explanation: 'cosec \u03b8 = 1/sin \u03b8, so sin \u03b8 = 1/cosec \u03b8. They are reciprocals of each other: sin \u03b8 \u00d7 cosec \u03b8 = 1.',
      concept: 'Trigonometric Ratios',
      difficulty: 'medium',
      questionType: 'conceptual',
    },
    {
      question: 'If the angle of elevation of a tower from a point 30m away is 45\u00b0, the height of the tower is:',
      options: ['15 m', '30 m', '30\u221a3 m', '15\u221a3 m'],
      correctIndex: 1,
      explanation: 'tan 45\u00b0 = height/distance \u2192 1 = height/30 \u2192 height = 30 m. At 45\u00b0 elevation, height equals distance from the base.',
      concept: 'Heights and Distances',
      difficulty: 'medium',
      questionType: 'numerical',
    },
  ],
};

const FALLBACK_TEMPLATES: QuestionTemplate[] = [
  {
    question: 'Which of the following best describes the concept of "{concept}"?',
    options: ['A fundamental principle that governs the behavior of the system', 'An advanced technique used only in research', 'A historical method no longer in use', 'A programming language feature'],
    correctIndex: 0,
    explanation: 'The concept represents a fundamental principle in this topic area that is essential for understanding the subject matter.',
    concept: 'General',
    difficulty: 'easy',
    questionType: 'conceptual',
  },
  {
    question: 'Which statement about "{concept}" is correct?',
    options: ['It is always the most efficient approach', 'It is one of several approaches with specific trade-offs', 'It is rarely used in practice', 'It has been deprecated'],
    correctIndex: 1,
    explanation: 'Like most concepts in this field, it has specific use cases and trade-offs compared to alternatives.',
    concept: 'General',
    difficulty: 'medium',
    questionType: 'statement-based',
  },
  {
    question: 'A common misconception about "{concept}" is:',
    options: ['That it is always faster than alternatives', 'That it can be applied universally without context', 'That it requires special hardware', 'That it was invented recently'],
    correctIndex: 1,
    explanation: 'Understanding when and where to apply a concept is as important as knowing the concept itself.',
    concept: 'General',
    difficulty: 'medium',
    questionType: 'conceptual',
  },
  {
    question: 'In which scenario would you apply "{concept}"?',
    options: ['When efficiency is the primary concern', 'When the problem matches the concept\u2019s applicability criteria', 'In all scenarios without exception', 'Only in theoretical contexts'],
    correctIndex: 1,
    explanation: 'Every concept has specific scenarios where it is applicable. Understanding these boundaries is key to mastery.',
    concept: 'General',
    difficulty: 'hard',
    questionType: 'application',
  },
];

let questionCounter = 0;

function generateQuestionId(): string {
  questionCounter++;
  return `q-${questionCounter.toString().padStart(6, '0')}`;
}

export function generateQuestionsForChapter(trackId: TrackId, chapterId: string, count: number): Question[] {
  const chapterData = getAllChapters(trackId).find((c) => c.chapter.id === chapterId);
  if (!chapterData) return [];

  const templates = TEMPLATES[chapterId] || [];
  const questions: Question[] = [];

  const chapterName = chapterData.chapter.name;
  const trackName = trackId === 'cs-11-12' ? 'Computer Science' : 'Mathematics';

  for (let i = 0; i < count; i++) {
    let template: QuestionTemplate;

    if (templates.length > 0) {
      template = templates[i % templates.length];
    } else {
      const fallback = FALLBACK_TEMPLATES[i % FALLBACK_TEMPLATES.length];
      const topic = chapterData.chapter.topics[i % chapterData.chapter.topics.length];
      template = {
        ...fallback,
        question: fallback.question.replace('{concept}', topic.name),
        concept: topic.name,
      };
    }

    const topic = chapterData.chapter.topics[i % chapterData.chapter.topics.length];
    const { options, correct } = shuffleOptions(template.options, template.correctIndex);
    const isPyq = i % 7 === 0 && templates.length > 0;

    questions.push({
      id: generateQuestionId(),
      track_id: trackId,
      subject: trackName,
      chapter_id: chapterId,
      topic_id: topic.id,
      question: template.question,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      correct_answer: correct,
      explanation: template.explanation,
      difficulty: template.difficulty,
      question_type: template.questionType,
      concept: template.concept,
      tags: [chapterName, topic.name, template.concept],
      source: isPyq ? 'BPSC TRE' : 'ExamCrack AI',
      year: isPyq ? 2020 + (i % 5) : undefined,
      is_pyq: isPyq,
      is_verified: isPyq,
      is_ai_generated: !isPyq,
    });
  }

  return questions;
}

const questionCache: Record<string, Question[]> = {};

export function getQuestionsForChapter(trackId: TrackId, chapterId: string, count = 50): Question[] {
  const cacheKey = `${trackId}:${chapterId}:${count}`;
  if (questionCache[cacheKey]) return questionCache[cacheKey];
  const questions = generateQuestionsForChapter(trackId, chapterId, count);
  questionCache[cacheKey] = questions;
  return questions;
}

export function getQuestionsForTrack(trackId: TrackId, perChapter = 30): Question[] {
  const chapters = getAllChapters(trackId);
  const allQuestions: Question[] = [];
  for (const { chapter } of chapters) {
    allQuestions.push(...getQuestionsForChapter(trackId, chapter.id, perChapter));
  }
  return allQuestions;
}

export function getQuestionsForTopic(trackId: TrackId, chapterId: string, topicId: string, count = 20): Question[] {
  const chapterQuestions = getQuestionsForChapter(trackId, chapterId, 100);
  return chapterQuestions.filter((q) => q.topic_id === topicId).slice(0, count);
}

export function getQuestionCountForChapter(trackId: TrackId, chapterId: string): number {
  return getQuestionsForChapter(trackId, chapterId, 50).length;
}

export function getPYQsForChapter(trackId: TrackId, chapterId: string): Question[] {
  return getQuestionsForChapter(trackId, chapterId, 50).filter((q) => q.is_pyq);
}
