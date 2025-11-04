
import React from 'react';
import { ChartPieIcon, ListBulletIcon, Cog6ToothIcon, DocumentChartBarIcon, XMarkIcon, BanknotesIcon } from './Icons';

type View = 'dashboard' | 'transactions' | 'reports' | 'budget' | 'settings';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    const activeClasses = 'bg-indigo-600 text-white';
    const inactiveClasses = 'text-slate-300 hover:bg-slate-700 hover:text-white';
    
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
    const handleNavClick = (view: View) => {
        setView(view);
        setIsOpen(false); // Close sidebar on mobile after navigation
    };

    const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <ChartPieIcon className="h-6 w-6" /> },
        { id: 'transactions', label: 'Transactions', icon: <ListBulletIcon className="h-6 w-6" /> },
        { id: 'reports', label: 'Reports', icon: <DocumentChartBarIcon className="h-6 w-6" /> },
        { id: 'budget', label: 'Budget', icon: <BanknotesIcon className="h-6 w-6" /> },
        { id: 'settings', label: 'Settings', icon: <Cog6ToothIcon className="h-6 w-6" /> },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">
                   <span className="font-light">Zenith</span> Budget
                </h1>
                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden text-slate-300 hover:text-white"
                    aria-label="Close sidebar"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={currentView === item.id}
                        onClick={() => handleNavClick(item.id)}
                    />
                ))}
            </nav>
        </div>
    );
    
    return (
        <>
            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>
            <div className={`fixed inset-y-0 left-0 w-64 bg-slate-800 text-white transform transition-transform z-40 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent}
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-800">
                {sidebarContent}
            </div>
        </>
    );
};

export default Sidebar;
