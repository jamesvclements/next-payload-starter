import Mux from "@mux/mux-node";
import { PayloadHandler } from "payload/config";
import express from "express";
import { PluginOptions } from "../types";

const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

export const createUpload: (pluginOptions: PluginOptions) => PayloadHandler[] = (pluginOptions) => [express.raw({ type: 'application/json' }), async (req, res) => {
  if (pluginOptions.debug) {
    console.log(`Received request for signed URL. Fetching upload...`);
  }
  try {
    const upload = await Video.Uploads.create({
      cors_origin: `https://edit.northroadcompany.com`,
      new_asset_settings: {
        playback_policy: 'public',
        ...(pluginOptions.newAssetSettings || {})
      }
    });
    if (pluginOptions.debug) {
      console.log(`Upload fetched. Returning upload...`)
      console.log(JSON.stringify(upload, null, 2));
    }
    return res.status(200).json(upload);
  } catch (err) {
    console.error(`Error fetching upload`);
    console.error(err);
    return res.status(500).json(err);
  }
}];

export const getUpload: (pluginOptions: PluginOptions) => PayloadHandler[] = (pluginOptions) => [express.json(), async (req, res) => {
  try {
    const id = req.query.id as string;
    if (pluginOptions.debug) {
      console.log(`Received request for upload status for ${id}. Fetching upload...`);
    }
    const upload = await Video.Uploads.get(id);
    if (pluginOptions.debug) {
      console.log(`Upload fetched. Returning status...`)
      console.log(JSON.stringify(upload, null, 2));
    }
    return res.status(200).json(upload);
  } catch (err) {
    console.error(`Error fetching upload`);
    console.error(err);
    return res.status(500).json(err);
  }
}];