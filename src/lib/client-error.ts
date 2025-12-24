import * as Sentry from '@sentry/nextjs';
import toast from 'react-hot-toast';

/**
 * クライアント用エラーハンドラ。
 * エラー自体はSentry等のログ収集基盤に送信されます（英語推奨）。
 * 第2引数はユーザーへのトースト通知用であり、必要に応じてi18n化されたメッセージを渡します。
 * 
 * @param error 発生したエラーオブジェクト
 * @param userNotificationMessage ユーザーに表示するトーストメッセージ (通知が不要な場合は省略可)
 */
export function handleClientError(error: unknown, userNotificationMessage?: string): void {
    Sentry.captureException(error);
    if (process.env.NODE_ENV === 'development') {
        console.error('[Client Error]', error);
    }
    if (userNotificationMessage) toast.error(userNotificationMessage);
}
