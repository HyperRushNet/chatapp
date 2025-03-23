import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { promisify } from 'util';

// Open de SQLite database
const dbPromise = open({
  filename: './db/chatapp.db',
  driver: sqlite3.Database
});

// Functie om oude berichten (ouder dan 7 dagen) te verwijderen
async function deleteOldMessages(db) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 dagen geleden
  const deleteQuery = "DELETE FROM signals WHERE timestamp < ?";

  try {
    const result = await db.run(deleteQuery, [sevenDaysAgo]);
    console.log(`${result.changes} oude berichten verwijderd.`);
  } catch (err) {
    console.error('Fout bij het verwijderen van oude berichten:', err.message);
  }
}

// Roep de deleteOldMessages functie aan om oude berichten te verwijderen bij elke request
(async () => {
  const db = await dbPromise;
  await deleteOldMessages(db);
})();

export default async function handler(req, res) {
  const db = await dbPromise;

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

    try {
      // Bewaar het signaal in de database, standaard status is 'unread'
      const stmt = await db.prepare("INSERT INTO signals (peerId, type, message, timestamp, status) VALUES (?, ?, ?, ?, ?)");
      const result = await stmt.run(peerId, data.type, data.message, timestamp, 'unread');
      await stmt.finalize();

      res.status(200).json({
        message: 'Signal received and stored',
        peerId,
        id: result.lastID,
      });
    } catch (err) {
      console.error('Error storing signal in database:', err.message);
      res.status(500).json({ error: 'Error storing signal in database' });
    }
  } else if (req.method === 'GET') {
    const { peerId } = req.query;

    try {
      // Haal het laatste signaal op uit de database en stel de status in op 'read'
      const row = await db.get("SELECT * FROM signals WHERE peerId = ? ORDER BY id DESC LIMIT 1", [peerId]);

      if (row) {
        // Verwijder het bericht nadat het is gelezen
        const deleteStmt = await db.prepare("DELETE FROM signals WHERE id = ?");
        await deleteStmt.run(row.id);
        await deleteStmt.finalize();

        res.status(200).json({ signal: row });
      } else {
        res.status(200).json({ message: 'No signal found for this peer' });
      }
    } catch (err) {
      console.error('Error retrieving signal:', err.message);
      res.status(500).json({ error: 'Error retrieving signal' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
