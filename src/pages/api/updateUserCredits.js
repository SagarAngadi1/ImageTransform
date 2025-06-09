import connectToDatabase from '../../../utils/mongoose';
import User from '../../../models/User';              // Importing the User model


export default async function handler(req, res) {
  await connectToDatabase(); // Ensure DB connection

  const { userId, credits } = req.body; // Get userId and credits from the request body

  try {

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.credits = credits;
    await user.save();


    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error('Error updating credits:', error);
    return res.status(500).json({ success: false, message: 'Failed to update credits' });
  }
}