import { CollectionConfig } from 'payload/types';

export const OrderItems: CollectionConfig = {
  slug: 'order-items',
  admin: {
    description: 'Individual items within an order.',
  },
  // access: {
  //   create: ({ req }) => req.user?.role === 'admin',
  //   read: ({ req }) => req.user?.role === 'admin',
  //   update: ({ req }) => req.user?.role === 'admin',
  //   delete: ({ req }) => req.user?.role === 'admin',
  // },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'order',
      label: 'Order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      hasMany: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'product',
      label: 'Product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      defaultValue: 1,
      min: 0,
      max: 10,
      required: true,
      // admin: {
      //   step: 1,
      // },
      admin: {
        hidden: true,
      },
    },
  ],
};
