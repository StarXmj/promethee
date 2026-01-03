import React, { useState, useEffect } from 'react';
import { ShieldAlert, Loader2, ExternalLink, RefreshCw } from 'lucide-react';

const AuthGuard = ({ children }) => {
  const [status, setStatus] = useState('checking'); 
  // URL spécifique que tu as fournie pour primer la session des annales
  const UPPA_CAS_URL = "https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f";

  const checkUPPASession = async () => {
    try {
      // On teste directement le serveur de fichiers pour être sûr
      await fetch('https://fichiers.univ-pau.fr/Annales/', { 
        mode: 'no-cors', 
        cache: 'no-store' 
      });
      setStatus('authenticated');
    } catch (error) {
      setStatus('expired');
    }
  };

  useEffect(() => {
    checkUPPASession();
    // Vérification toutes les 2 minutes pour anticiper l'expiration
    const interval = setInterval(checkUPPASession, 120000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center text-[#D4AF37]">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-cinzel tracking-widest text-sm animate-pulse text-center px-4">
          Synchronisation avec les serveurs de l'UPPA...
        </p>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="h-screen w-full bg-[#020617] p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#0f172a] border border-rose-500/30 p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(244,63,94,0.15)]">
          <div className="bg-rose-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-rose-500" size={32} />
          </div>
          <h2 className="text-2xl font-cinzel font-bold text-white mb-4 uppercase tracking-tight">Accès Interrompu</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Votre session sur le serveur de fichiers de l'UPPA a expiré. 
            L'accès aux documents nécessite une ré-authentification immédiate.
          </p>
          
          <div className="flex flex-col gap-4">
            <a 
              href={UPPA_CAS_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#D4AF37] text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              RÉACTIVER MA SESSION <ExternalLink size={18} />
            </a>
            <button 
              onClick={() => { setStatus('checking'); checkUPPASession(); }}
              className="flex items-center justify-center gap-2 text-[#D4AF37] text-xs font-cinzel font-bold tracking-widest py-2 hover:opacity-80 transition-opacity"
            >
              <RefreshCw size={14} /> J'AI EFFECTUÉ LA CONNEXION
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;