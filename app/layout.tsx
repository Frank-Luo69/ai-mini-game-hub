
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'AI Mini-Game Hub',
  description: '收纳与讨论 AI 驱动的简小游戏',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
