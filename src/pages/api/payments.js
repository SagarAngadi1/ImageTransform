// src/pages/api/payments.js
import axios from 'axios';
import Razorpay from 'razorpay';
import User from '../../../models/User';
import connectToDatabase from '../../../utils/mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { planId, userId } = req.body;

    const plans = {
      basic: { price: 100, credits: 5000 }, 
      pro: { price: 1900, credits: 10000 }, 
      ultra: { price: 2900, credits: 15000 },
    };

    if (!plans[planId]) { // Amount in paise   //If planId is 'basic', then plans[planId] becomes plans['basic'], which retrieves the value 1900. plans[planId] is how JavaScript accesses a value from an object using the key. In this case, the key is the planId, which could be 'basic', 'pro', or 'ultra'.
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    


    //COMMENTED NOW
    const options = {
      amount: plans[planId].price, // Price in cents (paise)
      currency: 'INR',
      receipt: `receipt_order_${planId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    //COMMENTED NOW TILL HERE




    const credits = plans[planId].credits;

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,


      // subscriptionId: subscription.id,
      // amount: plan.amount,
      // currency: plan.currency,

      key: process.env.RAZORPAY_KEY_ID, // Send the key to frontend
      credits,

    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
