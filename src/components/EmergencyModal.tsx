import React, { useState } from 'react';
import {
  EmergencyProcedure,
  Traveler,
  Contact,
  Trip,
} from '../types.ts';
import { speakText } from '../utils/speech.ts';
import { LocationShareCard } from './LocationShareCard.tsx';
import {
  X,
  Phone,
  Volume2,
  AlertTriangle,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Hospital,
  Compass,
  FileQuestion,
  ExternalLink,
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedures: EmergencyProcedure[];
  traveler: Traveler;
  tourLeader: Contact;
  trip: Trip;
  privacyNote: string;
  lang: 'TH' | 'EN';
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  procedures,
  traveler,
  tourLeader,
  trip,
  privacyNote,
  lang,
}) => {
  const [selectedProc, setSelectedProc] = useState<EmergencyProcedure>(procedures[0]);
  const [fullscreenPhrase, setFullscreenPhrase] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSpeak = (text: string) => {
    speakText(text, 'ja-JP');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Fullscreen Japanese card for presenting to locals */}
      {fullscreenPhrase && (
        <div className="fixed inset-0 z-60 bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between p-6 sm:p-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 rounded-full">
              {lang === 'TH' ? 'ยื่นหน้าจอนี้ให้คนญี่ปุ่นดู' : 'Show this to a local person'}
            </span>
            <button
              onClick={() => setFullscreenPhrase(null)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
          </div>

          <div className="my-auto text-center space-y-6 max-w-xl mx-auto">
            <p className="text-2xl sm:text-4xl font-bold leading-relaxed tracking-wide text-slate-950 dark:text-white">
              {fullscreenPhrase}
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Tour: {trip.TripName} ({trip.TripID}) | Member: {traveler.FullNameEN} ({traveler.Mobile})
              </p>
              <p className="text-xs text-slate-400 mt-1">Tour Leader: {tourLeader.Name} ({tourLeader.Phone})</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSpeak(fullscreenPhrase)}
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

      {/* Main Modal Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-rose-100 dark:border-slate-800 flex flex-col my-auto text-slate-900 dark:text-white">
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-4 sm:p-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {lang === 'TH' ? 'ศูนย์ช่วยเหลือฉุกเฉิน (SOS)' : 'Emergency Assistance (SOS)'}
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                {trip.TripName} | รหัสทัวร์: {trip.TripID}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Offline Cache Assurance Badge */}
          <div className="flex items-center justify-between gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs px-3.5 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span>
                {lang === 'TH'
                  ? 'ข้อมูลช่วยเหลือฉุกเฉินและเบอร์โทรทั้งหมดถูกบันทึกในเครื่อง พร้อมใช้งานแม้อยู่นอกสัญญาณอินเทอร์เน็ต'
                  : 'All emergency procedures and hotlines are cached locally and accessible offline.'}
              </span>
            </div>
            <span className="font-bold text-[10px] bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
              Offline Ready
            </span>
          </div>

          {/* Quick Dials Hotline Grid */}
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              {lang === 'TH' ? 'โทรด่วนทันที (One-Touch Dial)' : 'Immediate One-Touch Dial'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={`tel:${tourLeader.Phone.replace(/[^0-9+]/g, '')}`}
                id="emergency-call-tourleader"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">{lang === 'TH' ? 'หัวหน้าทัวร์' : 'Tour Leader'}</span>
                <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium truncate w-full">{tourLeader.Phone}</span>
              </a>

              <a
                href="tel:110"
                id="emergency-call-police"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 text-sky-900 dark:text-sky-200 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">{lang === 'TH' ? 'ตำรวจญี่ปุ่น' : 'Japan Police'}</span>
                <span className="text-[10px] text-sky-700 dark:text-sky-400 font-bold">110</span>
              </a>

              <a
                href="tel:119"
                id="emergency-call-ambulance"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                  <Hospital className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">{lang === 'TH' ? 'พยาบาล / กู้ภัย' : 'Ambulance'}</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">119</span>
              </a>

              <a
                href={`tel:${trip.EmbassyPhone.replace(/[^0-9+]/g, '')}`}
                id="emergency-call-embassy"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-200 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                  <FileQuestion className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">{lang === 'TH' ? 'สถานทูตไทย' : 'Thai Embassy'}</span>
                <span className="text-[10px] text-purple-700 dark:text-purple-400 font-medium truncate w-full">{trip.EmbassyPhone}</span>
              </a>
            </div>
          </div>

          {/* Procedure Selection Tabs */}
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              {lang === 'TH' ? 'เลือกขั้นตอนปฏิบัติการตามสถานการณ์' : 'Select Emergency Scenario Protocol'}
            </span>

            <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
              {procedures.map((proc) => {
                const isSelected = selectedProc.EmergencyID === proc.EmergencyID;
                return (
                  <button
                    key={proc.EmergencyID}
                    onClick={() => setSelectedProc(proc)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'TH' ? proc.TitleTH : proc.TitleEN}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Procedure Details Card */}
          <div className="bg-slate-50 dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span>
                  {lang === 'TH' ? selectedProc.TitleTH : selectedProc.TitleEN}
                </span>
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {selectedProc.EmergencyID}
              </span>
            </div>

            {/* 3 Step Protocol */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {lang === 'TH' ? 'ขั้นตอนที่ 1' : 'Step 1'}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedProc.Step1TH}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {lang === 'TH' ? 'ขั้นตอนที่ 2' : 'Step 2'}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedProc.Step2TH}</p>
                  <div className="mt-1 flex gap-2">
                    <a
                      href={`tel:${selectedProc.PrimaryPhone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{lang === 'TH' ? 'กดโทรออก:' : 'Dial:'} {selectedProc.PrimaryPhone}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {lang === 'TH' ? 'ขั้นตอนที่ 3' : 'Step 3'}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedProc.Step3TH}</p>
                  {selectedProc.SecondaryPhone && (
                    <div className="mt-1 flex gap-2">
                      <a
                        href={`tel:${selectedProc.SecondaryPhone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{lang === 'TH' ? 'สายรอง/สถานทูต:' : 'Secondary Line:'} {selectedProc.SecondaryPhone}</span>
                      </a>
                    </div>
                  )}
                  {selectedProc.MapURL && (
                    <div className="mt-1">
                      <a
                        href={selectedProc.MapURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{lang === 'TH' ? 'แผนที่สถานทูตไทย ณ กรุงโตเกียว' : 'Embassy Map'}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Local Japanese Phrase Box */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <span>🇯🇵</span>
                  <span>{lang === 'TH' ? 'ข้อความภาษาญี่ปุ่นสำหรับขอความช่วยเหลือคนในพื้นที่' : 'Japanese Text to Show Locals'}</span>
                </span>
              </div>

              <p className="text-base sm:text-lg font-bold text-slate-950 dark:text-amber-100 leading-relaxed font-sans mb-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200/80 dark:border-amber-700/60">
                {selectedProc.LocalHelpText}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSpeak(selectedProc.LocalHelpText)}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{lang === 'TH' ? 'อ่านออกเสียงภาษาญี่ปุ่น' : 'Play Japanese Audio'}</span>
                </button>

                <button
                  onClick={() => setFullscreenPhrase(selectedProc.LocalHelpText)}
                  className="flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 text-xs font-bold py-2 px-3 rounded-xl border border-amber-300 dark:border-amber-700 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>{lang === 'TH' ? 'แสดงตัวหนังสือขนาดใหญ่' : 'Enlarge for Local'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Location Sharing inside SOS */}
          <LocationShareCard
            traveler={traveler}
            tourLeader={tourLeader}
            privacyNote={privacyNote}
            lang={lang}
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            {lang === 'TH' ? 'กลับสู่หน้าหลัก' : 'Back to Main Screen'}
          </button>
        </div>
      </div>
    </div>
  );
};
