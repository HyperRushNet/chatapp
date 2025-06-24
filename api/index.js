const signals = new Map();
const SIGNAL_TTL = 60000;

function cleanupSignals() {
  const now = Date.now();
  for (const [key, signal] of signals) {
    if (signal.timestamp < now - SIGNAL_TTL) {
      signals.delete(key);
    }
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { peerId, controllerId, type, message, timestamp } = req.body;
    if (!peerId || !controllerId || !type || !message || !timestamp) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const key = `${peerId}:${controllerId}:${type}`;
    signals.set(key, { peerId, controllerId, type, message, timestamp });

    cleanupSignals();
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const { peerId, controllerId } = req.query;
    if (!peerId) {
      return res.status(400).json({ error: 'peerId required' });
    }

    cleanupSignals();
    const matchingSignals = [];
    for (const [key, signal] of signals) {
      if (signal.peerId === peerId && (!controllerId || signal.controllerId === controllerId)) {
        matchingSignals.push({
          controllerId: signal.controllerId,
          type: signal.type,
          message: signal.message,
          timestamp: signal.timestamp
        });
      }
    }

    return res.status(200).json(matchingSignals);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
