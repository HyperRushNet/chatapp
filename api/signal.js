// api/signal.js

let signals = {}; // Opslag voor signalen per peer-id

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Ontvang signalen van een peer
    try {
      const signalData = req.body;

      // Sla signalen op gebaseerd op peer-id
      if (!signals[signalData.peerId]) {
        signals[signalData.peerId] = [];
      }

      signals[signalData.peerId].push(signalData);

      res.status(200).json({ message: 'Signal received', data: signalData });
    } catch (error) {
      res.status(500).json({ error: 'Error processing signal' });
    }
  } else if (req.method === 'GET') {
    // Haal signalen op voor een bepaalde peer-id
    try {
      const { peerId } = req.query;

      if (signals[peerId] && signals[peerId].length > 0) {
        const signalToSend = signals[peerId].shift(); // Neem het eerste signaal voor de peer
        res.status(200).json({ signal: signalToSend });
      } else {
        res.status(200).json({ message: 'No signals for this peer' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching signals' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
