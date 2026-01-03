import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import BetaBadge from './BetaBadge';

export default function HomePage() {
  const navigate = useNavigate();

  // Définition de la variable pour l'effet brillant (Or UPPA)
  const shinyTextClass = "font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#f7e3a3] to-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]";

  return (
    /* md:h-screen + md:overflow-hidden = Bloqué sur PC */
    /* min-h-screen + overflow-y-auto = Scrollable sur Mobile */
    <div className="min-h-screen md:h-screen w-full bg-[#020617] text-white overflow-y-auto md:overflow-hidden relative font-inter flex flex-col justify-between px-4 md:px-8">
      
      {/* BACKGROUNDS LUMINEUX */}
      <div className="absolute top-[-5%] left-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER */}
      <nav className="relative z-10 flex flex-col md:flex-row justify-between items-center py-6 md:h-[12vh] max-w-7xl mx-auto w-full gap-4">
        <div className="text-2xl md:text-3xl font-cinzel font-bold tracking-tighter">
          PROMÉTHÉE<span className="text-[#D4AF37]">.</span>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow max-w-6xl mx-auto text-center gap-6 md:gap-8 py-8 md:py-0">
        
        

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl lg:text-8xl font-cinzel font-bold leading-tight tracking-tighter"
        >
          L'Excellence par<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3a3] to-[#D4AF37] drop-shadow-2xl">
            le Partage.
          </span>
        </motion.h1>

        <p className="text-slate-400 text-sm md:text-xl max-w-3xl font-light leading-relaxed px-2">
          Centralisation des <span className={shinyTextClass}>archives officielles</span> de l'Université de Pau et des Pays de l'Adour. 
          Une <span className={shinyTextClass}>interface optimisée</span> pour faciliter l'accès aux annales de l'université et <span className={shinyTextClass}>maximiser la réussite des étudiants</span>.
        </p>

        <button 
          onClick={() => navigate('/oracle')} 
          className="w-full md:w-auto group relative px-12 py-4 md:py-5 bg-[#D4AF37] text-black rounded-full font-bold shadow-2xl flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95"
        >
          <span className="font-cinzel tracking-widest uppercase text-xs md:text-base">Accéder aux annales</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* GRILLE TECHNIQUE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full mt-8">
          <FeatureCard 
            icon={<BookOpen size={20} />} 
            title="Indexation" 
            desc="Base exhaustive répertoriant les archives par facultés et départements de l'UPPA." 
          />
          <FeatureCard 
            icon={<Clock size={20} />} 
            title="Fluidité" 
            desc="Moteur de recherche multicritères conçu pour une localisation instantanée." 
          />
          <FeatureCard 
            icon={<ShieldCheck size={20} />} 
            title="Sécurité" 
            desc="Infrastructure réservée exclusivement à la communauté universitaire authentifiée." 
          />
        </div>
      </main>

      {/* FOOTER JURIDIQUE */}
      {/* FOOTER - Mention Juridique, Accès Restreint & Copyright */}
<footer className="relative z-10 w-full max-w-7xl mx-auto py-4 border-t border-white/10 flex flex-col gap-2">
  <div className="flex justify-between items-center text-[#D4AF37] font-cinzel font-bold tracking-widest text-[10px] md:text-xs uppercase">
    <span>© 2026 PROMÉTHÉE</span>
  </div>
  
  <p className="text-slate-500 text-[9px] md:text-[11px] leading-tight font-light text-justify">
    <span className="text-slate-400 font-bold uppercase text-[8px] mr-1 underline text-glow-gold">Avis de Non-Responsabilité :</span> 
    La plateforme Prométhée est un outil à but strictement pédagogique, non lucratif et non commercial. Ce service vise exclusivement à faciliter l'accès aux archives universitaires pour les étudiants de l'UPPA dans le cadre de leur préparation aux examens. 
    <strong> L'accès est strictement réservé aux seuls détenteurs d'identifiants institutionnels valides, garantissant un usage sécurisé et restreint à la communauté universitaire. Tout détournement des contenus ou des fonctionnalités à des fins étrangères au cadre académique défini est formellement interdit.</strong> 
    En aucun cas ce projet n'a vocation à porter atteinte aux droits d'auteur ou à la propriété intellectuelle des documents répertoriés. Le contenu est mis à disposition pour valoriser le patrimoine académique et ne peut être vendu, loué ou distribué de manière abusive.
  </p>
</footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl hover:border-[#D4AF37]/30 transition-all group">
      <div className="mb-3 text-[#D4AF37] bg-[#D4AF37]/10 w-fit p-3 rounded-xl group-hover:rotate-12 transition-transform">
        {icon}
      </div>
      <h3 className="text-sm md:text-base font-cinzel font-bold mb-2 text-white">{title}</h3>
      <p className="text-slate-500 text-[11px] md:text-xs leading-relaxed font-light">{desc}</p>
    </div>
  );
}