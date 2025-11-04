
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { PencilIcon, TrashIcon, XMarkIcon } from './Icons';

interface TransactionsListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDeleteRequest: (id: string) => void;
    categories: Category[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, onEdit, onDeleteRequest, categories }) => {
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const categoryMatch = filterCategory === 'all' || t.category === filterCategory;
            const typeMatch = filterType === 'all' || t.type === filterType;
            
            let dateMatch = true;
            if (startDate) {
                // Adjust for timezone differences by comparing dates as UTC
                const tDate = new Date(t.date);
                const start = new Date(startDate);
                dateMatch = dateMatch && tDate.getTime() >= start.getTime();
            }
            if (endDate) {
                const tDate = new Date(t.date);
                const end = new Date(endDate);
                dateMatch = dateMatch && tDate.getTime() <= end.getTime();
            }

            return categoryMatch && typeMatch && dateMatch;
        });
    }, [transactions, filterCategory, filterType, startDate, endDate]);

    const handleClearFilters = () => {
        setFilterCategory('all');
        setFilterType('all');
        setStartDate('');
        setEndDate('');
    };

    const isAnyFilterActive = filterCategory !== 'all' || filterType !== 'all' || startDate !== '' || endDate !== '';

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">All Transactions</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                    <label htmlFor="filter-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                    <select
                        id="filter-type"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                    >
                        <option value="all">All Types</option>
                        <option value={TransactionType.INCOME}>Income</option>
                        <option value={TransactionType.EXPENSE}>Expense</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                    <select
                        id="filter-category"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                        <option value="Income">Income</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                    />
                </div>
                <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                    />
                </div>
            </div>

            {isAnyFilterActive && (
                <div className="flex justify-start mb-4">
                    <button
                        onClick={handleClearFilters}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors"
                    >
                        <XMarkIcon className="w-3 h-3" />
                        Clear Filters
                    </button>
                </div>
            )}


            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredTransactions.map(t => (
                            <tr key={t.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{t.description || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{t.category}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.type === TransactionType.INCOME ? '+' : '-'}
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEdit(t)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-4">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => onDeleteRequest(t.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
                {filteredTransactions.map(t => (
                    <div key={t.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 shadow">
                        <div className="flex justify-between items-start">
                           <div>
                             <p className="font-semibold text-slate-800 dark:text-slate-200">{t.description || t.category}</p>
                             <p className="text-sm text-slate-500 dark:text-slate-400">{t.category}</p>
                             <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(t.date).toLocaleDateString()}</p>
                           </div>
                           <p className={`text-lg font-bold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                             {t.type === TransactionType.INCOME ? '+' : '-'}
                             {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.amount)}
                           </p>
                        </div>
                        <div className="flex justify-end items-center mt-4 space-x-4">
                             <button onClick={() => onEdit(t)} className="flex items-center space-x-1 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                <PencilIcon className="h-4 w-4" />
                                <span>Edit</span>
                             </button>
                             <button onClick={() => onDeleteRequest(t.id)} className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400 font-medium">
                                <TrashIcon className="h-4 w-4" />
                                <span>Delete</span>
                             </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTransactions.length === 0 && <p className="text-center py-8 text-slate-500 dark:text-slate-400">No transactions found.</p>}
        </div>
    );
};

export default TransactionsList;
