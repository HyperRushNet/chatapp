const sendMessageBtn = document.getElementById('sendMessageBtn');
const messageInput = document.getElementById('messageInput');
const messageBox = document.getElementById('messageBox');

let peerId = "2000"; // Gebruik een vaste peerId voor de demo

// Functie om het bericht bij te werken
function updateMessageBox(message) {
  messageBox.value = `${message.timestamp} - ${message.peerId}: ${message.message}`;
}

// Functie om een bericht te versturen
sendMessageBtn.addEventListener('click', async () => {
  const customMessage = messageInput.value.trim();

  if (!customMessage) {
    messageBox.value = "Please enter a message.";
    return;
  }

  const timestamp = new Date().toLocaleTimeString();

  const signal = {
    peerId: peerId,
    type: 'offer',
    message: customMessage,
    timestamp: timestamp,
  };

  try {
    // Stuur het signaal naar de server
    const response = await fetch('/api/signal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signal),
    });

    if (response.ok) {
      const responseData = await response.json();
      updateMessageBox(responseData.data);
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    messageBox.value = `Error: ${error.message}`;
  }
});

// Functie om berichten van peers op te halen
async function getSignalFromPeer() {
  try {
    const response = await fetch(`/api/signal?peerId=${peerId}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.signal) {
        updateMessageBox(data.signal);
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

// Haal elke 3 seconden het signaal op
setInterval(getSignalFromPeer, 3000);
