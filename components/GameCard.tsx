
import Link from 'next/link';
export function hostFrom(url: string) { try { return new URL(url).host; } catch { return ''; } }
export default function GameCard({ game }: { game: any }) {
  return (
    <div className="card">
      <div className="flex gap-4">
        {game.cover_url ? (
          <img src={game.cover_url} alt={game.title} className="w-32 h-24 object-cover rounded-xl border" />
        ) : (
          <div className="w-32 h-24 rounded-xl bg-gray-100 border flex items-center justify-center text-gray-400">No Cover</div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link href={`/g/${game.slug}`} className="font-semibold hover:underline">{game.title}</Link>
            <span className="text-xs text-gray-500">{hostFrom(game.play_url)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{game.description}</p>
          <div className="mt-2">
            {(game.tags || []).map((t: string) => <span key={t} className="badge">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
