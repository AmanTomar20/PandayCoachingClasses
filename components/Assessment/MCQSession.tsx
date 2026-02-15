
import React, { useState } from 'react';
import { Assessment, Submission, Question } from '../../types';
import { Card } from '../UI/Card';
import { GoogleGenAI } from "@google/genai";

interface MCQSessionProps {
  assessment: Assessment;
  studentId: string;
  onComplete: (submission: Submission) => void;
  onCancel: () => void;
}

export const MCQSession: React.FC<MCQSessionProps> = ({ assessment, studentId, onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Derived data
  const isPractice = assessment.type === 'PRACTICE';
  const currentQuestion = assessment.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;
  const hasSelected = !!responses[currentQuestion.id];
  const isRevealed = !!revealedAnswers[currentQuestion.id];

  const incorrectQuestions = assessment.questions.filter(q => responses[q.id] !== q.correctOptionId);
  const currentReviewQuestion = incorrectQuestions[reviewIndex];

  // AI Tutor Integration using Gemini 3 Pro for complex reasoning
  const handleAskGemini = async (question: Question) => {
    setIsAiLoading(true);
    setAiExplanation(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const userChoice = question.options.find(o => o.id === responses[question.id])?.text || "None";
      const correctChoice = question.options.find(o => o.id === question.correctOptionId)?.text;
      
      const prompt = `The student got this question wrong: "${question.text}"
      The correct answer is: "${correctChoice}".
      The student chose: "${userChoice}".
      Provide a deep, reassuring, and logical explanation of why the correct answer is right and why the student's choice was incorrect.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are an expert tutor for Panday Classes. Provide deep, reassuring, and logical explanations (max 100 words).",
          maxOutputTokens: 2000,
          thinkingConfig: { thinkingBudget: 1000 }
        }
      });
      
      setAiExplanation(response.text ?? "I'm sorry, I couldn't generate an explanation at this moment.");
    } catch (err) {
      console.error("Gemini AI Error:", err);
      setAiExplanation("I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later!");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (isRevealed) return; // Prevent changing after showing answer in practice
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleShowAnswer = () => {
    setRevealedAnswers(prev => ({ ...prev, [currentQuestion.id]: true }));
  };

  const calculateScore = () => {
    let score = 0;
    assessment.questions.forEach(q => {
      if (responses[q.id] === q.correctOptionId) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    const submission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      studentId,
      assessmentId: assessment.id,
      score: finalScore,
      totalQuestions: assessment.questions.length,
      completedAt: new Date().toISOString(),
      responses
    };
    onComplete(submission);
    setIsFinished(true);
  };

  const getOptionStyles = (q: Question, optionId: string) => {
    const isSelected = responses[q.id] === optionId;
    const isCorrect = q.correctOptionId === optionId;
    const revealed = revealedAnswers[q.id] || isReviewing;

    if (!revealed) {
      return isSelected 
        ? 'border-indigo-600 bg-indigo-50 text-indigo-800' 
        : 'border-gray-100 hover:border-indigo-200 bg-gray-50 text-gray-700';
    }

    if (isCorrect) {
      return 'border-green-500 bg-green-50 text-green-800 font-bold';
    }

    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-50 text-red-800 font-bold';
    }

    return 'border-gray-100 bg-gray-50 opacity-50 text-gray-400';
  };

  // --- REVIEW MODE UI ---
  if (isReviewing && currentReviewQuestion) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded mb-2 inline-block">Reviewing Mistakes</span>
            <h2 className="text-2xl font-bold text-gray-800">{assessment.title}</h2>
            <p className="text-gray-500">Mistake {reviewIndex + 1} of {incorrectQuestions.length}</p>
          </div>
          <button onClick={() => { setIsReviewing(false); setAiExplanation(null); }} className="text-gray-400 hover:text-indigo-600 font-bold flex items-center gap-2">
            Back <i className="fa-solid fa-arrow-turn-up"></i>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
           <div className="p-8">
            <p className="text-xl text-gray-800 font-medium mb-6">{currentReviewQuestion.text}</p>
            
            {currentReviewQuestion.imageUrl && (
              <div className="mb-8 p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex justify-center">
                <img 
                  src={currentReviewQuestion.imageUrl} 
                  alt="Question Diagram" 
                  className="max-h-64 object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="space-y-4">
              {currentReviewQuestion.options.map((option) => (
                <div key={option.id} className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 ${getOptionStyles(currentReviewQuestion, option.id)}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    responses[currentReviewQuestion.id] === option.id ? 'border-red-500 bg-red-500' : 
                    currentReviewQuestion.correctOptionId === option.id ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}>
                    {(responses[currentReviewQuestion.id] === option.id || currentReviewQuestion.correctOptionId === option.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 grid grid-cols-1 gap-4">
              {currentReviewQuestion.explanation && (
                <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                  <p className="text-sm font-bold text-indigo-700 uppercase mb-1">Standard Hint</p>
                  <p className="text-indigo-900">{currentReviewQuestion.explanation}</p>
                </div>
              )}

              <div className="p-4 bg-violet-50 border-l-4 border-violet-400 rounded">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold text-violet-700 uppercase">Gemini AI Tutor</p>
                  {!aiExplanation && !isAiLoading && (
                    <button 
                      onClick={() => handleAskGemini(currentReviewQuestion)}
                      className="text-[10px] bg-violet-600 text-white px-3 py-1 rounded-full hover:bg-violet-700 transition-colors"
                    >
                      Ask AI for help
                    </button>
                  )}
                </div>
                {isAiLoading ? (
                  <div className="flex items-center gap-2 text-violet-600 animate-pulse">
                    <i className="fa-solid fa-sparkles"></i>
                    <span className="text-sm font-bold">Gemini is thinking...</span>
                  </div>
                ) : aiExplanation ? (
                  <p className="text-violet-900 text-sm italic leading-relaxed">"{aiExplanation}"</p>
                ) : (
                  <p className="text-violet-400 text-sm">Need a deeper explanation? Ask our AI tutor.</p>
                )}
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
            <button
              disabled={reviewIndex === 0}
              onClick={() => { setReviewIndex(prev => prev - 1); setAiExplanation(null); }}
              className="px-6 py-2 font-semibold text-gray-600 hover:text-indigo-600 disabled:opacity-30"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Previous
            </button>
            <button
              onClick={() => {
                if (reviewIndex === incorrectQuestions.length - 1) {
                  setIsReviewing(false);
                } else {
                  setReviewIndex(prev => prev + 1);
                  setAiExplanation(null);
                }
              }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200"
            >
              {reviewIndex === incorrectQuestions.length - 1 ? 'Done Reviewing' : 'Next Mistake'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- FINISHED UI ---
  if (isFinished) {
    const score = calculateScore();
    const hasMistakes = incorrectQuestions.length > 0;
    return (
      <Card className="max-w-2xl mx-auto text-center" title="Assessment Completed">
        <div className="py-10">
          <div className="text-6xl mb-4">
            {score / assessment.questions.length >= 0.7 ? '🎉' : '📚'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Well Done!</h2>
          <p className="text-gray-600 mb-6">You've completed the {assessment.title}</p>
          <div className="bg-indigo-50 rounded-lg p-6 mb-8 inline-block">
            <span className="block text-sm text-indigo-600 font-semibold uppercase tracking-wider">Your Score</span>
            <span className="text-5xl font-black text-indigo-800">{score} / {assessment.questions.length}</span>
          </div>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            {hasMistakes && (
              <button 
                onClick={() => setIsReviewing(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-magnifying-glass"></i> Review Mistakes
              </button>
            )}
            <button 
              onClick={onCancel}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </Card>
    );
  }

  // --- ACTIVE SESSION UI ---
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{assessment.title}</h2>
          <p className="text-gray-500">Question {currentQuestionIndex + 1} of {assessment.questions.length}</p>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition-colors">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="w-full h-2 bg-gray-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <p className="text-xl text-gray-800 font-medium mb-6">{currentQuestion.text}</p>
          
          {currentQuestion.imageUrl && (
            <div className="mb-8 p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex justify-center">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question Diagram" 
                className="max-h-64 object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                disabled={isRevealed}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${getOptionStyles(currentQuestion, option.id)}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  responses[currentQuestion.id] === option.id ? (isRevealed && currentQuestion.correctOptionId !== option.id ? 'border-red-500 bg-red-500' : 'border-indigo-600 bg-indigo-600') : 
                  (isRevealed && currentQuestion.correctOptionId === option.id ? 'border-green-500 bg-green-500' : 'border-gray-300')
                }`}>
                  {(responses[currentQuestion.id] === option.id || (isRevealed && currentQuestion.correctOptionId === option.id)) && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-lg">{option.text}</span>
              </button>
            ))}
          </div>

          {isRevealed && currentQuestion.explanation && (
            <div className="mt-8 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm font-bold text-indigo-700 uppercase mb-1">Explanation</p>
              <p className="text-indigo-900">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => {
              setCurrentQuestionIndex(prev => prev - 1);
            }}
            className="px-4 py-2 font-semibold text-gray-600 hover:text-indigo-600 disabled:opacity-30 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Previous
          </button>
          
          <div className="flex items-center gap-4">
            {isPractice && !isRevealed && (
              <button
                disabled={!hasSelected}
                onClick={handleShowAnswer}
                className="px-4 py-2 text-indigo-600 font-bold hover:bg-indigo-100 rounded-lg disabled:opacity-30 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-eye"></i> Show Answer
              </button>
            )}

            {isLastQuestion ? (
              <button
                disabled={!hasSelected}
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-200 transition-transform active:scale-95 disabled:opacity-50"
              >
                Finish & Submit
              </button>
            ) : (
              <button
                disabled={!hasSelected}
                onClick={() => {
                  setCurrentQuestionIndex(prev => prev + 1);
                }}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-transform active:scale-95 disabled:opacity-50"
              >
                Next <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
