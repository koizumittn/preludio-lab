import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { SearchBox } from '@/components/features/search/SearchBox';

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-gray-900">{SITE_NAME}</span>
                </Link>
                <div className="flex-1 px-4 md:px-8 max-w-xl">
                    <SearchBox />
                </div>
                <nav className="hidden md:flex gap-6">
                    <Link href="/ja/works" className="text-sm font-medium text-gray-700 hover:text-black">
                        Works
                    </Link>
                    <Link href="/ja/composers" className="text-sm font-medium text-gray-700 hover:text-black">
                        Composers
                    </Link>
                    <Link href="/ja/about" className="text-sm font-medium text-gray-700 hover:text-black">
                        About
                    </Link>
                </nav>
            </div>
        </header>
    );
};
