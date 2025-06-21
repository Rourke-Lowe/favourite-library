import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function useLocalizedData<T>(dataType: 'artists' | 'releases' | 'shows') {
  const { locale } = useLanguage();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/data/${locale}/${dataType}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${dataType}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData[dataType] as T);
      } catch (err) {
        console.error(`Error loading ${dataType}:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        
        // Fallback to English if French fails
        if (locale === 'fr') {
          try {
            const fallback = await fetch(`/data/en/${dataType}.json`);
            const fallbackData = await fallback.json();
            setData(fallbackData[dataType] as T);
          } catch {
            // Even fallback failed
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [locale, dataType]);
  
  return { data, loading, error };
}