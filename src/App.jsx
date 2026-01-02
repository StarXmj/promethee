import AuthGuard from './components/AuthGuard';
import Oracle from './components/Oracle';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background interactif (Dégradé divin) */}
      <div className="fixed inset-0 bg-[#020617] z-0"></div>
      
      {/* Halo de lumière central */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[#D4AF37]/5 blur-[150px] rounded-full z-0 pointer-events-none"></div>
      
      {/* Texture de grain/poussière d'étoiles */}
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>

      {/* Contenu principal */}
      <main className="relative z-10">
        <AuthGuard>
        <Oracle />
        </AuthGuard>
      </main>

      {/* Footer minimaliste */}
      <footer className="relative z-10 py-12 text-center">
        <div className="h-[1px] w-24 bg-[#D4AF37]/20 mx-auto mb-6"></div>
        <p className="text-[#D4AF37]/20 font-cinzel text-[10px] tracking-[0.5em] uppercase">
          Prométhée • L'accès universel au savoir
        </p>
      </footer>
    </div>
  )
}

export default App