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
      // On affiche un peu moins de résultats sur mobile pour le scroll
      displayResults: list.slice(0, 80) 
    };
  }, [query, selectedLevel, fuse, processedData]);

  return (
    // MOBILE : Réduction du padding global (px-4 py-8 au lieu de px-6 py-12)
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12 relative z-10 font-inter">
      
      {/* --- HEADER --- */}
      {/* MOBILE : Réduction de la marge inférieure (mb-8 au lieu de mb-12) */}
      <header className="text-center mb-8 md:mb-12">
        {/* MOBILE : Taille de police drastiquement réduite (text-5xl au lieu de 7xl) */}
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] mb-3 md:mb-4 drop-shadow-2xl uppercase tracking-tighter">
          PROMÉTHÉE
        </h1>
        {/* MOBILE : Sous-titre un peu plus petit */}
        <p className="text-[#D4AF37]/60 font-cinzel tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm">
          L'Oracle du Savoir Universitaire
        </p>
      </header>

      {/* --- RECHERCHE ET FILTRES --- */}
      {/* MOBILE : Gap réduit entre les éléments (gap-3 au lieu de 4) */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 max-w-4xl mx-auto mb-8">
        <div className="relative flex-grow group">
          <div className="absolute -inset-1 bg-[#D4AF37] rounded-xl blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
          {/* MOBILE : Input plus compact (px-4 py-3 et text-base) */}
          <input
            type="text"
            placeholder="Rechercher..."
            className="relative w-full px-4 py-3 md:px-6 md:py-4 bg-[#0f172a]/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl text-white text-base md:text-lg focus:outline-none focus:border-[#D4AF37] transition-all font-cinzel tracking-wider"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="relative min-w-[180px]">
          {/* MOBILE : Select plus compact (px-4 py-3) pour s'aligner avec l'input */}
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full h-full px-4 py-3 md:px-4 md:py-4 bg-[#0f172a] border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] font-cinzel font-bold uppercase tracking-widest appearance-none focus:outline-none focus:border-[#D4AF37] cursor-pointer text-sm md:text-base"
          >
            {levels.map(lvl => (
              <option key={lvl} value={lvl} className="bg-[#0f172a] text-white">{lvl === 'Tous' ? '🏛️ TOUS' : lvl}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37] text-xs">▼</div>
        </div>
      </div>

      {/* --- COMPTEUR --- */}
      {/* MOBILE : Marge réduite et lignes moins larges (gap-2) */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12 opacity-80">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
        {/* MOBILE : Texte un peu plus petit sur mobile */}
        <div className="px-3 py-1 md:px-4 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 font-cinzel text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] text-[#D4AF37] whitespace-nowrap">
            {filteredResults.length > 0 ? (
                <span>{filteredResults.length} STÈLES</span>
            ) : (
                <span className="text-red-400/60 font-bold">0 RÉSULTAT</span>
            )}
        </div>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
      </div>

      {/* --- GRILLE --- */}
      {/* MOBILE : Gap réduit entre les cartes (gap-4 au lieu de 8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {displayResults.map((annale, idx) => (
          <a 
            href={annale.url} 
            target="_blank" 
            rel="noopener noreferrer"
            key={idx} 
            className="group relative block p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] md:hover:scale-[1.03] shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/40 via-transparent to-[#D4AF37]/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* MOBILE : Padding interne de la carte réduit (p-5 au lieu de p-7) */}
            <div className="relative bg-[#1e293b]/90 backdrop-blur-3xl p-5 md:p-7 rounded-2xl h-full border border-white/5 flex flex-col">
              
              {/* FIL D'ARIANE */}
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 mb-4">
                {annale.category.map((cat, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)] font-black text-[10px] md:text-[12px] select-none">
                        →
                      </span>
                    )}
                    {/* MOBILE : Badges légèrement plus petits */}
                    <span className="text-[8px] md:text-[9px] px-1.5 py-0.5 md:px-2 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-bold uppercase tracking-wider whitespace-nowrap">
                      {cat}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              {/* MOBILE : Titre plus petit (text-lg au lieu de xl) et marge réduite */}
              <h3 className="text-lg md:text-xl font-cinzel text-slate-100 group-hover:text-[#D4AF37] transition-colors leading-tight mb-6 md:mb-8 flex-grow">
                {annale.title}
              </h3>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 opacity-80 md:opacity-60 group-hover:opacity-100">
                <div className="text-[9px] md:text-[10px] font-mono text-slate-400">
                  <span className="block text-[#D4AF37]/50 font-bold uppercase text-[8px]">Indexé le</span>
                  {annale.scraped_at}
                </div>
                {/* MOBILE : Le bouton est toujours visible, pas besoin de hover */}
                <div className="bg-[#D4AF37] text-black p-1.5 md:p-2 rounded-full transform md:scale-0 group-hover:scale-100 transition-all">
                   <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      {/* --- ÉTAT VIDE MOBILE --- */}
      {filteredResults.length === 0 && (
        <div className="text-center py-20 md:py-40">
          <div className="text-5xl md:text-6xl mb-4 grayscale opacity-20">📜</div>
          <p className="font-cinzel text-[#D4AF37]/40 text-lg md:text-2xl tracking-widest uppercase">
            Silence de l'Oracle...
          </p>
          <button 
            onClick={() => {setQuery(''); setSelectedLevel('Tous');}}
            className="mt-6 text-[#D4AF37] text-xs font-bold border-b border-[#D4AF37]/30 pb-1 hover:border-[#D4AF37] transition-all"
          >
            RÉINITIALISER
          </button>
        </div>
      )}
    </div>
  );
}