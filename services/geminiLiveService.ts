import { GoogleGenAI, LiveServerMessage } from "@google/genai";
import { base64ToUint8Array, decodeAudioData, float32ToPcmBlob } from "../utils/audioUtils";
import { AgentType, SYSTEM_INSTRUCTIONS } from "../types";

export class GeminiLiveService {
  private ai: GoogleGenAI | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private outputNode: GainNode | null = null;
  private nextStartTime: number = 0;
  private sources: Set<AudioBufferSourceNode> = new Set();
  private sessionPromise: Promise<any> | null = null;
  private analyser: AnalyserNode | null = null;
  private active: boolean = false;
  private envApiKey: string | undefined;

  constructor() {
    // Recuperiamo la chiave dall'ambiente come fallback, ma non inizializziamo ancora GoogleGenAI
    // in quanto potremmo ricevere una chiave aggiornata dal backend in connect()
    let key = '';
    
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        if (import.meta.env.VITE_API_KEY) key = import.meta.env.VITE_API_KEY;
        // @ts-ignore
        else if (import.meta.env.REACT_APP_API_KEY) key = import.meta.env.REACT_APP_API_KEY;
        // @ts-ignore
        else if (import.meta.env.API_KEY) key = import.meta.env.API_KEY;
      }
    } catch (e) {
      console.warn("Errore accesso import.meta", e);
    }

    if (!key) {
      try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env) {
          // @ts-ignore
          if (process.env.VITE_API_KEY) key = process.env.VITE_API_KEY;
          // @ts-ignore
          else if (process.env.REACT_APP_API_KEY) key = process.env.REACT_APP_API_KEY;
          // @ts-ignore
          else if (process.env.API_KEY) key = process.env.API_KEY;
        }
      } catch (e) {}
    }

    this.envApiKey = key;
  }

  public async connect(
    agentType: AgentType, 
    onDisconnect: () => void, 
    onError: (err: any) => void,
    onVolumeChange: (volume: number) => void,
    providedApiKey?: string // Nuova opzione per passare la chiave dal backend
  ) {
    if (this.active) return;
    
    // Determina la chiave da usare: quella fornita dal backend ha precedenza su quella d'ambiente locale
    const finalApiKey = providedApiKey || this.envApiKey;

    // Controllo esplicito della chiave prima di iniziare
    if (!finalApiKey || finalApiKey === 'MISSING_KEY') {
      const error = new Error(
        "API Key mancante. Verifica che il backend restituisca una chiave o che 'VITE_API_KEY' sia impostata."
      );
      onError(error);
      return;
    }

    // Inizializza l'istanza AI con la chiave corretta
    this.ai = new GoogleGenAI({ apiKey: finalApiKey });

    this.active = true;

    try {
      // Inizializzazione Audio Context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
      this.outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
      
      // Resume è necessario per i browser moderni che bloccano l'audio autoplay
      await this.inputAudioContext.resume();
      await this.outputAudioContext.resume();

      this.outputNode = this.outputAudioContext.createGain();
      this.outputNode.connect(this.outputAudioContext.destination);

      // Accesso al Microfono
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
      
      // Analizzatore per la visualizzazione (barre animate)
      this.analyser = this.inputAudioContext.createAnalyser();
      this.source.connect(this.analyser);
      this.analyser.fftSize = 256;
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      
      // Loop per monitorare il volume
      const checkVolume = () => {
        if (!this.active || !this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        onVolumeChange(average / 255);
        requestAnimationFrame(checkVolume);
      };
      checkVolume();

      // Setup Processore Audio per inviare dati a Gemini
      this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
      
      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: ['AUDIO'] as any, // Usa stringa 'AUDIO' per evitare problemi di Enum
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: agentType === AgentType.EMERGENCY ? 'Puck' : 'Kore' } }
          },
          systemInstruction: SYSTEM_INSTRUCTIONS[agentType],
        },
        callbacks: {
            onopen: () => {
                console.log("Connessione WebSocket stabilita");
                if (!this.inputAudioContext || !this.source || !this.processor) return;
                
                this.source.connect(this.processor);
                this.processor.connect(this.inputAudioContext.destination);
                
                this.processor.onaudioprocess = (e) => {
                    if (!this.active) return;
                    const inputData = e.inputBuffer.getChannelData(0);
                    const pcmBlob = float32ToPcmBlob(inputData);
                    
                    // Invia l'audio solo quando la sessione è pronta
                    if (this.sessionPromise) {
                        this.sessionPromise.then(session => {
                             session.sendRealtimeInput({ media: pcmBlob });
                        }).catch(err => {
                            console.error("Errore invio audio:", err);
                        });
                    }
                };
            },
            onmessage: async (msg: LiveServerMessage) => {
                if (!this.active) return;
                
                // Gestione audio in entrata (dal modello)
                const data = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (data && this.outputAudioContext && this.outputNode) {
                    try {
                        const audioData = base64ToUint8Array(data);
                        // Gestione timing per evitare sovrapposizioni
                        this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
                        
                        const audioBuffer = await decodeAudioData(
                            audioData, 
                            this.outputAudioContext, 
                            24000
                        );
                        
                        const source = this.outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(this.outputNode);
                        
                        source.start(this.nextStartTime);
                        this.nextStartTime += audioBuffer.duration;
                        
                        this.sources.add(source);
                        source.onended = () => {
                            this.sources.delete(source);
                        };
                    } catch (e) {
                        console.error("Errore decoding audio:", e);
                    }
                }

                // Gestione interruzioni
                if (msg.serverContent?.interrupted) {
                    console.log("Interruzione rilevata");
                    this.sources.forEach(s => {
                        try { s.stop(); } catch (e) {}
                    });
                    this.sources.clear();
                    this.nextStartTime = 0;
                }
            },
            onclose: () => {
                console.log("Sessione chiusa");
                this.disconnect();
                onDisconnect();
            },
            onerror: (err: any) => {
                console.error("Errore sessione:", err);
                onError(err);
                this.disconnect();
            }
        }
      };

      // @ts-ignore - this.ai is guaranteed to be set above
      this.sessionPromise = this.ai.live.connect(config);
      // Attendi che la connessione sia effettivamente stabilita
      await this.sessionPromise;

    } catch (error) {
      console.error("Errore durante connect():", error);
      this.active = false;
      onError(error);
    }
  }

  public disconnect() {
    if (!this.active) return;
    this.active = false;

    // Pulizia Audio
    if (this.processor) {
        this.processor.disconnect();
        this.processor.onaudioprocess = null;
        this.processor = null;
    }
    
    if (this.source) {
        this.source.disconnect();
        this.source = null;
    }

    if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
    }

    if (this.inputAudioContext) {
        this.inputAudioContext.close();
        this.inputAudioContext = null;
    }

    if (this.outputAudioContext) {
        this.outputAudioContext.close();
        this.outputAudioContext = null;
    }
    
    this.sources.forEach(s => {
        try { s.stop(); } catch(e) {}
    });
    this.sources.clear();
    this.nextStartTime = 0;

    // Pulizia Sessione
    if (this.sessionPromise) {
        this.sessionPromise = null;
    }
    
    // Reset dell'istanza AI per permettere riconnessione pulita con potenziali nuove chiavi
    this.ai = null;
  }
}