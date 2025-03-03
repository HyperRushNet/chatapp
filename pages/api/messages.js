let messages = []; // Tijdelijke opslag (vervliegt bij herstart)

export default function handler(req, res) {
    if (req.method === 'POST') {
        // Bericht opslaan
        const { message } = req.body;
        messages.push(message);
        res.status(200).json({ success: true });
    } else if (req.method === 'GET') {
        // Bericht ophalen en lijst legen (long polling)
        res.status(200).json(messages);
        messages = []; // Reset de lijst na ophalen
    } else {
        res.status(405).end(); // Methode niet toegestaan
    }
}
