import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Neighborhood, Driver, Zone } from '../types';
import { CITADEL_CENTER, createSectorPolygon } from '../utils/turfHelpers';
import { Navigation, Layers } from 'lucide-react';

interface MapViewProps {
  neighborhoods: Neighborhood[];
  drivers: Driver[];
  zones: Zone[];
  selectedDriver: Driver | null;
  onToggleStatus: (neighborhoodId: string) => void;
  onSelectNeighborhood?: (neighborhood: Neighborhood) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  drivers,
  zones,
  selectedDriver
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [trackingGps, setTrackingGps] = useState(false);
  const [gpsMarker, setGpsMarker] = useState<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [CITADEL_CENTER.lat, CITADEL_CENTER.lng],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'topleft' }).addTo(map);

      const osmRoad = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      });

      const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri'
      });

      osmRoad.addTo(map);
      (map as any)._osmRoad = osmRoad;
      (map as any)._esriSat = esriSat;

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch map tile type
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current as any;
    if (mapType === 'satellite') {
      map.removeLayer(map._osmRoad);
      map._esriSat.addTo(map);
    } else {
      map.removeLayer(map._esriSat);
      map._osmRoad.addTo(map);
    }
  }, [mapType]);

  // Render Sectors, Ring Boundary, and Citadel (clean map matching user's drawing)
  useEffect(() => {
    if (!layerGroupRef.current || !mapInstanceRef.current) return;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // 1. Draw 5 Pie Sectors radiating from Erbil Citadel
    zones.forEach((zone) => {
      const driver = drivers.find((d) => d.id === zone.driverId);
      if (!driver) return;

      const isHighlighted = !selectedDriver || selectedDriver.id === driver.id;
      const opacity = isHighlighted ? 0.32 : 0.08;
      const weight = isHighlighted ? 3 : 1;

      const sectorCoords = createSectorPolygon(zone.startAngle, zone.endAngle, 8.0);
      const polygon = L.polygon(sectorCoords, {
        color: driver.color,
        weight: weight,
        fillColor: driver.color,
        fillOpacity: opacity,
        dashArray: isHighlighted ? undefined : '4, 4'
      });

      const sectorCenterAngle = (zone.startAngle + zone.endAngle) / 2;
      const rad = (sectorCenterAngle - 90) * (Math.PI / 180);
      const labelLat = CITADEL_CENTER.lat + (4.5 / 111) * Math.sin(rad);
      const labelLng = CITADEL_CENTER.lng + (4.5 / (111 * Math.cos(CITADEL_CENTER.lat * Math.PI / 180))) * Math.cos(rad);

      const labelIcon = L.divIcon({
        className: 'sector-label-icon',
        html: `<div style="
          background-color: ${driver.color};
          color: white;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          white-space: nowrap;
          border: 2px solid white;
          direction: ltr;
        ">${driver.name}</div>`,
        iconSize: [90, 30],
        iconAnchor: [45, 15]
      });

      const labelMarker = L.marker([labelLat, labelLng], { icon: labelIcon });
      layerGroup.addLayer(polygon);
      layerGroup.addLayer(labelMarker);
    });

    // 2. Draw Erbil 150m Ring Boundary
    const ringCoords: [number, number][] = createSectorPolygon(0, 360, 8.2);
    L.polygon(ringCoords, {
      color: '#3b82f6',
      weight: 3.5,
      dashArray: '8, 8',
      fill: false
    }).bindPopup(`<div style="direction: rtl; font-family: 'Vazirmatn';">شەقامی ١٥٠ مەتری هەولێر - سنووری خزمەتگوزاری</div>`).addTo(layerGroup);

    // 3. Draw Erbil Citadel Center Marker
    const citadelIcon = L.divIcon({
      className: 'custom-citadel-marker',
      html: `<div style="background-color: #f43f5e; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.4); border: 3px solid white; font-size: 18px;">🏰</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    L.marker([CITADEL_CENTER.lat, CITADEL_CENTER.lng], { icon: citadelIcon })
      .bindPopup(`<div style="direction: rtl; text-align: right; font-family: 'Vazirmatn', sans-serif;"><b>قەڵای هەولێر (ناوەندی دەستپێک)</b><br>Erbil Citadel Center</div>`)
      .addTo(layerGroup);

  }, [drivers, zones, selectedDriver]);

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) {
      alert('GPS پشتگیری ناکرێت لەم وێبگەڕەدا');
      return;
    }
    setTrackingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current!;
        map.setView([latitude, longitude], 15);

        if (gpsMarker) {
          gpsMarker.setLatLng([latitude, longitude]);
        } else {
          const gpsIcon = L.divIcon({
            className: 'gps-marker',
            html: `<div style="background-color: #3b82f6; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px #3b82f6;"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });
          const marker = L.marker([latitude, longitude], { icon: gpsIcon }).bindPopup('شوێنی ئێستای تۆ');
          marker.addTo(map);
          setGpsMarker(marker);
        }
        setTrackingGps(false);
      },
      (error) => {
        console.error(error);
        alert('ناتوانرێت شوێنی GPS دەستنیشان بکرێت.');
        setTrackingGps(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950">
      <div ref={mapRef} className="w-full h-full z-10" />

      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
        <button
          onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-3 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex items-center space-x-2 space-x-reverse text-xs font-semibold hover:bg-slate-50 transition"
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>{mapType === 'roadmap' ? 'سەتەلایت (Satellite)' : 'ڕێگا (Roadmap)'}</span>
        </button>

        <button
          onClick={handleLocateMe}
          disabled={trackingGps}
          className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-3 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex items-center space-x-2 space-x-reverse text-xs font-semibold hover:bg-slate-50 transition"
        >
          <Navigation className="w-4 h-4 text-blue-600" />
          <span>{trackingGps ? 'دەگەڕێت...' : 'شوێنی من (GPS)'}</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-6 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hidden sm:block">
        <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">ناوچەکانی شۆفێران</div>
        <div className="space-y-1.5">
          {drivers.map((d) => (
            <div key={d.id} className="flex items-center space-x-2 space-x-reverse text-xs">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{d.name} ({d.vehicle})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
