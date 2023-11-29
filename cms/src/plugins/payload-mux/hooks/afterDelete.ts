import { CollectionAfterDeleteHook } from "payload/types";
import Mux from '@mux/mux-node';
import { Video } from "payload/generated-types";

const { Video: MuxVideo } = new Mux();

const afterDelete: CollectionAfterDeleteHook<Video> =
  async ({ id, doc }) => {
    const { assetId } = doc;
    try {
      // Check if the asset still exists in Mux. If it was deleted there first, we don't need to do anything
      console.log(`[payload-mux] Checking if asset ${assetId} exists in Mux...`)
      const video = await MuxVideo.Assets.get(assetId);
      console.log(video);

      if (video) {
        console.log(`[payload-mux] Asset ${id} exists in Mux, deleting...`)
        const response = await MuxVideo.Assets.del(assetId);
      }
    } catch (err) {
      if (err.type === 'not_found') {
        console.log(`[payload-mux] Asset ${id} not found in Mux, continuing...`)
      } else {
        console.error(`[payload-mux] Error deleting asset ${id} from Mux...`)
        console.error(err);
        throw err;
      }
    }

    // try {
    //   console.log(`Deleting asset: ${id} from Mux...`)
    //   await Video.Assets.del(id as string);
    // } catch (err) {
    //   console.error(`Error deleting asset: ${id} from Mux...`)
    //   console.error(err);
    //   if (err.type === 'not_found') {
    //     console.log(`Asset ${id} not found in Mux, continuing...`)
    //   } else {
    //     throw err;
    //   }

    // }
  }

export default afterDelete;