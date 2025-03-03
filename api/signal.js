// Functie om berichten op te slaan met tijdstempel en prefix
function saveSignalToLocalStorage(peerId, signalData) {
  const timestamp = new Date().getTime(); // Verkrijg de huidige tijd in milliseconden

  // Maak een unieke sleutel voor elke peer met prefix, bijvoorbeeld 'signal_' + peerId + '_'
  const signalKey = `signal_${peerId}_${timestamp}`;

  // Voeg het signaal met tijdstempel toe aan het object
  const signal = {
    peerId: peerId,
    data: signalData,
    timestamp: timestamp
  };

  // Sla het signaal op met de unieke sleutel in localStorage
  localStorage.setItem(signalKey, JSON.stringify(signal));
  console.log("Signaal opgeslagen voor peer:", peerId, signalData);

  // Verwijder oude signalen die ouder zijn dan 1 uur
  removeExpiredSignals();
}

// Functie om verlopen signalen te verwijderen
function removeExpiredSignals() {
  const currentTime = new Date().getTime();

  // Loop door alle opgeslagen signalen in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const item = JSON.parse(localStorage.getItem(key));

    // Als het signaal ouder is dan 1 uur, verwijder het dan
    if (item && item.timestamp && currentTime - item.timestamp > 3600000) {
      localStorage.removeItem(key);
      console.log("Verwijderd signaal dat ouder is dan 1 uur:", item);
    }
  }
}

// Functie om het laatste signaal van een peer op te halen
function getSignalFromLocalStorage(peerId) {
  const signals = [];

  // Loop door alle opgeslagen signalen in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const item = JSON.parse(localStorage.getItem(key));

    // Controleer of het signaal van de juiste peer is
    if (item && item.peerId === peerId) {
      signals.push(item);
    }
  }

  return signals.length > 0 ? signals : null;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Ontvang het signaal van de peer
    try {
      const signalData = req.body;

      // Sla het signaal op in localStorage
      saveSignalToLocalStorage(signalData.peerId, signalData);

      res.status(200).json({ message: 'Signaal ontvangen', data: signalData });
    } catch (error) {
      res.status(500).json({ error: 'Fout bij het verwerken van signaal' });
    }
  } else if (req.method === 'GET') {
    // Haal het signaal op voor een specifieke peer
    try {
      const { peerId } = req.query;

      const signals = getSignalFromLocalStorage(peerId);

      if (signals) {
        res.status(200).json({ signals: signals });
      } else {
        res.status(404).json({ message: 'Geen signalen voor deze peer' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Fout bij het ophalen van signaal' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
