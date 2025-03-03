// api/offer.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { peerId, data } = req.body;

    if (data.type === 'offer') {
      // Ontvang de offer en bewaar het in je backend (in-memory of een database)
      // Hier zou je bijvoorbeeld de SDP kunnen opslaan en naar andere peers sturen

      console.log('Received offer:', data.sdp);
      
      // Hier kun je de response sturen naar de peer
      res.status(200).json({
        message: 'Offer received and processed',
        peerId,
        sdp: 'SDP response here',
      });
    } else if (data.type === 'candidate') {
      // Verwerk de ICE candidate en stuur deze door naar andere peers
      console.log('Received candidate:', data.candidate);
      res.status(200).json({ message: 'Candidate processed' });
    } else {
      res.status(400).json({ message: 'Invalid data type' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
