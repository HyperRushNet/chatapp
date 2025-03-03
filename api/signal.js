// api/signal.js
let signalingMessages = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Voeg het bericht toe aan de signaling-berichten
    signalingMessages.push(req.body);

    // Beperk het aantal berichten om opslag te minimaliseren (optioneel)
    if (signalingMessages.length > 10) {
      signalingMessages.shift(); // Verwijder het oudste bericht
    }

    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    // Verstuur de signaling-berichten naar de client
    return res.status(200).json(signalingMessages);
  }

  // Fout als de methode niet wordt ondersteund
  return res.status(405).json({ error: 'Method not allowed' });
}
