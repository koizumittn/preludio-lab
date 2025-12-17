import type { Metadata } from 'next';
import { Inter, Noto_Serif_JP } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MiniPlayer } from '@/components/ui/Player/MiniPlayer';
import { FocusPlayer } from '@/components/ui/Player/FocusPlayer';
import YouTubePlayer from '@/components/features/player';
import { AppProviders } from '@/components/providers/AppProviders';
import { ConsentBanner } from '@/components/ui/ConsentBanner';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

// Font Configuration
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const notoSerif = Noto_Serif_JP({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-noto-serif',
    display: 'swap',
});

export const metadata: Metadata = {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
};

import { LOCALES } from '@/lib/constants';

// Explicitly define parameters for static generation
export async function generateStaticParams() {
    return LOCALES.map((lang) => ({ lang }));
}


export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    return (
        <html lang={lang} className={`${inter.variable} ${notoSerif.variable}`}>
            <body className="antialiased bg-paper text-primary font-sans">
                <AppProviders>
                    <Header />
                    <main className="min-h-screen pb-24">{children}</main>
                    <Footer />

                    {/* Global Audio Player Components */}
                    <YouTubePlayer />
                    <MiniPlayer />
                    <FocusPlayer />

                    <ConsentBanner />
                </AppProviders>
            </body>
        </html>
    );
}
