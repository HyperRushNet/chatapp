import sqlite3 from 'sqlite3';

// Open de SQLite database
const db = new sqlite3.Database('./db/chatapp.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Fout bij het openen van de database:', err.message);
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
  if (req.method === 'POST') {
    const { peerId, data } = req.body;
    const timestamp = new Date().toLocaleTimeString();

    // Bewaar het signaal in de database, standaard status is 'unread'
    const stmt = db.prepare("INSERT INTO signals (peerId, type, message, timestamp, status) VALUES (?, ?, ?, ?, ?)");
    stmt.run(peerId, data.type, data.message, timestamp, 'unread', function(err) {
      if (err) {
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
        return res.status(500).json({ error: 'Error retrieving signal' });
      }

      // Als het bericht 'unread' is, update dan de status naar 'read'
      if (row && row.status === 'unread') {
        const updateStmt = db.prepare("UPDATE signals SET status = ? WHERE id = ?");
        updateStmt.run('read', row.id, (err) => {
          if (err) {
            console.error('Error updating message status:', err.message);
          }
        });
      }

      res.status(200).json({ signal: row });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
