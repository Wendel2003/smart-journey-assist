import React, { useState } from 'react';
import { Phrase } from '../types.ts';
import { speakText } from '../utils/speech.ts';
import {
  Volume2,
  Maximize2,
  Minimize2,
  Filter,
  MessageCircle,
  Building,
  FileQuestion,
  HeartPulse,
} from 'lucide-react';

interface PhrasesListProps {
  phrases: Phrase[];
  lang: 'TH' | 'EN';
}

const categoryIcons: Record<string, React.ReactNode> = {
  Contact: <MessageCircle className="w-3.5 h-3.5 text-blue-500" />,
  Hotel: <Building className="w-3.5 h-3.5 text-amber-500" />,
  Passport: <FileQuestion className="w-3.5 h-3.5 text-purple-500" />,
  Medical: <HeartPulse className="w-3.5 h-3.5 text-rose-500" />,
};

const categoryLabelsTH: Record<string, string> = {
  Contact: 'ติดต่อหัวหน้าทัวร์',
  Hotel: 'โรงแรม & เดินทาง',
  Passport: 'พาสปอร์ต',
  Medical: 'เจ็บป่วย/การแพทย์',
};

export const PhrasesList: React.FC<PhrasesListProps> = ({ phrases, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [fullscreenPhrase, setFullscreenPhrase] = useState<Phrase | null>(null);

  const categories = ['All', 'Contact', 'Hotel', 'Passport', 'Medical'];

  const filtered =
    selectedCategory === 'All'
      ? phrases
      : phrases.filter((p) => p.Category === selectedCategory);

  const handleSpeak = (text: string) => {
    speakText(text, 'ja-JP');
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-0.5" />
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat === 'All'
                ? lang === 'TH'
                  ? 'ทั้งหมด'
                  : 'All Phrases'
                : lang === 'TH'
                ? categoryLabelsTH[cat] || cat
                : cat}
            </button>
          );
        })}
      </div>

      {/* Phrase Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((phrase) => (
          <div
            key={phrase.PhraseID}
            id={`phrase-${phrase.PhraseID}`}
            className="bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 shadow-xs hover:border-rose-200 dark:hover:border-rose-500/50 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/80 px-2 py-0.5 rounded-md">
                  {categoryIcons[phrase.Category]}
                  <span>{phrase.Category}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{phrase.PhraseID}</span>
              </div>

              {/* Japanese Text */}
              <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug font-sans mb-1.5">
                {phrase.LocalText}
              </p>

              {/* Translation */}
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-0.5">
                {lang === 'TH' ? phrase.ThaiText : phrase.EnglishText}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'TH' ? phrase.EnglishText : phrase.ThaiText}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={() => handleSpeak(phrase.LocalText)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-700/70 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                <span>{lang === 'TH' ? 'ฟังเสียงอ่าน' : 'Listen'}</span>
              </button>

              <button
                onClick={() => setFullscreenPhrase(phrase)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                title="Show Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'TH' ? 'ขยายจอใหญ่' : 'Enlarge'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal for Showing Local */}
      {fullscreenPhrase && (
        <div className="fixed inset-0 z-60 bg-white dark:bg-slate-950 text-slate-950 dark:text-white flex flex-col justify-between p-6 sm:p-12 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 rounded-full">
              {lang === 'TH' ? 'ยื่นหน้าจอนี้ให้คนญี่ปุ่นอ่าน' : 'Show to a local person'}
            </span>
            <button
              onClick={() => setFullscreenPhrase(null)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
          </div>

          <div className="my-auto text-center space-y-6 max-w-2xl mx-auto">
            <p className="text-3xl sm:text-5xl font-black leading-snug tracking-wide text-slate-950 dark:text-white font-sans">
              {fullscreenPhrase.LocalText}
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{fullscreenPhrase.ThaiText}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{fullscreenPhrase.EnglishText}</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSpeak(fullscreenPhrase.LocalText)}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3.5 rounded-2xl text-base shadow-lg shadow-rose-600/30 active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>{lang === 'TH' ? 'อ่านออกเสียงภาษาญี่ปุ่น' : 'Speak in Japanese'}</span>
            </button>
            <button
              onClick={() => setFullscreenPhrase(null)}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-800 dark:text-slate-200 text-base cursor-pointer"
            >
              {lang === 'TH' ? 'ปิดหน้านี้' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
