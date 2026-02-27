
import { Assessment, User } from './types';

export const MOCK_TEACHER: User = {
  id: 't1',
  name: 'Prof. Raunak Pandey',
  email: 'raunak@prephive.com',
  username: 'admin',
  password: 'password123',
  role: 'TEACHER',
};

export const MOCK_STUDENTS: User[] = [
  { id: 's1', name: 'Aman Sharma', email: 'aman@example.com', username: 'aman', password: 'password123', role: 'STUDENT', isApproved: true },
  { id: 's2', name: 'Priya Verma', email: 'priya@example.com', username: 'priya', password: 'password123', role: 'STUDENT', isApproved: true },
  { id: 's3', name: 'Rohan Gupta', email: 'rohan@example.com', username: 'rohan', password: 'password123', role: 'STUDENT', isApproved: true },
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
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
        text: 'What is the correct order of reactivity of alcohols in the reaction $\\ce{R-OH + HCl ->[ZnCl2] R-Cl + H2O}$',
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
        options: [{id: 'a', text: '$\\ce{(CH3)2CHCH2OH}$'}, {id: 'b', text: '$\\ce{(CH3)3COH}$'}, {id: 'c', text: '$\\ce{CH3CH2CH2CH2OH}$'}, {id: 'd', text: '$\\ce{CH3CH(OH)CH2CH3}$'}],
        correctOptionId: 'b'
      },
      {
        id: 'ct1_q6',
        text: 'Cyclohexene is best prepared from cyclohexanol by which of the following –',
        options: [{id: 'a', text: '$\\ce{Conc. H3PO4}$'}, {id: 'b', text: '$\\ce{Conc. HCl/ZnCl2}$'}, {id: 'c', text: '$\\ce{Conc. HCl}$'}, {id: 'd', text: '$\\ce{Conc. HBr}$'}],
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
        text: 'During dehydration of alcohols to alkenes by heating with $\\ce{conc. H2SO4}$ the initial Step is –',
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
        text: '$\\ce{CH3CH2OH}$ can be converted into $\\ce{CH3CHO}$ by ______________.',
        options: [{id: 'a', text: 'Catalytic hydrogenation'}, {id: 'b', text: 'Treatment with LiAlH4'}, {id: 'c', text: 'Treatment with pyridiniumchlorochromate (PCC)'}, {id: 'd', text: 'Treatment with KMnO4'}],
        correctOptionId: 'c'
      },
      {
        id: 'ct1_q12',
        text: 'Which of the following compounds is a Benzylic alcohol?',
        smilesStrings: [
          'Oc1ccccc1', // (A) Phenol
          'OCc1ccccc1', // (B) Benzyl alcohol
          'OCc1cccc(C)c1', // (C) 3-methylbenzyl alcohol
          'Oc1cccc(C)c1' // (D) 3-methylphenol
        ],
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
        text: 'Which reagents can be used to oxidise primary alcohols to aldehydes? (i) $\\ce{CrO3}$, (ii) $\\ce{KMnO4}$, (iii) PCC, (iv) Cu at 573K.',
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
    id: 'chem_practice_metals',
    title: 'Metals and Non-Metals - Practice Set',
    type: 'PRACTICE',
    subject: 'Chemistry',
    questions: [
      {
        id: 'm1',
        text: 'Which of the following is a non-metal that is liquid at room temperature?',
        options: [{id: 'a', text: 'Bromine'}, {id: 'b', text: 'Mercury'}, {id: 'c', text: 'Gallium'}, {id: 'd', text: 'Cesium'}],
        correctOptionId: 'a',
        explanation: 'Bromine is the only non-metal that exists as a liquid at room temperature. Mercury is a metal that is liquid at room temperature.'
      },
      {
        id: 'm2',
        text: 'Metals are good conductors of electricity because they have:',
        options: [{id: 'a', text: 'Free neutrons'}, {id: 'b', text: 'Free protons'}, {id: 'c', text: 'Free electrons'}, {id: 'd', text: 'Positive ions'}],
        correctOptionId: 'c',
        explanation: 'Metals have a "sea" of delocalized free electrons that can move through the lattice, carrying electrical charge.'
      },
      {
        id: 'm3',
        text: 'Which metal does not react with $\\ce{dilute HCl}$?',
        options: [{id: 'a', text: 'Magnesium'}, {id: 'b', text: 'Aluminium'}, {id: 'c', text: 'Zinc'}, {id: 'd', text: 'Copper'}],
        correctOptionId: 'd',
        explanation: 'Copper is below hydrogen in the reactivity series, so it cannot displace hydrogen from $\\ce{dilute acids}$ like $\\ce{HCl}$.'
      },
      {
        id: 'm4',
        text: 'When sodium reacts with water, the gas evolved is:',
        options: [{id: 'a', text: 'Oxygen'}, {id: 'b', text: 'Hydrogen'}, {id: 'c', text: 'Nitrogen'}, {id: 'd', text: 'Carbon dioxide'}],
        correctOptionId: 'b',
        explanation: 'Sodium reacts vigorously with water to form sodium hydroxide and hydrogen gas: $\\ce{2Na + 2H2O -> 2NaOH + H2}$.'
      },
      {
        id: 'm5',
        text: 'The nature of metal oxides is generally:',
        options: [{id: 'a', text: 'Acidic'}, {id: 'b', text: 'Neutral'}, {id: 'c', text: 'Basic'}, {id: 'd', text: 'Amphoteric only'}],
        correctOptionId: 'c',
        explanation: 'Most metal oxides are basic in nature as they react with water to form bases or with acids to form salts and water.'
      },
      {
        id: 'm6',
        text: 'Which of the following metal oxides is amphoteric?',
        options: [{id: 'a', text: '$\\ce{Na2O}$'}, {id: 'b', text: '$\\ce{MgO}$'}, {id: 'c', text: '$\\ce{ZnO}$'}, {id: 'd', text: '$\\ce{K2O}$'}],
        correctOptionId: 'c',
        explanation: 'Amphoteric oxides like $\\ce{ZnO}$ and $\\ce{Al2O3}$ can react with both acids and bases to form salts and water.'
      },
      {
        id: 'm7',
        text: 'Which metal is stored in kerosene oil?',
        options: [{id: 'a', text: 'Iron'}, {id: 'b', text: 'Sodium'}, {id: 'c', text: 'Copper'}, {id: 'd', text: 'Zinc'}],
        correctOptionId: 'b',
        explanation: 'Sodium is highly reactive and reacts explosively with air and moisture, so it is stored under kerosene to prevent contact.'
      },
      {
        id: 'm8',
        text: 'The metal that can be cut with a knife is:',
        options: [{id: 'a', text: 'Iron'}, {id: 'b', text: 'Copper'}, {id: 'c', text: 'Sodium'}, {id: 'd', text: 'Aluminium'}],
        correctOptionId: 'c',
        explanation: 'Alkali metals like Sodium, Potassium, and Lithium are very soft and can be easily cut with a knife.'
      },
      {
        id: 'm9',
        text: 'The green coating on copper utensils is:',
        options: [{id: 'a', text: 'Copper oxide'}, {id: 'b', text: 'Copper sulphide'}, {id: 'c', text: 'Basic copper carbonate'}, {id: 'd', text: 'Copper nitrate'}],
        correctOptionId: 'c',
        explanation: 'Copper reacts with moist $\\ce{CO2}$ in the air to form a green layer of basic copper carbonate $\\ce{[CuCO3.Cu(OH)2]}$.'
      },
      {
        id: 'm10',
        text: 'Rust is chemically:',
        options: [{id: 'a', text: 'Iron oxide'}, {id: 'b', text: 'Hydrated iron(III) oxide'}, {id: 'c', text: 'Iron carbonate'}, {id: 'd', text: 'Iron hydroxide'}],
        correctOptionId: 'b',
        explanation: 'Rust is the hydrated form of iron(III) oxide, represented by the formula $\\ce{Fe2O3.xH2O}$.'
      },
      {
        id: 'm11',
        text: 'The process of coating iron with zinc is called:',
        options: [{id: 'a', text: 'Alloying'}, {id: 'b', text: 'Galvanisation'}, {id: 'c', text: 'Roasting'}, {id: 'd', text: 'Calcination'}],
        correctOptionId: 'b',
        explanation: 'Galvanisation is the process of applying a protective zinc coating to iron or steel to prevent rusting.'
      },
      {
        id: 'm12',
        text: 'Which of the following metals is most reactive?',
        options: [{id: 'a', text: '$\\ce{Fe}$'}, {id: 'b', text: '$\\ce{Cu}$'}, {id: 'c', text: '$\\ce{K}$'}, {id: 'd', text: '$\\ce{Ag}$'}],
        correctOptionId: 'c',
        explanation: 'Potassium (K) is at the top of the reactivity series among the given options, making it the most reactive.'
      },
      {
        id: 'm13',
        text: 'Ionic compounds have high melting point because:',
        options: [{id: 'a', text: 'They are covalent'}, {id: 'b', text: 'Strong electrostatic force of attraction exists'}, {id: 'c', text: 'They are soft'}, {id: 'd', text: 'They contain hydrogen bonds'}],
        correctOptionId: 'b',
        explanation: 'Ionic compounds consist of ions held together by strong electrostatic forces, requiring significant energy to break the lattice.'
      },
      {
        id: 'm14',
        text: 'Which of the following can displace copper from $\\ce{CuSO4}$ solution?',
        options: [{id: 'a', text: 'Silver'}, {id: 'b', text: 'Gold'}, {id: 'c', text: 'Zinc'}, {id: 'd', text: 'Platinum'}],
        correctOptionId: 'c',
        explanation: 'Zinc is more reactive than copper and can displace it from its salt solution in a single displacement reaction.'
      },
      {
        id: 'm15',
        text: 'The extraction of metals from sulphide ores is done by:',
        options: [{id: 'a', text: 'Reduction'}, {id: 'b', text: 'Roasting'}, {id: 'c', text: 'Electrolysis'}, {id: 'd', text: 'Distillation'}],
        correctOptionId: 'b',
        explanation: 'Roasting is the process of heating sulphide ores strongly in the presence of excess air to convert them into oxides.'
      }
    ]
  }
];
