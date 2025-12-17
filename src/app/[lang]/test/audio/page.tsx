import React from 'react';
import { TestPlayerTrigger } from '@/components/ui/TestPlayerTrigger';

export default function AudioTestPage() {
    return (
        <div className="min-h-screen pt-24 px-8 pb-32">
            <h1 className="text-3xl font-serif font-bold mb-8">Audio Player Test</h1>

            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Playback Trigger</h2>
                <p className="text-gray-600 mb-6">
                    Test the audio player with different source types (YouTube, Archive Mock).
                </p>
                <TestPlayerTrigger />
            </div>

            <div className="mt-12 max-w-2xl mx-auto space-y-4">
                <h3 className="text-lg font-bold">Verification Items</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>**YouTube Source:** Should show &quot;Watch on YouTube&quot; with red icon.</li>
                    <li>**Archive Source:** Should show &quot;View in Archives&quot; with default external link icon.</li>
                    <li>**Persistence:** Navigation should not stop playback (try back/forward).</li>
                    <li>**Virtual Timeline:** Start time should display as 0:00.</li>
                </ul>
            </div>
        </div>
    );
}
