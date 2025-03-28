// api/sendMessage.js

// Simuleer een "database" voor het opslaan van berichten (voor demo-doeleinden)
let messages = [];

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Haal de gegevens uit de request body
        const { message, timestamp, peerId, username } = req.body;

        // Validatie van de binnenkomende gegevens
        if (!message || !timestamp || !peerId || !username) {
            return res.status(400).json({ error: 'Verkeerde gegevens aangeleverd.' });
        }

        // Bewaar het bericht in de "database" (hier een tijdelijke array)
        const newMessage = {
            message,
            timestamp,
            peerId,
            username
        };
        messages.push(newMessage);

        // Simuleer het versturen van het bericht naar de externe API
        try {
            const apiResponse = await fetch('https://chatapp-git-main-hrn.vercel.app/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    peerId: peerId || '2000',
                    type: 'offer',
                    message: message || 'Hallo wereld van PC',
                    timestamp: timestamp || '00:00',
                    username: username || 'Onbekend',
                }),
            });

            if (apiResponse.ok) {
                const responseData = await apiResponse.json();

                // Voeg de API response toe aan de nieuwe boodschap
                newMessage.response = responseData.data;

                // Geef de aangepaste berichtenlijst terug
                res.status(200).json({ data: messages }); // Stuur alle berichten terug (inclusief de nieuwe)
            } else {
                res.status(apiResponse.status).json({ error: 'Fout bij API-aanroep naar externe service.' });
            }
        } catch (error) {
            console.error('Fout bij verzenden:', error);
            res.status(500).json({ error: 'Interne serverfout' });
        }

    } else if (req.method === 'GET') {
        // Als de frontend om de berichten vraagt (GET-verzoek)
        res.status(200).json({ data: messages });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
