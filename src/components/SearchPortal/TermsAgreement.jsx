import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Loader2, ShieldX, ShieldCheck, Lock, Unlock } from 'lucide-react';
import BetaBadge from '../BetaBadge';

export default function TermsAgreement({ onAccept }) {
  const [hasLogged, setHasLogged] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('idle'); // 'idle' | 'checking' | 'active' | 'error'
  
  const PROTECTED_URL = "https://fichiers.univ-pau.fr/Annales/";
  const UPPA_CAS_URL = "https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f";

  // LA SONDE RÉSEAU : Détecte physiquement si la session est ouverte
  const probeUPPASession = async () => {
    setSessionStatus('checking');
    try {
      // On tente de joindre le dossier protégé
      // Le mode 'no-cors' est crucial pour éviter les erreurs de politique CORS
      // Mais il échouera techniquement si le serveur tente une redirection vers le SSO
      await fetch(PROTECTED_URL, { 
        mode: 'no-cors', 
        credentials: 'include', // Envoie les cookies de session
        cache: 'no-store' 
      });
      
      // Si on arrive ici, le serveur de fichiers a répondu directement (Session active)
      setSessionStatus('active');
    } catch (error) {
      // Si la promesse échoue, c'est que le navigateur a bloqué la redirection vers le SSO (Session inactive)
      setSessionStatus('error');
    }
  };

  // Vérification automatique quand l'utilisateur revient sur l'onglet
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasLogged) {
        probeUPPASession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasLogged]);

  return (
    <div className="relative max-w-5xl mx-auto my-4 md:my-12 p-6 md:p-12 bg-[#0f172a]/95 border border-[#D4AF37]/30 rounded-3xl backdrop-blur-xl shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-6xl font-cinzel font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] leading-tight uppercase">
          Protocole de Connexion
        </h2>
        <p className="text-slate-400 font-cinzel tracking-[0.2em] text-xs md:text-sm uppercase mb-6">
          Vérification d'accès aux archives UPPA
        </p>
        <BetaBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* ÉTAPE 1 : OUVERTURE SSO */}
        <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          sessionStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#D4AF37]/5 border-[#D4AF37]/30'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#D4AF37] font-cinzel text-3xl font-bold">01</div>
            {sessionStatus === 'active' ? <Unlock className="text-emerald-400" /> : <Lock className="text-[#D4AF37]/50" />}
          </div>
          <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg italic">Authentification</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light italic">
            Connectez-vous sur le serveur de fichiers de l'université.
          </p>
          <button 
            onClick={() => { window.open(UPPA_CAS_URL, '_blank'); setHasLogged(true); }}
            className="mt-auto flex items-center justify-center gap-2 bg-[#D4AF37] text-black py-4 rounded-xl text-xs font-bold hover:scale-105 transition-all uppercase tracking-widest shadow-lg"
          >
            OUVRIR LE SSO <ExternalLink size={14} />
          </button>
        </div>

        {/* ÉTAPE 2 : TEST DE SESSION */}
        <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          hasLogged ? 'bg-white/5 border-[#D4AF37]/30' : 'bg-white/5 border-white/5 opacity-40'
        }`}>
          <div className="text-[#D4AF37] font-cinzel text-3xl font-bold mb-4 italic">02</div>
          <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg italic">Vérification</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light italic text-left">
            Une fois connecté sur l'onglet UPPA, revenez ici et cliquez sur "Tester ma connexion".
          </p>
          <button 
            disabled={!hasLogged}
            onClick={probeUPPASession}
            className="mt-auto flex items-center justify-center gap-2 border border-[#D4AF37] text-[#D4AF37] py-4 rounded-xl text-xs font-bold hover:bg-[#D4AF37]/10 transition-all uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed"
          >
            {sessionStatus === 'checking' ? <Loader2 size={16} className="animate-spin" /> : 'TESTER MA CONNEXION'}
          </button>
        </div>

        {/* ÉTAPE 3 : RÉSULTAT */}
        <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          sessionStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/5 opacity-40'
        }`}>
          <div className="text-[#D4AF37] font-cinzel text-3xl font-bold mb-4 italic">03</div>
          <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg italic tracking-tighter">Accès catalogue</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-light italic">
            Le portail se débloque uniquement si le serveur de fichiers confirme votre identité.
          </p>
          {sessionStatus === 'error' && <p className="mt-4 text-[10px] text-rose-500 font-bold uppercase animate-pulse">Session non détectée !</p>}
          {sessionStatus === 'active' && <p className="mt-4 text-[10px] text-emerald-400 font-bold uppercase">Connexion validée ✓</p>}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <label className={`flex items-center gap-5 cursor-pointer group max-w-2xl transition-opacity ${sessionStatus !== 'active' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative shrink-0">
            <input type="checkbox" className="hidden" checked={hasRead} onChange={() => setHasRead(!hasRead)} disabled={sessionStatus !== 'active'} />
            <div className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center transition-all ${
              hasRead ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#D4AF37]/30 group-hover:border-[#D4AF37]'
            }`}>
              {hasRead && <CheckCircle size={24} className="text-black" strokeWidth={3} />}
            </div>
          </div>
          <span className="text-slate-200 font-cinzel text-sm md:text-lg select-none leading-snug">
            Je certifie être habilité par l'UPPA pour accéder à ces documents.
          </span>
        </label>

        <button
          disabled={!hasRead || sessionStatus !== 'active'}
          onClick={onAccept}
          className={`w-full md:w-auto px-16 py-6 rounded-full font-bold font-cinzel tracking-[0.3em] uppercase text-base md:text-xl transition-all duration-500 ${
            hasRead && sessionStatus === 'active' 
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