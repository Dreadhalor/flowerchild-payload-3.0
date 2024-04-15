import { CollectionConfig } from 'payload/types';
import { User } from '@flowerchild/payload-types';
import getPayloadClient from '@flowerchild/lib/payload-client';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  hooks: {
    beforeChange: [
      async (args) => {
        if (args.operation === 'create') {
          const data = args.data as User;

          // send email to user
          console.log('send email to user', data.email);
          console.log('data', data);
          const payload = await getPayloadClient();

          payload.sendEmail({
            to: data.email,
            subject: 'Verify your email address',
            from: {
              name: 'FLOWERCHILD',
              address: 'hello@flowerchild-fashion.com',
            },
            html: `
              <div>
                <p>Click the link below to verify your email address, yo:</p>
                <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${data._verificationToken}">Verify Email</a>
              </div>
            `,
          });

          return data;
        }
      },
    ],
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'role',
      required: true,
      defaultValue: 'user',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  ],
};
