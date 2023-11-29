import path from 'path';
import { buildConfig } from 'payload/config';
import Media from './collections/Media';
import Users from './collections/Users';
import seo from '@payloadcms/plugin-seo';
import { Nav } from './globals/Nav';
import Videos from './collections/Videos';
import { Footer } from './globals/Footer';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import payloadVercel from './plugins/payload-vercel/plugin';
import payloadMux from './plugins/payload-mux/plugin';
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { Home } from './globals/Home';
import { cloudStorage as payloadCloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';
import Projects from './collections/Projects';


export default buildConfig({
  db: mongooseAdapter({
    url: process.env.MONGODB_URI
  }),
  admin: {
    bundler: webpackBundler(),
    user: Users.slug,
    css: path.resolve(__dirname, './global.scss'),
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
        },
      },
    }),
  },
  editor: lexicalEditor(),

  collections: [
    Projects,
    Media,
    Videos,
    Users,
  ],
  globals: [Nav, Footer, Home],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    payloadCloudStorage({
      collections: {
        'media': {
          adapter: s3Adapter({
            config: {
              credentials: {
                accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
                secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
              },
              region: 'auto',
              endpoint: process.env.CLOUDFLARE_ENDPOINT,
            },
            bucket: process.env.CLOUDFLARE_BUCKET,
          }),
        },
      }
    }),
    payloadMux({
      enabled: true,
      collection: 'videos',
      debug: true,
    }),
    payloadVercel({
      enabled: true,
      revalidationUrls: [`http://localhost:1100/api/revalidate`],
      debug: true,
      config: {
        home: {
          paths: ['/']
        },
        projects: {
          paths: ['/', '/work/[slug]'],
          tags: ['projects']
        }
      },
      deployHooks: [
        {
          label: 'Publish Preview',
          // Deploy Hook URL created in Vercel dashboard
          url: 'https://www.google.com',
          useBuildCache: false,
        },
      ]
    }),
    seo({
      globals: ['home', 'settings'],
      uploadsCollection: 'media',
    }),
  ],
});
