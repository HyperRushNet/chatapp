const messagesContainer = document.getElementById('messages');
const inputMessage = document.getElementById('inputMessage');

const peerId = "2000";  // Custom fixed peer ID
let signalChannel;
let sendChannel;

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerText = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage(message) {
    try {
        if (sendChannel && sendChannel.readyState === 'open') {
            sendChannel.send(message);
            displayMessage(`You: ${message}`);
        } else {
            console.log('Send channel not open');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Send channel not open'
            });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}

async function createOffer() {
    const response = await fetch('/api/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId: peerId })
    });
    const data = await response.json();
    if (data.offer) {
        console.log('Sending offer:', data.offer);
        // Assuming signal exchange will be handled by your server
        signalChannel = data.offer;
        sendMessage("Offer sent!");
    }
}

async function createSignal() {
    const response = await fetch('/api/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId: peerId })
    });
    const data = await response.json();
    if (data.signal) {
        console.log('Signal created:', data.signal);
        displayMessage(`Signal received from Peer`);
    }
}

inputMessage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage(inputMessage.value);
        inputMessage.value = '';
    }
});

window.onload = () => {
    createOffer(); // initiate connection
    createSignal(); // initiate signal reception
};
