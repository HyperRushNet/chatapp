const sendMessageBtn = document.getElementById('sendMessageBtn');
const messageInput = document.getElementById('messageInput');
const messageBox = document.getElementById('messageBox');
const usernameInput = document.getElementById('usernameInput');

function getUsername() {
    return usernameInput.value.trim() || 'Onbekend';
}

function updateMessageBox(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.timestamp} - ${message.peerId}: ${message.username}: ${message.message}`;
    messageBox.appendChild(messageElement);
    messageBox.scrollTop = messageBox.scrollHeight;
}

sendMessageBtn.addEventListener('click', async () => {
    const customMessage = messageInput.value.trim();
    if (!customMessage) return;

    const timestamp = new Date().toLocaleTimeString();
    const signal = {
        peerId: "2000",
        type: 'offer',
        message: customMessage,
        timestamp,
        username: getUsername()
    };

    try {
        const response = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signal),
        });

        if (response.ok) {
            const responseData = await response.json();
            updateMessageBox(responseData.data);
        }
    } catch (error) {
        console.error('Fout bij verzenden:', error);
    }
});
