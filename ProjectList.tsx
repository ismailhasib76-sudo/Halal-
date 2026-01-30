
import React from 'react';
import { Project, User, UserRole } from './types';

interface ProjectListProps {
  projects: Project[];
  user: User;
  onUpdate: (projects: Project[]) => void;
  onInvest?: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, user, onInvest }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((p) => (
        <div key={p.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col group hover:shadow-xl dark:hover:shadow-slate-900 transition-all hover:-translate-y-1">
          <div className="h-40 bg-emerald-600 relative overflow-hidden">
            <img src={`https://picsum.photos/seed/${p.id}/600/400`} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30 uppercase tracking-widest">
              {p.status}
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="text-xs text-white/80">{p.startDate} থেকে শুরু</p>
            </div>
          </div>
          
          <div className="p-6 space-y-4 flex-1 flex flex-col">
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{p.description}</p>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">তহবিল অগ্রগতি</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">মোট লক্ষ্যমাত্রা</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">৳{p.targetAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">বর্তমান সংগ্রহ</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">৳{p.currentAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 dark:border-slate-700 mt-auto flex flex-col gap-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/></svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 italic">ইসলামিক ফান্ড: {p.islamicWorkDeductionPercent}%</span>
                  </div>
                  <button className="text-sm text-emerald-600 dark:text-emerald-400 font-bold hover:underline">বিস্তারিত</button>
               </div>
               
               {onInvest && p.status === 'ACTIVE' && (
                 <button 
                  onClick={() => onInvest(p.id)}
                  className="w-full bg-emerald-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   বিনিয়োগ করুন
                 </button>
               )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
