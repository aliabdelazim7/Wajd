import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { translations } from '../translations.js';

const AppContext = createContext();

const getInitialLanguage = () => {
    if (typeof window === 'undefined') return 'ar';
    const queryLocale = new URLSearchParams(window.location.search).get('lang');
    if (queryLocale === 'ar' || queryLocale === 'en') return queryLocale;
    const storedLocale = window.localStorage.getItem('wajd.locale');
    return storedLocale === 'en' ? 'en' : 'ar';
};

export const AppProvider = ({ children }) => {
    const [lang, setLangState] = useState(getInitialLanguage);
    // Wajd is currently focused exclusively on Gulf markets.
    const [currency] = useState('SAR');
    const setCurrency = () => {};
    const t = translations[lang];
    const [content, setContent] = useState(null);
    const [contentLoading, setContentLoading] = useState(true);

    const setLang = useCallback((nextLanguage) => {
        setLangState((currentLanguage) => {
            const next = typeof nextLanguage === 'function' ? nextLanguage(currentLanguage) : nextLanguage;
            return next === 'en' ? 'en' : 'ar';
        });
    }, []);

    useEffect(() => {
        window.localStorage.setItem('wajd.locale', lang);
        document.cookie = `wajd_locale=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, [lang]);

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
        setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
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
