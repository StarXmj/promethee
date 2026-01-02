import React, { useEffect, useState } from 'react';

// Ton lien d'authentification direct pour le serveur de fichiers
const FILE_SERVER_AUTH_URL = "https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f";

export default function AuthGuard({ children }) {
  const [step, setStep] = useState('loading'); // loading, need_auth, ready

  useEffect(() => {
    const SERVICE_URL = window.location.origin + window.location.pathname;
    const APP_LOGIN_URL = `https://sso.univ-pau.fr/cas/login?service=${encodeURIComponent(SERVICE_URL)}`;
    
    // Vérification des sessions
    const oracleAuth = sessionStorage.getItem('oracle_auth');
    const params = new URLSearchParams(window.location.search);
    const ticket = params.get('ticket');

    if (oracleAuth === 'true') {
      setStep('ready');
    } else if (ticket) {
      // Retour du SSO : on valide l'entrée et on nettoie l'URL
      sessionStorage.setItem('oracle_auth', 'true');
      window.history.replaceState({}, document.title, window.location.pathname);
      setStep('ready');
    } else {
      // Redirection initiale
      window.location.href = APP_LOGIN_URL;
    }
  }, []);

  // ÉCRAN DE SYNCHRONISATION (Si l'utilisateur n'a pas encore activé les fichiers)
  // On peut ajouter un petit bouton dans l'Oracle ou forcer ce passage une fois
  if (step === 'ready' && !sessionStorage.getItem('files_synced')) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center font-cinzel">
        <div className="max-w-md border border-[#D4AF37]/30 bg-[#0f172a] p-8 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.1)]">
          <h2 className="text-[#D4AF37] text-2xl mb-4 tracking-tighter uppercase">Lien des Archives</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed font-inter uppercase tracking-widest opacity-80">
            Pour que l'Oracle puisse dévoiler les PDF, vous devez activer l'accès au serveur de fichiers de l'UPPA.
          </p>
          
          <a 
            href={FILE_SERVER_AUTH_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              sessionStorage.setItem('files_synced', 'true');
              // On laisse un petit délai pour que l'utilisateur voit l'onglet s'ouvrir
              setTimeout(() => window.location.reload(), 500);
            }}
            className="inline-block px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            ACTIVER LES FICHIERS →
          </a>
          
          <p className="mt-6 text-[10px] text-slate-500 font-inter italic uppercase tracking-tighter">
            Note: Cliquez, laissez l'onglet s'ouvrir, puis revenez ici.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
}