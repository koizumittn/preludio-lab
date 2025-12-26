import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * 標準の Supabase クライアント (Singleton)
 * 
 * 役割: ブラウザおよびサーバーでの一般的なデータ操作用。
 * セキュリティ: Anon Key を使用し、常に RLS (Row Level Security) の制約を受けます。
 */
export const supabase: SupabaseClient = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * 管理者権限を持つ Supabase クライアントの生成 (Factory)
 * 
 * 役割: サーバーサイドでのバッチ処理、データ同期、システム管理用。
 * セキュリティ: Service Role Key を使用し、RLS をバイパスします。
 * 注意: このクライアントは必ずサーバーサイド環境 (Node.js runtime) でのみ使用してください。
 */
export const getSupabaseAdmin = (): SupabaseClient => {
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations. Check your .env.local or server environment variables.');
    }
    return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
