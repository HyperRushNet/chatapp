// api/signal.js

let signals = {}; // Opslag voor één signaal per peer-id

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Ontvang signalen van een peer
    try {
      const signalData = req.body;

      // Sla alleen het laatste signaal op voor elke peer
      signals[signalData.peerId] = signalData; // Vervang het oude signaal

      console.log(`Signal received for ${signalData.peerId}: `, signalData);

      res.status(200).json({ message: 'Signal received', data: signalData });
    } catch (error) {
      res.status(500).json({ error: 'Error processing signal' });
    }
  } else if (req.method === 'GET') {
    // Haal het laatste signaal op voor een bepaalde peer-id
    try {
      const { peerId } = req.query;

      if (signals[peerId]) {
        res.status(200).json({ signal: signals[peerId] }); // Stuur het laatste signaal terug
      } else {
        res.status(200).json({ message: 'No signals for this peer' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching signal' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
