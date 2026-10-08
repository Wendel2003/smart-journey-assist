import React, { useState, useRef } from 'react';
import { Traveler } from '../types.ts';
import {
  ShieldCheck,
  Lock,
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
  User,
  Globe,
  Award,
  Camera,
  RotateCcw,
} from 'lucide-react';

interface PassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  traveler: Traveler;
  lang: 'TH' | 'EN';
}

export const PassportModal: React.FC<PassportModalProps> = ({
  isOpen,
  onClose,
  traveler,
  lang,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showFullNumber, setShowFullNumber] = useState<boolean>(true);
  const [customPhoto, setCustomPhoto] = useState<string>(() => {
    return localStorage.getItem(`traveler_photo_${traveler.TravelerID}`) || '';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomPhoto(dataUrl);
        try {
          localStorage.setItem(`traveler_photo_${traveler.TravelerID}`, dataUrl);
        } catch {
          // Ignore quota error
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomPhoto('');
    localStorage.removeItem(`traveler_photo_${traveler.TravelerID}`);
  };

  if (!isOpen) return null;

  const currentPhoto = customPhoto || traveler.PhotoURL || '/traveler-photo.jpg';

  const passportNo = traveler.PassportNumber || 'AC4892011';
  const issueDate = traveler.PassportIssueDate || '2023-05-19';
  const expiryDate = traveler.PassportExpiry || '2033-05-18';
  const dob = traveler.DateOfBirth || '1985-08-14';
  const sex = traveler.Sex || 'M';
  const nationality = traveler.Nationality || 'THAI';

  // Split name for passport format
  const nameParts = traveler.FullNameEN.trim().split(' ');
  const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
  const givenNames = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : '';

  // Generate standard 2-line ICAO Doc 9303 MRZ format
  const cleanPassport = passportNo.padEnd(9, '<').slice(0, 9);
  const dobFormatted = dob.replace(/-/g, '').slice(2); // YYMMDD
  const expFormatted = expiryDate.replace(/-/g, '').slice(2); // YYMMDD
  const mrzLine1 = `P<THA${surname}<<${givenNames}`.padEnd(44, '<').slice(0, 44);
  const mrzLine2 = `${cleanPassport}4THA${dobFormatted}1${sex}${expFormatted}8<<<<<<<<<<<<<<02`.padEnd(44, '<').slice(0, 44);

  const handleCopyPassport = () => {
    navigator.clipboard.writeText(passportNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maskedPassport = showFullNumber
    ? passportNo
    : `${passportNo.slice(0, 2)}••••${passportNo.slice(-2)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        id="passport-modal"
        className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-700 text-white max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <span>{lang === 'TH' ? 'หนังสือเดินทางอิเล็กทรอนิกส์' : 'Electronic Passport'}</span>
                <span className="text-[10px] font-mono font-semibold bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                  THAILAND
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {lang === 'TH' ? 'สำเนาข้อมูลดิจิทัลเฉพาะบุคคล' : 'Personal digital passport copy'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Passport Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Main Passport Page Card */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#fdfbf7] to-[#f4eee1] text-slate-900 p-4 sm:p-5 shadow-lg border border-amber-200/80">
            {/* Background Watermark/Security Motif */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
              <div className="w-64 h-64 border-8 border-slate-900 rounded-full flex items-center justify-center">
                <span className="text-5xl font-black">THAILAND</span>
              </div>
            </div>

            {/* Passport Header */}
            <div className="border-b border-amber-300/70 pb-3 flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                {/* Thai Royal Emblem Motif / Garuda Placeholder */}
                <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-amber-900 tracking-wider">
                    ประเทศไทย / THAILAND
                  </div>
                  <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight">
                    หนังสือเดินทาง • PASSPORT
                  </div>
                </div>
              </div>

              {/* Passport Type & Country Code */}
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-500">TYPE / รหัส</div>
                <div className="text-xs font-mono font-black text-slate-800">P / THA</div>
              </div>
            </div>

            {/* Passport Identity Grid */}
            <div className="mt-3.5 flex flex-col sm:flex-row gap-4 relative z-10">
              {/* Photo & Signature box */}
              <div className="flex sm:flex-col items-center sm:items-stretch gap-3 sm:w-28 shrink-0">
                {/* Hidden File Input for Custom Photo Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <div
                  className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl bg-slate-200 border-2 border-slate-300 relative overflow-hidden flex flex-col items-center justify-center shadow-inner group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title={lang === 'TH' ? 'คลิกเพื่อเปลี่ยนรูปถ่าย' : 'Click to change photo'}
                >
                  <img
                    id="passport-traveler-photo"
                    src={currentPhoto}
                    alt={traveler.FullNameEN}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/traveler-photo.jpg';
                    }}
                  />

                  {/* Change photo overlay button on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 p-1">
                    <Camera className="w-5 h-5 text-amber-300" />
                    <span className="text-[9px] font-bold text-center leading-tight">
                      {lang === 'TH' ? 'เปลี่ยนรูป' : 'Change Photo'}
                    </span>
                  </div>

                  {/* Hologram security overlay ribbon */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-400/40 via-amber-300/10 to-transparent h-10 pointer-events-none" />
                  <div className="absolute top-1 right-1 text-[8px] bg-amber-600/90 backdrop-blur-xs text-white font-mono px-1 rounded shadow-xs">
                    e-PASS
                  </div>
                </div>

                {customPhoto && (
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="flex items-center justify-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>{lang === 'TH' ? 'รีเซ็ตรูป' : 'Reset'}</span>
                  </button>
                )}

                {/* Digital Signature box */}
                <div className="flex-1 sm:flex-none p-1.5 bg-white/70 rounded-lg border border-slate-300 text-center">
                  <div className="text-[9px] text-slate-400">ลายมือชื่อผู้ถือหนังสือ</div>
                  <div className="font-serif italic font-bold text-xs text-slate-800 truncate">
                    {traveler.FullNameEN}
                  </div>
                </div>
              </div>

              {/* Fields Grid */}
              <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                {/* Passport Number */}
                <div className="col-span-2 bg-white/80 p-2 rounded-xl border border-amber-200/90 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      หนังสือเดินทางเลขที่ / Passport No.
                    </div>
                    <div className="text-base sm:text-lg font-mono font-black text-amber-900 tracking-wider">
                      {maskedPassport}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowFullNumber(!showFullNumber)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title={showFullNumber ? 'ซ่อนเลข' : 'แสดงเลข'}
                    >
                      {showFullNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPassport}
                      className="flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold rounded-lg border border-amber-300 cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                    </button>
                  </div>
                </div>

                {/* Surname */}
                <div className="col-span-2">
                  <div className="text-[9px] text-slate-500 uppercase">ชื่อสกุล / Surname</div>
                  <div className="font-bold text-slate-900 uppercase font-mono">{surname}</div>
                </div>

                {/* Given Names */}
                <div className="col-span-2">
                  <div className="text-[9px] text-slate-500 uppercase">ชื่อตัว / Given names</div>
                  <div className="font-bold text-slate-900 uppercase font-mono">{givenNames}</div>
                </div>

                {/* Thai Name */}
                <div className="col-span-2">
                  <div className="text-[9px] text-slate-500">ชื่อภาษาไทย / Thai Name</div>
                  <div className="font-bold text-slate-800">{traveler.FullNameTH}</div>
                </div>

                {/* Nationality */}
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">สัญชาติ / Nationality</div>
                  <div className="font-bold text-slate-900 font-mono">{nationality}</div>
                </div>

                {/* Sex */}
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">เพศ / Sex</div>
                  <div className="font-bold text-slate-900 font-mono">{sex}</div>
                </div>

                {/* Date of Birth */}
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">วันเกิด / Date of birth</div>
                  <div className="font-bold text-slate-900 font-mono">{dob}</div>
                </div>

                {/* Place of Birth */}
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">สถานที่เกิด / Place of birth</div>
                  <div className="font-bold text-slate-900 font-mono">BANGKOK</div>
                </div>

                {/* Date of Issue */}
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">วันที่ออก / Date of issue</div>
                  <div className="font-bold text-slate-900 font-mono">{issueDate}</div>
                </div>

                {/* Date of Expiry */}
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">วันหมดอายุ / Date of expiry</div>
                  <div className="font-bold text-rose-700 font-mono">{expiryDate}</div>
                </div>
              </div>
            </div>

            {/* MRZ (Machine Readable Zone) */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-amber-300/80 font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-800 bg-white/60 p-2.5 rounded-xl border border-slate-200 overflow-x-auto leading-relaxed select-all">
              <div className="whitespace-pre">{mrzLine1}</div>
              <div className="whitespace-pre">{mrzLine2}</div>
            </div>
          </div>

          {/* Guidelines & Safety Advice */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'TH' ? 'ข้อแนะนำความปลอดภัยสำหรับพาสปอร์ต' : 'Passport Safety Advice'}</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 pl-4 list-disc marker:text-amber-400">
              <li>
                {lang === 'TH'
                  ? 'กรุณาพกเล่มจริงไว้ในกระเป๋าติดตัวตลอดการเดินทาง และไม่ฝากไว้ในกระเป๋าเดินทางใบใหญ่ใต้ท้องเครื่อง'
                  : 'Always keep your physical passport with you; do not put it in checked luggage.'}
              </li>
              <li>
                {lang === 'TH'
                  ? 'หน้านี้สามารถใช้แสดงข้อมูลและเลขพาสปอร์ตให้หัวหน้าทัวร์หรือโรงแรมได้อย่างรวดเร็ว'
                  : 'You can use this digital copy for quick hotel check-in or tour leader verification.'}
              </li>
              <li>
                {lang === 'TH'
                  ? 'กรณีพาสปอร์ตสูญหาย ติดต่อหัวหน้าทัวร์ทันที หรือโทรสถานเอกอัครราชทูตไทย'
                  : 'If lost, report immediately to your tour leader or the Thai Embassy.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lang === 'TH' ? 'เข้ารหัสเฉพาะผู้ใช้งานนี้' : 'Private to this traveler'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {lang === 'TH' ? 'ปิดหน้าต่าง' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
