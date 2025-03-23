else if (req.method === 'GET') {
  const { peerId } = req.query;

  // Haal het laatste signaal op uit de database en stel de status in op 'read'
  db.get("SELECT * FROM signals WHERE peerId = ? ORDER BY id DESC LIMIT 1", [peerId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving signal' });
    }

    if (row) {
      // Verwijder het bericht nadat het is gelezen
      const deleteStmt = db.prepare("DELETE FROM signals WHERE id = ?");
      deleteStmt.run(row.id, (err) => {
        if (err) {
          console.error('Error deleting message:', err.message);
        }
      });

      res.status(200).json({ signal: row });
    } else {
      res.status(200).json({ message: 'No signal found for this peer' });
    }
  });
}
