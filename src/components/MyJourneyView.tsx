import React, { useState, useRef } from 'react';
import { Trip, Traveler, Hotel, Contact } from '../types.ts';
import { DigitalIdCard } from './DigitalIdCard.tsx';
import { motion } from 'motion/react';
import {
  Plane,
  Building,
  UserCheck,
  ShieldCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  RotateCcw,
} from 'lucide-react';

// Japanese Autumn Momiji Leaves particles
interface LeafParticle {
  id: number;
  startX: number;
  sway: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  rotationSpeed: number;
}

const LEAF_PARTICLES: LeafParticle[] = [
  { id: 1, startX: 8, sway: 32, size: 17, duration: 7.2, delay: 0.2, color: '#E11D48', rotationSpeed: 380 },
  { id: 2, startX: 22, sway: -28, size: 21, duration: 8.8, delay: 1.6, color: '#EA580C', rotationSpeed: -290 },
  { id: 3, startX: 38, sway: 36, size: 15, duration: 7.9, delay: 3.1, color: '#F59E0B', rotationSpeed: 430 },
  { id: 4, startX: 52, sway: -32, size: 19, duration: 6.8, delay: 0.7, color: '#DC2626', rotationSpeed: 310 },
  { id: 5, startX: 68, sway: 30, size: 22, duration: 8.4, delay: 2.3, color: '#F97316', rotationSpeed: -370 },
  { id: 6, startX: 82, sway: -36, size: 16, duration: 7.1, delay: 3.9, color: '#E11D48', rotationSpeed: 250 },
  { id: 7, startX: 14, sway: 26, size: 18, duration: 8.6, delay: 5.0, color: '#D97706', rotationSpeed: -330 },
  { id: 8, startX: 44, sway: -30, size: 14, duration: 6.6, delay: 6.0, color: '#FB7185', rotationSpeed: 390 },
  { id: 9, startX: 62, sway: 34, size: 18, duration: 9.2, delay: 4.6, color: '#EA580C', rotationSpeed: -270 },
  { id: 10, startX: 91, sway: -22, size: 20, duration: 7.6, delay: 1.1, color: '#E11D48', rotationSpeed: 350 },
  { id: 11, startX: 30, sway: 24, size: 16, duration: 8.1, delay: 2.9, color: '#F59E0B', rotationSpeed: -310 },
  { id: 12, startX: 76, sway: -26, size: 15, duration: 7.4, delay: 5.5, color: '#DC2626', rotationSpeed: 360 },
];

// Birds soaring across Japanese mountain sky
interface Bird {
  id: number;
  startY: number;
  delay: number;
  duration: number;
  size: number;
  flapSpeed: number;
  verticalArc: number;
}

const BIRDS: Bird[] = [
  // Flight Squadron 1 (Leader + 2 flank birds gliding across Mount Fuji sky)
  { id: 1, startY: 17, delay: 0.3, duration: 9.2, size: 18, flapSpeed: 0.36, verticalArc: -14 },
  { id: 2, startY: 22, delay: 1.1, duration: 9.6, size: 14, flapSpeed: 0.32, verticalArc: -11 },
  { id: 3, startY: 14, delay: 1.5, duration: 9.4, size: 12, flapSpeed: 0.28, verticalArc: -9 },

  // Flight Squadron 2 (Pair soaring peacefully in the distant horizon)
  { id: 4, startY: 9, delay: 5.8, duration: 11.2, size: 11, flapSpeed: 0.40, verticalArc: 7 },
  { id: 5, startY: 12, delay: 6.5, duration: 11.6, size: 9, flapSpeed: 0.35, verticalArc: 8 },
];

interface MyJourneyViewProps {
  trip: Trip;
  traveler: Traveler;
  hotel: Hotel;
  tourLeader: Contact;
  lang: 'TH' | 'EN';
  onLogout?: () => void;
}

export const MyJourneyView: React.FC<MyJourneyViewProps> = ({
  trip,
  traveler,
  hotel,
  tourLeader,
  lang,
  onLogout,
}) => {
  const [customCover, setCustomCover] = useState<string>(() => {
    return localStorage.getItem(`trip_cover_${trip.TripID}`) || '';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomCover(dataUrl);
        try {
          localStorage.setItem(`trip_cover_${trip.TripID}`, dataUrl);
        } catch {
          // Ignore localStorage quota errors
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomCover('');
    localStorage.removeItem(`trip_cover_${trip.TripID}`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Trip Overview Master Card */}
      <div className="bg-white dark:bg-slate-800/95 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 overflow-hidden shadow-sm">
        {/* Cover Photo with Living Atmosphere */}
        <div className="relative h-48 sm:h-60 w-full bg-slate-900 group overflow-hidden">
          {/* Living breathing cinematic zoom on cover photo */}
          <motion.img
            id="trip-cover-image"
            src={customCover || trip.CoverImageURL || '/japan-cover.jpg'}
            alt={trip.TripName}
            className="w-full h-full object-cover origin-center"
            referrerPolicy="no-referrer"
            animate={{
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/japan-cover.jpg';
            }}
          />

          {/* Living Atmosphere: Birds soaring across Mount Fuji sky */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
            {BIRDS.map((bird) => (
              <motion.div
                key={bird.id}
                className="absolute text-slate-800/80 dark:text-slate-900/85 drop-shadow-xs"
                style={{
                  top: `${bird.startY}%`,
                  width: bird.size,
                  height: bird.size * 0.55,
                }}
                initial={{ x: '-20%', opacity: 0 }}
                animate={{
                  x: ['-20%', '120%'],
                  y: [0, bird.verticalArc, 0, -bird.verticalArc * 0.6, 0],
                  opacity: [0, 0.9, 0.9, 0.9, 0],
                }}
                transition={{
                  duration: bird.duration,
                  repeat: Infinity,
                  delay: bird.delay,
                  repeatDelay: 3.5,
                  ease: 'linear',
                }}
              >
                {/* Realistic Flapping Wing Motion */}
                <motion.svg
                  viewBox="0 0 26 14"
                  className="w-full h-full fill-current"
                  animate={{
                    scaleY: [1, 0.25, 1, 0.35, 1],
                    rotate: [0, -4, 4, -2, 0],
                  }}
                  transition={{
                    duration: bird.flapSpeed,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <path d="M0 4 C 5 -1, 10 0, 13 6 C 16 0, 21 -1, 26 4 C 20 7, 16 6, 13 10 C 10 6, 6 7, 0 4 Z" />
                </motion.svg>
              </motion.div>
            ))}
          </div>

          {/* Living Atmosphere: Falling Autumn Momiji Leaves */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
            {LEAF_PARTICLES.map((leaf) => (
              <motion.div
                key={leaf.id}
                className="absolute drop-shadow-sm"
                style={{
                  left: `${leaf.startX}%`,
                  top: '-12%',
                  width: leaf.size,
                  height: leaf.size,
                  color: leaf.color,
                }}
                initial={{ y: '0%', opacity: 0, rotate: 0 }}
                animate={{
                  y: ['0%', '380px'],
                  x: [0, leaf.sway, -leaf.sway * 0.8, leaf.sway * 0.5, 0],
                  rotate: [0, leaf.rotationSpeed],
                  rotateX: [0, 360],
                  rotateY: [0, 180],
                  opacity: [0, 0.95, 0.95, 0.85, 0],
                }}
                transition={{
                  duration: leaf.duration,
                  repeat: Infinity,
                  delay: leaf.delay,
                  ease: 'linear',
                }}
              >
                {/* Stylized Japanese Maple Leaf (Momiji) SVG */}
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                  <path d="M12 2C11 5 8 7 6 6C7 9 5 11 2 11C4 13 3 16 1 17C4 17 6 19 5 22C8 20 10 21 11 23L12 24L13 23C14 21 16 20 19 22C18 19 20 17 23 17C21 16 20 13 22 11C19 11 17 9 18 6C16 7 13 5 12 2Z" />
                </svg>
              </motion.div>
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] dark:from-slate-950 via-[#0A2540]/30 dark:via-slate-950/30 to-transparent pointer-events-none z-10"></div>

          {/* Hidden File Input for Custom Photo Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 z-20 pointer-events-auto">
            <span className="inline-flex items-center gap-1 bg-[#071C33]/85 dark:bg-slate-900/90 backdrop-blur-md text-sky-200 text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-sky-400/30 shadow-xs whitespace-nowrap shrink-0">
              <span className="opacity-70 text-[9px] sm:text-[10px] font-sans font-medium">TRIP</span>
              <span>{trip.TripID}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 bg-[#071C33]/80 dark:bg-slate-900/80 text-amber-300 border border-amber-500/30 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{lang === 'TH' ? 'บรรยากาศมีชีวิต' : 'Living Scene'}</span>
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-1.5 z-20 justify-end pointer-events-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-950/70 hover:bg-slate-900 active:scale-95 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/25 backdrop-blur-md transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 leading-normal"
              title={lang === 'TH' ? 'เปลี่ยนรูปภาพ / อัปโหลดรูป' : 'Change / Upload Photo'}
            >
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-300 shrink-0" />
              <span>{lang === 'TH' ? 'เปลี่ยนรูป' : 'Change'}</span>
            </button>

            {customCover && (
              <button
                type="button"
                onClick={handleResetImage}
                className="inline-flex items-center gap-1 bg-slate-950/70 hover:bg-slate-900 text-slate-200 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-white/20 backdrop-blur-md transition-colors cursor-pointer shrink-0"
                title={lang === 'TH' ? 'รีเซ็ตเป็นรูปเริ่มต้น' : 'Reset to default image'}
              >
                <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-300" />
                <span className="hidden sm:inline">{lang === 'TH' ? 'รีเซ็ต' : 'Reset'}</span>
              </button>
            )}

            <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-emerald-600/90 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs whitespace-nowrap shrink-0 leading-normal backdrop-blur-xs">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
              <span className="hidden xs:inline">{lang === 'TH' ? 'ยืนยันแล้ว' : 'Confirmed'}</span>
              <span className="xs:hidden">{lang === 'TH' ? 'ยืนยัน' : 'OK'}</span>
            </div>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-sky-300 font-semibold mb-1">
              <span>🇯🇵 {trip.Country}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>20 – 24 พฤศจิกายน 2569</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm">
              {trip.TripName}
            </h2>
          </div>
        </div>

        {/* Flight Schedule Details */}
        <div className="p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{lang === 'TH' ? 'ข้อมูลเที่ยวบินไป-กลับ' : 'Flight Information'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Outbound Flight */}
            <div className="bg-[#F4F8FC] dark:bg-slate-900/80 border border-[#D5E3F5] dark:border-slate-700/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 dark:text-blue-300 bg-blue-100/90 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                  <Plane className="w-3 h-3 text-blue-700 dark:text-blue-400" />
                  <span>{lang === 'TH' ? 'เที่ยวบินขาไป' : 'Outbound Flight'}</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  {trip.OutboundFlight}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm block">BKK</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">สุวรรณภูมิ (Bangkok)</span>
                </div>
                <div className="flex flex-col items-center px-3">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">บินตรง 6 ชม.</span>
                  <div className="w-16 h-0.5 bg-blue-300 dark:bg-blue-700 relative my-1">
                    <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-blue-600 dark:border-blue-400 rotate-45"></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm block">NRT</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">นาริตะ (Tokyo)</span>
                </div>
              </div>
            </div>

            {/* Return Flight */}
            <div className="bg-[#F4F8FC] dark:bg-slate-900/80 border border-[#D5E3F5] dark:border-slate-700/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 dark:text-blue-300 bg-blue-100/90 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                  <Plane className="w-3 h-3 text-blue-700 dark:text-blue-400 rotate-90" />
                  <span>{lang === 'TH' ? 'เที่ยวบินขากลับ' : 'Return Flight'}</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  {trip.ReturnFlight}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm block">NRT</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">นาริตะ (Tokyo)</span>
                </div>
                <div className="flex flex-col items-center px-3">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">บินตรง 6.5 ชม.</span>
                  <div className="w-16 h-0.5 bg-blue-300 dark:bg-blue-700 relative my-1">
                    <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-blue-600 dark:border-blue-400 rotate-45"></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm block">BKK</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">สุวรรณภูมิ (Bangkok)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel & Tour Leader Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-xl mt-0.5">
                <Building className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-semibold block text-[10px] uppercase">
                  {lang === 'TH' ? 'โรงแรมที่พักหลัก' : 'Official Tour Hotel'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                  {hotel.HotelNameEN}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{hotel.HotelNameLocal}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex items-start gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 rounded-xl mt-0.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-semibold block text-[10px] uppercase">
                  {lang === 'TH' ? 'หัวหน้าทัวร์ผู้ดูแล' : 'Tour Leader'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                  {tourLeader.Name}
                </span>
                <span className="text-blue-700 dark:text-blue-400 font-mono font-semibold text-[11px]">
                  {tourLeader.Phone}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Digital Pass Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'TH' ? 'บัตรสมาชิกประจำตัวทัวร์' : 'Member Tour Pass'}</span>
          </h3>
        </div>

        <DigitalIdCard
          traveler={traveler}
          trip={trip}
          hotel={hotel}
          tourLeader={tourLeader}
          lang={lang}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
};
