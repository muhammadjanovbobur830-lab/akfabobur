import React, { useState } from 'react';
import { ArrowRight, Check, Phone } from 'lucide-react';
import type { TranslationDict } from '../i18n/translations';
import type { Language } from '../types/window';
import { formatUzPhone, isValidUzPhone } from '../utils/phone';
import { AkfaLogo } from './AkfaLogo';
import { LanguageSwitcher } from './LanguageSwitcher';

interface PhoneGateProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: TranslationDict;
  initialPhone?: string;
  onUnlock: (validPhone: string) => void;
}

export const PhoneGate: React.FC<PhoneGateProps> = ({
  language,
  onLanguageChange,
  t,
  initialPhone = '',
  onUnlock,
}) => {
  const [phone, setPhone] = useState<string>(
    initialPhone ? formatUzPhone(initialPhone) : '+998 '
  );
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const valid = isValidUzPhone(phone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatUzPhone(e.target.value);
    setPhone(masked);
    if (touched && isValidUzPhone(masked)) {
      setError('');
    } else if (error) {
      setError('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent deleting the "+998 " prefix
    if (
      (e.key === 'Backspace' || e.key === 'Delete') &&
      phone.replace(/\D/g, '').length <= 3
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidUzPhone(phone)) {
      setError(t.gate.phoneError);
      return;
    }
    onUnlock(formatUzPhone(phone));
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-between p-4 sm:p-8">
      {/* Top header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4">
        <AkfaLogo size="md" />
        <LanguageSwitcher language={language} onChange={onLanguageChange} />
      </header>

      {/* Main Entry Card */}
      <main className="w-full max-w-5xl mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left architectural editorial intro + SVG elevation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#D91E2A]">
              AKFA Windows &amp; Doors
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight text-balance">
              {t.gate.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              {t.gate.subtitle}
            </p>
          </div>

          <ul className="space-y-2.5 pt-1">
            {t.gate.benefits.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm sm:text-base text-slate-700 font-medium">
                <span className="w-5 h-5 rounded-md bg-[#D91E2A]/10 text-[#D91E2A] inline-flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Clean architectural window schematic graphic */}
          <div className="hidden sm:block pt-2">
            <svg
              viewBox="0 0 460 150"
              className="w-full max-w-md text-slate-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="10" y="12" width="440" height="122" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
              <rect x="20" y="22" width="132" height="102" fill="#E6F2F8" stroke="#94A3B8" strokeWidth="1.5" />
              <rect x="164" y="22" width="132" height="102" fill="#E6F2F8" stroke="#94A3B8" strokeWidth="1.5" />
              <rect x="308" y="22" width="132" height="102" fill="#E6F2F8" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Opening symbols */}
              <path d="M20 22L152 73L20 124" stroke="#64748B" strokeWidth="1.2" strokeDasharray="4 3" />
              <path d="M20 124L86 22L152 124" stroke="#64748B" strokeWidth="1.2" strokeDasharray="4 3" />
              <path d="M164 22L296 124M296 22L164 124" stroke="#94A3B8" strokeWidth="1" strokeOpacity="0.55" />
              <path d="M440 22L308 73L440 124" stroke="#64748B" strokeWidth="1.2" strokeDasharray="4 3" />
              <path d="M308 124L374 22L440 124" stroke="#64748B" strokeWidth="1.2" strokeDasharray="4 3" />
              {/* Sill */}
              <rect x="2" y="134" width="456" height="8" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
            </svg>
          </div>
        </div>

        {/* Right Phone Gate Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="gate-phone-input"
                className="block text-sm font-bold text-[#0F172A]"
              >
                {t.gate.phoneLabel}
              </label>
              <p className="text-xs text-slate-500 leading-relaxed">{t.gate.phoneHint}</p>
            </div>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="gate-phone-input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="+998 90 123 45 67"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'gate-phone-error' : undefined}
                className={`w-full pl-10 pr-4 py-3.5 text-base font-mono tabular-nums font-medium rounded-xl border bg-[#F8FAFC] text-[#0F172A] transition-colors focus:outline-none focus:bg-white ${
                  error
                    ? 'border-[#D91E2A] ring-2 ring-[#D91E2A]/15'
                    : valid
                      ? 'border-emerald-500 ring-2 ring-emerald-500/15'
                      : 'border-slate-300 focus:border-[#0F172A]'
                }`}
              />
            </div>

            {error && (
              <p
                id="gate-phone-error"
                role="alert"
                className="text-xs font-semibold text-[#D91E2A]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] px-5 py-3.5 rounded-xl bg-[#D91E2A] hover:bg-[#B81620] text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D91E2A] whitespace-nowrap"
            >
              <span>{t.gate.enterButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto text-xs text-slate-400 flex items-center justify-between">
        <span>AKFI Deraza · Uzbekistan</span>
        <span className="font-mono">+998 XX XXX XX XX</span>
      </footer>
    </div>
  );
};
