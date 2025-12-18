import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './infrastructure/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // パスをセグメントに分割 ('/jaa/foo' -> ['', 'jaa', 'foo'])
    const segments = pathname.split('/');
    const firstSegment = segments[1];

    // ルートパス、または有効なロケールの場合は next-intl に任せる
    if (!firstSegment || routing.locales.includes(firstSegment as any)) {
        return intlMiddleware(req);
    }

    // 無効なロケール（例: /jaa）の場合、デフォルト言語（en）に置き換えてリダイレクト
    // ユーザー要件: "言語パスに許容しない文字列がある場合、その文字列をデフォルト言語（en）に置き換える"

    // パスの残りの部分を構築 (例: /jaa/works -> /en/works)
    const restOfPath = segments.slice(2).join('/');
    const newPath = `/${routing.defaultLocale}${restOfPath ? `/${restOfPath}` : ''}`;

    const url = req.nextUrl.clone();
    url.pathname = newPath;

    return NextResponse.redirect(url);
}

export const config = {
    // API, _next, 静的ファイルを除外してすべてにマッチさせる
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
