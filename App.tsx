
import React, { useState, useEffect } from 'react';
import { User, UserRole, Project, Investment, Reminder, Pool } from './types';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ProjectList from './ProjectList';
import InvestmentManager from './components/InvestmentManager';
import AdminPanel from './components/AdminPanel';
import GroupMessages from './GroupMessages';
import Settings from './components/Settings';
import PublicPool from './PublicPool';
import Login from './Login';

const getBase64Unicode = (str: string) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
};

const svgContent = `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
      <feOffset dx="1" dy="1" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <circle cx="100" cy="100" r="95" fill="#f8fafc" stroke="#84928b" stroke-width="6" />
  <circle cx="100" cy="100" r="88" fill="none" stroke="#84928b" stroke-width="1" stroke-dasharray="10 5" opacity="0.3" />
  <text x="50%" y="35%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="28" fill="#4a5d54" filter="url(#shadow)">সাথী ভাই</text>
  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="34" fill="#4a5d54" filter="url(#shadow)">উদ্যোক্তা</text>
  <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="24" fill="#4a5d54" filter="url(#shadow)">২</text>
</svg>
`;

const DEFAULT_LOGO = `data:image/svg+xml;base64,${getBase64Unicode(svgContent)}`;

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [preSelectedProjectId, setPreSelectedProjectId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeUrgentReminder, setActiveUrgentReminder] = useState<Reminder | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  
  const [appName, setAppName] = useState<string>(() => localStorage.getItem('appName') || 'সাথী ভাই উদ্যোক্তা');
  const [appLogo, setAppLogo] = useState<string | null>(() => localStorage.getItem('appLogo') || DEFAULT_LOGO);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Request permissions after login
  useEffect(() => {
    if (currentUser && !localStorage.getItem('permissions_requested')) {
      const timer = setTimeout(() => setShowPermissionDialog(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleGrantPermissions = async () => {
    setShowPermissionDialog(false);
    localStorage.setItem('permissions_requested', 'true');
    
    // Attempt to get camera and geolocation access to trigger browser prompt
    try {
      await navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (e) { console.debug("Camera access skipped or denied"); }
    
    try {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    } catch (e) { console.debug("Location access skipped or denied"); }
  };

  useEffect(() => {
    document.title = appName;
    localStorage.setItem('appName', appName);
  }, [appName]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    const savedInvestments = localStorage.getItem('investments');
    const savedReminders = localStorage.getItem('reminders');
    const savedPools = localStorage.getItem('pools');
    const savedUsers = localStorage.getItem('all_users');

    if (savedProjects) setProjects(JSON.parse(savedProjects));
    else {
      setProjects([
        { id: '1', title: 'প্রকল্প ১: হাউজিং এস্টেট', description: 'সাশ্রয়ী মূল্যের আবাসন প্রকল্প।', targetAmount: 500000, currentAmount: 320000, startDate: '২০২৪-০১-০১', duration: '১২ মাস', progress: 64, status: 'ACTIVE', totalProfit: 45000, islamicWorkDeductionPercent: 10 },
        { id: '2', title: 'প্রকল্প ২: সুপারশপ চেইন', description: 'হালাল পণ্যের সুপারশপ চেইন।', targetAmount: 200000, currentAmount: 150000, startDate: '২০২৪-০৩-১৫', duration: '৬ মাস', progress: 75, status: 'ACTIVE', totalProfit: 20000, islamicWorkDeductionPercent: 10 },
      ]);
    }
    
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else setUsers([]);

    if (savedPools) setPools(JSON.parse(savedPools));
    if (savedReminders) {
      const parsed = JSON.parse(savedReminders);
      setReminders(parsed);
      setUnreadCount(parsed.length);
      const urgent = parsed.find((r: Reminder) => r.category === 'URGENT');
      if (urgent) setActiveUrgentReminder(urgent);
    }
    if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
  }, []);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('investments', JSON.stringify(investments));
    localStorage.setItem('reminders', JSON.stringify(reminders));
    localStorage.setItem('pools', JSON.stringify(pools));
    localStorage.setItem('all_users', JSON.stringify(users));
  }, [projects, investments, reminders, pools, users]);

  const addReminder = (r: Reminder) => {
    const updated = [r, ...reminders];
    setReminders(updated);
    setUnreadCount(prev => prev + 1);
    if (r.category === 'URGENT') setActiveUrgentReminder(r);
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map(u => {
      if (newRole === UserRole.SUPER_ADMIN) {
        if (u.id === userId) return { ...u, role: newRole };
        if (u.role === UserRole.SUPER_ADMIN) return { ...u, role: UserRole.MEMBER };
      }
      if (u.id === userId) return { ...u, role: newRole };
      return u;
    });
    setUsers(updatedUsers);

    const updatedMe = updatedUsers.find(u => u.id === currentUser?.id);
    if (updatedMe) setCurrentUser(updatedMe);
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    if (currentUser?.id === userId) {
      setCurrentUser(null);
      setActiveTab('dashboard');
    }
  };

  const clearUrgent = () => setActiveUrgentReminder(null);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-emerald-900 flex flex-col items-center justify-center z-[100] animate-in fade-in duration-500 overflow-hidden">
        <div className="relative">
          <div className="w-32 h-32 mb-6 animate-pulse relative z-10">
            <img src={appLogo || DEFAULT_LOGO} alt="Splash" className="w-full h-full object-contain" />
          </div>
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-ping"></div>
        </div>
        <div className="text-white text-2xl font-black tracking-widest animate-bounce mt-4 drop-shadow-lg">{appName}</div>
        <div className="absolute bottom-10 left-0 right-0 text-center">
            <p className="text-emerald-300/50 text-[10px] font-bold uppercase tracking-[0.3em]">হালাল বিনিয়োগের ডিজিটাল সাথী</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login 
      onLogin={(user, roleRequest) => {
        const existing = users.find(u => u.email === user.email);
        if (existing) {
          setCurrentUser(existing);
        } else {
          const newUser = { ...user, role: roleRequest || UserRole.MEMBER };
          setUsers([...users, newUser]);
          setCurrentUser(newUser);
        }
      }} 
      darkMode={darkMode} 
      appName={appName} 
      appLogo={appLogo}
      existingUsers={users}
    />;
  }

  const renderContent = () => {
    return (
      <div className="animate-tab-content">
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard projects={projects} investments={investments} reminders={reminders} user={currentUser} darkMode={darkMode} />;
            case 'projects': return <ProjectList projects={projects} user={currentUser} onUpdate={setProjects} onInvest={(id) => { setPreSelectedProjectId(id); setActiveTab('investments'); }} />;
            case 'investments': return <InvestmentManager investments={investments} projects={projects} user={currentUser} onUpdate={setInvestments} preSelectedProjectId={preSelectedProjectId} onClearPreSelection={() => setPreSelectedProjectId(null)} />;
            case 'pools': return <PublicPool pools={pools} user={currentUser} />;
            case 'admin': return <AdminPanel projects={projects} investments={investments} users={users} onUpdateUsers={setUsers} user={currentUser} onUpdateProjects={setProjects} onUpdateInvestments={setInvestments} onAddReminder={addReminder} onUpdateRole={handleUpdateUserRole} appName={appName} setAppName={setAppName} appLogo={appLogo} setAppLogo={setAppLogo} defaultLogo={DEFAULT_LOGO} />;
            case 'messages': return <GroupMessages reminders={reminders} user={currentUser} />;
            case 'settings': return <Settings user={currentUser} onUpdateUser={(u) => {
              setCurrentUser(u);
              setUsers(users.map(existing => existing.id === u.id ? u : existing));
            }} onDeleteUser={handleDeleteUser} appName={appName} setAppName={setAppName} appLogo={appLogo} setAppLogo={setAppLogo} darkMode={darkMode} setDarkMode={setDarkMode} />;
            default: return <Dashboard projects={projects} investments={investments} reminders={reminders} user={currentUser} darkMode={darkMode} />;
          }
        })()}
      </div>
    );
  };

  const navItems = [
    { id: 'dashboard', label: 'হোম', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'projects', label: 'প্রকল্প', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'investments', label: 'বিনিয়োগ', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'messages', label: 'নোটিশ', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden flex-col md:flex-row select-none">
      {/* Delayed Permission Dialog */}
      {showPermissionDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mx-auto">
               <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-800 dark:text-white">অ্যাক্সেস প্রয়োজন</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">বিনিয়োগের রশিদ আপলোড এবং নিরাপত্তা নিশ্চিত করতে ক্যামেরা ও লোকেশন অ্যাক্সেস প্রয়োজন।</p>
            </div>
            <button 
              onClick={handleGrantPermissions} 
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
            >
              চালিয়ে যান
            </button>
          </div>
        </div>
      )}

      {/* Urgent Alert Overlay - App Style */}
      {activeUrgentReminder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border-2 border-red-500/50 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-center text-gray-800 dark:text-white mb-2">জরুরি নোটিশ!</h2>
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[2rem] mb-8 border border-red-100 dark:border-red-900/20">
              <h4 className="font-black text-lg text-red-700 dark:text-red-400 mb-2">{activeUrgentReminder.title}</h4>
              <p className="text-red-600/80 dark:text-red-300/80 text-sm leading-relaxed">{activeUrgentReminder.message}</p>
            </div>
            <button onClick={clearUrgent} className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all">আমি পড়েছি, বন্ধ করুন</button>
          </div>
        </div>
      )}

      {/* Sidebar - App Drawer style */}
      <div className={`fixed inset-0 z-[60] md:relative md:z-auto transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="relative h-full w-72 max-w-[80%]">
          <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} user={currentUser} onLogout={() => setCurrentUser(null)} appName={appName} appLogo={appLogo} />
        </div>
      </div>

      {/* Main App Content Area */}
      <main className="flex-1 overflow-y-auto app-container p-4 md:p-8 relative no-scrollbar">
        <header className="app-header flex justify-between items-center mb-6 sticky top-0 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-xl z-40 py-2">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border dark:border-slate-700 active:scale-90 transition-transform">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{appName}</span>
                <h1 className="text-xl font-black text-gray-800 dark:text-gray-100 leading-tight">
                    {activeTab === 'dashboard' ? 'হোম' : activeTab === 'projects' ? 'প্রকল্পসমূহ' : activeTab === 'investments' ? 'বিনিয়োগ' : activeTab === 'admin' ? 'অ্যাডমিন' : activeTab === 'settings' ? 'সেটিংস' : activeTab === 'pools' ? 'পুল' : activeTab === 'messages' ? 'নোটিশ' : 'অ্যাপ'}
                </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-amber-500 border dark:border-slate-700 shadow-sm active:scale-90">
              {darkMode ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707-.707M7.757 6.364l.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            </button>
            <div className="w-10 h-10 rounded-2xl border-2 border-emerald-500 overflow-hidden cursor-pointer shadow-lg active:scale-95 transition-all" onClick={() => setActiveTab('settings')}>
              <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto pb-8">
          {renderContent()}
        </div>
      </main>

      {/* App Bottom Navigation Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-gray-100 dark:border-slate-800 flex justify-around items-center h-16 px-4 z-[50] pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 flex-1 transition-all relative ${activeTab === item.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600'}`}>
            {activeTab === item.id && <div className="absolute -top-1 w-8 h-1 bg-emerald-500 rounded-full"></div>}
            <svg className={`w-6 h-6 transition-transform ${activeTab === item.id ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === item.id ? 2.5 : 2} d={item.icon} /></svg>
            <span className="text-[10px] font-black tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
