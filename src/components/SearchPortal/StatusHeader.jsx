import React from 'react';
import { LayoutGrid, List, Loader2 } from 'lucide-react';

export default function StatusHeader({ totalResults, viewMode, setViewMode, isSearching }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto mb-10 gap-4 px-2">
      <div className="hidden md:block h-[1px] flex-grow bg-[#D4AF37]/30"></div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
          <div className="min-w-[200px] px-6 py-3 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 font-cinzel text-xs text-[#D4AF37] flex items-center justify-center gap-3 shadow-lg shadow-[#D4AF37]/5">
              {isSearching ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>RECHERCHE...</span>
                </>
              ) : (
                <span>
                  {/* Utilisation de toLocaleString pour le séparateur de milliers (ex: 12 450) */}
                  {Number(totalResults).toLocaleString('fr-FR')} ANNALES INDEXÉES
                </span>
              )}
          </div>
          
          <div className="flex bg-[#0f172a] border border-[#D4AF37]/30 rounded-xl p-1">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'}`}
                title="Vue en grille"
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-[#D4AF37] text-black' : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'}`}
                title="Vue en liste"
              >
                <List size={20} />
              </button>
          </div>
      </div>

      <div className="hidden md:block h-[1px] flex-grow bg-[#D4AF37]/30"></div>
    </div>
  );
}