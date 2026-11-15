import React from 'react';
import { Driver, Neighborhood } from '../types';
import { Truck, MapPin, ArrowLeft, ShieldAlert } from 'lucide-react';
import { formatNumber } from '../utils/turfHelpers';

interface DriverSelectionProps {
  drivers: Driver[];
  neighborhoods: Neighborhood[];
  onSelectDriver: (driver: Driver) => void;
  onOpenAdmin: () => void;
  onOpenOverview: () => void;
  useKurdishNumerals: boolean;
}

export const DriverSelection: React.FC<DriverSelectionProps> = ({
  drivers,
  neighborhoods,
  onSelectDriver,
  onOpenAdmin,
  onOpenOverview,
  useKurdishNumerals
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            <MapPin className="w-4 h-4" />
            <span>شاری هەولێر • قەڵای هەولێر تا شەقامی ١٥٠ مەتر</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            سیستەمی بەڕێوەبردنی شۆفێرانی گەیاندن
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            تکایە ناوی خۆت وەک شۆفێر هەڵبژێرە. هەموو گەڕەکەکانی ناوچەکەت لە ژێر ناوەکەتدا بە وردی نووسراون.
          </p>
        </div>

        {/* 5 Driver Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => {
            const driverNh = neighborhoods.filter((n) => n.driverId === driver.id);
            const completedCount = driverNh.filter((n) => n.status === 'completed').length;
            const totalCount = driverNh.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={driver.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md hover:shadow-xl border border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Accent Color Header bar */}
                <div
                  className="absolute top-0 right-0 left-0 h-1.5"
                  style={{ backgroundColor: driver.color }}
                ></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                      style={{ backgroundColor: driver.color }}
                    >
                      {driver.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center space-x-1 space-x-reverse">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      <span>{driver.vehicle}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {driver.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5" dir="ltr">
                      {driver.phone}
                    </p>
                  </div>

                  {/* Progress Stats */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                      <span>گەڕەکەکان: {formatNumber(completedCount, useKurdishNumerals)} / {formatNumber(totalCount, useKurdishNumerals)}</span>
                      <span>{formatNumber(percent, useKurdishNumerals)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: driver.color }}
                      ></div>
                    </div>
                  </div>

                  {/* List of all neighborhoods under the driver name */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      گەڕەکەکانی سنوری ئەم شۆفێرە ({formatNumber(driverNh.length, useKurdishNumerals)}):
                    </div>
                    <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                      {driverNh.map((nh, idx) => (
                        <div
                          key={nh.id}
                          className="bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-[10px]">
                              {formatNumber(idx + 1, useKurdishNumerals)}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{nh.nameCkb}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{nh.nameEn}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Start Work Button */}
                <button
                  onClick={() => onSelectDriver(driver)}
                  className="mt-6 w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center space-x-2 space-x-reverse shadow-md transition hover:opacity-90"
                  style={{ backgroundColor: driver.color }}
                >
                  <span>دەستپێکردنی کار (Start Work)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {/* Quick Overview Card */}
          <div
            onClick={onOpenOverview}
            className="group bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">خەریتەی گشتی ناوچەکان</h3>
              <p className="text-xs text-indigo-100">
                بینینی هەموو ٥ سەکتەرە بازنەییەکەی شۆفێران لەسەر خەریتەی ڕاستەقینەی هەولێر.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold">
              <span>بینینی خەریتە</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Admin Quick Link */}
        <div className="text-center pt-4">
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center space-x-2 space-x-reverse bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-6 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 font-semibold text-sm transition"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>پەڕەی بەڕێوەبەر (Admin Dashboard & Data Audit)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
