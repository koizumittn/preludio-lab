import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { supportedLocales } from '@/domain/shared/locale';

export const { Link, redirect, usePathname, useRouter } =
    createSharedPathnamesNavigation({ locales: supportedLocales });
