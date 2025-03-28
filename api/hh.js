// api/sendMessage.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Haal de gegevens uit de request body
        const { message, timestamp, peerId, username } = req.body;

        // Verzend het bericht naar de externe API
        try {
            const response = await fetch('https://chatapp-git-main-hrn.vercel.app/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    peerId: peerId || '2000',
                    type: 'offer',
                    message: message || 'Hallo wereld van PC',
                    timestamp: timestamp || '00:00',
                    username: username || 'Onbekend'
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                res.status(200).json({ data: responseData.data });
            } else {
                res.status(response.status).json({ error: 'API request failed' });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        // Handle other HTTP methods
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
