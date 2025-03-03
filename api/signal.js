let offers = {};
let answers = {};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { type, sdp, id } = req.body;
    
    if (type === 'offer') {
      offers[id] = sdp; // Save offer in memory
      res.status(200).json({ message: 'Offer saved', id });
    } else if (type === 'answer') {
      answers[id] = sdp; // Save answer in memory
      res.status(200).json({ message: 'Answer saved', id });
    } else {
      res.status(400).json({ message: 'Invalid type' });
    }
  } else if (req.method === 'GET') {
    const { id, type } = req.query;
    
    if (type === 'offer') {
      const offer = offers[id];
      if (offer) {
        res.status(200).json({ sdp: offer });
      } else {
        res.status(404).json({ message: 'Offer not found' });
      }
    } else if (type === 'answer') {
      const answer = answers[id];
      if (answer) {
        res.status(200).json({ sdp: answer });
      } else {
        res.status(404).json({ message: 'Answer not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid type' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
