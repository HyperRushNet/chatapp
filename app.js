let localPort = null;  // Dynamische poort die we krijgen van de server
let userId = null;  // Unieke gebruikers-ID

// Haal de dynamische poort en ID op van de server bij het laden van de pagina
window.onload = () => {
    fetch('/api/signal', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        localPort = data.port;
        userId = data.userId;
        console.log(`Your port is ${localPort} and your user ID is ${userId}`);
    })
    .catch(error => console.error('Error fetching port:', error));
};

// Functie om een bericht te versturen
function sendMessage() {
    const message = document.getElementById("messageInput").value;
    const peerId = prompt("Enter the user ID of the person you want to send a message to:");
    const prefix = `${localPort}-${peerId}`;  // Prefix met de poort van de verzender en ontvanger
    const messageWithPrefix = `${prefix}: ${message}`;

    // Verstuur het bericht naar de server
    fetch("/api/signal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: messageWithPrefix,
            from: userId,
            to: peerId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Message sent:", data);
        displayMessage(messageWithPrefix);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

// Toon het bericht op het scherm
function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    document.getElementById("messages").appendChild(messageElement);
}
