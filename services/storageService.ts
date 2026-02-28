
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

const USER_SESSION_KEY = 'prephive_user_id';

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
      const q = query(
        collection(db, COLLECTIONS.USERS), 
        where("role", "==", "STUDENT"),
        where("isApproved", "==", true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (e) {
      console.error("Error getting students:", e);
      return [];
    }
  },

  getPendingStudents: async (): Promise<User[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS), 
        where("role", "==", "STUDENT"),
        where("isApproved", "==", false)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (e) {
      console.error("Error getting pending students:", e);
      return [];
    }
  },

  approveStudent: async (studentId: string): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.USERS, studentId);
    await setDoc(docRef, { isApproved: true }, { merge: true });
  },

  rejectStudent: async (studentId: string): Promise<void> => {
    // For rejection, we can just delete the user document or mark as rejected
    // Deleting is simpler for this flow
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(doc(db, COLLECTIONS.USERS, studentId));
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
      // Smart Seed: Only add initial assessments if they don't exist in the database.
      // This prevents overwriting user-managed fields like 'isAvailable'.
      for (const assessment of INITIAL_ASSESSMENTS) {
        const docRef = doc(db, COLLECTIONS.ASSESSMENTS, assessment.id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, assessment);
        }
      }

      const querySnapshot = await getDocs(collection(db, COLLECTIONS.ASSESSMENTS));
      return querySnapshot.docs.map(doc => doc.data() as Assessment);
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
