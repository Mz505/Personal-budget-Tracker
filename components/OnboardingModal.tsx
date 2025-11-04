
import React, { useState } from 'react';
import { SparklesIcon, PlusIcon, BanknotesIcon } from './Icons';

interface OnboardingModalProps {
    onComplete: (initialBudget: number) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [initialBudget, setInitialBudget] = useState('2500');

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = () => {
        onComplete(parseFloat(initialBudget) || 0);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <div className="text-center">
                            <SparklesIcon className="mx-auto h-12 w-12 text-indigo-500" />
                            <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome to Zenith Budget!</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">Let's get your finances organized in just a few moments.</p>
                        </div>
                        <div className="mt-8">
                            <button onClick={handleNext} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
                                Get Started
                            </button>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Set Your Monthly Budget</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">What's your total budget for the month? You can change this and add categories later.</p>
                        </div>
                        <div className="mt-8">
                            <label htmlFor="initial-budget" className="sr-only">Initial Budget</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-slate-500 dark:text-slate-400 text-xl">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="initial-budget"
                                    value={initialBudget}
                                    onChange={(e) => setInitialBudget(e.target.value)}
                                    className="block w-full text-center text-2xl font-bold pl-10 pr-4 py-3 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                        </div>
                         <div className="mt-8 grid grid-cols-2 gap-4">
                            <button onClick={handleBack} className="w-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-500">
                                Back
                            </button>
                            <button onClick={handleNext} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
                                Next
                            </button>
                        </div>
                    </>
                );
             case 3:
                return (
                    <>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">How It Works</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">Here are the basics to get you started.</p>
                        </div>
                        <div className="mt-8 space-y-6 text-left">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                                    <PlusIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">1. Add Transactions</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Use the floating plus button to add income or expenses as they happen.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                                    <BanknotesIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">2. Manage Your Budget</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Go to the 'Budget' page to create spending categories and set limits.</p>
                                </div>
                            </div>
                        </div>
                         <div className="mt-8 grid grid-cols-2 gap-4">
                            <button onClick={handleBack} className="w-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-500">
                                Back
                            </button>
                            <button onClick={handleNext} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
                                Next
                            </button>
                        </div>
                    </>
                );
             case 4:
                return (
                     <>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">You're All Set!</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">Ready to take control of your finances? Start by adding your first transaction.</p>
                        </div>
                        <div className="mt-8">
                            <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
                                Add First Transaction
                            </button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-8">
                {renderStep()}
            </div>
        </div>
    );
};

export default OnboardingModal;
