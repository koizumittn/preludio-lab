import Link from 'next/link';
import { LOCALES } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';

// Explicitly define parameters for static generation
export async function generateStaticParams() {
    return LOCALES.map((lang) => ({ lang }));
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    // Note: In client components we use `useParams` or simple props, but in server components
    // we can use `useTranslations` directly.
    const t = await getTranslations('Home');
    const lang = (await params).lang;

    // Categories data with translations
    // MVP: Priority display of Works, Composers, Theory, Eras
    const categories = [
        { id: 'works', color: 'bg-blue-50 text-blue-700' },
        { id: 'composers', color: 'bg-amber-50 text-amber-700' },
        { id: 'theory', color: 'bg-purple-50 text-purple-700' },
        { id: 'eras', color: 'bg-rose-50 text-rose-700' },
    ];

    // Featured Work Data (Mock)
    const featuredWork = {
        label: t('categories.works.name'), // Use category name from dictionary
        title: 'Prelude in C Major, BWV 846',
        description: lang === 'ja'
            ? 'J.S.バッハ『平均律クラヴィーア曲集』第1巻より。機能和声の基礎と、アルペジオ（分散和音）の美しさを紐解く。'
            : 'An in-depth analysis of Bach\'s masterpiece from The Well-Tempered Clavier. Understand functionality of harmony and the beauty of arpeggios.',
        link: `/${lang}/works/prelude-c-major`
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Hero Section */}
            <section className="w-full bg-paper-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-preludio-black sm:text-6xl">
                        {t('hero.title')}
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
                        {t('hero.description')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href={`/${lang}/works`}
                            className="rounded-full bg-preludio-black px-8 py-3 text-sm font-semibold text-paper-white shadow-lg transition hover:bg-gray-800"
                        >
                            {t('hero.explore')}
                        </Link>
                        <Link
                            href={`/${lang}/about`}
                            className="rounded-full bg-paper-white px-8 py-3 text-sm font-semibold text-preludio-black shadow-sm ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50"
                        >
                            {t('hero.about')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="container mx-auto py-20 px-4">
                <h2 className="mb-12 text-center text-3xl font-bold text-preludio-black">{t('discover')}</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/${lang}/${cat.id}`} className={`group relative block overflow-hidden rounded-2xl p-8 transition hover:shadow-md ${cat.color}`}>
                            <h3 className="mb-2 text-xl font-bold">{t(`categories.${cat.id}.name`)}</h3>
                            <p className="text-sm opacity-80">{t(`categories.${cat.id}.desc`)}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Article (Dummy) */}
            <section className="w-full bg-gray-100 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold text-preludio-black">{t('featured.title')}</h2>
                    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-paper-white shadow-xl">
                        <div className="p-8 sm:p-12">
                            <div className="mb-4 text-sm font-bold text-blue-600">{featuredWork.label}</div>
                            <h3 className="mb-4 text-3xl font-bold text-gray-900">{featuredWork.title}</h3>
                            <p className="mb-6 text-gray-600">{featuredWork.description}</p>
                            <div className="flex flex-wrap gap-4">
                                <Link href={featuredWork.link} className="inline-flex items-center text-blue-600 hover:underline">
                                    {t('featured.readMore')} &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
