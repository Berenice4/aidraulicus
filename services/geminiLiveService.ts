import { GoogleGenAI, LiveServerMessage } from "@google/genai";
import { base64ToUint8Array, decodeAudioData, float32ToPcmBlob } from "../utils/audioUtils";
import { AgentType, SYSTEM_INSTRUCTIONS } from "../types";

export class GeminiLiveService {
  private ai: GoogleGenAI;
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
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.API_KEY;
    this.ai = new GoogleGenAI({ apiKey: this.apiKey || '' });
  }

  public async connect(
    agentType: AgentType, 
    onDisconnect: () => void, 
    onError: (err: any) => void,
    onVolumeChange: (volume: number) => void
  ) {
    if (this.active) return;
    
    // Immediate check for API Key
    if (!this.apiKey) {
      const error = new Error("API Key mancante. Configura API_KEY nelle variabili d'ambiente.");
      onError(error);
      return;
    }

    this.active = true;

    try {
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
      this.outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
      
      // Critical: Resume contexts to ensure they are active after user gesture
      await this.inputAudioContext.resume();
      await this.outputAudioContext.resume();
      
      this.outputNode = this.outputAudioContext.createGain();
      this.outputNode.connect(this.outputAudioContext.destination);

      // Analyser for visuals
      this.analyser = this.outputAudioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.outputNode.connect(this.analyser);

      // Setup Visualization loop
      this.startVolumeMonitoring(onVolumeChange);

      // Get Microphone Access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine voice explicitly
      const voiceName = agentType === AgentType.EMERGENCY ? 'Fenrir' : 'Kore';

      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log("Session Opened");
            this.startAudioInputStreaming();
          },
          onmessage: (message: LiveServerMessage) => this.handleServerMessage(message),
          onclose: () => {
            console.log("Session Closed");
            this.disconnect();
            onDisconnect();
          },
          onerror: (err: any) => {
            console.error("Session Error:", err);
            onError(err);
            this.disconnect();
          }
        },
        config: {
          // Use string 'AUDIO' to avoid runtime Enum issues
          responseModalities: ['AUDIO' as any], 
          systemInstruction: SYSTEM_INSTRUCTIONS[agentType],
          speechConfig: {
            voiceConfig: { 
              prebuiltVoiceConfig: { 
                voiceName: voiceName
              } 
            }
          }
        }
      };

      // Create and AWAIT the session to catch initial connection errors (403, 400, etc.)
      this.sessionPromise = this.ai.live.connect(config);
      await this.sessionPromise;

    } catch (error) {
      console.error("Failed to connect:", error);
      onError(error);
      this.disconnect();
    }
  }

  private startAudioInputStreaming() {
    if (!this.inputAudioContext || !this.mediaStream || !this.sessionPromise) return;

    this.source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
    this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      if (!this.active) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = float32ToPcmBlob(inputData);

      this.sessionPromise?.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    this.source.connect(this.processor);
    this.processor.connect(this.inputAudioContext.destination);
  }

  private async handleServerMessage(message: LiveServerMessage) {
    const serverContent = message.serverContent;

    // Handle interruption
    if (serverContent?.interrupted) {
      console.log("Model Interrupted");
      this.stopAllSources();
      this.nextStartTime = 0;
    }

    // Handle Audio Output
    const base64Audio = serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (base64Audio && this.outputAudioContext && this.outputNode) {
      try {
        const audioData = base64ToUint8Array(base64Audio);
        this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
        
        const audioBuffer = await decodeAudioData(audioData, this.outputAudioContext);
        
        const source = this.outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.outputNode);
        
        source.addEventListener('ended', () => {
          this.sources.delete(source);
        });

        source.start(this.nextStartTime);
        this.nextStartTime += audioBuffer.duration;
        this.sources.add(source);
      } catch (e) {
        console.error("Error decoding audio", e);
      }
    }
  }

  private stopAllSources() {
    this.sources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Ignore errors if source already stopped
      }
    });
    this.sources.clear();
  }

  private startVolumeMonitoring(onVolumeChange: (vol: number) => void) {
    const update = () => {
      if (!this.active) return;
      if (this.analyser) {
        try {
          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          this.analyser.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          onVolumeChange(average); // Scale 0-255
        } catch (e) {
          // Analyser might be disconnected
        }
      }
      requestAnimationFrame(update);
    };
    update();
  }

  public disconnect() {
    this.active = false;
    this.stopAllSources();
    
    if (this.processor && this.source) {
      try {
        this.source.disconnect();
        this.processor.disconnect();
      } catch (e) { /* ignore disconnect errors */ }
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }

    if (this.inputAudioContext && this.inputAudioContext.state !== 'closed') {
       this.inputAudioContext.close().catch(e => console.error(e));
    }
    if (this.outputAudioContext && this.outputAudioContext.state !== 'closed') {
       this.outputAudioContext.close().catch(e => console.error(e));
    }

    // Close session if possible (SDK specific)
    this.sessionPromise?.then(session => {
        try {
           // session.close() if available
        } catch(e) {}
    });

    this.inputAudioContext = null;
    this.outputAudioContext = null;
    this.mediaStream = null;
    this.processor = null;
    this.source = null;
    this.outputNode = null;
    this.analyser = null;
    this.sessionPromise = null;
  }
}