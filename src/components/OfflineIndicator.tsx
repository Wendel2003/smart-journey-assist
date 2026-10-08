import React, { useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';
import { OfflineCacheStats } from '../services/offlineStorage.ts';
import { WifiOff, X } from 'lucide-react';

interface OfflineIndicatorProps {
  stats: OfflineCacheStats;
  onRefreshCache: (newStats: OfflineCacheStats) => void;
  lang: 'TH' | 'EN';
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  lang,
}) => {
  const isOnline = useOnlineStatus();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  if (isOnline || bannerDismissed) {
    return null;
  }

  return (
    /* Offline Alert Banner (only appears when device loses connection) */
    <div
      id="offline-status-banner"
      className="mb-3.5 bg-amber-600 text-white px-3.5 py-2.5 rounded-2xl shadow-sm border border-amber-700 transition-all"
    >
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-medium">
          <div className="p-1 bg-amber-700 rounded-md shrink-0">
            <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
          </div>
          <div>
            <span className="font-bold block sm:inline mr-1">
              {lang === 'TH' ? 'กำลังใช้งานโหมดออฟไลน์:' : 'Offline Mode Active:'}
            </span>
            <span className="text-amber-100">
              {lang === 'TH'
                ? 'ข้อมูลกำหนดการท่องเที่ยว เบอร์โทรฉุกเฉิน และจุดนัดพบพร้อมใช้งานจากแคชในเครื่อง'
                : 'Itinerary, emergency contacts, and meeting points are loaded from local cache.'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setBannerDismissed(true)}
          className="text-amber-200 hover:text-white p-1 rounded-md hover:bg-amber-700 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss offline banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

