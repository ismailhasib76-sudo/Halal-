
import React from 'react';
import { User, UserRole } from './types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  appName: string;
  appLogo?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout, appName, appLogo }) => {
  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'projects', label: 'প্রকল্পসমূহ', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'investments', label: 'বিনিয়োগ ট্র্যাকিং', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'pools', label: 'পাবলিশ পুল', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'messages', label: 'গ্রুপ নোটিশ', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
    { id: 'settings', label: 'প্রোফাইল সেটিংস', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const adminItems = [
    { id: 'admin', label: 'অ্যাডমিন কন্ট্রোল', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 flex flex-col h-full shadow-2xl transition-colors duration-300 border-r dark:border-slate-800">
      <div className="p-6">
        <div className="flex flex-col items-center gap-2 mb-8 mt-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md p-1 bg-white">
            {appLogo ? <img src={appLogo} alt="Logo" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">Logo</div>}
          </div>
          <h2 className="text-lg font-black text-emerald-700 dark:text-emerald-400 text-center leading-tight">{appName}</h2>
        </div>
        
        <nav className="space-y-1">
          <p className="px-4 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">প্রধান মেনু</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-bold scale-[1.02]' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
              </svg>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}

          {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.SUB_ADMIN) && (
            <div className="pt-6 mt-4 border-t border-gray-100 dark:border-slate-800">
              <p className="px-4 mb-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">অ্যাডমিন টুলস</p>
              {adminItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold scale-[1.02]' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                  </svg>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </nav>
      </div>
      
      <div className="mt-auto p-6 space-y-4">
        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center gap-3">
           <img src={user.avatar} className="w-10 h-10 rounded-full border border-emerald-500" alt="Avatar" />
           <div className="overflow-hidden">
              <p className="text-xs font-black truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400">{user.role === UserRole.SUPER_ADMIN ? 'অ্যাডমিন' : 'সদস্য'}</p>
           </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 font-bold text-sm border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-all"
        >
          লগআউট করুন
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
