// In-memory opslag voor berichten per peer
let signals = {}; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Ontvang bericht van een peer
    try {
      const signalData = req.body;

      // Sla het bericht op voor de peer in het geheugen
      signals[signalData.peerId] = signalData;

      console.log(`Signal ontvangen voor ${signalData.peerId}: `, signalData);

      res.status(200).json({ message: 'Signal ontvangen', data: signalData });
    } catch (error) {
      res.status(500).json({ error: 'Fout bij het verwerken van signalen' });
    }
  } else if (req.method === 'GET') {
    // Haal het laatste signaal op voor een bepaalde peer
    try {
      const { peerId } = req.query;

      if (signals[peerId]) {
        res.status(200).json({ signal: signals[peerId] }); // Stuur het signaal terug
      } else {
        res.status(200).json({ message: 'Geen signalen voor deze peer' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Fout bij het ophalen van signaal' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
