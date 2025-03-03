const sendSignalButton = document.getElementById('sendSignalBtn');
const messageBox = document.getElementById('messageBox');
let peerId = "2000"; // Je vaste peer-id (dit kan later dynamisch worden ingesteld)

sendSignalButton.addEventListener('click', async () => {
  try {
    // Maak een signaal object
    const signal = {
      peerId: peerId,  // Gebruik hier de unieke peer ID
      type: 'offer',   // Of 'answer' afhankelijk van het type signaal
      sdp: 'Sample SDP data', // Voeg hier je SDP of andere gegevens toe
    };

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
      messageBox.value = `Signal sent successfully: ${JSON.stringify(responseData)}`;
    } else {
      throw new Error('Failed to send signal');
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
        messageBox.value = `Received signal: ${JSON.stringify(data.signal)}`;
        // Hier zou je het signal verder verwerken, bijvoorbeeld met WebRTC.
      } else {
        messageBox.value = 'No signal found for this peer';
      }
    } else {
      throw new Error('Failed to retrieve signal');
    }
  } catch (error) {
    messageBox.value = `Error: ${error.message}`;
  }
}

// Haal elke 3 seconden een signaal op voor de peer
setInterval(getSignalFromPeer, 3000);
