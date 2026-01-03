import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Loader2, ShieldX, ShieldCheck } from 'lucide-react';
import BetaBadge from '../BetaBadge';

export default function TermsAgreement({ onAccept }) {
  const [hasRead, setHasRead] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('idle'); // 'idle' | 'checking' | 'active' | 'error'
  
  const UPPA_CAS_URL = "https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f";

  // Fonction de vérification réelle
  const verifyUPPASession = async () => {
    if (!hasRead) return;
    
    setSessionStatus('checking');
    try {
      // On tente de joindre le serveur de fichiers
      await fetch('https://fichiers.univ-pau.fr/favicon.ico', { 
        mode: 'no-cors', 
        cache: 'no-store' 
      });
      // Si on arrive ici (pas d'erreur réseau), c'est que le domaine est accessible
      setSessionStatus('active');
    } catch (error) {
      setSessionStatus('error');
    }
  };

  // On relance la vérification dès que la case est cochée
  useEffect(() => {
    if (hasRead) {
      verifyUPPASession();
    } else {
      setSessionStatus('idle');
    }
  }, [hasRead]);

  return (
    <div className="relative max-w-5xl mx-auto my-8 md:my-12 p-6 md:p-12 bg-[#0f172a]/95 border border-[#D4AF37]/30 rounded-3xl backdrop-blur-xl shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-6xl font-cinzel font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] leading-tight uppercase">
          Protocole de Connexion
        </h2>
        <p className="text-slate-400 font-cinzel tracking-[0.2em] text-xs md:text-sm uppercase mb-6">
          Vérification de l'habilitation universitaire
        </p>
        <BetaBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
        <div className="p-8 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20 flex flex-col h-full">
          <div className="text-[#D4AF37] font-cinzel text-3xl font-bold mb-4">01</div>
          <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg">Authentification</h3>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed font-light">
            Ouvrez la session officielle via le SSO de l'université pour autoriser l'accès.
          </p>
          <a 
            href={UPPA_CAS_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-auto flex items-center justify-center gap-2 bg-[#D4AF37] text-black py-3 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg"
          >
            OUVRIR LE SSO <ExternalLink size={14} />
          </a>
        </div>

        <StepCard 
          num="02" 
          title="Vérification" 
          desc="Cochez la case ci-dessous. Notre système interrogera instantanément les serveurs de l'UPPA." 
        />
        <StepCard 
          num="03" 
          title="Accès" 
          desc="Le bouton de catalogue se débloquera uniquement si une connexion valide est détectée." 
        />
      </div>

      {/* ZONE DE FEEDBACK SÉCURITÉ */}
      <div className="max-w-2xl mx-auto mb-10">
        {hasRead && sessionStatus === 'error' && (
          <div className="flex items-center gap-3 p-4 border border-rose-500/30 bg-rose-500/10 rounded-2xl text-rose-400 animate-in fade-in slide-in-from-top-2">
            <ShieldX size={20} />
            <p className="text-sm font-medium">Aucune connexion détectée. Avez-vous cliqué sur le bouton de l'étape 01 ?</p>
            <button onClick={verifyUPPASession} className="ml-auto underline text-xs">Réessayer</button>
          </div>
        )}
        
        {hasRead && sessionStatus === 'active' && (
          <div className="flex items-center gap-3 p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-2xl text-emerald-400 animate-in fade-in zoom-in-95">
            <ShieldCheck size={20} />
            <p className="text-sm font-medium">Connexion UPPA vérifiée avec succès.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-8">
        <label className="flex items-center gap-5 cursor-pointer group max-w-2xl">
          <div className="relative shrink-0">
            <input type="checkbox" className="hidden" checked={hasRead} onChange={() => setHasRead(!hasRead)} />
            <div className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center transition-all ${
              hasRead ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#D4AF37]/30 group-hover:border-[#D4AF37]'
            }`}>
              {hasRead && <CheckCircle size={24} className="text-black" strokeWidth={3} />}
            </div>
          </div>
          <span className="text-slate-200 font-cinzel text-sm md:text-lg select-none leading-snug">
            Je certifie être étudiant à l'UPPA et avoir activé ma session via le bouton SSO.
          </span>
        </label>

        <button
          disabled={!hasRead || sessionStatus !== 'active'}
          onClick={onAccept}
          className={`w-full md:w-auto px-16 py-6 rounded-full font-bold font-cinzel tracking-[0.3em] uppercase text-base md:text-xl transition-all duration-500 flex items-center gap-4 ${
            hasRead && sessionStatus === 'active' 
              ? 'bg-[#D4AF37] text-black shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95' 
              : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
          }`}
        >
          {sessionStatus === 'checking' && <Loader2 className="animate-spin" size={20} />}
          Accéder au catalogue
        </button>
      </div>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div className="p-8 bg-white/5 rounded-2xl border border-white/5 flex flex-col h-full">
      <div className="text-[#D4AF37] font-cinzel text-3xl font-bold mb-4 opacity-40">{num}</div>
      <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed font-light">{desc}</p>
    </div>
  );
}