import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ContentSummary } from '@/domain/content/Content';
import * as motion from 'framer-motion/client';

export interface FeaturedSectionProps {
    contents: ContentSummary[];
}

/**
 * Featured Content Section (Organism)
 * ホームページの「Featured Work」セクションを表示するコンポーネント
 * 1つのメイン記事（Hero）と、残りのサブ記事（List）を表示する構成
 * 推奨: Main 1 + Sub 2 (Total 3)
 */
export async function FeaturedSection({ contents }: FeaturedSectionProps) {
    const t = await getTranslations('Home');

    if (!contents || contents.length === 0) {
        return null; // Empty state
    }

    const mainContent = contents[0];
    const subContents = contents.slice(1);

    const { lang, category, slug, metadata } = mainContent;
    const categoryKey = `categories.${category}.name` as const;

    // カテゴリ名を取得（キーが存在しない場合はcategory IDをそのまま表示）
    const categoryLabel = t.has(categoryKey) ? t(categoryKey) : category.toUpperCase();

    // 説明文の構築 (OGP Excerpt > Description fallback)
    const description = metadata.ogp_excerpt || t('featured.defaultDescription', { composer: metadata.composer || '' });

    return (
        <section className="w-full bg-gray-100 py-20">
            <div className="container mx-auto px-4">
                <motion.h2
                    className="mb-12 text-center text-3xl font-bold text-preludio-black"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {t('featured.title')}
                </motion.h2>

                {/* Main Hero Card */}
                <motion.div
                    className="mx-auto mb-12 max-w-4xl overflow-hidden rounded-2xl bg-paper-white shadow-xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="p-8 sm:p-12">
                        {metadata.thumbnail && (
                            <div className="mb-6 overflow-hidden rounded-lg shadow-sm">
                                <img
                                    src={metadata.thumbnail}
                                    alt={metadata.title}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                        )}
                        <div className="mb-4 text-sm font-bold text-blue-600">{categoryLabel}</div>
                        <h3 className="mb-4 text-3xl font-bold text-gray-900">{metadata.title}</h3>
                        <p className="mb-6 text-gray-600">{description}</p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={`/${lang}/${category}/${slug}`}
                                className="inline-flex items-center text-blue-600 hover:underline"
                            >
                                {t('featured.readMore')} &rarr;
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Sub Items (if any) */}
                {subContents.length > 0 && (
                    <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
                        {subContents.map((content, idx) => {
                            const subCatKey = `categories.${content.category}.name` as const;
                            const subCatLabel = t.has(subCatKey) ? t(subCatKey) : content.category.toUpperCase();
                            return (
                                <motion.div
                                    key={content.slug}
                                    className="overflow-hidden rounded-xl bg-paper-white p-6 shadow-md transition hover:shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                                >
                                    <div className="mb-2 text-xs font-bold text-gray-500">{subCatLabel}</div>
                                    <h4 className="mb-2 text-lg font-bold text-gray-900">{content.metadata.title}</h4>
                                    <div className="text-sm text-gray-500">
                                        {content.metadata.date}
                                        {content.metadata.composer && ` • ${content.metadata.composer}`}
                                    </div>
                                    <Link
                                        href={`/${content.lang}/${content.category}/${content.slug}`}
                                        className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                        {t('featured.readMore')}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
