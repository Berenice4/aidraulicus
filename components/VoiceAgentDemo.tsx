import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, PhoneOff, Loader2, Siren, Calendar, Activity } from 'lucide-react';
import { GeminiLiveService } from '../services/geminiLiveService';
import { AgentType } from '../types';

const VoiceAgentDemo: React.FC = () => {
  const [activeAgent, setActiveAgent] = useState<AgentType>(AgentType.FRONT_DESK);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const serviceRef = useRef<GeminiLiveService | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect();
      }
    };
  }, []);

  const handleStartCall = async () => {
    setIsConnecting(true);
    setError(null);
    
    const service = new GeminiLiveService();
    serviceRef.current = service;

    try {
      await service.connect(
        activeAgent,
        () => {
          // On Disconnect
          setIsConnected(false);
          setIsConnecting(false);
          setVolume(0);
        },
        (err) => {
          // On Error
          setError("Impossibile connettersi. Assicurati di avere un microfono e la chiave API configurata.");
          setIsConnecting(false);
          setIsConnected(false);
        },
        (vol) => {
          // On Volume Change
          setVolume(vol);
        }
      );
      setIsConnected(true);
      setIsConnecting(false);
    } catch (e) {
      setError("Impossibile inizializzare l'audio. Controlla i permessi.");
      setIsConnecting(false);
    }
  };

  const handleEndCall = () => {
    if (serviceRef.current) {
      serviceRef.current.disconnect();
    }
    setIsConnected(false);
    setVolume(0);
  };

  // Visualizer Bars
  const renderBars = () => {
    // Create 5 bars that react to volume
    return Array.from({ length: 5 }).map((_, i) => {
      const height = Math.min(100, Math.max(10, volume * (0.5 + Math.random()) * 2)); // Randomize slightly for effect
      return (
        <div 
          key={i}
          className={`w-3 mx-1 rounded-full transition-all duration-75 ${isConnected ? (activeAgent === AgentType.EMERGENCY ? 'bg-red-500' : 'bg-primary') : 'bg-slate-300 h-2'}`}
          style={{ height: isConnected ? `${height}%` : '10%' }}
        />
      );
    });
  };

  return (
    <div id="demo" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">Testa i Nostri Agenti AI</h2>
          <p className="text-slate-600">Seleziona una persona e avvia una conversazione in tempo reale per vedere come AIdraulicus gestisce i tuoi clienti.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row h-[500px]">
          
          {/* Sidebar / Selector */}
          <div className="w-full md:w-1/3 bg-slate-100 p-6 border-r border-slate-200 flex flex-col">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Seleziona Agente</h3>
            
            <button
              onClick={() => !isConnected && setActiveAgent(AgentType.FRONT_DESK)}
              disabled={isConnected}
              className={`p-4 rounded-xl text-left mb-4 transition-all ${
                activeAgent === AgentType.FRONT_DESK 
                  ? 'bg-white shadow-md ring-2 ring-primary' 
                  : 'hover:bg-white/50 text-slate-500'
              } ${isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center mb-2">
                <div className={`p-2 rounded-lg ${activeAgent === AgentType.FRONT_DESK ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'}`}>
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="ml-3 font-bold text-slate-800">Sara</span>
              </div>
              <p className="text-xs text-slate-500">Reception & Appuntamenti. Amichevole, organizzata, converte i lead.</p>
            </button>

            <button
              onClick={() => !isConnected && setActiveAgent(AgentType.EMERGENCY)}
              disabled={isConnected}
              className={`p-4 rounded-xl text-left transition-all ${
                activeAgent === AgentType.EMERGENCY 
                  ? 'bg-white shadow-md ring-2 ring-red-500' 
                  : 'hover:bg-white/50 text-slate-500'
              } ${isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
               <div className="flex items-center mb-2">
                <div className={`p-2 rounded-lg ${activeAgent === AgentType.EMERGENCY ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>
                  <Siren className="h-5 w-5" />
                </div>
                <span className="ml-3 font-bold text-slate-800">Michele</span>
              </div>
              <p className="text-xs text-slate-500">Pronto Intervento. Calmo, urgente, priorità alla sicurezza.</p>
            </button>

            <div className="mt-auto pt-6 border-t border-slate-200">
               <div className="flex items-center text-xs text-slate-400">
                 <Activity className="h-4 w-4 mr-2" />
                 Basato su Gemini 2.5 Flash
               </div>
            </div>
          </div>

          {/* Main Interface */}
          <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-slate-50">
             {/* Agent Avatar/Status */}
             <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${
               isConnected 
                ? (activeAgent === AgentType.EMERGENCY ? 'bg-red-100 shadow-red-200' : 'bg-sky-100 shadow-sky-200') 
                : 'bg-slate-200'
             } shadow-xl`}>
                {isConnecting ? (
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                ) : isConnected ? (
                   <div className="flex items-end h-16 space-x-1">
                     {renderBars()}
                   </div>
                ) : (
                  <div className="text-slate-400">
                    {activeAgent === AgentType.EMERGENCY ? <Siren className="h-12 w-12" /> : <Calendar className="h-12 w-12" />}
                  </div>
                )}
             </div>

             <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-secondary">
                  {isConnected ? (activeAgent === AgentType.EMERGENCY ? "Connesso all'Emergenza" : 'Connesso alla Reception') : 'Pronto a Chiamare'}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  {isConnected ? 'In ascolto...' : 'Tocca il pulsante qui sotto per avviare la simulazione.'}
                </p>
             </div>

             {error && (
               <div className="absolute top-4 px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm">
                 {error}
               </div>
             )}

             {/* Controls */}
             <div className="flex gap-4">
                {!isConnected ? (
                  <button
                    onClick={handleStartCall}
                    disabled={isConnecting}
                    className={`flex items-center px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95 ${
                      activeAgent === AgentType.EMERGENCY 
                      ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' 
                      : 'bg-primary hover:bg-sky-700 shadow-sky-900/20'
                    }`}
                  >
                    <Mic className="mr-2 h-6 w-6" />
                    Avvia Chiamata
                  </button>
                ) : (
                   <button
                    onClick={handleEndCall}
                    className="flex items-center px-8 py-4 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold text-lg shadow-lg transition-colors"
                  >
                    <PhoneOff className="mr-2 h-6 w-6" />
                    Termina Chiamata
                  </button>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgentDemo;