// /api/signal.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { peerId, message } = req.body;

    try {
      console.log('Received signal message:', peerId, message);

      // Dit kan een andere vorm van signalering zijn die je bijvoorbeeld voor chatberichten of status gebruikt
      res.status(200).json({ message: 'Signal message received successfully', message });
    } catch (error) {
      console.error('Error processing signal message:', error);
      res.status(500).json({ message: 'Error processing signal', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
