import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function BetaBadge() {
  return (
    <div className="inline-flex flex-col md:flex-row items-center gap-2 md:gap-3 px-4 py-2 mb-4 md:mb-6 rounded-2xl md:rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.05)] max-w-[90vw] md:max-w-none">
      
      {/* Version et Icône */}
      <div className="flex items-center gap-2">
        <AlertTriangle size={14} className="text-[#D4AF37] animate-pulse" />
        <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em] whitespace-nowrap">
          Beta version 1
        </span>
      </div>
      
      {/* Séparateur (caché sur mobile) */}
      <div className="hidden md:block w-[1px] h-4 bg-[#D4AF37]/30"></div>
      
      {/* Texte d'avertissement */}
      <span className="text-[9px] md:text-[11px] text-slate-300 font-medium italic leading-tight text-center md:text-left">
        Des bugs peuvent apparaître mais seront réglés prochainement
      </span>
    </div>
  );
}