import { Link } from '@/infrastructure/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { SITE_NAME } from '@/lib/constants';
import { SearchBox } from '@/components/features/search/SearchBox';
import { LanguageSwitcher } from '@/components/features/i18n/LanguageSwitcher';

interface HeaderProps {
    lang?: string;
}

export const Header = async ({ lang }: HeaderProps) => {
    const t = await getTranslations('Navigation');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4">
                <Link href="/" className="flex items-center gap-2 justify-self-start">
                    <span className="text-xl font-bold tracking-tight text-gray-900">{SITE_NAME}</span>
                </Link>

                <div className="hidden md:block w-full max-w-xl justify-self-center px-4">
                    <SearchBox />
                </div>
                {/* Mobile Search - Visible only on small screens, adjust if needed. 
                    Currently the original code showed SearchBox in a flex-1 div on all screens.
                    We need to preserve mobile behavior: Logo -- Search -- (Nav Hidden).
                    Actually, original was: flex container, Logo, Search(flex-1), Nav(hidden md:flex).
                    So on mobile: Logo, Search(takes all space).
                    Let's adapt Grid for MD+, and Flex for Base.
                */}
                <div className="flex-1 px-4 md:hidden">
                    <SearchBox />
                </div>

                <nav className="hidden md:flex gap-6 items-center justify-self-end">
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
