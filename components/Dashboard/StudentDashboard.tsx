
import React, { useState } from 'react';
import { Assessment, User, Submission } from '../../types';
import { Card } from '../UI/Card';
import { MCQSession } from '../Assessment/MCQSession';
import { storageService } from '../../services/storageService';

interface StudentDashboardProps {
  user: User;
  assessments: Assessment[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, assessments }) => {
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const submissions = storageService.getSubmissions().filter(s => s.studentId === user.id);

  const handleComplete = (submission: Submission) => {
    storageService.saveSubmission(submission);
    // Let the MCQSession stay on completion screen
  };

  const handleCancel = () => {
    setActiveAssessment(null);
  };

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

  const practiceSets = assessments.filter(a => a.type === 'PRACTICE');
  const testSets = assessments.filter(a => a.type === 'TEST');

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
        <p className="text-lg text-gray-600">Choose your activity for today and continue learning.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Practice Card */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-4 rounded-2xl">
                <i className="fa-solid fa-pen-nib text-green-600 text-3xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Practice Zone</h2>
                <p className="text-gray-500">Sharpen your skills with no pressure.</p>
              </div>
            </div>
            <div className="space-y-3 mb-6 flex-grow">
              {practiceSets.map(set => (
                <div key={set.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{set.title}</span>
                  <button 
                    onClick={() => setActiveAssessment(set)}
                    className="text-green-600 font-bold hover:underline"
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Test Card */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 p-4 rounded-2xl">
                <i className="fa-solid fa-stopwatch text-indigo-600 text-3xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Exam Center</h2>
                <p className="text-gray-500">Timed tests to evaluate your progress.</p>
              </div>
            </div>
            <div className="space-y-3 mb-6 flex-grow">
              {testSets.map(set => (
                <div key={set.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{set.title}</span>
                  <button 
                    onClick={() => setActiveAssessment(set)}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Take Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Performance" icon="fa-chart-line">
        {submissions.length === 0 ? (
          <p className="text-gray-400 italic">No assessments attempted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 font-semibold text-gray-600">Assessment</th>
                  <th className="py-3 font-semibold text-gray-600">Date</th>
                  <th className="py-3 font-semibold text-gray-600">Score</th>
                  <th className="py-3 font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {submissions.slice().reverse().map(sub => {
                  const assessment = assessments.find(a => a.id === sub.assessmentId);
                  return (
                    <tr key={sub.id} className="group">
                      <td className="py-4">
                        <span className="font-medium text-gray-800">{assessment?.title || 'Unknown'}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${assessment?.type === 'TEST' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                          {assessment?.type}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500">{new Date(sub.completedAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`font-bold ${sub.score / sub.totalQuestions >= 0.7 ? 'text-green-600' : 'text-orange-500'}`}>
                          {sub.score} / {sub.totalQuestions}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-gray-400 group-hover:text-indigo-600">
                          <i className="fa-solid fa-chevron-right"></i>
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
