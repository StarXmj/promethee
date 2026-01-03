import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, ShieldCheck, Lock, Unlock, AlertCircle } from 'lucide-react';
import BetaBadge from '../BetaBadge';

export default function TermsAgreement({ onAccept }) {
  const [hasLogged, setHasLogged] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  
  const UPPA_CAS_URL = "https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f";

  // Fonction pour ouvrir le login et valider l'étape
  const handleLoginClick = () => {
    // On ouvre le SSO dans un nouvel onglet
    window.open(UPPA_CAS_URL, '_blank');
    // On marque que l'utilisateur a au moins tenté l'action
    setHasLogged(true);
  };

  return (
    <div className="relative max-w-5xl mx-auto my-4 md:my-12 p-6 md:p-12 bg-[#0f172a]/95 border border-[#D4AF37]/30 rounded-3xl backdrop-blur-xl shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-6xl font-cinzel font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] leading-tight uppercase">
          Protocole de Connexion
        </h2>
        <p className="text-slate-400 font-cinzel tracking-[0.2em] text-xs md:text-sm uppercase mb-6">
          Vérification d'accès aux serveurs UPPA
        </p>
        <BetaBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* ÉTAPE 1 : OBLIGATOIRE */}
        <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          hasLogged ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-[#D4AF37]/5 border-[#D4AF37]/30'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#D4AF37] font-cinzel text-3xl font-bold">01</div>
            {hasLogged ? <Unlock className="text-emerald-400" /> : <Lock className="text-[#D4AF37]/50" />}
          </div>
          <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg">Lancer la Session</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light italic">
            Cliquez sur le bouton pour ouvrir le portail de connexion de l'université.
          </p>
          <button 
            onClick={handleLoginClick}
            className="mt-auto flex items-center justify-center gap-2 bg-[#D4AF37] text-black py-4 rounded-xl text-xs font-bold hover:scale-105 transition-all uppercase tracking-widest shadow-lg"
          >
            OUVRIR LE SSO <ExternalLink size={14} />
          </button>
        </div>

        {/* ÉTAPE 2 : DISCIPLINE */}
        <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          hasLogged ? 'bg-white/5 border-[#D4AF37]/30 opacity-100' : 'bg-white/5 border-white/5 opacity-40'
        }`}>
          <div className="text-[#D4AF37] font-cinzel text-3xl font-bold mb-4 italic">02</div>
          <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg">Authentification</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-light italic">
            Une fois sur l'onglet de l'UPPA, entrez vos identifiants et validez. Puis revenez ici.
          </p>
        </div>

        {/* ÉTAPE 3 : FINALISATION */}
        <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          hasRead ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50' : 'bg-white/5 border-white/5 opacity-40'
        }`}>
          <div className="text-[#D4AF37] font-cinzel text-3xl font-bold mb-4 italic">03</div>
          <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg">Validation</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-light italic">
            Cochez la certification ci-dessous pour débloquer l'accès au catalogue Prométhée.
          </p>
        </div>
      </div>

      {/* ZONE D'AVERTISSEMENT SI NON CLIQUÉ */}
      {!hasLogged && (
        <div className="flex items-center gap-3 max-w-2xl mx-auto mb-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs md:text-sm animate-pulse">
          <AlertCircle size={20} />
          <p>Vous devez impérativement cliquer sur <strong>"OUVRIR LE SSO"</strong> pour autoriser votre navigateur à lire les PDFs.</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-8">
        <label className={`flex items-center gap-5 cursor-pointer group max-w-2xl transition-opacity ${!hasLogged ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative shrink-0">
            <input type="checkbox" className="hidden" checked={hasRead} onChange={() => setHasRead(!hasRead)} disabled={!hasLogged} />
            <div className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center transition-all ${
              hasRead ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#D4AF37]/30 group-hover:border-[#D4AF37]'
            }`}>
              {hasRead && <CheckCircle size={24} className="text-black" strokeWidth={3} />}
            </div>
          </div>
          <span className="text-slate-200 font-cinzel text-sm md:text-lg select-none leading-snug">
            Je certifie avoir ouvert ma session universitaire et être prêt à consulter les archives.
          </span>
        </label>

        <button
          disabled={!hasRead || !hasLogged}
          onClick={onAccept}
          className={`w-full md:w-auto px-16 py-6 rounded-full font-bold font-cinzel tracking-[0.3em] uppercase text-base md:text-xl transition-all duration-500 ${
            hasRead && hasLogged 
              ? 'bg-[#D4AF37] text-black shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95' 
              : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
          }`}
        >
          Accéder au catalogue
        </button>
      </div>
    </div>
  );
}