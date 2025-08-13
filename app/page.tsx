
'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import GameCard from '@/components/GameCard';

export default function HomePage() {
  const [games, setGames] = useState<any[]>([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    supabase.from('games').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setGames(data || []);
    });
  }, []);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return games;
    return games.filter(g =>
      (g.title || '').toLowerCase().includes(kw) ||
      (g.description || '').toLowerCase().includes(kw)
    );
  }, [games, q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input className="w-full border rounded-xl px-3 py-2" placeholder="搜索游戏标题或简介…" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(g => <GameCard key={g.id} game={g} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-gray-500">暂无游戏，去「提交游戏」发布一个吧～</div>
      )}
    </div>
  );
}
