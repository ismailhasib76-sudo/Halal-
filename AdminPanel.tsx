
import React, { useState, useRef } from 'react';
import { Project, Investment, User, UserRole, InvestmentStatus, Reminder } from '../types';

interface AdminPanelProps {
  projects: Project[];
  investments: Investment[];
  users: User[];
  user: User;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateInvestments: (investments: Investment[]) => void;
  onUpdateUsers: (users: User[]) => void;
  onAddReminder: (reminder: Reminder) => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
  appName: string;
  setAppName: (name: string) => void;
  appLogo: string | null;
  setAppLogo: (logo: string | null) => void;
  defaultLogo: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  projects, 
  investments, 
  users,
  user, 
  onUpdateProjects, 
  onUpdateInvestments, 
  onAddReminder,
  onUpdateRole,
  appName,
  setAppName,
  appLogo,
  setAppLogo,
  defaultLogo
}) => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderData, setReminderData] = useState({ 
    title: '', 
    message: '', 
    category: 'GENERAL' as 'GENERAL' | 'URGENT' | 'PROJECT_UPDATE' 
  });

  const [tempAppName, setTempAppName] = useState(appName);
  const [tempAppLogo, setTempAppLogo] = useState(appLogo);
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const subAdminCount = users.filter(u => u.role === UserRole.SUB_ADMIN).length;

  const handleApprove = (invId: string) => {
    const updated = investments.map(inv => {
      if (inv.id === invId) {
        const proj = projects.find(p => p.id === inv.projectId);
        if (proj) {
          proj.currentAmount += inv.amount;
          proj.progress = Math.min(100, Math.floor((proj.currentAmount / proj.targetAmount) * 100));
        }
        return { ...inv, status: InvestmentStatus.APPROVED };
      }
      return inv;
    });
    onUpdateInvestments(updated);
    onUpdateProjects([...projects]);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      title: reminderData.title,
      message: reminderData.message,
      category: reminderData.category,
      senderName: user.name,
      date: new Date().toLocaleString(),
    };
    onAddReminder(newReminder);
    setShowReminderModal(false);
    setReminderData({ title: '', message: '', category: 'GENERAL' });
  };

  const toggleRole = (targetUser: User) => {
    if (user.role !== UserRole.SUPER_ADMIN) {
      alert("শুধুমাত্র প্রধান অ্যাডমিন সুইচবোর্ড ব্যবহার করতে পারবেন।");
      return;
    }

    if (targetUser.id === user.id) {
      alert("নিজের রোল সরাসরি পরিবর্তন সম্ভব নয়। অন্য কাউকে অ্যাডমিন বানালে আপনি স্বয়ংক্রিয়ভাবে সদস্য হয়ে যাবেন।");
      return;
    }

    const choice = window.prompt(
      `সদস্য: ${targetUser.name}\nনতুন রোল নির্বাচন করুন:\n১ - প্রধান অ্যাডমিন (আপনি সদস্য হয়ে যাবেন)\n২ - সাব-অ্যাডমিন (সর্বোচ্চ ৪ জন)\n৩ - সাধারণ সদস্য`
    );
    
    if (choice === '১') {
       if (window.confirm(`আপনি কি নিশ্চিত? তাকে অ্যাডমিন বানালে আপনার বর্তমান এক্সেস চলে যাবে।`)) {
          onUpdateRole(targetUser.id, UserRole.SUPER_ADMIN);
       }
    } else if (choice === '২') {
       if (subAdminCount >= 4 && targetUser.role !== UserRole.SUB_ADMIN) {
          alert("সাব-অ্যাডমিন স্লট পূর্ণ!");
       } else {
          onUpdateRole(targetUser.id, UserRole.SUB_ADMIN);
       }
    } else if (choice === '৩') {
       onUpdateRole(targetUser.id, UserRole.MEMBER);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempAppLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveBranding = () => {
    setIsSavingBranding(true);
    setTimeout(() => {
      setAppName(tempAppName);
      setAppLogo(tempAppLogo);
      setIsSavingBranding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  if (user.role === UserRole.MEMBER) return <div className="p-8 text-center text-red-500 font-bold">অনুমতি নেই</div>;

  const pendingInvestments = investments.filter(i => i.status === InvestmentStatus.PENDING);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Role Switchboard - Super Admin Only */}
      {user.role === UserRole.SUPER_ADMIN && (
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-700">
           <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                  <div className="bg-indigo-600 p-2 rounded-xl text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  অ্যাডমিন সুইচবোর্ড
                </h3>
              </div>
              <div className="flex gap-2">
                 <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
                    <p className="text-[8px] uppercase font-black text-blue-600">সাব-অ্যাডমিন</p>
                    <p className="text-sm font-black dark:text-white">{subAdminCount}/৪</p>
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="text-left border-b dark:border-slate-700">
                   <th className="pb-3 text-[10px] font-black uppercase text-gray-400">সদস্য</th>
                   <th className="pb-3 text-[10px] font-black uppercase text-gray-400 text-center">পদবি</th>
                   <th className="pb-3 text-[10px] font-black uppercase text-gray-400 text-right">অ্যাকশন</th>
                 </tr>
               </thead>
               <tbody className="divide-y dark:divide-slate-700">
                 {users.map(u => (
                   <tr key={u.id}>
                     <td className="py-4">
                        <div className="flex items-center gap-3">
                           <img src={u.avatar} className="w-8 h-8 rounded-full" alt="User" />
                           <div>
                              <p className="text-xs font-bold dark:text-white">{u.name}</p>
                              <p className="text-[10px] text-gray-400">{u.email}</p>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 text-center">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${
                          u.role === UserRole.SUPER_ADMIN ? 'bg-indigo-600 text-white' :
                          u.role === UserRole.SUB_ADMIN ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {u.role === UserRole.SUPER_ADMIN ? 'অ্যাডমিন' : u.role === UserRole.SUB_ADMIN ? 'সাব-অ্যাডমিন' : 'সদস্য'}
                        </span>
                     </td>
                     <td className="py-4 text-right">
                        <button onClick={() => toggleRole(u)} className="text-[10px] font-black text-indigo-600 hover:underline">রোল পরিবর্তন</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </section>
      )}

      {/* Pending Approvals */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-md text-sm">{pendingInvestments.length}</span>
          বিনিয়োগ অনুমোদন
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingInvestments.map(inv => (
            <div key={inv.id} className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex gap-4 transition-all hover:scale-[1.01]">
              <img src={inv.screenshotUrl} alt="Receipt" className="w-20 h-28 object-cover rounded-xl border dark:border-slate-700 shadow-sm" />
              <div className="flex-1 space-y-2">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{inv.userName}</p>
                       <p className="text-[10px] text-gray-500">{inv.projectTitle}</p>
                    </div>
                    <p className="font-black text-emerald-600">৳{inv.amount.toLocaleString()}</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleApprove(inv.id)} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold">অনুমোদন</button>
                    <button className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-500 py-2 rounded-xl text-xs font-bold">প্রত্যাখ্যান</button>
                 </div>
              </div>
            </div>
          ))}
          {pendingInvestments.length === 0 && <p className="text-gray-400 dark:text-gray-500 italic text-sm">নতুন আবেদন নেই</p>}
        </div>
      </section>

      {/* Branding - Super Admin Only */}
      {user.role === UserRole.SUPER_ADMIN && (
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">অ্যাপ ব্র্যান্ডিং</h3>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div onClick={() => logoInputRef.current?.click()} className="w-32 h-32 rounded-3xl border-4 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 dark:bg-slate-900 group">
              {tempAppLogo ? <img src={tempAppLogo} className="w-full h-full object-contain p-2" alt="Logo" /> : <span className="text-xs text-gray-400 font-bold">লোগো দিন</span>}
              <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
            </div>
            <div className="flex-1 space-y-4 w-full">
               <input type="text" value={tempAppName} onChange={(e) => setTempAppName(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-2xl px-5 py-4 dark:text-white font-bold" placeholder="অ্যাপের নাম" />
               <button onClick={saveBranding} disabled={isSavingBranding} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
                  {isSavingBranding ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
               </button>
            </div>
          </div>
        </section>
      )}

      {/* Broadcast Modal Toggle */}
      <button onClick={() => setShowReminderModal(true)} className="fixed bottom-24 right-8 bg-blue-600 text-white p-4 rounded-3xl shadow-2xl hover:bg-blue-700 transition-all z-40 active:scale-90">
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
      </button>

      {showReminderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleBroadcast} className="bg-white dark:bg-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-4 border dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4 dark:text-white">নোটিশ পাঠান</h3>
            <select className="w-full bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-2xl p-4 dark:text-white" value={reminderData.category} onChange={(e) => setReminderData({...reminderData, category: e.target.value as any})}>
              <option value="GENERAL">সাধারণ</option>
              <option value="URGENT">জরুরি</option>
              <option value="PROJECT_UPDATE">প্রকল্প আপডেট</option>
            </select>
            <input type="text" className="w-full bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-2xl p-4 dark:text-white" placeholder="শিরোনাম" value={reminderData.title} onChange={(e) => setReminderData({...reminderData, title: e.target.value})} required />
            <textarea className="w-full bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-2xl p-4 h-32 dark:text-white" placeholder="বার্তা লিখুন..." value={reminderData.message} onChange={(e) => setReminderData({...reminderData, message: e.target.value})} required />
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowReminderModal(false)} className="flex-1 px-4 py-3 rounded-2xl border dark:border-slate-700 dark:text-gray-300 font-bold">বাতিল</button>
              <button type="submit" className="flex-1 px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold">পাঠান</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
