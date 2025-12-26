'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

/**
 * [REQ-UI-006-02] Privacy Consent Banner
 * GDPR-compliant cookie consent banner.
 */
export function ConsentBanner() {


    const t = useTranslations('Consent');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consented = localStorage.getItem('cookie-consent');
        if (!consented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-lg rounded-lg border border-classic-gold bg-paper-white p-6 shadow-2xl sm:left-auto sm:right-4">
            <h3 className="mb-2 font-bold text-preludio-black">{t('title')}</h3>
            <p className="mb-4 text-sm text-gray-600">
                {t('message')}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={handleAccept}
                    className="rounded-md bg-preludio-black px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                    {t('accept')}
                </button>
                <button
                    onClick={() => setIsVisible(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                    {t('reject')}
                </button>
            </div>
        </div>
    );
}
