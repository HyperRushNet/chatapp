document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectBtn');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const myPortInput = document.getElementById('myPort');
    const peerPortInput = document.getElementById('peerPort');
    const messageInput = document.getElementById('message');
    const messageDisplay = document.getElementById('messageDisplay');

    // Laad opgeslagen poort uit localStorage of stel een standaard in
    const myPort = localStorage.getItem('myPort') || '3000';
    myPortInput.value = myPort;  // Zet de poort in de input

    // Stel je poort in en sla deze op
    myPortInput.addEventListener('change', () => {
        const port = myPortInput.value;
        localStorage.setItem('myPort', port);
    });

    // Functie om berichten weer te geven
    function displayMessage(msg) {
        const messageElement = document.createElement('p');
        messageElement.textContent = msg;
        messageDisplay.appendChild(messageElement);
    }

    // Event voor verbinden
    connectBtn.addEventListener('click', () => {
        const myPort = localStorage.getItem('myPort');
        const peerPort = peerPortInput.value;

        if (peerPort) {
            // Hier kan de verbinding opgezet worden via de poort van de peer.
            // Bijvoorbeeld via WebRTC of een andere methode die je gebruikt.
            displayMessage(`Connecting to peer on port ${peerPort}...`);
        } else {
            alert('Please enter a peer port.');
        }
    });

    // Event voor het verzenden van berichten
    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value;
        if (message) {
            displayMessage(`You: ${message}`);
            // Hier wordt het bericht verzonden naar de peer via de opgegeven poort
            // Dit kan via een API, WebSocket, of andere technologie die je gebruikt.
        } else {
            alert('Please enter a message.');
        }
    });
});
