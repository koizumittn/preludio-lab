import Link from 'next/link';
import { ContentSummary } from '@/domain/content/Content';
import * as motion from 'framer-motion/client';

export interface ContentCardProps {
    content: ContentSummary;
    readMoreLabel: string;
    categoryLabel?: string;
    index?: number;
}

/**
 * 汎用的なコンテンツカードコンポーネント（小サイズ）
 * 一覧表示やグリッド内での使用を想定
 */
export function ContentCard({ content, readMoreLabel, categoryLabel, index = 0 }: ContentCardProps) {
    const { lang, category, slug, metadata } = content;

    return (
        <motion.div
            className="overflow-hidden rounded-xl bg-paper-white p-6 shadow-md transition hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
        >
            <div className="mb-2 text-xs font-bold text-gray-500">
                {categoryLabel || category.toUpperCase()}
            </div>
            <h4 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                {metadata.title}
            </h4>
            <div className="text-sm text-gray-500">
                {metadata.date}
                {metadata.composer && ` • ${metadata.composer}`}
            </div>
            <Link
                href={`/${lang}/${category}/${slug}`}
                className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
                {readMoreLabel}
            </Link>
        </motion.div>
    );
}
