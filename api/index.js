// In-memory opslag voor signalen
let signals = {};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { peerId, controllerId, type, message, timestamp } = req.body;

      if (!peerId || !controllerId || !type || !message || !timestamp) {
        return res.status(400).json({ error: 'Ontbrekende velden' });
      }

      // Initialiseer opslag voor deze peerId als die nog niet bestaat
      if (!signals[peerId]) {
        signals[peerId] = {};
      }

      // Sla signaal op met unieke sleutel gebaseerd op controllerId en type
      const key = `${controllerId}:${type}`;
      signals[peerId][key] = { peerId, controllerId, type, message, timestamp };

      // Verwijder signaal na 60 seconden
      setTimeout(() => {
        if (signals[peerId] && signals[peerId][key]) {
          delete signals[peerId][key];
          if (Object.keys(signals[peerId]).length === 0) {
            delete signals[peerId];
          }
          console.log(`Signaal voor peer ${peerId}, controller ${controllerId}, type ${type} verwijderd na 60 seconden`);
        }
      }, 60000);

      console.log(`Signaal ontvangen voor peer ${peerId}, controller ${controllerId}:`, { type, message });

      return res.status(200).json({ message: 'Signaal ontvangen', data: { peerId, controllerId, type, message, timestamp } });
    } catch (error) {
      console.error('Fout bij POST:', error);
      return res.status(500).json({ error: 'Fout bij het verwerken van signaal' });
    }
  } else if (req.method === 'GET') {
    try {
      const { peerId, controllerId } = req.query;

      if (!peerId) {
        return res.status(400).json({ error: 'peerId vereist' });
      }

      const matchingSignals = [];

      if (signals[peerId]) {
        // Haal alle signalen op voor deze peerId
        for (const key in signals[peerId]) {
          const signal = signals[peerId][key];
          // Filter op controllerId als opgegeven
          if (!controllerId || signal.controllerId === controllerId) {
            matchingSignals.push({
              controllerId: signal.controllerId,
              type: signal.type,
              message: signal.message,
              timestamp: signal.timestamp
            });
          }
        }
      }

      return res.status(200).json(matchingSignals);
    } catch (error) {
      console.error('Fout bij GET:', error);
      return res.status(500).json({ error: 'Fout bij het ophalen van signaal' });
    }
  } else {
    return res.status(405).json({ error: 'Methode niet toegestaan' });
  }
}
