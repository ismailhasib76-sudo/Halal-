
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';

interface LoginProps {
  onLogin: (user: User, roleRequest?: UserRole) => void;
  onUpdateUser?: (updatedUser: User) => void;
  darkMode: boolean;
  appName: string;
  appLogo?: string | null;
  existingUsers: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, onUpdateUser, darkMode, appName, appLogo, existingUsers }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'RECOVERY'>('LOGIN');
  const [recoveryStep, setRecoveryStep] = useState<'EMAIL' | 'RESET'>('EMAIL');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.MEMBER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<User | null>(null);

  const adminCount = existingUsers.filter(u => u.role === UserRole.SUPER_ADMIN).length;
  const subAdminCount = existingUsers.filter(u => u.role === UserRole.SUB_ADMIN).length;

  const isAdminFull = adminCount >= 1;
  const isSubAdminFull = subAdminCount >= 4;

  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    setAdminCode('');
    setRecoveryStep('EMAIL');
  }, [mode, selectedRole]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    setIsSubmitting(false);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      if (recoveryStep === 'EMAIL') {
        const user = existingUsers.find(u => u.email === email);
        if (user) {
          setTargetUser(user);
          setRecoveryStep('RESET');
          setSuccessMessage('ইমেইল ভেরিফাইড! এখন নতুন পাসওয়ার্ড সেট করুন।');
          setIsSubmitting(false);
          setTimeout(() => setSuccessMessage(null), 2000);
        } else {
          setError('এই ইমেইলটি আমাদের সিস্টেমে পাওয়া যায়নি।');
          triggerShake();
        }
      } else if (recoveryStep === 'RESET' && targetUser) {
        if (!password || password !== confirmPassword) {
          setError('পাসওয়ার্ড মেলেনি বা খালি রাখা যাবে না।');
          triggerShake();
          return;
        }

        if (targetUser.role !== UserRole.MEMBER) {
          if (adminCode !== '#2025#') {
            setError('ভুল সিক্রেট কোড! সঠিক কোড ছাড়া পাসওয়ার্ড রিসেট সম্ভব নয়।');
            triggerShake();
            return;
          }
        }

        setSuccessMessage('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! এখন লগইন করুন।');
        setIsSubmitting(false);
        setTimeout(() => {
          setMode('LOGIN');
          setTargetUser(null);
          setEmail(targetUser.email);
        }, 2000);
      }
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Artificial delay for animation
    setTimeout(() => {
      if (mode === 'REGISTER') {
        if (!name || !email || !password || !confirmPassword) {
          setError('দয়া করে সবগুলো তথ্য সঠিকভাবে পূরণ করুন');
          triggerShake();
          return;
        }
        if (password !== confirmPassword) {
          setError('পাসওয়ার্ড দুটি মেলেনি');
          triggerShake();
          return;
        }

        if (selectedRole === UserRole.SUPER_ADMIN) {
          if (isAdminFull) {
            setError('দুঃখিত! প্রধান অ্যাডমিন স্লট পূর্ণ।');
            triggerShake();
            return;
          }
          if (adminCode !== '#2025#') {
            setError('ভুল অ্যাডমিন কোড!');
            triggerShake();
            return;
          }
        }

        if (selectedRole === UserRole.SUB_ADMIN) {
          if (isSubAdminFull) {
            setError('সাব-অ্যাডমিন স্লট পূর্ণ।');
            triggerShake();
            return;
          }
          if (adminCode !== '#2025#') {
            setError('ভুল সিক্রেট কোড!');
            triggerShake();
            return;
          }
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: name,
          email: email,
          role: selectedRole,
          avatar: `https://picsum.photos/seed/${email}/200`
        };

        setSuccessMessage('নিবন্ধন সফল হয়েছে!');
        setIsSubmitting(false);
        setTimeout(() => {
          setMode('LOGIN');
          onLogin(newUser, selectedRole);
        }, 1200);
      } else {
        if (!email || !password) {
          setError('ইমেইল ও পাসওয়ার্ড প্রদান করুন');
          triggerShake();
          return;
        }

        const userFound = existingUsers.find(u => u.email === email);
        if (userFound) {
          if ((userFound.role === UserRole.SUPER_ADMIN || userFound.role === UserRole.SUB_ADMIN) && adminCode !== '' && adminCode !== '#2025#') {
            setError('ভুল সিক্রেট কোড!');
            triggerShake();
            return;
          }
          setSuccessMessage('লগইন সফল হচ্ছে...');
          setTimeout(() => onLogin(userFound), 800);
        } else {
          setError('অ্যাকাউন্ট পাওয়া যায়নি। সঠিক তথ্য দিন।');
          triggerShake();
        }
      }
    }, 1500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-emerald-900 dark:bg-slate-950 transition-colors duration-500 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-800 to-emerald-950`}>
      <div className={`bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl max-w-md w-full p-8 md:p-10 space-y-6 border dark:border-slate-700 transition-all ${isShaking ? 'animate-bounce' : ''} animate-in fade-in slide-in-from-bottom-8 duration-700`} style={{ animation: isShaking ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : '' }}>
        
        <div className="text-center">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 w-24 h-24 rounded-[2.2rem] flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-emerald-500 shadow-xl transition-transform hover:scale-110 active:scale-95 duration-300 animate-in zoom-in spin-in-6 duration-1000">
             {appLogo ? <img src={appLogo} alt="Logo" className="w-full h-full object-contain" /> : <span className="text-3xl font-black text-emerald-600">SV</span>}
          </div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight animate-in slide-in-from-top-4 delay-150 duration-700 fill-mode-both">{appName}</h2>
          
          {mode !== 'RECOVERY' && (
            <div className="flex justify-center gap-6 mt-6 animate-in fade-in delay-300 duration-700 fill-mode-both">
              <button onClick={() => setMode('LOGIN')} className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${mode === 'LOGIN' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-400'}`}>লগইন</button>
              <button onClick={() => setMode('REGISTER')} className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${mode === 'REGISTER' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-400'}`}>রেজিস্ট্রেশন</button>
            </div>
          )}
          {mode === 'RECOVERY' && (
            <p className="mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">পাসওয়ার্ড রিকভারি মোড</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-2xl animate-in slide-in-from-top-2">
            <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-4 rounded-r-2xl animate-in slide-in-from-top-2 flex items-center gap-3">
             <div className="bg-emerald-500 rounded-full p-1 animate-in zoom-in duration-500">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
             </div>
             <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{successMessage}</p>
          </div>
        )}

        {mode === 'RECOVERY' ? (
          <form onSubmit={handleRecovery} className="space-y-4 animate-in fade-in duration-500">
            {recoveryStep === 'EMAIL' ? (
              <div className="space-y-4">
                <input type="email" placeholder="আপনার নিবন্ধিত ইমেইল দিন" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white py-5 rounded-[1.8rem] font-black text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                  {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> যাচাই হচ্ছে...</> : 'ইমেইল ভেরিফাই করুন'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input type="password" placeholder="নতুন পাসওয়ার্ড দিন" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="পাসওয়ার্ড নিশ্চিত করুন" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                {targetUser?.role !== UserRole.MEMBER && (
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-3xl border border-amber-100 dark:border-amber-800 space-y-2">
                    <label className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest ml-1 block">নিরাপত্তা কোড দিন</label>
                    <input type="password" placeholder="সিক্রেট কোড দিন" className="w-full bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-amber-500" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
                  </div>
                )}
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white py-5 rounded-[1.8rem] font-black text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                  {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> প্রসেসিং...</> : 'পাসওয়ার্ড রিসেট করুন'}
                </button>
              </div>
            )}
            <button type="button" onClick={() => setMode('LOGIN')} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">ফিরে যান</button>
          </form>
        ) : (
          <>
            {mode === 'REGISTER' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">মেম্বারশিপ টাইপ বেছে নিন</p>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 dark:bg-slate-900 rounded-[1.5rem] border dark:border-slate-700">
                  {[
                    { id: UserRole.SUPER_ADMIN, label: 'অ্যাডমিন', full: isAdminFull, color: 'bg-indigo-600' },
                    { id: UserRole.SUB_ADMIN, label: 'সাব-অ্যাডমিন', full: isSubAdminFull, color: 'bg-blue-600' },
                    { id: UserRole.MEMBER, label: 'সদস্য', full: false, color: 'bg-emerald-600' }
                  ].map(role => (
                    <button 
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      disabled={role.full}
                      className={`py-3 px-1 rounded-2xl text-[10px] font-black transition-all flex flex-col items-center gap-1 ${
                        selectedRole === role.id 
                          ? `${role.color} text-white shadow-lg scale-105` 
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      } ${role.full ? 'opacity-30 cursor-not-allowed bg-gray-200 dark:bg-slate-800' : ''}`}
                    >
                      {role.label}
                      <span className="text-[8px] opacity-70">
                        {role.id === UserRole.SUPER_ADMIN ? `${adminCount}/১` : role.id === UserRole.SUB_ADMIN ? `${subAdminCount}/৪` : 'আনলিমিটেড'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {mode === 'REGISTER' && (
                  <div className="animate-in slide-in-from-left-4 delay-75 fill-mode-both">
                    <input type="text" placeholder="পূর্ণ নাম লিখুন" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                )}
                
                <div className="animate-in slide-in-from-left-4 delay-150 fill-mode-both">
                  <input type="email" placeholder="ইমেইল অ্যাড্রেস" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="animate-in slide-in-from-left-4 delay-200 fill-mode-both">
                  <input type="password" placeholder="গোপন পাসওয়ার্ড" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                
                {mode === 'REGISTER' ? (
                  <>
                    <div className="animate-in slide-in-from-left-4 delay-[250ms] fill-mode-both">
                      <input type="password" placeholder="পাসওয়ার্ডটি আবার লিখুন" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    
                    {selectedRole !== UserRole.MEMBER && (
                      <div className="animate-in zoom-in-95 delay-300 fill-mode-both pt-2">
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-800 space-y-2">
                          <label className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest ml-1 block">সিক্রেট কোড দিন</label>
                          <input type="password" placeholder="সিক্রেট কোড দিন" className="w-full bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-800 rounded-xl px-5 py-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="animate-in slide-in-from-left-4 delay-[250ms] fill-mode-both">
                      <div className="bg-gray-50 dark:bg-slate-900/30 p-4 rounded-3xl border border-gray-100 dark:border-slate-700 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">সিক্রেট কোড (অ্যাডমিনদের জন্য)</label>
                        <input type="password" placeholder="সিক্রেট কোড দিন (যদি থাকে)" className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-5 py-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />
                      </div>
                    </div>
                    <div className="text-right px-2 animate-in fade-in delay-500">
                      <button type="button" onClick={() => setMode('RECOVERY')} className="text-[10px] font-black text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest">পাসওয়ার্ড ভুলে গেছেন?</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="animate-in slide-in-from-bottom-4 delay-[350ms] fill-mode-both">
                <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white py-5 rounded-[1.8rem] font-black text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.97] transition-all mt-4 border-b-4 border-emerald-800 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      যাচাই করা হচ্ছে...
                    </>
                  ) : (
                    mode === 'REGISTER' ? 'নিবন্ধন সম্পন্ন করুন' : 'অ্যাকাউন্টে প্রবেশ করুন'
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        <p className="text-[10px] text-gray-400 text-center italic leading-relaxed px-4 animate-in fade-in delay-[600ms]">
          আপনার হালাল বিনিয়োগের নিরাপত্তা নিশ্চিত করতে আমরা কঠোর গোপনীয়তা বজায় রাখি। কোনো সমস্যার জন্য সরাসরি অ্যাডমিনের সাহায্য নিন।
        </p>
      </div>
    </div>
  );
};

export default Login;
