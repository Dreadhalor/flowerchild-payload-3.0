import config from '@payload-config';
import nodemailer from 'nodemailer';
import { getPayload, type Payload } from 'payload';

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is missing');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  secure: true,
  port: 465,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});

// transporter.sendMail({
//   from: {
//     name: 'FLOWERCHILD',
//     address: 'hello@flowerchild-fashion.com',
//   },
//   to: 'scotthetrick2@gmail.com',
//   subject: 'Hello',
//   text: 'Hello world!',
// });

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 *
 * Source: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
 */
let cached: {
  client: Payload | null;
  promise: Promise<Payload> | null;
} = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null };
}

export const getPayloadClient = async (): Promise<Payload> => {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = getPayload({
      email: {
        transport: transporter,
        fromAddress: 'hello@flowerchild-fashion.com',
        fromName: 'FLOWERCHILD',
      },
      config,
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};

export default getPayloadClient;
