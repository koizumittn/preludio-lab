import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MiniPlayer } from '@/components/ui/Player/MiniPlayer';
import { ConsentBanner } from '@/components/ui/ConsentBanner';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    return (
        <html lang={lang} suppressHydrationWarning>
            <body className={inter.className}>
                <Header />
                <main className="min-h-screen bg-gray-50 pb-24">{children}</main>
                <Footer />
                <MiniPlayer />
                <ConsentBanner />
            </body>
        </html>
    );
}
