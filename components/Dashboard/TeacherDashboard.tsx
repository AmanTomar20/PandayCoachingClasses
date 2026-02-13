
import React, { useState } from 'react';
import { Assessment, User } from '../../types';
import { Card } from '../UI/Card';
import { MOCK_STUDENTS } from '../../constants';
import { storageService } from '../../services/storageService';

interface TeacherDashboardProps {
  user: User;
  assessments: Assessment[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ assessments }) => {
  const submissions = storageService.getSubmissions();
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const getStudentSubmissions = (studentId: string) => {
    return submissions.filter(s => s.studentId === studentId);
  };

  const getAverageScore = (studentId: string) => {
    const subs = getStudentSubmissions(studentId);
    if (subs.length === 0) return 0;
    const total = subs.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0);
    return (total / subs.length) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1">Teacher Dashboard</h1>
          <p className="text-lg text-gray-600">Monitoring Panday Classes excellence.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <i className="fa-solid fa-users text-indigo-600"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Students</p>
              <p className="text-xl font-bold">{MOCK_STUDENTS.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <i className="fa-solid fa-file-invoice text-green-600"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Submissions</p>
              <p className="text-xl font-bold">{submissions.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student List */}
        <div className="lg:col-span-1">
          <Card title="Students List" icon="fa-user-graduate">
            <div className="space-y-2">
              {MOCK_STUDENTS.map(student => {
                const avg = getAverageScore(student.id);
                const isActive = selectedStudent?.id === student.id;
                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full text-left p-4 rounded-xl transition-all border flex items-center gap-3 ${
                      isActive 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                        : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-700'}`}>
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold">{student.name}</p>
                      <p className={`text-xs ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {getStudentSubmissions(student.id).length} assessments completed
                      </p>
                    </div>
                    {avg > 0 && (
                      <div className={`text-xs font-black rounded px-2 py-1 ${isActive ? 'bg-indigo-500' : 'bg-white border'}`}>
                        {Math.round(avg)}%
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Student Detail / Stats */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="space-y-6">
              <Card title={`${selectedStudent.name}'s Progress`} icon="fa-chart-column">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-3 font-semibold text-gray-600 uppercase text-xs">Date</th>
                        <th className="py-3 font-semibold text-gray-600 uppercase text-xs">Assessment</th>
                        <th className="py-3 font-semibold text-gray-600 uppercase text-xs">Type</th>
                        <th className="py-3 font-semibold text-gray-600 uppercase text-xs">Score</th>
                        <th className="py-3 font-semibold text-gray-600 uppercase text-xs">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {getStudentSubmissions(selectedStudent.id).slice().reverse().map(sub => {
                        const assessment = assessments.find(a => a.id === sub.assessmentId);
                        const accuracy = (sub.score / sub.totalQuestions) * 100;
                        return (
                          <tr key={sub.id}>
                            <td className="py-4 text-sm text-gray-500">
                              {new Date(sub.completedAt).toLocaleDateString()}
                            </td>
                            <td className="py-4">
                              <span className="font-semibold text-gray-800">{assessment?.title}</span>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                                assessment?.type === 'TEST' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {assessment?.type}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className="font-bold text-gray-700">{sub.score} / {sub.totalQuestions}</span>
                            </td>
                            <td className="py-4">
                              <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[80px]">
                                <div 
                                  className={`h-full rounded-full ${accuracy >= 80 ? 'bg-green-500' : accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${accuracy}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {getStudentSubmissions(selectedStudent.id).length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-gray-400 italic">
                            No data available for this student yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Performance Summary Card */}
              {getStudentSubmissions(selectedStudent.id).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <Card className="bg-indigo-50 border-indigo-100">
                      <p className="text-indigo-600 text-xs font-bold uppercase mb-1">Global Average</p>
                      <p className="text-3xl font-black text-indigo-900">{Math.round(getAverageScore(selectedStudent.id))}%</p>
                   </Card>
                   <Card className="bg-green-50 border-green-100">
                      <p className="text-green-600 text-xs font-bold uppercase mb-1">Total Attempted</p>
                      <p className="text-3xl font-black text-green-900">{getStudentSubmissions(selectedStudent.id).length}</p>
                   </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
              <i className="fa-solid fa-arrow-left text-gray-300 text-5xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-400">Select a student from the list to view detailed progress.</h3>
              <p className="text-gray-400 max-w-sm mt-2">You can track scores, accuracy, and history for each individual student.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
