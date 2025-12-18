import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Inter, Playfair_Display, Noto_Sans_JP, Zen_Old_Mincho } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MiniPlayer } from '@/components/ui/Player/MiniPlayer';
import { FocusPlayer } from '@/components/ui/Player/FocusPlayer';
import { AudioPlayerFeature } from '@/components/features/player';
import { AppProviders } from '@/components/providers/AppProviders';
import { ConsentBanner } from '@/components/ui/ConsentBanner';
import { Toaster } from 'react-hot-toast';
import { supportedLocales } from '@/domain/shared/locale';

// フォント設定
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    variable: '--font-noto-sans-jp',
    display: 'swap',
});

const zenOldMincho = Zen_Old_Mincho({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-zen-old-mincho',
    display: 'swap',
});

type Props = {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { lang } = await params;
    const t = await getTranslations({ locale: lang, namespace: 'Metadata' });

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            languages: {
                'en': '/en',
                'ja': '/ja',
            },
        },
    };
}

// 静的生成（SSG）のためのパラメータを明示的に定義
export async function generateStaticParams() {
    return supportedLocales.map((lang) => ({ lang }));
}

export default async function RootLayout({
    children,
    params,
}: Props) {
    const { lang } = await params;
    const messages = await getMessages();

    // 言語に基づいてフォント変数とベースクラスを決定
    // 情緒的タイポグラフィ: 英語はSerif（エレガント）、日本語は明朝体（ノスタルジック）を採用
    const fontVariables = `${inter.variable} ${playfair.variable} ${notoSansJP.variable} ${zenOldMincho.variable}`;
    const baseFontClass = lang === 'ja'
        ? 'font-sans-ja text-primary bg-paper'
        : 'font-sans-en text-primary bg-paper';

    return (
        <html lang={lang} className={fontVariables} suppressHydrationWarning>
            <body className={`${baseFontClass} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <AppProviders>
                        <Header lang={lang} />
                        <main className="min-h-screen pb-24">{children}</main>
                        <Footer />

                        {/* Global Audio Player Components */}
                        <AudioPlayerFeature />
                        <MiniPlayer />
                        <FocusPlayer />

                        <ConsentBanner />
                        <Toaster position="bottom-right" />
                    </AppProviders>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
