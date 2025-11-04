
import React, { useMemo } from 'react';
import { Transaction, Budget, TransactionType, Category } from '../types';
import { ArrowDownIcon, ArrowUpIcon, PencilIcon } from './Icons';
import DonutChart from './DonutChart';

interface DashboardProps {
    transactions: Transaction[];
    budget: Budget;
    onEditTransaction: (transaction: Transaction) => void;
}

const StatCard: React.FC<{ title: string; amount: number; colorClass: string }> = ({ title, amount, colorClass }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}</p>
    </div>
);

const BudgetProgressBar: React.FC<{ category: Category & { spent: number } }> = ({ category }) => {
    const { name, spent, budget } = category;
    const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
    
    let barColor = 'bg-green-500';
    if (percentage >= 90) {
        barColor = 'bg-red-500';
    } else if (percentage >= 75) {
        barColor = 'bg-yellow-500';
    }

    return (
        <div>
            <div className="flex justify-between mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                <span>{name}</span>
                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(spent)} / {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget)}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ transactions, budget, onEditTransaction }) => {
    const { totalIncome, totalExpenses, remainingBudget, categorySpending, chartData } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        });

        const totalIncome = monthlyTransactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = monthlyTransactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
            
        const categorySpending = budget.categories.reduce((acc, category) => {
            acc[category.id] = {
                ...category,
                spent: monthlyTransactions
                    .filter(t => t.type === TransactionType.EXPENSE && t.category === category.name)
                    .reduce((sum, t) => sum + t.amount, 0)
            };
            return acc;
        }, {} as Record<string, Category & { spent: number }>);
        
        const chartData = Object.values(categorySpending)
            .filter(c => c.spent > 0)
            .map(c => ({ name: c.name, value: c.spent, color: c.color }));

        return {
            totalIncome,
            totalExpenses,
            remainingBudget: budget.total - totalExpenses,
            categorySpending,
            chartData,
        };
    }, [transactions, budget]);

    const recentTransactions = transactions.slice(0, 5);
    const sortedCategories = Object.values(categorySpending).sort((a, b) => b.budget - a.budget);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Remaining Budget" amount={remainingBudget} colorClass={remainingBudget >= 0 ? 'text-green-500' : 'text-red-500'} />
                <StatCard title="Monthly Income" amount={totalIncome} colorClass="text-green-500" />
                <StatCard title="Monthly Expenses" amount={totalExpenses} colorClass="text-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Category Budgets</h3>
                    <div className="space-y-4">
                        {sortedCategories.length > 0 ? sortedCategories.map(cat => (
                           <BudgetProgressBar key={cat.id} category={cat} />
                        )) : <p className="text-slate-500 dark:text-slate-400">No categories set up.</p>}
                    </div>
                </div>
                 <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Spending Breakdown</h3>
                     {chartData.length > 0 ? (
                        <DonutChart data={chartData} />
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[200px]">
                           <p className="text-slate-500 dark:text-slate-400">No expenses this month.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                 <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Recent Transactions</h3>
                 <ul className="space-y-4">
                    {recentTransactions.length > 0 ? recentTransactions.map(t => (
                        <li key={t.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${t.type === TransactionType.INCOME ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                                    {t.type === TransactionType.INCOME ? <ArrowUpIcon className="h-5 w-5 text-green-500" /> : <ArrowDownIcon className="h-5 w-5 text-red-500" />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-slate-200">{t.description || t.category}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                 <p className={`font-semibold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.type === TransactionType.INCOME ? '+' : '-'}
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.amount)}
                                </p>
                                <button onClick={() => onEditTransaction(t)} className="text-slate-400 hover:text-indigo-500 text-xs">
                                  <PencilIcon className="h-4 w-4 inline"/> Edit
                                </button>
                            </div>
                        </li>
                    )) : <p className="text-slate-500 dark:text-slate-400">No recent transactions.</p>}
                 </ul>
            </div>
        </div>
    );
};

export default Dashboard;
