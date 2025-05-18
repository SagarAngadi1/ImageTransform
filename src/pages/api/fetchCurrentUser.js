import fetchCurrentUser from '../../../utils/fetchCurrentUser';

export default async function handler(req, res) {
  try {
    const user = await fetchCurrentUser(req);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('API Error fetching current user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}







// pages/api/fetchCurrentUser.js

// import jwt from 'jsonwebtoken';
// import { parse } from 'cookie';
// import User from '../../../models/User';
// import connectToDatabase from '../../../utils/mongoose';

// const JWT_SECRET = process.env.JWT_SECRET || 'Timer$$$project1setcretyeK795$$$';

// export default async function handler(req, res) {
//   await connectToDatabase();

//   const cookies = parse(req.headers.cookie || '');
//   const token = cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.userId).lean();

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token expired' });
//     }
//     return res.status(500).json({ message: 'Internal error' });
//   }
// }
