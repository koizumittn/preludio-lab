import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { Database } from './database.types';
import { PinoLogger } from '@/infrastructure/logging/pino-logger';

// シングルトン用の変数 (Admin Client)
let adminClient: SupabaseClient<Database> | null = null;

// ロガーの初期化 (Server-side 向け)
const logger = typeof window === 'undefined' ? new PinoLogger() : null;

/**
 * 標準の Supabase クライアント (Singleton)
 * 
 * 役割: ブラウザおよびサーバーでの一般的なデータ操作用。
 * セキュリティ: Anon Key を使用し、常に RLS (Row Level Security) の制約を受けます。
 */
export const supabase = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * 管理者権限を持つ Supabase クライアントの取得 (Singleton / Lazy Initialization)
 * 
 * 役割: サーバーサイドでのバッチ処理、データ同期、システム管理用。
 * セキュリティ: Service Role Key を使用し、RLS をバイパスします。
 * 注意: このクライアントは必ずサーバーサイド環境 (Node.js/Edge runtime) でのみ使用してください。
 * 
 * @throws {Error} サーバーサイド環境以外で呼び出された場合、または環境変数が不足している場合。
 */
export const getSupabaseAdmin = (): SupabaseClient<Database> => {
    // 1. ランタイムチェック: ブラウザ側での実行を即座にブロック
    if (typeof window !== 'undefined') {
        const error = new Error('Critical Security Error: getSupabaseAdmin must only be called on the server.');
        // クライアントサイドでのロギングは console.error 等を使用するのがガイドライン
        console.error(error.message);
        throw error;
    }

    // 2. シングルトンの返却
    if (adminClient) return adminClient;

    try {
        const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

        // 3. 環境変数チェック
        if (!serviceRoleKey) {
            throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations. Check your .env.local or server environment variables.');
        }

        // 4. クライアント生成
        logger?.info('Initializing Supabase Admin Client (Singleton)');

        adminClient = createClient<Database>(
            env.NEXT_PUBLIC_SUPABASE_URL,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        return adminClient;
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger?.error('Failed to initialize Supabase Admin Client', error, {
            context: 'Infrastructure:Supabase:getSupabaseAdmin'
        });
        throw error;
    }
};
