
import React, { useState, useEffect, useRef } from 'react';
import { Assessment, User, Submission, AssessmentType, Subject, Question } from '../../types';
import { Card } from '../UI/Card';
import { storageService } from '../../services/storageService';
import { GoogleGenAI, Type } from "@google/genai";

interface TeacherDashboardProps {
  user: User;
  assessments: Assessment[];
}

type DashboardTab = 'ANALYTICS' | 'AI_CREATOR' | 'MANAGE';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ assessments: propAssessments }) => {
  const [assessments, setAssessments] = useState<Assessment[]>(propAssessments);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('ANALYTICS');

  // AI Creator States
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<Partial<Assessment> | null>(null);
  const [targetType, setTargetType] = useState<AssessmentType>('PRACTICE');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mathematics');
  const [customInstructions, setCustomInstructions] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Management States
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allSubmissions, allStudents, allAssessments] = await Promise.all([
        storageService.getSubmissions(),
        storageService.getAllStudents(),
        storageService.getAssessments()
      ]);
      setSubmissions(allSubmissions);
      setStudents(allStudents);
      setAssessments(allAssessments);
    } catch (err) {
      console.error("Error loading teacher data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const generateAssessment = async () => {
    if (!pdfFile) return;
    setIsGenerating(true);
    try {
      const base64Data = await fileToBase64(pdfFile);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Task: Create an educational ${targetType.toLowerCase()} set for the subject "${selectedSubject}" from the provided PDF.
      
      TEACHER'S SPECIFIC INSTRUCTIONS: 
      "${customInstructions || 'Extract balanced, high-quality questions representing the core concepts of the document.'}"

      Requirements:
      1. Extract exactly 5 multiple-choice questions.
      2. Each question must have 4 options with IDs 'a', 'b', 'c', and 'd'.
      3. Focus on conceptual understanding as requested by the teacher's instructions.
      4. Explanations must be concise (max 2 sentences).
      5. Output ONLY raw JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'application/pdf'
            }
          },
          { text: prompt }
        ],
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
          thinkingConfig: { thinkingBudget: 4000 },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    imageUrl: { type: Type.STRING, description: "Optional image URL if referenced in question" },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING }
                        },
                        required: ["id", "text"]
                      }
                    },
                    correctOptionId: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["text", "options", "correctOptionId"]
                }
              }
            },
            required: ["title", "subject", "questions"]
          }
        }
      });

      let rawText = response.text || "";
      rawText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      if (!rawText) throw new Error("Empty response from AI");

      const result = JSON.parse(rawText);
      const assessmentData: Partial<Assessment> = {
        ...result,
        subject: selectedSubject,
        type: targetType,
        id: `ai_${Math.random().toString(36).substring(2, 11)}`,
      };

      if (targetType === 'TEST') {
        assessmentData.durationMinutes = 30;
      }
      setGeneratedPreview(assessmentData);
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      alert("Failed to generate questions. Ensure your PDF has clear text content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateAssessment = async () => {
    if (!editingAssessment) return;
    setIsSaving(true);
    try {
      await storageService.saveAssessment(editingAssessment);
      await loadData();
      alert("Cloud Database Updated Successfully!");
      setEditingAssessment(null);
    } catch (err: any) {
      alert(`Save Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const pushToCloud = async (data: any) => {
    try {
      await storageService.saveAssessment(data as Assessment);
      alert("Assessment successfully pushed to student cloud!");
      await loadData();
      setGeneratedPreview(null);
      setPdfFile(null);
      setActiveTab('MANAGE');
    } catch (err: any) {
      alert(`Cloud Save Error: ${err.message}`);
    }
  };

  const getStudentSubmissions = (studentId: string) => {
    return submissions.filter(s => s.studentId === studentId);
  };

  const getAverageScore = (studentId: string) => {
    const subs = getStudentSubmissions(studentId);
    if (subs.length === 0) return 0;
    const total = subs.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0);
    return (total / subs.length) * 100;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-bold">Synchronizing Faculty Data...</p>
      </div>
    );
  }

  // --- RENDERING LOGIC ---

  if (editingAssessment) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4">
        <header className="flex items-center justify-between mb-8">
           <div>
              <button 
                onClick={() => setEditingAssessment(null)}
                className="text-indigo-600 font-black text-xs uppercase mb-2 flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Management
              </button>
              <h1 className="text-3xl font-black text-gray-900">Editing: {editingAssessment.title}</h1>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setEditingAssessment(null)}
                className="px-6 py-3 border-2 border-gray-100 text-gray-400 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateAssessment}
                disabled={isSaving}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                {isSaving ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                Save to Firebase
              </button>
           </div>
        </header>

        <div className="space-y-8">
          <Card title="Assessment Metadata" icon="fa-gears">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Set Title</label>
                <input 
                  type="text" 
                  value={editingAssessment.title}
                  onChange={(e) => setEditingAssessment({...editingAssessment, title: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Subject</label>
                <select 
                  value={editingAssessment.subject}
                  onChange={(e) => setEditingAssessment({...editingAssessment, subject: e.target.value as Subject})}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none font-bold"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <i className="fa-solid fa-list-check text-indigo-600"></i>
              Questions ({editingAssessment.questions.length})
            </h3>
            
            {editingAssessment.questions.map((q, qIdx) => (
              <div key={q.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                    {qIdx + 1}
                  </span>
                  <button 
                    onClick={() => {
                      const newQs = editingAssessment.questions.filter((_, i) => i !== qIdx);
                      setEditingAssessment({...editingAssessment, questions: newQs});
                    }}
                    className="text-red-300 hover:text-red-500 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Question Text</label>
                    <textarea 
                      value={q.text}
                      onChange={(e) => {
                        const newQs = [...editingAssessment.questions];
                        newQs[qIdx].text = e.target.value;
                        setEditingAssessment({...editingAssessment, questions: newQs});
                      }}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none font-medium h-24 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Image URL (Optional)</label>
                      <input 
                        type="text"
                        value={q.imageUrl || ''}
                        placeholder="https://example.com/diagram.png"
                        onChange={(e) => {
                          const newQs = [...editingAssessment.questions];
                          newQs[qIdx].imageUrl = e.target.value;
                          setEditingAssessment({...editingAssessment, questions: newQs});
                        }}
                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none text-xs font-mono mb-2"
                      />
                      <p className="text-[9px] text-gray-400 font-bold uppercase italic">Enter a direct link to a PNG, JPG or SVG file.</p>
                    </div>
                    {q.imageUrl && (
                      <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase mb-2">Live Preview</span>
                        <img 
                          src={q.imageUrl} 
                          alt="Preview" 
                          className="max-h-32 object-contain rounded shadow-sm bg-white p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-4">Options & Correct Answer</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => (
                        <div key={opt.id} className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const newQs = [...editingAssessment.questions];
                              newQs[qIdx].correctOptionId = opt.id;
                              setEditingAssessment({...editingAssessment, questions: newQs});
                            }}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${q.correctOptionId === opt.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 text-gray-300 hover:border-emerald-200'}`}
                          >
                            <i className="fa-solid fa-check text-xs"></i>
                          </button>
                          <div className="flex-grow flex items-center bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 focus-within:border-indigo-100">
                             <span className="px-3 text-[10px] font-black uppercase text-gray-300">{opt.id}</span>
                             <input 
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const newQs = [...editingAssessment.questions];
                                const newOpts = [...newQs[qIdx].options];
                                newOpts[oIdx].text = e.target.value;
                                newQs[qIdx].options = newOpts;
                                setEditingAssessment({...editingAssessment, questions: newQs});
                              }}
                              className="w-full py-3 pr-3 bg-transparent outline-none text-sm font-medium"
                             />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Explanation (Hint)</label>
                    <input 
                      type="text"
                      value={q.explanation || ''}
                      onChange={(e) => {
                        const newQs = [...editingAssessment.questions];
                        newQs[qIdx].explanation = e.target.value;
                        setEditingAssessment({...editingAssessment, questions: newQs});
                      }}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none text-xs italic"
                      placeholder="Add a conceptual hint for students..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={() => {
                const newQ: Question = {
                  id: `q_${Date.now()}`,
                  text: 'New Question Text',
                  options: [
                    { id: 'a', text: 'Option A' },
                    { id: 'b', text: 'Option B' },
                    { id: 'c', text: 'Option C' },
                    { id: 'd', text: 'Option D' }
                  ],
                  correctOptionId: 'a'
                };
                setEditingAssessment({...editingAssessment, questions: [...editingAssessment.questions, newQ]});
              }}
              className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-plus-circle"></i> Add New Question
            </button>
          </div>
        </div>

        <div className="mt-12 flex justify-end gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-indigo-50 sticky bottom-4 shadow-2xl z-20">
            <button 
                onClick={() => setEditingAssessment(null)}
                className="px-10 py-4 font-bold text-gray-500 hover:text-gray-700"
            >
                Discard Changes
            </button>
            <button 
                onClick={handleUpdateAssessment}
                disabled={isSaving}
                className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
            >
                {isSaving ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-check-double"></i>}
                Finish & Sync with Cloud
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1">Faculty Portal</h1>
          <p className="text-lg text-gray-600">Managing Panday Classes Excellence.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'ANALYTICS' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-indigo-600'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('MANAGE')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'MANAGE' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-indigo-600'}`}
          >
            Manage Sets
          </button>
          <button 
            onClick={() => setActiveTab('AI_CREATOR')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'AI_CREATOR' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-indigo-600'}`}
          >
            AI Assessment Creator
          </button>
        </div>
      </header>

      {activeTab === 'ANALYTICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student List */}
          <div className="lg:col-span-1">
            <Card title="Students Directory" icon="fa-user-graduate">
              <div className="space-y-2">
                {students.map(student => {
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

          {/* Student Detail */}
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
                          <th className="py-3 font-semibold text-gray-600 uppercase text-xs">Score</th>
                          <th className="py-3 font-semibold text-gray-600 uppercase text-xs">Accuracy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {getStudentSubmissions(selectedStudent.id).slice().reverse().map((sub, sidx) => {
                          const accuracy = (sub.score / sub.totalQuestions) * 100;
                          return (
                            <tr key={sidx}>
                              <td className="py-4 text-sm text-gray-500">
                                {new Date(sub.completedAt).toLocaleDateString()}
                              </td>
                              <td className="py-4">
                                <span className="font-semibold text-gray-800">{sub.assessmentId}</span>
                              </td>
                              <td className="py-4">
                                <span className="font-bold text-gray-700">{sub.score} / {sub.totalQuestions}</span>
                              </td>
                              <td className="py-4">
                                <span className={`text-xs font-black ${accuracy >= 80 ? 'text-emerald-600' : 'text-orange-500'}`}>
                                  {Math.round(accuracy)}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center">
                <i className="fa-solid fa-users-viewfinder text-gray-300 text-6xl mb-4"></i>
                <h3 className="text-xl font-bold text-gray-400">Select a student to analyze cloud records.</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'MANAGE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {assessments.map(assessment => (
            <Card key={assessment.id} className="group relative border-2 border-transparent hover:border-indigo-100 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${assessment.type === 'TEST' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {assessment.type}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingAssessment(assessment)}
                      className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center shadow-sm"
                    >
                      <i className="fa-solid fa-pen-to-square text-sm"></i>
                    </button>
                  </div>
               </div>
               <h4 className="text-lg font-black text-gray-800 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{assessment.title}</h4>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{assessment.subject}</p>
               
               <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase">Questions</span>
                    <span className="text-sm font-bold text-gray-700">{assessment.questions.length} Items</span>
                  </div>
                  <div className="w-px h-6 bg-gray-100"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase">Duration</span>
                    <span className="text-sm font-bold text-gray-700">{assessment.durationMinutes || 'Untimed'}</span>
                  </div>
               </div>
            </Card>
          ))}
          
          <button 
            onClick={() => setEditingAssessment({
              id: `man_${Math.random().toString(36).substring(2, 9)}`,
              title: 'New Question Set',
              type: 'PRACTICE',
              subject: 'Mathematics',
              questions: []
            })}
            className="border-4 border-dashed border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 text-gray-300 hover:border-indigo-100 hover:text-indigo-400 hover:bg-indigo-50/20 transition-all group"
          >
            <i className="fa-solid fa-circle-plus text-4xl group-hover:scale-110 transition-transform"></i>
            <span className="font-black uppercase tracking-widest text-xs">Create Manual Set</span>
          </button>
        </div>
      )}

      {activeTab === 'AI_CREATOR' && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <Card title="PDF to Assessment AI" icon="fa-wand-magic-sparkles">
            {!generatedPreview ? (
              <div className="py-4 space-y-8">
                {/* Mode Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Set Type</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setTargetType('PRACTICE')}
                        className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] border-2 transition-all ${targetType === 'PRACTICE' ? 'bg-emerald-50 border-emerald-600 text-emerald-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'}`}
                      >
                        Practice
                      </button>
                      <button 
                        onClick={() => setTargetType('TEST')}
                        className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] border-2 transition-all ${targetType === 'TEST' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200'}`}
                      >
                        Timed Test
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Target Subject</label>
                    <div className="flex gap-2">
                      {(['Mathematics', 'Physics', 'Chemistry'] as Subject[]).map(sub => (
                        <button
                          key={sub}
                          onClick={() => setSelectedSubject(sub)}
                          className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] border-2 transition-all ${selectedSubject === sub ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200'}`}
                        >
                          {sub.substring(0, 5)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Instructions */}
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Specific Instructions (Optional)</label>
                   <textarea 
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="e.g. Focus on Organic Chemistry, make questions difficult, or focus on numerical problems..."
                    className="w-full h-24 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm font-medium resize-none"
                   />
                </div>

                {/* Upload Zone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${pdfFile ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50'}`}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept=".pdf" 
                    onChange={handleFileUpload}
                  />
                  <i className={`fa-solid ${pdfFile ? 'fa-file-circle-check text-emerald-500' : 'fa-cloud-arrow-up text-gray-300'} text-5xl mb-4`}></i>
                  {pdfFile ? (
                    <div>
                      <p className="text-lg font-bold text-emerald-700 mb-1">{pdfFile.name}</p>
                      <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Document Selected</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-bold text-gray-700 mb-1">Click to upload Study Material (PDF)</p>
                      <p className="text-gray-400 text-xs">AI will extract questions based on your instructions.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    disabled={!pdfFile || isGenerating}
                    onClick={generateAssessment}
                    className="px-16 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-3 active:scale-95"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                        AI is Processing...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-bolt"></i>
                        Generate {targetType} Set
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div>
                    <h4 className="font-black text-indigo-900">{generatedPreview.title}</h4>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{generatedPreview.subject} • {generatedPreview.questions?.length} Questions • {targetType}</p>
                  </div>
                  <button 
                    onClick={() => setGeneratedPreview(null)}
                    className="bg-white px-4 py-2 rounded-xl text-red-500 font-black text-[10px] uppercase shadow-sm hover:bg-red-50 transition-colors"
                  >
                    Discard
                  </button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {generatedPreview.questions?.map((q, qidx) => (
                    <div key={qidx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="font-bold text-gray-800 mb-4">{q.text}</p>
                      
                      {q.imageUrl && (
                        <div className="mb-6 p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex justify-center">
                          <img 
                            src={q.imageUrl} 
                            alt="AI Suggested Diagram" 
                            className="max-h-32 object-contain rounded"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        {q.options?.map((opt: any) => (
                          <div key={opt.id} className={`p-3 rounded-lg text-xs font-medium border ${opt.id === q.correctOptionId ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-white border-gray-100 text-gray-500'}`}>
                            <span className="opacity-50 mr-2 uppercase">{opt.id}.</span> {opt.text}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                         <div className="mt-4 p-4 bg-white border border-indigo-50 rounded-xl text-[11px] text-indigo-400 italic">
                            <span className="font-black uppercase not-italic mr-2 text-indigo-600">Hint:</span> {q.explanation}
                         </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setGeneratedPreview(null)}
                    className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-400 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => pushToCloud(generatedPreview)}
                    className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    Push to Student Cloud
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
