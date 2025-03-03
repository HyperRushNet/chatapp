const sendMessageButton = document.getElementById('sendMessageBtn');
const messageInput = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');

// Peer-to-peer variables
let localConnection;
let sendChannel;
let peerId = 2000; // Vaste ID voor de peer

// Create WebRTC connection
function createConnection() {
  localConnection = new RTCPeerConnection();
  sendChannel = localConnection.createDataChannel("sendDataChannel");

  sendChannel.onmessage = (event) => {
    displayMessage(`Peer: ${event.data}`);
  };

  localConnection.createOffer()
    .then(offer => {
      return localConnection.setLocalDescription(offer);
    })
    .then(() => {
      return fetch('/api/signal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'offer',
          sdp: localConnection.localDescription.sdp,
          id: peerId
        }), // Correctly closing JSON.stringify body
      });
    })
    .catch(error => console.error('Error creating offer:', error));
}

// Display message in the chat window
function displayMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messagesDiv.appendChild(messageDiv);
}

// Send message to the peer
sendMessageButton.onclick = () => {
  const message = messageInput.value;
  if (message) {
    sendChannel.send(message);
    displayMessage(`You: ${message}`);
    messageInput.value = ''; // Clear input field
  }
};

// Retrieve offer or answer from the signaling server
function getOfferOrAnswer(type) {
  return fetch(`/api/signal?type=${type}&id=${peerId}`)
    .then(response => response.json())
    .then(data => {
      if (data.sdp) {
        return new RTCSessionDescription({ type, sdp: data.sdp });
      } else {
        throw new Error('SDP not found');
      }
    });
}

// Receive and set remote description
function receiveOffer() {
  getOfferOrAnswer('offer')
    .then(offerDescription => {
      return localConnection.setRemoteDescription(offerDescription);
    })
    .then(() => localConnection.createAnswer())
    .then(answer => {
      return localConnection.setLocalDescription(answer);
    })
    .then(() => {
      return fetch('/api/signal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'answer',
          sdp: localConnection.localDescription.sdp,
          id: peerId
        }),
      });
    })
    .catch(error => console.error('Error receiving offer:', error));
}

// Call the function to receive offer if peer sends one
receiveOffer(); // This should be triggered in the right order based on your flow
