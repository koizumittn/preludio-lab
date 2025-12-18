import createMiddleware from 'next-intl/middleware';
import { routing } from './infrastructure/i18n/routing';

export default createMiddleware(routing);

export const config = {
    // 国際化されたパス名のみにマッチさせる
    matcher: ['/', '/(ja|en)/:path*']
};
