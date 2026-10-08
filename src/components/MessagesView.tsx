import React from 'react';
import { Notice } from '../types.ts';
import {
  Bell,
  Clock,
  AlertTriangle,
  Info,
  Calendar,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface MessagesViewProps {
  notices: Notice[];
  lang: 'TH' | 'EN';
  onNavigateToMeeting?: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  notices,
  lang,
  onNavigateToMeeting,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-xl">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'TH' ? 'ประกาศสำคัญและการแจ้งเตือน' : 'Trip Notices & Broadcasts'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'TH'
                ? 'ข้อมูลอัปเดตแบบเรียลไทม์จากหัวหน้าทัวร์และทีมงาน Grandworld'
                : 'Real-time announcements from your Tour Leader and team'}
            </p>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {notices.map((notice) => {
          const isHighPriority = notice.Priority === 'High';

          return (
            <div
              key={notice.NoticeID}
              id={`notice-card-${notice.NoticeID}`}
              className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
                isHighPriority
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/70'
                  : 'bg-white dark:bg-slate-800/95 border-slate-200 dark:border-slate-700/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isHighPriority
                          ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200'
                          : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200'
                      }`}
                    >
                      {isHighPriority ? (
                        <AlertTriangle className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                      ) : (
                        <Info className="w-3 h-3 text-blue-700 dark:text-blue-400" />
                      )}
                      <span>
                        {isHighPriority
                          ? lang === 'TH'
                            ? 'ประกาศด่วน (Urgent)'
                            : 'Urgent'
                          : notice.NoticeType}
                      </span>
                    </span>

                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{notice.PublishedAt.replace('T', ' ').slice(11, 16)} น.</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white pt-0.5">
                    {lang === 'TH' ? notice.TitleTH : notice.TitleEN}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {lang === 'TH' ? notice.MessageTH : notice.MessageEN}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {lang === 'TH' ? 'มีผลถึง:' : 'Valid Until:'}{' '}
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">
                        {notice.ActiveTo.replace('T', ' ').slice(11, 16)} น.
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {notice.NoticeType === 'Meeting Change' && onNavigateToMeeting && (
                <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/60 flex justify-end">
                  <button
                    onClick={onNavigateToMeeting}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 hover:text-amber-950 dark:hover:text-amber-100 bg-amber-200/80 dark:bg-amber-800/50 hover:bg-amber-300/80 dark:hover:bg-amber-800/70 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>{lang === 'TH' ? 'ดูจุดนัดพบที่อัปเดต' : 'View Updated Meeting Point'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
