'use client';

import { useState, useEffect } from 'react';

/**
 * [REQ-UI-006-02] Privacy Consent Banner
 * GDPR-compliant cookie consent banner.
 */
export function ConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Mock: Check local storage
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
        <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-lg rounded-lg border border-classic-gold/20 bg-paper-white p-6 shadow-2xl sm:left-auto sm:right-4">
            <h3 className="mb-2 font-bold text-preludio-black">We value your privacy</h3>
            <p className="mb-4 text-sm text-gray-600">
                We use cookies to enhance your experience and analyze traffic.
            </p>
            <div className="flex gap-2">
                <button
                    onClick={handleAccept}
                    className="rounded-md bg-preludio-black px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                    Accept All
                </button>
                <button
                    onClick={() => setIsVisible(false)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 bg-white"
                >
                    Reject
                </button>
            </div>
        </div>
    );
}
