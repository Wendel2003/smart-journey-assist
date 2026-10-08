import React, { useState } from 'react';
import { Traveler, Trip, Hotel, Contact } from '../types.ts';
import {
  ShieldCheck,
  Phone,
  Hotel as HotelIcon,
  UserCheck,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { PassportModal } from './PassportModal.tsx';

interface DigitalIdCardProps {
  traveler: Traveler;
  trip: Trip;
  hotel: Hotel;
  tourLeader: Contact;
  lang: 'TH' | 'EN';
  onLogout?: () => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  traveler,
  trip,
  hotel,
  tourLeader,
  lang,
  onLogout,
}) => {
  const [showSensitive, setShowSensitive] = useState<boolean>(false);
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false);

  // Mask phone e.g. 0812345678 -> 081-XXX-5678
  const formatMaskedPhone = (phone: string) => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
      return `${clean.slice(0, 3)}-XXX-${clean.slice(7)}`;
    }
    return phone;
  };

  return (
    <div id="traveler-digital-card" className="max-w-md mx-auto">
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800/95 text-slate-900 dark:text-white">
        {/* Card Header styling */}
        <div className="bg-gradient-to-br from-[#071C33] via-[#0A2540] to-[#144F8C] text-white p-5 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-sky-200">
                TOUR MEMBER PASS
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-md font-medium flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>{lang === 'TH' ? 'ส่วนตัว' : 'Private'}</span>
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              {traveler.TravelerID}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/40 shadow-md shrink-0 bg-slate-800 cursor-pointer hover:border-sky-300 transition-colors"
              onClick={() => setShowPassportModal(true)}
              title={lang === 'TH' ? 'คลิกดูข้อมูลหนังสือเดินทาง / เปลี่ยนรูป' : 'Click to view passport'}
            >
              <img
                src={localStorage.getItem(`traveler_photo_${traveler.TravelerID}`) || traveler.PhotoURL || '/traveler-photo.jpg'}
                alt={traveler.FullNameEN}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/traveler-photo.jpg';
                }}
              />
            </div>
            <div className="space-y-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>{traveler.Nickname}</span>
                <span className="text-sm font-normal text-sky-200">({traveler.FullNameTH})</span>
              </h2>
              <p className="text-xs font-mono tracking-wider text-slate-300 uppercase truncate">
                {traveler.FullNameEN}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{trip.TripName}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-sky-300 font-semibold">{trip.TripID}</span>
          </div>
        </div>

        {/* Member Card Body */}
        <div className="p-5 flex flex-col items-center text-center">
          {/* Privacy Control Bar */}
          <div className="w-full flex items-center justify-between mb-3 px-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'TH' ? 'การปกป้องข้อมูลส่วนบุคคล' : 'Privacy Protection'}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowSensitive(!showSensitive)}
              className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 font-bold cursor-pointer"
            >
              {showSensitive ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  <span>{lang === 'TH' ? 'ซ่อนเบอร์' : 'Hide Details'}</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  <span>{lang === 'TH' ? 'แสดงเบอร์เต็ม' : 'Show Details'}</span>
                </>
              )}
            </button>
          </div>

          {/* Member Details Table */}
          <div className="w-full bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 text-xs space-y-2.5 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400">{lang === 'TH' ? 'เบอร์ติดต่อ' : 'Mobile Phone'}</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {showSensitive ? traveler.Mobile : formatMaskedPhone(traveler.Mobile)}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400">{lang === 'TH' ? 'หนังสือเดินทาง' : 'Passport'}</span>
              <button
                type="button"
                onClick={() => setShowPassportModal(true)}
                className="font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 font-mono flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>
                  {showSensitive
                    ? (traveler.PassportNumber || 'AC4892011')
                    : `${(traveler.PassportNumber || 'AC4892011').slice(0, 2)}••••${(traveler.PassportNumber || 'AC4892011').slice(-2)}`}
                </span>
              </button>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400">{lang === 'TH' ? 'สถานะบัตรฉุกเฉิน' : 'Emergency Card'}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>{traveler.EmergencyCardEnabled === 'Yes' ? 'เปิดใช้งาน (Active)' : 'Disabled'}</span>
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400">{lang === 'TH' ? 'หัวหน้าทัวร์' : 'Tour Leader'}</span>
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-rose-500" />
                {tourLeader.Name} ({tourLeader.Phone})
              </span>
            </div>

            <div className="flex justify-between items-start pt-0.5">
              <span className="text-slate-500 dark:text-slate-400">{lang === 'TH' ? 'โรงแรม' : 'Hotel'}</span>
              <span className="font-semibold text-slate-900 dark:text-white text-right flex items-center gap-1">
                <HotelIcon className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[180px]">{hotel.HotelNameEN}</span>
              </span>
            </div>
          </div>

          {/* Dedicated Passport Action Button */}
          <button
            type="button"
            id="btn-view-passport"
            onClick={() => setShowPassportModal(true)}
            className="w-full mt-3.5 flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50/40 dark:from-amber-950/30 dark:via-amber-950/20 dark:to-orange-950/20 border border-amber-300 dark:border-amber-700/70 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-all text-left cursor-pointer group shadow-xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-amber-100 flex items-center gap-1.5">
                  <span>{lang === 'TH' ? 'ดูข้อมูลพาสปอร์ต (Passport)' : 'View Passport Details'}</span>
                  <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold px-1.5 py-0.2 rounded font-mono">
                    THAILAND
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {showSensitive
                    ? (traveler.PassportNumber || 'AC4892011')
                    : `${(traveler.PassportNumber || 'AC4892011').slice(0, 2)}••••${(traveler.PassportNumber || 'AC4892011').slice(-2)}`}{' '}
                  • {lang === 'TH' ? 'คลิกเพื่อดูเล่มเต็ม & คัดลอกเลข' : 'Click to view full & copy'}
                </div>
              </div>
            </div>

            <div className="flex items-center text-xs font-bold text-amber-800 dark:text-amber-300 gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
              <span className="text-[11px]">{lang === 'TH' ? 'เปิดดู' : 'View'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Privacy Footer */}
        <div className="bg-slate-100 dark:bg-slate-900/90 px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px]">
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'TH' ? 'ผูกสิทธิ์เฉพาะอุปกรณ์ของคุณ' : 'Bound to your personal device'}</span>
          </span>
          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-medium text-[10px] cursor-pointer hover:underline"
            >
              <LogOut className="w-3 h-3" />
              <span>{lang === 'TH' ? 'ออกจากระบบ / สลับทริป' : 'Switch / Log out'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Full Digital Passport Modal */}
      <PassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        traveler={traveler}
        lang={lang}
      />
    </div>
  );
};
