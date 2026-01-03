import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check, ArrowDown10, ArrowUp01 } from 'lucide-react';

export default function FilterBar({ 
  query, setQuery, setIsSearching,
  selectedMatieres, setSelectedMatieres, matieres,
  selectedYears, setSelectedYears, availableYears,
  selectedSemestres, setSelectedSemestres,
  sortOrder, setSortOrder 
}) {
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    if (localQuery !== query) setIsSearching(true);
    const handler = setTimeout(() => {
      setQuery(localQuery);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(handler);
  }, [localQuery, setQuery, setIsSearching, query]);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto mb-10 px-2">
      <div className="relative w-full">
        <input 
          type="text" 
          value={localQuery} 
          placeholder="Rechercher un document..." 
          className="w-full px-6 py-5 bg-[#0f172a] border border-[#D4AF37]/30 rounded-2xl text-white font-cinzel text-lg md:text-xl text-center outline-none focus:border-[#D4AF37]" 
          onChange={(e) => setLocalQuery(e.target.value)} 
        />
        {localQuery && <X size={24} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#D4AF37]" onClick={() => setLocalQuery('')} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <MultiFilterGroup label="🏛️ DISCIPLINE" options={matieres} selected={selectedMatieres} onChange={setSelectedMatieres} isLongText={true} />
        <MultiFilterGroup label="🌗 SEMESTRE" options={['1', '2']} selected={selectedSemestres} onChange={setSelectedSemestres} />
        <MultiFilterGroup label="📅 ANNÉE" options={availableYears} selected={selectedYears} onChange={setSelectedYears} />
        
        {/* Tri compact sur mobile */}
        <div className="flex bg-[#0f172a] border border-[#D4AF37]/30 rounded-2xl p-1 h-[56px] md:h-[60px]">
           <button onClick={() => setSortOrder('year_desc')} className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition ${sortOrder !== 'year_asc' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37]/40'}`}>
             <ArrowDown10 size={18} /><span className="text-[10px] font-bold font-cinzel">RÉCENT</span>
           </button>
           <button onClick={() => setSortOrder('year_asc')} className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition ${sortOrder === 'year_asc' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37]/40'}`}>
             <ArrowUp01 size={18} /><span className="text-[10px] font-bold font-cinzel">ANCIEN</span>
           </button>
        </div>
      </div>
    </div>
  );
}

function MultiFilterGroup({ label, options, selected, onChange, isLongText = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const click = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="w-full px-4 h-[56px] md:h-[60px] bg-[#0f172a] border border-[#D4AF37]/30 rounded-2xl text-[#D4AF37] font-cinzel font-bold text-xs md:text-sm flex items-center justify-between cursor-pointer">
        <span className="truncate">{selected.length > 0 ? `${label.split(' ')[1]} (${selected.length})` : label}</span>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className={`absolute z-50 mt-2 bg-[#0f172a] border border-[#D4AF37]/30 rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar w-full ${isLongText ? 'md:w-[180%] md:left-0' : ''}`}>
          {options.map(opt => (
            <div key={opt} onClick={() => onChange(selected.includes(opt.toString()) ? selected.filter(i => i !== opt.toString()) : [...selected, opt.toString()])} className="px-5 py-4 text-[#D4AF37] font-cinzel text-sm flex items-center justify-between hover:bg-[#D4AF37]/10 cursor-pointer border-b border-white/5 last:border-0">
              <span className={`truncate mr-4 ${selected.includes(opt.toString()) ? 'font-black text-white' : ''}`}>{opt}</span>
              <div className={`w-5 h-5 border border-[#D4AF37]/50 rounded-lg flex items-center justify-center ${selected.includes(opt.toString()) ? 'bg-[#D4AF37]' : ''}`}>
                {selected.includes(opt.toString()) && <Check size={14} className="text-black" strokeWidth={4} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}