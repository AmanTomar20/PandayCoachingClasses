
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
  const [emailError, setEmailError] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [batch, setBatch] = useState('10th');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setEmail('');
    setEmailError('');
    setName('');
    setMobile('');
    setBatch('10th');
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
        if (user.role === 'STUDENT' && user.isApproved === false) {
          setError("Your account is pending teacher approval. Please check back later.");
          setLoading(false);
          return;
        }
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

  const validateEmail = (val: string) => {
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !emailRegex.test(val)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !username || !password || !mobile || !batch) {
        setError('All fields are required.');
        return;
      }

      if (emailError) {
        setError('Please fix the email format.');
        return;
      }

      // Mobile validation: 10 digits, numbers only
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobile)) {
        setError('Mobile number must be exactly 10 digits.');
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
        mobile,
        batch,
        role: 'STUDENT',
        isApproved: false
      };

      await storageService.registerStudent(newStudent);
      setSuccess('Registration successful! Your account is pending teacher approval.');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Decorative background circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 dark:bg-gray-900/50 rounded-full blur-3xl"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Branding Section */}
        <div className="block">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6">
            <div className="bg-indigo-600 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
              <i className="fa-solid fa-book-open text-white text-xl md:text-2xl"></i>
            </div>
            <div className="flex flex-col items-center md:items-start leading-none">
              <h1 className="text-2xl md:text-3xl font-black text-indigo-900 dark:text-indigo-400 tracking-tight">PrepHive 🐝</h1>
              <span 
                className="text-base md:text-lg italic text-indigo-600 dark:text-indigo-300 mt-1" 
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                By Raunak Pandey
              </span>
            </div>
          </div>
          <h2 className="hidden md:block text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4 md:mb-6">
            Where hard work <br className="hidden md:block" /> 
            <span className="text-indigo-600 dark:text-indigo-400">meets high scores</span>
          </h2>
          <p className="hidden md:block text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed">
            Master 10th-12th boards and JEE/Advanced. Practice thousands of curated MCQs with real-time analytics to crush your exams.
          </p>
          <div className="hidden md:flex gap-4 mb-8 md:mb-0">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">Secure</span>
              <span className="text-sm text-gray-500 dark:text-gray-500 font-bold uppercase">Data Storage</span>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">Real-time</span>
              <span className="text-sm text-gray-500 dark:text-gray-500 font-bold uppercase">Cloud Sync</span>
            </div>
          </div>
        </div>

        {/* Auth Forms Section */}
        <Card className="p-10 !shadow-2xl relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 z-20 flex flex-col items-center justify-center rounded-xl backdrop-blur-[1px]">
               <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
               <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Processing...</p>
            </div>
          )}

          {step === 'ROLE_SELECTION' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">Login as</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => handleRoleSelect('STUDENT')}
                  className="w-full flex items-center justify-between p-6 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-500 rounded-2xl transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <i className="fa-solid fa-user-graduate text-xl"></i>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white">I am a Student</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wide">Practice & Tests</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 group-hover:translate-x-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all"></i>
                </button>

                <button 
                  onClick={() => handleRoleSelect('TEACHER')}
                  className="w-full flex items-center justify-between p-6 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-500 rounded-2xl transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <i className="fa-solid fa-user-tie text-xl"></i>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white">I am a Teacher</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wide">Faculty Portal</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-300 dark:text-gray-600 group-hover:translate-x-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all"></i>
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
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">{selectedRole?.toLowerCase()} Login</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Username or Email</label>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl outline-none transition-all dark:text-white"
                    placeholder="Enter your credentials"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setStep('FORGOT_PASSWORD')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl outline-none transition-all dark:text-white"
                    placeholder="••••••••"
                  />
                </div>

                {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold rounded-lg animate-shake">{error}</div>}
                {success && <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 text-sm font-semibold rounded-lg">{success}</div>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Login
                </button>

                {selectedRole === 'STUDENT' && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setStep('REGISTER'); resetForm(); }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
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
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Student Registration</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl outline-none transition-all dark:text-white"
                    placeholder="e.g. Rahul Kumar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                    className={`w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 ${emailError ? 'border-red-500' : 'border-gray-100 dark:border-gray-600'} focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl outline-none transition-all dark:text-white`}
                    placeholder="rahul@example.com"
                  />
                  {emailError && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{emailError}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold">+91</span>
                      <input 
                        type="text" 
                        required
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-4 pl-14 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl outline-none transition-all dark:text-white"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Batch</label>
                    <select 
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl outline-none transition-all appearance-none cursor-pointer dark:text-white"
                    >
                      <option value="9th">9th Standard</option>
                      <option value="10th">10th Standard</option>
                      <option value="11th">11th Standard</option>
                      <option value="12th">12th Standard</option>
                      <option value="JEE Mains">JEE Mains</option>
                      <option value="JEE Advance">JEE Advance</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Username</label>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl outline-none transition-all dark:text-white"
                    placeholder="Create a username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl outline-none transition-all dark:text-white"
                    placeholder="••••••••"
                  />
                </div>

                {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold rounded-lg animate-shake">{error}</div>}
                {success && <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 text-sm font-semibold rounded-lg">{success}</div>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50"
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
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Reset Password</h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Provide your registered email address to receive a password recovery hint.</p>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-xl outline-none transition-all dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>

                {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold rounded-lg animate-shake">{error}</div>}
                {success && <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 text-sm font-semibold rounded-lg">{success}</div>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50"
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
