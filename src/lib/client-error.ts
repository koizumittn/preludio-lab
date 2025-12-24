import * as Sentry from '@sentry/nextjs';
import toast from 'react-hot-toast';

/**
 * クライアント用エラーハンドラ。Sentry へ送信し、ユーザーにはトーストで通知。
 */
export function handleClientError(error: unknown, userMessage?: string): void {
    Sentry.captureException(error);
    if (process.env.NODE_ENV === 'development') {
        console.error('[Client Error]', error);
    }
    if (userMessage) toast.error(userMessage);
}
