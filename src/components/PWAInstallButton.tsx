import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download, Smartphone, X, Check, Share2, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  lang: 'TH' | 'EN';
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang,
  compact = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside installed standalone PWA
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        id="btn-pwa-install"
        className={`inline-flex items-center gap-1.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer ${
          compact
            ? 'bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1.5'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm px-3.5 py-2'
        }`}
      >
        <Download className="w-3.5 h-3.5 text-white" />
        <span>{lang === 'TH' ? 'ติดตั้งแอปลงเครื่อง' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          id="btn-pwa-install-ios"
          className={`inline-flex items-center gap-1.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer ${
            compact
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs px-2.5 py-1.5 border border-slate-700'
              : 'bg-white hover:bg-slate-50 text-slate-800 text-xs px-3 py-1.5 border border-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-500" />
          <span>{lang === 'TH' ? 'ติดตั้งบน iPhone' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {lang === 'TH' ? 'ติดตั้งบน iPhone / iPad' : 'Install on iOS'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === 'TH' ? 'ใช้งานแบบออฟไลน์ได้ทุกที่' : 'Works offline during tour'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>
                      {lang === 'TH'
                        ? 'กดปุ่มแชร์ (Share) ที่แถบด้านล่างของ Safari'
                        : 'Tap the Share button in Safari toolbar'}
                    </span>
                    <Share2 className="w-4 h-4 text-blue-600 inline shrink-0" />
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>
                      {lang === 'TH'
                        ? 'เลื่อนลงแล้วเลือก "เพิ่มไปยังหน้าจอโฮม"'
                        : 'Scroll and tap "Add to Home Screen"'}
                    </span>
                    <PlusSquare className="w-4 h-4 text-blue-600 inline shrink-0" />
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </div>
                  <span>
                    {lang === 'TH'
                      ? 'กด "เพิ่ม" (Add) ที่มุมขวาบนเพื่อเสร็จสิ้น'
                      : 'Tap "Add" in the top-right corner'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white transition-colors"
              >
                {lang === 'TH' ? 'เข้าใจแล้ว' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
