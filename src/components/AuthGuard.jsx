import React, { useEffect, useState } from 'react';

export default function AuthGuard({ children }) {
  const [status, setStatus] = useState('loading'); // loading, authenticated, redirecting

  useEffect(() => {
    const SERVICE_URL = window.location.origin + window.location.pathname;
    const CAS_LOGIN_URL = `https://sso.univ-pau.fr/cas/login?service=${encodeURIComponent(SERVICE_URL)}`;
    
    // 1. On vérifie si une session existe déjà dans le navigateur
    const isLogged = sessionStorage.getItem('uppa_session_active');

    if (isLogged === 'true') {
      setStatus('authenticated');
      return;
    }

    // 2. Si pas de session, on regarde si on revient juste du SSO avec un ticket
    const params = new URLSearchParams(window.location.search);
    const ticket = params.get('ticket');

    if (ticket) {
      // On crée la session pour éviter de se reconnecter "chaque instant"
      sessionStorage.setItem('uppa_session_active', 'true');
      
      // On nettoie l'URL (on enlève le ticket pour faire propre)
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setStatus('authenticated');
    } else {
      // 3. Pas de session et pas de ticket : on envoie vers l'UPPA
      setStatus('redirecting');
      window.location.href = CAS_LOGIN_URL;
    }
  }, []);

  // Écran d'attente stylisé pendant la redirection ou le chargement
  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-[#D4AF37]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-[#D4AF37] font-cinzel text-xl tracking-widest mb-2 uppercase">
          Vérification de l'Aura
        </h2>
        <p className="text-slate-400 font-inter text-xs tracking-[0.2em] uppercase opacity-60">
          Connexion au Grand Portail de l'Université...
        </p>
      </div>
    );
  }

  // Si authentifié, on affiche l'Oracle (les enfants du composant)
  return children;
}