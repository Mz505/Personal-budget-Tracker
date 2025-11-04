import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Category } from '../types';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Transaction | Omit<Transaction, 'id'>) => void;
    transaction: Transaction | null;
    categories: Category[];
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave, transaction, categories }) => {
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (transaction) {
            setType(transaction.type);
            setAmount(String(transaction.amount));
            setCategory(transaction.category);
            setDate(new Date(transaction.date).toISOString().split('T')[0]);
            setDescription(transaction.description);
        } else {
            // Reset form for new transaction
            setType(TransactionType.EXPENSE);
            setAmount('');
            setCategory(categories.length > 0 ? categories[0].name : '');
            setDate(new Date().toISOString().split('T')[0]);
            setDescription('');
        }
    }, [transaction, isOpen, categories]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const transactionData = {
            type,
            amount: parseFloat(amount),
            category: type === TransactionType.INCOME ? 'Income' : category,
            date,
            description,
        };

        if (transaction) {
            onSave({ ...transactionData, id: transaction.id });
        } else {
            onSave(transactionData);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">{transaction ? 'Edit' : 'Add'} Transaction</h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-full py-2 rounded-md font-semibold transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>Expense</button>
                            <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`w-full py-2 rounded-md font-semibold transition-colors ${type === TransactionType.INCOME ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>Income</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required step="0.01" className="mt-1 block w-full input-style" />
                            </div>
                            
                            {type === TransactionType.EXPENSE && (
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full input-style">
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full input-style" />
                            </div>
                            
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description (Optional)</label>
                                <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full input-style" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{transaction ? 'Save Changes' : 'Add Transaction'}</button>
                    </div>
                </form>
            </div>
            {/* Fix: The `jsx` prop on the <style> tag is not a valid attribute in React, causing a TypeScript error. Removed the prop and merged the fragmented styles into a single, valid <style> block for clarity and correctness. */}
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
};

export default AddTransactionModal;
