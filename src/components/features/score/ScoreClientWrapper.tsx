'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import dynamic from 'next/dynamic';

const ScoreRenderer = dynamic(
    () => import('./ScoreRenderer'),
    {
        ssr: false,
        loading: () => (
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <div className="flex gap-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            </div>
        )
    }
);

interface ScoreClientWrapperProps {
    abc: string;
}

export default function ScoreClientWrapper({ abc }: ScoreClientWrapperProps) {
    return <ScoreRenderer abc={abc} />;
}
