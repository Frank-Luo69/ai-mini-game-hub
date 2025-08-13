
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function hostFrom(url: string) { try { return new URL(url).host; } catch { return ''; } }

export default function GameDetail({ params }: { params: { slug: string }}) {
  const [game, setGame] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    supabase.from('games').select('*').eq('slug', params.slug).single().then(({ data }) => setGame(data));
    supabase.from('comments').select('*').order('created_at', { ascending: false }).then(({ data }) => setComments((data || []).filter(c => c.game_id)));
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, [params.slug]);

  useEffect(() => {
    if (!game) return;
    const channel = supabase.channel('comments-changes').on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'comments', filter: `game_id=eq.${game.id}` },
      payload => setComments(prev => [payload.new, ...prev])
    ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [game]);

  async function postComment() {
    if (!userEmail) return alert('请先登录');
    if (!content.trim()) return;
    const { error } = await supabase.from('comments').insert({ game_id: game!.id, content: content.trim() });
    if (error) alert(error.message);
    else setContent('');
  }

  if (!game) return <div>加载中…</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="card">
          {game.cover_url && <img src={game.cover_url} alt={game.title} className="w-full h-64 object-cover rounded-xl border" />}
          <h1 className="text-2xl font-semibold mt-4">{game.title}</h1>
          <p className="text-gray-600 mt-2 whitespace-pre-wrap">{game.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(game.tags || []).map((t: string) => <span key={t} className="badge">{t}</span>)}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">来源域名：{hostFrom(game.play_url)}</div>
            <a href={game.play_url} target="_blank" rel="noopener noreferrer" className="btn-primary px-4 py-2 rounded-xl">去玩</a>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">讨论区</h2>
          <div className="flex gap-2 mb-3">
            <input className="flex-1 border rounded-xl px-3 py-2" placeholder={userEmail ? '写点什么…' : '登录后才能发言'} value={content} onChange={e => setContent(e.target.value)} disabled={!userEmail} />
            <button className="btn" onClick={postComment} disabled={!userEmail || !content.trim()}>发送</button>
          </div>
          <div className="space-y-3">
            {comments.filter(c => c.game_id === game.id && !c.is_deleted).map(c => (
              <div key={c.id} className="border rounded-xl p-3">
                <div className="text-sm text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
                <div className="mt-1 whitespace-pre-wrap">{c.content}</div>
              </div>
            ))}
            {comments.filter(c => c.game_id === game.id).length === 0 && (
              <div className="text-sm text-gray-500">还没有评论，来占个沙发～</div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card">
          <h3 className="font-semibold">安全提示</h3>
          <p className="text-sm text-gray-600 mt-1">本平台仅收录外链，点击「去玩」将打开第三方站点。请注意甄别内容与版权。</p>
        </div>
      </div>
    </div>
  );
}
