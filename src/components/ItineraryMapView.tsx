import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ItineraryItem, Trip } from '../types.ts';
import {
  MapPin,
  Navigation,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Compass,
  AlertCircle,
  LocateFixed,
  Maximize2,
  Utensils,
  Users,
  Camera,
  Bus,
  Sparkles,
} from 'lucide-react';

interface ItineraryMapViewProps {
  itinerary: ItineraryItem[];
  trip: Trip;
  selectedDay: number;
  initialSelectedStopId?: string;
  lang: 'TH' | 'EN';
  onSwitchToList: () => void;
}

// Activity badge styling & icons
const activityConfig: Record<
  string,
  { labelTH: string; labelEN: string; color: string; bgBadge: string; pinBg: string; icon: string }
> = {
  Meal: {
    labelTH: 'มื้ออาหาร',
    labelEN: 'Meal',
    color: '#D97706',
    bgBadge: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    pinBg: '#F59E0B',
    icon: '🍴',
  },
  Meeting: {
    labelTH: 'เวลานัดพบ',
    labelEN: 'Gathering',
    color: '#2563EB',
    bgBadge: 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-sky-300 border-blue-200 dark:border-blue-800',
    pinBg: '#2563EB',
    icon: '👥',
  },
  Attraction: {
    labelTH: 'ท่องเที่ยว',
    labelEN: 'Sightseeing',
    color: '#0284C7',
    bgBadge: 'bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    pinBg: '#0284C7',
    icon: '📷',
  },
  Transport: {
    labelTH: 'การเดินทาง',
    labelEN: 'Coach',
    color: '#059669',
    bgBadge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    pinBg: '#10B981',
    icon: '🚌',
  },
  Free: {
    labelTH: 'อิสระ',
    labelEN: 'Free Time',
    color: '#7C3AED',
    bgBadge: 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    pinBg: '#8B5CF6',
    icon: '✨',
  },
};

// Calculate Haversine distance in kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const ItineraryMapView: React.FC<ItineraryMapViewProps> = ({
  itinerary,
  trip,
  selectedDay,
  initialSelectedStopId,
  lang,
  onSwitchToList,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const polylineBorderRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Filter itinerary items with valid coordinates
  const validStops = itinerary.filter(
    (item) => item.Latitude && item.Longitude && !isNaN(parseFloat(item.Latitude)) && !isNaN(parseFloat(item.Longitude))
  );

  const [activeStopIndex, setActiveStopIndex] = useState<number>(() => {
    if (initialSelectedStopId) {
      const idx = validStops.findIndex((s) => s.ItineraryID === initialSelectedStopId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const activeStop = validStops[activeStopIndex] || validStops[0];

  // Helper to create custom HTML Marker Pin
  const createMarkerIcon = (item: ItineraryItem, index: number, isActive: boolean) => {
    const config = activityConfig[item.ActivityType] || activityConfig.Attraction;
    const pinColor = config.pinBg;

    const html = `
      <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 ${
        isActive ? 'scale-125 z-50' : 'hover:scale-110 z-20'
      }">
        <!-- Pin Container -->
        <div class="relative flex items-center justify-center rounded-2xl shadow-lg border-2 ${
          isActive
            ? 'bg-[#0A2540] border-amber-400 text-white shadow-blue-900/60 ring-4 ring-blue-500/30'
            : 'bg-white border-slate-300 text-slate-800 dark:bg-slate-900 dark:text-white dark:border-slate-600 shadow-slate-900/20'
        } w-9 h-9 transition-all">
          <!-- Activity Symbol Badge -->
          <span class="text-xs leading-none mr-0.5">${config.icon}</span>
          <span class="text-xs font-black font-mono leading-none">${index + 1}</span>

          ${
            isActive
              ? '<span class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping opacity-75"></span>'
              : ''
          }
        </div>

        <!-- Pointer Arrow -->
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${
          isActive ? 'border-t-[#0A2540]' : 'border-t-white dark:border-t-slate-900'
        } -mt-0.5 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]"></div>

        <!-- Stop label on map -->
        <div class="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-xs backdrop-blur-xs ${
          isActive
            ? 'bg-[#0A2540] text-amber-300 border border-amber-400/50'
            : 'bg-white/95 text-slate-800 dark:bg-slate-900/95 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
        }">
          ${item.Time.slice(0, 5)} ${item.LocationName.split(',')[0].slice(0, 14)}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-itinerary-marker',
      html,
      iconSize: [36, 42],
      iconAnchor: [18, 40],
      popupAnchor: [0, -38],
    });
  };

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = validStops.length > 0
        ? [parseFloat(validStops[0].Latitude!), parseFloat(validStops[0].Longitude!)]
        : [35.6852, 139.6921];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Add CartoDB Positron tiles for clean modern appearance
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Attribution
      L.control
        .attribution({
          position: 'bottomright',
          prefix: '<span class="text-[9px] text-slate-400">© OpenStreetMap</span>',
        })
        .addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers and lines
    (Object.values(markersRef.current) as L.Marker[]).forEach((marker) => marker.remove());
    markersRef.current = {};

    if (polylineRef.current) polylineRef.current.remove();
    if (polylineBorderRef.current) polylineBorderRef.current.remove();

    if (validStops.length === 0) return;

    // Draw route connecting all stops
    const latLngs: L.LatLngExpression[] = validStops.map((item) => [
      parseFloat(item.Latitude!),
      parseFloat(item.Longitude!),
    ]);

    // Outer glow polyline border
    polylineBorderRef.current = L.polyline(latLngs, {
      color: '#0A2540',
      weight: 7,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Inner bright dashed route line
    polylineRef.current = L.polyline(latLngs, {
      color: '#2563EB',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Add markers for all stops
    const bounds = L.latLngBounds([]);

    validStops.forEach((item, index) => {
      const lat = parseFloat(item.Latitude!);
      const lng = parseFloat(item.Longitude!);
      const latLng: [number, number] = [lat, lng];
      bounds.extend(latLng);

      const isActive = index === activeStopIndex;
      const marker = L.marker(latLng, {
        icon: createMarkerIcon(item, index, isActive),
        zIndexOffset: isActive ? 1000 : 100,
      }).addTo(map);

      // Popup content
      const config = activityConfig[item.ActivityType] || activityConfig.Attraction;
      const popupHtml = `
        <div class="p-3 text-slate-900 min-w-[210px] max-w-[260px]">
          <div class="flex items-center justify-between gap-1 mb-1.5">
            <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bgBadge}">
              <span>${config.icon}</span>
              <span>${lang === 'TH' ? config.labelTH : config.labelEN}</span>
            </span>
            <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              ${item.Time.slice(0, 5)} น.
            </span>
          </div>
          <h4 class="font-bold text-xs sm:text-sm text-slate-900 leading-tight mb-1">
            #${index + 1} ${lang === 'TH' ? item.ActivityNameTH : item.ActivityNameEN}
          </h4>
          <p class="text-[11px] text-slate-600 mb-2 flex items-center gap-1">
            <span>📍</span>
            <span class="truncate">${item.LocationName}</span>
          </p>
          <a
            href="${item.MapURL || `https://maps.google.com/?q=${lat},${lng}`}"
            target="_blank"
            rel="noopener noreferrer"
            class="block w-full text-center text-xs font-bold bg-[#0A2540] hover:bg-blue-700 text-white py-1.5 rounded-lg transition-colors"
          >
            ${lang === 'TH' ? 'เปิดนำทาง Google Maps ↗' : 'Directions ↗'}
          </a>
        </div>
      `;
      marker.bindPopup(popupHtml, { closeButton: false });

      marker.on('click', () => {
        setActiveStopIndex(index);
      });

      markersRef.current[item.ItineraryID] = marker;
    });

    // Fit map bounds to show all day stops nicely
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 15 });
    }
  }, [validStops.length, selectedDay, lang]);

  // Update marker icons and pan map when activeStopIndex changes
  useEffect(() => {
    if (!mapInstanceRef.current || validStops.length === 0) return;
    const map = mapInstanceRef.current;

    validStops.forEach((item, index) => {
      const marker = markersRef.current[item.ItineraryID];
      if (marker) {
        const isActive = index === activeStopIndex;
        marker.setIcon(createMarkerIcon(item, index, isActive));
        marker.setZIndexOffset(isActive ? 1000 : 100);

        if (isActive) {
          map.panTo([parseFloat(item.Latitude!), parseFloat(item.Longitude!)], {
            animate: true,
            duration: 0.6,
          });
        }
      }
    });
  }, [activeStopIndex]);

  // Handle Fit All Bounds
  const handleFitAll = () => {
    if (!mapInstanceRef.current || validStops.length === 0) return;
    const bounds = L.latLngBounds(
      validStops.map((s) => [parseFloat(s.Latitude!), parseFloat(s.Longitude!)])
    );
    mapInstanceRef.current.fitBounds(bounds, { padding: [55, 55], maxZoom: 15 });
  };

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError(lang === 'TH' ? 'อุปกรณ์ไม่รองรับ GPS' : 'GPS not supported');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;

          // Remove previous user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          const userHtml = `
            <div class="relative flex items-center justify-center">
              <span class="w-6 h-6 rounded-full bg-blue-500/30 animate-ping absolute"></span>
              <span class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md relative z-10"></span>
            </div>
          `;

          userMarkerRef.current = L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: userHtml,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }),
            zIndexOffset: 1200,
          }).addTo(map);

          userMarkerRef.current.bindPopup(
            `<div class="p-2 text-xs font-bold text-center">${
              lang === 'TH' ? '📍 คุณอยู่ที่นี่' : '📍 You are here'
            }</div>`
          );

          map.flyTo([latitude, longitude], 15, { duration: 1 });
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationError(
          lang === 'TH'
            ? 'ไม่สามารถดึงตำแหน่งปัจจุบันได้ (โปรดอนุญาตสิทธิ์ตำแหน่ง)'
            : 'Unable to access current location.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Previous and Next stop navigation
  const handlePrevStop = () => {
    if (activeStopIndex > 0) {
      setActiveStopIndex(activeStopIndex - 1);
    }
  };

  const handleNextStop = () => {
    if (activeStopIndex < validStops.length - 1) {
      setActiveStopIndex(activeStopIndex + 1);
    }
  };

  // Distance from user to active stop
  let distanceToStop: string | null = null;
  if (userLocation && activeStop) {
    const d = calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      parseFloat(activeStop.Latitude!),
      parseFloat(activeStop.Longitude!)
    );
    distanceToStop = d < 1 ? `${Math.round(d * 1000)} ม.` : `${d.toFixed(1)} กม.`;
  }

  const activeConfig = activeStop ? activityConfig[activeStop.ActivityType] || activityConfig.Attraction : activityConfig.Attraction;

  return (
    <div className="space-y-3">
      {/* Horizontal Stops Quick-Jump Bar */}
      <div className="bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-2.5 shadow-xs">
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span>{lang === 'TH' ? `จุดแวะวันที่ ${selectedDay} (${validStops.length} จุด):` : `Day ${selectedDay} Stops (${validStops.length}):`}</span>
          </div>
          <button
            onClick={onSwitchToList}
            className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 transition-colors cursor-pointer"
          >
            {lang === 'TH' ? 'ดูตารางเวลาแบบลิสต์ →' : 'View Timetable List →'}
          </button>
        </div>

        {/* Scrollable Chip Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {validStops.map((stop, idx) => {
            const isSelected = idx === activeStopIndex;
            const config = activityConfig[stop.ActivityType] || activityConfig.Attraction;
            return (
              <button
                key={stop.ItineraryID}
                onClick={() => setActiveStopIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#0A2540] dark:bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/40 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600/70 border border-slate-200 dark:border-slate-600'
                }`}
              >
                <span>{config.icon}</span>
                <span className="font-mono">#{idx + 1}</span>
                <span className="max-w-[120px] truncate">{stop.LocationName.split(',')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 shadow-md bg-slate-100 dark:bg-slate-900 h-[380px] sm:h-[430px] z-0">
        {/* Leaflet map container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Map Utility Buttons (Top-Right) */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          {/* Fit all stops button */}
          <button
            onClick={handleFitAll}
            title={lang === 'TH' ? 'ซูมแสดงทุกจุด' : 'Fit all stops'}
            className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 shadow-md border border-slate-200/90 dark:border-slate-700 flex items-center justify-center transition-transform active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <Maximize2 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          </button>

          {/* Locate User button */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            title={lang === 'TH' ? 'ตำแหน่งปัจจุบันของฉัน' : 'Locate my position'}
            className={`w-10 h-10 rounded-2xl bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 shadow-md border border-slate-200/90 dark:border-slate-700 flex items-center justify-center transition-transform active:scale-95 cursor-pointer backdrop-blur-xs ${
              isLocating ? 'animate-spin' : ''
            }`}
          >
            <LocateFixed
              className={`w-4 h-4 ${
                userLocation
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-blue-600 dark:text-sky-400'
              }`}
            />
          </button>
        </div>

        {/* Floating Day Indicator (Top-Left) */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="bg-[#0A2540]/90 dark:bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl border border-white/20 shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold tracking-wide">
              {lang === 'TH' ? `เส้นทางท่องเที่ยว Day ${selectedDay}` : `Tour Route Day ${selectedDay}`}
            </span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">
              {activeStopIndex + 1}/{validStops.length}
            </span>
          </div>
        </div>

        {/* Location Error Toast if GPS denied */}
        {locationError && (
          <div className="absolute top-14 left-3 right-3 sm:left-auto sm:right-16 z-20 bg-amber-900/90 text-amber-100 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-medium border border-amber-500/40 shadow-lg flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Bottom Floating Active Stop Highlight Card */}
        {activeStop && (
          <div className="absolute bottom-3 inset-x-3 z-20">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-700 p-3 sm:p-3.5 shadow-xl transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Stop Number Badge */}
                  <div className="w-8 h-8 rounded-xl bg-[#0A2540] dark:bg-blue-600 text-white flex items-center justify-center font-mono font-black text-xs shadow-xs shrink-0">
                    #{activeStopIndex + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600 dark:text-sky-400" />
                        {activeStop.Time.slice(0, 5)} น.
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeConfig.bgBadge}`}
                      >
                        {activeConfig.icon} {lang === 'TH' ? activeConfig.labelTH : activeConfig.labelEN}
                      </span>
                      {activeStop.EstimatedDuration && (
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
                          ⏱ {activeStop.EstimatedDuration}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                      {lang === 'TH' ? activeStop.ActivityNameTH : activeStop.ActivityNameEN}
                    </h4>
                  </div>
                </div>

                {/* Stop Navigation Step Arrows */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handlePrevStop}
                    disabled={activeStopIndex === 0}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title={lang === 'TH' ? 'จุดก่อนหน้า' : 'Previous stop'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextStop}
                    disabled={activeStopIndex === validStops.length - 1}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title={lang === 'TH' ? 'จุดถัดไป' : 'Next stop'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Location & Distance + Directions Button */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{activeStop.LocationName}</span>
                  {distanceToStop && (
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-md font-semibold">
                      ห่าง {distanceToStop}
                    </span>
                  )}
                </div>

                <a
                  href={
                    activeStop.MapURL ||
                    `https://maps.google.com/?q=${activeStop.Latitude},${activeStop.Longitude}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold bg-[#0A2540] dark:bg-blue-600 hover:bg-blue-800 text-white px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-sky-300" />
                  <span>{lang === 'TH' ? 'นำทาง Google Maps' : 'Open in Maps'}</span>
                  <ExternalLink className="w-3 h-3 text-sky-300 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Stop Expanded Card Details (Below Map) */}
      {activeStop && (
        <div className="bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 px-2 py-0.5 rounded-md">
                  Stop #{activeStopIndex + 1} of {validStops.length}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {activeStop.Time.slice(0, 5)} น.
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {lang === 'TH' ? activeStop.ActivityNameTH : activeStop.ActivityNameEN}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                <span>{activeStop.LocationName}</span>
              </p>
            </div>

            {/* Quick Map Coordinates Indicator */}
            <div className="text-right text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {activeStop.Latitude}°N, {activeStop.Longitude}°E
            </div>
          </div>

          {/* Tour Note / Alert */}
          {activeStop.Note && (
            <div className="text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 p-2.5 rounded-xl font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{activeStop.Note}</span>
            </div>
          )}

          {/* Stop Photo if available */}
          {activeStop.ImageURL && (
            <div className="rounded-xl overflow-hidden h-36 w-full bg-slate-100 dark:bg-slate-900">
              <img
                src={activeStop.ImageURL}
                alt={activeStop.ActivityNameEN}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          )}

          {/* Actions & Next Stops Row */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between">
            <button
              onClick={onSwitchToList}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'TH' ? '📋 สลับไปดูแบบตารางเวลา (List View)' : '📋 Switch to List View'}</span>
            </button>

            <a
              href={
                activeStop.MapURL ||
                `https://maps.google.com/?q=${activeStop.Latitude},${activeStop.Longitude}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 transition-colors"
            >
              <span>{lang === 'TH' ? 'เปิดแผนที่เต็มจอ' : 'Open in Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
