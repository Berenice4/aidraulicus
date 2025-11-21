import { createClient } from '@supabase/supabase-js';

// Helper per recuperare le variabili d'ambiente in modo sicuro tra diversi ambienti (Vite, Create React App, etc.)
const getEnvVar = (key: string): string => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

const envUrl = getEnvVar('VITE_SUPABASE_URL');
const envKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Se l'URL manca, usiamo un placeholder per evitare che createClient lanci un errore sincrono
// che bloccherebbe l'intero rendering dell'app (White Screen of Death).
if (!envUrl || !envKey) {
  console.warn(
    "⚠️ Supabase non configurato. Assicurati di impostare VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nel tuo file .env o nelle impostazioni di Netlify."
  );
}

// Usa valori placeholder se mancanti per permettere all'app di caricarsi (le chiamate auth falliranno poi, ma la UI sarà visibile)
const supabaseUrl = envUrl || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = envKey || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);