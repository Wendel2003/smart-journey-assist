import React, { useState } from 'react';
import { Hotel } from '../types.ts';
import { speakText } from '../utils/speech.ts';
import {
  Car,
  Volume2,
  Maximize2,
  Minimize2,
  Phone,
  Navigation,
  Building,
  Clock,
} from 'lucide-react';

interface TaxiHotelCardProps {
  hotel: Hotel;
  lang: 'TH' | 'EN';
}

export const TaxiHotelCard: React.FC<TaxiHotelCardProps> = ({ hotel, lang }) => {
  const [fullscreen, setFullscreen] = useState(false);

  const handleSpeak = () => {
    speakText(hotel.TaxiMessageLocal, 'ja-JP');
  };

  return (
    <div id={`hotel-card-${hotel.HotelID}`} className="bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs">
      {/* Fullscreen Mode for Driver */}
      {fullscreen && (
        <div className="fixed inset-0 z-60 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold tracking-wider text-amber-400 uppercase bg-amber-950/80 border border-amber-500/40 px-3 py-1.5 rounded-full">
              タクシー運転手様へ (To Taxi Driver)
            </span>
            <button
              onClick={() => setFullscreen(false)}
              className="p-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-700"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
          </div>

          <div className="my-auto space-y-8 max-w-xl mx-auto text-left">
            <div className="space-y-4 bg-slate-900/90 border border-slate-700 p-6 sm:p-8 rounded-3xl">
              <p className="text-3xl sm:text-5xl font-black leading-tight text-amber-300">
                {hotel.TaxiMessageLocal}
              </p>
              <div className="h-px bg-slate-700 my-4"></div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {hotel.HotelNameLocal}
              </p>
              <p className="text-base sm:text-xl font-medium text-slate-300">
                住所: {hotel.AddressLocal || hotel.AddressEN}
              </p>
              <p className="text-base sm:text-xl font-mono text-slate-400">
                TEL: {hotel.Phone}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleSpeak}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-4 rounded-2xl text-base shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Volume2 className="w-5 h-5" />
              <span>{lang === 'TH' ? 'อ่านออกเสียงภาษาญี่ปุ่น' : 'Speak to Driver'}</span>
            </button>
            <button
              onClick={() => setFullscreen(false)}
              className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-white text-base"
            >
              {lang === 'TH' ? 'ปิดหน้าจอ' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Header with Photo & Hotel Name */}
      <div className="relative h-40 sm:h-48 w-full bg-slate-900 overflow-hidden">
        <img
          src={hotel.ImageURL}
          alt={hotel.HotelNameEN}
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>

        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-700">
          <Building className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'TH' ? 'โรงแรมที่พักหลัก' : 'Official Hotel'}</span>
        </div>

        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-xl sm:text-2xl font-bold tracking-tight">
            {hotel.HotelNameEN}
          </p>
          <p className="text-sm font-medium text-amber-300">
            {hotel.HotelNameLocal}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Japanese Driver Callout Card */}
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'TH' ? 'บัตรยื่นให้คนขับแท็กซี่ญี่ปุ่น' : 'Taxi Destination Card'}</span>
            </span>
            <span className="text-[11px] font-medium text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
              {lang === 'TH' ? 'กดเปิดจอใหญ่ได้' : 'Expandable'}
            </span>
          </div>

          <p className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-amber-100 leading-relaxed font-sans bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-200 dark:border-amber-700/60 shadow-xs">
            {hotel.TaxiMessageLocal}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
            <strong className="text-slate-900 dark:text-white">{hotel.AddressLocal || hotel.AddressEN}</strong>
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={handleSpeak}
              id="taxi-speak-btn"
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === 'TH' ? 'อ่านออกเสียง' : 'Speak'}</span>
            </button>

            <button
              onClick={() => setFullscreen(true)}
              id="taxi-expand-btn"
              className="flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 text-xs font-bold py-2 px-3.5 rounded-xl border border-amber-300 dark:border-amber-700 transition-all cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>{lang === 'TH' ? 'แสดงการ์ดเต็มจอ' : 'Show Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Hotel Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Check-in</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{hotel.CheckInTime.slice(0, 5)} น.</span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Check-out</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{hotel.CheckOutTime.slice(0, 5)} น.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <a
            href={`tel:${hotel.Phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors border border-slate-200 dark:border-slate-600"
          >
            <Phone className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span>{lang === 'TH' ? 'โทร Front Desk โรงแรม' : 'Call Hotel Front'}</span>
          </a>

          <a
            href={hotel.MapURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#0A2540] hover:bg-[#133A63] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors shadow-xs"
          >
            <Navigation className="w-4 h-4 text-sky-400" />
            <span>{lang === 'TH' ? 'นำทางไปโรงแรม (Maps)' : 'Hotel Directions'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
