
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  query, 
  where
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Submission, Assessment, User } from '../types';
import { INITIAL_ASSESSMENTS, MOCK_TEACHER, MOCK_STUDENTS } from '../constants';

const COLLECTIONS = {
  USERS: 'users',
  SUBMISSIONS: 'submissions',
  ASSESSMENTS: 'assessments'
};

const USER_SESSION_KEY = 'panday_user_id';

export const storageService = {
  getCurrentUserLocal: (): string | null => {
    return localStorage.getItem(USER_SESSION_KEY);
  },
  
  setCurrentUserLocal: (userId: string | null) => {
    if (userId) localStorage.setItem(USER_SESSION_KEY, userId);
    else localStorage.removeItem(USER_SESSION_KEY);
  },

  getUserById: async (userId: string): Promise<User | null> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as User) : null;
    } catch (e) {
      console.error("Firebase getUserById error:", e);
      return null;
    }
  },

  getAllStudents: async (): Promise<User[]> => {
    try {
      const q = query(collection(db, COLLECTIONS.USERS), where("role", "==", "STUDENT"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (e) {
      console.error("Error getting students:", e);
      return [];
    }
  },

  registerStudent: async (student: User): Promise<void> => {
    await setDoc(doc(db, COLLECTIONS.USERS, student.id), student);
  },

  findUserByCredentials: async (username: string, role: string): Promise<User | null> => {
    try {
      const qUsername = query(
        collection(db, COLLECTIONS.USERS), 
        where("username", "==", username),
        where("role", "==", role)
      );
      const snapUsername = await getDocs(qUsername);
      if (!snapUsername.empty) return snapUsername.docs[0].data() as User;

      const qEmail = query(
        collection(db, COLLECTIONS.USERS), 
        where("email", "==", username),
        where("role", "==", role)
      );
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) return snapEmail.docs[0].data() as User;
    } catch (e) {
      console.error("Auth query error:", e);
    }
    return null;
  },

  getSubmissions: async (studentId?: string): Promise<Submission[]> => {
    try {
      const submissionsRef = collection(db, COLLECTIONS.SUBMISSIONS);
      const q = studentId 
        ? query(submissionsRef, where("studentId", "==", studentId))
        : query(submissionsRef);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Submission);
    } catch (e) {
      console.error("Error fetching submissions:", e);
      return [];
    }
  },

  saveSubmission: async (submission: Submission): Promise<void> => {
    await addDoc(collection(db, COLLECTIONS.SUBMISSIONS), submission);
  },

  saveAssessment: async (assessment: Assessment): Promise<void> => {
    await setDoc(doc(db, COLLECTIONS.ASSESSMENTS, assessment.id), assessment);
  },

  getAssessments: async (): Promise<Assessment[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.ASSESSMENTS));
      const cloudAssessments = querySnapshot.docs.map(doc => doc.data() as Assessment);
      
      // If cloud is empty, seed with initials
      if (cloudAssessments.length === 0) {
        for (const assessment of INITIAL_ASSESSMENTS) {
          await setDoc(doc(db, COLLECTIONS.ASSESSMENTS, assessment.id), assessment);
        }
        return INITIAL_ASSESSMENTS;
      }
      return cloudAssessments;
    } catch (e) {
      console.error("Error fetching assessments:", e);
      return INITIAL_ASSESSMENTS;
    }
  },

  seedInitialData: async (): Promise<void> => {
    try {
      const teacherDoc = doc(db, COLLECTIONS.USERS, MOCK_TEACHER.id);
      await setDoc(teacherDoc, MOCK_TEACHER, { merge: true });
      for (const student of MOCK_STUDENTS) {
        await setDoc(doc(db, COLLECTIONS.USERS, student.id), student, { merge: true });
      }
    } catch (e) {
      console.error("Seeding initial data failed:", e);
    }
  }
};
