import React from 'react';
import { ArrowRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, goToPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-16 flex items-center justify-center gap-4 font-cinzel">
      <button 
        onClick={() => goToPage(1)} 
        disabled={currentPage === 1} 
        className="p-3 rounded-full border border-[#D4AF37]/30 disabled:opacity-10 text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
      >
        <ChevronsLeft size={20} />
      </button>
      
      <button 
        onClick={() => goToPage(currentPage - 1)} 
        disabled={currentPage === 1} 
        className="p-3 rounded-full border border-[#D4AF37]/30 disabled:opacity-10 text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
      >
        <ArrowRight size={20} className="rotate-180" />
      </button>

      <span className="text-[#D4AF37] font-bold text-xl min-w-[80px] text-center">
        {currentPage} / {totalPages}
      </span>

      <button 
        onClick={() => goToPage(currentPage + 1)} 
        disabled={currentPage === totalPages} 
        className="p-3 rounded-full border border-[#D4AF37]/30 disabled:opacity-10 text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
      >
        <ArrowRight size={20} />
      </button>

      <button 
        onClick={() => goToPage(totalPages)} 
        disabled={currentPage === totalPages} 
        className="p-3 rounded-full border border-[#D4AF37]/30 disabled:opacity-10 text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  );
}