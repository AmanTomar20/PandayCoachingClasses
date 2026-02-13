
import { Submission, Assessment, User } from '../types';
import { INITIAL_ASSESSMENTS } from '../constants';

const KEYS = {
  USER: 'panday_user',
  SUBMISSIONS: 'panday_submissions',
  ASSESSMENTS: 'panday_assessments'
};

export const storageService = {
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.USER);
  },
  getSubmissions: (): Submission[] => {
    const data = localStorage.getItem(KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  },
  saveSubmission: (submission: Submission) => {
    const submissions = storageService.getSubmissions();
    submissions.push(submission);
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },
  getAssessments: (): Assessment[] => {
    const data = localStorage.getItem(KEYS.ASSESSMENTS);
    if (!data) {
      localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
      return INITIAL_ASSESSMENTS;
    }
    return JSON.parse(data);
  }
};
