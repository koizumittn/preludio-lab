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
        <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-lg rounded-lg border border-[#C5A059] bg-[#F9F9F7] p-6 shadow-2xl sm:left-auto sm:right-4">
            <h3 className="mb-2 font-bold text-[#1A1A1A]">{t('title')}</h3>
            <p className="mb-4 text-sm text-[#44403C]">
                {t('message')}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={handleAccept}
                    className="rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#333333]"
                >
                    {t('accept')}
                </button>
                <button
                    onClick={() => setIsVisible(false)}
                    className="rounded-md border border-[#D6D3D1] bg-white px-4 py-2 text-sm font-bold text-[#44403C] transition hover:bg-[#F5F5F4]"
                >
                    {t('reject')}
                </button>
            </div>
        </div>
    );
}
