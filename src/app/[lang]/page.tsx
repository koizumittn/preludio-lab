import Link from 'next/link';
import { SITE_DESCRIPTION } from '@/lib/constants';

// Categories for the MVP
const CATEGORIES = [
    { id: 'analysis', name: 'Work Analysis', desc: 'Deep dive into masterpieces', color: 'bg-blue-50 text-blue-700' },
    { id: 'composers', name: 'Composers', desc: 'Lives and works', color: 'bg-amber-50 text-amber-700' },
    { id: 'theory', name: 'Music Theory', desc: 'Understanding the mechanics', color: 'bg-purple-50 text-purple-700' },
    { id: 'originals', name: 'Originals', desc: 'New compositions', color: 'bg-emerald-50 text-emerald-700' },
];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <div className="flex flex-col items-center justify-center">
            {/* Hero Section */}
            <section className="w-full bg-paper-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-preludio-black sm:text-6xl">
                        Beyond Listening.
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
                        {SITE_DESCRIPTION}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href={`/${lang}/works`}
                            className="rounded-full bg-preludio-black px-8 py-3 text-sm font-semibold text-paper-white shadow-lg transition hover:bg-gray-800"
                        >
                            Explore Works
                        </Link>
                        <Link
                            href={`/${lang}/about`}
                            className="rounded-full bg-paper-white px-8 py-3 text-sm font-semibold text-preludio-black shadow-sm ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50"
                        >
                            About Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="container mx-auto py-20 px-4">
                <h2 className="mb-12 text-center text-3xl font-bold text-preludio-black">Discover</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.id} href={`/${lang}/${cat.id}`} className={`group relative block overflow-hidden rounded-2xl p-8 transition hover:shadow-md ${cat.color}`}>
                            <h3 className="mb-2 text-xl font-bold">{cat.name}</h3>
                            <p className="text-sm opacity-80">{cat.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Article (Dummy) */}
            <section className="w-full bg-gray-100 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold text-preludio-black">Featured Work</h2>
                    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-paper-white shadow-xl">
                        <div className="p-8 sm:p-12">
                            <div className="mb-4 text-sm font-bold text-blue-600">Work Analysis</div>
                            <h3 className="mb-4 text-3xl font-bold text-gray-900">Prelude in C Major, BWV 846</h3>
                            <p className="mb-6 text-gray-600">An in-depth analysis of Bach&apos;s masterpiece from The Well-Tempered Clavier. Understand functionality of harmony and the beauty of arpeggios.</p>
                            <Link href={`/${lang}/works/prelude-c-major`} className="inline-flex items-center text-blue-600 hover:underline">
                                Read Analysis &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
