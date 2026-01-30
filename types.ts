
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUB_ADMIN = 'SUB_ADMIN',
  MEMBER = 'MEMBER'
}

export enum InvestmentStatus {
  PENDING = 'অপেক্ষমান',
  APPROVED = 'অনুমোদিত',
  REJECTED = 'প্রত্যাখ্যাত'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  duration: string;
  progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  totalProfit: number;
  islamicWorkDeductionPercent: number; // e.g., 10%
}

export interface Pool {
  id: string;
  name: string;
  description: string;
  totalGoal: number;
  collectedAmount: number;
  contributors: number;
  category: string;
  isActive: boolean;
}

export interface Investment {
  id: string;
  userId: string;
  userName: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  date: string;
  screenshotUrl: string;
  status: InvestmentStatus;
  month: string;
}

export interface Reminder {
  id: string;
  title: string;
  message: string;
  date: string;
  senderName: string;
  category: 'GENERAL' | 'URGENT' | 'PROJECT_UPDATE';
  targetRole?: UserRole;
}
