const VISITOR_KEY = 'wajd.analytics.visitor';
const SESSION_KEY = 'wajd.analytics.session';
const SESSION_WINDOW_MS = 30 * 60 * 1000;
const HEARTBEAT_MS = 15 * 1000;
const FLUSH_INTERVAL_MS = 4 * 1000;
const MAX_QUEUE_SIZE = 40;

const safeStorage = (storage) => {
    try {
        return storage;
    } catch {
        return null;
    }
};

const createId = (prefix) => {
    if (window.crypto?.randomUUID) return `${prefix}_${window.crypto.randomUUID()}`;
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
};

const readJson = (storage, key) => {
    try {
        const value = storage?.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
};

const writeJson = (storage, key, value) => {
    try {
        storage?.setItem(key, JSON.stringify(value));
    } catch {
        // Analytics must never break the public site when storage is blocked.
    }
};

const getVisitorId = () => {
    const storage = safeStorage(window.localStorage);
    const existing = storage?.getItem(VISITOR_KEY);
    if (existing) return existing;
    const visitorId = createId('v');
    try { storage?.setItem(VISITOR_KEY, visitorId); } catch { /* no-op */ }
    return visitorId;
};

const getSession = () => {
    const storage = safeStorage(window.sessionStorage);
    const existing = readJson(storage, SESSION_KEY);
    const now = Date.now();
    if (existing?.token && existing?.lastActiveAt && now - existing.lastActiveAt < SESSION_WINDOW_MS) {
        const next = { ...existing, lastActiveAt: now };
        writeJson(storage, SESSION_KEY, next);
        return next;
    }
    const next = { token: createId('s'), startedAt: now, lastActiveAt: now };
    writeJson(storage, SESSION_KEY, next);
    return next;
};

const getCampaign = () => {
    const params = new URLSearchParams(window.location.search);
    return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].reduce((result, key) => {
        const value = params.get(key);
        if (value) result[key] = value.slice(0, 120);
        return result;
    }, {});
};

const getDeviceType = () => {
    const width = window.innerWidth || 1024;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
};

const truncate = (value, max = 160) => String(value ?? '').slice(0, max);

let runtime = null;

const buildEvent = (eventType, properties = {}) => {
    const session = runtime.session;
    return {
        session_token: session.token,
        visitor_id: runtime.visitorId,
        event_type: truncate(eventType, 80),
        page_path: truncate(window.location.pathname || '/', 240),
        locale: document.documentElement.lang === 'en' ? 'en' : 'ar',
        properties: {
            ...properties,
            device_type: getDeviceType(),
            viewport_width: window.innerWidth || null,
            referrer: truncate(document.referrer, 300),
        },
        occurred_at: new Date().toISOString(),
        metadata: {
            landing_page: runtime.landingPage,
            campaign: runtime.campaign,
        },
    };
};

const flush = (useBeacon = false) => {
    if (!runtime || runtime.queue.length === 0 || runtime.flushing) return;
    runtime.flushing = true;
    const events = runtime.queue.splice(0, MAX_QUEUE_SIZE);
    const body = JSON.stringify({ events });
    const endpoint = '/api/analytics/collect';

    let delivered = false;
    if (useBeacon && navigator.sendBeacon) {
        try {
            delivered = navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
        } catch {
            delivered = false;
        }
    }

    if (!delivered) {
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body,
            keepalive: true,
        }).catch(() => {
            runtime.queue.unshift(...events);
            runtime.queue = runtime.queue.slice(-MAX_QUEUE_SIZE);
        }).finally(() => {
            runtime.flushing = false;
        });
    } else {
        runtime.flushing = false;
    }
};

const enqueue = (eventType, properties = {}) => {
    if (!runtime) return;
    runtime.session.lastActiveAt = Date.now();
    writeJson(safeStorage(window.sessionStorage), SESSION_KEY, runtime.session);
    runtime.queue.push(buildEvent(eventType, properties));
    runtime.queue = runtime.queue.slice(-MAX_QUEUE_SIZE);
    if (runtime.queue.length >= 8) flush();
};

const collectClickContext = (element) => {
    const analyticsElement = element.closest('[data-analytics-event]');
    if (!analyticsElement) return null;
    return {
        eventType: analyticsElement.dataset.analyticsEvent,
        properties: {
            label: truncate(analyticsElement.dataset.analyticsLabel || analyticsElement.textContent, 120),
            location: truncate(analyticsElement.dataset.analyticsLocation || window.location.pathname, 120),
            target: truncate(analyticsElement.dataset.analyticsTarget || analyticsElement.getAttribute('href') || '', 160),
        },
    };
};

const getScrollDepth = () => {
    const documentHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    return Math.min(100, Math.round((window.scrollY / documentHeight) * 100));
};

export const trackAnalyticsEvent = (eventType, properties = {}) => enqueue(eventType, properties);

export const startAnalytics = () => {
    if (runtime || typeof window === 'undefined') return () => {};

    const session = getSession();
    runtime = {
        visitorId: getVisitorId(),
        session,
        landingPage: window.location.pathname,
        campaign: getCampaign(),
        queue: [],
        flushing: false,
        maxScrollDepth: 0,
    };

    const onClick = (event) => {
        const context = collectClickContext(event.target);
        if (context) trackAnalyticsEvent(context.eventType, context.properties);
    };
    let scrollTimeout = null;
    const onScroll = () => {
        if (scrollTimeout) return;
        scrollTimeout = window.setTimeout(() => {
            scrollTimeout = null;
            const depth = getScrollDepth();
            if (depth >= runtime.maxScrollDepth + 25) {
                runtime.maxScrollDepth = Math.floor(depth / 25) * 25;
                trackAnalyticsEvent('scroll_depth', { depth: runtime.maxScrollDepth });
            }
        }, 1000); // Only check scroll depth once per second
    };
    const onVisibility = () => {
        if (document.visibilityState === 'hidden') {
            trackAnalyticsEvent('session_pause', { duration_seconds: Math.round((Date.now() - session.startedAt) / 1000) });
            flush(true);
        } else {
            trackAnalyticsEvent('session_resume');
        }
    };
    const onPageHide = () => {
        trackAnalyticsEvent('session_end', { duration_seconds: Math.round((Date.now() - session.startedAt) / 1000) });
        flush(true);
    };

    document.addEventListener('click', onClick, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    const flushTimer = window.setInterval(() => flush(), FLUSH_INTERVAL_MS);
    const isMobile = window.innerWidth < 768;
    const heartbeatTimer = window.setInterval(() => {
        trackAnalyticsEvent('engagement_heartbeat', {
            duration_seconds: Math.round((Date.now() - session.startedAt) / 1000),
            scroll_depth: runtime.maxScrollDepth,
        });
        flush();
    }, isMobile ? HEARTBEAT_MS * 2 : HEARTBEAT_MS); // Less frequent heartbeats on mobile

    return () => {
        document.removeEventListener('click', onClick);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('pagehide', onPageHide);
        window.clearInterval(flushTimer);
        window.clearInterval(heartbeatTimer);
        flush(true);
        runtime = null;
    };
};

export const trackRouteView = (pathname, locale) => {
    trackAnalyticsEvent('page_view', {
        path: truncate(pathname || '/', 240),
        locale: locale === 'en' ? 'en' : 'ar',
        title: truncate(document.title, 180),
    });
};

export const getAnalyticsSessionToken = () => runtime?.session?.token || null;

export default startAnalytics;

if (typeof window !== 'undefined') {
    window.wajdAnalytics = {
        track: trackAnalyticsEvent,
        getSessionToken: getAnalyticsSessionToken,
    };
}

// Tracking plan: page_view, scroll_depth, cta_clicked, builder_base_selected,
// builder_addon_toggled, builder_started, contact_form_started, lead_submitted,
// engagement_heartbeat, session_pause, session_resume, session_end.
