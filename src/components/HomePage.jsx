import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Library, Zap, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  // Animation simple pour le bouton de connexion
  const handleAuth = () => navigate('/oracle');

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-inter">
      
      {/* --- BACKGROUND ANIMÉ (Auras dorées) --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#D4AF37]/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* --- NAV BAR --- */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-cinzel font-bold tracking-tighter">
          PROMÉTHÉE<span className="text-[#D4AF37]">.</span>
        </div>
        <button 
          onClick={handleAuth} 
          className="px-6 py-2 rounded-full border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all text-xs font-bold uppercase tracking-widest text-[#D4AF37]"
        >
          Connexion
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
        
        {/* Badge animé */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2"
        >
          <Sparkles size={14} /> L'Oracle du Savoir Universitaire
        </motion.div>

        {/* Titre Principal */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-cinzel font-bold tracking-tighter mb-6 leading-tight"
        >
          Le Savoir est<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] drop-shadow-2xl">
            à Toi.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light"
        >
          Accédez instantanément aux <span className="text-white font-medium">archives sacrées</span> de l'université. Une exploration fluide à travers les stèles du savoir pour préparer vos examens.
        </motion.p>

        {/* Bouton d'Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button 
            onClick={handleAuth}
            className="group relative px-10 py-5 bg-[#D4AF37] text-black rounded-full font-bold text-lg md:text-xl flex items-center gap-4 shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-105 transition-all duration-300"
          >
            <span className="font-cinzel tracking-widest uppercase text-sm">Éveiller l'Oracle</span>
            <div className="bg-black text-[#D4AF37] p-1.5 rounded-full group-hover:rotate-[-45deg] transition-transform duration-300">
                <ArrowRight size={20} />
            </div>
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 1 }}
           className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left"
        >
            <FeatureCard 
                icon={<Library className="text-[#D4AF37]" />} 
                title="Archives Sacrées" 
                desc="Des milliers d'annales indexées et prêtes à être explorées par niveau et matière." 
            />
            <FeatureCard 
                icon={<Zap className="text-[#D4AF37]" />} 
                title="Vitesse Divine" 
                desc="Recherche instantanée grâce à l'Oracle Fuse.js. Trouvez votre bonheur en un battement de cil." 
            />
            <FeatureCard 
                icon={<ShieldCheck className="text-[#D4AF37]" />} 
                title="Accès Exclusif" 
                desc="Une plateforme sécurisée, réservée aux étudiants authentifiés par le portail UPPA." 
            />
        </motion.div>

      </main>

      <footer className="relative z-10 py-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.3em] font-cinzel">
        © 2024 Prométhée — Libérez le feu de la connaissance.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-white/5 border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all duration-500 group shadow-2xl">
            <div className="mb-6 bg-[#D4AF37]/10 w-fit p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
            <h3 className="text-xl font-cinzel font-bold mb-3 text-white tracking-wide">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">{desc}</p>
        </div>
    );
}