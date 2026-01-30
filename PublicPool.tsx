
import React from 'react';
import { Pool, User } from './types';

interface PublicPoolProps {
  pools: Pool[];
  user: User;
}

const PublicPool: React.FC<PublicPoolProps> = ({ pools }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pools.map((pool) => {
          const progress = Math.min(100, Math.floor((pool.collectedAmount / pool.totalGoal) * 100));
          const remainingAmount = Math.max(0, pool.totalGoal - pool.collectedAmount);
          
          return (
            <div key={pool.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all relative group overflow-hidden">
              {/* Status Ribbon */}
              <div className="absolute top-0 right-0">
                <div className={`px-6 py-1 text-[10px] font-black uppercase tracking-[0.2em] transform rotate-45 translate-x-8 translate-y-4 shadow-sm ${
                  pool.isActive ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                }`}>
                  {pool.isActive ? 'চলমান' : 'বন্ধ'}
                </div>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-200 dark:border-emerald-800">
                      {pool.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                       {pool.contributors} জন
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {pool.name}
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed line-clamp-2">
                {pool.description}
              </p>
              
              {/* Goal Tracker Dashboard */}
              <div className="bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl p-6 mb-8 border border-gray-100 dark:border-slate-700/50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter mb-1">মোট লক্ষ্য</p>
                    <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-white">৳{pool.totalGoal.toLocaleString()}</p>
                  </div>
                  <div className="text-center border-x border-gray-200 dark:border-slate-700">
                    <p className="text-[10px] text-emerald-500 uppercase font-black tracking-tighter mb-1">অর্জিত</p>
                    <p className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">৳{pool.collectedAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-amber-500 uppercase font-black tracking-tighter mb-1">অবশিষ্ট</p>
                    <p className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-500">৳{remainingAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{progress}% সম্পন্ন</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">তহবিল সংগ্রহ অগ্রগতি</span>
                  </div>
                  <div className="relative h-4 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <div 
                      style={{ width: `${progress}%` }} 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)] ${progress > 90 ? 'animate-pulse' : ''}`}
                    ></div>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.1em] shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                এখনই অংশগ্রহণ করুন
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Community Impact Board */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              ইমপ্যাক্ট ড্যাশবোর্ড
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight">আমাদের ক্ষুদ্র প্রচেষ্টায় <br/><span className="text-emerald-400">বিশাল সামাজিক পরিবর্তন</span></h2>
            <p className="text-emerald-100/70 text-lg leading-relaxed mb-8">
              পাবলিশ পুলের মাধ্যমে আমরা সবাই মিলে বড় ধরণের কাজ সহজ করতে পারি। ছোট ছোট অবদানেই গড়ে ওঠে বিশাল তহবিল যা অভাবী মানুষের মুখে হাসি ফুটিয়ে তোলে।
            </p>
            <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 transition-colors">
              সবগুলো পুল দেখুন
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 hover:border-emerald-500/30 transition-all">
              <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400 mb-2">মোট পুল সংখ্যা</p>
              <p className="text-5xl font-black">০৮</p>
              <div className="mt-4 h-1 w-12 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 hover:border-emerald-500/30 transition-all">
              <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400 mb-2">যৌথ সংগৃহীত</p>
              <p className="text-5xl font-black">৳৪.৫<span className="text-2xl">লাখ</span></p>
              <div className="mt-4 h-1 w-12 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPool;
