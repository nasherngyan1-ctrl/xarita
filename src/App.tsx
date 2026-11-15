import React, { useState, useEffect } from 'react';
import { AppMode, Driver, Neighborhood, Zone } from './types';
import initialDrivers from './data/drivers.json';
import initialZones from './data/zones.json';
import initialNeighborhoods from './data/neighborhoods.json';
import { Navbar } from './components/Navbar';
import { DriverSelection } from './components/DriverSelection';
import { DriverDashboard } from './components/DriverDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MapView } from './components/MapView';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('driver-select');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [useKurdishNumerals, setUseKurdishNumerals] = useState<boolean>(false);

  // Persistent state for drivers, zones, and neighborhoods
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    return initialDrivers as Driver[];
  });

  const [zones, setZones] = useState<Zone[]>(() => {
    return initialZones as Zone[];
  });

  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(() => {
    const saved = localStorage.getItem('hawler_neighborhoods');
    return saved ? JSON.parse(saved) : (initialNeighborhoods as Neighborhood[]);
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('hawler_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('hawler_zones', JSON.stringify(zones));
  }, [zones]);

  useEffect(() => {
    localStorage.setItem('hawler_neighborhoods', JSON.stringify(neighborhoods));
  }, [neighborhoods]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toggle Neighborhood Completion Status
  const handleToggleStatus = (neighborhoodId: string) => {
    setNeighborhoods((prev) =>
      prev.map((n) =>
        n.id === neighborhoodId
          ? { ...n, status: n.status === 'completed' ? 'pending' : 'completed' }
          : n
      )
    );
  };

  // Reset Daily Delivery Status
  const handleResetDay = (driverId: string) => {
    setNeighborhoods((prev) =>
      prev.map((n) => (n.driverId === driverId ? { ...n, status: 'pending' } : n))
    );
  };

  // Reset all app data
  const handleResetAllData = () => {
    if (window.confirm('ئایا دڵنیای لە گەڕاندنەوەی هەموو داتاکان بۆ داتای سەرەکی؟')) {
      setDrivers(initialDrivers as Driver[]);
      setZones(initialZones as Zone[]);
      setNeighborhoods(initialNeighborhoods as Neighborhood[]);
      localStorage.clear();
      alert('داتاکان بە سەرکەوتوویی گەڕێنرانەوە.');
    }
  };

  // Admin neighborhood operations
  const handleAddNeighborhood = (newNh: Omit<Neighborhood, 'id'>) => {
    const id = `nh-${Date.now()}`;
    const created: Neighborhood = { ...newNh, id };
    setNeighborhoods((prev) => [...prev, created]);
  };

  const handleUpdateNeighborhood = (updatedNh: Neighborhood) => {
    setNeighborhoods((prev) => prev.map((n) => (n.id === updatedNh.id ? updatedNh : n)));
  };

  const handleDeleteNeighborhood = (id: string) => {
    if (window.confirm('ئایا دڵنیای لە سڕینەوەی ئەم گەڕەکە؟')) {
      setNeighborhoods((prev) => prev.filter((n) => n.id !== id));
    }
  };

  // Export JSON backup
  const handleExportData = () => {
    const exportObj = {
      drivers,
      zones,
      neighborhoods,
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hawler_delivery_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportData = (jsonData: string) => {
    const parsed = JSON.parse(jsonData);
    if (parsed.drivers) setDrivers(parsed.drivers);
    if (parsed.zones) setZones(parsed.zones);
    if (parsed.neighborhoods) setNeighborhoods(parsed.neighborhoods);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        currentMode={currentMode}
        setMode={(mode) => {
          setCurrentMode(mode);
          if (mode === 'driver-select' || mode === 'map-overview' || mode === 'admin') {
            setSelectedDriver(null);
          }
        }}
        selectedDriver={selectedDriver}
        setSelectedDriver={setSelectedDriver}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        useKurdishNumerals={useKurdishNumerals}
        setUseKurdishNumerals={setUseKurdishNumerals}
        onResetData={handleResetAllData}
      />

      <main>
        {currentMode === 'driver-select' && (
          <DriverSelection
            drivers={drivers}
            neighborhoods={neighborhoods}
            onSelectDriver={(driver) => {
              setSelectedDriver(driver);
              setCurrentMode('driver-view');
            }}
            onOpenAdmin={() => setCurrentMode('admin')}
            onOpenOverview={() => setCurrentMode('map-overview')}
            useKurdishNumerals={useKurdishNumerals}
          />
        )}

        {currentMode === 'driver-view' && selectedDriver && (
          <DriverDashboard
            driver={selectedDriver}
            neighborhoods={neighborhoods}
            drivers={drivers}
            zones={zones}
            onToggleStatus={handleToggleStatus}
            onResetDay={handleResetDay}
            onBack={() => {
              setCurrentMode('driver-select');
              setSelectedDriver(null);
            }}
            useKurdishNumerals={useKurdishNumerals}
          />
        )}

        {currentMode === 'map-overview' && (
          <div className="relative w-full h-[calc(100vh-4rem)]">
            <MapView
              neighborhoods={neighborhoods}
              drivers={drivers}
              zones={zones}
              selectedDriver={null}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        )}

        {currentMode === 'admin' && (
          <AdminDashboard
            neighborhoods={neighborhoods}
            drivers={drivers}
            zones={zones}
            onAddNeighborhood={handleAddNeighborhood}
            onUpdateNeighborhood={handleUpdateNeighborhood}
            onDeleteNeighborhood={handleDeleteNeighborhood}
            onExportData={handleExportData}
            onImportData={handleImportData}
            useKurdishNumerals={useKurdishNumerals}
          />
        )}
      </main>
    </div>
  );
}
