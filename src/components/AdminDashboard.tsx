import React, { useState } from 'react';
import { Neighborhood, Driver, Zone, AuditIssue } from '../types';
import { runDataAudit, formatNumber } from '../utils/turfHelpers';
import { Shield, AlertTriangle, Plus, Trash2, Edit3, Download, Upload, CheckCircle, RefreshCw, Layers, Users, MapPin } from 'lucide-react';

interface AdminDashboardProps {
  neighborhoods: Neighborhood[];
  drivers: Driver[];
  zones: Zone[];
  onAddNeighborhood: (nh: Omit<Neighborhood, 'id'>) => void;
  onUpdateNeighborhood: (nh: Neighborhood) => void;
  onDeleteNeighborhood: (id: string) => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => void;
  useKurdishNumerals: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  neighborhoods,
  drivers,
  zones,
  onAddNeighborhood,
  onUpdateNeighborhood,
  onDeleteNeighborhood,
  onExportData,
  onImportData,
  useKurdishNumerals
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'audit' | 'neighborhoods' | 'zones' | 'export'>('audit');
  const [editingNh, setEditingNh] = useState<Neighborhood | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New neighborhood form state
  const [formCkb, setFormCkb] = useState('');
  const [formEn, setFormEn] = useState('');
  const [formDriverId, setFormDriverId] = useState(drivers[0]?.id || 'rozh');
  const [formLat, setFormLat] = useState(36.1950);
  const [formLng, setFormLng] = useState(44.0100);
  const [formNotes, setFormNotes] = useState('');

  const auditIssues = runDataAudit(neighborhoods, drivers);

  const handleSaveNeighborhood = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNh) {
      onUpdateNeighborhood({
        ...editingNh,
        nameCkb: formCkb,
        nameEn: formEn,
        driverId: formDriverId,
        lat: Number(formLat),
        lng: Number(formLng),
        notes: formNotes
      });
      setEditingNh(null);
    } else {
      onAddNeighborhood({
        nameCkb: formCkb,
        nameEn: formEn,
        driverId: formDriverId,
        sequenceOrder: neighborhoods.length + 1,
        status: 'pending',
        lat: Number(formLat),
        lng: Number(formLng),
        isVerified: true,
        notes: formNotes
      });
      setIsAdding(false);
    }
    setFormCkb('');
    setFormEn('');
    setFormNotes('');
  };

  const startEdit = (nh: Neighborhood) => {
    setEditingNh(nh);
    setFormCkb(nh.nameCkb);
    setFormEn(nh.nameEn);
    setFormDriverId(nh.driverId);
    setFormLat(nh.lat);
    setFormLng(nh.lng);
    setFormNotes(nh.notes || '');
    setIsAdding(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        onImportData(content);
        alert('داتاکان بە سەرکەوتوویی هاوردە کران!');
      } catch (err) {
        console.error(err);
        alert('هەڵە لە خوێندنەوەی فایلەکەدا.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-955 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">پانێلی بەڕێوەبەر (Admin Dashboard)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">بەڕێوەبردنی ناوچەکان، شۆفێران و پشکنینی داتاکانی گەیاندن لە هەولێر</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={onExportData}
              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold flex items-center space-x-1.5 space-x-reverse transition"
            >
              <Download className="w-4 h-4" />
              <span>هەناردەکردنی JSON</span>
            </button>
            <label className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center space-x-1.5 space-x-reverse cursor-pointer transition">
              <Upload className="w-4 h-4" />
              <span>هاوردەکردنی JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 space-x-reverse border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 space-x-reverse transition ${
              activeAdminTab === 'audit'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>پشکنینی داتا (Data Audit: {formatNumber(auditIssues.length, useKurdishNumerals)})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('neighborhoods')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 space-x-reverse transition ${
              activeAdminTab === 'neighborhoods'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>بەڕێوەبردنی گەڕەکەکان ({formatNumber(neighborhoods.length, useKurdishNumerals)})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('zones')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 space-x-reverse transition ${
              activeAdminTab === 'zones'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ناوچەکان و شۆفێران (Zones)</span>
          </button>
        </div>

        {/* Tab 1: Data Audit Inspector */}
        {activeAdminTab === 'audit' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">ئەنجامی پشکنینی داتای جوگرافی و گەیاندن</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                ئەم سیستەمە بە وردی هەموو ناوی گەڕەکەکان، دووبارەبوونەوەکان، بێ شۆفێرەکان و سنووری ١٥٠ مەتر دەپشکنێت.
              </p>

              {auditIssues.length === 0 ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-6 text-center text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                  <div className="font-bold text-base">هیچ هەڵە یان کێشەیەک نەدۆزرایەوە!</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">هەموو داتاکانی گەڕەک و شۆفێران لە دۆخێکی تەواو ڕاست و دروستدان.</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditIssues.map((issue) => (
                    <div key={issue.id} className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-rose-900 dark:text-rose-200">{issue.messageCkb}</div>
                          <div className="text-xs text-rose-700 dark:text-rose-400">{issue.messageEn}</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                        {issue.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Neighborhoods Manager */}
        {activeAdminTab === 'neighborhoods' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">لیستی گەڕەکەکان و بەڕێوەبردن</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">زیادکردن، دەستکاریکردن یان سڕینەوەی گەڕەکەکان.</p>
              </div>
              <button
                onClick={() => { setIsAdding(true); setEditingNh(null); setFormCkb(''); setFormEn(''); setFormNotes(''); }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 space-x-reverse shadow-md shadow-indigo-600/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>زیادکردنی گەڕەکی نوێ</span>
              </button>
            </div>

            {/* Add/Edit Modal Form */}
            {isAdding && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-900">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  {editingNh ? 'دەستکاریکردنی گەڕەک' : 'زیادکردنی گەڕەکی نوێ'}
                </h4>
                <form onSubmit={handleSaveNeighborhood} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ناوی کوردی (Sorani)</label>
                    <input
                      type="text"
                      value={formCkb}
                      onChange={(e) => setFormCkb(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                      placeholder="نموونە: رۆشنبیری"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ناوی ئینگلیزی (English)</label>
                    <input
                      type="text"
                      value={formEn}
                      onChange={(e) => setFormEn(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                      placeholder="e.g. Roshnbiri"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">شۆفێری بەرپرسیار</label>
                    <select
                      value={formDriverId}
                      onChange={(e) => setFormDriverId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    >
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">هێڵکاری (Latitude)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formLat}
                      onChange={(e) => setFormLat(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">پانی (Longitude)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formLng}
                      onChange={(e) => setFormLng(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">تێبینی</label>
                    <input
                      type="text"
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 flex justify-end space-x-2 space-x-reverse pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsAdding(false); setEditingNh(null); }}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      پاشگەزبوونەوە
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
                    >
                      پاشەکەوتکردن
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Neighborhoods Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <th className="p-4">#</th>
                      <th className="p-4">ناوی کوردی</th>
                      <th className="p-4">English Name</th>
                      <th className="p-4">شۆفێر</th>
                      <th className="p-4">شوێن (Lat/Lng)</th>
                      <th className="p-4">دۆخ</th>
                      <th className="p-4 text-center">کردار</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {neighborhoods.map((nh, idx) => {
                      const driver = drivers.find((d) => d.id === nh.driverId);
                      return (
                        <tr key={nh.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                          <td className="p-4 font-bold text-slate-500">{formatNumber(idx + 1, useKurdishNumerals)}</td>
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{nh.nameCkb}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{nh.nameEn}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-white font-semibold" style={{ backgroundColor: driver?.color || '#64748b' }}>
                              {driver?.name || 'نادیار'}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 font-mono">{nh.lat.toFixed(4)}, {nh.lng.toFixed(4)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-md font-semibold ${nh.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {nh.status === 'completed' ? 'تەواو' : 'چاوەڕوان'}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => startEdit(nh)}
                              className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                              title="دەستکاری"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteNeighborhood(nh.id)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition"
                              title="سڕینەوە"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Zones & Drivers */}
        {activeAdminTab === 'zones' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => {
              const driverNh = neighborhoods.filter((n) => n.driverId === driver.id);
              return (
                <div key={driver.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center shadow-sm" style={{ backgroundColor: driver.color }}>
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">{driver.name}</h4>
                        <p className="text-xs text-slate-500">{driver.vehicle}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      گۆشە: {driver.startAngle}° - {driver.endAngle}°
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">گەڕەکە بەرپرسەکان ({formatNumber(driverNh.length, useKurdishNumerals)}):</div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {driverNh.map((n) => (
                        <div key={n.id} className="text-xs bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg flex justify-between items-center text-slate-700 dark:text-slate-300">
                          <span>{n.nameCkb}</span>
                          <span className="text-[10px] text-slate-400">{n.nameEn}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
