// api/signal.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const signalData = req.body;
      // Verwerk het ontvangen signaal, bijvoorbeeld voor WebRTC
      res.status(200).json({ message: 'Signal received', data: signalData });
    } catch (error) {
      res.status(500).json({ error: 'Error processing signal' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
