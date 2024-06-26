import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';
import { buildConfig } from 'payload/config';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Users } from './collections/users';
import { Products } from './collections/products';
import { Media } from './collections/media';
import { Orders } from './collections/orders';
import { OrderItems } from './collections/order-items';
import { Categories } from './collections/categories';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const adapter = s3Adapter({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    region: process.env.S3_REGION || '',
  },
  bucket: process.env.S3_BUCKET || '',
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- FLOWERCHILD',
      favicon: '/logo.svg',
      ogImage: '/thumbnail.jpg',
    },
  },
  routes: {
    admin: '/sell',
  },
  collections: [Users, Products, Media, Orders, OrderItems, Categories],
  editor: slateEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter,
        },
      },
    }),
  ],
  sharp,
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.

  // This is temporary - we may make an adapter pattern
  // for this before reaching 3.0 stable
});
