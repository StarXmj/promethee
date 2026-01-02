import React, { useState, useEffect } from 'react';

// URL qui dépose le cookie sur le serveur de fichiers
const UPPA_AUTH_URL = "https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f";

export default function AuthGuard({ children }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // On vérifie si la session est active dans cet onglet
    const session = sessionStorage.getItem('promethee_unlocked');
    if (session === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    // 1. On ouvre l'authentification UPPA dans un NOUVEL onglet
    // Cela permet d'obtenir le cookie de session sans quitter Prométhée
    window.open(UPPA_AUTH_URL, '_blank');
    
    // 2. On déverrouille l'Oracle sur l'onglet actuel
    sessionStorage.setItem('promethee_unlocked', 'true');
    setIsUnlocked(true);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-cinzel">
        {/* Background Aura */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-lg w-full bg-[#0f172a]/60 backdrop-blur-3xl border border-[#D4AF37]/20 p-8 md:p-12 rounded-[2rem] shadow-2xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] mb-6 tracking-tighter">
            PROMÉTHÉE
          </h1>
          
          <div className="w-12 h-[1px] bg-[#D4AF37]/50 mx-auto mb-8"></div>
          
          <p className="text-[#D4AF37]/80 text-sm md:text-base mb-10 leading-relaxed tracking-[0.1em] uppercase">
            Pour accéder aux archives sacrées, vous devez réveiller votre session universitaire.
          </p>

          <button
            onClick={handleUnlock}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-black transition-all duration-300 bg-[#D4AF37] rounded-full hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            <span className="tracking-widest uppercase text-sm">S'identifier & Entrer</span>
          </button>

          <div className="mt-10 space-y-2 opacity-40">
            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
              1. Cliquez sur le bouton (un onglet s'ouvrira)
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
              2. Connectez-vous sur le portail UPPA
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
              3. Revenez ici pour consulter les stèles
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
}