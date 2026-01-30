
import React from 'react';
import { Reminder, User } from '../types';

interface GroupMessagesProps {
  reminders: Reminder[];
  user: User;
}

const GroupMessages: React.FC<GroupMessagesProps> = ({ reminders }) => {
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'URGENT':
        return {
          bg: 'bg-red-50 dark:bg-red-900/10',
          border: 'border-red-500',
          text: 'text-red-700 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          label: 'জরুরি'
        };
      case 'PROJECT_UPDATE':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/10',
          border: 'border-emerald-500',
          text: 'text-emerald-700 dark:text-emerald-400',
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
          label: 'প্রকল্প আপডেট'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/10',
          border: 'border-blue-500',
          text: 'text-blue-700 dark:text-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          label: 'সাধারণ'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2 px-2">
         <div className="bg-blue-600 w-2 h-8 rounded-full"></div>
         <h2 className="text-xl font-bold text-gray-800 dark:text-white">বোর্ড অব ডিরেক্টরস থেকে নোটিশ</h2>
      </div>

      {reminders.length > 0 ? reminders.slice().reverse().map(r => {
        const styles = getCategoryStyles(r.category);
        return (
          <div 
            key={r.id} 
            className={`${styles.bg} p-6 rounded-3xl shadow-sm border-l-8 ${styles.border} flex items-start gap-5 transition-all hover:shadow-md group`}
          >
            <div className={`${styles.iconBg} ${styles.text} p-4 rounded-2xl`}>
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
               </svg>
            </div>
            <div className="flex-1">
               <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md mb-1 inline-block ${styles.bg} ${styles.text} border border-current opacity-70`}>
                      {styles.label}
                    </span>
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:translate-x-1 transition-transform">{r.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-400 block">{r.date}</span>
                    <span className="text-[10px] text-gray-500">প্রেরক: <span className="font-bold text-emerald-600">{r.senderName}</span></span>
                  </div>
               </div>
               <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">{r.message}</p>
               
               <div className="mt-4 flex justify-end">
                  <button className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                    পঠিত হিসেবে চিহ্নিত করুন
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </button>
               </div>
            </div>
          </div>
        );
      }) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-700 text-gray-400 transition-all flex flex-col items-center">
           <svg className="w-20 h-20 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
           <p className="text-xl font-bold opacity-30">এখনো কোন মেসেজ নেই</p>
           <p className="text-sm opacity-20 mt-1 uppercase tracking-widest">খালি ইনবক্স</p>
        </div>
      )}
    </div>
  );
};

export default GroupMessages;
