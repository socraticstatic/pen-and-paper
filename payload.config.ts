import path from 'node:path';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import sharpPkg from 'sharp';

import { Users } from './src/collections/Users.ts';
import { Media } from './src/collections/Media.ts';
import { Pens } from './src/collections/Pens.ts';
import { Papers } from './src/collections/Papers.ts';

const payloadSecret = process.env.PAYLOAD_SECRET;
const databaseUri = process.env.DATABASE_URI;

if (!payloadSecret) throw new Error('PAYLOAD_SECRET env var is required');
if (!databaseUri) throw new Error('DATABASE_URI env var is required');

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Pen & Paper Admin',
    },
  },
  collections: [Users, Media, Pens, Papers],
  editor: lexicalEditor({}),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(process.cwd(), 'src/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUri,
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
