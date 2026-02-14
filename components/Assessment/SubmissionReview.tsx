import React, { useState } from 'react';
import { Assessment, Submission, Question } from '../../types';
import { Card } from '../UI/Card';
import { GoogleGenAI } from "@google/genai";

interface SubmissionReviewProps {
  submission: Submission;
  assessment: Assessment;
  onClose: () => void;
}

export const SubmissionReview: React.FC<SubmissionReviewProps> = ({ submission, assessment, onClose }) => {
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [aiLoadingIds, setAiLoadingIds] = useState<Record<string, boolean>>({});

  const handleAskGemini = async (question: Question) => {
    setAiLoadingIds(prev => ({ ...prev, [question.id]: true }));
    try {
      // Fix: Create a new GoogleGenAI instance right before the call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const userSelected = question.options.find(o => o.id === submission.responses[question.id])?.text || "None";
      const correctText = question.options.find(o => o.id === question.correctOptionId)?.text;

      const prompt = `Reviewing attempt for: "${question.text}"
      Correct answer: "${correctText}".
      Student choice: "${userSelected}".
      Explain why "${correctText}" is conceptually correct.`;

      // Fix: Use systemInstruction and combined maxOutputTokens with thinkingBudget for consistency
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          systemInstruction: "You are an expert tutor for Panday Classes. Provide clear, logical, and encouraging explanations (max 100 words).",
          maxOutputTokens: 2000,
          thinkingConfig: { thinkingBudget: 1000 } 
        }
      });
      
      // Fix: Access response.text directly (property access)
      setAiExplanations(prev => ({ ...prev, [question.id]: response.text || "No explanation available." }));
    } catch (err) {
      console.error("Gemini AI Error:", err);
      setAiExplanations(prev => ({ ...prev, [question.id]: "Unable to connect to AI tutor. Please try again." }));
    } finally {
      setAiLoadingIds(prev => ({ ...prev, [question.id]: false }));
    }
  };

  const percentage = (submission.score / submission.totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-4">
        <div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-indigo-600 font-bold mb-4 hover:translate-x-[-4px] transition-transform"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Performance Analytics
          </button>
          <h2 className="text-3xl font-black text-gray-900">Review: {assessment.title}</h2>
          <p className="text-gray-500 font-medium">Completed on {new Date(submission.completedAt).toLocaleDateString()}</p>
        </div>
        <Card className="!bg-indigo-600 text-white !p-4 flex items-center gap-6 shadow-lg shadow-indigo-100">
           <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Final Score</p>
              <p className="text-3xl font-black">{submission.score} / {submission.totalQuestions}</p>
           </div>
           <div className="w-px h-10 bg-white/20"></div>
           <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Accuracy</p>
              <p className="text-3xl font-black">{Math.round(percentage)}%</p>
           </div>
        </Card>
      </div>

      <div className="space-y-6 px-4">
        {assessment.questions.map((q, idx) => {
          const userSelectedId = submission.responses[q.id];
          const isCorrect = userSelectedId === q.correctOptionId;
          const aiExplanation = aiExplanations[q.id];
          const isAiLoading = aiLoadingIds[q.id];

          return (
            <div key={q.id} className={`bg-white rounded-xl shadow-sm border ${isCorrect ? 'border-indigo-200' : 'border-red-200'} p-6 relative`}>
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-8 h-8 min-w-[32px] rounded-lg flex items-center justify-center font-black text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {idx + 1}
                </div>
                <div className="flex-grow pr-32">
                  <h4 className="text-lg font-bold text-gray-800 leading-tight mb-2">{q.text}</h4>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                </div>
                
                {/* Ask AI Tutor Button - Floating right style */}
                <div className="absolute top-6 right-6">
                   {!aiExplanation && !isAiLoading && (
                    <button 
                      onClick={() => handleAskGemini(q)}
                      className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white w-20 h-12 rounded-xl text-[9px] font-black uppercase hover:shadow-lg transition-all active:scale-95"
                    >
                      <span>ASK AI</span>
                      <span>TUTOR</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Image */}
              {q.imageUrl && (
                <div className="mb-6 p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex justify-center">
                  <img 
                    src={q.imageUrl} 
                    alt="Question Diagram" 
                    className="max-h-60 object-contain rounded"
                    onError={(e) => {
                        console.error("Image failed to load:", q.imageUrl);
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Diagram+Not+Available";
                    }}
                  />
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {q.options.map((opt) => {
                  const isOptSelected = userSelectedId === opt.id;
                  const isOptCorrect = q.correctOptionId === opt.id;
                  
                  let style = "border-gray-100 bg-gray-50 text-gray-500";
                  let icon = null;

                  if (isOptCorrect) {
                    style = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold";
                    icon = <i className="fa-solid fa-circle-check text-emerald-500 ml-auto"></i>;
                  } else if (isOptSelected && !isOptCorrect) {
                    style = "border-red-500 bg-red-50 text-red-800 font-bold";
                    icon = <i className="fa-solid fa-circle-xmark text-red-500 ml-auto"></i>;
                  }

                  return (
                    <div key={opt.id} className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${style}`}>
                      <span className="text-sm">{opt.text}</span>
                      {icon}
                    </div>
                  );
                })}
              </div>

              {/* Explanations Section */}
              {(q.explanation || aiExplanation || isAiLoading) && (
                <div className="mt-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                  {q.explanation && !aiExplanation && !isAiLoading && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Standard Explanation</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                  
                  {isAiLoading ? (
                    <div className="flex items-center gap-3 text-violet-600 animate-pulse py-2">
                      <i className="fa-solid fa-circle-notch animate-spin"></i>
                      <span className="text-sm font-black uppercase tracking-wider">Gemini AI Tutor is thinking...</span>
                    </div>
                  ) : aiExplanation ? (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-sparkles text-violet-500"></i>
                        <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">AI Tutor Insights</p>
                      </div>
                      <p className="text-sm text-gray-800 italic leading-relaxed">"{aiExplanation}"</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center px-4">
        <button 
          onClick={onClose}
          className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};