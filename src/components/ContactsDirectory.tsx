import React from 'react';
import { Contact, Trip } from '../types.ts';
import {
  Phone,
  MessageSquare,
  Mail,
  Shield,
  Building,
  UserCheck,
  Compass,
  FileQuestion,
  ExternalLink,
} from 'lucide-react';

interface ContactsDirectoryProps {
  contacts: Contact[];
  trip: Trip;
  lang: 'TH' | 'EN';
}

const roleBadges: Record<string, { labelTH: string; labelEN: string; color: string; icon: React.ReactNode }> = {
  'Tour Leader': {
    labelTH: 'หัวหน้าทัวร์',
    labelEN: 'Tour Leader',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: <UserCheck className="w-3.5 h-3.5 text-rose-600" />,
  },
  'Local Guide': {
    labelTH: 'ไกด์ท้องถิ่นญี่ปุ่น',
    labelEN: 'Local Guide',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <Compass className="w-3.5 h-3.5 text-amber-600" />,
  },
  Company: {
    labelTH: 'บริษัททัวร์ (24 ชม.)',
    labelEN: 'HQ Support (24h)',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Shield className="w-3.5 h-3.5 text-blue-600" />,
  },
  Hotel: {
    labelTH: 'ฟร้อนท์โรงแรม',
    labelEN: 'Hotel Desk',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Building className="w-3.5 h-3.5 text-purple-600" />,
  },
};

export const ContactsDirectory: React.FC<ContactsDirectoryProps> = ({
  contacts,
  trip,
  lang,
}) => {
  return (
    <div className="space-y-4">
      {/* Official Tour Staff & Hotline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {contacts.map((contact) => {
          const badge = roleBadges[contact.Role] || {
            labelTH: contact.Role,
            labelEN: contact.Role,
            color: 'bg-slate-100 text-slate-800 border-slate-200',
            icon: <UserCheck className="w-3.5 h-3.5" />,
          };

          return (
            <div
              key={contact.ContactID}
              id={`contact-${contact.ContactID}`}
              className="bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}
                  >
                    {badge.icon}
                    <span>{lang === 'TH' ? badge.labelTH : badge.labelEN}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {contact.Language}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {contact.Name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {contact.Organization} {contact.Note && `• ${contact.Note}`}
                </p>

                <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">
                  {contact.Phone}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/70">
                {contact.CallEnabled === 'Yes' && (
                  <a
                    href={`tel:${contact.Phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-rose-400" />
                    <span>{lang === 'TH' ? 'โทรออก' : 'Call'}</span>
                  </a>
                )}

                {contact.MessageEnabled === 'Yes' && (
                  <a
                    href={`sms:${contact.Phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold py-2 px-3 rounded-xl transition-colors border border-slate-200 dark:border-slate-600"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    <span>{lang === 'TH' ? 'ส่งข้อความ' : 'SMS'}</span>
                  </a>
                )}

                {contact.Email && (
                  <a
                    href={`mailto:${contact.Email}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-600"
                    title={contact.Email}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Royal Thai Embassy in Tokyo Official Card */}
      <div className="bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/60 rounded-xl text-purple-700 dark:text-purple-300">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider block">
                {lang === 'TH' ? 'หน่วยงานทางการไทยในญี่ปุ่น' : 'Official Thai Mission in Japan'}
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {trip.EmbassyName}
              </h4>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
          {lang === 'TH'
            ? 'ดูแลให้ความช่วยเหลือกรณีหนังสือเดินทางสูญหาย คดีความ หรือเหตุฉุกเฉินระดับประเทศ'
            : 'Consular and emergency support for passport loss or diplomatic assistance.'}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <a
            href={`tel:${trip.EmbassyPhone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{trip.EmbassyPhone}</span>
          </a>

          <a
            href={trip.EmbassyMapURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-900 dark:text-purple-300 text-xs font-semibold py-2 px-4 rounded-xl border border-purple-200 dark:border-purple-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{lang === 'TH' ? 'เปิดแผนที่สถานทูต' : 'Embassy Map'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
