'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  
  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
      aria-label="Switch language"
    >
      {locale === 'en' ? 'FR' : 'EN'}
    </button>
  );
}