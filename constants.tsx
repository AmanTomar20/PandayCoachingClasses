
import { Assessment, User } from './types';

export const MOCK_TEACHER: User = {
  id: 't1',
  name: 'Prof. Rajesh Panday',
  email: 'rajesh@pandayclasses.com',
  username: 'admin',
  password: 'password123',
  role: 'TEACHER',
};

export const MOCK_STUDENTS: User[] = [
  { id: 's1', name: 'Aman Sharma', email: 'aman@example.com', username: 'aman', password: 'password123', role: 'STUDENT' },
  { id: 's2', name: 'Priya Verma', email: 'priya@example.com', username: 'priya', password: 'password123', role: 'STUDENT' },
  { id: 's3', name: 'Rohan Gupta', email: 'rohan@example.com', username: 'rohan', password: 'password123', role: 'STUDENT' },
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'p1',
    title: 'Algebra Foundations - Set 1',
    type: 'PRACTICE',
    subject: 'Mathematics',
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
    id: 'chem_set_1',
    title: 'Metals and Non-Metals - Set 1',
    type: 'PRACTICE',
    subject: 'Chemistry',
    questions: [
      {
        id: 'c1',
        text: 'Which of the following is a non-metal that is liquid at room temperature?',
        options: [{id: 'a', text: 'Bromine'}, {id: 'b', text: 'Mercury'}, {id: 'c', text: 'Gallium'}, {id: 'd', text: 'Cesium'}],
        correctOptionId: 'a'
      },
      {
        id: 'c2',
        text: 'Metals are good conductors of electricity because they have:',
        options: [{id: 'a', text: 'Free neutrons'}, {id: 'b', text: 'Free protons'}, {id: 'c', text: 'Free electrons'}, {id: 'd', text: 'Positive ions'}],
        correctOptionId: 'c'
      },
      {
        id: 'c3',
        text: 'Which metal does not react with dilute HCl?',
        options: [{id: 'a', text: 'Magnesium'}, {id: 'b', text: 'Aluminium'}, {id: 'c', text: 'Zinc'}, {id: 'd', text: 'Copper'}],
        correctOptionId: 'd'
      },
      {
        id: 'c4',
        text: 'When sodium reacts with water, the gas evolved is:',
        options: [{id: 'a', text: 'Oxygen'}, {id: 'b', text: 'Hydrogen'}, {id: 'c', text: 'Nitrogen'}, {id: 'd', text: 'Carbon dioxide'}],
        correctOptionId: 'b'
      },
      {
        id: 'c5',
        text: 'The nature of metal oxides is generally:',
        options: [{id: 'a', text: 'Acidic'}, {id: 'b', text: 'Neutral'}, {id: 'c', text: 'Basic'}, {id: 'd', text: 'Amphoteric only'}],
        correctOptionId: 'c'
      },
      {
        id: 'c6',
        text: 'Which of the following metal oxides is amphoteric?',
        options: [{id: 'a', text: 'Na₂O'}, {id: 'b', text: 'MgO'}, {id: 'c', text: 'ZnO'}, {id: 'd', text: 'K₂O'}],
        correctOptionId: 'c'
      },
      {
        id: 'c7',
        text: 'Which metal is stored in kerosene oil?',
        options: [{id: 'a', text: 'Iron'}, {id: 'b', text: 'Sodium'}, {id: 'c', text: 'Copper'}, {id: 'd', text: 'Zinc'}],
        correctOptionId: 'b'
      },
      {
        id: 'c8',
        text: 'The metal that can be cut with a knife is:',
        options: [{id: 'a', text: 'Iron'}, {id: 'b', text: 'Copper'}, {id: 'c', text: 'Sodium'}, {id: 'd', text: 'Aluminium'}],
        correctOptionId: 'c'
      },
      {
        id: 'c9',
        text: 'The green coating on copper utensils is:',
        options: [{id: 'a', text: 'Copper oxide'}, {id: 'b', text: 'Copper sulphide'}, {id: 'c', text: 'Basic copper carbonate'}, {id: 'd', text: 'Copper nitrate'}],
        correctOptionId: 'c'
      },
      {
        id: 'c10',
        text: 'Rust is chemically:',
        options: [{id: 'a', text: 'Iron oxide'}, {id: 'b', text: 'Hydrated iron(III) oxide'}, {id: 'c', text: 'Iron carbonate'}, {id: 'd', text: 'Iron hydroxide'}],
        correctOptionId: 'b'
      },
      {
        id: 'c11',
        text: 'The process of coating iron with zinc is called:',
        options: [{id: 'a', text: 'Alloying'}, {id: 'b', text: 'Galvanisation'}, {id: 'c', text: 'Roasting'}, {id: 'd', text: 'Calcination'}],
        correctOptionId: 'b'
      },
      {
        id: 'c12',
        text: 'Which of the following metals is most reactive?',
        options: [{id: 'a', text: 'Fe'}, {id: 'b', text: 'Cu'}, {id: 'c', text: 'K'}, {id: 'd', text: 'Ag'}],
        correctOptionId: 'c'
      },
      {
        id: 'c13',
        text: 'Ionic compounds have high melting point because:',
        options: [{id: 'a', text: 'They are covalent'}, {id: 'b', text: 'Strong electrostatic force of attraction exists'}, {id: 'c', text: 'They are soft'}, {id: 'd', text: 'They contain hydrogen bonds'}],
        correctOptionId: 'b'
      },
      {
        id: 'c14',
        text: 'Which of the following can displace copper from CuSO₄ solution?',
        options: [{id: 'a', text: 'Silver'}, {id: 'b', text: 'Gold'}, {id: 'c', text: 'Zinc'}, {id: 'd', text: 'Platinum'}],
        correctOptionId: 'c'
      },
      {
        id: 'c15',
        text: 'The extraction of metals from sulphide ores is done by:',
        options: [{id: 'a', text: 'Reduction'}, {id: 'b', text: 'Roasting'}, {id: 'c', text: 'Electrolysis'}, {id: 'd', text: 'Distillation'}],
        correctOptionId: 'b'
      }
    ]
  },
  {
    id: 'chem_test_set_1',
    title: 'Chemistry Unit Test - Set 1',
    type: 'TEST',
    subject: 'Chemistry',
    durationMinutes: 45,
    questions: [
      {
        id: 'ct1_q1',
        text: 'Give IUPAC name of the compound:',
        options: [{id: 'a', text: '2-Chloro-5-hydroxyhexan'}, {id: 'b', text: '2-Hydroxy-5-chlorohexane'}, {id: 'c', text: '5-Chlorohexan-2-ol'}, {id: 'd', text: '2-Chlorohexan-5-ol'}],
        correctOptionId: 'c'
      },
      {
        id: 'ct1_q2',
        text: 'Which one is a secondary alcohol?',
        options: [{id: 'a', text: 'Structure (i)'}, {id: 'b', text: 'Structure (ii)'}, {id: 'c', text: 'Structure (iii)'}, {id: 'd', text: 'Structure (iv)'}],
        correctOptionId: 'd'
      },
      {
        id: 'ct1_q3',
        text: 'What is the correct order of reactivity of alcohols in the reaction R-OH + HCl --(ZnCl2)--> R-Cl + H2O?',
        options: [{id: 'a', text: '1° > 2° > 3°'}, {id: 'b', text: '3° > 2° > 1°'}, {id: 'c', text: '2° > 1° > 3°'}, {id: 'd', text: '3° > 1° > 2°'}],
        correctOptionId: 'b'
      },
      {
        id: 'ct1_q4',
        text: 'The process of converting alkyl halides into alcohols involves _____________.',
        options: [{id: 'a', text: 'Substitution reaction'}, {id: 'b', text: 'Addition reaction'}, {id: 'c', text: 'Dehydrohalogenation reaction'}, {id: 'd', text: 'Rearrangement reaction'}],
        correctOptionId: 'a'
      },
      {
        id: 'ct1_q5',
        text: 'The compound which gives the most stable carbonium ion on dehydration is –',
        options: [{id: 'a', text: '(CH3)2CHCH2OH'}, {id: 'b', text: '(CH3)3COH'}, {id: 'c', text: 'CH3CH2CH2CH2OH'}, {id: 'd', text: 'CH3CH (OH) CH2 CH3'}],
        correctOptionId: 'b'
      },
      {
        id: 'ct1_q6',
        text: 'Cyclohexene is best prepared from cyclohexanol by which of the following –',
        options: [{id: 'a', text: 'Conc. H3PO4'}, {id: 'b', text: 'Conc. HCl/ZnCl2'}, {id: 'c', text: 'Conc. HCl'}, {id: 'd', text: 'Conc. HBr'}],
        correctOptionId: 'a'
      },
      {
        id: 'ct1_q7',
        text: 'Acetone reacts with Grignard reagent to form –',
        options: [{id: 'a', text: '3° alcohol'}, {id: 'b', text: '2° alcohol'}, {id: 'c', text: 'Ether'}, {id: 'd', text: 'No reaction'}],
        correctOptionId: 'a'
      },
      {
        id: 'ct1_q8',
        text: 'The alcohol that reacts fastest with Lucas reagent at room temperature is –',
        options: [{id: 'a', text: 'propan-2-ol'}, {id: 'b', text: 'butan-1-ol'}, {id: 'c', text: '2-methyl propan-1-ol'}, {id: 'd', text: '2-methyl propan-2-ol'}],
        correctOptionId: 'd'
      },
      {
        id: 'ct1_q9',
        text: 'During dehydration of alcohols to alkenes by heating with conc. H2SO4 the initial Step is –',
        options: [{id: 'a', text: 'Formation of an ester'}, {id: 'b', text: 'Protonation of alcohol'}, {id: 'c', text: 'Formation of carbocation'}, {id: 'd', text: 'Elimination of water'}],
        correctOptionId: 'b'
      },
      {
        id: 'ct1_q10',
        text: 'Which of the following is true regarding alcohols?',
        options: [{id: 'a', text: 'Lower alcohols are liquid at RT and higher ones are solid'}, {id: 'b', text: 'Both lower and higher are liquid at RT'}, {id: 'c', text: 'Higher alcohols are liquid and lower are solid'}, {id: 'd', text: 'Both lower and higher are solid at RT'}],
        correctOptionId: 'a'
      },
      {
        id: 'ct1_q11',
        text: 'CH3CH2OH can be converted into CH3CHO by ______________.',
        options: [{id: 'a', text: 'Catalytic hydrogenation'}, {id: 'b', text: 'Treatment with LiAlH4'}, {id: 'c', text: 'Treatment with pyridiniumchlorochromate (PCC)'}, {id: 'd', text: 'Treatment with KMnO4'}],
        correctOptionId: 'c'
      },
      {
        id: 'ct1_q12',
        text: 'Which of the following compounds is a Benzylic alcohol?',
        imageUrl: 'https://lh3.googleusercontent.com/d/1YDbfGUd6q85EhRJgbN4kBnR2OnzNPTAi',
        options: [{id: 'a', text: 'A, B, C, D'}, {id: 'b', text: 'A, D'}, {id: 'c', text: 'B, C'}, {id: 'd', text: 'A'}],
        correctOptionId: 'c'
      },
      {
        id: 'ct1_q13',
        text: 'Arrange the following in increasing order of boiling point: Propan-1-ol, butan-1-ol, butan-2-ol, pentan-1-ol.',
        options: [
          {id: 'a', text: 'Propan-1-ol, butan-2-ol, butan-1-ol, pentan-1-ol'}, 
          {id: 'b', text: 'Propan-1-ol, butan-1-ol, butan-2-ol, pentan-1-ol'}, 
          {id: 'c', text: 'Pentan-1-ol, butan-2-ol, butan-1-ol, propan-1-ol'}, 
          {id: 'd', text: 'Pentan-1-ol, butan-1-ol, butan-2-ol, propan-1-ol'}
        ],
        correctOptionId: 'd'
      },
      {
        id: 'ct1_q14',
        text: 'Which reagents can be used to oxidise primary alcohols to aldehydes? (i) CrO3, (ii) KMnO4, (iii) PCC, (iv) Cu at 573K.',
        options: [{id: 'a', text: '(i), (ii)'}, {id: 'b', text: '(iii), (iv)'}, {id: 'c', text: '(ii), (iii), (iv)'}, {id: 'd', text: '(i), (iii), (iv)'}],
        correctOptionId: 'd'
      },
      {
        id: 'ct1_q15',
        text: 'What is the product of the hydroboration-oxidation reaction of Propene?',
        options: [{id: 'a', text: 'Propan-2-ol'}, {id: 'b', text: 'Propan-1-ol'}, {id: 'c', text: 'Propane-1, 2-diol'}, {id: 'd', text: 'Prop-1-en-3-ol'}],
        correctOptionId: 'b'
      }
    ]
  },
  {
    id: 't1',
    title: 'Final Mathematics Unit Test',
    type: 'TEST',
    subject: 'Mathematics',
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
