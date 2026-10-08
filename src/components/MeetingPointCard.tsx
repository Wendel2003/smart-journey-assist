import React from 'react';
import { MeetingPoint, Notice } from '../types.ts';
import { MapPin, Navigation, Clock, AlertCircle, PhoneCall } from 'lucide-react';

interface MeetingPointCardProps {
  meetingPoint: MeetingPoint;
  latestNotice?: Notice;
  tourLeaderPhone?: string;
  lang: 'TH' | 'EN';
}

export const MeetingPointCard: React.FC<MeetingPointCardProps> = ({
  meetingPoint,
  latestNotice,
  tourLeaderPhone = '081-234-5678',
  lang,
}) => {
  return (
    <div
      id={`meeting-point-${meetingPoint.MeetingPointID}`}
      className="bg-white dark:bg-slate-800/95 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
    >
      <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={meetingPoint.ImageURL}
          alt={meetingPoint.LocationName}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] dark:from-[#051324] via-[#0A2540]/40 dark:via-[#051324]/50 to-transparent"></div>

        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex items-center gap-1 sm:gap-1.5 bg-[#0A2540]/90 dark:bg-slate-900/90 backdrop-blur-xs text-sky-200 text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full border border-sky-400/30 shadow-xs whitespace-nowrap max-w-[48%]">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-300 shrink-0" />
          <span className="truncate">
            {lang === 'TH' ? `เวลาเดิม: ${meetingPoint.Time.slice(0, 5)} น.` : `Original: ${meetingPoint.Time.slice(0, 5)}`}
          </span>
        </div>

        {latestNotice && (
          <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 flex items-center gap-1 sm:gap-1.5 bg-amber-400 text-slate-950 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-xs border border-amber-500/40 whitespace-nowrap max-w-[48%]">
            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950 shrink-0" />
            <span className="truncate">{lang === 'TH' ? 'เวลาใหม่: 08:30 น.' : 'Updated: 08:30'}</span>
          </div>
        )}

        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-xs uppercase tracking-wider text-sky-300 font-semibold mb-0.5">
            {lang === 'TH' ? 'จุดรวมพลหลัก' : 'Active Gathering Point'}
          </p>
          <h2 className="text-lg sm:text-xl font-bold leading-tight drop-shadow-xs">
            {lang === 'TH' ? meetingPoint.TitleTH : meetingPoint.TitleEN}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{meetingPoint.LocationName}</span>
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="bg-[#F4F8FC] dark:bg-slate-900/80 border border-[#D5E3F5] dark:border-slate-700 rounded-2xl p-3.5 mb-4">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/60 rounded-xl text-blue-700 dark:text-blue-400 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-900 dark:text-sky-300 uppercase tracking-wider">
                {lang === 'TH' ? 'จุดสังเกต (Landmark):' : 'Landmark Details:'}
              </span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {meetingPoint.LandmarkDetailTH}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                GPS: {meetingPoint.Latitude}, {meetingPoint.Longitude}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href={meetingPoint.MapURL}
            target="_blank"
            rel="noopener noreferrer"
            id="meeting-point-map-btn"
            className="flex items-center justify-center gap-2 bg-[#0A2540] hover:bg-[#133A63] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-xs"
          >
            <Navigation className="w-4 h-4 text-sky-400" />
            <span>{lang === 'TH' ? 'เปิด Google Maps' : 'Open Google Maps'}</span>
          </a>

          <a
            href={`tel:${tourLeaderPhone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold text-sm py-2.5 px-4 rounded-xl transition-all border border-slate-200 dark:border-slate-600"
          >
            <PhoneCall className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span>{lang === 'TH' ? 'โทรหาหัวหน้าทัวร์' : 'Call Tour Leader'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
