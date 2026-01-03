import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import AuthGuard from './components/AuthGuard';
import SearchPortal from './components/SearchPortal/SearchPortal';

/**
 * Composant principal de navigation.
 * Le ton institutionnel impose une structure de routage claire.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Accueil public */}
        <Route path="/" element={<HomePage />} />

        {/* Espace de recherche protégé. 
          L'accès est conditionné par le composant AuthGuard.
        */}
        <Route 
          path="/oracle" 
          element={
            <AuthGuard>
              <SearchPortal />
            </AuthGuard>
          } 
        />

        {/* Redirection des erreurs 404 vers l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;