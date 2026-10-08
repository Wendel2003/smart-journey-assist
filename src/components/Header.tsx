import React from 'react';
import { Trip, Traveler } from '../types.ts';
import { AlertTriangle, Globe, LogOut, Moon, Sun, User } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface HeaderProps {
  trip: Trip;
  traveler?: Traveler | null;
  lang: 'TH' | 'EN';
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onToggleLang: () => void;
  onOpenEmergency: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  trip,
  traveler,
  lang,
  theme = 'light',
  onToggleTheme,
  onToggleLang,
  onOpenEmergency,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0A2540] text-white border-b border-[#143B66] shadow-md">
      {/* Top micro status bar */}
      <div className="bg-[#071B30] text-white text-[11px] px-3 sm:px-4 py-1.5 border-b border-[#0F2F52]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{trip.Status === 'On Trip' ? (lang === 'TH' ? 'กำลังเดินทาง' : 'On Trip') : trip.Status}</span>
            </span>
            <span className="text-[#3A6B9B] hidden xs:inline">•</span>
            <span className="font-mono font-semibold text-sky-200">
              Trip Code: {trip.TripID}
            </span>
            {traveler && (
              <>
                <span className="text-[#3A6B9B] hidden sm:inline">•</span>
                <span className="hidden sm:inline text-sky-300 font-medium">
                  👤 {traveler.FullNameTH}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <PWAInstallButton lang={lang} compact={true} />
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded-md hover:bg-[#133860] border border-transparent hover:border-[#23558D] transition-colors text-[10px] sm:text-[11px] font-medium cursor-pointer"
                title="ออกจากระบบ / สลับผู้เดินทาง"
              >
                <LogOut className="w-3 h-3 text-slate-400" />
                <span className="hidden xs:inline">ออกจากระบบ</span>
              </button>
            )}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                id="theme-toggle-btn"
                className="flex items-center gap-1 text-sky-200 hover:text-white px-2 py-0.5 rounded-md bg-[#133860] hover:bg-[#1C4E84] border border-[#23558D] transition-colors text-[11px] font-medium cursor-pointer"
                title={theme === 'dark' ? (lang === 'TH' ? 'เปลี่ยนเป็นธีมสว่าง' : 'Switch to Light Mode') : (lang === 'TH' ? 'เปลี่ยนเป็นธีมมืด (ประหยัดแบตเตอรี่)' : 'Switch to Dark Mode')}
                aria-label="Toggle dark mode theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden xs:inline text-[10px]">{lang === 'TH' ? 'สว่าง' : 'Light'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-sky-300" />
                    <span className="hidden xs:inline text-[10px]">{lang === 'TH' ? 'มืด' : 'Dark'}</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={onToggleLang}
              id="lang-toggle-btn"
              className="flex items-center gap-1 text-sky-200 hover:text-white px-2.5 py-0.5 rounded-md bg-[#133860] hover:bg-[#1C4E84] border border-[#23558D] transition-colors text-[11px] font-medium cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3 h-3 text-sky-300" />
              <span>{lang === 'TH' ? 'TH | EN' : 'EN | TH'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center bg-transparent">
            <img
              src="/app-logo.png"
              alt="Smart Journey Assist Logo"
              className="w-full h-full object-contain bg-transparent drop-shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 leading-tight whitespace-nowrap">
              <span className="text-xs sm:text-sm font-black tracking-tight text-white uppercase">
                Smart
              </span>
              <span className="text-xs sm:text-sm font-black tracking-tight text-[#F58220] uppercase">
                Journey
              </span>
              <span className="text-xs sm:text-sm font-black tracking-tight text-white uppercase">
                Assist
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-sky-300 tracking-wide leading-none mt-0.5 truncate">
              By Grandworld Holiday
            </p>
          </div>
        </div>

        {/* SOS Action Button */}
        <div className="flex items-center shrink-0">
          <button
            id="header-sos-btn"
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all text-white font-black text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-md shadow-red-950/40 border border-red-400/40 cursor-pointer whitespace-nowrap"
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce shrink-0" />
            <span className="tracking-wider inline sm:hidden">SOS</span>
            <span className="tracking-wider hidden sm:inline">EMERGENCY SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};

