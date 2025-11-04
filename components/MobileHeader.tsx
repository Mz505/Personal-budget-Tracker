
import React from 'react';
import { Bars3Icon } from './Icons';

interface MobileHeaderProps {
    toggleSidebar: () => void;
    currentView: 'dashboard' | 'transactions' | 'reports' | 'budget' | 'settings';
}

const viewTitles = {
    dashboard: 'Dashboard',
    transactions: 'All Transactions',
    reports: 'Reports & Analysis',
    budget: 'Budget Categories',
    settings: 'App Settings'
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleSidebar, currentView }) => {
    return (
        <header className="md:hidden bg-slate-100 dark:bg-slate-900 sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
            <button
                onClick={toggleSidebar}
                className="text-slate-600 dark:text-slate-300"
                aria-label="Open sidebar"
            >
                <Bars3Icon className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{viewTitles[currentView]}</h2>
            <div className="w-6"></div> {/* Spacer */}
        </header>
    );
};

export default MobileHeader;
