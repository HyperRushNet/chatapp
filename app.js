const sendMessageButton = document.getElementById('sendMessageBtn');
const messageInput = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');

// Initialize a new WebRTC peer connection
let localConnection;
let sendChannel;

// Create an RTCDataChannel for sending messages
function createConnection() {
  localConnection = new RTCPeerConnection();
  sendChannel = localConnection.createDataChannel("sendDataChannel");
  
  // Setup event for when a message is received on the peer connection
  sendChannel.onmessage = (event) => {
    const message = event.data;
    displayMessage(`Peer: ${message}`);
  };

  // Create offer and set local description
  localConnection.createOffer()
    .then(offer => {
      return localConnection.setLocalDescription(offer);
    })
    .then(() => {
      // Send offer via signaling (you'd typically send this offer to another peer over a signaling server)
      // For demo purposes, we're just simulating the signaling process
      console.log("Sending offer", localConnection.localDescription);
    })
    .catch(error => console.error("Error creating offer: ", error));
}

// Display messages in the chat window
function displayMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messagesDiv.appendChild(messageDiv);
}

// Send a message to the peer
sendMessageButton.onclick = () => {
  const message = messageInput.value;
  if (message) {
    sendChannel.send(message);
    displayMessage(`You: ${message}`);
    messageInput.value = ''; // Clear input field
  }
};

// Initialize connection
createConnection();
