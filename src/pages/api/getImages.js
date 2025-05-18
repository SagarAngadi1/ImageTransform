import connectToDatabase from "../../../utils/mongoose";
import Transform from "../../../models/Transform";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Missing userId' });
  }

  try {
    await connectToDatabase();

    const userImages = await Transform.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, images: userImages });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}