
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { Project, Investment, User, Reminder } from './types';
import { COLORS } from './constants';

interface DashboardProps {
  projects: Project[];
  investments: Investment[];
  reminders: Reminder[];
  user: User;
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, investments, reminders, darkMode }) => {
  const totalInvestment = useMemo(() => investments.reduce((sum, inv) => sum + inv.amount, 0), [investments]);
  const totalProfit = useMemo(() => projects.reduce((sum, p) => sum + p.totalProfit, 0), [projects]);
  const islamicFund = useMemo(() => projects.reduce((sum, p) => sum + (p.totalProfit * (p.islamicWorkDeductionPercent / 100)), 0), [projects]);
  const netProfit = totalProfit - islamicFund;

  const chartData = useMemo(() => {
    return projects.map(p => ({
      name: p.title.split(':')[0],
      বিনিয়োগ: p.currentAmount,
      লভ্যাংশ: p.totalProfit,
      ইসলামিক_ফান্ড: p.totalProfit * (p.islamicWorkDeductionPercent / 100)
    }));
  }, [projects]);

  const stats = [
    { label: 'মোট বিনিয়োগ', value: `৳${totalInvestment.toLocaleString()}`, color: 'bg-blue-500', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'মোট লভ্যাংশ', value: `৳${totalProfit.toLocaleString()}`, color: 'bg-emerald-500', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { label: 'ইসলামিক ফান্ড', value: `৳${islamicFund.toLocaleString()}`, color: 'bg-violet-500', icon: 'M12 21l-8.228-9.96a5 5 0 117.758-6.306 4.992 4.992 0 011.026.155 4.992 4.992 0 011.026-.155 5 5 0 117.758 6.306L12 21z' },
    { label: 'সদস্য লভ্যাংশ', value: `৳${netProfit.toLocaleString()}`, color: 'bg-amber-500', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  const tickColor = darkMode ? '#94a3b8' : '#9ca3af';
  const gridColor = darkMode ? '#1e293b' : '#f3f4f6';

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4 transition-all">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-100">বিনিয়োগ ও লভ্যাংশ বিশ্লেষণ</h3>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1 dark:text-gray-400"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> লভ্যাংশ</span>
              <span className="flex items-center gap-1 dark:text-gray-400"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> বিনিয়োগ</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                  itemStyle={{ color: darkMode ? '#cbd5e1' : '#374151' }}
                />
                <Area type="monotone" dataKey="বিনিয়োগ" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInvest)" strokeWidth={2} />
                <Area type="monotone" dataKey="লভ্যাংশ" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reminders / Feed */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col transition-all">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">গুরুত্বপূর্ণ আপডেট</h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-80 pr-2 custom-scrollbar">
            {reminders.length > 0 ? reminders.slice(0, 5).map(r => (
              <div key={r.id} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border-l-4 border-emerald-500">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">{r.title}</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">{r.message}</p>
                <p className="text-[10px] text-emerald-500 dark:text-emerald-500/70 mt-2">{r.date}</p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600 py-10">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                <p>কোন নতুন আপডেট নেই</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Distribution Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6">ইসলামিক ফান্ড বন্টন হার</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: tickColor}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: tickColor}} />
              <Tooltip 
                cursor={{fill: darkMode ? '#334155' : '#f9fafb'}} 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
              <Legend iconType="circle" />
              <Bar dataKey="লভ্যাংশ" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ইসলামিক_ফান্ড" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
