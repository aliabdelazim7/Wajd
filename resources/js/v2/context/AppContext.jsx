import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { translations } from '../translations.js';
import { CURRENCIES, DEFAULT_CURRENCY } from '../utils/currency.js';

const AppContext = createContext();

const getInitialLanguage = () => {
    if (typeof window === 'undefined') return 'ar';
    const queryLocale = new URLSearchParams(window.location.search).get('lang');
    if (queryLocale === 'ar' || queryLocale === 'en') return queryLocale;
    const storedLocale = window.localStorage.getItem('wajd.locale');
    const hasExplicitChoice = window.localStorage.getItem('wajd.locale.selected') === '1';
    return hasExplicitChoice && storedLocale === 'en' ? 'en' : 'ar';
};

const getInitialCurrency = () => {
    if (typeof window === 'undefined') return DEFAULT_CURRENCY;
    const stored = window.localStorage.getItem('wajd.currency');
    return stored && CURRENCIES[stored] ? stored : DEFAULT_CURRENCY;
};

export const AppProvider = ({ children }) => {
    const [lang, setLangState] = useState(getInitialLanguage);
    const [currency, setCurrencyState] = useState(getInitialCurrency);
    const t = translations[lang];
    const [content, setContent] = useState(null);
    const [contentLoading, setContentLoading] = useState(true);

    const setLang = useCallback((nextLanguage) => {
        setLangState((currentLanguage) => {
            const next = typeof nextLanguage === 'function' ? nextLanguage(currentLanguage) : nextLanguage;
            if (typeof window !== 'undefined') window.localStorage.setItem('wajd.locale.selected', '1');
            return next === 'en' ? 'en' : 'ar';
        });
    }, []);

    const setCurrency = useCallback((nextCurrency) => {
        setCurrencyState((currentCurrency) => {
            const next = typeof nextCurrency === 'function' ? nextCurrency(currentCurrency) : nextCurrency;
            return CURRENCIES[next] ? next : DEFAULT_CURRENCY;
        });
    }, []);

    useEffect(() => {
        window.localStorage.setItem('wajd.locale', lang);
        document.cookie = `wajd_locale=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, [lang]);

    useEffect(() => {
        window.localStorage.setItem('wajd.currency', currency);
    }, [currency]);

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

    const toggleLang = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
    const toggleCurrency = () => setCurrency((current) => {
        const keys = Object.keys(CURRENCIES);
        return keys[(keys.indexOf(current) + 1) % keys.length];
    });

    return (
        <AppContext.Provider value={{ lang, setLang, toggleLang, currency, setCurrency, toggleCurrency, currencies: CURRENCIES, t, content, contentLoading }}>
            <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>{children}</div>
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
