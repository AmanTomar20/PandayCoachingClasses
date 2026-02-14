
import React, { useState } from 'react';
import { Role, User } from '../../types';
import { Card } from '../UI/Card';
import { storageService } from '../../services/storageService';

type AuthStep = 'ROLE_SELECTION' | 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

interface AuthFlowProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<AuthStep>('ROLE_SELECTION');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setEmail('');
    setName('');
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep('LOGIN');
    resetForm();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await storageService.findUserByCredentials(username, selectedRole || 'STUDENT');
      
      if (user && user.password === password) {
        onLoginSuccess(user);
      } else {
        setError(`Invalid ${selectedRole?.toLowerCase()} credentials.`);
      }
    } catch (err) {
      setError("Database connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !username || !password) {
        setError('All fields are required.');
        return;
      }

      // Quick check if student already exists in Firestore
      const existingUser = await storageService.findUserByCredentials(username, 'STUDENT');
      if (existingUser) {
        setError('Username or email already exists.');
        return;
      }

      const newStudent: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        username,
        password,
        role: 'STUDENT'
      };

      await storageService.registerStudent(newStudent);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => {
        setStep('LOGIN');
        resetForm();
      }, 1500);
    } catch (err) {
      setError("Registration failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const student = await storageService.findUserByCredentials(email, selectedRole || 'STUDENT');
      if (student) {
        setSuccess(`Recovery hint: Your password is "${student.password}"`);
      } else {
        setError('Email not found in our records.');
      }
    } catch (err) {
      setError("Error retrieving recovery data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Branding Section */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-book-open text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-black text-indigo-900 tracking-tight">Panday Classes</h1>
          </div>
          <h2 className="text-5xl font-black text-gray-900 leading-tight mb-6">
            Cloud Enabled <br /> 
            <span className="text-indigo-600">Education.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your progress is now synced across all devices. Access your practice sets and test results anywhere, anytime.
          </p>
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-indigo-600">Secure</span>
              <span className="text-sm text-gray-500 font-bold uppercase">Data Storage</span>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-indigo-600">Real-time</span>
              <span className="text-sm text-gray-500 font-bold uppercase">Cloud Sync</span>
            </div>
          </div>
        </div>

        {/* Auth Forms Section */}
        <Card className="p-10 !shadow-2xl relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center rounded-xl backdrop-blur-[1px]">
               <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
               <p className="text-xs font-bold text-indigo-600 uppercase">Processing...</p>
            </div>
          )}

          {step === 'ROLE_SELECTION' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Login as</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => handleRoleSelect('STUDENT')}
                  className="w-full flex items-center justify-between p-6 bg-white border-2 border-gray-100 hover:border-indigo-600 rounded-2xl transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <i className="fa-solid fa-user-graduate text-xl"></i>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">I am a Student</p>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Practice & Tests</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all"></i>
                </button>

                <button 
                  onClick={() => handleRoleSelect('TEACHER')}
                  className="w-full flex items-center justify-between p-6 bg-white border-2 border-gray-100 hover:border-indigo-600 rounded-2xl transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <i className="fa-solid fa-user-tie text-xl"></i>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">I am a Teacher</p>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Faculty Portal</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all"></i>
                </button>
              </div>
            </div>
          )}

          {step === 'LOGIN' && (
            <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <button type="button" onClick={() => setStep('ROLE_SELECTION')} className="text-gray-400 hover:text-indigo-600 transition-colors p-1">
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h3 className="text-2xl font-bold text-gray-800 capitalize">{selectedRole?.toLowerCase()} Login</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Username or Email</label>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 focus:border-indigo-600 rounded-xl outline-none transition-all"
                    placeholder="Enter your credentials"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-500 uppercase">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setStep('FORGOT_PASSWORD')}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 focus:border-indigo-600 rounded-xl outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-lg animate-shake">{error}</div>}
                {success && <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-sm font-semibold rounded-lg">{success}</div>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Login
                </button>

                {selectedRole === 'STUDENT' && (
                  <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setStep('REGISTER'); resetForm(); }}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Register Now
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}

          {step === 'REGISTER' && (
            <form onSubmit={handleRegister} className="animate-in fade-in zoom-in-95 duration-300">
               <div className="flex items-center gap-2 mb-6">
                <button type="button" onClick={() => setStep('LOGIN')} className="text-gray-400 hover:text-indigo-600 transition-colors p-1">
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h3 className="text-2xl font-bold text-gray-800">Student Registration</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 focus:border-indigo-600 rounded-xl outline-none transition-all"
                    placeholder="e.g. Rahul Kumar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 focus:border-indigo-600 rounded-xl outline-none transition-all"
                    placeholder="rahul@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Username</label>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 focus:border-indigo-600 rounded-xl outline-none transition-all"
                    placeholder="Create a username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 focus:border-indigo-600 rounded-xl outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-lg animate-shake">{error}</div>}
                {success && <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-sm font-semibold rounded-lg">{success}</div>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {step === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotPassword} className="animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <button type="button" onClick={() => setStep('LOGIN')} className="text-gray-400 hover:text-indigo-600 transition-colors p-1">
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h3 className="text-2xl font-bold text-gray-800">Reset Password</h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-500 text-sm">Provide your registered email address to receive a password recovery hint.</p>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 focus:border-indigo-600 rounded-xl outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-lg animate-shake">{error}</div>}
                {success && <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-sm font-semibold rounded-lg">{success}</div>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Get Recovery Hint
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
