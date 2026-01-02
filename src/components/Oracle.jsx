import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import annalesData from '../data/annales.json';

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'category', weight: 0.3 }
  ],
  threshold: 0.4,
  distance: 1000,
  ignoreLocation: true,
  useExtendedSearch: true
};

export default function Oracle() {
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Tous');

  const processedData = useMemo(() => {
    return annalesData.map(item => ({
      ...item,
      timestamp: new Date(item.scraped_at.split(' ').reverse().join(' ')).getTime()
    })).sort((a, b) => b.timestamp - a.timestamp);
  }, []);

  const totalFiles = processedData.length;
  const fuse = useMemo(() => new Fuse(processedData, fuseOptions), [processedData]);

  const levels = useMemo(() => {
    const all = processedData.flatMap(a => 
      a.category.filter(c => c.match(/L\d|M\d|PAC|PASS|BUT/i))
    );
    return ['Tous', ...new Set(all)].sort();
  }, [processedData]);

  const { filteredResults, displayResults } = useMemo(() => {
    let list = query ? fuse.search(query).map(r => r.item) : processedData;
    if (selectedLevel !== 'Tous') {
      list = list.filter(a => a.category.includes(selectedLevel));
    }
    return {
      filteredResults: list,
      displayResults: list.slice(0, 100)
    };
  }, [query, selectedLevel, fuse, processedData]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 font-inter">
      
      {/* --- HEADER --- */}
      <header className="text-center mb-12">
        <h1 className="text-7xl md:text-9xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] mb-4 drop-shadow-2xl uppercase tracking-tighter">
          PROMÉTHÉE
        </h1>
        <p className="text-[#D4AF37]/60 font-cinzel tracking-[0.3em] uppercase text-sm">
          L'Oracle du Savoir Universitaire
        </p>
      </header>

      {/* --- RECHERCHE ET FILTRES --- */}
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-8">
        <div className="relative flex-grow group">
          <div className="absolute -inset-1 bg-[#D4AF37] rounded-xl blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
          <input
            type="text"
            placeholder="Rechercher une matière, une année..."
            className="relative w-full px-6 py-4 bg-[#0f172a]/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl text-white text-lg focus:outline-none focus:border-[#D4AF37] transition-all font-cinzel tracking-wider"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="relative min-w-[180px]">
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full h-full px-4 py-4 bg-[#0f172a] border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] font-cinzel font-bold uppercase tracking-widest appearance-none focus:outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            {levels.map(lvl => (
              <option key={lvl} value={lvl} className="bg-[#0f172a] text-white">{lvl === 'Tous' ? '🏛️ TOUS' : lvl}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37] text-xs">▼</div>
        </div>
      </div>

      {/* --- COMPTEUR --- */}
      <div className="flex items-center justify-center gap-4 mb-12 opacity-80">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
        <div className="px-4 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 font-cinzel text-[10px] tracking-[0.2em] text-[#D4AF37]">
            {filteredResults.length > 0 ? (
                <span>{filteredResults.length} STÈLES TROUVÉES</span>
            ) : (
                <span className="text-red-400/60 font-bold">0 RÉSULTAT (SUR {totalFiles})</span>
            )}
        </div>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
      </div>

      {/* --- GRILLE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayResults.map((annale, idx) => (
          <a 
            href={annale.url} 
            target="_blank" 
            rel="noopener noreferrer"
            key={idx} 
            className="group relative block p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.03] shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/40 via-transparent to-[#D4AF37]/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative bg-[#1e293b]/90 backdrop-blur-3xl p-7 rounded-2xl h-full border border-white/5 flex flex-col">
              
              {/* FIL D'ARIANE AVEC FLÈCHES JAUNE FLUO */}
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 mb-4">
                {annale.category.map((cat, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)] font-black text-[12px] select-none">
                        →
                      </span>
                    )}
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-bold uppercase tracking-widest whitespace-nowrap">
                      {cat}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              <h3 className="text-xl font-cinzel text-slate-100 group-hover:text-[#D4AF37] transition-colors leading-tight mb-8 flex-grow">
                {annale.title}
              </h3>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 opacity-60 group-hover:opacity-100">
                <div className="text-[10px] font-mono text-slate-400">
                  <span className="block text-[#D4AF37]/50 font-bold uppercase text-[8px]">Indexé le</span>
                  {annale.scraped_at}
                </div>
                <div className="bg-[#D4AF37] text-black p-2 rounded-full transform scale-0 group-hover:scale-100 transition-all">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      {/* ... ÉTAT VIDE (inchangé) ... */}
    </div>
  );
}