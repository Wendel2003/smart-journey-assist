import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import QRCode from 'qrcode';
import { Traveler, Trip } from '../types.ts';
import { RealisticAirplane } from './RealisticAirplane.tsx';
import {
  QrCode,
  Camera,
  Smartphone,
  MapPin,
  Shield,
  Headphones,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  KeyRound,
  Sun,
  Moon,
} from 'lucide-react';

interface LoginViewProps {
  trip: Trip;
  travelers: Traveler[];
  onLoginSuccess: (traveler: Traveler) => void;
  lang?: 'TH' | 'EN';
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  trip,
  travelers,
  onLoginSuccess,
  lang = 'TH',
  theme = 'light',
  onToggleTheme,
}) => {
  // Screen mode: 'welcome' (Scan QR screen) or 'splash' (Intro screen)
  const [screenMode, setScreenMode] = useState<'welcome' | 'splash'>('welcome');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('qr');

  // Manual input state
  const [travelerIdInput, setTravelerIdInput] = useState<string>('TRV-0001');
  const [manualError, setManualError] = useState<string>('');

  // Camera scanner modal
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Generate real QR code image for sample traveler
  const sampleTraveler = travelers[0] || {
    TravelerID: 'TRV-0001',
    FullNameTH: 'สมชาย ใจดี',
    FullNameEN: 'SOMCHAI JAIDEE',
    TripID: trip.TripID,
    QRCodeValue: `SJA:TRV-0001:${trip.TripID}`,
  };

  useEffect(() => {
    QRCode.toDataURL(sampleTraveler.QRCodeValue || `SJA:TRV-0001:${trip.TripID}`, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0D2B5E',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR Code', err));
  }, [sampleTraveler.QRCodeValue, trip.TripID]);

  // Handle camera scanner
  const handleOpenScanner = async () => {
    setIsCameraOpen(true);
    setCameraLoading(true);
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        setCameraError('ไม่พบอุปกรณ์กล้อง หรือเบราว์เซอร์ไม่อนุญาตการเข้าถึงกล้อง');
      }
    } catch {
      setCameraError('ไม่สามารถเปิดกล้องได้ (เบราว์เซอร์อาจจำกัดสิทธิ์ในกรอบ iFrame) คุณสามารถกดปุ่ม "จำลองการสแกนสำเร็จ" ได้ทันที');
    } finally {
      setCameraLoading(false);
    }
  };

  const handleCloseScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  // Instant login via QR scan
  const handleScanSuccess = () => {
    handleCloseScanner();
    onLoginSuccess(sampleTraveler);
  };

  // Manual login by Traveler ID for individual privacy
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    const cleanTravelerId = travelerIdInput.trim().toUpperCase();

    if (!cleanTravelerId) {
      setManualError('กรุณากรอกรหัสนักท่องเที่ยว (Traveler ID)');
      return;
    }

    // Find traveler by Traveler ID (e.g. TRV-0001, TRV-0002, or digits)
    const travelerById = travelers.find(
      (t) =>
        t.TravelerID.toUpperCase() === cleanTravelerId ||
        t.TravelerID.toUpperCase().endsWith(cleanTravelerId) ||
        t.TravelerID.toUpperCase().replace(/\D/g, '') === cleanTravelerId.replace(/\D/g, '')
    );

    if (travelerById) {
      onLoginSuccess(travelerById);
    } else {
      setManualError(
        `ไม่พบรหัสนักท่องเที่ยว "${travelerIdInput}" ในระบบ กรุณาตรวจสอบรหัสบนแท็กกระเป๋าเดินทางหรือเอกสารทัวร์ (เช่น TRV-0001, TRV-0002)`
      );
    }
  };

  // ----------------------------------------------------
  // SCREEN 1: SPLASH SCREEN (หน้าจอเริ่มต้น จาก Mockup 01)
  // ----------------------------------------------------
  if (screenMode === 'splash') {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#071F42] via-[#0D2B5E] to-[#041026] text-white flex flex-col justify-between overflow-hidden">
        {/* Ambient background glow & globe contour lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="globe-glow" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#1E5BFF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0D2B5E" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="200" cy="360" r="260" fill="url(#globe-glow)" />
              {/* Latitude & Longitude globe lines */}
              <ellipse cx="200" cy="360" rx="220" ry="80" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6,6" opacity="0.3" />
              <ellipse cx="200" cy="360" rx="220" ry="160" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6,6" opacity="0.3" />
              <ellipse cx="200" cy="360" rx="140" ry="220" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6,6" opacity="0.3" />
              <line x1="200" y1="140" x2="200" y2="580" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6,6" opacity="0.3" />
              <line x1="0" y1="360" x2="400" y2="360" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6,6" opacity="0.3" />
            </svg>
          </div>

          {/* Airplanes flying back and forth in the background with realistic nose-forward physics */}
          {/* Flight 1: West to East (Left to Right -> Nose points RIGHT) */}
          <motion.div
            className="absolute z-0 pointer-events-none"
            initial={{ x: '-30vw', y: '15vh', opacity: 0 }}
            animate={{
              x: ['-30vw', '120vw'],
              y: ['17vh', '11vh'],
              opacity: [0, 0.95, 0.95, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.5,
            }}
            style={{
              rotate: -3,
            }}
          >
            <RealisticAirplane
              direction="right"
              scale={0.92}
              contrailLength={180}
              flightCode="TG 642 • BKK-NRT"
            />
          </motion.div>

          {/* Flight 2: East to West (Right to Left -> Nose points LEFT) */}
          <motion.div
            className="absolute z-0 pointer-events-none"
            initial={{ x: '120vw', y: '33vh', opacity: 0 }}
            animate={{
              x: ['120vw', '-30vw'],
              y: ['35vh', '28vh'],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'linear',
              delay: 7,
            }}
            style={{
              rotate: 3,
            }}
          >
            <RealisticAirplane
              direction="left"
              scale={0.86}
              contrailLength={190}
              flightCode="JL 031 • HND-BKK"
            />
          </motion.div>

          {/* Flight 3: High-altitude cruise FL410 (Left to Right -> Nose points RIGHT) */}
          <motion.div
            className="absolute z-0 pointer-events-none"
            initial={{ x: '-30vw', y: '47vh', opacity: 0 }}
            animate={{
              x: ['-30vw', '120vw'],
              y: ['49vh', '43vh'],
              opacity: [0, 0.65, 0.65, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: 'linear',
              delay: 14,
            }}
            style={{
              rotate: -2,
            }}
          >
            <RealisticAirplane
              direction="right"
              scale={0.62}
              contrailLength={240}
              flightCode="NH 847 • FL410"
            />
          </motion.div>

          {/* Flight 4: Crossing flight FL390 (Right to Left -> Nose points LEFT) */}
          <motion.div
            className="absolute z-0 pointer-events-none"
            initial={{ x: '120vw', y: '21vh', opacity: 0 }}
            animate={{
              x: ['120vw', '-30vw'],
              y: ['22vh', '17vh'],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
              delay: 19,
            }}
            style={{
              rotate: 2,
            }}
          >
            <RealisticAirplane
              direction="left"
              scale={0.58}
              contrailLength={210}
              flightCode="SQ 638 • FL390"
            />
          </motion.div>
        </div>

        {/* Top bar with time & view toggle */}
        <div className="relative z-10 px-4 py-3 flex items-center justify-between text-xs text-sky-200/80">
          <div className="flex items-center gap-1.5 font-mono">
            <span>9:41</span>
          </div>
          <button
            onClick={() => setScreenMode('welcome')}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full text-xs font-medium text-white transition-all cursor-pointer backdrop-blur-xs"
          >
            <span>ไปหน้า สแกน QR</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Content: Brand Logo & Tagline */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center my-auto py-8">
          {/* Main Brand Logo Graphic */}
          <div className="relative mb-6">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/5 border border-white/10 p-3 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-blue-500/20">
              <img
                src="/app-logo.png"
                alt="Smart Journey Assist Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-black tracking-tight uppercase">
              <span className="text-white">SMART</span>
              <span className="text-[#FF8A00]">JOURNEY</span>
              <span className="text-white">ASSIST</span>
            </div>
            <p className="text-sm font-medium tracking-wide text-sky-200">
              By Grandworld Holiday
            </p>
          </div>

          {/* Tagline */}
          <div className="mt-8 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-slate-200">
              Your Travel Companion &amp; Emergency Support
            </p>
          </div>

          {/* Action button */}
          <div className="mt-10 w-full max-w-xs space-y-3">
            <button
              onClick={() => setScreenMode('welcome')}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#1E5BFF] to-[#0D2B5E] hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/40 border border-white/20 active:scale-98 transition-all cursor-pointer"
            >
              <QrCode className="w-5 h-5 text-[#FF8A00]" />
              <span>เข้าสู่หน้าสแกน QR Code</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={handleScanSuccess}
              className="w-full text-xs text-sky-300 hover:text-white py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>เข้าใช้งานด่วนด้วยทริปตัวอย่าง ({trip.TripName})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Skyline Silhouette Illustration */}
        <div className="relative z-10 w-full">
          <svg className="w-full h-24 sm:h-28 text-white/15 fill-current" viewBox="0 0 1000 120" preserveAspectRatio="none">
            {/* Stylized world landmark skyline: pagoda, tokyo tower, mount fuji curve, skyscraper buildings */}
            <path d="M0,120 L0,95 L20,95 L20,80 L35,80 L35,65 L45,65 L45,50 L50,25 L55,50 L65,65 L75,65 L75,80 L90,80 L90,95 L110,95 L110,70 L130,70 L130,95 L150,95 L180,45 L210,95 L230,95 L240,60 L240,40 L245,20 L250,40 L250,60 L260,95 L290,95 L290,55 L320,55 L320,95 L340,95 L345,75 L360,75 L360,95 L380,95 L400,30 L405,10 L410,30 L430,95 L450,95 L460,65 L475,65 L480,45 L490,45 L495,65 L510,65 L510,95 L540,95 L560,50 L580,95 L610,95 L615,35 L625,35 L625,15 L630,5 L635,15 L635,35 L645,35 L650,95 L680,95 L680,60 L710,60 L710,95 L730,95 L750,40 L770,95 L800,95 L810,70 L825,70 L825,95 L850,95 L860,30 L870,30 L875,10 L880,30 L890,30 L900,95 L930,95 L930,55 L960,55 L960,95 L1000,95 L1000,120 Z" />
          </svg>
          <div className="h-4 bg-[#041026]" />
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 2: WELCOME / SCAN QR เข้าสู่ทริป (จาก Mockup 01)
  // ----------------------------------------------------
  return (
    <div className="relative min-h-screen bg-[#F2F5FA] dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col selection:bg-blue-600 selection:text-white pb-12 overflow-x-hidden">
      {/* Background Airplane Flybys with correct nose orientation (Forward in flight direction) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-75">
        {/* Flight Left to Right -> Nose points RIGHT */}
        <motion.div
          className="absolute z-0 pointer-events-none"
          initial={{ x: '-30vw', y: '8vh', opacity: 0 }}
          animate={{
            x: ['-30vw', '120vw'],
            y: ['10vh', '5vh'],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            delay: 1,
          }}
          style={{ rotate: -3 }}
        >
          <RealisticAirplane direction="right" scale={0.78} contrailLength={170} flightCode="TG 642" />
        </motion.div>

        {/* Flight Right to Left -> Nose points LEFT */}
        <motion.div
          className="absolute z-0 pointer-events-none"
          initial={{ x: '120vw', y: '23vh', opacity: 0 }}
          animate={{
            x: ['120vw', '-30vw'],
            y: ['25vh', '19vh'],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'linear',
            delay: 10,
          }}
          style={{ rotate: 3 }}
        >
          <RealisticAirplane direction="left" scale={0.72} contrailLength={180} flightCode="JL 031" />
        </motion.div>
      </div>

      {/* Top Header Card */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-xs sticky top-0 z-20">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Logo brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <img
                src="/app-logo.png"
                alt="Smart Journey Assist"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1 leading-tight whitespace-nowrap">
                <span className="text-xs font-black tracking-tight text-[#0D2B5E] dark:text-blue-300 uppercase">
                  Smart
                </span>
                <span className="text-xs font-black tracking-tight text-[#FF8A00] uppercase">
                  Journey
                </span>
                <span className="text-xs font-black tracking-tight text-[#0D2B5E] dark:text-blue-300 uppercase">
                  Assist
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none">
                By Grandworld Holiday
              </p>
            </div>
          </div>

          {/* View Splash Screen Button & Theme Toggle */}
          <div className="flex items-center gap-1.5">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด (ประหยัดแบตเตอรี่)'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-blue-600" />
                )}
              </button>
            )}
            <button
              onClick={() => setScreenMode('splash')}
              className="text-[11px] font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>ดูหน้าเริ่มต้น (Splash)</span>
            </button>
          </div>
        </div>
      </header>

      {/* 4 Feature Highlights from Overview Sheet */}
      <div className="bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60 py-2.5 px-3">
        <div className="max-w-xl mx-auto grid grid-cols-4 gap-1.5 text-center">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1E5BFF] dark:text-blue-400 flex items-center justify-center mb-1">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
              เข้าถึงง่าย
            </span>
            <span className="text-[8px] text-slate-400 dark:text-slate-500">ทุกที่ ทุกเวลา</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
              นำทางอัจฉริยะ
            </span>
            <span className="text-[8px] text-slate-400 dark:text-slate-500">แม่นยำ ทันใจ</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
              ปลอดภัย
            </span>
            <span className="text-[8px] text-slate-400 dark:text-slate-500">อุ่นใจตลอดทริป</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#FF8A00] flex items-center justify-center mb-1">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
              ดูแล 24 ชม.
            </span>
            <span className="text-[8px] text-slate-400 dark:text-slate-500">ช่วยเหลือฉุกเฉิน</span>
          </div>
        </div>
      </div>

      {/* Main Login Card Body */}
      <main className="max-w-md mx-auto w-full px-4 pt-4 flex-1 flex flex-col">
        {/* Airplane flight path graphic header */}
        <div className="relative text-center mb-4 pt-1">
          <div className="inline-block relative">
            <h2 className="text-xl sm:text-2xl font-black text-[#0D2B5E] dark:text-white tracking-tight">
              ยินดีต้อนรับ
            </h2>
            <div className="text-base sm:text-lg font-bold text-[#1E5BFF] dark:text-blue-400">
              เข้าสู่ Smart Journey Assist
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
            สแกน QR Code ที่ได้รับจากหัวหน้าทัวร์ เพื่อเข้าสู่ข้อมูลการเดินทางและบริการช่วยเหลือตลอดทริปของคุณ
          </p>

          {/* Current Active Trip Pill */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 text-[#0D2B5E] dark:text-blue-200 text-[11px] px-3 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ทริปปัจจุบัน: <strong>{trip.TripName}</strong> ({trip.TripID})</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl flex gap-1 mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-white dark:bg-slate-700 text-[#0D2B5E] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-[#1E5BFF] dark:text-blue-400" />
            <span>สแกน QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-white dark:bg-slate-700 text-[#0D2B5E] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#FF8A00]" />
            <span>กรอกรหัส Traveler ID</span>
          </button>
        </div>

        {/* TAB 1: QR CODE SCANNER (Matches Mockup 01 exactly) */}
        {activeTab === 'qr' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 dark:border-slate-800 flex flex-col items-center">
            {/* Viewfinder Frame with Bracket Corners */}
            <div className="relative p-5 bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-850 rounded-2xl border border-blue-100 dark:border-slate-700 flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72 shadow-inner">
              {/* Four Scanner Bracket Corners in Vivid Blue #1E5BFF */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-3 border-l-3 border-[#1E5BFF] rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-3 border-r-3 border-[#1E5BFF] rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-3 border-l-3 border-[#1E5BFF] rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-3 border-r-3 border-[#1E5BFF] rounded-br-lg" />

              {/* Animated Laser Scan Line */}
              <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-[#FF8A00] to-transparent shadow-[0_0_8px_#FF8A00] animate-pulse pointer-events-none top-1/2 -translate-y-1/2" />

              {/* QR Code Canvas / Image */}
              {qrDataUrl ? (
                <div className="bg-white p-2 rounded-xl shadow-xs">
                  <img
                    src={qrDataUrl}
                    alt="QR Code สำหรับเข้าสู่ระบบ"
                    className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
              )}

              {/* Decorative phone scan icon badge on the right edge */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1E5BFF] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>

            {/* Label below QR */}
            <div className="mt-3 text-center">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
                ตัวอย่าง QR Code สำหรับเข้าทริป
              </span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                รหัสนักท่องเที่ยว: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{sampleTraveler.TravelerID}</span> ({sampleTraveler.FullNameTH})
              </p>
            </div>

            {/* Main Primary Action Button (Matches Scan QR / Enter Trip in Mockup 01) */}
            <div className="w-full mt-5 space-y-2.5">
              <button
                id="btn-scan-qr-login"
                onClick={handleScanSuccess}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0D2B5E] via-[#113B82] to-[#1E5BFF] hover:from-[#0a234d] hover:to-blue-600 active:scale-98 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-md shadow-blue-950/20 border border-blue-400/20 transition-all cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-[#FF8A00]" />
                <span className="tracking-wide">Scan QR / Enter Trip</span>
              </button>

              {/* Live Camera Scanner Button */}
              <button
                onClick={handleOpenScanner}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-98 text-slate-700 dark:text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span>เปิดกล้องมือถือเพื่อสแกน QR Code</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL ENTRY */}
        {activeTab === 'manual' && (
          <form
            onSubmit={handleManualLogin}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 dark:border-slate-800"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>รหัสนักท่องเที่ยว (Traveler ID)</span>
                  <span className="text-[10px] font-normal text-slate-400">ระบุในเอกสารทัวร์ / แท็กกระเป๋า</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={travelerIdInput}
                    onChange={(e) => {
                      setTravelerIdInput(e.target.value);
                      setManualError('');
                    }}
                    placeholder="เช่น TRV-0001"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-white uppercase focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#1E5BFF] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                    ข้อมูลเฉพาะบุคคล
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span>ตัวอย่างรหัสในทริป:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTravelerIdInput('TRV-0001');
                      setManualError('');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-[11px] font-medium cursor-pointer"
                  >
                    TRV-0001 (คุณสมชาย)
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTravelerIdInput('TRV-0002');
                      setManualError('');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-[11px] font-medium cursor-pointer"
                  >
                    TRV-0002 (คุณสมศรี)
                  </button>
                </p>
              </div>

              {manualError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{manualError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#0D2B5E] hover:bg-[#1E5BFF] text-white font-bold text-sm py-3 px-5 rounded-2xl shadow-md transition-all cursor-pointer"
              >
                <span>เข้าสู่ระบบข้อมูลส่วนตัว</span>
                <ArrowRight className="w-4 h-4 text-[#FF8A00]" />
              </button>
            </div>
          </form>
        )}

        {/* Security & Tour note footer */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ระบบความปลอดภัยและการช่วยเหลือสำหรับสมาชิกลูกทัวร์ Grandworld Holiday</span>
          </div>
        </div>
      </main>

      {/* Camera Scanner Modal (Interactive camera view or simulate scan) */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-800/90 flex items-center justify-between border-b border-slate-700 text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#1E5BFF]" />
                <span className="text-xs font-bold">สแกน QR Code ด้วยกล้อง</span>
              </div>
              <button
                onClick={handleCloseScanner}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Over Video */}
              <div className="absolute inset-8 border-2 border-white/40 rounded-2xl flex items-center justify-center pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#1E5BFF] rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#1E5BFF] rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#1E5BFF] rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#1E5BFF] rounded-br-lg" />
                <div className="w-full h-0.5 bg-[#FF8A00] animate-pulse shadow-[0_0_10px_#FF8A00]" />
              </div>

              {cameraLoading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                  <span className="text-xs">กำลังเปิดกล้อง...</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2.5">
              {cameraError ? (
                <p className="text-[11px] text-amber-300 leading-snug">
                  {cameraError}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 text-center">
                  จัดกรอบ QR Code บนเอกสารทัวร์หรือโทรศัพท์ให้อยู่ในกรอบสี่เหลี่ยม
                </p>
              )}

              <button
                onClick={handleScanSuccess}
                className="w-full py-3 bg-[#1E5BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>ยืนยันการสแกนสำเร็จ (จำลองการสแกน)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
