
export type Role = 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  username?: string;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: MCQOption[];
  correctOptionId: string;
  explanation?: string;
  imageUrl?: string;
}

export type AssessmentType = 'PRACTICE' | 'TEST';
export type Subject = 'Mathematics' | 'Physics' | 'Chemistry';

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  subject?: Subject;
  questions: Question[];
  durationMinutes?: number;
}

export interface Submission {
  id: string;
  studentId: string;
  assessmentId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  responses: Record<string, string>; // questionId -> selectedOptionId
}

export interface AppState {
  currentUser: User | null;
  assessments: Assessment[];
  submissions: Submission[];
}
