const peerId = 2000; // Vast peer ID voor deze sessie
let localPeerConnection;
let dataChannel;
let remotePeerId;

// Stuur bericht naar andere peer
async function sendSignal(peerId, signalData) {
  try {
    const response = await fetch('/api/offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        peerId: peerId,
        signal: signalData,
      }),
    });

    const data = await response.json();
    console.log('Signal sent successfully:', data);
  } catch (error) {
    console.error('Error sending signal:', error);
  }
}

// Verzend een bericht
document.getElementById('sendButton').addEventListener('click', () => {
  const message = document.getElementById('messageInput').value;
  if (message && dataChannel && dataChannel.readyState === 'open') {
    dataChannel.send(message);
    addMessageToUI('You', message); // Toon bericht in UI
    document.getElementById('messageInput').value = ''; // Reset input
  }
});

// Voeg bericht toe aan de UI
function addMessageToUI(sender, message) {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  messagesDiv.appendChild(messageElement);
}

// WebRTC verbinding opzetten
async function startConnection() {
  localPeerConnection = new RTCPeerConnection();
  dataChannel = localPeerConnection.createDataChannel('chat');

  dataChannel.onopen = () => console.log('Data channel opened');
  dataChannel.onmessage = (event) => {
    addMessageToUI('Peer', event.data); // Toon ontvangen bericht van peer
  };

  // ICE-candidates verwerken
  localPeerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('ICE Candidate:', event.candidate);
      sendSignal(remotePeerId, {
        type: 'candidate',
        candidate: event.candidate,
      });
    }
  };

  // Signalen ontvangen en verwerken
  await setupOffer();
}

// Maak een WebRTC-aanbieding
async function setupOffer() {
  try {
    const offer = await localPeerConnection.createOffer();
    await localPeerConnection.setLocalDescription(offer);
    console.log('Sending offer:', offer);

    sendSignal(remotePeerId, {
      type: 'offer',
      sdp: offer,
    });
  } catch (error) {
    console.error('Error creating offer:', error);
  }
}

// WebRTC antwoord ontvangen
async function handleOffer(offer) {
  try {
    const remoteConnection = new RTCPeerConnection();
    remoteConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE Candidate:', event.candidate);
        sendSignal(peerId, {
          type: 'candidate',
          candidate: event.candidate,
        });
      }
    };

    await remoteConnection.setRemoteDescription(new RTCSessionDescription(offer.sdp));
    const answer = await remoteConnection.createAnswer();
    await remoteConnection.setLocalDescription(answer);

    sendSignal(peerId, {
      type: 'answer',
      sdp: answer,
    });

    remotePeerId = offer.peerId;

    remoteConnection.ondatachannel = (event) => {
      const remoteDataChannel = event.channel;
      remoteDataChannel.onmessage = (e) => {
        addMessageToUI('Peer', e.data);
      };
    };

  } catch (error) {
    console.error('Error handling offer:', error);
  }
}

// WebRTC antwoord ontvangen
async function handleAnswer(answer) {
  try {
    await localPeerConnection.setRemoteDescription(new RTCSessionDescription(answer.sdp));
  } catch (error) {
    console.error('Error handling answer:', error);
  }
}

// Verwerk de ontvangen signalen (aanbiedingen, antwoorden, kandidaten)
async function handleSignal(signal) {
  if (signal.type === 'offer') {
    await handleOffer(signal);
  } else if (signal.type === 'answer') {
    await handleAnswer(signal);
  } else if (signal.type === 'candidate') {
    const candidate = new RTCIceCandidate(signal.candidate);
    await localPeerConnection.addIceCandidate(candidate);
  }
}

// Signalen ontvangen van de backend (API)
async function getSignal() {
  try {
    const response = await fetch('/api/signal');
    const data = await response.json();

    if (data.signal) {
      await handleSignal(data.signal);
    }
  } catch (error) {
    console.error('Error receiving signal:', error);
  }
}

// Start de WebRTC-verbinding
startConnection();

// Periodieke controle op signalen
setInterval(getSignal, 1000); // Elke seconde controleren op signalen
