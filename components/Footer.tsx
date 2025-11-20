import React from 'react';
import { Wrench } from 'lucide-react';

const Footer: React.FC = () => {
  const handleDemoLink = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    alert(`${name} - Questa funzionalità è simulata per la demo.`);
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-slate-800 p-2 rounded-lg mr-3">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xl font-bold">AIdraulicus</span>
              <p className="text-xs text-slate-400">Gestito da Voice AI Agency</p>
            </div>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" onClick={(e) => handleDemoLink(e, 'Privacy Policy')} className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" onClick={(e) => handleDemoLink(e, 'Termini di Servizio')} className="text-slate-400 hover:text-white text-sm transition-colors">Termini di Servizio</a>
            <a href="#contact" onClick={scrollToContact} className="text-slate-400 hover:text-white text-sm transition-colors">Contatta Supporto</a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-800 pt-8">
          &copy; {new Date().getFullYear()} Voice AI Agency. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
};

export default Footer;