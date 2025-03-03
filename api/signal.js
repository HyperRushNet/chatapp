// api/signal.js
let signalingData = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Voeg signaalgegevens toe
    signalingData.push(req.body);
    res.status(200).json({ message: 'Signal saved' });
  } else if (req.method === 'GET') {
    // Geef signaalgegevens terug
    res.status(200).json(signalingData);
  }
}
