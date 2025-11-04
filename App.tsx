
import React, { useState, useEffect, useCallback } from 'react';
import { Budget, Transaction, Category, Theme, NotificationFrequency, TransactionType } from './types';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import BudgetSettings from './components/BudgetSettings';
import Settings from './components/Settings';
import AddTransactionModal from './components/AddTransactionModal';
import ConfirmationModal from './components/ConfirmationModal';
import Chatbot from './components/Chatbot';
import Reports from './components/Reports';
import OnboardingModal from './components/OnboardingModal';
import { PlusIcon } from './components/Icons';

const DEFAULT_CATEGORIES: Category[] = [
    { id: 'cat1', name: 'Food & Dining', budget: 400, color: '#ef4444' }, // red-500
    { id: 'cat2', name: 'Transportation', budget: 200, color: '#3b82f6' }, // blue-500
    { id: 'cat3', name: 'Housing', budget: 1200, color: '#eab308' }, // yellow-500
    { id: 'cat4', name: 'Entertainment', budget: 150, color: '#a855f7' }, // purple-500
    { id: 'cat5', name: 'Utilities', budget: 180, color: '#22c55e' }, // green-500
    { id: 'cat6', name: 'Other', budget: 100, color: '#6b7280' }, // gray-500
];

const App: React.FC = () => {
    const [view, setView] = useState<'dashboard' | 'transactions' | 'reports' | 'budget' | 'settings'>('dashboard');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budget, setBudget] = useState<Budget>({ 
        total: 2500, 
        categories: DEFAULT_CATEGORIES,
        rolloverOption: 'auto-reset' 
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>('system');
    const [notificationFrequency, setNotificationFrequency] = useState<NotificationFrequency>('off');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load data from localStorage on initial render
    useEffect(() => {
        try {
            const hasOnboarded = localStorage.getItem('zenith-budget-onboarded');
            if (!hasOnboarded) {
                setShowOnboarding(true);
            } else {
                const storedTransactions = localStorage.getItem('budget-tracker-transactions');
                const storedBudget = localStorage.getItem('budget-tracker-budget');
                if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
                if (storedBudget) {
                    const parsedBudget = JSON.parse(storedBudget);
                    if (!parsedBudget.rolloverOption) parsedBudget.rolloverOption = 'auto-reset';
                    setBudget(parsedBudget);
                }
            }

            const storedTheme = localStorage.getItem('budget-tracker-theme');
            if (storedTheme) setTheme(storedTheme as Theme);

            const storedFrequency = localStorage.getItem('zenith-notification-frequency');
            if (storedFrequency) setNotificationFrequency(storedFrequency as NotificationFrequency);

        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Persist data to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('budget-tracker-transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('budget-tracker-budget', JSON.stringify(budget));
    }, [budget]);

    useEffect(() => {
        localStorage.setItem('zenith-notification-frequency', notificationFrequency);
    }, [notificationFrequency]);


    // Theme Management Effect
    useEffect(() => {
        localStorage.setItem('budget-tracker-theme', theme);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const applyTheme = () => {
            const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
            document.documentElement.classList.toggle('dark', isDark);
        };

        applyTheme(); // Apply theme immediately

        mediaQuery.addEventListener('change', applyTheme);
        return () => {
            mediaQuery.removeEventListener('change', applyTheme);
        };
    }, [theme]);

    // Notification Effect
    useEffect(() => {
        if (notificationFrequency === 'off' || Notification.permission !== 'granted') {
            return;
        }

        const now = Date.now();
        const lastSent = parseInt(localStorage.getItem('zenith-last-notification') || '0', 10);
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;

        let shouldSend = false;
        let periodStart = 0;
        let periodText = '';

        if (notificationFrequency === 'daily' && now - lastSent > oneDay) {
            shouldSend = true;
            periodStart = now - oneDay;
            periodText = 'in the last 24 hours';
        } else if (notificationFrequency === 'weekly' && now - lastSent > oneWeek) {
            shouldSend = true;
            periodStart = now - oneWeek;
            periodText = 'in the last week';
        }

        if (shouldSend) {
            const periodTransactions = transactions.filter(t => {
                const tDate = new Date(t.date).getTime();
                return t.type === TransactionType.EXPENSE && tDate >= periodStart && tDate <= now;
            });

            const totalSpent = periodTransactions.reduce((sum, t) => sum + t.amount, 0);

            if (totalSpent > 0) {
                const title = 'Zenith Spending Summary';
                const body = `You've spent ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalSpent)} ${periodText}.`;
                
                new Notification(title, { body });

                localStorage.setItem('zenith-last-notification', now.toString());
            }
        }
    }, [transactions, notificationFrequency]);


    const handleAddTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [{ ...transaction, id: crypto.randomUUID() }, ...prev]);
    }, []);

    const handleUpdateTransaction = useCallback((updatedTransaction: Transaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    }, []);

    const handleDeleteRequest = useCallback((id: string) => {
        setTransactionToDelete(id);
    }, []);
    
    const handleConfirmDelete = useCallback(() => {
        if (transactionToDelete) {
            setTransactions(prev => prev.filter(t => t.id !== transactionToDelete));
            setTransactionToDelete(null);
        }
    }, [transactionToDelete]);

    const openAddModal = useCallback(() => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    }, []);

    const handleSaveTransaction = useCallback((transaction: Transaction | Omit<Transaction, 'id'>) => {
        if ('id' in transaction) {
            handleUpdateTransaction(transaction);
        } else {
            handleAddTransaction(transaction);
        }
        setIsModalOpen(false);
    }, [handleAddTransaction, handleUpdateTransaction]);

    const handleBackup = useCallback(() => {
        const dataToBackup = {
            transactions,
            budget,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(dataToBackup, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const date = new Date().toISOString().split('T')[0];
        link.download = `zenith-budget-backup-${date}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    }, [transactions, budget]);

    const handleRestore = useCallback((fileContent: string) => {
        if (!window.confirm("Are you sure you want to restore? This will overwrite your current data.")) {
            return;
        }
        try {
            const restoredData = JSON.parse(fileContent);
            if (restoredData.transactions && restoredData.budget) {
                setTransactions(restoredData.transactions);
                setBudget(restoredData.budget);
                alert("Data restored successfully!");
                setView('dashboard');
            } else {
                throw new Error("Invalid backup file format.");
            }
        } catch (error) {
            console.error("Failed to restore data:", error);
            alert("Failed to restore data. The file may be corrupt or in the wrong format.");
        }
    }, []);

    const handleOnboardingComplete = useCallback((initialBudget: number) => {
        setBudget(prev => ({ ...prev, total: initialBudget }));
        localStorage.setItem('zenith-budget-onboarded', 'true');
        setShowOnboarding(false);
        openAddModal();
    }, [openAddModal]);
    
    const renderView = () => {
        switch(view) {
            case 'transactions':
                return <TransactionsList transactions={transactions} onEdit={openEditModal} onDeleteRequest={handleDeleteRequest} categories={budget.categories} />;
            case 'reports':
                return <Reports transactions={transactions} budget={budget} />;
            case 'budget':
                return <BudgetSettings budget={budget} setBudget={setBudget} />;
            case 'settings':
                return <Settings 
                    currentTheme={theme} 
                    setTheme={setTheme} 
                    onBackup={handleBackup} 
                    onRestore={handleRestore}
                    notificationFrequency={notificationFrequency}
                    setNotificationFrequency={setNotificationFrequency}
                />;
            case 'dashboard':
            default:
                return <Dashboard transactions={transactions} budget={budget} onEditTransaction={openEditModal} />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
                {/* Simple spinner */}
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 flex">
            <Sidebar currentView={view} setView={setView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col md:ml-64">
                <MobileHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} currentView={view} />
                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    {renderView()}
                </main>
            </div>
            
            <button
                onClick={openAddModal}
                className="fixed bottom-6 right-6 z-20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-indigo-500"
                aria-label="Add new transaction"
            >
                <PlusIcon className="h-8 w-8" />
            </button>

            <Chatbot />

            {isModalOpen && (
                <AddTransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTransaction}
                    transaction={editingTransaction}
                    categories={budget.categories}
                />
            )}

            <ConfirmationModal
                isOpen={!!transactionToDelete}
                onClose={() => setTransactionToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Transaction"
            >
                Are you sure you want to delete this transaction? This action cannot be undone.
            </ConfirmationModal>

            {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
        </div>
    );
};

export default App;
