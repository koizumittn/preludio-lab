import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Inter, Playfair_Display, Noto_Sans_JP, Zen_Old_Mincho, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AudioPlayerFeature } from '@/components/player';
import { AudioPlayerProvider } from '@/components/player/AudioPlayerContext';
// Instead we import our new config
import { LazyMotionConfig } from '@/components/ui/LazyMotionConfig';
import { ConsentBanner } from '@/components/layout/ConsentBanner';
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

const notoSansSC = Noto_Sans_SC({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    variable: '--font-noto-sans-sc',
    display: 'swap',
});

const notoSerifSC = Noto_Serif_SC({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-noto-serif-sc',
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
    const fontVariables = `${inter.variable} ${playfair.variable} ${notoSansJP.variable} ${zenOldMincho.variable} ${notoSansSC.variable} ${notoSerifSC.variable}`;

    // Body Font Selection:
    // - JA: Noto Sans JP
    // - ZH: Noto Sans SC
    // - Others (EN, DE, FR, IT, ES): Inter
    let baseFontClass = 'font-sans-en text-primary bg-paper';
    if (lang === 'ja') {
        baseFontClass = 'font-sans-ja text-primary bg-paper';
    } else if (lang === 'zh') {
        baseFontClass = 'font-sans-zh text-primary bg-paper';
    }

    return (
        <html lang={lang} className={fontVariables} suppressHydrationWarning>
            <body className={`${baseFontClass} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <AudioPlayerProvider>
                        <LazyMotionConfig>
                            <Header lang={lang} />
                            <main className="min-h-screen pb-24">{children}</main>
                            <Footer />

                            {/* Global Audio Player Components */}
                            <AudioPlayerFeature />

                            <ConsentBanner />
                            <Toaster position="bottom-right" />
                        </LazyMotionConfig>
                    </AudioPlayerProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
