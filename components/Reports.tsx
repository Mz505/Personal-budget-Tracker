
import React, { useState, useMemo } from 'react';
import { Transaction, Budget, TransactionType } from '../types';
import BarChart from './BarChart';
import { ArrowDownTrayIcon } from './Icons';
// Fix: Use autoTable as a function, which is more robust with TypeScript than relying on module augmentation which was causing type errors.
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsProps {
    transactions: Transaction[];
    budget: Budget;
}

const Reports: React.FC<ReportsProps> = ({ transactions, budget }) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
    const [endDate, setEndDate] = useState<string>(lastDayOfMonth);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

    const { filteredTransactions, monthlySummary, categorySpending } = useMemo(() => {
        const filtered = transactions.filter(t => {
            let dateMatch = true;
            if (startDate) dateMatch = dateMatch && t.date >= startDate;
            if (endDate) dateMatch = dateMatch && t.date <= endDate;
            return dateMatch;
        });

        // Monthly Summary
        const monthlyData: { [key: string]: { income: number; expense: number } } = {};
        filtered.forEach(t => {
            const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expense: 0 };
            }
            if (t.type === TransactionType.INCOME) {
                monthlyData[month].income += t.amount;
            } else {
                monthlyData[month].expense += t.amount;
            }
        });

        const monthlySummary = Object.entries(monthlyData).map(([name, values]) => ({ name, ...values }));

        // Category Spending
        const totalExpenses = filtered
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);

        const categoryData: { [key: string]: number } = {};
        filtered
            .filter(t => t.type === TransactionType.EXPENSE)
            .forEach(t => {
                if (!categoryData[t.category]) {
                    categoryData[t.category] = 0;
                }
                categoryData[t.category] += t.amount;
            });
            
        const categorySpending = Object.entries(categoryData)
            .map(([name, spent]) => ({
                name,
                spent,
                percentage: totalExpenses > 0 ? (spent / totalExpenses) * 100 : 0,
            }))
            .sort((a, b) => b.spent - a.spent);

        return { filteredTransactions: filtered, monthlySummary, categorySpending };
    }, [transactions, startDate, endDate]);

    const handleExportCSV = () => {
        const headers = ["Date", "Type", "Description", "Category", "Amount"];
        const csvContent = [
            headers.join(','),
            ...filteredTransactions.map(t => [
                t.date,
                t.type,
                `"${t.description.replace(/"/g, '""')}"`,
                t.category,
                t.amount
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `transactions_${startDate}_to_${endDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsExportMenuOpen(false);
    };

    const handleExportPDF = () => {
        // Fix: Changed to use autoTable as a function on the jsPDF instance to resolve typing errors.
        const doc = new jsPDF();
        doc.text(`Transaction Report: ${startDate} to ${endDate}`, 14, 16);
        autoTable(doc, {
            head: [['Date', 'Type', 'Description', 'Category', 'Amount']],
            body: filteredTransactions.map(t => [
                t.date,
                t.type,
                t.description,
                t.category,
                `${t.type === TransactionType.INCOME ? '+' : '-'} ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.amount)}`
            ]),
            startY: 20,
        });
        doc.save(`transactions_${startDate}_to_${endDate}.pdf`);
        setIsExportMenuOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Reports & Analysis</h2>
                <div className="relative">
                    <button onClick={() => setIsExportMenuOpen(prev => !prev)} className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        Export
                    </button>
                    {isExportMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                                <button onClick={handleExportCSV} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">Export as CSV</button>
                                <button onClick={handleExportPDF} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">Export as PDF</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Filter by Date Range</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                        <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full input-style"/>
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
                        <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full input-style"/>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Monthly Summary</h3>
                {monthlySummary.length > 0 ? (
                    <div className="h-72">
                        <BarChart data={monthlySummary} />
                    </div>
                ) : <p className="text-slate-500 dark:text-slate-400 text-center py-10">No data available for the selected period.</p>}
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Spending by Category</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Category</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Amount Spent</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">% of Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {categorySpending.map(cat => (
                                <tr key={cat.name}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{cat.name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-500 dark:text-slate-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cat.spent)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-500 dark:text-slate-400">{cat.percentage.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {categorySpending.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-10">No expenses recorded for this period.</p>}
            </div>
            <style>
              {`
              .input-style {
                padding: 0.5rem 0.75rem;
                border-radius: 0.375rem;
                border: 1px solid #d1d5db; /* slate-300 */
                width: 100%;
                background-color: white;
                color: #111827; /* slate-900 */
              }
              .dark .input-style {
                border-color: #4b5563; /* slate-600 */
                background-color: #374151; /* slate-700 */
                color: #f3f4f6; /* slate-200 */
              }
              `}
            </style>
        </div>
    );
}

export default Reports;