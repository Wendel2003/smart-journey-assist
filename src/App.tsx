import React, { useState } from 'react';
import {
  currentTrip,
  travelersList,
  noticesList,
  meetingPointsList,
  phrasesList,
  itineraryList,
  mainHotel,
  emergencyProceduresList,
  contactsList,
  appConfig,
} from './data/mockData.ts';
import { Traveler } from './types.ts';
import { Header } from './components/Header.tsx';
import { NoticeBanner } from './components/NoticeBanner.tsx';
import { MeetingPointCard } from './components/MeetingPointCard.tsx';
import { ItineraryTimeline } from './components/ItineraryTimeline.tsx';
import { TaxiHotelCard } from './components/TaxiHotelCard.tsx';
import { DigitalIdCard } from './components/DigitalIdCard.tsx';
import { PhrasesList } from './components/PhrasesList.tsx';
import { ContactsDirectory } from './components/ContactsDirectory.tsx';
import { EmergencyModal } from './components/EmergencyModal.tsx';
import { LocationShareCard } from './components/LocationShareCard.tsx';
import { MyJourneyView } from './components/MyJourneyView.tsx';
import { MessagesView } from './components/MessagesView.tsx';
import { LoginView } from './components/LoginView.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { TokyoWeatherWidget } from './components/TokyoWeatherWidget.tsx';
import { AnimatedGreatWaveNavBg } from './components/AnimatedGreatWaveNavBg.tsx';
import { useTheme } from './hooks/useTheme.ts';
import { motion } from 'motion/react';
import {
  initOfflineStorage,
  getOfflineCacheStats,
  OfflineCacheStats,
} from './services/offlineStorage.ts';
import {
  Calendar,
  Luggage,
  MapPin,
  Building,
  PhoneCall,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Home,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Crown,
  Plane,
  Car,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'TH' | 'EN'>(appConfig.DefaultLanguage);
  const { theme, toggleTheme } = useTheme();

  // Authentication & Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Check if traveler previously logged in
    const savedId = localStorage.getItem('sja_logged_in_traveler_id');
    return !!savedId;
  });

  const [currentTraveler, setCurrentTraveler] = useState<Traveler>(() => {
    const savedId = localStorage.getItem('sja_logged_in_traveler_id');
    const found = travelersList.find((t) => t.TravelerID === savedId);
    return found || travelersList[0];
  });

  const handleLoginSuccess = (traveler: Traveler) => {
    setCurrentTraveler(traveler);
    setIsLoggedIn(true);
    localStorage.setItem('sja_logged_in_traveler_id', traveler.TravelerID);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('sja_logged_in_traveler_id');
    setCurrentView('home');
  };

  // Main active view state
  const [currentView, setCurrentView] = useState<
    'home' | 'today' | 'journey' | 'meeting' | 'hotel' | 'contact' | 'emergency' | 'messages' | 'phrases'
  >('home');

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [cacheStats, setCacheStats] = useState<OfflineCacheStats>(() => initOfflineStorage());

  // If user is not logged in, display the Login / Welcome / QR Scan screen
  if (!isLoggedIn) {
    return (
      <LoginView
        trip={currentTrip}
        travelers={travelersList}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Find primary Tour Leader
  const tourLeader =
    contactsList.find((c) => c.ContactID === currentTrip.TourLeaderContactID) ||
    contactsList[0];

  const primaryNotice = noticesList[0];
  const primaryMeetingPoint = meetingPointsList[0];

  // Japan local time string (UTC+9) & Thailand time (UTC+7)
  const now = new Date();
  const jstFormatter = new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const bkkFormatter = new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const jstTime = jstFormatter.format(now);
  const bkkTime = bkkFormatter.format(now);

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 sm:pb-16 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header with Deep Navy Blue branding */}
      <Header
        trip={currentTrip}
        traveler={currentTraveler}
        lang={lang}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleLang={() => setLang(lang === 'TH' ? 'EN' : 'TH')}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-3.5 sm:px-4 pt-3.5 flex-1">
        {/* Offline Alert Banner (appears only when connection is lost) */}
        <OfflineIndicator
          stats={cacheStats}
          onRefreshCache={setCacheStats}
          lang={lang}
        />

        {/* Navigation Breadcrumb when inside a subview */}
        {currentView !== 'home' && (
          <div className="mb-3.5 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A2540] dark:text-sky-300 hover:text-blue-700 dark:hover:text-sky-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>{lang === 'TH' ? 'กลับหน้าแรก' : 'Back to Home'}</span>
            </button>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {currentView === 'today' && (lang === 'TH' ? 'กำหนดการท่องเที่ยว' : 'Daily Schedule')}
              {currentView === 'journey' && (lang === 'TH' ? 'ข้อมูลการเดินทาง' : 'My Journey')}
              {currentView === 'meeting' && (lang === 'TH' ? 'จุดนัดพบ' : 'Meeting Point')}
              {currentView === 'hotel' && (lang === 'TH' ? 'ที่พัก & แท็กซี่' : 'Hotel & Taxi')}
              {currentView === 'contact' && (lang === 'TH' ? 'ติดต่อเรา' : 'Contacts Directory')}
              {currentView === 'emergency' && (lang === 'TH' ? 'ขอความช่วยเหลือฉุกเฉิน' : 'Emergency SOS')}
              {currentView === 'messages' && (lang === 'TH' ? 'ประกาศสำคัญ' : 'Trip Notices')}
              {currentView === 'phrases' && (lang === 'TH' ? 'ประโยคภาษาญี่ปุ่น' : 'Japanese Phrases')}
            </span>
          </div>
        )}

        {/* =========================================================================
            VIEW 1: HOME VIEW (Dashboard with Hero Banner + 6 Menu Buttons + Quick Look)
           ========================================================================= */}
        {currentView === 'home' && (
          <div className="space-y-4 animate-fade-in">
            {/* HERO BANNER - Guidebook Styling (Deep Navy Blue #0A2540 with Fuji accent) */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071C33] via-[#0A2540] to-[#123E6B] text-white p-5 sm:p-6 shadow-md border border-[#143B66]">
              {/* Subtle background decorative shapes */}
              <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

              {/* Continuously moving JAPAN background typography */}
              <div className="absolute inset-x-0 -top-2 sm:-top-4 overflow-hidden pointer-events-none select-none z-0">
                <motion.div
                  className="flex w-max whitespace-nowrap text-7xl sm:text-8xl font-black tracking-widest text-white/[0.08] dark:text-white/[0.06]"
                  animate={{
                    x: ['0%', '-50%'],
                    y: [0, -3, 0, 3, 0],
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: 'loop',
                      duration: 20,
                      ease: 'linear',
                    },
                    y: {
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 4,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  <div className="flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
                    <span>JAPAN</span>
                    <span className="text-3xl sm:text-4xl opacity-30">•</span>
                    <span>JAPAN</span>
                    <span className="text-3xl sm:text-4xl opacity-30">•</span>
                    <span>JAPAN</span>
                    <span className="text-3xl sm:text-4xl opacity-30">•</span>
                    <span>JAPAN</span>
                    <span className="text-3xl sm:text-4xl opacity-30">•</span>
                  </div>
                  <div className="flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
                    <span>JAPAN</span>
                    <span className="text-3xl sm:text-4xl opacity-30">•</span>
                    <span>JAPAN</span>
                    <span className="text-3xl sm:text-4xl opacity-30">•</span>
                    <span>JAPAN</span>
                    <span className="text-3xl sm:text-4xl opacity-30">•</span>
                    <span>JAPAN</span>
                    <span className="text-3xl sm:text-4xl opacity-30">•</span>
                  </div>
                </motion.div>
              </div>

              <div className="relative z-10 space-y-3">
                {/* Greeting & Traveler Name with Crown Icon 👑 */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-sky-300">
                    {lang === 'TH' ? 'สวัสดีค่ะ' : 'Welcome'}
                  </p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                      <span>{currentTraveler.NameTH}</span>
                      <Crown className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-sm" />
                    </h2>
                  </div>
                </div>

                {/* Trip Meta Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                  <span className="bg-[#12365D] text-sky-200 px-2.5 py-1 rounded-full font-mono font-bold border border-sky-400/30">
                    {currentTrip.TripID}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{lang === 'TH' ? 'กำลังเดินทาง (วันที่ 1/5)' : 'Day 1 of 5'}</span>
                  </span>
                  <span className="text-slate-300 font-light hidden sm:inline">
                    20 – 24 พฤศจิกายน 2569
                  </span>
                </div>

                {/* Dual Clocks Widget */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 flex items-center gap-2.5 border border-white/10">
                    <span className="text-lg">🇯🇵</span>
                    <div>
                      <span className="text-[10px] text-sky-200 block font-semibold uppercase">
                        {lang === 'TH' ? 'เวลาญี่ปุ่น (JST)' : 'Tokyo Time'}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-extrabold text-white leading-none">
                        {jstTime} น.
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 flex items-center gap-2.5 border border-white/10">
                    <span className="text-lg">🇹🇭</span>
                    <div>
                      <span className="text-[10px] text-sky-200 block font-semibold uppercase">
                        {lang === 'TH' ? 'เวลาไทย (ICT)' : 'Bangkok Time'}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-extrabold text-white leading-none">
                        {bkkTime} น.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Call Tour Leader Strip */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-[11px]">
                      {lang === 'TH' ? 'หัวหน้าทัวร์:' : 'Tour Leader:'}{' '}
                      <strong className="text-white">{tourLeader.Name}</strong>
                    </span>
                  </div>
                  <a
                    href={`tel:${tourLeader.Phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs px-3 py-1 rounded-xl shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{tourLeader.Phone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* NOTICE BANNER (if active) */}
            {primaryNotice && (
              <NoticeBanner
                notice={primaryNotice}
                lang={lang}
                onViewDetails={() => setCurrentView('meeting')}
              />
            )}

            {/* TOKYO WEATHER FORECAST WIDGET */}
            <TokyoWeatherWidget lang={lang} theme={theme} />

            {/* =========================================================================
                THE 6 MAIN MENU BUTTONS (6 เมนูหลัก) - Guidebook Layout (Pages 01, 08, 09)
               ========================================================================= */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {lang === 'TH' ? 'เมนูหลักสำหรับการเดินทาง' : 'Trip Navigation'}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* 1. TODAY */}
                <button
                  id="menu-btn-today"
                  onClick={() => setCurrentView('today')}
                  className="bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 active:scale-[0.98] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-3xl p-4 sm:p-5 shadow-xs transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 text-blue-700 dark:text-blue-400 flex items-center justify-center transition-colors">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block leading-tight">
                      {lang === 'TH' ? 'กำหนดการวันนี้' : 'Today'}
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                      TODAY &gt;
                    </span>
                  </div>
                </button>

                {/* 2. MY JOURNEY */}
                <button
                  id="menu-btn-journey"
                  onClick={() => setCurrentView('journey')}
                  className="bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 active:scale-[0.98] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-3xl p-4 sm:p-5 shadow-xs transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 text-blue-700 dark:text-blue-400 flex items-center justify-center transition-colors">
                      <Luggage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block leading-tight">
                      {lang === 'TH' ? 'ข้อมูลการเดินทาง' : 'My Journey'}
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                      MY JOURNEY &gt;
                    </span>
                  </div>
                </button>

                {/* 3. MEETING POINT */}
                <button
                  id="menu-btn-meeting"
                  onClick={() => setCurrentView('meeting')}
                  className="bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 active:scale-[0.98] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-3xl p-4 sm:p-5 shadow-xs transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 text-blue-700 dark:text-blue-400 flex items-center justify-center transition-colors">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block leading-tight">
                      {lang === 'TH' ? 'จุดนัดพบ' : 'Meeting Point'}
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                      MEETING POINT &gt;
                    </span>
                  </div>
                </button>

                {/* 4. HOTEL */}
                <button
                  id="menu-btn-hotel"
                  onClick={() => setCurrentView('hotel')}
                  className="bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 active:scale-[0.98] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-3xl p-4 sm:p-5 shadow-xs transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 text-blue-700 dark:text-blue-400 flex items-center justify-center transition-colors">
                      <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block leading-tight">
                      {lang === 'TH' ? 'ที่พัก & แท็กซี่' : 'Hotel'}
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                      HOTEL &gt;
                    </span>
                  </div>
                </button>

                {/* 5. CONTACT */}
                <button
                  id="menu-btn-contact"
                  onClick={() => setCurrentView('contact')}
                  className="bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 active:scale-[0.98] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-3xl p-4 sm:p-5 shadow-xs transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 text-blue-700 dark:text-blue-400 flex items-center justify-center transition-colors">
                      <PhoneCall className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block leading-tight">
                      {lang === 'TH' ? 'ติดต่อเรา' : 'Contact Us'}
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                      CONTACT &gt;
                    </span>
                  </div>
                </button>

                {/* 6. EMERGENCY SOS (Vibrant Red Accent) */}
                <button
                  id="menu-btn-emergency"
                  onClick={() => setEmergencyModalOpen(true)}
                  className="bg-red-50 dark:bg-red-950/40 hover:bg-red-100/80 dark:hover:bg-red-900/40 active:scale-[0.98] border border-red-200 dark:border-red-900/60 rounded-3xl p-4 sm:p-5 shadow-xs transition-all text-left flex flex-col justify-between min-h-[115px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                      SOS
                    </span>
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-black text-red-950 dark:text-red-100 block leading-tight">
                      {lang === 'TH' ? 'ขอความช่วยเหลือ' : 'Emergency SOS'}
                    </span>
                    <span className="text-[11px] text-red-600 dark:text-red-400 font-bold block mt-0.5">
                      EMERGENCY &gt;
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Look: Morning Gathering Point */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{lang === 'TH' ? 'จุดนัดพบเช้านี้ (Morning Gathering)' : 'Morning Gathering'}</span>
                </h3>
                <button
                  onClick={() => setCurrentView('meeting')}
                  className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300"
                >
                  {lang === 'TH' ? 'ดูรายละเอียด >' : 'Details >'}
                </button>
              </div>

              <MeetingPointCard
                meetingPoint={primaryMeetingPoint}
                latestNotice={primaryNotice}
                tourLeaderPhone={tourLeader.Phone}
                lang={lang}
              />
            </div>

            {/* Quick Look: Next Itinerary Activity */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{lang === 'TH' ? 'กำหนดการท่องเที่ยวถัดไป' : 'Next Schedule'}</span>
                </h3>
                <button
                  onClick={() => setCurrentView('today')}
                  className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300"
                >
                  {lang === 'TH' ? 'ดูกำหนดการเต็ม >' : 'Full Schedule >'}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-sky-800 dark:text-sky-300 font-mono">10:00</span>
                    <span className="text-[10px] text-sky-600 dark:text-sky-400">น.</span>
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold text-sky-800 dark:text-sky-200 bg-sky-100 dark:bg-sky-900/50 px-2 py-0.5 rounded-full mb-0.5">
                      สถานที่ท่องเที่ยว (Sightseeing)
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                      ชมทัศนียภาพโตเกียวสกายทรี (Tokyo Skytree)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      จุดชมวิวระดับความสูง 350 เมตร มองเห็นทั่วโตเกียว
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('today')}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 transition-colors shrink-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: TODAY (Full Itinerary Schedule & Day Selector)
           ========================================================================= */}
        {currentView === 'today' && (
          <div className="space-y-4 animate-fade-in">
            <ItineraryTimeline
              itinerary={itineraryList}
              trip={currentTrip}
              lang={lang}
            />
          </div>
        )}

        {/* =========================================================================
            VIEW 3: MY JOURNEY (Flights, Hotel, Tour Pass, Member QR)
           ========================================================================= */}
        {currentView === 'journey' && (
          <div className="space-y-4 animate-fade-in">
            <MyJourneyView
              trip={currentTrip}
              traveler={currentTraveler}
              hotel={mainHotel}
              tourLeader={tourLeader}
              lang={lang}
              onLogout={handleLogout}
            />
          </div>
        )}

        {/* =========================================================================
            VIEW 4: MEETING POINT (Gathering spot, coordinates, landmark, maps)
           ========================================================================= */}
        {currentView === 'meeting' && (
          <div className="space-y-4 animate-fade-in">
            <MeetingPointCard
              meetingPoint={primaryMeetingPoint}
              latestNotice={primaryNotice}
              tourLeaderPhone={tourLeader.Phone}
              lang={lang}
            />
          </div>
        )}

        {/* =========================================================================
            VIEW 5: HOTEL & TAXI (Hotel details, Driver Card in Japanese, Speech)
           ========================================================================= */}
        {currentView === 'hotel' && (
          <div className="space-y-4 animate-fade-in">
            <TaxiHotelCard hotel={mainHotel} lang={lang} />
          </div>
        )}

        {/* =========================================================================
            VIEW 6: CONTACTS (Tour Leader, Local Guide, Emergency lines)
           ========================================================================= */}
        {currentView === 'contact' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'TH' ? 'สมุดโทรศัพท์และช่องทางติดต่อฉุกเฉิน' : 'Contacts Directory & Hotlines'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'TH'
                  ? 'รวบรวมเบอร์ทีมงานและหน่วยงานดูแลความปลอดภัยประจำทริปนี้'
                  : 'Direct contact lines for tour leader, guide, hotel, and embassy.'}
              </p>
            </div>
            <ContactsDirectory
              contacts={contactsList}
              trip={currentTrip}
              lang={lang}
            />
          </div>
        )}

        {/* =========================================================================
            VIEW 7: EMERGENCY SOS CONSOLE
           ========================================================================= */}
        {currentView === 'emergency' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 rounded-3xl shadow-lg shadow-red-900/20">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-rose-100">
                  <AlertTriangle className="w-3.5 h-3.5 text-white" />
                  <span>{appConfig.EmergencyButtonText}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {lang === 'TH' ? 'ศูนย์ช่วยเหลือฉุกเฉิน 24 ชม.' : 'Emergency Assistance 24h'}
                </h2>
                <p className="text-xs sm:text-sm text-rose-100">
                  {lang === 'TH'
                    ? 'โปรดตั้งสติ อยู่ในจุดปลอดภัย และติดต่อหัวหน้าทัวร์หรือสายด่วนฉุกเฉินทันที'
                    : 'Stay calm, remain in a safe location, and contact your Tour Leader immediately.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setEmergencyModalOpen(true)}
                    className="bg-white text-red-700 hover:bg-rose-50 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    {lang === 'TH' ? 'เปิดโหมด SOS ฉุกเฉินแบบเต็มจอ' : 'Open Full SOS Display'}
                  </button>
                </div>
              </div>
            </div>

            <LocationShareCard
              traveler={currentTraveler}
              tourLeader={tourLeader}
              privacyNote={appConfig.PrivacyNote}
              lang={lang}
            />

            {/* 6 Scenarios Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {emergencyProceduresList.map((proc) => (
                <div
                  key={proc.EmergencyID}
                  onClick={() => setEmergencyModalOpen(true)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 hover:border-red-300 dark:hover:border-red-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
                        {proc.EmergencyID}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">ลำดับที่ {proc.Priority}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                      {lang === 'TH' ? proc.TitleTH : proc.TitleEN}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      1. {proc.Step1TH}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-red-600 dark:text-red-400">
                    <span>{lang === 'TH' ? 'เปิดดูวิธีปฏิบัติ' : 'View Protocol'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 8: MESSAGES & BROADCAST NOTICES
           ========================================================================= */}
        {currentView === 'messages' && (
          <div className="space-y-4 animate-fade-in">
            <MessagesView
              notices={noticesList}
              lang={lang}
              onNavigateToMeeting={() => setCurrentView('meeting')}
            />
          </div>
        )}

        {/* =========================================================================
            VIEW 9: SURVIVAL JAPANESE PHRASES
           ========================================================================= */}
        {currentView === 'phrases' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'TH' ? 'ประโยคภาษาญี่ปุ่นสำหรับเอาตัวรอด' : 'Survival Japanese Phrases'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'TH'
                  ? 'กดฟังเสียงอ่านภาษาญี่ปุ่น หรือกดขยายเต็มจอเพื่อยื่นให้คนญี่ปุ่นดูได้ทันที'
                  : 'Tap audio to listen, or enlarge to full screen to show locals.'}
              </p>
            </div>
            <PhrasesList phrases={phrasesList} lang={lang} />
          </div>
        )}
      </main>

      {/* =========================================================================
          BOTTOM NAVIGATION BAR - 4 Tabs (Matching Guidebook Pages 01, 08, 10, 18, 29)
         ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden border-t border-slate-200/90 dark:border-slate-800 shadow-lg px-3 py-1.5 sm:hidden">
        {/* Animated Great Wave Japanese Background */}
        <AnimatedGreatWaveNavBg theme={theme} speed={1} intensity={1} />

        <div className="relative z-10 flex items-center justify-around max-w-md mx-auto">
          {/* Home Tab */}
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'text-[#0A2540] dark:text-sky-400 font-black'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">
              {lang === 'TH' ? 'หน้าแรก' : 'Home'}
            </span>
          </button>

          {/* Messages Tab (with unread badge) */}
          <button
            onClick={() => setCurrentView('messages')}
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-colors relative cursor-pointer ${
              currentView === 'messages'
                ? 'text-[#0A2540] dark:text-sky-400 font-black'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                {noticesList.length}
              </span>
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              {lang === 'TH' ? 'ข้อความ' : 'Messages'}
            </span>
          </button>

          {/* Today / Schedule Tab */}
          <button
            onClick={() => setCurrentView('today')}
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-colors cursor-pointer ${
              currentView === 'today'
                ? 'text-[#0A2540] dark:text-sky-400 font-black'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">
              {lang === 'TH' ? 'กำหนดการ' : 'Updates'}
            </span>
          </button>

          {/* My Journey Tab */}
          <button
            onClick={() => setCurrentView('journey')}
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-colors cursor-pointer ${
              currentView === 'journey'
                ? 'text-[#0A2540] dark:text-sky-400 font-black'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Luggage className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">
              {lang === 'TH' ? 'ข้อมูลทริป' : 'Journey'}
            </span>
          </button>
        </div>
      </nav>

      {/* Emergency Full SOS Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        procedures={emergencyProceduresList}
        traveler={currentTraveler}
        tourLeader={tourLeader}
        trip={currentTrip}
        privacyNote={appConfig.PrivacyNote}
        lang={lang}
      />
    </div>
  );
}

