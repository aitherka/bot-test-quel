import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';

const PUBLIC_KEY = 'c98b843d6b260378cb07c118ae6d8a76d085026349964bb2af951af627470800';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];

  const rawBody = await getRawBody(req);
  const isValid = verifyKey(rawBody, signature, timestamp, PUBLIC_KEY);

  if (!isValid) {
    return res.status(401).send('Bad request signature');
  }

  const interaction = JSON.parse(rawBody.toString());

  if (interaction.type === InteractionType.PING) {
    return res.status(200).json({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data.name === 'howgay') {
      const percentage = Math.floor(Math.random() * 101);
      return res.status(200).json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `🌈 You are ${percentage}% gay!`
        }
      });
    }
  }

  return res.status(200).json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: "Unknown command." }
  });
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => resolve(Buffer.from(data)));
    req.on('error', reject);
  });
}
