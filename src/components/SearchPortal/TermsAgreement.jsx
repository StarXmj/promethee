import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, ExternalLink, Loader2, ShieldX, ShieldCheck, Lock, Unlock } from 'lucide-react';
import BetaBadge from '../BetaBadge';

export default function TermsAgreement({ onAccept }) {
  const [searchParams] = useSearchParams();
  const [hasLogged, setHasLogged] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('idle');

  // URL du service (Ton application)
  const MY_APP_URL = window.location.origin + window.location.pathname;
  
  // URL CAS avec le mode GATEWAY (Vérification silencieuse)
  const CAS_GATEWAY_URL = `https://sso.univ-pau.fr/cas/login?service=${encodeURIComponent(MY_APP_URL)}&gateway=true`;
  const UPPA_CAS_LOGIN = `https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f`;

  // AU CHARGEMENT : On vérifie si on revient du CAS avec un ticket
  useEffect(() => {
    const ticket = searchParams.get('ticket');
    if (ticket) {
      // Si un ticket est présent, c'est que le Gateway a confirmé la session
      setSessionStatus('active');
    }
  }, [searchParams]);

  const triggerGatewayCheck = () => {
    setSessionStatus('checking');
    // On redirige vers le CAS en mode Gateway. 
    // Ça va clignoter 1 seconde et revenir sur ton app proprement.
    window.location.href = CAS_GATEWAY_URL;
  };

  return (
    <div className="relative max-w-5xl mx-auto my-4 md:my-10 p-6 md:p-12 bg-[#0f172a]/95 border border-[#D4AF37]/30 rounded-3xl backdrop-blur-xl shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-cinzel font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] uppercase">
          Contrôle d'Accès
        </h2>
        <BetaBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* ÉTAPE 01 : CONNEXION RÉELLE */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 ${
          sessionStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#D4AF37]/5 border-[#D4AF37]/30'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div className="text-[#D4AF37] font-cinzel text-2xl font-bold italic">01</div>
            {sessionStatus === 'active' ? <Unlock size={20} className="text-emerald-400" /> : <Lock size={20} className="text-[#D4AF37]/50" />}
          </div>
          <h3 className="text-white font-cinzel font-bold mb-2 uppercase text-xs">Authentification</h3>
          <button 
            onClick={() => { window.open(UPPA_CAS_LOGIN, '_blank'); setHasLogged(true); }}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#D4AF37] text-black py-3 rounded-xl text-[10px] font-bold hover:scale-105 transition-all uppercase"
          >
            CONNEXION SSO <ExternalLink size={12} />
          </button>
        </div>

        {/* ÉTAPE 02 : SYNC GATEWAY */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 ${
          hasLogged ? 'bg-white/5 border-[#D4AF37]/30' : 'bg-white/5 border-white/5 opacity-40'
        }`}>
          <div className="text-[#D4AF37] font-cinzel text-2xl font-bold mb-4 italic">02</div>
          <h3 className="text-white font-cinzel font-bold mb-2 uppercase text-xs">Synchronisation</h3>
          <button 
            disabled={!hasLogged}
            onClick={triggerGatewayCheck}
            className="w-full mt-4 flex items-center justify-center gap-2 border border-[#D4AF37] text-[#D4AF37] py-3 rounded-xl text-[10px] font-bold hover:bg-[#D4AF37]/10 transition-all uppercase"
          >
            {sessionStatus === 'checking' ? <Loader2 size={14} className="animate-spin" /> : 'VÉRIFIER LA SESSION'}
          </button>
        </div>

        {/* ÉTAPE 03 : STATUS */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 ${
          sessionStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/5 opacity-40'
        }`}>
          <div className="text-[#D4AF37] font-cinzel text-2xl font-bold mb-4 italic">03</div>
          <h3 className="text-white font-cinzel font-bold mb-2 uppercase text-xs italic">Autorisation</h3>
          <div className="mt-6">
            {sessionStatus === 'active' ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck size={18} />
                <span className="text-[9px] font-bold uppercase tracking-tighter">Accès Autorisé</span>
              </div>
            ) : (
              <span className="text-[9px] text-slate-500 italic">En attente...</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button
          disabled={!hasRead || sessionStatus !== 'active'}
          onClick={onAccept}
          className={`w-full md:w-auto px-16 py-5 rounded-full font-bold font-cinzel tracking-[0.3em] uppercase text-sm transition-all duration-500 ${
            sessionStatus === 'active' 
              ? 'bg-[#D4AF37] text-black shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:scale-105' 
              : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
          }`}
        >
          Entrer dans le Portail
        </button>
      </div>
    </div>
  );
}