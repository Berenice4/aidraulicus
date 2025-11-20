import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import VoiceAgentDemo from '../components/VoiceAgentDemo';
import Footer from '../components/Footer';
import { CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <VoiceAgentDemo />
        
        {/* Value Proposition Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-secondary mb-4">Perché gli Idraulici Scelgono Voice AI</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Smetti di perdere entrate per chiamate perse. I nostri agenti AI sono addestrati specificamente sulla terminologia idraulica e sui protocolli di urgenza.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Idraulico con tablet" 
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="space-y-6">
                {[
                  "Scalabilità Istantanea: Gestisci 1 chiamata o 100 chiamate contemporaneamente durante le stagioni delle tempeste.",
                  "Integrazione CRM: Prenota automaticamente direttamente nel tuo software di pianificazione esistente.",
                  "Triage Intelligente: L'AI conosce la differenza tra un rubinetto che gocciola e un tubo scoppiato.",
                  "Costo Efficace: Una frazione del costo di un servizio di risposta umana 24/7."
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1 mr-3" />
                    <p className="text-lg text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-primary py-16">
           <div className="max-w-4xl mx-auto text-center px-4">
             <h2 className="text-3xl font-bold text-white mb-6">Pronto ad Automatizzare il Tuo Dispatch?</h2>
             <p className="text-sky-100 text-lg mb-8">
               Unisciti alle principali aziende idrauliche che usano AIdraulicus per aumentare i tassi di prenotazione e la soddisfazione del cliente.
             </p>
             <button className="bg-white text-primary font-bold py-3 px-8 rounded-full hover:bg-sky-50 transition-colors shadow-lg">
               Inizia Oggi
             </button>
           </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;