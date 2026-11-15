import React from 'react';
import { AppMode, Driver } from '../types';
import { MapPin, Shield, Users, Map, Sun, Moon, RotateCcw } from 'lucide-react';
import { formatNumber } from '../utils/turfHelpers';

interface NavbarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  selectedDriver: Driver | null;
  setSelectedDriver: (driver: Driver | null) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  useKurdishNumerals: boolean;
  setUseKurdishNumerals: (val: boolean) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  setMode,
  selectedDriver,
  setSelectedDriver,
  darkMode,
  setDarkMode,
  useKurdishNumerals,
  setUseKurdishNumerals,
  onResetData
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer" onClick={() => { setMode('driver-select'); setSelectedDriver(null); }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-md">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
              سیستەمی گەیاندنی هەولێر
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hawler Delivery Management System
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-2 space-x-reverse">
          {/* Mode switch buttons */}
          <button
            onClick={() => { setMode('driver-select'); setSelectedDriver(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 space-x-reverse transition-all ${
              currentMode === 'driver-select' || currentMode === 'driver-view'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>شۆفێران</span>
          </button>

          <button
            onClick={() => setMode('map-overview')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 space-x-reverse transition-all ${
              currentMode === 'map-overview'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>خەریتەی گشتی</span>
          </button>

          <button
            onClick={() => setMode('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 space-x-reverse transition-all ${
              currentMode === 'admin'
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>بەڕێوەبەر</span>
          </button>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* Numeral Toggle */}
          <button
            onClick={() => setUseKurdishNumerals(!useKurdishNumerals)}
            title="گۆڕینی ژمارەکان"
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {useKurdishNumerals ? formatNumber(123, true) : '123'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="گۆڕینی ڕووکار"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Reset Data Button */}
          <button
            onClick={onResetData}
            title="گەڕاندنەوەی داتای سەرەکی"
            className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition hidden sm:block"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
