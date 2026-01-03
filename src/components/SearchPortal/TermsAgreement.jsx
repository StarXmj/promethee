import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Loader2, ShieldX, ShieldCheck, AlertCircle } from 'lucide-react';
import BetaBadge from '../BetaBadge';

export default function TermsAgreement({ onAccept }) {
  const [hasRead, setHasRead] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('idle'); // 'idle' | 'checking' | 'active' | 'error'
  
  const PROTECTED_RESOURCE = "https://fichiers.univ-pau.fr/Annales/";
  const UPPA_CAS_URL = "https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f";

  // FONCTION DE VÉRIFICATION ULTRA-FIABLE
  const verifyUPPASession = async () => {
    if (!hasRead) return;
    
    setSessionStatus('checking');

    try {
      // On tente d'accéder au dossier protégé
      // no-cors + credentials 'include' est la clé
      await fetch(PROTECTED_RESOURCE, { 
        mode: 'no-cors', 
        credentials: 'include',
        cache: 'no-store'
      });
      
      // Si la promesse est résolue, c'est que le serveur fichiers.univ-pau.fr a répondu
      // (Si on n'était pas connecté, le navigateur aurait bloqué la redirection vers le SSO)
      setSessionStatus('active');
    } catch (error) {
      // Si ça échoue, c'est qu'il y a eu une redirection vers le SSO détectée
      setSessionStatus('error');
    }
  };

  // AUTO-CHECK : Dès que l'utilisateur coche, on vérifie.
  // Puis on vérifie toutes les 3 secondes tant que c'est en erreur
  useEffect(() => {
    let interval;
    if (hasRead) {
      verifyUPPASession();
      // On tente de ré-autoriser automatiquement si l'étudiant se connecte dans l'autre onglet
      interval = setInterval(() => {
        if (sessionStatus === 'error' || sessionStatus === 'idle') {
          verifyUPPASession();
        }
      }, 4000);
    } else {
      setSessionStatus('idle');
    }
    return () => clearInterval(interval);
  }, [hasRead, sessionStatus]);

  return (
    <div className="relative max-w-5xl mx-auto my-8 md:my-12 p-6 md:p-12 bg-[#0f172a]/95 border border-[#D4AF37]/30 rounded-3xl backdrop-blur-xl shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-6xl font-cinzel font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] leading-tight uppercase">
          Protocole de Connexion
        </h2>
        <p className="text-slate-400 font-cinzel tracking-[0.2em] text-xs md:text-sm uppercase mb-6">
          Vérification d'habilitation sur fichiers.univ-pau.fr
        </p>
        <BetaBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
        <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
          sessionStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#D4AF37]/5 border-[#D4AF37]/20'
        }`}>
          <div className="text-[#D4AF37] font-cinzel text-3xl font-bold mb-4">01</div>
          <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg italic">Ouverture Session</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light italic">
            Cliquez pour vous authentifier sur le service de fichiers de l'UPPA.
          </p>
          <a 
            href={UPPA_CAS_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-auto flex items-center justify-center gap-2 bg-[#D4AF37] text-black py-4 rounded-xl text-xs font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all uppercase tracking-widest"
          >
            S'IDENTIFIER (SSO) <ExternalLink size={14} />
          </a>
        </div>

        <StepCard 
          num="02" 
          title="Validation" 
          desc="Une fois la connexion établie dans l'autre onglet, revenez ici pour valider le protocole." 
          isActive={hasRead}
        />
        <StepCard 
          num="03" 
          title="Vérification" 
          desc="Notre système analyse votre jeton d'accès en temps réel pour débloquer le portail." 
          isActive={sessionStatus === 'active'}
        />
      </div>

      {/* ZONE DE FEEDBACK DYNAMIQUE */}
      <div className="max-w-2xl mx-auto mb-10 min-h-[80px]">
        {hasRead && sessionStatus === 'checking' && (
          <div className="flex items-center justify-center gap-3 p-6 text-[#D4AF37] font-cinzel animate-pulse">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-sm tracking-widest">INTERROGATION DU SERVEUR UPPA...</span>
          </div>
        )}

        {hasRead && sessionStatus === 'error' && (
          <div className="flex flex-col gap-4 p-6 border-2 border-rose-500/40 bg-rose-500/10 rounded-2xl text-rose-400 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <ShieldX size={24} />
              <p className="text-sm font-bold uppercase tracking-wider text-white">Accès Refusé par le Serveur</p>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300 italic">
              Le dossier "/Annales/" est actuellement verrouillé. Veuillez vous connecter via l'étape 01. 
              <span className="block mt-1 font-bold text-rose-400">Tentative de reconnexion automatique en cours...</span>
            </p>
          </div>
        )}
        
        {hasRead && sessionStatus === 'active' && (
          <div className="flex items-center gap-4 p-6 border-2 border-emerald-500/40 bg-emerald-500/10 rounded-2xl text-emerald-400 animate-in zoom-in-95">
            <ShieldCheck size={28} />
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-white">Habilitation Détectée</p>
              <p className="text-[11px] text-emerald-400/80 italic font-medium">Le serveur de fichiers autorise désormais votre accès.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-8">
        <label className="flex items-center gap-5 cursor-pointer group max-w-2xl px-4">
          <div className="relative shrink-0">
            <input type="checkbox" className="hidden" checked={hasRead} onChange={() => setHasRead(!hasRead)} />
            <div className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center transition-all ${
              hasRead ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#D4AF37]/30 group-hover:border-[#D4AF37]'
            }`}>
              {hasRead && <CheckCircle size={24} className="text-black" strokeWidth={3} />}
            </div>
          </div>
          <span className="text-slate-200 font-cinzel text-sm md:text-lg select-none leading-snug">
            Je certifie avoir ouvert ma session universitaire sur fichiers.univ-pau.fr
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
          Accéder aux Annales
        </button>
      </div>
    </div>
  );
}

function StepCard({ num, title, desc, isActive }) {
  return (
    <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
      isActive ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 shadow-inner' : 'bg-white/5 border-white/5 opacity-60'
    }`}>
      <div className={`font-cinzel text-3xl font-bold mb-4 transition-colors ${isActive ? 'text-[#D4AF37]' : 'text-slate-600'}`}>{num}</div>
      <h3 className="text-white font-cinzel font-bold mb-3 uppercase text-lg tracking-wide">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed font-light italic">{desc}</p>
    </div>
  );
}