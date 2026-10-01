import type { Syllabus } from '@/types';

export const MATH_6_8_SYLLABUS: Syllabus = {
  trackId: 'math-6-8',
  trackName: 'Classes 6–8 Mathematics',
  subjects: [
    {
      id: 'math6-8-main',
      name: 'Mathematics',
      units: [
        {
          id: 'm68-u1',
          name: 'Number System',
          chapters: [
            {
              id: 'm68-ch1',
              name: 'Number System',
              description: 'Whole numbers, integers, natural numbers, rational numbers, and their properties.',
              importantConcepts: ['Natural Numbers', 'Whole Numbers', 'Integers', 'Rational Numbers', 'Absolute Value', 'Number Line'],
              difficultyDistribution: { easy: 0.4, medium: 0.4, hard: 0.2 },
              topics: [
                { id: 'm68-ch1-t1', name: 'Natural and Whole Numbers', subtopics: [
                  { id: 'm68-ch1-t1-s1', name: 'Properties of Natural Numbers' },
                  { id: 'm68-ch1-t1-s2', name: 'Successor and Predecessor' },
                ]},
                { id: 'm68-ch1-t2', name: 'Integers', subtopics: [
                  { id: 'm68-ch1-t2-s1', name: 'Positive and Negative Numbers' },
                  { id: 'm68-ch1-t2-s2', name: 'Addition and Subtraction of Integers' },
                  { id: 'm68-ch1-t2-s3', name: 'Multiplication and Division of Integers' },
                ]},
                { id: 'm68-ch1-t3', name: 'Rational Numbers', subtopics: [
                  { id: 'm68-ch1-t3-s1', name: 'Definition and Representation' },
                  { id: 'm68-ch1-t3-s2', name: 'Equivalent Rational Numbers' },
                  { id: 'm68-ch1-t3-s3', name: 'Comparison of Rational Numbers' },
                ]},
                { id: 'm68-ch1-t4', name: 'Fractions', subtopics: [
                  { id: 'm68-ch1-t4-s1', name: 'Types of Fractions' },
                  { id: 'm68-ch1-t4-s2', name: 'Operations on Fractions' },
                ]},
                { id: 'm68-ch1-t5', name: 'Decimals', subtopics: [
                  { id: 'm68-ch1-t5-s1', name: 'Decimal Representation' },
                  { id: 'm68-ch1-t5-s2', name: 'Operations on Decimals' },
                ]},
              ],
            },
            {
              id: 'm68-ch2',
              name: 'Factors and Multiples',
              description: 'HCF, LCM, prime factorization, and divisibility rules.',
              importantConcepts: ['Prime Numbers', 'Composite Numbers', 'HCF', 'LCM', 'Divisibility Rules'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch2-t1', name: 'Factors and Multiples' },
                { id: 'm68-ch2-t2', name: 'Prime and Composite Numbers' },
                { id: 'm68-ch2-t3', name: 'Prime Factorization' },
                { id: 'm68-ch2-t4', name: 'HCF and LCM' },
                { id: 'm68-ch2-t5', name: 'Divisibility Rules' },
              ],
            },
          ],
        },
        {
          id: 'm68-u2',
          name: 'Ratio, Proportion and Percentage',
          chapters: [
            {
              id: 'm68-ch3',
              name: 'Ratio and Proportion',
              description: 'Ratio, proportion, unitary method, and their applications.',
              importantConcepts: ['Ratio', 'Proportion', 'Unitary Method', 'Direct and Inverse Proportion'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch3-t1', name: 'Ratio' },
                { id: 'm68-ch3-t2', name: 'Proportion' },
                { id: 'm68-ch3-t3', name: 'Unitary Method' },
                { id: 'm68-ch3-t4', name: 'Direct and Inverse Proportion' },
              ],
            },
            {
              id: 'm68-ch4',
              name: 'Percentage',
              description: 'Percentage, conversion between fractions/decimals/percentages, and applications.',
              importantConcepts: ['Percentage', 'Conversion', 'Percentage Increase/Decrease'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch4-t1', name: 'Introduction to Percentage' },
                { id: 'm68-ch4-t2', name: 'Conversion between Forms' },
                { id: 'm68-ch4-t3', name: 'Percentage Problems' },
                { id: 'm68-ch4-t4', name: 'Percentage Increase and Decrease' },
              ],
            },
          ],
        },
        {
          id: 'm68-u3',
          name: 'Commercial Mathematics',
          chapters: [
            {
              id: 'm68-ch5',
              name: 'Profit and Loss',
              description: 'Cost price, selling price, profit, loss, and discount calculations.',
              importantConcepts: ['Cost Price', 'Selling Price', 'Profit', 'Loss', 'Discount', 'Marked Price'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch5-t1', name: 'Cost Price and Selling Price' },
                { id: 'm68-ch5-t2', name: 'Profit and Loss' },
                { id: 'm68-ch5-t3', name: 'Profit and Loss Percentage' },
                { id: 'm68-ch5-t4', name: 'Discount' },
              ],
            },
            {
              id: 'm68-ch6',
              name: 'Simple and Compound Interest',
              description: 'Simple interest, compound interest, and their real-world applications.',
              importantConcepts: ['Simple Interest', 'Compound Interest', 'Principal', 'Rate', 'Time'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm68-ch6-t1', name: 'Simple Interest' },
                { id: 'm68-ch6-t2', name: 'Compound Interest' },
                { id: 'm68-ch6-t3', name: 'Comparison of SI and CI' },
              ],
            },
          ],
        },
        {
          id: 'm68-u4',
          name: 'Algebra',
          chapters: [
            {
              id: 'm68-ch7',
              name: 'Algebraic Expressions',
              description: 'Variables, constants, terms, like/unlike terms, and operations on algebraic expressions.',
              importantConcepts: ['Variables', 'Constants', 'Like Terms', 'Polynomials', 'Coefficients'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch7-t1', name: 'Variables and Constants' },
                { id: 'm68-ch7-t2', name: 'Algebraic Expressions' },
                { id: 'm68-ch7-t3', name: 'Like and Unlike Terms' },
                { id: 'm68-ch7-t4', name: 'Operations on Algebraic Expressions' },
              ],
            },
            {
              id: 'm68-ch8',
              name: 'Linear Equations',
              description: 'Linear equations in one variable, solving and graphing.',
              importantConcepts: ['Linear Equation', 'Variable', 'Solution', 'Transposition'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch8-t1', name: 'Linear Equations in One Variable' },
                { id: 'm68-ch8-t2', name: 'Solving Linear Equations' },
                { id: 'm68-ch8-t3', name: 'Word Problems on Linear Equations' },
              ],
            },
          ],
        },
        {
          id: 'm68-u5',
          name: 'Geometry',
          chapters: [
            {
              id: 'm68-ch9',
              name: 'Lines and Angles',
              description: 'Types of angles, pairs of angles, and properties of lines.',
              importantConcepts: ['Acute Angle', 'Right Angle', 'Obtuse Angle', 'Complementary', 'Supplementary', 'Vertically Opp'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch9-t1', name: 'Types of Angles' },
                { id: 'm68-ch9-t2', name: 'Pairs of Angles' },
                { id: 'm68-ch9-t3', name: 'Intersecting and Parallel Lines' },
              ],
            },
            {
              id: 'm68-ch10',
              name: 'Triangles',
              description: 'Classification, properties, congruence, and Pythagoras theorem.',
              importantConcepts: ['Types of Triangles', 'Angle Sum Property', 'Congruence', 'Pythagoras Theorem'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch10-t1', name: 'Types of Triangles' },
                { id: 'm68-ch10-t2', name: 'Properties of Triangles' },
                { id: 'm68-ch10-t3', name: 'Congruence of Triangles' },
                { id: 'm68-ch10-t4', name: 'Pythagoras Theorem' },
              ],
            },
            {
              id: 'm68-ch11',
              name: 'Quadrilaterals',
              description: 'Properties of quadrilaterals including parallelogram, rectangle, square, rhombus.',
              importantConcepts: ['Parallelogram', 'Rectangle', 'Square', 'Rhombus', 'Trapezium'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch11-t1', name: 'Types of Quadrilaterals' },
                { id: 'm68-ch11-t2', name: 'Properties of Parallelograms' },
                { id: 'm68-ch11-t3', name: 'Properties of Special Quadrilaterals' },
              ],
            },
            {
              id: 'm68-ch12',
              name: 'Circles',
              description: 'Parts of a circle, angles, chords, arcs, and sectors.',
              importantConcepts: ['Radius', 'Diameter', 'Chord', 'Arc', 'Sector', 'Central Angle'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch12-t1', name: 'Parts of a Circle' },
                { id: 'm68-ch12-t2', name: 'Chord and Arc' },
                { id: 'm68-ch12-t3', name: 'Sector and Segment' },
              ],
            },
            {
              id: 'm68-ch13',
              name: 'Coordinate Geometry',
              description: 'Cartesian plane, plotting points, and identifying coordinates.',
              importantConcepts: ['Cartesian Plane', 'X-axis', 'Y-axis', 'Origin', 'Coordinates', 'Quadrants'],
              difficultyDistribution: { easy: 0.4, medium: 0.4, hard: 0.2 },
              topics: [
                { id: 'm68-ch13-t1', name: 'Cartesian Plane' },
                { id: 'm68-ch13-t2', name: 'Plotting Points' },
                { id: 'm68-ch13-t3', name: 'Quadrants' },
              ],
            },
          ],
        },
        {
          id: 'm68-u6',
          name: 'Mensuration',
          chapters: [
            {
              id: 'm68-ch14',
              name: 'Perimeter and Area',
              description: 'Perimeter and area of 2D shapes including rectangles, triangles, circles.',
              importantConcepts: ['Perimeter', 'Area', 'Square', 'Rectangle', 'Triangle', 'Circle', 'Parallelogram'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch14-t1', name: 'Perimeter of 2D Shapes' },
                { id: 'm68-ch14-t2', name: 'Area of Rectangle and Square' },
                { id: 'm68-ch14-t3', name: 'Area of Triangle' },
                { id: 'm68-ch14-t4', name: 'Area of Parallelogram and Rhombus' },
                { id: 'm68-ch14-t5', name: 'Circumference and Area of Circle' },
              ],
            },
            {
              id: 'm68-ch15',
              name: 'Surface Area and Volume',
              description: 'Surface area and volume of cubes, cuboids, and cylinders.',
              importantConcepts: ['Surface Area', 'Volume', 'Cube', 'Cuboid', 'Cylinder'],
              difficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
              topics: [
                { id: 'm68-ch15-t1', name: 'Cube and Cuboid' },
                { id: 'm68-ch15-t2', name: 'Cylinder' },
                { id: 'm68-ch15-t3', name: 'Volume of Solids' },
              ],
            },
          ],
        },
        {
          id: 'm68-u7',
          name: 'Data Handling',
          chapters: [
            {
              id: 'm68-ch16',
              name: 'Statistics',
              description: 'Mean, median, mode, and data representation.',
              importantConcepts: ['Mean', 'Median', 'Mode', 'Range', 'Frequency Distribution'],
              difficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
              topics: [
                { id: 'm68-ch16-t1', name: 'Data Collection and Organization' },
                { id: 'm68-ch16-t2', name: 'Mean, Median, Mode' },
                { id: 'm68-ch16-t3', name: 'Bar Graphs' },
                { id: 'm68-ch16-t4', name: 'Pie Charts' },
              ],
            },
            {
              id: 'm68-ch17',
              name: 'Probability',
              description: 'Basic probability concepts and simple experiments.',
              importantConcepts: ['Probability', 'Sample Space', 'Events', 'Outcomes'],
              difficultyDistribution: { easy: 0.4, medium: 0.4, hard: 0.2 },
              topics: [
                { id: 'm68-ch17-t1', name: 'Introduction to Probability' },
                { id: 'm68-ch17-t2', name: 'Simple Probability Problems' },
              ],
            },
          ],
        },
      ],
    },
  ],
};
