import { useEffect, useState } from 'react';

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // Functie om berichten op te halen (long polling)
    const fetchMessages = async () => {
        while (true) {
            const res = await fetch('/api/messages');
            const newMessages = await res.json();
            if (newMessages.length > 0) {
                setMessages(prev => [...prev, ...newMessages]);
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wacht 1 sec
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Bericht verzenden
    const sendMessage = async () => {
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
        });
        setInput(""); // Input wissen
    };

    return (
        <div>
            <h1>Chat</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Stuur</button>
        </div>
    );
}
