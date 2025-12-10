import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { LOCALES } from '@/lib/constants';
const locales = LOCALES;
const defaultLocale = 'ja';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // Assets and API calls should be ignored
        if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
            return;
        }

        const locale = defaultLocale;
        return NextResponse.redirect(
            new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next|favicon.ico).*)',
    ],
};
