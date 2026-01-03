import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, ExternalLink, Loader2, ShieldX, ShieldCheck, Lock, Unlock, ArrowRight } from 'lucide-react';
import BetaBadge from '../BetaBadge';

export default function TermsAgreement({ onAccept }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasLogged, setHasLogged] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('idle'); // 'idle' | 'checking' | 'active' | 'error'

  // Configuration des URLs
  const MY_APP_URL = window.location.origin + window.location.pathname;
  // Gateway = vérification silencieuse (renvoie vers l'app avec ou sans ticket)
  const CAS_GATEWAY_URL = `https://sso.univ-pau.fr/cas/login?service=${encodeURIComponent(MY_APP_URL)}&gateway=true`;
  const UPPA_CAS_LOGIN = `https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f`;

  /**
   * ACTION : Nettoyage de l'URL et validation
   */
  useEffect(() => {
    const ticket = searchParams.get('ticket');
    if (ticket) {
      // 1. On valide la session immédiatement
      setSessionStatus('active');
      setHasRead(true); // Auto-check pour éviter de bloquer l'utilisateur
      setHasLogged(true);

      // 2. On nettoie l'URL pour éviter les boucles au rafraîchissement
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('ticket');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleVerify = () => {
    setSessionStatus('checking');
    // Redirection vers le CAS en mode Gateway
    window.location.href = CAS_GATEWAY_URL;
  };

  return (
    <div className="relative max-w-5xl mx-auto my-4 md:my-10 p-6 md:p-12 bg-[#0f172a]/95 border border-[#D4AF37]/30 rounded-3xl backdrop-blur-xl shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-cinzel font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] uppercase">
          Contrôle d'Accès
        </h2>
        <p className="text-slate-400 font-cinzel tracking-[0.2em] text-[10px] md:text-xs uppercase mb-6">
          Identification Requise : Serveur de fichiers UPPA
        </p>
        <BetaBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* ÉTAPE 01 : CONNEXION */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          sessionStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#D4AF37]/5 border-[#D4AF37]/30'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#D4AF37] font-cinzel text-2xl font-bold italic">01</div>
            {sessionStatus === 'active' ? <Unlock size={20} className="text-emerald-400" /> : <Lock size={20} className="text-[#D4AF37]/50" />}
          </div>
          <h3 className="text-white font-cinzel font-bold mb-2 uppercase text-xs">Connexion</h3>
          <p className="text-slate-400 text-[10px] mb-6 italic">Ouvrez la session sur le serveur distant.</p>
          <button 
            onClick={() => { window.open(UPPA_CAS_LOGIN, '_blank'); setHasLogged(true); }}
            className="mt-auto flex items-center justify-center gap-2 bg-[#D4AF37] text-black py-3 rounded-xl text-[10px] font-bold hover:scale-105 transition-all uppercase tracking-widest"
          >
            OUVRIR LE SSO <ExternalLink size={12} />
          </button>
        </div>

        {/* ÉTAPE 02 : VERIFICATION */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          hasLogged ? 'bg-white/5 border-[#D4AF37]/30' : 'bg-white/5 border-white/5 opacity-40'
        }`}>
          <div className="text-[#D4AF37] font-cinzel text-2xl font-bold mb-4 italic">02</div>
          <h3 className="text-white font-cinzel font-bold mb-2 uppercase text-xs">Sonde</h3>
          <p className="text-slate-400 text-[10px] mb-6 italic">Synchronisez votre jeton d'accès avec l'Oracle.</p>
          <button 
            disabled={!hasLogged || sessionStatus === 'checking'}
            onClick={handleVerify}
            className="mt-auto flex items-center justify-center gap-2 border border-[#D4AF37] text-[#D4AF37] py-3 rounded-xl text-[10px] font-bold hover:bg-[#D4AF37]/10 transition-all uppercase tracking-widest disabled:opacity-10"
          >
            {sessionStatus === 'checking' ? <Loader2 size={14} className="animate-spin" /> : 'TESTER LA SESSION'}
          </button>
        </div>

        {/* ÉTAPE 03 : ACCÈS */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          sessionStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/5 opacity-40'
        }`}>
          <div className="text-[#D4AF37] font-cinzel text-2xl font-bold mb-4 italic">03</div>
          <h3 className="text-white font-cinzel font-bold mb-2 uppercase text-xs italic">Accès</h3>
          <div className="mt-auto">
            {sessionStatus === 'active' ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck size={18} />
                <span className="text-[9px] font-bold uppercase">Session Active</span>
              </div>
            ) : (
              <span className="text-[9px] text-slate-500 italic">En attente...</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <label className={`flex items-center gap-4 cursor-pointer group max-w-2xl transition-opacity ${sessionStatus !== 'active' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative shrink-0">
            <input 
              type="checkbox" 
              className="hidden" 
              checked={hasRead} 
              onChange={() => setHasRead(!hasRead)} 
            />
            <div className={`w-8 h-8 border-2 rounded-xl flex items-center justify-center transition-all ${
              hasRead ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#D4AF37]/30 group-hover:border-[#D4AF37]'
            }`}>
              {hasRead && <CheckCircle size={20} className="text-black" strokeWidth={3} />}
            </div>
          </div>
          <span className="text-slate-300 font-cinzel text-xs select-none">
            Je certifie être connecté au serveur de fichiers de l'UPPA.
          </span>
        </label>

        <button
          disabled={!hasRead || sessionStatus !== 'active'}
          onClick={onAccept}
          className={`w-full md:w-auto px-16 py-5 rounded-full font-bold font-cinzel tracking-[0.3em] uppercase text-sm md:text-lg transition-all duration-500 flex items-center justify-center gap-3 ${
            hasRead && sessionStatus === 'active' 
              ? 'bg-[#D4AF37] text-black shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:scale-105 cursor-pointer' 
              : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
          }`}
        >
          Entrer dans le Portail <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}