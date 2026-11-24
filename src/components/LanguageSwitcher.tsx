import React from 'react';
import type { Language } from '../types/window';

interface LanguageSwitcherProps {
  language: Language;
  onChange: (lang: Language) => void;
  compact?: boolean;
}

const LANG_OPTIONS: { id: Language; label: string }[] = [
  { id: 'uz', label: "O'Z" },
  { id: 'ru', label: 'РУ' },
  { id: 'en', label: 'EN' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  language,
  onChange,
  compact = false,
}) => {
  return (
    <div
      className="inline-flex items-center p-1 bg-[#EEF1F5] border border-slate-200 rounded-lg shrink-0"
      role="group"
      aria-label="Language"
    >
      {LANG_OPTIONS.map((opt) => {
        const active = language === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`${
              compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
            } font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#D91E2A] ${
              active
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
