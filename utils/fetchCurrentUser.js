import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import User from '../models/User';
import connectToDatabase from './mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'Timer$$$project1setcretyeK795$$$';

const fetchCurrentUser = async (req) => {
  await connectToDatabase();

  // ✅ Safeguard against missing request or headers
  if (!req || !req.headers || !req.headers.cookie) {
    console.warn('Missing request headers or cookies');
    return null;
  }

  

  
  let token = null;

  try {
    const cookies = parse(req.headers.cookie || ''); // ✅ safely parse
    token = cookies.token;
  } catch (err) {
    console.error('Failed to parse cookies:', err);
    return null;
  }

  if (!token) {
    return null;
  }
        
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).lean(); // Optional `.lean()` for perf

    return user || null;
  }
  
  catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.warn('Token expired at:', error.expiredAt);
    } else {
      console.error('Error verifying token or fetching user:', error);
    }
    return null;
  }
};

export default fetchCurrentUser;










// utils/fetchCurrentUser.js
// import { parseCookies } from 'nookies';

// export default async function fetchCurrentUser(req = null) {
//   try {
//     if (req) {
//       // Server-side: Use absolute URL and forward cookies
//       const cookie = req.headers.cookie || '';
//       const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

//       const res = await fetch(`${baseUrl}/api/fetchCurrentUser`, {
//         headers: {
//           cookie: cookie,
//         },
//       });

//       if (!res.ok) return null;
//       return await res.json();
//     } else {
//       // Client-side: Just call the local API route
//       const res = await fetch('/api/fetchCurrentUser');
//       if (!res.ok) return null;
//       return await res.json();
//     }
//   } catch (err) {
//     console.error('fetchCurrentUser error:', err);
//     return null;
//   }
// }
