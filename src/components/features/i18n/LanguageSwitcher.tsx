'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/infrastructure/i18n/navigation';
import { AppLocale, supportedLocales, localeLabels } from '@/domain/shared/locale';
import { ChangeEvent, useTransition } from 'react';
import { handleClientError } from '@/utils/client-error-handler';

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value as AppLocale;

        startTransition(() => {
            try {
                router.replace(pathname, { locale: nextLocale });
            } catch (error) {
                handleClientError(error, 'Failed to switch language');
            }
        });
    };

    return (
        <select
            defaultValue={locale}
            disabled={isPending}
            onChange={handleSelectChange}
            className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
            aria-label="Select Language"
        >
            {supportedLocales.map((cur) => (
                <option key={cur} value={cur}>
                    {localeLabels[cur]}
                </option>
            ))}
        </select>
    );
}
