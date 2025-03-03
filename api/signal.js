// Importeren van benodigde modules
const express = require('express');
const bodyParser = require('body-parser');

// Instantie van express maken
const app = express();

// Gebruik JSON parser voor inkomende aanvragen
app.use(bodyParser.json());

// API-endpoint om signalen te verwerken
app.post('/api/signal', (req, res) => {
    const { message, from, to } = req.body;

    // Controleer of alle vereiste gegevens aanwezig zijn
    if (!message || !from || !to) {
        return res.status(400).json({ error: 'Missing message, from, or to field' });
    }

    // Informatie loggen voor debugging
    console.log(`Received signal from port ${from} to port ${to}: ${message}`);

    // Hier zou je logica kunnen toevoegen om het bericht door te sturen naar de juiste peer
    // Bijv. WebRTC verbindingen of het berichtenverkeer beheren op basis van de poorten

    // Succesvolle verwerking van de signalen
    res.status(200).json({
        message: 'Signal received successfully!',
        data: { message, from, to }
    });
});

// Luisteren naar verzoeken op poort 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
