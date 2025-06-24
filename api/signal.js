// api/signal.js
const signals = new Map(); // In-memory opslag voor signalen
const SIGNAL_TTL = 60 * 1000; // 1 minuut TTL voor signalen

// Helper om oude signalen te verwijderen
function cleanupSignals() {
  const now = Date.now();
  for (const [key, signal] of signals) {
    if (now - signal.timestamp > SIGNAL_TTL) {
      signals.delete(key);
    }
  }
}

module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { peerId, controllerId, type, message, timestamp } = req.body;

    if (!peerId || !controllerId || !type || !message || !timestamp) {
      return res.status(400).json({ error: 'Ontbrekende velden' });
    }

    // Unieke sleutel voor elk signaal
    const key = `${peerId}:${controllerId}:${type}`;
    signals.set(key, { peerId, controllerId, type, message, timestamp });

    // Schoon oude signalen op
    cleanupSignals();

    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const { peerId, controllerId } = req.query;

    if (!peerId) {
      return res.status(400).json({ error: 'peerId vereist' });
    }

    cleanupSignals();
    const matchingSignals = [];

    // Haal signalen op die overeenkomen met peerId en optioneel controllerId
    for (const [key, signal] of signals) {
      if (signal.peerId === peerId && (!controllerId || signal.controllerId === controllerId)) {
        matchingSignals.push({ controllerId: signal.controllerId, type: signal.type, message: signal.message, timestamp: signal.timestamp });
      }
    }

    return res.status(200).json(matchingSignals);
  }

  return res.status(405).json({ error: 'Methode niet toegestaan' });
};
