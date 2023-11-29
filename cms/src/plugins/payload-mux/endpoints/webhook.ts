import Mux from "@mux/mux-node";
import { PayloadHandler } from "payload/config";
import express from "express";
import { PluginOptions } from "../types";
import { Video } from "payload/generated-types";
import getAssetMetadata from "../utils/getAssetMetadata";

export const webhook: (pluginOption: PluginOptions) => PayloadHandler[] = (pluginOptions) => [express.raw({ type: 'application/json' }), async (req, res) => {
  /* Verify this webhook is coming from Mux */
  if (pluginOptions.debug) {
    console.log(`Verifying signature ${req.headers['mux-signature']} against ${process.env.MUX_WEBHOOK_SIGNING_SECRET}...`)
  }
  const verified = Mux.Webhooks.verifyHeader(req.body, req.headers['mux-signature'] as string, process.env.MUX_WEBHOOK_SIGNING_SECRET!);

  if (!verified) {
    console.log('[payload-mux] Signature verification failed, returning 401...');
    return res.status(401).json({ message: 'Signature verification failed' });
  }

  /* Parse the request body */
  const event = JSON.parse(req.body);

  /* Handle the event */
  if (pluginOptions.debug) {
    console.log(`[payload-mux] Received event: ${event.type}`)
  }

  if (event.type === 'video.asset.ready' || event.type === 'video.asset.deleted') {
    if (pluginOptions.debug) {
      console.log(`[payload-mux] Handling event type: ${event.type}. Event...`);
      console.log(JSON.stringify(event, null, 2));
    }
    try {
      const assetId = event.object.id;
      const videos = await req.payload.find({
        collection: pluginOptions.collection,
        where: {
          assetId: {
            equals: assetId
          }
        },
        limit: 1,
        pagination: false
      });

      if (pluginOptions.debug) {
        console.log(`[payload-mux] Result of querying ${pluginOptions.collection} for assetId: ${assetId}...`);
        console.log(JSON.stringify(videos, null, 2));
      }

      if (videos.totalDocs === 0) {
        if (pluginOptions.debug) {
          console.log(`[payload-mux] No items in ${pluginOptions.collection} matching assetId: ${assetId}, returning 204...`)
        }
        return res.sendStatus(204);
      }

      const video = videos.docs[0] as Video;


      if (pluginOptions.debug) {
        console.log(`[payload-mux] Found item in ${pluginOptions.collection} matching assetId: ${assetId}`);
        console.log(JSON.stringify(video, null, 2));
      }

      if (event.type === 'video.asset.ready') {
        if (pluginOptions.debug) {
          console.log(`[payload-mux] Updating video with metadata (playbackId, aspectRatio, duration)...`);
        }
        /* Update the video with the playbackId, aspectRatio, and duration */
        const update = await req.payload.update({
          collection: pluginOptions.collection,
          id: video.id,
          data: {
            ...getAssetMetadata(event.data),
          }
        }) as Video;
        console.log(`[payload-mux] Successfully updated video ${video.id} with metadata from asset ready event...`);

      } else if (event.type === 'video.asset.deleted') {
        if (pluginOptions.debug) {
          console.log(`[payload-mux] Deleting item ${video.id} from ${pluginOptions.collection} collection...`);
        }
        await req.payload.delete({
          collection: pluginOptions.collection,
          id: video.id,
        });
      }

    } catch (err: any) {
      if (pluginOptions.debug) {
        console.log(`Error finding or deleting document for assetId: ${event.object.id}`);
      }
      return res.status(err.status).json(err);
    }


  } else if (event.type === 'video.asset.errored') {
    if (event.data?.errors) {
      console.error(`Error with assetId: ${event.object.id}, logging error and returning 204...`);
      console.error(JSON.stringify(event.data.errors, null, 2));
    }
  } else {
    if (pluginOptions.debug) {
      console.log(`[payload-mux] Not handling event type: ${event.type}, returning 204...`);
    }
  }
  /* Return with the proper 2xx status code so Mux knows we handled the event and doesn't retry */
  res.sendStatus(204);
}];