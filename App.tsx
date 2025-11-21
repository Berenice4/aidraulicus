import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

// Nuovo componente per il successo del form
const SuccessPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg mx-auto">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-3xl font-bold text-slate-900 mt-4">Richiesta Inviata con Successo!</h1>
        <p className="text-slate-600 mt-3">
            Grazie per aver contattato AIdraulicus. Ti contatteremo il prima possibile.
        </p>
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
          {/* Nuova rotta per gestire il successo del form */}
          <Route path="/success" element={<SuccessPage />} /> 
          {/* La rotta principale */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;