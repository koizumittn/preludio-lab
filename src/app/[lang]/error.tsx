'use client';

import { useEffect } from 'react';
import { handleClientError } from '@/lib/client-error';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 標準エラーハンドラを使用してエラーをログ記録
        handleClientError(error, 'ページの読み込み中に予期せぬエラーが発生しました。');
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                予期せぬエラーが発生しました
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                ご不便をおかけして申し訳ありません。エラーの内容はログに記録されました。
            </p>
            <button
                onClick={
                    // セグメントの再レンダリングを試みて回復を図る
                    () => reset()
                }
                className="px-6 py-2 bg-primary/90 hover:bg-primary text-white font-medium rounded-full transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                再試行する
            </button>
        </div>
    );
}
