import React from 'react';
import { Wrench } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-secondary tracking-tight">
              AIdraulicus
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#demo" className="text-slate-600 hover:text-primary font-medium transition-colors">Prova Demo</a>
            <a href="#features" className="text-slate-600 hover:text-primary font-medium transition-colors">Funzionalità</a>
            <a href="#contact" className="text-slate-600 hover:text-primary font-medium transition-colors">Contatta Agenzia</a>
          </div>
          <div className="flex items-center">
             <a href="#demo" className="bg-secondary text-white px-5 py-2 rounded-full font-semibold hover:bg-slate-800 transition-all">
               Prenota Servizio
             </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;