export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { peerId } = req.body;

        // Your logic to handle signal
        const signal = {
            type: 'signal',
            sdp: 'v=0\r\no=- 12345 2 IN IP4 127.0.0.1\r\nt=0 0\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:abcd\r\na=ice-pwd:abcd1234\r\n',
        };

        res.status(200).json({ signal });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
