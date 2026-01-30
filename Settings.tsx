
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';

interface SettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  appName: string;
  setAppName: (name: string) => void;
  appLogo: string | null;
  setAppLogo: (logo: string | null) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  user, 
  onUpdateUser, 
  onDeleteUser,
  appName, 
  setAppName, 
  appLogo,
  setAppLogo,
  darkMode, 
  setDarkMode 
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || '');
  
  const [tempAppName, setTempAppName] = useState(appName);
  const [tempAppLogo, setTempAppLogo] = useState(appLogo);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAppLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    setTimeout(() => {
      const updatedUser: User = { ...user, name, email, avatar };
      onUpdateUser(updatedUser);
      setIsUpdating(false);
      setMessage({ type: 'success', text: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' });
      setTimeout(() => setMessage(null), 3000);
    }, 500);
  };

  const handleSaveAppSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    setTimeout(() => {
      setAppName(tempAppName);
      setAppLogo(tempAppLogo);
      setIsUpdating(false);
      setMessage({ type: 'success', text: 'সিস্টেম সেটিংস সফলভাবে আপডেট করা হয়েছে!' });
      setTimeout(() => setMessage(null), 3000);
    }, 500);
  };

  const handleResignAdmin = () => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে আপনার অ্যাডমিন পদবি ত্যাগ এবং একাউন্টটি সম্পূর্ণভাবে মুছে ফেলতে চান? এটি করার পর যে কেউ সিক্রেট কোড ব্যবহার করে নতুন অ্যাডমিন হতে পারবে।")) {
      onDeleteUser(user.id);
    }
  };

  const handleResetLogo = () => {
    setTempAppLogo(null);
    setMessage({ type: 'success', text: 'লোগো ডিফল্ট করা হয়েছে। সেভ করতে ভুলবেন না!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {message && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 py-4 rounded-3xl text-center font-bold text-sm shadow-2xl z-50 animate-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border dark:border-slate-700 transition-all">
        <div className="h-32 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 flex items-center px-8 relative overflow-hidden">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
           <h3 className="text-xl font-black text-white flex items-center gap-3 relative z-10">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              প্রোফাইল সেটিংস
           </h3>
        </div>
        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-36 h-36 rounded-full border-4 border-emerald-500 shadow-2xl overflow-hidden relative">
                <img 
                  src={avatar || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="flex-1 space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">আপনার নাম</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-[1.2rem] px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">ইমেইল এড্রেস</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-[1.2rem] px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-semibold"
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="bg-emerald-600 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-3 active:scale-95"
              >
                {isUpdating ? 'আপডেট হচ্ছে...' : 'পরিবর্তন সেভ করুন'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* App Branding - Admin Only */}
      {user.role === UserRole.SUPER_ADMIN && (
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border dark:border-slate-700 transition-all">
          <div className="h-32 bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 flex items-center px-8 relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="text-xl font-black text-white flex items-center gap-3 relative z-10">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                </div>
                সিস্টেম লোগো ও ব্র্যান্ডিং
            </h3>
          </div>
          <div className="p-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">বর্তমানে ব্যবহৃত লোগো</label>
                     <div 
                        className="w-32 h-32 rounded-[2rem] border-4 border-emerald-500/30 shadow-2xl bg-gray-50 dark:bg-slate-900 overflow-hidden flex items-center justify-center cursor-pointer relative group transition-transform hover:rotate-3"
                        onClick={handleLogoClick}
                     >
                        {tempAppLogo ? (
                          <img src={tempAppLogo} alt="App Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="text-emerald-600 dark:text-emerald-400 font-black text-2xl">SA</div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity p-2 text-center">
                           <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                           <span className="text-[10px] text-white font-bold uppercase">আপলোড করুন</span>
                        </div>
                     </div>
                     <div className="flex gap-4">
                       <button onClick={handleLogoClick} className="text-xs font-black text-emerald-600 hover:underline uppercase tracking-widest">পরিবর্তন</button>
                       <span className="text-gray-300">|</span>
                       <button onClick={handleResetLogo} className="text-xs font-black text-red-500 hover:underline uppercase tracking-widest">রিসেট (ডিফল্ট)</button>
                     </div>
                     <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                  </div>
               </div>

               <div className="space-y-6 bg-gray-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700/50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">অ্যাপ্লিকেশনের নাম</label>
                    <input 
                      type="text" 
                      value={tempAppName}
                      onChange={(e) => setTempAppName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-black text-lg"
                      placeholder="যেমন: সাথী ভাই ২"
                    />
                  </div>
                  <button 
                    onClick={handleSaveAppSettings}
                    className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    সিস্টেম সেটিংস সেভ করুন
                  </button>
                  <p className="text-[10px] text-gray-400 text-center italic">সেভ করার পর অ্যাপটি রিলোড হতে পারে।</p>
               </div>
            </div>

            <div className="pt-8 border-t dark:border-slate-700">
               <div className="max-w-md mx-auto space-y-6">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block text-center">সিস্টেম ইউজার ইন্টারফেস থিম</label>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setDarkMode(false)}
                      className={`flex-1 p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-3 ${!darkMode ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-lg' : 'border-gray-100 dark:border-slate-700 shadow-sm'}`}
                    >
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="font-black text-xs dark:text-white uppercase tracking-widest">লাইট মোড</span>
                    </button>
                    <button 
                      onClick={() => setDarkMode(true)}
                      className={`flex-1 p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-3 ${darkMode ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10 shadow-lg' : 'border-gray-100 dark:border-slate-700 shadow-sm'}`}
                    >
                      <div className="p-3 bg-slate-800 rounded-2xl shadow-sm border border-slate-700">
                        <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                      </div>
                      <span className="font-black text-xs dark:text-white uppercase tracking-widest">ডার্ক মোড</span>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Danger Zone - Admin Resignation */}
      {user.role === UserRole.SUPER_ADMIN && (
        <section className="bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] p-10 border-2 border-dashed border-red-200 dark:border-red-900/30">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 space-y-2 text-center md:text-left">
                 <h3 className="text-xl font-black text-red-700 dark:text-red-400">অ্যাডমিন পদবি ত্যাগ ও একাউন্ট রিমুভ</h3>
                 <p className="text-sm text-red-600 dark:text-red-300/70 leading-relaxed max-w-lg">
                    সতর্কতা! আপনি যদি আপনার একাউন্টটি রিমুভ করেন, তবে সিস্টেমে কোন প্রধান অ্যাডমিন থাকবে না। এতে করে নতুন যে কেউ সিক্রেট কোড (#2025#) ব্যবহার করে নতুন প্রধান অ্যাডমিন হিসেবে নিজেকে রেজিস্টার করার সুযোগ পাবে।
                 </p>
              </div>
              <button 
                onClick={handleResignAdmin}
                className="bg-red-600 text-white px-8 py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 whitespace-nowrap"
              >
                একাউন্ট রিমুভ করুন
              </button>
           </div>
        </section>
      )}

      {/* Security Section */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-xl border dark:border-slate-700 relative overflow-hidden group">
        <div className="absolute right-0 bottom-0 opacity-5 transition-transform group-hover:scale-125 duration-1000">
           <svg className="w-40 h-40 text-emerald-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm3 8H9V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3zm-3 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/></svg>
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black text-gray-800 dark:text-white mb-4">নিরাপত্তা ও প্রাইভেসি প্রটোকল</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-xl leading-relaxed">
            আপনার হালাল বিনিয়োগের তথ্য সুরক্ষিত রাখতে আমরা ইন্ডাস্ট্রি স্ট্যান্ডার্ড এনক্রিপশন ব্যবহার করি। কোনো সমস্যা হলে সাথে সাথে পাসওয়ার্ড রিসেট করার সুবিধা রয়েছে।
          </p>
          <div className="flex flex-wrap gap-6">
             <button className="text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                পাসওয়ার্ড পরিবর্তন
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
             </button>
             <button className="text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                লগইন এক্টিভিটি
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
