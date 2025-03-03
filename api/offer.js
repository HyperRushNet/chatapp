import sqlite3 from 'sqlite3';

// Open de SQLite database
const db = new sqlite3.Database('./db/chatapp.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Fout bij het openen van de database:', err.message);
  }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { peerId, data } = req.body;
    const timestamp = new Date().toLocaleTimeString();

    const stmt = db.prepare("INSERT INTO signals (peerId, type, message, timestamp) VALUES (?, ?, ?, ?)");
    stmt.run(peerId, data.type, data.message, timestamp, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error storing signal in database' });
      }
      // Zorg ervoor dat je de database sluit na de operatie
      stmt.finalize();  // sluit de statement
      db.close();  // sluit de databaseverbinding
      res.status(200).json({
        message: 'Signal received and stored',
        peerId,
        id: this.lastID,
      });
    });
  } else if (req.method === 'GET') {
    const { peerId } = req.query;

    // Haal het laatste signaal op uit de database
    db.get("SELECT * FROM signals WHERE peerId = ? ORDER BY id DESC LIMIT 1", [peerId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error retrieving signal' });
      }
      if (row) {
        res.status(200).json({ signal: row });
      } else {
        res.status(200).json({ message: 'No signal found for this peer' });
      }
      db.close();  // Sluit de database na het ophalen van gegevens
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
