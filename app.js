// Functie om berichten op te slaan met tijdstempel en prefix
function saveMessage(message) {
  const timestamp = new Date().getTime(); // Verkrijg de huidige tijd in milliseconden

  // Maak een unieke sleutel met prefix, bijvoorbeeld 'message_' plus de tijdstempel
  const messageKey = `message_${timestamp}`;

  // Voeg het bericht met tijdstempel toe aan het object
  const messageData = {
    message: message,
    timestamp: timestamp
  };

  // Sla het bericht op met de unieke sleutel in localStorage
  localStorage.setItem(messageKey, JSON.stringify(messageData));
  console.log("Message saved:", messageData);

  // Herlaad berichten na het opslaan
  loadMessages();
}

// Functie om berichten op te halen en alleen die binnen een uur te bewaren
function getMessages() {
  const messages = [];

  // Loop door alle opgeslagen berichten in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const item = JSON.parse(localStorage.getItem(key));

    // Controleer of het een bericht is met tijdstempel
    if (item && item.timestamp) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - item.timestamp;

      // Alleen berichten die binnen een uur zijn toegevoegd, worden opgeslagen
      if (timeDifference <= 3600000) {
        messages.push(item.message);
      } else {
        // Verwijder oude berichten die ouder zijn dan 1 uur
        localStorage.removeItem(key);
      }
    }
  }

  // Retourneer de berichten die binnen een uur zijn ontvangen
  return messages;
}

// Functie om berichten te laden
function loadMessages() {
  const messages = getMessages();
  const messageList = document.getElementById('message-list');
  messageList.innerHTML = ''; // Maak de lijst leeg

  // Voeg alle berichten toe aan de lijst
  messages.forEach(message => {
    const listItem = document.createElement('li');
    listItem.textContent = message;
    messageList.appendChild(listItem);
  });
}

// Event listener voor het verzenden van een bericht
document.getElementById('send-message').addEventListener('click', () => {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();

  if (message) {
    saveMessage(message);
    messageInput.value = ''; // Maak het inputveld leeg na het verzenden
  }
});

// Laad berichten wanneer de pagina wordt geladen
loadMessages();
