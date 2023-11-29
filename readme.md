# next-payload-starter

This is an opinionated starter repository for building marketing sites on Next.js and Payload CMS. This is the same stack I use for client sites at [Old Friends](https://oldfriends.studio) when Webflow or Framer won't do the trick. While the setup is based on my own dev preferences, I'm hopeful this is useful for anyone looking to build highly-custom sites that clients can update themselves.

![preview](https://github.com/jamesvclements/next-payload-starter/assets/20052710/c1e8aa7f-1ae2-46ea-8b68-d240c8607bfc)


## WIP Disclaimer

Please note this is still in early stages. I can't guarantee the correctness of anything in this repo. I try to revisit it with each client project and add improvements, but it's difficult to always keep it in sync with the latest features coming out of each package and my own learnings. My rule of thumb is that if 80% of my projects will use a feature or component, it belongs in the starter.

## Structure and Opinions

- This is a monorepo for both the site and CMS. The site is deployed on Vercel, the CMS is deployed on a cloud provider of your choice. I currently use Google Cloud for the server, Atlas for the database, and Cloudflare for object storage. Payload may be moving to Next, after which the site and cms will be able to be hosted in the same Vercel project, which would be ideal.
- For styling, I use Tailwind CSS as much as possible and normal CSS files when needed. Most projects benefit from using both. The Tailwind breakpoints are customized to be desktop-first (instead of mobile-first). I've always found this to be more intuitive, and it's aligned with the other tools I use like Webflow and Framer.

## Setup

You should be able to run the entire project from the root folder, rather than separate processes for the site and cms.

1. Clone the repo
2. Install the dependencies with `yarn`
3. Add the necessary env variables following `cms/.env.example` and `site/.env.example`
    - For the CMS, you'll need to create a database and object storage. I use Atlas MongoDB and Cloudflare S3. Set these up through their respective web dashboards, then copy over the env variables.
4. Run `yarn dev` to start both the CMS and site and begin developing. You may need to visit the CMS first to populate a few things.
5. As you build out the CMS, run `yarn types` to keep the generated `payload-types` file up to date so you can use it in the site's components.

## Deploying
Documentation incoming...Vercel for the site, Google Cloud Build Trigger and Run for the CMS (for now).

## Payload Plugins

This repo also includes two custom plugins I've written for Payload CMS, described below. I'm hoping to publish these on NPM soon. For now, if you'd like to use one, simply copy the plugin's folder (e.g. `payload-mux`) and paste it into your own project.

## payload-mux

Mux is a fantastic platform for hosting and streaming video. This plugin customizes your `videos` collection to automatically upload videos into your Mux project, load the metadata (like aspect ratio and size) back into the CMS, and keeps them in sync:

### Setup

1. Add the `payload-mux` folder into your CMS
2. Install the plugin dependencies
   ```
   yarn add @mux/mux-node @mux/mux-uploader-react @mux/mux-player-react
   ```
3. Add the necessary env variables
   ```bash
   MUX_TOKEN_ID=
   MUX_TOKEN_SECRET=
   MUX_WEBHOOK_SIGNING_SECRET=
   ```
4. In the Mux dashboard, add a webhook to `https://your-cms-url.com/api/mux/webhook`. This way when videos are deleted within the Mux dashboard, the corresponding document in your `videos` collection is deleted as well. If you need to test this locally, use `ngrok` or [LocalCan](https://www.localcan.com/). The plugin will technically work without doing this but it's a good practice to keep them in sync, otherwise you'll have stale video documents.
5. Initialize the plugin inside your `payload.config.ts`

   ```ts
   plugins: [
     payloadMux({
       enabled: true,
       collection: 'videos',
     }),
   ```
6. That's it! You should now be able to upload videos to Mux directly through Payload 🍿

### Demo
https://github.com/jamesvclements/next-payload-starter/assets/20052710/5c9a6cde-fea1-4e33-b88a-84009b12120b

## payload-vercel

Documentation incoming...this plugin helps you revalidate your front-end when you change things in the CMS, as well as force revalidations when needed, and view latest deployments.

## (Notes to self)

### Todos

- Continue cleaning up lingering bits that aren't specific to starter
- Remove the grep command from `/site/package.json` that starts dev on the PORT env var. This is helpful but not cross-platform.
- ~~Use [Upchunk](https://github.com/muxinc/upchunk) for file uploading and remove dependency on Payload's upload UI~~

### Next Steps

- Take advantage of the `shared` folder for settings used on both the front-end and server, like some env variables and the generated `payload-types.ts`
