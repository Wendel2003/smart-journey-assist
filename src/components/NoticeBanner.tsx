import React, { useState } from 'react';
import { Notice } from '../types.ts';
import { Bell, Clock, AlertCircle, ChevronRight, X } from 'lucide-react';

interface NoticeBannerProps {
  notice: Notice;
  lang: 'TH' | 'EN';
  onViewDetails?: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ notice, lang }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isDismissed || notice.IsActive !== 'Yes') return null;

  return (
    <div
      id={`notice-${notice.NoticeID}`}
      className="bg-amber-50 dark:bg-amber-950/40 border-y sm:border sm:rounded-2xl border-amber-200/90 dark:border-amber-800/60 text-amber-950 dark:text-amber-100 p-3.5 sm:p-4 mb-4 shadow-xs transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Bell className="w-4 h-4 animate-swing" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                <AlertCircle className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                {notice.Priority === 'High'
                  ? lang === 'TH'
                    ? 'ประกาศด่วนจากหัวหน้าทัวร์'
                    : 'Urgent Notice'
                  : 'Notice'}
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lang === 'TH' ? 'ประกาศเมื่อ 07:45 น.' : 'Published at 07:45'}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-amber-100 text-sm sm:text-base">
              {lang === 'TH' ? notice.TitleTH : notice.TitleEN}
            </h3>

            <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 mt-0.5 font-medium leading-relaxed">
              {lang === 'TH' ? notice.MessageTH : notice.MessageEN}
            </p>

            {isExpanded && (
              <div className="mt-2.5 pt-2.5 border-t border-amber-200/80 dark:border-amber-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p>
                  <strong className="text-slate-900 dark:text-white">{lang === 'TH' ? 'มีผลถึง:' : 'Active Until:'}</strong>{' '}
                  {notice.ActiveTo.replace('T', ' ')}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">{lang === 'TH' ? 'ประเภท:' : 'Type:'}</strong>{' '}
                  {notice.NoticeType}
                </p>
                <p className="text-amber-800 dark:text-amber-400 italic">
                  {lang === 'TH'
                    ? '* หากมีข้อสงสัยหรือมาไม่ทัน กรุณากดติดต่อหัวหน้าทัวร์ทันที'
                    : '* If you are delayed or have questions, please call the Tour Leader immediately.'}
                </p>
              </div>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-200 underline underline-offset-2 cursor-pointer"
            >
              <span>{isExpanded ? (lang === 'TH' ? 'ย่อรายละเอียด' : 'Show Less') : (lang === 'TH' ? 'ดูรายละเอียดเพิ่มเติม' : 'View Details')}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 p-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          title="Dismiss"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
