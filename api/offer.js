// /api/offer.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { peerId, signal } = req.body; // De signalen die je van de client ontvangt

    try {
      // Hier kun je de logica implementeren om het signaal naar de juiste peer door te sturen
      console.log('Received signal:', peerId, signal);

      // Bijvoorbeeld, sla de signalen tijdelijk op of gebruik websockets om ze door te sturen naar de juiste peer
      // Dit is een voorbeeld en kan worden aangepast aan je specifieke implementatie

      res.status(200).json({ message: 'Signal received successfully', signal });
    } catch (error) {
      console.error('Error processing offer:', error);
      res.status(500).json({ message: 'Error processing signal', error });
    }
  } else {
    // Als de request niet een POST is, geef dan 405 Method Not Allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
