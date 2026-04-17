import path from 'node:path';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import sharpPkg from 'sharp';

import { Users } from './src/collections/Users.ts';
import { Media } from './src/collections/Media.ts';

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Pen & Paper Admin',
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(process.cwd(), 'src/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  sharp: sharpPkg,
});
