import React from 'react';
import { PhoneCall, Clock, ShieldCheck } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-slate-900 pt-24 pb-32 overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Sfondo Idraulico" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Non Perdere Mai una <span className="text-primary">Perdita</span> o un <span className="text-accent">Cliente</span>.
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          Scopri il futuro del dispatching idraulico. I nostri agenti AI gestiscono appuntamenti ed emergenze 24/7, così tu puoi concentrarti sul lavoro.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <a 
            href="#demo" 
            onClick={(e) => scrollToSection(e, 'demo')}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-sky-700 md:text-lg transition-all shadow-lg shadow-sky-900/50 cursor-pointer"
          >
            <PhoneCall className="mr-2 h-5 w-5" />
            Prova Agente Vocale
          </a>
          <a 
            href="#features"
            onClick={(e) => scrollToSection(e, 'features')}
            className="inline-flex items-center justify-center px-8 py-3 border border-slate-700 text-base font-medium rounded-md text-slate-300 bg-transparent hover:bg-slate-800 md:text-lg transition-all cursor-pointer"
          >
            Scopri di Più
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700">
            <Clock className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Disponibilità 24/7</h3>
            <p className="text-slate-400">Linee di reception ed emergenza mai in pausa, per catturare ogni cliente.</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700">
            <ShieldCheck className="h-8 w-8 text-accent mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Triage Intelligente</h3>
            <p className="text-slate-400">L'instradamento intelligente separa la manutenzione ordinaria dai tubi scoppiati urgenti.</p>
          </div>
           <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700">
            <PhoneCall className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Zero Tempi di Attesa</h3>
            <p className="text-slate-400">I clienti parlano immediatamente con un agente intelligente in grado di pianificare.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;