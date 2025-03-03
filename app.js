let localPort = window.location.port;  // local port
let peerPort = "4000";  // specify the port of the peer you want to send to

// Function to send message
function sendMessage() {
    const message = document.getElementById("messageInput").value;
    const prefix = `${localPort}-${peerPort}`;  // Prefix with sender and receiver ports
    const messageWithPrefix = `${prefix}: ${message}`;

    // Send the message via fetch to the server
    fetch("/api/signal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: messageWithPrefix,
            from: localPort,
            to: peerPort,
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

// Display message on screen
function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    document.getElementById("messages").appendChild(messageElement);
}
