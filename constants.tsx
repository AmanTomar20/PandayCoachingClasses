
import { Assessment, User } from './types';

export const MOCK_TEACHER: User = {
  id: 't1',
  name: 'Prof. Rajesh Panday',
  email: 'rajesh@pandayclasses.com',
  role: 'TEACHER',
};

export const MOCK_STUDENTS: User[] = [
  { id: 's1', name: 'Aman Sharma', email: 'aman@example.com', role: 'STUDENT' },
  { id: 's2', name: 'Priya Verma', email: 'priya@example.com', role: 'STUDENT' },
  { id: 's3', name: 'Rohan Gupta', email: 'rohan@example.com', role: 'STUDENT' },
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'p1',
    title: 'Algebra Foundations - Practice',
    type: 'PRACTICE',
    questions: [
      {
        id: 'q1',
        text: 'What is the value of x in 2x + 5 = 15?',
        options: [
          { id: 'a', text: '5' },
          { id: 'b', text: '10' },
          { id: 'c', text: '2.5' },
          { id: 'd', text: '5.5' }
        ],
        correctOptionId: 'a',
        explanation: '2x = 15 - 5 => 2x = 10 => x = 5.'
      },
      {
        id: 'q2',
        text: 'Simplify: (x + 2)(x - 2)',
        options: [
          { id: 'a', text: 'x^2 + 4' },
          { id: 'b', text: 'x^2 - 4' },
          { id: 'c', text: 'x^2 - 4x + 4' },
          { id: 'd', text: '2x' }
        ],
        correctOptionId: 'b',
        explanation: 'This is the difference of squares formula: (a+b)(a-b) = a^2 - b^2.'
      }
    ]
  },
  {
    id: 't1',
    title: 'Final Mathematics Unit Test',
    type: 'TEST',
    durationMinutes: 30,
    questions: [
      {
        id: 'q3',
        text: 'What is the derivative of x^2?',
        options: [
          { id: 'a', text: 'x' },
          { id: 'b', text: '2x' },
          { id: 'c', text: 'x^3 / 3' },
          { id: 'd', text: '2' }
        ],
        correctOptionId: 'b'
      },
      {
        id: 'q4',
        text: 'Value of sin(90°)?',
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '1' },
          { id: 'c', text: '0.5' },
          { id: 'd', text: 'Undefined' }
        ],
        correctOptionId: 'b'
      },
      {
        id: 'q5',
        text: 'Sum of angles in a triangle is:',
        options: [
          { id: 'a', text: '90°' },
          { id: 'b', text: '180°' },
          { id: 'c', text: '360°' },
          { id: 'd', text: '270°' }
        ],
        correctOptionId: 'b'
      }
    ]
  }
];
