
import React, { useState, useEffect } from 'react';
import { Assessment, User, Submission, Subject, AssessmentType } from '../../types';
import { Card } from '../UI/Card';
import { MCQSession } from '../Assessment/MCQSession';
import { SubmissionReview } from '../Assessment/SubmissionReview';
import { storageService } from '../../services/storageService';

interface StudentDashboardProps {
  user: User;
  assessments: Assessment[];
}

type ViewState = 'DASHBOARD' | 'SUBJECT_PICKER' | 'SET_PICKER' | 'REVIEW';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, assessments }) => {
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation states
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [sessionMode, setSessionMode] = useState<AssessmentType>('PRACTICE');
  const [reviewSubmission, setReviewSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [user.id]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await storageService.getSubmissions(user.id);
      setSubmissions(data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (submission: Submission) => {
    try {
      await storageService.saveSubmission(submission);
      await fetchSubmissions(); 
      setActiveAssessment(null);
      setCurrentView('DASHBOARD');
    } catch (err) {
      console.error("Error saving submission:", err);
    }
  };

  const handleCancel = () => {
    setActiveAssessment(null);
  };

  const startSession = (mode: AssessmentType) => {
    setSessionMode(mode);
    setCurrentView('SUBJECT_PICKER');
  };

  const startReview = (submission: Submission) => {
    setReviewSubmission(submission);
    setCurrentView('REVIEW');
  };

  // Content rendering logic
  if (activeAssessment) {
    return (
      <div className="py-8 px-4">
        <MCQSession 
          assessment={activeAssessment} 
          studentId={user.id} 
          onComplete={handleComplete} 
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (currentView === 'REVIEW' && reviewSubmission) {
    const assessment = assessments.find(a => a.id === reviewSubmission.assessmentId);
    return (
      <div className="py-8 px-4">
        <SubmissionReview 
          submission={reviewSubmission}
          assessment={assessment!}
          onClose={() => {
            setCurrentView('DASHBOARD');
            setReviewSubmission(null);
          }}
        />
      </div>
    );
  }

  // --- Subject Selection View (Shared for Practice & Test) ---
  if (currentView === 'SUBJECT_PICKER') {
    const subjects: { name: Subject; icon: string; color: string; desc: string }[] = [
      { name: 'Mathematics', icon: 'fa-calculator', color: 'from-blue-500 to-indigo-600', desc: 'Algebra, Geometry, and Calculus.' },
      { name: 'Physics', icon: 'fa-bolt', color: 'from-orange-400 to-red-500', desc: 'Mechanics, Optics, and Electricity.' },
      { name: 'Chemistry', icon: 'fa-flask-vial', color: 'from-emerald-400 to-teal-600', desc: 'Elements, Reactions, and Bonding.' }
    ];

    return (
      <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setCurrentView('DASHBOARD')}
          className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
        </button>
        <div className="mb-8">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-2 inline-block ${sessionMode === 'TEST' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            {sessionMode === 'TEST' ? 'Exam Center' : 'Practice Zone'}
          </span>
          <h2 className="text-3xl font-black text-gray-900">Choose a Subject</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <button
              key={subject.name}
              onClick={() => {
                setSelectedSubject(subject.name);
                setCurrentView('SET_PICKER');
              }}
              className="group relative h-64 overflow-hidden rounded-3xl shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-90`}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
                <i className={`fa-solid ${subject.icon} text-6xl mb-4 group-hover:scale-110 transition-transform text-white/90`}></i>
                <h3 className="text-2xl font-black mb-2">{subject.name}</h3>
                <p className="text-sm opacity-80 text-center font-medium">{subject.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-20"></div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Set Selection View (Shared for Practice & Test) ---
  if (currentView === 'SET_PICKER' && selectedSubject) {
    const sets = assessments.filter(a => a.type === sessionMode && a.subject === selectedSubject);

    return (
      <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setCurrentView('SUBJECT_PICKER')}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:translate-x-[-4px] transition-transform"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Subjects
          </button>
          <div className="flex items-center gap-3">
             <span className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border ${sessionMode === 'TEST' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
              {sessionMode} MODE
            </span>
            <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full font-black text-xs uppercase tracking-widest border border-gray-200">
              {selectedSubject}
            </span>
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-6">Available {sessionMode === 'TEST' ? 'Exam' : 'Practice'} Sets</h2>
        
        {sets.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center">
            <i className={`fa-solid ${sessionMode === 'TEST' ? 'fa-calendar-check' : 'fa-hourglass-start'} text-gray-300 text-5xl mb-4`}></i>
            <p className="text-gray-400 font-bold text-xl">No {sessionMode.toLowerCase()} sets currently available for {selectedSubject}.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later or try another subject!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sets.map((set, idx) => (
              <button
                key={set.id}
                onClick={() => setActiveAssessment(set)}
                className={`w-full bg-white p-6 rounded-2xl border-2 border-gray-100 flex items-center justify-between group transition-all shadow-sm hover:shadow-md ${sessionMode === 'TEST' ? 'hover:border-indigo-600' : 'hover:border-emerald-600'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${sessionMode === 'TEST' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {idx + 1}
                  </div>
                  <div className="text-left">
                    <h4 className={`font-bold text-gray-800 text-lg transition-colors ${sessionMode === 'TEST' ? 'group-hover:text-indigo-600' : 'group-hover:text-emerald-600'}`}>{set.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400 font-medium"><i className="fa-solid fa-list-check mr-1"></i> {set.questions.length} Questions</span>
                      {set.durationMinutes && (
                        <span className="text-xs text-gray-400 font-medium"><i className="fa-solid fa-clock mr-1"></i> {set.durationMinutes} Mins</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 font-black uppercase text-xs ${sessionMode === 'TEST' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                  {sessionMode === 'TEST' ? 'Attempt' : 'Start'} <i className="fa-solid fa-circle-play text-xl"></i>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Main Dashboard View ---
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Hello, {user.name}! 👋</h1>
          <p className="text-lg text-gray-600">Your roadmap to academic excellence starts here.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Practice Card */}
        <Card className="!p-0 overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-emerald-100 p-4 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <i className="fa-solid fa-graduation-cap text-3xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Practice Zone</h2>
                <p className="text-gray-500">Adaptive learning for core subjects.</p>
              </div>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Master complex concepts through categorized practice sets in Mathematics, Physics, and Chemistry. Immediate feedback included.
            </p>
            <button 
              onClick={() => startSession('PRACTICE')}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 transition-all"
            >
              Start Practice Session <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div className="bg-emerald-50 py-3 px-8 border-t border-emerald-100 flex justify-between text-xs font-bold text-emerald-700">
            <span>3 SUBJECTS AVAILABLE</span>
            <span>UNLIMITED ATTEMPTS</span>
          </div>
        </Card>

        {/* Test Card (Newly Styled to match Practice Zone) */}
        <Card className="!p-0 overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-indigo-100 p-4 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <i className="fa-solid fa-stopwatch text-3xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Test Center</h2>
                <p className="text-gray-500">Simulate real exam conditions.</p>
              </div>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Assess your preparation with timed unit tests and full-length mock exams. Get detailed proctored results and performance metrics.
            </p>
            <button 
              onClick={() => startSession('TEST')}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 transition-all"
            >
              Start Exam Session <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div className="bg-indigo-50 py-3 px-8 border-t border-indigo-100 flex justify-between text-xs font-bold text-indigo-700">
            <span>TIMED ASSESSMENT</span>
            <span>PROCTORED RESULTS</span>
          </div>
        </Card>
      </div>

      <Card title="Cloud Performance Analytics" icon="fa-chart-pie">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-12 text-indigo-300">
              <i className="fa-solid fa-circle-notch animate-spin text-4xl mb-4"></i>
              <span className="font-bold uppercase tracking-widest text-xs">Syncing with server...</span>
           </div>
        ) : submissions.length === 0 ? (
          <div className="py-12 text-center">
            <i className="fa-solid fa-file-circle-question text-gray-200 text-6xl mb-4"></i>
            <p className="text-gray-400 font-bold">No activity history yet. Start a session to see analytics.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest">Assessment Details</th>
                  <th className="py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Date</th>
                  <th className="py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Score</th>
                  <th className="py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Progress</th>
                  <th className="py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {submissions.slice().reverse().map((sub, idx) => {
                  const assessment = assessments.find(a => a.id === sub.assessmentId);
                  const percentage = (sub.score / sub.totalQuestions) * 100;
                  return (
                    <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{assessment?.title || 'Archive Set'}</span>
                          <span className={`w-fit mt-1 px-2 py-0.5 rounded text-[8px] font-black uppercase ${assessment?.type === 'TEST' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {assessment?.subject || 'General'} • {assessment?.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 text-center text-sm font-medium text-gray-500">
                        {new Date(sub.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-5 text-center">
                        <span className={`px-3 py-1 rounded-full font-black text-sm ${percentage >= 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          {sub.score} / {sub.totalQuestions}
                        </span>
                      </td>
                      <td className="py-5 text-center">
                         <div className="inline-flex items-center gap-3 justify-center">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                               <div className={`h-full transition-all duration-1000 ${percentage >= 70 ? 'bg-emerald-500' : 'bg-orange-400'}`} style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="font-black text-gray-900 text-xs w-8">{Math.round(percentage)}%</span>
                         </div>
                      </td>
                      <td className="py-5 text-right">
                        <button 
                          onClick={() => startReview(sub)}
                          className="px-4 py-2 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold text-xs uppercase hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                        >
                          <i className="fa-solid fa-eye mr-2"></i> Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
