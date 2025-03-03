// Function to send signal (using fetch or other method)
function sendSignal(peerPort, signalData) {
    fetch(`http://localhost:${peerPort}/api/signal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signalData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Signal sent:', data);
    })
    .catch(error => {
        console.error('Error sending signal:', error);
    });
}

// Function to receive signal
function receiveSignal(peerPort) {
    fetch(`http://localhost:${peerPort}/api/signal`)
    .then(response => response.json())
    .then(data => {
        console.log('Signal received:', data);
    })
    .catch(error => {
        console.error('Error receiving signal:', error);
    });
}
