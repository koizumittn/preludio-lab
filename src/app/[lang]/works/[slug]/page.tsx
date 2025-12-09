import Link from 'next/link';
import { ScorePlaceholder } from '@/components/ui/ScorePlaceholder';
import { AudioPlayerPlaceholder } from '@/components/ui/AudioPlayerPlaceholder';

export default async function ArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await params;
    // Mock Data
    const article = {
        title: 'Prelude in C Major, BWV 846',
        composer: 'Johann Sebastian Bach',
        key: 'C Major',
        difficulty: 'Beginner - Intermediate',
        sections: [
            {
                title: 'Introduction',
                content: 'This prelude is the first piece from "The Well-Tempered Clavier", Book I. It is famous for its rolling arpeggios that create a rich harmonic texture without a distinct melodic line.',
            },
            {
                title: 'Structural Analysis',
                content: 'The piece consists entirely of broken chords (arpeggios). The harmonic progression is the core of this work. Observe the bass line movement.',
            },
        ],
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            {/* Breadcrumb */}
            <div className="mb-8 text-sm text-gray-500">
                <Link href={`/${lang}`} className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <Link href={`/${lang}/works`} className="hover:underline">Works</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{article.title}</span>
            </div>

            {/* Header */}
            <div className="mb-12">
                <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800">
                    Work Analysis
                </div>
                <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">{article.title}</h1>
                <div className="flex flex-wrap gap-4 text-lg text-gray-600">
                    <div><span className="font-semibold text-gray-900">Composer:</span> {article.composer}</div>
                    <div><span className="font-semibold text-gray-900">Key:</span> {article.key}</div>
                </div>
            </div>

            {/* Main Content & Player Layout */}
            <div className="grid gap-12 lg:grid-cols-3">
                {/* Left Column: Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Introduction */}
                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">{article.sections[0].title}</h2>
                        <p className="leading-relaxed text-gray-700">{article.sections[0].content}</p>
                    </section>

                    {/* Analysis with Score */}
                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">{article.sections[1].title}</h2>
                        <p className="mb-6 leading-relaxed text-gray-700">{article.sections[1].content}</p>
                        <div className="my-6">
                            <ScorePlaceholder />
                            <p className="mt-2 text-center text-sm text-gray-500 italic">Figure 1: Opening measures showing the arpeggio pattern</p>
                        </div>
                    </section>

                </div>

                {/* Right Column: Sticky Player & TOC */}
                <div className="space-y-8">
                    <div className="sticky top-24">
                        <AudioPlayerPlaceholder />
                        <div className="mt-4 rounded-xl bg-gray-50 p-6 border border-gray-100">
                            <h3 className="mb-4 font-bold text-gray-900">Listening Guide</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <button className="flex items-center gap-2 text-blue-600 hover:underline">
                                        <span className="font-mono text-gray-500">[00:00]</span>
                                        Opening Arpeggios
                                    </button>
                                </li>
                                <li>
                                    <button className="flex items-center gap-2 text-blue-600 hover:underline">
                                        <span className="font-mono text-gray-500">[01:15]</span>
                                        Climax (crescendo)
                                    </button>
                                </li>
                                <li>
                                    <button className="flex items-center gap-2 text-blue-600 hover:underline">
                                        <span className="font-mono text-gray-500">[01:45]</span>
                                        Final C Major Chord
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
