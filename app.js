const sendMessageBtn = document.getElementById('sendMessageBtn');
const messageInput = document.getElementById('messageInput');
const messageBox = document.getElementById('messageBox');

let peerId = "2000"; // Gebruik een vaste peerId
let messages = []; // Opslag voor alle berichten

// Functie om een bericht toe te voegen aan de lijst van berichten
function updateMessageBox() {
  messageBox.value = messages.map(msg => `${msg.timestamp} - ${msg.peerId}: ${msg.message}`).join('\n');
}

// Functie om een bericht te versturen
sendMessageBtn.addEventListener('click', async () => {
  const customMessage = messageInput.value.trim();  // Het bericht dat de gebruiker invoert

  if (!customMessage) {
    messageBox.value = "Please enter a message.";
    return;
  }

  const timestamp = new Date().toLocaleTimeString();

  // Maak een signaal object voor de berichten
  const signal = {
    peerId: peerId,
    type: 'offer',   // Of 'answer' afhankelijk van het signaal
    message: customMessage, // Voeg het custom message toe aan het signaal
    timestamp: timestamp, // Voeg een timestamp toe aan elk bericht
  };

  try {
    // Stuur het signaal naar de server via een POST-aanroep
    const response = await fetch('/api/signal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signal),
    });

    if (response.ok) {
      const responseData = await response.json();
      messages.push(responseData.data);  // Voeg het nieuwe bericht toe aan de lijst
      updateMessageBox();
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    messageBox.value = `Error: ${error.message}`;
  }
});

// Functie om signalen van andere peers op te halen
async function getSignalFromPeer() {
  try {
    // Haal signalen op van een andere peer (gebruik hun peerId)
    const response = await fetch(`/api/signal?peerId=${peerId}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.signal) {
        const signal = data.signal;
        messages.push(signal); // Voeg het ontvangen signaal toe aan de berichtenlijst
        updateMessageBox();
      } else {
        messageBox.value = 'No signal found for this peer';
      }
    } else {
      throw new Error('Failed to retrieve message');
    }
  } catch (error) {
    messageBox.value = `Error: ${error.message}`;
  }
}

// Haal elke 3 seconden een signaal op voor de peer
setInterval(getSignalFromPeer, 3000);
