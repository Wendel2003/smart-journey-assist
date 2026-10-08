import React, { useState } from 'react';
import { ItineraryItem, Trip } from '../types.ts';
import { ItineraryMapView } from './ItineraryMapView.tsx';
import {
  Utensils,
  Users,
  Camera,
  Plane,
  Clock,
  MapPin,
  ExternalLink,
  Calendar,
  AlertCircle,
  Bus,
  Sparkles,
  Map,
  ListFilter,
  Navigation,
} from 'lucide-react';

interface ItineraryTimelineProps {
  itinerary: ItineraryItem[];
  trip: Trip;
  lang: 'TH' | 'EN';
  initialViewMode?: 'list' | 'map';
}

const activityIcons: Record<string, React.ReactNode> = {
  Meal: <Utensils className="w-4 h-4 text-amber-600" />,
  Meeting: <Users className="w-4 h-4 text-blue-600" />,
  Attraction: <Camera className="w-4 h-4 text-sky-600" />,
  Transport: <Bus className="w-4 h-4 text-emerald-600" />,
};

const activityTypeBadges: Record<string, { th: string; en: string; color: string }> = {
  Meal: { th: 'มื้ออาหาร', en: 'Meal', color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60' },
  Meeting: { th: 'เวลานัดพบ', en: 'Gathering', color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60' },
  Attraction: { th: 'ท่องเที่ยว', en: 'Sightseeing', color: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60' },
  Transport: { th: 'การเดินทาง', en: 'Coach', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60' },
};

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  trip,
  lang,
  initialViewMode = 'list',
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'list' | 'map'>(initialViewMode);
  const [focusedStopId, setFocusedStopId] = useState<string | undefined>(undefined);

  const days = [
    { day: 1, dateTH: '20 พ.ย.', dateEN: '20 Nov', label: 'โตเกียว / สกายทรี / วัดเซ็นโซจิ / ชินจูกุ' },
    { day: 2, dateTH: '21 พ.ย.', dateEN: '21 Nov', label: 'ภูเขาไฟฟูจิ ชั้น 5 / ฮาโกเน่ / ล่องเรือโจรสลัด' },
    { day: 3, dateTH: '22 พ.ย.', dateEN: '22 Nov', label: 'ทะเลสาบคาวากุจิโกะ / สวนโออิชิ / ออนเซ็น' },
    { day: 4, dateTH: '23 พ.ย.', dateEN: '23 Nov', label: 'ชิบูย่า สกาย / ฮาราจูกุ / ช้อปปิ้งกินซ่า' },
    { day: 5, dateTH: '24 พ.ย.', dateEN: '24 Nov', label: 'ช้อปปิ้งอิออนมอลล์ / สนามบินนาริตะ สู่ กทม.' },
  ];

  // Filter itinerary stops for current selected day
  const currentDayItems = itinerary.filter((item) => item.DayNo === String(selectedDay));
  const activeItems = currentDayItems.length > 0 ? currentDayItems : itinerary;

  const handleFocusOnMap = (itineraryId: string) => {
    setFocusedStopId(itineraryId);
    setViewMode('map');
  };

  return (
    <div className="space-y-3.5 animate-fade-in">
      {/* View Mode Segmented Toggle & Day Summary Bar */}
      <div className="bg-white dark:bg-slate-800/95 p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 pl-1">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
            <span>{lang === 'TH' ? `กำหนดการ Day ${selectedDay}` : `Day ${selectedDay} Schedule`}</span>
          </span>
          <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60 font-mono">
            {activeItems.length} {lang === 'TH' ? 'จุดแวะ' : 'stops'}
          </span>
        </div>

        {/* Tactile Segmented Toggle Switch */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-800 text-[#0A2540] dark:text-white shadow-xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{lang === 'TH' ? 'รายการ' : 'List'}</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-[#0A2540] dark:bg-blue-600 text-white shadow-xs font-extrabold ring-1 ring-blue-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'TH' ? 'แผนที่' : 'Map'}</span>
          </button>
        </div>
      </div>

      {/* Day Selector Navigation Pills */}
      <div className="bg-white dark:bg-slate-800/95 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span>{lang === 'TH' ? 'เลือกวันเดินทาง (Day):' : 'Select Day:'}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 hidden sm:inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{lang === 'TH' ? 'แคชออฟไลน์พร้อมใช้' : 'Offline Ready'}</span>
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
              {lang === 'TH' ? `วันที่ ${selectedDay} จาก 5 วัน` : `Day ${selectedDay} of 5`}
            </span>
          </div>
        </div>

        {/* Day Selector Buttons Grid */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 w-full">
          {days.map((d) => {
            const isActive = selectedDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => {
                  setSelectedDay(d.day);
                  setFocusedStopId(undefined);
                }}
                className={`w-full py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl sm:rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[50px] sm:min-h-[56px] ${
                  isActive
                    ? 'bg-[#0A2540] dark:bg-blue-600 text-white shadow-md shadow-blue-950/20 ring-2 ring-blue-500/40 transform scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-600/70 border border-slate-200/90 dark:border-slate-600/80'
                }`}
              >
                <span className="text-[11px] sm:text-xs font-bold leading-tight whitespace-nowrap">
                  {lang === 'TH' ? `วันที่ ${d.day}` : `Day ${d.day}`}
                </span>
                <span
                  className={`text-[9px] sm:text-[11px] font-medium mt-0.5 whitespace-nowrap leading-none ${
                    isActive ? 'text-sky-300 dark:text-sky-100 font-semibold' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {lang === 'TH' ? d.dateTH : d.dateEN}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#0F3A66] to-[#144F8C] dark:from-[#051424] dark:via-[#0A2440] dark:to-[#0F355C] text-white p-4 sm:p-5 rounded-3xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
              {lang === 'TH' ? `กำหนดการวันที่ ${selectedDay}` : `Day ${selectedDay} Itinerary`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sky-100 font-medium">
            <Calendar className="w-3.5 h-3.5 text-sky-300" />
            <span>{days[selectedDay - 1].dateTH} 2569</span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white">
          {days[selectedDay - 1].label}
        </h3>

        {/* Tour Leader Tip */}
        <div className="mt-3 text-xs bg-white/10 dark:bg-white/5 backdrop-blur-xs border border-white/15 dark:border-white/10 p-2.5 rounded-xl text-sky-100 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <span>
            {lang === 'TH'
              ? 'คำแนะนำจากหัวหน้าทัวร์: โปรดตรงต่อเวลา พกเสื้อกันลม และพกหนังสือเดินทางติดตัวเสมอ'
              : 'Tour Leader Tip: Please be on time, bring a jacket, and always keep your passport handy.'}
          </span>
        </div>
      </div>

      {/* RENDER VIEW: MAP OR LIST */}
      {viewMode === 'map' ? (
        <ItineraryMapView
          itinerary={activeItems}
          trip={trip}
          selectedDay={selectedDay}
          initialSelectedStopId={focusedStopId}
          lang={lang}
          onSwitchToList={() => setViewMode('list')}
        />
      ) : (
        /* Timeline Items List View */
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {activeItems.map((item, index) => {
            const badge = activityTypeBadges[item.ActivityType] || {
              th: item.ActivityType,
              en: item.ActivityType,
              color: 'bg-slate-100 text-slate-700',
            };

            return (
              <div
                key={item.ItineraryID}
                id={`itinerary-item-${item.ItineraryID}`}
                className="relative bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-xs hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
              >
                {/* Timeline marker node */}
                <div className="absolute -left-[30px] top-4 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-600 flex items-center justify-center shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                </div>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700/80 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                      <span>{item.Time.slice(0, 5)} น.</span>
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}
                    >
                      {lang === 'TH' ? badge.th : badge.en}
                    </span>
                    {item.EstimatedDuration && (
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 rounded hidden sm:inline-block">
                        ⏱ {item.EstimatedDuration}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    #{index + 1}
                  </span>
                </div>

                {/* Title & details */}
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {lang === 'TH' ? item.ActivityNameTH : item.ActivityNameEN}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
                  <span>{item.LocationName}</span>
                </div>

                {/* Note / Alert inside schedule */}
                {item.Note && (
                  <div className="mt-2 text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{item.Note}</span>
                  </div>
                )}

                {/* Optional Photo (e.g. Tokyo Skytree, Sensoji) */}
                {item.ImageURL && (
                  <div className="mt-3 rounded-xl overflow-hidden h-36 w-full bg-slate-100 dark:bg-slate-900">
                    <img
                      src={item.ImageURL}
                      alt={item.ActivityNameEN}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                  </div>
                )}

                {/* Action Buttons: View on Map & Google Maps */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between">
                  <button
                    onClick={() => handleFocusOnMap(item.ItineraryID)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Map className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'TH' ? 'ดูบนแผนที่นำทาง' : 'View on Map'}</span>
                  </button>

                  {item.MapURL && (
                    <a
                      href={item.MapURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <span>{lang === 'TH' ? 'Google Maps' : 'Google Maps'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

