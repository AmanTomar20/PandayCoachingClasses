
import React, { useState, useEffect } from 'react';
import { Assessment, Submission } from '../../types';
import { Card } from '../UI/Card';

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
  const [startTime] = useState(Date.now());

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;

  const handleSelectOption = (optionId: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
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

  if (isFinished) {
    const score = calculateScore();
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{assessment.title}</h2>
          <p className="text-gray-500">Question {currentQuestionIndex + 1} of {assessment.questions.length}</p>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-red-500">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <p className="text-xl text-gray-800 font-medium mb-8">
            {currentQuestion.text}
          </p>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  responses[currentQuestion.id] === option.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-100 hover:border-indigo-200 bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  responses[currentQuestion.id] === option.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                }`}>
                  {responses[currentQuestion.id] === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className={`text-lg ${responses[currentQuestion.id] === option.id ? 'text-indigo-800 font-semibold' : 'text-gray-700'}`}>
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="px-6 py-2 font-semibold text-gray-600 hover:text-indigo-600 disabled:opacity-30"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Previous
          </button>
          
          {isLastQuestion ? (
            <button
              disabled={!responses[currentQuestion.id]}
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-200 transition-transform active:scale-95 disabled:opacity-50"
            >
              Finish & Submit
            </button>
          ) : (
            <button
              disabled={!responses[currentQuestion.id]}
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-transform active:scale-95 disabled:opacity-50"
            >
              Next <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
