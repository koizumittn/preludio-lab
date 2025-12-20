import { getTranslations } from 'next-intl/server';

export default async function WorksPage() {
    const t = await getTranslations('Common');

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-serif font-bold mb-8">Works</h1>
            <p className="text-gray-600">
                {/* Temporary placeholder content */}
                List of works will appear here.
            </p>
        </div>
    );
}
