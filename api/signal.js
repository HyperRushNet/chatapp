// api/signal.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message, from, to } = req.body;

        // Display the received message
        console.log(`Received message from ${from} to ${to}: ${message}`);

        // Simulate the sending of the message to the correct port (peer)
        // Normally, you would broadcast this message to the specific peer

        // Respond to the client with a success message
        res.status(200).json({ status: "success", message: "Signal sent successfully" });
    } else {
        // Method not allowed
        res.status(405).json({ error: "Method not allowed" });
    }
}
