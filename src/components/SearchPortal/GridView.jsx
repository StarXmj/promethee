import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function GridView({ results, getHighlightClass }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
      {results.map((annale, idx) => (
        <a key={idx} href={annale.url} target="_blank" rel="noopener noreferrer" className="group relative block p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/40 via-transparent to-[#D4AF37]/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-[#1e293b]/90 backdrop-blur-3xl p-7 rounded-2xl h-full border border-white/5 flex flex-col">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 mb-6">
              {annale.category.map((cat, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-yellow-400/30 font-black text-[10px]">→</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-tight transition-all duration-300 ${getHighlightClass(cat)}`}>
                    {cat}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <h3 className="text-xl font-cinzel text-slate-100 group-hover:text-[#D4AF37] transition-colors leading-tight mb-8 flex-grow">{annale.title}</h3>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="text-[10px] font-mono text-slate-400"><span className="block text-[#D4AF37]/50 font-bold uppercase text-[8px] mb-0.5">Indexé le</span>{annale.scraped_at}</div>
              <div className="bg-[#D4AF37] text-black p-2 rounded-full transition-transform group-hover:scale-110"><ArrowRight size={16} /></div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}