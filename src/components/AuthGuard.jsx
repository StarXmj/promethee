import React, { useState, useEffect } from 'react';

// TON LIEN UNIQUE (La Clé Maîtresse)
const UNIVERSITÉ_AUTH_URL = "https://sso.univ-pau.fr/cas/login?service=https%3a%2f%2ffichiers.univ-pau.fr%2fAnnales%2f";

export default function AuthGuard({ children }) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // On vérifie si l'utilisateur a déjà activé sa session aujourd'hui
    const sessionActive = sessionStorage.getItem('promethee_session');
    if (sessionActive === 'true') {
      setHasAccess(true);
    }
  }, []);

  const handleIdentification = () => {
    // 1. On ouvre le lien de l'université dans un nouvel onglet
    // Cela permet à l'utilisateur de se connecter et d'obtenir le cookie des fichiers
    window.open(UNIVERSITÉ_AUTH_URL, '_blank');
    
    // 2. On active l'accès sur l'application Prométhée
    sessionStorage.setItem('promethee_session', 'true');
    setHasAccess(true);
  };

  // --- ÉCRAN DE VERROUILLAGE (Le Portail) ---
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-cinzel relative overflow-hidden">
        {/* Effet de lueur en arrière-plan */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-lg w-full text-center border border-[#D4AF37]/20 bg-[#0f172a]/80 backdrop-blur-2xl p-10 md:p-16 rounded-3xl shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] mb-6 tracking-tighter uppercase">
            Prométhée
          </h1>
          
          <div className="h-[1px] w-24 bg-[#D4AF37]/40 mx-auto mb-8"></div>
          
          <p className="text-[#D4AF37]/70 text-sm md:text-base mb-12 leading-relaxed tracking-widest uppercase">
            Pour réveiller l'Oracle et accéder aux parchemins, identifiez-vous via le portail de l'Université.
          </p>

          <button
            onClick={handleIdentification}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-black transition-all duration-300 bg-[#D4AF37] rounded-full hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            <span className="tracking-[0.2em] uppercase">S'identifier →</span>
          </button>

          <p className="mt-10 text-[10px] text-slate-500 font-inter uppercase tracking-tighter opacity-50">
            Une seule connexion requise pour libérer le savoir.
          </p>
        </div>
      </div>
    );
  }

  // Si identifié, on affiche l'Oracle
  return children;
}