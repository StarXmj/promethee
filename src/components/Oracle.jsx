import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { 
  ArrowRight, 
  ChevronsLeft, 
  ChevronsRight, 
  LayoutGrid, 
  List,
  X 
} from 'lucide-react'; 
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
  const [selectedMatiere, setSelectedMatiere] = useState('Toutes');
  const [selectedYear, setSelectedYear] = useState('Toutes');
  const [selectedSemestre, setSelectedSemestre] = useState('Tous');
  const [sortOrder, setSortOrder] = useState('recent');
  
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const RESULTS_PER_PAGE = 50;

  const processedData = useMemo(() => {
    return annalesData.map(item => ({
      ...item,
      timestamp: new Date(item.scraped_at.split(' ').reverse().join(' ')).getTime()
    }));
  }, []);

  const fuse = useMemo(() => new Fuse(processedData, fuseOptions), [processedData]);

  const matieres = useMemo(() => {
    const all = processedData.map(a => a.matière).filter(Boolean);
    return ['Toutes', ...new Set(all)].sort();
  }, [processedData]);

  const availableYears = useMemo(() => {
    const years = processedData.map(a => a.année).filter(Boolean);
    return ['Toutes', ...new Set(years)].sort((a, b) => b - a);
  }, [processedData]);

  const filteredAndSortedResults = useMemo(() => {
    let list = query ? fuse.search(query).map(r => r.item) : processedData;
    
    if (selectedMatiere !== 'Toutes') list = list.filter(a => a.matière === selectedMatiere);
    if (selectedYear !== 'Toutes') list = list.filter(a => a.année === parseInt(selectedYear));
    if (selectedSemestre !== 'Tous') list = list.filter(a => a.semestre === parseInt(selectedSemestre));

    return [...list].sort((a, b) => {
      if (sortOrder === 'year_desc') return (b.année || 0) - (a.année || 0);
      if (sortOrder === 'year_asc') return (a.année || 0) - (b.année || 0);
      return b.timestamp - a.timestamp;
    });
  }, [query, selectedMatiere, selectedYear, selectedSemestre, sortOrder, fuse, processedData]);

  useEffect(() => { setCurrentPage(1); }, [query, selectedMatiere, selectedYear, selectedSemestre]);

  const displayResults = useMemo(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    return filteredAndSortedResults.slice(startIndex, startIndex + RESULTS_PER_PAGE);
  }, [filteredAndSortedResults, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedResults.length / RESULTS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getHighlightClass = (cat) => {
    const catUpper = cat.toUpperCase();
    if (selectedYear !== 'Toutes' && catUpper.includes(selectedYear.toString())) {
        return "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]";
    }
    if (selectedSemestre !== 'Tous') {
        const s1 = ["SEMESTRE 1", "S1", "SEMESTRE1", "1ER SEMESTRE"];
        const s2 = ["SEMESTRE 2", "S2", "SEMESTRE2", "2EME SEMESTRE", "2ÈME SEMESTRE"];
        const isS1 = selectedSemestre === "1" && s1.some(p => catUpper.includes(p));
        const isS2 = selectedSemestre === "2" && s2.some(p => catUpper.includes(p));
        if (isS1 || isS2) return "bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
    }
    if (selectedMatiere !== 'Toutes') {
      const keywords = selectedMatiere.toUpperCase().split(/[\s,']+/).filter(word => word.length > 1);
      const isMatiere = keywords.some(key => {
        if (key.match(/^[LM]\d$/) || key.match(/PASS|PAC|BUT/)) return catUpper === key || catUpper.startsWith(key + " ");
        return catUpper.includes(key);
      });
      if (isMatiere) return "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    }
    return "bg-[#D4AF37]/5 border-[#D4AF37]/10 text-[#D4AF37]/60";
  };

  // Composant réutilisable pour le filtre avec bouton Reset
  const FilterGroup = ({ value, options, onChange, onReset, label, isDefault }) => (
    <div className="relative flex items-center group w-full">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full px-3 py-3 bg-[#0f172a] border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] font-cinzel font-bold uppercase tracking-widest text-[10px] md:text-xs outline-none appearance-none cursor-pointer hover:border-[#D4AF37]/60 transition-colors"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt === 'Toutes' || opt === 'Tous' ? label : opt}</option>)}
      </select>
      {!isDefault && (
        <button 
          onClick={onReset}
          className="absolute right-2 p-1 bg-[#D4AF37] text-black rounded-full hover:scale-110 transition-transform shadow-lg"
          title="Réinitialiser"
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12 relative z-10 font-inter text-center">
      
      <header className="mb-8 md:mb-12">
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] mb-3 md:mb-4 drop-shadow-2xl uppercase tracking-tighter">
          PROMÉTHÉE
        </h1>
        <p className="text-[#D4AF37]/60 font-cinzel tracking-[0.2em] uppercase text-xs md:text-sm">
          L'Oracle du Savoir Universitaire
        </p>
      </header>

      {/* --- FILTRES --- */}
      <div className="flex flex-col gap-4 max-w-5xl mx-auto mb-8">
        <div className="relative group w-full text-left">
          <div className="absolute -inset-1 bg-[#D4AF37] rounded-xl blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
          <input
            type="text"
            value={query}
            placeholder="Rechercher un parchemin..."
            className="relative w-full px-4 py-3 md:px-6 md:py-4 bg-[#0f172a]/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl text-white text-base md:text-lg focus:outline-none focus:border-[#D4AF37] transition-all font-cinzel tracking-wider text-center"
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FilterGroup 
            value={selectedMatiere} 
            options={matieres} 
            onChange={setSelectedMatiere} 
            onReset={() => setSelectedMatiere('Toutes')} 
            label="🏛️ DISCIPLINE" 
            isDefault={selectedMatiere === 'Toutes'} 
          />
          <FilterGroup 
            value={selectedSemestre} 
            options={['Tous', '1', '2']} 
            onChange={setSelectedSemestre} 
            onReset={() => setSelectedSemestre('Tous')} 
            label="🌗 SEMESTRE" 
            isDefault={selectedSemestre === 'Tous'} 
          />
          <FilterGroup 
            value={selectedYear} 
            options={availableYears} 
            onChange={setSelectedYear} 
            onReset={() => setSelectedYear('Toutes')} 
            label="📅 ANNÉE" 
            isDefault={selectedYear === 'Toutes'} 
          />
          
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full px-3 py-3 bg-[#0f172a] border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] font-cinzel font-bold uppercase tracking-widest text-[10px] md:text-xs outline-none cursor-pointer hover:border-[#D4AF37]/60">
            <option value="recent">✨ RÉCENTS</option>
            <option value="year_desc">📉 ANNÉE (DESC)</option>
            <option value="year_asc">📈 ANNÉE (ASC)</option>
          </select>
        </div>
      </div>

      {/* --- BARRE DE STATUT --- */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-12 px-2">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
        <div className="flex items-center gap-6 mx-6">
            <div className="px-6 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 font-cinzel text-[11px] tracking-[0.25em] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)] whitespace-nowrap">
                {filteredAndSortedResults.length} STÈLES EXHUMÉES
            </div>
            <div className="flex bg-[#0f172a] border border-[#D4AF37]/30 rounded-lg p-0.5 shadow-lg">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'}`}><LayoutGrid size={14} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'}`}><List size={14} /></button>
            </div>
        </div>
        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
      </div>

      {/* --- RÉSULTATS --- */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
          {displayResults.map((annale, idx) => (
            <GridCard key={idx} annale={annale} getHighlightClass={getHighlightClass} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-5xl mx-auto text-left">
          {displayResults.map((annale, idx) => (
            <ListRow key={idx} annale={annale} getHighlightClass={getHighlightClass} />
          ))}
        </div>
      )}

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2 md:gap-8 font-cinzel">
          <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="p-2 md:p-3 rounded-full border border-[#D4AF37]/30 disabled:opacity-10"><ChevronsLeft className="text-[#D4AF37]" size={20} /></button>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 md:p-3 rounded-full border border-[#D4AF37]/30 disabled:opacity-10"><ArrowRight className="rotate-180 text-[#D4AF37]" size={20} /></button>
          <span className="text-[#D4AF37] font-bold text-lg md:text-xl min-w-[80px] text-center">{currentPage} / {totalPages}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 md:p-3 rounded-full border border-[#D4AF37]/30 disabled:opacity-10"><ArrowRight className="text-[#D4AF37]" size={20} /></button>
          <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="p-2 md:p-3 rounded-full border border-[#D4AF37]/30 disabled:opacity-10"><ChevronsRight className="text-[#D4AF37]" size={20} /></button>
        </div>
      )}
    </div>
  );
}

function GridCard({ annale, getHighlightClass }) {
  return (
    <a href={annale.url} target="_blank" rel="noopener noreferrer" className="group relative block p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/40 via-transparent to-[#D4AF37]/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative bg-[#1e293b]/90 backdrop-blur-3xl p-5 md:p-7 rounded-2xl h-full border border-white/5 flex flex-col">
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
        <h3 className="text-xl md:text-2xl font-cinzel text-slate-100 group-hover:text-[#D4AF37] transition-colors leading-tight mb-8 flex-grow">{annale.title}</h3>
        <div className="flex items-center justify-between pt-4 border-t border-white/5 opacity-80 group-hover:opacity-100">
          <div className="text-[10px] font-mono text-slate-400 text-left"><span className="block text-[#D4AF37]/50 font-bold uppercase text-[8px] mb-0.5">Indexé le</span>{annale.scraped_at}</div>
          <div className="bg-[#D4AF37] text-black p-2 rounded-full transition-transform group-hover:scale-110"><ArrowRight size={16} /></div>
        </div>
      </div>
    </a>
  );
}

function ListRow({ annale, getHighlightClass }) {
  const getListHighlightColor = (cat) => {
      const cls = getHighlightClass(cat);
      if (cls.includes('emerald')) return "text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]";
      if (cls.includes('rose')) return "text-rose-400 font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]";
      if (cls.includes('cyan')) return "text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]";
      return "text-slate-500 opacity-40";
  };
  return (
    <a href={annale.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-4 bg-[#1e293b]/50 hover:bg-[#1e293b]/90 border border-white/5 hover:border-[#D4AF37]/30 rounded-xl transition-all shadow-lg relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 overflow-hidden flex-grow text-left">
        <span className="text-[10px] font-mono text-slate-500 min-w-[85px] uppercase">{annale.scraped_at.split(' ')[0]}</span>
        <div className="flex flex-col">
          <h3 className="text-sm md:text-base font-cinzel text-slate-100 group-hover:text-[#D4AF37] transition-colors truncate">{annale.title}</h3>
          <div className="flex flex-wrap gap-2 mt-1.5">
             {annale.category.map((cat, i) => (
               <span key={i} className={`text-[10px] uppercase font-bold tracking-tight transition-colors ${getListHighlightColor(cat)}`}>{cat} {i < annale.category.length - 1 && "•"}</span>
             ))}
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4"><ArrowRight size={18} className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" /></div>
    </a>
  );
}