export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { type, data, member } = req.body;

  // PING = 1 (handshake), APPLICATION_COMMAND = 2 (slash command)
  if (type === 1) return res.status(200).json({ type: 1 });

  if (type === 2 && data.name === "howgay") {
    const percent = Math.floor(Math.random() * 101);
    return res.status(200).json({
      type: 4,
      data: {
        content: `🌈 You are ${percent}% gay!`
      }
    });
  }

  res.status(400).send("Bad request");
}
