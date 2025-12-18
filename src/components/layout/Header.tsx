import { Link } from '@/infrastructure/i18n/navigation';
import { useTranslations } from 'next-intl';
import { SITE_NAME } from '@/lib/constants';
import { SearchBox } from '@/components/features/search/SearchBox';
import { LanguageSwitcher } from '@/components/features/i18n/LanguageSwitcher';

interface HeaderProps {
    lang?: string;
}

export const Header = ({ lang }: HeaderProps) => {
    const t = useTranslations('Navigation');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-gray-900">{SITE_NAME}</span>
                </Link>
                <div className="flex-1 px-4 md:px-8 max-w-xl">
                    <SearchBox />
                </div>
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/works" className="text-sm font-medium text-gray-700 hover:text-black">
                        {t('works')}
                    </Link>
                    <Link href="/composers" className="text-sm font-medium text-gray-700 hover:text-black">
                        {t('composers')}
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-black">
                        {t('about')}
                    </Link>
                    <div className="border-l pl-6 border-gray-200">
                        <LanguageSwitcher />
                    </div>
                </nav>
            </div>
        </header>
    );
};
