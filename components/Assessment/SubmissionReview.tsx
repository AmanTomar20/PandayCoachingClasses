
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
      // Create fresh instance to ensure the API key from process.env is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const userSelected = question.options.find(o => o.id === submission.responses[question.id])?.text || "None";
      const correctText = question.options.find(o => o.id === question.correctOptionId)?.text;

      const prompt = `Reviewing student attempt for: "${question.text}"
      The correct answer is: "${correctText}".
      The student chose: "${userSelected}".
      Provide a concise, encouraging, and conceptually deep explanation (max 100 words) of why "${correctText}" is the correct answer.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          systemInstruction: "You are an expert tutor for Panday Classes. Your tone is professional, encouraging, and clear. Use italics for your final response.",
          maxOutputTokens: 2000,
          thinkingConfig: { thinkingBudget: 1000 } 
        }
      });
      
      setAiExplanations(prev => ({ ...prev, [question.id]: response.text || "No explanation available." }));
    } catch (err) {
      console.error("Gemini API Error:", err);
      setAiExplanations(prev => ({ ...prev, [question.id]: "I'm having trouble connecting to the cloud right now. Please try again in a moment!" }));
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
            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
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
            <div key={q.id} className={`bg-white rounded-3xl shadow-sm border ${isCorrect ? 'border-indigo-100' : 'border-red-100'} p-8 relative transition-all hover:shadow-md`}>
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-8 h-8 min-w-[32px] rounded-lg flex items-center justify-center font-black text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {idx + 1}
                </div>
                <div className="flex-grow pr-32">
                  <h4 className="text-xl font-bold text-gray-800 leading-tight mb-3">{q.text}</h4>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                </div>
                
                {/* Ask AI Tutor Button */}
                {!aiExplanation && !isAiLoading && (
                  <div className="absolute top-8 right-8">
                    <button 
                      onClick={() => handleAskGemini(q)}
                      className="flex flex-col items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white w-24 h-16 rounded-2xl border-4 border-indigo-100 transition-all active:scale-95 shadow-lg shadow-indigo-100 group"
                    >
                      <span className="text-[10px] font-black uppercase tracking-tighter leading-none group-hover:scale-105 transition-transform">ASK AI</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter leading-none group-hover:scale-105 transition-transform">TUTOR</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Question Image */}
              {q.imageUrl && (
                <div className="mb-8 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex justify-center">
                  <img 
                    src={q.imageUrl} 
                    alt="Question Diagram" 
                    className="max-h-64 object-contain rounded-lg"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Image+Load+Error";
                    }}
                  />
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {q.options.map((opt) => {
                  const isOptSelected = userSelectedId === opt.id;
                  const isOptCorrect = q.correctOptionId === opt.id;
                  
                  let containerStyle = "border-gray-100 bg-gray-50/50 text-gray-500";
                  let icon = null;

                  if (isOptCorrect) {
                    containerStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-4 ring-emerald-50";
                    icon = <i className="fa-solid fa-circle-check text-emerald-500 ml-auto"></i>;
                  } else if (isOptSelected && !isOptCorrect) {
                    containerStyle = "border-red-500 bg-red-50 text-red-800 font-bold ring-4 ring-red-50";
                    icon = <i className="fa-solid fa-circle-xmark text-red-500 ml-auto"></i>;
                  }

                  return (
                    <div key={opt.id} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${containerStyle}`}>
                      <span>{opt.text}</span>
                      {icon}
                    </div>
                  );
                })}
              </div>

              {/* AI Tutor Insights Section */}
              {(aiExplanation || isAiLoading) && (
                <div className="mt-6 p-8 bg-[#F5F3FF] rounded-3xl border border-[#E0E7FF] animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <p className="text-[11px] font-black text-violet-600 uppercase tracking-widest">AI Tutor Insights</p>
                  </div>
                  {isAiLoading ? (
                    <div className="flex items-center gap-3 text-violet-600 animate-pulse">
                      <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></div>
                      <span className="text-sm font-bold italic">Analyzing concept...</span>
                    </div>
                  ) : (
                    <p className="text-[15px] text-gray-800 italic leading-relaxed whitespace-pre-line">
                      "{aiExplanation}"
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 flex justify-center px-4">
        <button 
          onClick={onClose}
          className="w-full md:w-auto px-16 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all active:scale-95"
        >
          Return to Performance Center
        </button>
      </div>
    </div>
  );
};
