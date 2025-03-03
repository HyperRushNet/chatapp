<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Peer to Peer Chat</title>
</head>
<body>
  <h1>Peer to Peer Chat</h1>
  <textarea id="chatBox" rows="10" cols="50" readonly></textarea><br>
  <input type="text" id="messageInput" placeholder="Type a message">
  <button onclick="sendMessage()">Send</button>

  <script>
    const peerId = 2000; // Vaste Peer ID
    let peerConnection;
    let dataChannel;
    
    // WebRTC configuratie
    const servers = null;
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

    // Functie om een nieuwe verbinding op te zetten
    function startConnection() {
      peerConnection = new RTCPeerConnection(configuration);
      dataChannel = peerConnection.createDataChannel('chat');
      
      dataChannel.onopen = () => {
        console.log("Data channel is open.");
      };
      
      dataChannel.onmessage = (event) => {
        document.getElementById('chatBox').value += "Peer: " + event.data + "\n";
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({
            type: 'candidate',
            candidate: event.candidate
          });
        }
      };

      peerConnection.createOffer().then(offer => {
        return peerConnection.setLocalDescription(offer);
      }).then(() => {
        sendSignal({
          type: 'offer',
          sdp: peerConnection.localDescription
        });
      }).catch(err => console.error(err));
    }

    // Functie om een signaal te sturen naar de backend
    function sendSignal(data) {
      fetch('https://chatapp-git-main-hrn.vercel.app/api/offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ peerId, data })
      }).then(response => response.json())
        .then(response => {
          console.log('Signal sent:', response);
        })
        .catch(error => console.error('Error sending signal:', error));
    }

    // Functie om een bericht te sturen
    function sendMessage() {
      const message = document.getElementById('messageInput').value;
      if (dataChannel && dataChannel.readyState === 'open') {
        dataChannel.send(message);
        document.getElementById('chatBox').value += "You: " + message + "\n";
        document.getElementById('messageInput').value = '';
      }
    }

    // Start de verbinding
    startConnection();
  </script>
</body>
</html>
