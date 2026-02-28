
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
    isAvailable: true,
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
    id: 'chem_practice_metals_II',
    title: 'Metals and Non-Metals - Practice Set-2',
    type: 'PRACTICE',
    subject: 'Chemistry',
    isAvailable: true,
    questions: [
      {
        id: 'mnm_q1',
        text: 'Which of the following metal is obtained by electrolytic reduction process?',
        options: [{id: 'a', text: 'Cu'}, {id: 'b', text: 'Ag'}, {id: 'c', text: 'Fe'}, {id: 'd', text: 'Al'}],
        correctOptionId: 'd',
        explanation: 'Aluminium is obtained by the electrolytic reduction of its oxide (alumina) because it is a highly reactive metal and cannot be reduced by carbon.'
      },
      {
        id: 'mnm_q2',
        text: 'Cinnabar is an ore of which metal?',
        options: [{id: 'a', text: 'Tin'}, {id: 'b', text: 'Aluminium'}, {id: 'c', text: 'Magnesium'}, {id: 'd', text: 'Mercury'}],
        correctOptionId: 'd',
        explanation: 'Cinnabar is the primary ore of mercury, with the chemical formula $\\ce{HgS}$.'
      },
      {
        id: 'mnm_q3',
        text: 'Which of the following does not conduct electricity?',
        options: [{id: 'a', text: 'Solid KCl'}, {id: 'b', text: 'Fused KCl'}, {id: 'c', text: 'Aluminium'}, {id: 'd', text: 'Iron'}],
        correctOptionId: 'a',
        explanation: 'Solid KCl does not conduct electricity because its ions are held in a rigid crystal lattice and are not free to move. In fused or aqueous states, the ions are free to move and conduct electricity.'
      },
      {
        id: 'mnm_q4',
        text: 'Which of the following is not an ionic compound?',
        options: [{id: 'a', text: 'Sodium oxide'}, {id: 'b', text: 'Carbon tetrachloride'}, {id: 'c', text: 'Magnesium chloride'}, {id: 'd', text: 'Sodium chloride'}],
        correctOptionId: 'b',
        explanation: 'Carbon tetrachloride ($\\ce{CCl4}$) is a covalent compound formed by the sharing of electrons. Sodium oxide, magnesium chloride, and sodium chloride are ionic compounds.'
      },
      {
        id: 'mnm_q5',
        text: 'Which metal is associated with haemoglobin?',
        options: [{id: 'a', text: 'Calcium'}, {id: 'b', text: 'Aluminium'}, {id: 'c', text: 'Magnesium'}, {id: 'd', text: 'Iron'}],
        correctOptionId: 'd',
        explanation: 'Iron is the central metal atom in the haemoglobin molecule, which is responsible for transporting oxygen in the blood.'
      },
      {
        id: 'mnm_q6',
        text: 'The liquid non-metal is',
        options: [{id: 'a', text: 'Carbon'}, {id: 'b', text: 'Hydrogen'}, {id: 'c', text: 'Bromine'}, {id: 'd', text: 'Chlorine'}],
        correctOptionId: 'c',
        explanation: 'Bromine is the only non-metal that exists as a liquid at room temperature.'
      },
      {
        id: 'mnm_q7',
        text: 'Choose the correct option for brass:',
        options: [{id: 'a', text: 'Cu-Hg'}, {id: 'b', text: 'Cu-Mg'}, {id: 'c', text: 'Cu-Fe'}, {id: 'd', text: 'Cu-Zn'}],
        correctOptionId: 'd',
        explanation: 'Brass is an alloy consisting primarily of copper (Cu) and zinc (Zn).'
      },
      {
        id: 'mnm_q8',
        text: 'The colour of Iron(II) sulphate solution is',
        options: [{id: 'a', text: 'Blue'}, {id: 'b', text: 'Yellow'}, {id: 'c', text: 'Green'}, {id: 'd', text: 'Orange'}],
        correctOptionId: 'c',
        explanation: 'Iron(II) sulphate ($\\ce{FeSO4}$) solution is typically pale green in colour.'
      },
      {
        id: 'mnm_q9',
        text: 'Electric wires have a coating of insulating material. The material, generally used is -',
        options: [{id: 'a', text: 'Graphite'}, {id: 'b', text: 'Phosphorus'}, {id: 'c', text: 'PVC'}, {id: 'd', text: 'Bromine'}],
        correctOptionId: 'c',
        explanation: 'PVC (Polyvinyl Chloride) is a common insulating material used for coating electric wires due to its excellent dielectric properties.'
      },
      {
        id: 'mnm_q10',
        text: "Ore 'X' of metal 'M' release Carbon dioxide on heating. 'X' can be:",
        options: [{id: 'a', text: '$\\ce{MNO3}$'}, {id: 'b', text: '$\\ce{MCO3}$'}, {id: 'c', text: '$\\ce{MSO3}$'}, {id: 'd', text: '$\\ce{MSO4}$'}],
        correctOptionId: 'b',
        explanation: 'Metal carbonates ($\\ce{MCO3}$) release carbon dioxide ($\\ce{CO2}$) upon heating through a process called calcination.'
      },
      {
        id: 'mnm_q11',
        text: 'Which of these melts easily?',
        options: [{id: 'a', text: 'Steel'}, {id: 'b', text: 'Diamond'}, {id: 'c', text: 'Stainless steel'}, {id: 'd', text: 'solder'}],
        correctOptionId: 'd',
        explanation: 'Solder is an alloy of lead and tin that has a relatively low melting point, making it ideal for joining electrical components.'
      },
      {
        id: 'mnm_q12',
        text: '$\\ce{PbO_{(s)} + C_{(s)} ->[\\Delta] Pb_{(s)} + CO_{(g)}}$ \n\nThe role of \'C\' in the above reaction is of a',
        options: [{id: 'a', text: 'catalyst'}, {id: 'b', text: 'Reducing agent'}, {id: 'c', text: 'oxidizing agent'}, {id: 'd', text: 'solvent'}],
        correctOptionId: 'b',
        explanation: 'In the reaction $\\ce{PbO + C -> Pb + CO}$, carbon (C) removes oxygen from lead oxide, thereby acting as a reducing agent.'
      },
      {
        id: 'mnm_q13',
        text: 'Which of the following reaction does not occur?',
        options: [
          {id: 'a', text: 'Lead metal + silver nitrate solution'}, 
          {id: 'b', text: 'Lead metal + zinc sulphate solution'}, 
          {id: 'c', text: 'Magnesium metal + copper sulphate solution'}, 
          {id: 'd', text: 'Copper metal + silver nitrate solution'}
        ],
        correctOptionId: 'b',
        explanation: 'Lead is less reactive than zinc, so it cannot displace zinc from its sulphate solution.'
      },
      {
        id: 'mnm_q14',
        text: 'Copper is used in silver coins to',
        options: [{id: 'a', text: 'reduce melting point'}, {id: 'b', text: 'increase conductivity'}, {id: 'c', text: 'reduce solubility'}, {id: 'd', text: 'increase hardness'}],
        correctOptionId: 'd',
        explanation: 'Copper is added to silver in coins primarily to increase the hardness and durability of the alloy.'
      },
      {
        id: 'mnm_q15',
        text: 'Which of the following property is not shown by metals?',
        options: [{id: 'a', text: 'Electrical conduction'}, {id: 'b', text: 'Sonorous in nature'}, {id: 'c', text: 'Dullness'}, {id: 'd', text: 'Ductility'}],
        correctOptionId: 'c',
        explanation: 'Metals are generally lustrous (shiny). Dullness is a characteristic property of non-metals.'
      }
    ]
  },
  {
    id: 'chem_practice_metals_III',
    title: 'Metal and Non-Metal III (Subjective)',
    type: 'PRACTICE',
    subject: 'Chemistry',
    isAvailable: true,
    questions: [
      {
        id: 'mnm_s1',
        text: 'What is Aqua Regia and its composition?',
        options: [
          {id: 'a', text: 'Mixture of conc. $\\ce{HCl}$ and conc. $\\ce{HNO3}$ in 3:1 ratio'}, 
          {id: 'b', text: 'Mixture of conc. $\\ce{HCl}$ and conc. $\\ce{HNO3}$ in 1:3 ratio'}, 
          {id: 'c', text: 'Mixture of conc. $\\ce{H2SO4}$ and conc. $\\ce{HCl}$ in 3:1 ratio'}, 
          {id: 'd', text: 'Pure concentrated $\\ce{HNO3}$'}
        ],
        correctOptionId: 'a',
        explanation: 'Aqua Regia (Latin for "royal water") is a highly corrosive mixture of concentrated hydrochloric acid ($\\ce{HCl}$) and concentrated nitric acid ($\\ce{HNO3}$) in a molar ratio of 3:1. It is one of the few reagents that can dissolve noble metals like gold and platinum.'
      },
      {
        id: 'mnm_s2',
        text: 'Which chemical equation correctly shows the reaction between Zinc oxide and Sodium hydroxide?',
        options: [
          {id: 'a', text: '$\\ce{ZnO + NaOH -> NaZnO + H2O}$'}, 
          {id: 'b', text: '$\\ce{ZnO + 2NaOH -> Na2ZnO2 + H2O}$'}, 
          {id: 'c', text: '$\\ce{ZnO + NaOH -> Na2O + Zn(OH)2}$'}, 
          {id: 'd', text: '$\\ce{ZnO + 2NaOH -> Na2O + Zn + H2O}$'}
        ],
        correctOptionId: 'b',
        explanation: 'Zinc oxide is an amphoteric oxide. It reacts with sodium hydroxide (a base) to form sodium zincate and water: $\\ce{ZnO + 2NaOH -> Na2ZnO2 + H2O}$.'
      },
      {
        id: 'mnm_s3',
        text: 'Why are food cans coated with tin and not with zinc?',
        options: [
          {id: 'a', text: 'Zinc is more reactive than tin'}, 
          {id: 'b', text: 'Tin is more reactive than zinc'}, 
          {id: 'c', text: 'Zinc has a lower melting point than tin'}, 
          {id: 'd', text: 'Tin is a better conductor of heat'}
        ],
        correctOptionId: 'a',
        explanation: 'Zinc is more reactive than tin. If food cans were coated with zinc, it could react with the organic acids present in food, potentially making the food toxic. Tin is less reactive and safer for food contact.'
      },
      {
        id: 'mnm_s4',
        text: 'Which of the following alloys have electrical conductivity less than that of pure metals?',
        options: [
          {id: 'a', text: 'Brass and Bronze'}, 
          {id: 'b', text: 'Solder and Steel'}, 
          {id: 'c', text: 'Amalgam and Duralumin'}, 
          {id: 'd', text: 'All of the above'}
        ],
        correctOptionId: 'd',
        explanation: 'Alloys generally have lower electrical conductivity and lower melting points than the pure metals from which they are made. For example, brass (Cu and Zn) and bronze (Cu and Sn) are poorer conductors than pure copper.'
      },
      {
        id: 'mnm_s5',
        text: 'Why do ionic compounds have high melting points?',
        options: [
          {id: 'a', text: 'Due to weak Van der Waals forces'}, 
          {id: 'b', text: 'Due to strong electrostatic forces of attraction between ions'}, 
          {id: 'c', text: 'Because they are made of non-metals'}, 
          {id: 'd', text: 'Because they have low lattice energy'}
        ],
        correctOptionId: 'b',
        explanation: 'Ionic compounds consist of a giant lattice of oppositely charged ions held together by strong electrostatic forces. A large amount of energy is required to break these strong bonds, resulting in high melting and boiling points.'
      },
      {
        id: 'mnm_s6',
        text: 'Which element is displaced by reactive metals from dilute acids?',
        options: [
          {id: 'a', text: 'Oxygen'}, 
          {id: 'b', text: 'Chlorine'}, 
          {id: 'c', text: 'Hydrogen'}, 
          {id: 'd', text: 'Nitrogen'}
        ],
        correctOptionId: 'c',
        explanation: 'Metals that are more reactive than hydrogen (above it in the reactivity series) can displace hydrogen gas from dilute acids like $\\ce{HCl}$ or $\\ce{H2SO4}$.'
      },
      {
        id: 'mnm_s7',
        text: 'Assertion (A): Metals have high melting point. \nReason (R): Metals are found in solid state.',
        options: [
          {id: 'a', text: 'Both A and R are true, and R is correct explanation of A'}, 
          {id: 'b', text: 'Both A and R are true, but R is not the correct explanation of A'}, 
          {id: 'c', text: 'A is true, but R is false'}, 
          {id: 'd', text: 'A is false, but R is true'}
        ],
        correctOptionId: 'b',
        explanation: 'Both statements are true, but the state of matter (solid) is not the reason for high melting points. The high melting point is due to the strong metallic bonding between atoms.'
      },
      {
        id: 'mnm_s8',
        text: 'Assertion (A): Sulphide ores are roasted. \nReason (R): It is easier to obtain metal from their oxides than from sulphides.',
        options: [
          {id: 'a', text: 'Both A and R are true, and R is correct explanation of A'}, 
          {id: 'b', text: 'Both A and R are true, but R is not the correct explanation of A'}, 
          {id: 'c', text: 'A is true, but R is false'}, 
          {id: 'd', text: 'A is false, but R is true'}
        ],
        correctOptionId: 'a',
        explanation: 'Sulphide ores are converted into oxides by heating strongly in the presence of excess air (roasting) because metals are more easily reduced from their oxides using carbon or other reducing agents.'
      },
      {
        id: 'mnm_s9',
        text: 'Assertion (A): Anode mud settles at the bottom of electrolytic tank. \nReason (R): Anode mud contains soluble impurities.',
        options: [
          {id: 'a', text: 'Both A and R are true, and R is correct explanation of A'}, 
          {id: 'b', text: 'Both A and R are true, but R is not the correct explanation of A'}, 
          {id: 'c', text: 'A is true, but R is false'}, 
          {id: 'd', text: 'A is false, but R is true'}
        ],
        correctOptionId: 'c',
        explanation: 'Anode mud consists of insoluble impurities that fall to the bottom of the tank during electrolytic refining. Soluble impurities remain in the electrolyte solution.'
      },
      {
        id: 'mnm_s10',
        text: 'Assertion (A): Zinc oxide is an amphoteric oxide. \nReason (R): It reacts with acid as well as base to produce salt and water.',
        options: [
          {id: 'a', text: 'Both A and R are true, and R is correct explanation of A'}, 
          {id: 'b', text: 'Both A and R are true, but R is not the correct explanation of A'}, 
          {id: 'c', text: 'A is true, but R is false'}, 
          {id: 'd', text: 'A is false, but R is true'}
        ],
        correctOptionId: 'a',
        explanation: 'Zinc oxide ($\\ce{ZnO}$) is amphoteric because it shows both acidic and basic character, reacting with both acids (like $\\ce{HCl}$) and bases (like $\\ce{NaOH}$) to form salt and water.'
      },
      {
        id: 'mnm_s11',
        text: 'Assertion (A): Silver becomes brown in colour when exposed to air. \nReason (R): It reacts with hydrogen sulphide and forms silver sulphide.',
        options: [
          {id: 'a', text: 'Both A and R are true, and R is correct explanation of A'}, 
          {id: 'b', text: 'Both A and R are true, but R is not the correct explanation of A'}, 
          {id: 'c', text: 'A is true, but R is false'}, 
          {id: 'd', text: 'A is false, but R is true'}
        ],
        correctOptionId: 'd',
        explanation: 'Silver actually turns black (not brown) when exposed to air due to the formation of silver sulphide ($\\ce{Ag2S}$) by reacting with $\\ce{H2S}$ in the atmosphere. Thus A is false.'
      },
      {
        id: 'mnm_s12',
        text: 'Read the following passage and answer the questions:\nElements are pure form of matter, which are divided into metals, non-metals and metalloids. Approximately three-quarters of all known chemical elements are metals. The most abundant varieties in the earth\'s crust are aluminum, iron, calcium, sodium, potassium, and magnesium. The vast palinin, an sale equent eir ren te saw sucas one gold.\nreadily react with other elements.\n\nIdentify the metalloid from the following options:',
        options: [
          {id: 'a', text: 'Carbon'}, 
          {id: 'b', text: 'Silicon'}, 
          {id: 'c', text: 'Helium'}, 
          {id: 'd', text: 'Mercury'}
        ],
        correctOptionId: 'b',
        explanation: 'Silicon (Si) is a metalloid because it exhibits properties of both metals and non-metals. Carbon is a non-metal, Helium is a noble gas, and Mercury is a metal.'
      },
      {
        id: 'mnm_s13',
        text: 'Read the following passage and answer the questions:\nElements are pure form of matter, which are divided into metals, non-metals and metalloids. Approximately three-quarters of all known chemical elements are metals. The most abundant varieties in the earth\'s crust are aluminum, iron, calcium, sodium, potassium, and magnesium. The vast palinin, an sale equent eir ren te saw sucas one gold.\nreadily react with other elements.\n\nWhich of the following is the correct statement about metals?',
        options: [
          {id: 'a', text: 'Metals form acidic oxides'}, 
          {id: 'b', text: 'Metal oxides cause acid rain'}, 
          {id: 'c', text: 'All metals react with hot water'}, 
          {id: 'd', text: 'Metals form ionic chlorides'}
        ],
        correctOptionId: 'd',
        explanation: 'Metals typically react with chlorine to form ionic chlorides (e.g., $\\ce{NaCl}$, $\\ce{MgCl2}$). Most metal oxides are basic, not acidic. Not all metals react with hot water (e.g., Iron reacts with steam, Gold doesn\'t react at all).'
      },
      {
        id: 'mnm_s14',
        text: 'Read the following passage and answer the questions:\nElements are pure form of matter, which are divided into metals, non-metals and metalloids. Approximately three-quarters of all known chemical elements are metals. The most abundant varieties in the earth\'s crust are aluminum, iron, calcium, sodium, potassium, and magnesium. The vast palinin, an sale equent eir ren te saw sucas one gold.\nreadily react with other elements.\n\nWhich metal is most abundant in the earth\'s crust?',
        options: [
          {id: 'a', text: 'Iron'}, 
          {id: 'b', text: 'Aluminium'}, 
          {id: 'c', text: 'Calcium'}, 
          {id: 'd', text: 'Sodium'}
        ],
        correctOptionId: 'b',
        explanation: 'Aluminium is the most abundant metal in the Earth\'s crust, followed by iron. Oxygen is the most abundant element overall.'
      },
      {
        id: 'mnm_s15',
        text: 'Read the following passage and answer the questions:\nElements are pure form of matter, which are divided into metals, non-metals and metalloids. Approximately three-quarters of all known chemical elements are metals. The most abundant varieties in the earth\'s crust are aluminum, iron, calcium, sodium, potassium, and magnesium. The vast palinin, an sale equent eir ren te saw sucas one gold.\nreadily react with other elements.\n\nWhy is gold used for making jewellery?',
        options: [
          {id: 'a', text: 'It is highly reactive'}, 
          {id: 'b', text: 'It is very cheap'}, 
          {id: 'c', text: 'It is highly malleable, ductile and unreactive'}, 
          {id: 'd', text: 'It is a liquid at room temperature'}
        ],
        correctOptionId: 'c',
        explanation: 'Gold is ideal for jewellery because it is highly malleable (can be beaten into thin sheets), ductile (can be drawn into wires), and extremely unreactive, so it does not tarnish or corrode over time.'
      },
      {
        id: 'mnm_s16',
        text: 'Read the following passage and answer the questions:\nElements are pure form of matter, which are divided into metals, non-metals and metalloids. Approximately three-quarters of all known chemical elements are metals. The most abundant varieties in the earth\'s crust are aluminum, iron, calcium, sodium, potassium, and magnesium. The vast palinin, an sale equent eir ren te saw sucas one gold.\nreadily react with other elements.\n\nWhich metal can be used for making electric wires: Pb or Al?',
        options: [
          {id: 'a', text: 'Pb (Lead)'}, 
          {id: 'b', text: 'Al (Aluminium)'}, 
          {id: 'c', text: 'Both Pb and Al'}, 
          {id: 'd', text: 'Neither Pb nor Al'}
        ],
        correctOptionId: 'b',
        explanation: 'Aluminium (Al) is used for making electric wires because it is a good conductor of electricity and is relatively cheap. Lead (Pb) is a poor conductor of electricity compared to aluminium and is not suitable for this purpose.'
      }
    ]
  },
  {
    id: 'chem_practice_metals_subj_II',
    title: 'Metal and Non-Metal (Subjective II)',
    type: 'PRACTICE',
    subject: 'Chemistry',
    isAvailable: true,
    questions: [
      {
        id: 'mnm_s2_1',
        text: 'What is an amalgam? Write the constituent elements of solder. (2 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'An amalgam is an alloy of mercury with one or more other metals. Solder is an alloy of lead (Pb) and tin (Sn).'
      },
      {
        id: 'mnm_s2_2',
        text: 'Distinguish between: (a) Roasting and calcination (b) Mineral and ore (2 Marks)',
        options: [],
        correctOptionId: '',
        explanation: '(a) **Roasting**: Heating of sulphide ores in the presence of excess air to convert them into oxides. **Calcination**: Heating of carbonate ores in limited supply of air to convert them into oxides.\n(b) **Mineral**: Naturally occurring chemical substances in the earth\'s crust. **Ore**: Minerals from which metals can be extracted profitably and easily.'
      },
      {
        id: 'mnm_s2_3',
        text: 'Write the chemical equation for heating of Cu and Fe respectively. (2 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'Heating of Copper: $\\ce{2Cu + O2 -> 2CuO}$ (Copper(II) oxide)\nHeating of Iron: $\\ce{3Fe + 2O2 -> Fe3O4}$ (Iron(II,III) oxide)'
      },
      {
        id: 'mnm_s2_4',
        text: 'What is galvanization? How is it beneficial? (2 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'Galvanization is the process of coating iron or steel with a thin layer of zinc to prevent rusting. It is beneficial because even if the zinc coating is scratched, the zinc continues to protect the iron from corrosion through sacrificial protection.'
      },
      {
        id: 'mnm_s2_5',
        text: 'Why is hydrogen gas generally not evolved when metals react with dilute nitric acid? Name two metals which evolve hydrogen gas with the same acid. (2 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'Hydrogen gas is not evolved because $\\ce{HNO3}$ is a strong oxidizing agent. It oxidizes the $\\ce{H2}$ produced to water and itself gets reduced to any of the nitrogen oxides ($\\ce{N2O}$, $\\ce{NO}$, $\\ce{NO2}$). However, Magnesium (Mg) and Manganese (Mn) react with very dilute $\\ce{HNO3}$ to evolve $\\ce{H2}$ gas.'
      },
      {
        id: 'mnm_s2_6',
        text: 'Explain thermite process. (2 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'The thermite process involves the displacement reaction between a metal oxide (like $\\ce{Fe2O3}$) and aluminium powder. The reaction is highly exothermic, and the metal is produced in molten state. Example: $\\ce{Fe2O3(s) + 2Al(s) -> 2Fe(l) + Al2O3(s) + Heat}$. It is used to join railway tracks.'
      },
      {
        id: 'mnm_s2_7',
        text: '"Every ore is a mineral, but not every mineral an ore." Explain. (2 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'Minerals are naturally occurring substances containing metals. Ores are specific minerals from which a metal can be extracted economically and conveniently. While all ores are found in nature (minerals), not all minerals have high enough metal content or easy extraction methods to be classified as ores.'
      },
      {
        id: 'mnm_s2_8',
        text: 'Why can highly reactive metals not obtained from their oxides using coke as a reducing agent? (2 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'Highly reactive metals (like Na, Ca, Mg, Al) have a greater affinity for oxygen than carbon does. Therefore, carbon (coke) cannot reduce the oxides of these metals to the respective metals.'
      },
      {
        id: 'mnm_s2_9',
        text: 'Distinguish between metals and non-metals on the basis of chemical properties. (2 Marks)',
        options: [],
        correctOptionId: '',
        explanation: '1. **Oxides**: Metals form basic or amphoteric oxides; Non-metals form acidic or neutral oxides.\n2. **Reaction with Acids**: Metals generally displace hydrogen from dilute acids; Non-metals do not.\n3. **Nature of Ions**: Metals form cations (electropositive); Non-metals form anions (electronegative).'
      },
      {
        id: 'mnm_s2_10',
        text: 'Ionic compounds are good conductors of electricity under specific conditions. Write the two conditions and give reason. (3 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'Ionic compounds conduct electricity in: (1) **Molten state** and (2) **Aqueous solution**. \n**Reason**: In solid state, ions are held together by strong electrostatic forces and cannot move. In molten or aqueous state, these forces are overcome, allowing ions to move freely and carry electric current.'
      },
      {
        id: 'mnm_s2_11',
        text: 'Why are metal sulphides and carbonates converted to oxides prior to reduction? Write the equation for the chemical reactions occuring during roasting and calcination of zinc ores. (3 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'It is easier to reduce a metal oxide to a metal than to reduce a metal sulphide or carbonate. \n**Roasting (Zinc Blende)**: $\\ce{2ZnS + 3O2 -> 2ZnO + 2SO2}$\n**Calcination (Calamine)**: $\\ce{ZnCO3 -> ZnO + CO2}$'
      },
      {
        id: 'mnm_s2_12',
        text: 'What are alloys? How are they prepared? Name the alloy used for welding electric wires together. (3 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'An alloy is a homogeneous mixture of two or more metals, or a metal and a non-metal. They are prepared by first melting the primary metal and then dissolving the other elements in it in definite proportions, followed by cooling. **Solder** (Pb + Sn) is used for welding electric wires.'
      },
      {
        id: 'mnm_s2_13',
        text: 'Write the differences between electrolytic reduction and electrolytic refining. (3 Marks)',
        options: [],
        correctOptionId: '',
        explanation: '**Electrolytic Reduction**: Used to extract highly reactive metals from their molten ores (e.g., Al from $\\ce{Al2O3}$). The metal is deposited at the cathode.\n**Electrolytic Refining**: Used to purify impure metals (e.g., Cu). Impure metal is the anode, pure metal is the cathode. Pure metal transfers from anode to cathode.'
      },
      {
        id: 'mnm_s2_14',
        text: 'Describe an activity to study conditions necessary for rusting of iron. (3 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'Take three test tubes: \n1. **A**: Iron nails in water + air (Rusting occurs).\n2. **B**: Iron nails in boiled distilled water + oil layer (No air, no rusting).\n3. **C**: Iron nails with anhydrous $\\ce{CaCl2}$ (No moisture, no rusting).\n**Conclusion**: Both air (oxygen) and moisture (water) are necessary for rusting.'
      },
      {
        id: 'mnm_s2_15',
        text: 'Show the formation of molecules of Magnesium oxide, aluminium oxide and potassium chloride by electron transfer. (3 Marks)',
        options: [],
        correctOptionId: '',
        explanation: '1. **MgO**: $\\ce{Mg (2,8,2) -> Mg^{2+} + 2e^-}$; $\\ce{O (2,6) + 2e^- -> O^{2-}}$. $\\ce{Mg^{2+} + O^{2-} -> MgO}$.\n2. **KCl**: $\\ce{K (2,8,8,1) -> K^+ + e^-}$; $\\ce{Cl (2,8,7) + e^- -> Cl^-}$. $\\ce{K^+ + Cl^- -> KCl}$.\n3. **Al2O3**: $\\ce{2Al (2,8,3) -> 2Al^{3+} + 6e^-}$; $\\ce{3O (2,6) + 6e^- -> 3O^{2-}}$. $\\ce{2Al^{3+} + 3O^{2-} -> Al2O3}$.'
      },
      {
        id: 'mnm_s2_16',
        text: 'Describe an activity to show the reaction between iron and steam. (3 Marks)',
        options: [],
        correctOptionId: '',
        explanation: 'Heat a piece of glass wool soaked in water to generate steam. Pass this steam over heated iron filings in a combustion tube. \n**Observation**: A black residue of magnetic iron oxide ($\\ce{Fe3O4}$) is formed and hydrogen gas is evolved. \n**Equation**: $\\ce{3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g)}$.'
      },
      {
        id: 'mnm_s2_17',
        text: 'Give reasons: (a) Platinum is used to make jewellery. (b) Lithium is stored under kerosene. (c) Aluminium is a highly reactive metal, yet it is used to make utensils for cooking. (5 Marks)',
        options: [],
        correctOptionId: '',
        explanation: '(a) Platinum is highly unreactive, does not corrode, and has a bright luster.\n(b) Lithium (like Na and K) is highly reactive and reacts vigorously with air and moisture, catching fire. Kerosene prevents this contact.\n(c) Aluminium reacts with oxygen to form a thin, stable, and protective layer of aluminium oxide ($\\ce{Al2O3}$) which prevents further corrosion. It is also a good conductor of heat.'
      },
      {
        id: 'mnm_s2_18',
        text: 'Give a detailed account of steps of extracting pure copper from its ore. (5 Marks)',
        options: [],
        correctOptionId: '',
        explanation: '1. **Concentration**: Sulphide ore ($\\ce{Cu2S}$) is concentrated by froth floatation.\n2. **Roasting**: $\\ce{2Cu2S + 3O2 -> 2Cu2O + 2SO2}$.\n3. **Self-Reduction**: $\\ce{2Cu2O + Cu2S -> 6Cu + SO2}$.\n4. **Electrolytic Refining**: Impure copper is anode, pure copper is cathode. Electrolyte is acidified $\\ce{CuSO4}$. Pure copper deposits on cathode.'
      }
    ]
  }
];
