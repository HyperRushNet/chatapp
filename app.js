const sendSignalButton = document.getElementById('sendSignalBtn');
const messageBox = document.getElementById('messageBox');

sendSignalButton.addEventListener('click', async () => {
  try {
    const signal = {
      type: 'offer',
      sdp: 'Sample SDP data'
    };

    const response = await fetch('/api/signal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signal),
    });

    if (response.ok) {
      const responseData = await response.json();
      messageBox.value = `Signal sent successfully: ${JSON.stringify(responseData)}`;
    } else {
      throw new Error('Failed to send signal');
    }
  } catch (error) {
    messageBox.value = `Error: ${error.message}`;
  }
});
