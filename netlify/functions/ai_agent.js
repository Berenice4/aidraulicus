// netlify/functions/ai_agent.js

// Per connettersi a Supabase devi usare la libreria @supabase/supabase-js
// Aggiungi questo all'inizio del tuo codice se usi un bundler o importalo.
// Per semplicità, in una demo Netlify Function, potresti anche usare un fetch
// diretto o inizializzare il client Supabase.

exports.handler = async (event, context) => {
  // 1. Prendi i dati dalla richiesta (l'input dell'utente)
  const data = JSON.parse(event.body);

  // 2. Simula l'interazione AI e la decisione
  let risultato = "Non è stato possibile completare la chiamata.";
  const successo = Math.random() > 0.3; // 70% di successo per la demo!

  if (successo) {
    risultato = `Chiamata completata in 45 secondi. Il problema del cliente (${data.problema}) è stato risolto dall'Agente Virtuale.`;
  } else {
    risultato = `Il cliente ha chiesto di parlare con un umano. Tempo di attesa: 2 minuti.`;
  }

  // 3. Salva l'interazione su Supabase (se necessario)
  // Per questa demo, invii solo il risultato al front-end

  // 4. Ritorna il risultato al front-end
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: successo ? "Risolto dall'AI" : "Escalation Umana",
      message: risultato
    }),
  };
};