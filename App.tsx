
import React, { useState, useEffect } from 'react';
import { User, Assessment, Role } from './types';
import { MOCK_TEACHER, MOCK_STUDENTS } from './constants';
import { storageService } from './services/storageService';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { TeacherDashboard } from './components/Dashboard/TeacherDashboard';
import { Card } from './components/UI/Card';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(storageService.getCurrentUser());
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Initialize assessments from storage
    setAssessments(storageService.getAssessments());
  }, []);

  const handleLogin = (role: Role, studentId?: string) => {
    let user: User | null = null;
    if (role === 'TEACHER') {
      user = MOCK_TEACHER;
    } else if (studentId) {
      user = MOCK_STUDENTS.find(s => s.id === studentId) || null;
    }

    if (user) {
      setCurrentUser(user);
      storageService.setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storageService.setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <i className="fa-solid fa-book-open text-white text-2xl"></i>
              </div>
              <h1 className="text-3xl font-black text-indigo-900 tracking-tight">Panday Classes</h1>
            </div>
            <h2 className="text-5xl font-black text-gray-900 leading-tight mb-6">
              Excellence in <br /> 
              <span className="text-indigo-600">Education.</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join the most trusted coaching platform for Mathematics and Science. Our interactive MCQ portal helps you master concepts through rigorous practice.
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-indigo-600">500+</span>
                <span className="text-sm text-gray-500 font-bold uppercase">Students</span>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-indigo-600">98%</span>
                <span className="text-sm text-gray-500 font-bold uppercase">Success Rate</span>
              </div>
            </div>
          </div>

          <Card className="p-10 !shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Login to your portal</h3>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-gray-500 uppercase mb-3">Teacher Access</label>
                <button 
                  onClick={() => handleLogin('TEACHER')}
                  className="w-full flex items-center justify-between p-4 bg-indigo-50 border-2 border-transparent hover:border-indigo-600 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600">
                      <i className="fa-solid fa-user-tie text-xl"></i>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-indigo-900">Sign in as Teacher</p>
                      <p className="text-xs text-indigo-600 font-semibold uppercase">Faculty Portal</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-indigo-400 group-hover:translate-x-1 transition-transform"></i>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400 font-bold">or</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase mb-3">Student Selection</label>
                <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {MOCK_STUDENTS.map(student => (
                    <button
                      key={student.id}
                      onClick={() => handleLogin('STUDENT', student.id)}
                      className="w-full text-left p-4 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-indigo-100 hover:shadow-md rounded-xl transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-700">{student.name}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-gray-400">Login</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
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
            <span className="font-black text-indigo-900 tracking-tight">PANDAY CLASSES</span>
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
