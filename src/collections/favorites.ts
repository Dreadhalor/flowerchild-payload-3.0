import { Access, CollectionConfig } from 'payload/types';

const yourOwnOrAdmin: Access = async ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === 'admin') return true;

  return {
    user: {
      equals: user.id,
    },
  };
};

export const Favorites: CollectionConfig = {
  slug: 'favorites',
  admin: {
    useAsTitle: 'Your Favorited Products',
    description: 'Your favorite products on FLOWERCHILD.',
  },
  access: {
    create: ({ req }) => req.user.role === 'admin',
    read: yourOwnOrAdmin,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: false,
    },
  ],
};
