import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ListView({ results, getHighlightClass }) {
  const getListColor = (cat) => {
      const cls = getHighlightClass(cat);
      if (cls.includes('emerald')) return "text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]";
      if (cls.includes('rose')) return "text-rose-400 font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]";
      if (cls.includes('cyan')) return "text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]";
      return "text-slate-500 opacity-40";
  };

  return (
    <div className="flex flex-col gap-3 max-w-5xl mx-auto text-left">
      {results.map((annale, idx) => (
        <a key={idx} href={annale.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-4 bg-[#1e293b]/50 hover:bg-[#1e293b]/90 border border-white/5 hover:border-[#D4AF37]/30 rounded-xl transition-all shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 overflow-hidden flex-grow">
            <span className="text-[10px] font-mono text-slate-500 min-w-[85px] uppercase">{annale.scraped_at.split(' ')[0]}</span>
            <div className="flex flex-col">
              <h3 className="text-sm md:text-base font-cinzel text-slate-100 group-hover:text-[#D4AF37] transition-colors truncate">{annale.title}</h3>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {annale.category.map((cat, i) => (
                  <span key={i} className={`text-[10px] uppercase font-bold tracking-tight transition-colors ${getListColor(cat)}`}>
                    {cat} {i < annale.category.length - 1 && "•"}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <ArrowRight size={18} className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </a>
      ))}
    </div>
  );
}