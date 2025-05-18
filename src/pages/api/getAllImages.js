import connectToDatabase from "../../../utils/mongoose";
import Transform from "../../../models/Transform";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await connectToDatabase();

    const allImages = await Transform.find().sort({ createdAt: -1 }).populate({ path: 'userId', select: 'email' });


     const formattedImages = allImages.map((img) => {
      const createdAt = dayjs(img.createdAt);
      const now = dayjs();
      const diffInHours = now.diff(createdAt, "hour");

      let timeFormatted = "";

      if (diffInHours < 1) {
        timeFormatted = createdAt.fromNow(); // e.g. "15 minutes ago"
      } else if (diffInHours < 6) {
        timeFormatted = `${diffInHours} hrs ago`; // e.g. "3 hrs ago"
      } else {
        timeFormatted = createdAt.format("h:mm A"); // e.g. "7:58 AM"
      }
      
      return {
        ...img._doc,
        createdAtFormatted: timeFormatted,
      };
    });

   // res.status(200).json({ success: true, images: allImages });
    res.status(200).json({ success: true, images: formattedImages });
  } catch (err) {
    console.error("Error fetching all images:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
