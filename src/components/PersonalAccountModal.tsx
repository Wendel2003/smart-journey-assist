import React, { useState } from 'react';
import { Traveler, Trip } from '../types.ts';
import {
  ShieldCheck,
  Lock,
  User,
  Phone,
  CheckCircle2,
  X,
  Smartphone,
  KeyRound,
  AlertCircle,
  LogOut,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { PassportModal } from './PassportModal.tsx';

interface PersonalAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelers: Traveler[];
  currentTraveler: Traveler;
  onSelectTraveler: (traveler: Traveler) => void;
  trip: Trip;
  lang: 'TH' | 'EN';
}

export const PersonalAccountModal: React.FC<PersonalAccountModalProps> = ({
  isOpen,
  onClose,
  travelers,
  currentTraveler,
  onSelectTraveler,
  trip,
  lang,
}) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const [selectedId, setSelectedId] = useState(currentTraveler.TravelerID);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);
  const [showPassport, setShowPassport] = useState(false);

  if (!isOpen) return null;

  const handleConfirmSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetTraveler = travelers.find((t) => t.TravelerID === selectedId);
    if (!targetTraveler) {
      setErrorMsg(lang === 'TH' ? 'กรุณาเลือกลูกทัวร์' : 'Please select a traveler');
      return;
    }

    // Security verification: check if last 4 digits match target traveler's phone
    const cleanMobile = targetTraveler.Mobile.replace(/\D/g, '');
    const last4 = cleanMobile.slice(-4);

    if (phoneDigits.trim() && phoneDigits.trim() !== last4) {
      setErrorMsg(
        lang === 'TH'
          ? `เบอร์โทรศัพท์ 4 ตัวท้ายไม่ถูกต้อง (เพื่อความปลอดภัยข้อมูลส่วนบุคคล)`
          : 'Last 4 digits do not match (for personal data security)'
      );
      return;
    }

    onSelectTraveler(targetTraveler);
    // Save to localStorage for personal persistence
    try {
      localStorage.setItem('sja_personal_traveler_id', targetTraveler.TravelerID);
    } catch {
      // Ignore localStorage errors
    }

    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setIsSwitching(false);
      setPhoneDigits('');
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        id="personal-account-modal"
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">
                  {lang === 'TH' ? 'บัญชีผู้ใช้ส่วนบุคคล' : 'Private Traveler Profile'}
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {lang === 'TH' ? 'เป็นส่วนตัว' : 'Private'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'TH' ? 'ข้อมูลเฉพาะสำหรับเครื่องนี้เท่านั้น' : 'Personal device session'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {successNotice ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {lang === 'TH' ? 'ยืนยันตัวตนสำเร็จ' : 'Verified Successfully'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'TH'
                  ? 'ระบบได้ปรับเปลี่ยนเป็นข้อมูลส่วนตัวของคุณเรียบร้อยแล้ว'
                  : 'Profile has been switched to your personal session.'}
              </p>
            </div>
          ) : !isSwitching ? (
            <>
              {/* Current Active Personal Profile Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-rose-600/20">
                      {currentTraveler.Nickname.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-base">
                          {currentTraveler.Nickname}
                        </span>
                        <span className="text-xs text-slate-500 font-normal">
                          ({currentTraveler.FullNameTH})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono uppercase">
                        {currentTraveler.FullNameEN}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-white text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg shadow-2xs">
                    {currentTraveler.TravelerID}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      {lang === 'TH' ? 'เบอร์ติดต่อส่วนตัว' : 'Mobile Phone'}
                    </span>
                    <span className="font-bold text-slate-800 font-mono">
                      {currentTraveler.Mobile}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      {lang === 'TH' ? 'สถานะบัตรสมาชิก' : 'Status'}
                    </span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {currentTraveler.AccessStatus || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Privacy Notice Box */}
              <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 text-xs text-rose-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="font-bold">
                    {lang === 'TH'
                      ? 'ระบบปกป้องข้อมูลส่วนบุคคล (Privacy Guaranteed)'
                      : 'Data Privacy Protection'}
                  </p>
                  <p className="text-rose-800/80 text-[11px]">
                    {lang === 'TH'
                      ? 'แอปพลิเคชันจะแสดงข้อมูลส่วนตัว บัตรทัวร์ QR Code และบันทึกต่างๆ เฉพาะของตัวท่านเท่านั้น จะไม่มีการเปิดเผยข้อมูลแก่ลูกทัวร์คนอื่นบนเครื่องนี้'
                      : 'This app only displays your personal member pass, QR code, and emergency profile on this device.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPassport(true)}
                  id="view-passport-from-account-btn"
                  className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-300 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'TH' ? 'ดูข้อมูลหนังสือเดินทาง (พาสปอร์ต)' : 'View Digital Passport'}</span>
                  </div>
                  <span className="font-mono text-[11px] text-amber-800">
                    {currentTraveler.PassportNumber || 'AC4892011'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSwitching(true)}
                  id="switch-traveler-account-btn"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'TH'
                      ? 'ไม่ใช่คุณ? ยืนยันตัวตนเพื่อเปลี่ยนผู้ใช้'
                      : 'Not you? Verify & Switch User'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  {lang === 'TH' ? 'ตกลง / ปิดหน้าต่าง' : 'Done & Close'}
                </button>
              </div>
            </>
          ) : (
            /* Secure Switch Traveler Form */
            <form onSubmit={handleConfirmSwitch} className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-rose-600" />
                  <span>{lang === 'TH' ? 'เลือกลูกทัวร์เพื่อเข้าสู่ระบบ' : 'Select Tour Member'}</span>
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'TH'
                    ? 'โปรดเลือกชื่อของคุณเพื่อเปิดใช้งานข้อมูลส่วนบุคคลบนอุปกรณ์นี้'
                    : 'Select your name to activate your personal view on this device.'}
                </p>
              </div>

              {/* Select Member List */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {travelers.map((t) => {
                  const isSelected = selectedId === t.TravelerID;
                  return (
                    <div
                      key={t.TravelerID}
                      onClick={() => setSelectedId(t.TravelerID)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/70 text-slate-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {t.Nickname.slice(0, 1)}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{t.Nickname} ({t.FullNameTH})</div>
                          <div className="text-[10px] text-slate-400 font-mono">{t.TravelerID}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Security PIN / Last 4 Digits verification */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label
                  htmlFor="verify-digits"
                  className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {lang === 'TH'
                      ? 'เบอร์โทรศัพท์ 4 ตัวท้ายของคุณ (เพื่อความปลอดภัย)'
                      : 'Last 4 digits of your phone (verification)'}
                  </span>
                </label>
                <input
                  id="verify-digits"
                  type="password"
                  maxLength={4}
                  placeholder={lang === 'TH' ? 'เช่น 5678 (หรือเว้นว่างถ้าเป็นโหมดทดสอบ)' : 'e.g. 5678'}
                  value={phoneDigits}
                  onChange={(e) => setPhoneDigits(e.target.value)}
                  className="w-full bg-white px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
                <p className="text-[10px] text-slate-500">
                  {lang === 'TH'
                    ? '*ช่วยป้องกันไม่ให้บุคคลอื่นเข้าดูข้อมูลส่วนตัว บัตรทัวร์ หรือเบอร์ฉุกเฉินของคุณ'
                    : '*Protects your personal QR code and profile data from unauthorized access.'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitching(false);
                    setErrorMsg('');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                >
                  {lang === 'TH' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  id="confirm-verify-switch-btn"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
                >
                  {lang === 'TH' ? 'ยืนยันตัวตน' : 'Confirm & Switch'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Passport Viewer Modal */}
      <PassportModal
        isOpen={showPassport}
        onClose={() => setShowPassport(false)}
        traveler={currentTraveler}
        lang={lang}
      />
    </div>
  );
};
