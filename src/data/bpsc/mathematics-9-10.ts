import type { Syllabus } from '@/types';

export const MATH_9_10_SYLLABUS: Syllabus = {
  trackId: 'math-9-10',
  trackName: 'Classes 9–10 Mathematics',
  subjects: [
    {
      id: 'math9-10-main',
      name: 'Mathematics',
      units: [
        {
          id: 'm910-u1',
          name: 'Number Systems',
          chapters: [
            {
              id: 'm910-ch1',
              name: 'Real Numbers',
              description: 'Rational and irrational numbers, Euclid\u2019s division lemma, fundamental theorem of arithmetic.',
              importantConcepts: ['Rational Numbers', 'Irrational Numbers', 'Euclid\u2019s Division Lemma', 'Fundamental Theorem of Arithmetic', 'HCF and LCM'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm910-ch1-t1', name: 'Rational and Irrational Numbers' },
                { id: 'm910-ch1-t2', name: 'Euclid\u2019s Division Lemma' },
                { id: 'm910-ch1-t3', name: 'Fundamental Theorem of Arithmetic' },
                { id: 'm910-ch1-t4', name: 'HCF and LCM using Prime Factorization' },
                { id: 'm910-ch1-t5', name: 'Decimal Expansions of Rational Numbers' },
              ],
            },
          ],
        },
        {
          id: 'm910-u2',
          name: 'Algebra',
          chapters: [
            {
              id: 'm910-ch2',
              name: 'Polynomials',
              description: 'Degree, zeros, factor theorem, remainder theorem, and factorization.',
              importantConcepts: ['Polynomial', 'Degree', 'Zeros', 'Factor Theorem', 'Remainder Theorem'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm910-ch2-t1', name: 'Types of Polynomials' },
                { id: 'm910-ch2-t2', name: 'Zeros of a Polynomial' },
                { id: 'm910-ch2-t3', name: 'Factor Theorem' },
                { id: 'm910-ch2-t4', name: 'Remainder Theorem' },
                { id: 'm910-ch2-t5', name: 'Factorization of Polynomials' },
              ],
            },
            {
              id: 'm910-ch3',
              name: 'Pair of Linear Equations',
              description: 'Systems of linear equations in two variables, graphical and algebraic methods.',
              importantConcepts: ['Linear Equation', 'Consistent', 'Inconsistent', 'Substitution', 'Elimination', 'Cross-Multiplication'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm910-ch3-t1', name: 'Linear Equations in Two Variables' },
                { id: 'm910-ch3-t2', name: 'Graphical Method' },
                { id: 'm910-ch3-t3', name: 'Substitution Method' },
                { id: 'm910-ch3-t4', name: 'Elimination Method' },
                { id: 'm910-ch3-t5', name: 'Cross-Multiplication Method' },
                { id: 'm910-ch3-t6', name: 'Word Problems' },
              ],
            },
            {
              id: 'm910-ch4',
              name: 'Quadratic Equations',
              description: 'Solving quadratic equations by factorization, completing the square, and quadratic formula.',
              importantConcepts: ['Quadratic Equation', 'Discriminant', 'Quadratic Formula', 'Nature of Roots'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm910-ch4-t1', name: 'Introduction to Quadratic Equations' },
                { id: 'm910-ch4-t2', name: 'Solution by Factorization' },
                { id: 'm910-ch4-t3', name: 'Completing the Square' },
                { id: 'm910-ch4-t4', name: 'Quadratic Formula' },
                { id: 'm910-ch4-t5', name: 'Nature of Roots' },
                { id: 'm910-ch4-t6', name: 'Word Problems' },
              ],
            },
            {
              id: 'm910-ch5',
              name: 'Arithmetic Progressions',
              description: 'nth term, sum of n terms, and AP word problems.',
              importantConcepts: ['Arithmetic Progression', 'Common Difference', 'nth Term', 'Sum of n Terms'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm910-ch5-t1', name: 'Introduction to AP' },
                { id: 'm910-ch5-t2', name: 'nth Term of an AP' },
                { id: 'm910-ch5-t3', name: 'Sum of First n Terms' },
                { id: 'm910-ch5-t4', name: 'Word Problems on AP' },
              ],
            },
          ],
        },
        {
          id: 'm910-u3',
          name: 'Geometry and Trigonometry',
          chapters: [
            {
              id: 'm910-ch6',
              name: 'Triangles',
              description: 'Similarity, congruence, Pythagoras theorem, and area of similar triangles.',
              importantConcepts: ['Similar Triangles', 'AAA', 'SAS', 'SSS', 'Pythagoras Theorem', 'Basic Proportionality Theorem'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm910-ch6-t1', name: 'Similar Figures' },
                { id: 'm910-ch6-t2', name: 'Criteria for Similarity' },
                { id: 'm910-ch6-t3', name: 'Area of Similar Triangles' },
                { id: 'm910-ch6-t4', name: 'Pythagoras Theorem' },
              ],
            },
            {
              id: 'm910-ch7',
              name: 'Coordinate Geometry',
              description: 'Distance formula, section formula, area of triangle, and collinearity.',
              importantConcepts: ['Distance Formula', 'Section Formula', 'Midpoint', 'Area of Triangle'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm910-ch7-t1', name: 'Distance Formula' },
                { id: 'm910-ch7-t2', name: 'Section Formula' },
                { id: 'm910-ch7-t3', name: 'Midpoint Formula' },
                { id: 'm910-ch7-t4', name: 'Area of a Triangle' },
              ],
            },
            {
              id: 'm910-ch8',
              name: 'Introduction to Trigonometry',
              description: 'Trigonometric ratios, identities, and angle values.',
              importantConcepts: ['Sin', 'Cos', 'Tan', 'Cosec', 'Sec', 'Cot', 'Trigonometric Identities'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm910-ch8-t1', name: 'Trigonometric Ratios' },
                { id: 'm910-ch8-t2', name: 'Trigonometric Ratios of Specific Angles' },
                { id: 'm910-ch8-t3', name: 'Trigonometric Identities' },
                { id: 'm910-ch8-t4', name: 'Complementary Angles' },
              ],
            },
            {
              id: 'm910-ch9',
              name: 'Trigonometric Applications',
              description: 'Heights, distances, and real-world applications of trigonometry.',
              importantConcepts: ['Angle of Elevation', 'Angle of Depression', 'Line of Sight'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm910-ch9-t1', name: 'Angle of Elevation and Depression' },
                { id: 'm910-ch9-t2', name: 'Heights and Distances' },
                { id: 'm910-ch9-t3', name: 'Word Problems' },
              ],
            },
            {
              id: 'm910-ch10',
              name: 'Circles',
              description: 'Tangents, secants, chords, and properties of circles.',
              importantConcepts: ['Tangent', 'Secant', 'Chord', 'Arc', 'Number of Tangents from a Point'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm910-ch10-t1', name: 'Tangent to a Circle' },
                { id: 'm910-ch10-t2', name: 'Properties of Tangents' },
                { id: 'm910-ch10-t3', name: 'Number of Tangents from a Point' },
              ],
            },
          ],
        },
        {
          id: 'm910-u4',
          name: 'Mensuration',
          chapters: [
            {
              id: 'm910-ch11',
              name: 'Areas Related to Circles',
              description: 'Area of sectors, segments, and combinations of plane figures.',
              importantConcepts: ['Sector', 'Segment', 'Area of Sector', 'Length of Arc'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm910-ch11-t1', name: 'Area of Sector' },
                { id: 'm910-ch11-t2', name: 'Area of Segment' },
                { id: 'm910-ch11-t3', name: 'Areas of Combinations' },
              ],
            },
            {
              id: 'm910-ch12',
              name: 'Surface Areas and Volumes',
              description: 'Surface area and volume of cubes, cuboids, cylinders, cones, spheres, and combinations.',
              importantConcepts: ['Surface Area', 'Volume', 'Cylinder', 'Cone', 'Sphere', 'Hemisphere'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm910-ch12-t1', name: 'Cylinder' },
                { id: 'm910-ch12-t2', name: 'Cone' },
                { id: 'm910-ch12-t3', name: 'Sphere and Hemisphere' },
                { id: 'm910-ch12-t4', name: 'Combination of Solids' },
              ],
            },
          ],
        },
        {
          id: 'm910-u5',
          name: 'Statistics and Probability',
          chapters: [
            {
              id: 'm910-ch13',
              name: 'Statistics',
              description: 'Mean, median, mode of grouped data, and cumulative frequency.',
              importantConcepts: ['Grouped Data', 'Mean', 'Median', 'Mode', 'Cumulative Frequency', 'Ogive'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm910-ch13-t1', name: 'Mean of Grouped Data' },
                { id: 'm910-ch13-t2', name: 'Mode of Grouped Data' },
                { id: 'm910-ch13-t3', name: 'Median of Grouped Data' },
                { id: 'm910-ch13-t4', name: 'Cumulative Frequency and Ogive' },
              ],
            },
            {
              id: 'm910-ch14',
              name: 'Probability',
              description: 'Classical definition, sample space, and probability of events.',
              importantConcepts: ['Probability', 'Sample Space', 'Event', 'Classical Definition', 'Complementary Events'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm910-ch14-t1', name: 'Classical Definition of Probability' },
                { id: 'm910-ch14-t2', name: 'Sample Space and Events' },
                { id: 'm910-ch14-t3', name: 'Simple Probability Problems' },
                { id: 'm910-ch14-t4', name: 'Probability of Complementary Events' },
              ],
            },
          ],
        },
      ],
    },
  ],
};
