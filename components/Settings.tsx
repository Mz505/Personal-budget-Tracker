
import React, { useRef } from 'react';
import { Theme, NotificationFrequency } from '../types';
import { SunIcon, MoonIcon, ComputerDesktopIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from './Icons';

interface SettingsProps {
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
    onBackup: () => void;
    onRestore: (fileContent: string) => void;
    notificationFrequency: NotificationFrequency;
    setNotificationFrequency: (frequency: NotificationFrequency) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentTheme, setTheme, onBackup, onRestore, notificationFrequency, setNotificationFrequency }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const themeOptions = [
        { value: 'light', label: 'Light', icon: <SunIcon className="h-6 w-6" /> },
        { value: 'dark', label: 'Dark', icon: <MoonIcon className="h-6 w-6" /> },
        { value: 'system', label: 'System', icon: <ComputerDesktopIcon className="h-6 w-6" /> },
    ];

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (typeof content === 'string') {
                    onRestore(content);
                }
            };
            reader.readAsText(file);
        }
        // Reset file input to allow re-uploading the same file
        event.target.value = '';
    };

    const handleFrequencyChange = async (frequency: NotificationFrequency) => {
        if (frequency !== 'off' && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationFrequency(frequency);
            }
        } else if (Notification.permission === 'denied' && frequency !== 'off') {
            alert('Notification permission was denied. Please enable it in your browser settings.');
        }
        else {
            setNotificationFrequency(frequency);
        }
    };


    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Settings</h2>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Appearance</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Choose how the application looks. Select a theme or sync with your system.
                </p>

                <fieldset>
                    <legend className="sr-only">Theme options</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {themeOptions.map((option) => (
                            <label
                                key={option.value}
                                className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    currentTheme === option.value
                                        ? 'border-indigo-600 ring-2 ring-indigo-500'
                                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="theme-option"
                                    value={option.value}
                                    className="sr-only"
                                    aria-labelledby={`theme-label-${option.value}`}
                                    checked={currentTheme === option.value}
                                    onChange={() => setTheme(option.value as Theme)}
                                />
                                <div className="text-slate-600 dark:text-slate-300 mb-2">{option.icon}</div>
                                <span id={`theme-label-${option.value}`} className="font-medium text-slate-800 dark:text-slate-200">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
            </div>

             <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Receive periodic summaries of your spending activity. This requires notification permissions.
                </p>
                <fieldset>
                    <legend className="sr-only">Notification frequency</legend>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {(['off', 'daily', 'weekly'] as NotificationFrequency[]).map(freq => (
                             <label
                                key={freq}
                                className={`flex-1 flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${notificationFrequency === freq ? 'bg-indigo-50 border-indigo-500 dark:bg-slate-700/50' : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                            >
                                <input
                                    type="radio"
                                    name="notification-frequency"
                                    checked={notificationFrequency === freq}
                                    onChange={() => handleFrequencyChange(freq)}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:checked:bg-indigo-500"
                                />
                                <span className="ml-3 text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">{freq}</span>
                             </label>
                        ))}
                    </div>
                </fieldset>
            </div>


            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Data Management</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Backup your data to a file or restore it from a previous backup.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onBackup}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 dark:bg-slate-700 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        Backup Data
                    </button>
                    <button
                        onClick={handleRestoreClick}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-200 border border-slate-300 dark:border-transparent rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-300"
                    >
                        <ArrowUpTrayIcon className="h-5 w-5" />
                        Restore Data
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".json"
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
