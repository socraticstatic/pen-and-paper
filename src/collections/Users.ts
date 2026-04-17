import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 days
    maxLoginAttempts: 5,
    lockTime: 60 * 1000 * 10, // 10 minutes
    useAPIKey: false,
    depth: 0,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
  ],
};
