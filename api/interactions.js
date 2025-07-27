import { InteractionType, verifyKey } from 'discord-interactions';

const PUBLIC_KEY = 'YOUR_DISCORD_PUBLIC_KEY'; // Replace this!

export default async (req, res) => {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = await getRawBody(req);

  const isValidRequest = verifyKey(rawBody, signature, timestamp, PUBLIC_KEY);

  if (!isValidRequest) {
    return res.status(401).send('Bad request signature.');
  }

  const interaction = JSON.parse(rawBody.toString());

  // Respond to ping
  if (interaction.type === InteractionType.PING) {
    return res.status(200).json({ type: InteractionType.PING });
  }

  // Respond to /howgay
  if (
    interaction.type === InteractionType.APPLICATION_COMMAND &&
    interaction.data.name === 'howgay'
  ) {
    const percent = Math.floor(Math.random() * 101);
    return res.status(200).json({
      type: 4,
      data: { content: `🌈 You are ${percent}% gay!` },
    });
  }

  return res.status(400).send('Unknown interaction type.');
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => resolve(Buffer.from(data)));
    req.on('error', reject);
  });
}
