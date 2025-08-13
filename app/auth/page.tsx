
'use client';
import { supabase } from '@/lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">登录 / 注册</h1>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} view="magic_link" />
    </div>
  );
}
