import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../translations.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [lang, setLang] = useState('ar');
    // Wajd is currently focused exclusively on Gulf markets.
    const [currency] = useState('SAR');
    const setCurrency = () => {}; 

    const t = translations[lang];
    const [content, setContent] = useState(null);
    const [contentLoading, setContentLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setContentLoading(true);
        fetch(`/api/content?locale=${lang}`, { headers: { Accept: 'application/json' } })
            .then((response) => {
                if (!response.ok) throw new Error('Content API unavailable');
                return response.json();
            })
            .then((payload) => {
                if (mounted) setContent(payload.data || null);
            })
            .catch(() => {
                if (mounted) setContent(null);
            })
            .finally(() => {
                if (mounted) setContentLoading(false);
            });

        return () => { mounted = false; };
    }, [lang]);

    const toggleLang = () => {
        setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
    };

    const toggleCurrency = () => {
        // Kept as a compatibility no-op for legacy components; SAR is the only active currency.
    };

    return (
        <AppContext.Provider value={{ lang, setLang, toggleLang, currency, setCurrency, toggleCurrency, t, content, contentLoading }}>
            <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {children}
            </div>
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
