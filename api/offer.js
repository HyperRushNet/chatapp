import sqlite3 from 'sqlite3';

// Open de SQLite database
const db = new sqlite3.Database('./db/chatapp.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Fout bij het openen van de database:', err.message);
  } else {
    console.log('Database succesvol geopend');
  }
});

// Functie om oude berichten (ouder dan 7 dagen) te verwijderen
function deleteOldMessages() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 dagen geleden
  const deleteQuery = "DELETE FROM signals WHERE timestamp < ?";

  db.run(deleteQuery, [sevenDaysAgo], function(err) {
    if (err) {
      console.error('Fout bij het verwijderen van oude berichten:', err.message);
    } else {
      console.log(`${this.changes} oude berichten verwijderd.`);
    }
  });
}

// Roep de deleteOldMessages functie aan om oude berichten te verwijderen bij elke request
deleteOldMessages();

export default async function handler(req, res) {
  // Voeg CORS headers toe om verzoeken van andere domeinen toe te staan
  res.setHeader('Access-Control-Allow-Origin', '*'); // Dit staat verzoeken van elke domein toe
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // Sta GET en POST-methoden toe
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Sta de Content-Type header toe

  // Als de HTTP-methode OPTIONS is, geef dan een lege reactie terug
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { peerId, data } = req.body;
    const timestamp = new Date().toLocaleTimeString();

    // Bewaar het signaal in de database, standaard status is 'unread'
    const stmt = db.prepare("INSERT INTO signals (peerId, type, message, timestamp, status) VALUES (?, ?, ?, ?, ?)");
    stmt.run(peerId, data.type, data.message, timestamp, 'unread', function(err) {
      if (err) {
        console.error('Error storing signal in database:', err.message); // Log the error
        return res.status(500).json({ error: 'Error storing signal in database' });
      }

      res.status(200).json({
        message: 'Signal received and stored',
        peerId,
        id: this.lastID,
      });
    });
    stmt.finalize();
  } else if (req.method === 'GET') {
    const { peerId } = req.query;

    // Haal het laatste signaal op uit de database en stel de status in op 'read'
    db.get("SELECT * FROM signals WHERE peerId = ? ORDER BY id DESC LIMIT 1", [peerId], (err, row) => {
      if (err) {
        console.error('Error retrieving signal:', err.message); // Log the error
        return res.status(500).json({ error: 'Error retrieving signal' });
      }

      if (row) {
        // Verwijder het bericht nadat het is gelezen
        const deleteStmt = db.prepare("DELETE FROM signals WHERE id = ?");
        deleteStmt.run(row.id, (err) => {
          if (err) {
            console.error('Error deleting message:', err.message); // Log the error
          }
        });

        res.status(200).json({ signal: row });
      } else {
        res.status(200).json({ message: 'No signal found for this peer' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
