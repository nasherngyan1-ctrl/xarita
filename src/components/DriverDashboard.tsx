import React, { useState } from 'react';
import { Driver, Neighborhood, Zone } from '../types';
import { MapView } from './MapView';
import { sortNeighborhoods, formatNumber } from '../utils/turfHelpers';
import { CheckCircle, Clock, Navigation, ArrowRight, RotateCcw, Map, List, Phone, Car } from 'lucide-react';

interface DriverDashboardProps {
  driver: Driver;
  neighborhoods: Neighborhood[];
  drivers: Driver[];
  zones: Zone[];
  onToggleStatus: (neighborhoodId: string) => void;
  onResetDay: (driverId: string) => void;
  onBack: () => void;
  useKurdishNumerals: boolean;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  driver,
  neighborhoods,
  drivers,
  zones,
  onToggleStatus,
  onResetDay,
  onBack,
  useKurdishNumerals
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  const driverNeighborhoods = sortNeighborhoods(neighborhoods.filter((n) => n.driverId === driver.id));
  const completedCount = driverNeighborhoods.filter((n) => n.status === 'completed').length;
  const totalCount = driverNeighborhoods.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleResetConfirm = () => {
    if (window.confirm('ئایا دڵنیای لە دەستپێکردنی ڕۆژێکی نوێ؟ داتای ئەمڕۆ پاشەکەوت دەکرێت و دۆخی تەواوبوون سفر دەبێتەوە.')) {
      onResetDay(driver.id);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 flex flex-col">
      
      {/* Driver Header Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="گەڕانەوە"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md"
              style={{ backgroundColor: driver.color }}
            >
              {driver.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{driver.name}</h2>
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-white" style={{ backgroundColor: driver.color }}>
                  شۆفێری ناوچە
                </span>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center space-x-1 space-x-reverse">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{driver.phone}</span>
                </span>
                <span className="flex items-center space-x-1 space-x-reverse">
                  <Car className="w-3.5 h-3.5" />
                  <span>{driver.vehicle}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Progress & Daily Reset */}
          <div className="flex items-center space-x-4 space-x-reverse justify-between md:justify-end">
            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold mb-1">
                <span>تەواوبوون: {formatNumber(completedCount, useKurdishNumerals)} / {formatNumber(totalCount, useKurdishNumerals)}</span>
                <span>{formatNumber(percent, useKurdishNumerals)}%</span>
              </div>
              <div className="w-36 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%`, backgroundColor: driver.color }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleResetConfirm}
              className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-center space-x-1.5 space-x-reverse hover:bg-rose-100 transition"
              title="دەستپێکردنی ڕۆژێکی نوێ"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">ڕۆژی نوێ</span>
            </button>
          </div>

        </div>

        {/* Tab switcher for List vs Map */}
        <div className="max-w-7xl mx-auto flex space-x-2 space-x-reverse mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 space-x-reverse transition ${
              activeTab === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>لیستی گەڕەکەکان ({formatNumber(totalCount, useKurdishNumerals)})</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 space-x-reverse transition ${
              activeTab === 'map'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>خەریتەی ناوچە</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'map' ? (
          <div className="w-full h-[650px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
            <MapView
              neighborhoods={neighborhoods}
              drivers={drivers}
              zones={zones}
              selectedDriver={driver}
              onToggleStatus={onToggleStatus}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300 flex items-center space-x-3 space-x-reverse">
              <Clock className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <span>
                گەڕەکەکان بە شێوەیەکی زیرەک لە قەڵای هەولێرەوە بەرەو دەرەوە ڕیزبەندی کراون بۆ ئەوەی بەبێ سەرلێشێواوی کارەکانت تەواو بکەیت.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {driverNeighborhoods.map((nh, idx) => {
                const isCompleted = nh.status === 'completed';
                const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${nh.lat},${nh.lng}`;

                return (
                  <div
                    key={nh.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border transition-all ${
                      isCompleted
                        ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'border-slate-200 dark:border-slate-800 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm ${
                            isCompleted ? 'bg-emerald-500' : 'bg-slate-800 dark:bg-slate-700'
                          }`}
                        >
                          {formatNumber(idx + 1, useKurdishNumerals)}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {nh.nameCkb}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {nh.nameEn}
                          </p>
                        </div>
                      </div>

                      {/* Checkbox */}
                      <button
                        onClick={() => onToggleStatus(nh.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                        }`}
                        title="تەواو بوو / نەبوو"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>

                    {nh.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        {nh.notes}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                        isCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        {isCompleted ? 'تەواو بوو (Completed)' : 'چاوەڕوان (Pending)'}
                      </span>

                      <a
                        href={navUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold flex items-center space-x-1 space-x-reverse transition"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>گەشت (Nav)</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
