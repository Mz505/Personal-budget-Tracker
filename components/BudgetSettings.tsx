import React from 'react';
import { Budget, Category, RolloverOption } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface BudgetSettingsProps {
    budget: Budget;
    setBudget: React.Dispatch<React.SetStateAction<Budget>>;
}

const COLORS = [
    '#ef4444', '#3b82f6', '#eab308', '#a855f7', '#22c55e',
    '#ec4899', '#6366f1', '#14b8a6', '#f97316'
];


const BudgetSettings: React.FC<BudgetSettingsProps> = ({ budget, setBudget }) => {
    
    const handleTotalBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBudget(prev => ({ ...prev, total: parseFloat(e.target.value) || 0 }));
    };

    const handleCategoryChange = (id: string, field: keyof Category, value: string | number) => {
        setBudget(prev => ({
            ...prev,
            categories: prev.categories.map(cat => cat.id === id ? { ...cat, [field]: value } : cat)
        }));
    };

    const handleRolloverChange = (option: RolloverOption) => {
        setBudget(prev => ({ ...prev, rolloverOption: option }));
    };
    
    const handleAddCategory = () => {
        const newCategory: Category = {
            id: crypto.randomUUID(),
            name: 'New Category',
            budget: 0,
            color: COLORS[budget.categories.length % COLORS.length]
        };
        setBudget(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
    };

    const handleRemoveCategory = (id: string) => {
        setBudget(prev => ({ ...prev, categories: prev.categories.filter(cat => cat.id !== id) }));
    };

    const RadioOptionCard: React.FC<{
        id: string;
        value: RolloverOption;
        title: string;
        description: string;
    }> = ({ id, value, title, description }) => (
        <label
            htmlFor={id}
            className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${budget.rolloverOption === value ? 'bg-indigo-50 border-indigo-500 dark:bg-slate-700/50' : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
        >
            <div className="flex items-center">
                <input
                    id={id}
                    name="rollover-option"
                    type="radio"
                    checked={budget.rolloverOption === value}
                    onChange={() => handleRolloverChange(value)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:checked:bg-indigo-500"
                />
                <span className="ml-3 text-sm font-medium text-slate-800 dark:text-slate-200">{title}</span>
            </div>
            <p className="mt-1 ml-7 text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </label>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Budget Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left Column: General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Total Monthly Budget</h3>
                         <div>
                            <label htmlFor="total-budget" className="sr-only">Total Monthly Budget</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-slate-500 dark:text-slate-400 sm:text-sm">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="total-budget"
                                    value={budget.total}
                                    onChange={handleTotalBudgetChange}
                                    className="block w-full pl-7 pr-4 py-2 text-base border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Monthly Rollover</h3>
                        <fieldset className="space-y-4">
                            <legend className="sr-only">Budget rollover options</legend>
                            <RadioOptionCard 
                                id="auto-reset"
                                value="auto-reset"
                                title="Automatic Reset"
                                description="Your budget and spending totals will reset to zero on the first day of each month."
                            />
                             <RadioOptionCard 
                                id="manual-confirm"
                                value="manual-confirm"
                                title="Manual Confirmation"
                                description="You will be prompted to confirm before your budget rolls over to the next month."
                            />
                        </fieldset>
                    </div>
                </div>

                {/* Right Column: Spending Categories */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-full">
                        <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-slate-200">Spending Categories</h3>
                        
                        <div className="space-y-4">
                            {budget.categories.map(cat => (
                                <div key={cat.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor={`cat-name-${cat.id}`} className="text-xs font-medium text-slate-500 dark:text-slate-400">Category Name</label>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="w-4 h-4 rounded-full flex-shrink-0" style={{backgroundColor: cat.color}} aria-hidden="true"></span>
                                                <input
                                                    type="text"
                                                    id={`cat-name-${cat.id}`}
                                                    value={cat.name}
                                                    onChange={(e) => handleCategoryChange(cat.id, 'name', e.target.value)}
                                                    className="block w-full py-1.5 text-sm border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="col-span-2">
                                                <label htmlFor={`cat-budget-${cat.id}`} className="text-xs font-medium text-slate-500 dark:text-slate-400">Budget</label>
                                                <div className="relative mt-1">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-slate-500 dark:text-slate-400 text-sm">$</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        id={`cat-budget-${cat.id}`}
                                                        value={cat.budget}
                                                        onChange={(e) => handleCategoryChange(cat.id, 'budget', parseFloat(e.target.value) || 0)}
                                                        className="block w-full pl-7 pr-2 py-1.5 text-sm border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-right self-end">
                                                <button
                                                    onClick={() => handleRemoveCategory(cat.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800"
                                                    aria-label={`Remove ${cat.name} category`}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddCategory}
                            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Add New Category
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetSettings;