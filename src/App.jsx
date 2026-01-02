import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Vérifie bien le chemin ici
import AuthGuard from './components/AuthGuard';
import Oracle from './components/Oracle';

function App() {
  return (
    <Router>
      <Routes>
       
        
        

        {/* 2. L'Oracle (Protégé par l'identification UPPA) */}
        <Route 
          path="/oracle" 
          element={
            <AuthGuard>
              <Oracle />
            </AuthGuard>
          } 
        />
        
        {/* Redirection automatique si la page n'existe pas */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;