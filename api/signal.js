// api/signal.js

let users = {};  // Opslaan van gebruikers met een dynamisch poortnummer

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message, from, to } = req.body;

        // Toon de ontvangen boodschap
        console.log(`Received message from ${from} to ${to}: ${message}`);

        // Verzenden naar de juiste gebruiker
        if (users[to]) {
            // In een echte applicatie zou je de verbinding hier beheren en het bericht sturen naar de gebruiker
            res.status(200).json({ status: "success", message: "Signal sent successfully" });
        } else {
            // Als de ontvanger niet gevonden is
            res.status(404).json({ error: "Receiver not found" });
        }
    } else if (req.method === 'GET') {
        // Genereer een dynamische poort voor de nieuwe gebruiker
        const newPort = Math.floor(Math.random() * 10000) + 1000; // Genereer een poort tussen 1000 en 19999
        const userId = Math.floor(Math.random() * 10000);  // Unieke ID voor de gebruiker
        
        // Sla de gebruiker en poort op
        users[userId] = newPort;
        console.log(`Generated port ${newPort} for user ${userId}`);

        // Stuur de gebruiker het poortnummer terug
        res.status(200).json({ port: newPort, userId: userId });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
