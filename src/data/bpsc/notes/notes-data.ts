import type { ChapterNote } from '@/types';

export const NOTES: Record<string, ChapterNote> = {
  'cs-ch11': {
    chapter_id: 'cs-ch11',
    sections: [
      {
        heading: '1. Introduction',
        type: 'text',
        content: 'An Operating System (OS) is system software that manages computer hardware and software resources and provides common services for computer programs. It acts as an intermediary between users and the computer hardware. The OS manages memory, processes, files, and provides a user interface. Key functions include process management, memory management, file management, device management, security, and user interface provision.',
      },
      {
        heading: '2. Process Management',
        type: 'text',
        content: 'A process is a program in execution. It consists of the program code, current activity (program counter, registers), stack, and data section. The OS manages processes through process scheduling, creation, and termination.',
      },
      {
        heading: 'Process States',
        type: 'list',
        content: 'A process transitions through several states during its lifecycle:',
        items: [
          'New: Process is being created',
          'Ready: Process is waiting to be assigned to a processor',
          'Running: Process instructions are being executed',
          'Waiting/Blocked: Process is waiting for an event (I/O, signal)',
          'Terminated: Process has finished execution',
        ],
      },
      {
        heading: '3. CPU Scheduling',
        type: 'text',
        content: 'CPU scheduling is the process of deciding which process in the ready queue should be allocated the CPU. The goal is to maximize CPU utilization and throughput while minimizing waiting time and response time.',
      },
      {
        heading: 'Scheduling Algorithms',
        type: 'table',
        content: 'Comparison of major CPU scheduling algorithms:',
        table: {
          headers: ['Algorithm', 'Type', 'Preemptive?', 'Criteria', 'Complexity'],
          rows: [
            ['FCFS', 'Non-preemptive', 'No', 'Arrival time', 'O(n)'],
            ['SJF', 'Non-preemptive', 'No', 'Burst time (shortest)', 'O(n log n)'],
            ['SRTF', 'Preemptive SJF', 'Yes', 'Remaining burst time', 'O(n log n)'],
            ['Round Robin', 'Preemptive', 'Yes', 'Time quantum', 'O(n)'],
            ['Priority', 'Both', 'Configurable', 'Priority number', 'O(n)'],
          ],
        },
      },
      {
        heading: '4. Deadlocks',
        type: 'text',
        content: 'A deadlock is a situation where two or more processes are unable to proceed because each is waiting for a resource held by the other. Deadlocks are a critical problem in operating systems.',
      },
      {
        heading: 'Deadlock Conditions (Coffman Conditions)',
        type: 'warning',
        content: 'All four conditions must hold simultaneously for a deadlock to occur:',
        items: [
          'Mutual Exclusion: At least one resource must be held in non-shareable mode',
          'Hold and Wait: A process holding at least one resource is waiting to acquire additional resources',
          'No Preemption: Resources cannot be preempted; they must be released voluntarily',
          'Circular Wait: A set of processes form a circular chain where each holds a resource the next needs',
        ],
      },
      {
        heading: 'Deadlock Handling Strategies',
        type: 'list',
        content: 'Four strategies to deal with deadlocks:',
        items: [
          'Deadlock Prevention: Ensure at least one Coffman condition cannot hold',
          'Deadlock Avoidance: Use Banker\u2019s Algorithm to check safe state before allocation',
          'Deadlock Detection: Allow deadlock to occur, then detect and recover',
          'Deadlock Ignorance: Ignore deadlock (used by most modern OS like Unix, Windows)',
        ],
      },
      {
        heading: '5. Banker\u2019s Algorithm',
        type: 'tip',
        content: 'Key formula: Available[j] = Total[j] - \u03a3 Allocation[i][j] for all processes i. A state is safe if there exists a sequence of all processes such that each can complete with available resources.',
      },
      {
        heading: '6. Memory Management',
        type: 'text',
        content: 'Memory management involves managing the computer\u2019s primary memory. The OS keeps track of the status of each memory location (allocated or free), decides which processes get memory, and allocates/deallocates memory as needed.',
      },
      {
        heading: 'Paging vs Segmentation',
        type: 'table',
        content: 'Comparison of paging and segmentation:',
        table: {
          headers: ['Feature', 'Paging', 'Segmentation'],
          rows: [
            ['Unit size', 'Fixed-size pages', 'Variable-size segments'],
            ['Fragmentation', 'Internal fragmentation', 'External fragmentation'],
            ['Addressing', 'Page number + offset', 'Segment number + offset'],
            ['Hardware', 'Page table', 'Segment table'],
            ['Visibility', 'Transparent to user', 'Visible to user'],
          ],
        },
      },
      {
        heading: '7. Page Replacement Algorithms',
        type: 'list',
        content: 'When a page fault occurs and no free frame is available, the OS must replace a page:',
        items: [
          'FIFO: Replace the oldest page (first in). Suffers from Belady\u2019s anomaly.',
          'LRU: Replace the least recently used page. Good performance but requires hardware support.',
          'Optimal: Replace the page not used for the longest time in the future. Theoretical optimum.',
          'LFU: Replace the page with the smallest reference count.',
          'Clock (Second Chance): Approximation of LRU using a reference bit.',
        ],
      },
      {
        heading: '8. File Systems',
        type: 'text',
        content: 'A file system controls how data is stored and retrieved on a disk. It provides mechanisms for file creation, deletion, access control, and organization through directories.',
      },
      {
        heading: '9. Important Formulas',
        type: 'formula',
        content: 'Key formulas for OS problems:',
        items: [
          'CPU Utilization = (CPU Busy Time / Total Time) \u00d7 100',
          'Throughput = Number of processes completed per unit time',
          'Turnaround Time = Completion Time - Arrival Time',
          'Waiting Time = Turnaround Time - Burst Time',
          'Response Time = First CPU Allocation - Arrival Time',
          'Page Fault Rate = (Number of Page Faults / Total References) \u00d7 100',
          'Effective Access Time = (1-p) \u00d7 m + p \u00d7 (page fault time)',
        ],
      },
      {
        heading: '10. Common Mistakes',
        type: 'warning',
        content: 'Frequent errors students make:',
        items: [
          'Confusing deadlock prevention with deadlock avoidance',
          'Forgetting that SJF can cause starvation (use aging to prevent)',
          'Mixing up internal vs external fragmentation',
          'Not knowing that Belady\u2019s anomaly only affects FIFO, not LRU or Optimal',
          'Confusing thread context switch (lighter) with process context switch (heavier)',
        ],
      },
      {
        heading: '11. Exam Tips',
        type: 'tip',
        content: 'Quick tips for BPSC OS questions:',
        items: [
          'Memorize the four Coffman conditions \u2014 they appear in almost every OS exam',
          'Practice Banker\u2019s Algorithm problems with small examples (2-3 processes)',
          'Know the time complexities: Safety check is O(n\u00b2 \u00d7 m)',
          'Remember: LRU and Optimal never suffer from Belady\u2019s anomaly',
          'SJF gives minimum average waiting time but can cause starvation',
        ],
      },
      {
        heading: '12. Quick Revision',
        type: 'list',
        content: 'One-page summary:',
        items: [
          'Process states: New \u2192 Ready \u2192 Running \u2192 Waiting \u2192 Terminated',
          'Scheduling: FCFS, SJF, SRTF, RR, Priority',
          'Deadlock: 4 conditions, Prevention/Avoidance/Detection/Ignorance',
          'Banker\u2019s Algorithm: Safe state check O(n\u00b2m)',
          'Memory: Paging (internal frag), Segmentation (external frag)',
          'Page Replacement: FIFO (Belady), LRU (good), Optimal (theoretical best)',
          'File Systems: FAT, NTFS, ext4, inodes',
        ],
      },
    ],
  },
  'cs-ch10': {
    chapter_id: 'cs-ch10',
    sections: [
      {
        heading: '1. Introduction',
        type: 'text',
        content: 'A Database Management System (DBMS) is software that enables users to create, maintain, and access databases. It provides an interface between the physical data and the application programs, ensuring data independence, integrity, and security.',
      },
      {
        heading: '2. Database Architecture',
        type: 'text',
        content: 'The three-schema architecture separates the database into three levels: External (user views), Conceptual (logical structure), and Internal (physical storage). This provides logical and physical data independence.',
      },
      {
        heading: '3. ER Model',
        type: 'text',
        content: 'The Entity-Relationship (ER) model is a high-level data model used for conceptual database design. It uses entities (rectangles), attributes (ovals), relationships (diamonds), and cardinality.',
      },
      {
        heading: 'ER Model Components',
        type: 'list',
        content: 'Key components of the ER model:',
        items: [
          'Entity: Real-world object (Student, Course)',
          'Attribute: Property of an entity (Name, Roll No)',
          'Relationship: Association between entities (Enrolls)',
          'Cardinality: One-to-One, One-to-Many, Many-to-Many',
          'Primary Key: Attribute that uniquely identifies an entity',
          'Foreign Key: Attribute referencing a primary key in another entity',
        ],
      },
      {
        heading: '4. Relational Algebra',
        type: 'text',
        content: 'Relational algebra is a procedural query language that operates on relations. It forms the theoretical basis for SQL.',
      },
      {
        heading: 'Relational Algebra Operations',
        type: 'table',
        content: 'Fundamental operations in relational algebra:',
        table: {
          headers: ['Operation', 'Symbol', 'Description'],
          rows: [
            ['Select', '\u03c3', 'Filters rows satisfying a condition'],
            ['Project', '\u03c0', 'Selects specific columns'],
            ['Union', '\u222a', 'Combines tuples from two relations'],
            ['Difference', '\u2212', 'Tuples in R1 but not in R2'],
            ['Cartesian Product', '\u00d7', 'All combinations of tuples'],
            ['Rename', '\u03c1', 'Renames a relation/attribute'],
            ['Natural Join', '\u22c8', 'Combines on common attributes'],
            ['Division', '\u00f7', 'Finds tuples related to all'],
          ],
        },
      },
      {
        heading: '5. SQL Commands',
        type: 'table',
        content: 'SQL command categories:',
        table: {
          headers: ['Category', 'Commands', 'Purpose'],
          rows: [
            ['DDL', 'CREATE, ALTER, DROP, TRUNCATE', 'Define/modify structure'],
            ['DML', 'INSERT, UPDATE, DELETE', 'Manipulate data'],
            ['DQL', 'SELECT', 'Query data'],
            ['DCL', 'GRANT, REVOKE', 'Control access'],
            ['TCL', 'COMMIT, ROLLBACK, SAVEPOINT', 'Manage transactions'],
          ],
        },
      },
      {
        heading: '6. Normalization',
        type: 'text',
        content: 'Normalization is the process of organizing data to reduce redundancy and improve data integrity. Each normal form eliminates specific types of anomalies.',
      },
      {
        heading: 'Normal Forms',
        type: 'table',
        content: 'Progression of normal forms:',
        table: {
          headers: ['Normal Form', 'Eliminates', 'Rule'],
          rows: [
            ['1NF', 'Repeating groups', 'Atomic values, unique rows'],
            ['2NF', 'Partial dependencies', 'Full functional dependency on PK'],
            ['3NF', 'Transitive dependencies', 'No non-key attribute depends on another non-key attribute'],
            ['BCNF', 'Anomalies from multiple candidate keys', 'Every determinant is a superkey'],
            ['4NF', 'Multi-valued dependencies', 'No multi-valued dependencies'],
            ['5NF', 'Join dependencies', 'No lossless join decomposition possible'],
          ],
        },
      },
      {
        heading: '7. ACID Properties',
        type: 'warning',
        content: 'Critical for transaction management:',
        items: [
          'Atomicity: All operations execute completely or none at all',
          'Consistency: Database transitions from one valid state to another',
          'Isolation: Concurrent transactions do not interfere with each other',
          'Durability: Committed transactions persist even after system failure',
        ],
      },
      {
        heading: '8. Concurrency Control',
        type: 'list',
        content: 'Techniques to manage concurrent transactions:',
        items: [
          'Lock-based: Shared and Exclusive locks',
          'Two-Phase Locking (2PL): Growing and Shrinking phases',
          'Timestamp-based: Order by timestamp, older transactions have priority',
          'Validation-based: Check at validation phase before commit',
          'Multi-version (MVCC): Multiple versions of data maintained',
        ],
      },
      {
        heading: '9. Important Formulas',
        type: 'formula',
        content: 'Key DBMS formulas and concepts:',
        items: [
          'Lossless Join: Common attribute must be superkey of at least one relation',
          'Functional Dependency: X \u2192 Y means Y is functionally dependent on X',
          'Armstrong Axioms: Reflexivity, Augmentation, Transitivity',
          'Closure of FD set: F+ = all FDs logically implied by F',
          'Candidate Key: Minimal superkey (no subset is a superkey)',
        ],
      },
      {
        heading: '10. Common Mistakes',
        type: 'warning',
        content: 'Frequent errors:',
        items: [
          'Confusing TRUNCATE (DDL, no rollback) with DELETE (DML, rollbackable)',
          'Mixing up 2NF (partial dependency) with 3NF (transitive dependency)',
          'Forgetting that BCNF is stronger than 3NF',
          'Not knowing that natural join requires common attributes',
          'Confusing shared lock (read) with exclusive lock (write)',
        ],
      },
      {
        heading: '11. Exam Tips',
        type: 'tip',
        content: 'BPSC DBMS tips:',
        items: [
          'Memorize the normal form hierarchy: 1NF \u2192 2NF \u2192 3NF \u2192 BCNF \u2192 4NF \u2192 5NF',
          'Practice finding candidate keys from functional dependencies',
          'Know the difference between DELETE, TRUNCATE, and DROP',
          'Remember ACID properties \u2014 frequently asked',
          'Practice ER-to-relational mapping exercises',
        ],
      },
      {
        heading: '12. Quick Revision',
        type: 'list',
        content: 'Summary:',
        items: [
          'ER Model: Entities, Attributes, Relationships, Cardinality',
          'Relational Algebra: \u03c3 (select), \u03c0 (project), \u222a (union), \u00d7 (product)',
          'SQL: DDL, DML, DQL, DCL, TCL',
          'Normalization: 1NF\u21922NF\u21923NF\u2192BCNF\u21924NF\u21925NF',
          'ACID: Atomicity, Consistency, Isolation, Durability',
          'Concurrency: 2PL, Timestamp, Validation, MVCC',
        ],
      },
    ],
  },
  'm910-ch4': {
    chapter_id: 'm910-ch4',
    sections: [
      {
        heading: '1. Introduction',
        type: 'text',
        content: 'A quadratic equation is a second-degree polynomial equation of the form ax\u00b2 + bx + c = 0, where a, b, c are real numbers and a \u2260 0. The term "quadratic" comes from the Latin word "quadratus" meaning "square".',
      },
      {
        heading: '2. Standard Form',
        type: 'formula',
        content: 'The standard form of a quadratic equation:',
        items: [
          'ax\u00b2 + bx + c = 0, where a \u2260 0',
          'a = coefficient of x\u00b2 (quadratic coefficient)',
          'b = coefficient of x (linear coefficient)',
          'c = constant term',
        ],
      },
      {
        heading: '3. Methods of Solving',
        type: 'list',
        content: 'There are four main methods to solve quadratic equations:',
        items: [
          'Factorization: Express as (px + q)(rx + s) = 0',
          'Completing the Square: Transform to (x + p)\u00b2 = q form',
          'Quadratic Formula: x = (-b \u00b1 \u221a(b\u00b2 - 4ac)) / 2a',
          'Graphical Method: Find x-intercepts of the parabola',
        ],
      },
      {
        heading: '4. Quadratic Formula',
        type: 'formula',
        content: 'The quadratic formula is the most general method:',
        items: [
          'x = (-b \u00b1 \u221a(b\u00b2 - 4ac)) / 2a',
          'The discriminant D = b\u00b2 - 4ac determines the nature of roots',
          'D > 0: Two distinct real roots',
          'D = 0: Two equal real roots (repeated root)',
          'D < 0: No real roots (complex conjugate roots)',
        ],
      },
      {
        heading: '5. Discriminant and Nature of Roots',
        type: 'table',
        content: 'Relationship between discriminant and roots:',
        table: {
          headers: ['Discriminant (D)', 'Nature of Roots', 'Graph'],
          rows: [
            ['D > 0', 'Two distinct real roots', 'Parabola crosses x-axis twice'],
            ['D = 0', 'Two equal real roots', 'Parabola touches x-axis at one point'],
            ['D < 0', 'No real roots (complex)', 'Parabola does not cross x-axis'],
            ['D is perfect square', 'Rational roots', 'Roots are rational numbers'],
            ['D is not perfect square', 'Irrational roots', 'Roots involve \u221aD'],
          ],
        },
      },
      {
        heading: '6. Vieta\u2019s Formulas',
        type: 'formula',
        content: 'Relationship between roots and coefficients:',
        items: [
          'Sum of roots: \u03b1 + \u03b2 = -b/a',
          'Product of roots: \u03b1 \u00d7 \u03b2 = c/a',
          'If \u03b1 and \u03b2 are roots, the equation is: x\u00b2 - (\u03b1+\u03b2)x + \u03b1\u03b2 = 0',
        ],
      },
      {
        heading: '7. Solved Example 1',
        type: 'solved',
        content: 'Solve x\u00b2 - 5x + 6 = 0 by factorization.',
        items: [
          'Step 1: Find two numbers that multiply to 6 and add to -5: -2 and -3',
          'Step 2: Factor: x\u00b2 - 5x + 6 = (x - 2)(x - 3) = 0',
          'Step 3: Set each factor to zero: x - 2 = 0 or x - 3 = 0',
          'Step 4: x = 2 or x = 3',
          'Verification: 2 + 3 = 5 \u2713, 2 \u00d7 3 = 6 \u2713',
        ],
      },
      {
        heading: '8. Solved Example 2',
        type: 'solved',
        content: 'Solve 2x\u00b2 + 3x - 5 = 0 using the quadratic formula.',
        items: [
          'Step 1: Identify a=2, b=3, c=-5',
          'Step 2: D = b\u00b2 - 4ac = 9 - 4(2)(-5) = 9 + 40 = 49',
          'Step 3: x = (-3 \u00b1 \u221a49) / (2\u00d72) = (-3 \u00b1 7) / 4',
          'Step 4: x = (-3 + 7)/4 = 1 or x = (-3 - 7)/4 = -5/2',
          'Answer: x = 1 or x = -5/2',
        ],
      },
      {
        heading: '9. Common Mistakes',
        type: 'warning',
        content: 'Frequent errors in quadratic equations:',
        items: [
          'Forgetting that a \u2260 0 (if a = 0, it is linear, not quadratic)',
          'Sign errors in the quadratic formula: it is -b, not +b',
          'Confusing sum of roots (-b/a) with product of roots (c/a)',
          'Not checking if D < 0 means no real roots (not "no solution")',
          'Forgetting to simplify \u221aD when D is a perfect square',
        ],
      },
      {
        heading: '10. Short Tricks',
        type: 'tip',
        content: 'Speed-solving techniques:',
        items: [
          'If a + b + c = 0, then one root is always 1',
          'If a - b + c = 0, then one root is always -1',
          'For ax\u00b2 + bx + c = 0, if c = 0, then one root is 0',
          'Use Vieta\u2019s formulas to form equations from roots directly',
        ],
      },
      {
        heading: '11. Exam Tips',
        type: 'tip',
        content: 'BPSC exam tips:',
        items: [
          'Always check the discriminant first to know the nature of roots',
          'Practice word problems: area, speed, age problems often reduce to quadratics',
          'Memorize Vieta\u2019s formulas \u2014 they save time in MCQs',
          'Check if factorization is quick; if not, use the formula directly',
        ],
      },
      {
        heading: '12. Quick Revision',
        type: 'list',
        content: 'One-page summary:',
        items: [
          'Standard form: ax\u00b2 + bx + c = 0, a \u2260 0',
          'Discriminant: D = b\u00b2 - 4ac',
          'Formula: x = (-b \u00b1 \u221aD) / 2a',
          'Sum of roots: -b/a | Product: c/a',
          'D > 0: 2 real roots | D = 0: equal roots | D < 0: no real roots',
          'Methods: Factorization, Completing Square, Formula, Graphical',
        ],
      },
    ],
  },
  'm68-ch1': {
    chapter_id: 'm68-ch1',
    sections: [
      {
        heading: '1. Introduction',
        type: 'text',
        content: 'The Number System is the foundation of mathematics. It includes natural numbers, whole numbers, integers, rational numbers, and their properties. Understanding the number system is essential for all further mathematical study.',
      },
      {
        heading: '2. Types of Numbers',
        type: 'table',
        content: 'Classification of number systems:',
        table: {
          headers: ['Type', 'Definition', 'Examples'],
          rows: [
            ['Natural (N)', 'Counting numbers starting from 1', '1, 2, 3, 4, ...'],
            ['Whole (W)', 'Natural numbers + zero', '0, 1, 2, 3, ...'],
            ['Integers (Z)', 'Whole numbers + negatives', '..., -2, -1, 0, 1, 2, ...'],
            ['Rational (Q)', 'Numbers of form p/q, q \u2260 0', '1/2, -3/4, 5, 0.75'],
            ['Irrational', 'Cannot be expressed as p/q', '\u221a2, \u03c0, e'],
            ['Real (R)', 'Rational + Irrational', 'All numbers on number line'],
          ],
        },
      },
      {
        heading: '3. Properties of Integers',
        type: 'list',
        content: 'Key properties of integer operations:',
        items: [
          'Closure: a + b and a \u00d7 b are integers',
          'Commutativity: a + b = b + a, a \u00d7 b = b \u00d7 a',
          'Associativity: (a + b) + c = a + (b + c)',
          'Distributivity: a \u00d7 (b + c) = a\u00d7b + a\u00d7c',
          'Additive Identity: a + 0 = a',
          'Additive Inverse: a + (-a) = 0',
          'Multiplicative Identity: a \u00d7 1 = a',
        ],
      },
      {
        heading: '4. Rules for Multiplication',
        type: 'formula',
        content: 'Sign rules for integer multiplication:',
        items: [
          '(+) \u00d7 (+) = + (Positive \u00d7 Positive = Positive)',
          '(+) \u00d7 (-) = - (Positive \u00d7 Negative = Negative)',
          '(-) \u00d7 (+) = - (Negative \u00d7 Positive = Negative)',
          '(-) \u00d7 (-) = + (Negative \u00d7 Negative = Positive)',
          'Same signs \u2192 Positive result',
          'Different signs \u2192 Negative result',
        ],
      },
      {
        heading: '5. Fractions',
        type: 'text',
        content: 'A fraction represents a part of a whole. It is written as p/q where p is the numerator and q is the denominator (q \u2260 0). Fractions can be proper (p < q), improper (p \u2265 q), or mixed (whole + fraction).',
      },
      {
        heading: '6. Operations on Fractions',
        type: 'formula',
        content: 'Key formulas:',
        items: [
          'Addition: a/b + c/d = (ad + bc) / bd',
          'Subtraction: a/b - c/d = (ad - bc) / bd',
          'Multiplication: a/b \u00d7 c/d = ac / bd',
          'Division: a/b \u00f7 c/d = a/b \u00d7 d/c = ad / bc',
          'Simplification: Divide numerator and denominator by their HCF',
        ],
      },
      {
        heading: '7. Decimals',
        type: 'text',
        content: 'Decimals are another way of representing fractions where the denominator is a power of 10. For example, 0.75 = 75/100 = 3/4. Operations on decimals follow the same rules as integers, with careful attention to the decimal point alignment.',
      },
      {
        heading: '8. Solved Example',
        type: 'solved',
        content: 'Add: 3/4 + 5/6',
        items: [
          'Step 1: Find LCM of denominators 4 and 6: LCM(4,6) = 12',
          'Step 2: Convert: 3/4 = 9/12 and 5/6 = 10/12',
          'Step 3: Add: 9/12 + 10/12 = 19/12',
          'Step 4: Simplify if needed: 19/12 (already in lowest form)',
          'Answer: 19/12 or 1 7/12 (mixed form)',
        ],
      },
      {
        heading: '9. Common Mistakes',
        type: 'warning',
        content: 'Frequent errors:',
        items: [
          'Forgetting that (-) \u00d7 (-) = + (students often write negative)',
          'Not aligning decimal points during addition/subtraction',
          'Forgetting to simplify fractions to lowest terms',
          'Confusing numerator and denominator',
          'Adding denominators directly: 1/2 + 1/3 \u2260 1/5 (wrong!)',
        ],
      },
      {
        heading: '10. Exam Tips',
        type: 'tip',
        content: 'Quick tips:',
        items: [
          'Always simplify fractions to lowest form',
          'Remember: product of two negatives is positive',
          'Use the number line to visualize integer operations',
          'Convert mixed fractions to improper before multiplying',
          'Practice LCM and HCF \u2014 they are used everywhere',
        ],
      },
      {
        heading: '11. Quick Revision',
        type: 'list',
        content: 'Summary:',
        items: [
          'N \u2282 W \u2282 Z \u2282 Q \u2282 R (each is a subset of the next)',
          'Same signs \u00d7 = +, Different signs \u00d7 = -',
          'Fraction addition needs common denominator (LCM)',
          'Decimal = fraction with denominator as power of 10',
          'Absolute value is always non-negative',
        ],
      },
    ],
  },
};

export function getNotesForChapter(chapterId: string): ChapterNote | null {
  return NOTES[chapterId] || null;
}

export function generateGenericNotes(chapterId: string, chapterName: string, importantConcepts: string[]): ChapterNote {
  return {
    chapter_id: chapterId,
    sections: [
      {
        heading: '1. Introduction',
        type: 'text',
        content: `This chapter covers ${chapterName}, which is an important topic in the BPSC TRE 4.0 syllabus. Understanding the fundamental concepts in this chapter is essential for scoring well in the examination.`,
      },
      {
        heading: '2. Key Concepts',
        type: 'list',
        content: 'Important concepts to master in this chapter:',
        items: importantConcepts || ['Core concepts of this chapter'],
      },
      {
        heading: '3. Detailed Theory',
        type: 'text',
        content: `The study of ${chapterName} involves understanding the fundamental principles, their applications, and the relationships between different concepts. Students should focus on building a strong conceptual foundation before attempting problems.`,
      },
      {
        heading: '4. Important Definitions',
        type: 'list',
        content: 'Key terms and their definitions:',
        items: importantConcepts?.map((c) => `${c}: A fundamental concept in this chapter that students must understand thoroughly.`) || ['Key definitions will be added here.'],
      },
      {
        heading: '5. Formulas and Rules',
        type: 'formula',
        content: 'Essential formulas for this chapter:',
        items: ['Key formulas will be added as content is expanded', 'Practice applying these formulas to different problem types'],
      },
      {
        heading: '6. Common Mistakes',
        type: 'warning',
        content: 'Avoid these common errors:',
        items: [
          'Not reading the question carefully before solving',
          'Skipping steps in calculations, leading to errors',
          'Not verifying the final answer',
          'Forgetting to check units or conditions',
        ],
      },
      {
        heading: '7. Exam Tips',
        type: 'tip',
        content: 'Tips for BPSC preparation:',
        items: [
          'Practice previous year questions from this chapter',
          'Focus on conceptual clarity over memorization',
          'Time yourself while solving problems',
          'Review mistakes and learn from them',
        ],
      },
      {
        heading: '8. Quick Revision',
        type: 'list',
        content: 'Summary for quick review:',
        items: importantConcepts || ['Review all key concepts before the exam'],
      },
    ],
  };
}
