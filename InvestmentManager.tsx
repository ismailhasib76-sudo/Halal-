
import React, { useState, useEffect } from 'react';
import { Investment, Project, User, InvestmentStatus, UserRole } from '../types';

interface InvestmentManagerProps {
  investments: Investment[];
  projects: Project[];
  user: User;
  onUpdate: (investments: Investment[]) => void;
  preSelectedProjectId?: string | null;
  onClearPreSelection?: () => void;
}

const InvestmentManager: React.FC<InvestmentManagerProps> = ({ 
  investments, 
  projects, 
  user, 
  onUpdate, 
  preSelectedProjectId,
  onClearPreSelection 
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newInv, setNewInv] = useState<Partial<Investment>>({
    projectId: projects[0]?.id || '',
    amount: 0,
    month: new Date().toISOString().slice(0, 7) // YYYY-MM
  });

  // Handle pre-selected project
  useEffect(() => {
    if (preSelectedProjectId) {
      setNewInv(prev => ({ ...prev, projectId: preSelectedProjectId }));
      setShowAdd(true);
      if (onClearPreSelection) onClearPreSelection();
    }
  }, [preSelectedProjectId, onClearPreSelection]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!newInv.projectId) newErrors.projectId = 'দয়া করে একটি প্রকল্প নির্বাচন করুন';
    if (!newInv.amount || newInv.amount <= 0) newErrors.amount = 'পরিমাণ অবশ্যই ০ থেকে বেশি হতে হবে';
    if (!newInv.month) newErrors.month = 'মাস নির্বাচন করা আবশ্যক';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const project = projects.find(p => p.id === newInv.projectId);
    const investment: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      projectId: newInv.projectId!,
      projectTitle: project?.title || 'Unknown',
      amount: Number(newInv.amount),
      date: new Date().toLocaleDateString(),
      screenshotUrl: 'https://picsum.photos/seed/receipt/600/800', // Mock upload
      status: InvestmentStatus.PENDING,
      month: newInv.month!
    };
    
    onUpdate([investment, ...investments]);
    setShowAdd(false);
    setShowSuccess(true);
    
    setNewInv({
      projectId: projects[0]?.id || '',
      amount: 0,
      month: new Date().toISOString().slice(0, 7)
    });
    setErrors({});
  };

  const filteredInvestments = user.role === UserRole.MEMBER 
    ? investments.filter(i => i.userId === user.id)
    : investments;

  return (
    <div className="space-y-6 relative">
      {/* Success Confirmation Toast */}
      {showSuccess && (
        <div className="fixed top-24 right-8 z-[60] animate-bounce">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-bold">বিনিয়োগ সফলভাবে জমা দেওয়া হয়েছে!</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">বিনিয়োগের ইতিহাস</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          নতুন বিনিয়োগ
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-4 border border-gray-100 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
               <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               নতুন বিনিয়োগ জমা দিন
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">প্রকল্প নির্বাচন করুন</label>
              <select 
                className={`w-full bg-white dark:bg-slate-900 border ${errors.projectId ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-gray-100`}
                value={newInv.projectId}
                onChange={(e) => {
                  setNewInv({...newInv, projectId: e.target.value});
                  if (errors.projectId) setErrors({...errors, projectId: ''});
                }}
                required
              >
                <option value="">নির্বাচন করুন...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              {errors.projectId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.projectId}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">পরিমাণ (৳)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400 font-bold">৳</span>
                <input 
                  type="number"
                  className={`w-full bg-white dark:bg-slate-900 border ${errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-gray-100`}
                  placeholder="৫০০০"
                  value={newInv.amount || ''}
                  onChange={(e) => {
                    setNewInv({...newInv, amount: Number(e.target.value)});
                    if (errors.amount) setErrors({...errors, amount: ''});
                  }}
                  required
                />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-1 font-medium">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">মাস</label>
              <input 
                type="month"
                className={`w-full bg-white dark:bg-slate-900 border ${errors.month ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-gray-100`}
                value={newInv.month}
                onChange={(e) => {
                  setNewInv({...newInv, month: e.target.value});
                  if (errors.month) setErrors({...errors, month: ''});
                }}
                required
              />
              {errors.month && <p className="text-red-500 text-xs mt-1 font-medium">{errors.month}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">পেমেন্ট স্ক্রিনশট</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-xl hover:border-emerald-500 transition-colors cursor-pointer group">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-emerald-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label className="relative cursor-pointer rounded-md font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
                      <span>ফাইল আপলোড করুন</span>
                      <input type="file" className="sr-only" accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF (সর্বোচ্চ ১০ এমবি)</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => { setShowAdd(false); setErrors({}); }} 
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-gray-300 font-bold transition-all"
              >
                বাতিল
              </button>
              <button 
                type="submit" 
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
              >
                জমা দিন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Proof Viewer Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border dark:border-slate-700 animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">পেমেন্টের প্রমাণ</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">বিনিয়োগ আইডি: {selectedInvestment.id}</p>
              </div>
              <button 
                onClick={() => setSelectedInvestment(null)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">সদস্যের নাম</p>
                    <p className="font-bold text-gray-800 dark:text-white">{selectedInvestment.userName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">পরিমাণ</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">৳{selectedInvestment.amount.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">প্রকল্প</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{selectedInvestment.projectTitle}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">তারিখ</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedInvestment.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">অবস্থা</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedInvestment.status === InvestmentStatus.APPROVED ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                      selectedInvestment.status === InvestmentStatus.PENDING ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {selectedInvestment.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">সংযুক্ত স্ক্রিনশট</p>
                <div className="border dark:border-slate-700 rounded-2xl overflow-hidden shadow-inner bg-gray-100 dark:bg-slate-900 group">
                  <img 
                    src={selectedInvestment.screenshotUrl} 
                    alt="Payment Proof" 
                    className="w-full h-auto max-h-80 object-contain hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                    onClick={() => window.open(selectedInvestment.screenshotUrl, '_blank')}
                  />
                  <div className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-center text-xs text-gray-500 border-t dark:border-slate-700">
                    ছবি বড় করে দেখতে ক্লিক করুন
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
               <button 
                onClick={() => setSelectedInvestment(null)}
                className="bg-gray-800 dark:bg-slate-700 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-700 dark:hover:bg-slate-600 transition-all shadow-lg active:scale-95"
               >
                 বন্ধ করুন
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Spreadsheet style table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 border-b dark:border-slate-700">তারিখ</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 border-b dark:border-slate-700">সদস্য</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 border-b dark:border-slate-700">প্রকল্প</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 border-b dark:border-slate-700">মাস</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 border-b dark:border-slate-700">পরিমাণ</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 border-b dark:border-slate-700">অবস্থা</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 border-b dark:border-slate-700">প্রমাণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{inv.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{inv.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{inv.projectTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{inv.month}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-white">৳{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inv.status === InvestmentStatus.APPROVED ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                      inv.status === InvestmentStatus.PENDING ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedInvestment(inv)}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 text-sm flex items-center gap-1 font-medium underline underline-offset-4"
                    >
                      দেখুন
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInvestments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-gray-400 italic">
                     <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        এখনো কোন বিনিয়োগ জমা দেওয়া হয়নি
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentManager;
