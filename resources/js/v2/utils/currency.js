export const CURRENCIES = {
    SAR: { code: 'SAR', labelAr: 'ريال سعودي', labelEn: 'Saudi riyal', locale: 'ar-SA', rate: 1 },
    AED: { code: 'AED', labelAr: 'درهم إماراتي', labelEn: 'UAE dirham', locale: 'ar-AE', rate: 0.98 },
    QAR: { code: 'QAR', labelAr: 'ريال قطري', labelEn: 'Qatari riyal', locale: 'ar-QA', rate: 0.97 },
    KWD: { code: 'KWD', labelAr: 'دينار كويتي', labelEn: 'Kuwaiti dinar', locale: 'ar-KW', rate: 0.082 },
    BHD: { code: 'BHD', labelAr: 'دينار بحريني', labelEn: 'Bahraini dinar', locale: 'ar-BH', rate: 0.10 },
    OMR: { code: 'OMR', labelAr: 'ريال عماني', labelEn: 'Omani rial', locale: 'ar-OM', rate: 0.103 },
    EGP: { code: 'EGP', labelAr: 'جنيه مصري', labelEn: 'Egyptian pound', locale: 'ar-EG', rate: 13.25 },
};

export const DEFAULT_CURRENCY = 'SAR';

export const convertFromSar = (amount, currency = DEFAULT_CURRENCY) => {
    const target = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
    return Math.round(Number(amount || 0) * target.rate);
};

export const formatMoney = (amount, currency = DEFAULT_CURRENCY, lang = 'ar') => {
    const target = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
    return new Intl.NumberFormat(lang === 'ar' ? target.locale : 'en-US', {
        style: 'currency',
        currency: target.code,
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: ['KWD', 'BHD', 'OMR'].includes(target.code) ? 2 : 0,
    }).format(convertFromSar(amount, target.code));
};

export const currencyLabel = (currency, lang = 'ar') => {
    const target = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
    return lang === 'ar' ? target.labelAr : target.labelEn;
};
