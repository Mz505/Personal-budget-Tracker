
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO string format
  description: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  color: string; // Hex color code
}

export type RolloverOption = 'auto-reset' | 'manual-confirm';

export interface Budget {
  total: number;
  categories: Category[];
  rolloverOption: RolloverOption;
}

export type Theme = 'light' | 'dark' | 'system';

export type NotificationFrequency = 'off' | 'daily' | 'weekly';
