import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

// Componente di Successo (DEVE ESSERE PRESENTE)
const SuccessPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mt-4">Richiesta Inviata con Successo!</h1>
        <p className="text-slate-600 mt-3">
            La tua richiesta è stata registrata. Torna alla home.
        </p>
        {/* L'href DEVE essere /#/ per tornare correttamente con HashRouter */}
        <a href="/#/" className="mt-6 inline-block bg-sky-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-sky-700 transition-colors">
            Torna alla Home
        </a>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white text-slate-900">
        <Routes>
          {/* ROTTA OBBLIGATORIA: intercetta l'URL del form dopo la correzione */}
          <Route path="/success" element={<SuccessPage />} /> 
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;