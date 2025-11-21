// Estratto da App.tsx: 
// Controlla che il tuo App.tsx sia così.

const SuccessPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg mx-auto">
        {/* ... (SVG icon) ... */}
        <h1 className="text-3xl font-bold text-slate-900 mt-4">Richiesta Inviata con Successo!</h1>
        <p className="text-slate-600 mt-3">
            Grazie! La tua richiesta è stata ricevuta (Simulazione).
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
      {/* ... */}
        <Routes>
          <Route path="/success" element={<SuccessPage />} /> 
          <Route path="/" element={<LandingPage />} />
        </Routes>
      {/* ... */}
    </HashRouter>
  );
};
// ...