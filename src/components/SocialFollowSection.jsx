import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function SocialFollowSection() {
  const socials = [
    {
      id: 'facebook',
      name: 'Facebook',
      handle: '@coffee2424.official',
      url: 'https://facebook.com'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@coffee2424',
      url: 'https://instagram.com'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@coffee2424.vn',
      url: 'https://tiktok.com'
    },
    {
      id: 'zalo',
      name: 'Zalo OA',
      handle: 'COFFEE 24/24',
      url: 'https://zalo.me'
    }
  ];

  return (
    <section className="bg-white/30 backdrop-blur-2xl border-t border-white/60 py-10 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Minimalist Brand Statement */}
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#8c5932] font-black block">
              FOLLOW OUR JOURNEY · #ENJOYYOURLIFE
            </span>
            <div className="text-base sm:text-lg font-black text-[#2b170e]">
              Kết nối cùng cộng đồng COFFEE 24/24
            </div>
          </div>

          {/* Clean iOS Frosted Social Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 sm:px-5 py-2.5 rounded-full bg-white/50 hover:bg-white text-[#2b170e] hover:text-[#180d08] border border-white/80 text-sm font-bold shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2 active:scale-95"
              >
                <span>{s.name}</span>
                <span className="text-xs text-[#7a5843] font-normal">({s.handle})</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8c5932]" />
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
