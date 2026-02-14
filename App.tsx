
import React, { useState, useEffect } from 'react';
import { User, Assessment } from './types';
import { storageService } from './services/storageService';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { TeacherDashboard } from './components/Dashboard/TeacherDashboard';
import { AuthFlow } from './components/Auth/AuthFlow';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        // Step 1: Seed core data if missing
        await storageService.seedInitialData();
        
        // Step 2: Fetch assessments (seeds them if empty)
        const fetchedAssessments = await storageService.getAssessments();
        setAssessments(fetchedAssessments);

        // Step 3: Check for logged in session
        const localUserId = storageService.getCurrentUserLocal();
        if (localUserId) {
          const user = await storageService.getUserById(localUserId);
          if (user) setCurrentUser(user);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setInitError("Failed to connect to Firebase. Check console and Firebase Rules.");
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    storageService.setCurrentUserLocal(user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storageService.setCurrentUserLocal(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-900 font-bold animate-pulse tracking-wide uppercase text-xs">Initializing Panday Classes Cloud...</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
        <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
        <h2 className="text-2xl font-bold text-red-900 mb-2">Connection Error</h2>
        <p className="text-red-700 max-w-md mb-6">{initError}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg">Retry Connection</button>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthFlow onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-book-open text-white text-sm"></i>
            </div>
            <span className="font-black text-indigo-900 tracking-tight uppercase">Panday Classes</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-800">{currentUser.name}</span>
              <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 rounded-full">
                {currentUser.role}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-2"
              title="Logout"
            >
              <i className="fa-solid fa-power-off text-lg"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentUser.role === 'TEACHER' ? (
          <TeacherDashboard user={currentUser} assessments={assessments} />
        ) : (
          <StudentDashboard user={currentUser} assessments={assessments} />
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400 font-medium">
          © {new Date().getFullYear()} Panday Classes Education Pvt. Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
