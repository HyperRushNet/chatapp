// Functie om een bericht te versturen
function sendMessage() {
    const message = document.getElementById("messageInput").value;
    const senderPort = document.getElementById("senderPort").value;
    const receiverPort = document.getElementById("receiverPort").value;

    if (!senderPort || !receiverPort) {
        alert("Please enter both sender and receiver ports.");
        return;
    }

    const prefix = `${senderPort}-${receiverPort}`;  // Prefix met de poort van de verzender en ontvanger
    const messageWithPrefix = `${prefix}: ${message}`;

    // Verstuur het bericht naar de server
    fetch("/api/signal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: messageWithPrefix,
            from: senderPort,
            to: receiverPort,
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
