import { CollectionBeforeChangeHook } from "payload/types";
import { getIncomingFiles } from "../utils/getIncomingFiles";
import Mux from '@mux/mux-node';
import delay from "../utils/delay";
import getAssetMetadata from "../utils/getAssetMetadata";
import { GeneratedTypes } from "payload";

const { Video } = new Mux();

const beforeChangeHook: CollectionBeforeChangeHook =
  async ({ req, data: incomingData, operation, originalDoc }) => {
    let data = { ...incomingData };
    console.log(`beforeChangeHook: ${operation}`);
    console.log('data');
    console.log(JSON.stringify(data, null, 2));
    try {
      // console.log(`beforeChangeHook: ${operation}`);
      // console.log('data');
      // console.log(originalData);
      // const files = getIncomingFiles({ req, data })

      if (!originalDoc?.assetId || originalDoc.assetId !== data.assetId) {
        console.log(`[payload-mux] Asset ID created for the first time or changed. Creating or updating...`);

        /* If this is an update, delete the old video first */
        if (operation === 'update' && originalDoc.assetId !== data.assetId) {
          console.log(`[payload-mux] Deleting original asset: ${originalDoc.assetId}...`)
          const response = await Video.Assets.del(originalDoc.assetId);
          console.log(response);
        }

        /* For now, we only support one video at a time */
        // const file = files[0];

        // console.log('file');
        // console.log(file);

        // let upload = await Video.Uploads.create({
        //   new_asset_settings: { playback_policy: 'public' },

        // });

        // console.log('upload');
        // console.log(upload);

        /* Upload contains a signed Google Cloud Storage URL that you can use to upload a file directly to GCS */
        /* Upload the file directly to GCS using the signed URL */

        // const response = await fetch(upload.url, {  // replace `upload.signed_url` with the signed URL from your code
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': file.mimeType,  // replace `file.type` with the MIME type of your file
        //   },
        //   body: file.buffer,  // your file data
        // });

        // console.log('response');
        // console.log(response);

        // if (!response.ok) {
        //   throw new Error(`Error uploading file: ${response.statusText}`);
        // }

        /* Poll the upload until it's completed */
        /* Todo — this is not recommended by Mux, we should use webhooks instead. But how do we fail this hook if the upload fails? */

        // let updatedUpload = await Video.Uploads.get(upload.id);
        // console.log('updatedUpload');
        // console.log(updatedUpload);
        // let delayDuration = 1500;
        // while (updatedUpload.status === 'waiting') {
        //   console.log(`Uploading is waiting, trying again in ${delayDuration}ms`);
        //   await delay(delayDuration);
        //   delayDuration = delayDuration * 1.5;
        //   updatedUpload = await Video.Uploads.get(upload.id);
        // }

        // if (updatedUpload.status === 'errored' || updatedUpload.status === 'cancelled' || updatedUpload.status === 'timed_out') {
        //   throw new Error(`Unable to upload file: ${updatedUpload.status}`);
        // }

        /* Now, get the asset and append its' information to the doc */
        let asset = await Video.Assets.get(data.assetId);
        /* Poll for up to 6 seconds, then the webhook will handle setting the metadata */
        let delayDuration = 1500;
        const pollingLimit = 6;
        const timeout = Date.now() + pollingLimit * 1000;
        while (asset.status === 'preparing') {
          if (Date.now() > timeout) {
            console.log(`[payload-mux] Asset is still preparing after ${pollingLimit} seconds, giving up and letting the webhook handle it...`);
            break;
          }
          console.log(`[payload-mux] Asset is preparing, trying again in ${delayDuration}ms`);
          await delay(delayDuration);
          asset = await Video.Assets.get(data.assetId);
        }

        if (asset.status === 'errored') {
          /* If the asset errored, delete it and throw an error */
          console.log('Error while preparing asset. Deleting it and throwing error...');
          const response = await Video.Assets.del(data.assetId);
          console.log(response);
          throw new Error(`Unable to prepare asset: ${asset.status}. It's been deleted, please try again.`);
        }

        /* If the asset is ready, we can get the metadata now */
        if (asset.status === 'ready') {
          console.log(`[payload-mux] Asset is ready, getting metadata...`);
          data = {
            ...data,
            ...getAssetMetadata(asset)
          }
        } else {
          console.log(`[payload-mux] Asset is not ready, letting the webhook handle it...`);
        }

        /* Override some of the built-in file data */
        data.url = '';

        /* Ensure the title is unique, since we're setting the filename equal to the title and the filename must be unique */
        const existingVideo = await req.payload.find({
          collection: req.collection.config.slug as keyof GeneratedTypes['collections'],
          where: {
            title: {
              contains: data.title
            }
          }
        });

        const uniqueTitle = `${data.title}${existingVideo.totalDocs > 0 ? ` (${existingVideo.totalDocs})` : ''}`;
        data.title = uniqueTitle;
        data.filename = uniqueTitle;
      }
    } catch (err: unknown) {
      req.payload.logger.error(
        `[payload-mux] There was an error while uploading files corresponding to the collection with filename ${data.filename}:`,
      )
      req.payload.logger.error(err)
      throw err;
    }
    return {
      ...data,
    }
  }

export default beforeChangeHook;