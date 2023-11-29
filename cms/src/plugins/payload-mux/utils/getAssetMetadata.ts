import { Video } from "payload/generated-types";

const getAssetMetadata = (asset): Partial<Video> => {
  const videoTrack = asset.tracks.find(track => track.type === 'video')!;
  return ({
    /* Assume the first playback ID is what we'll use on the front-end */
    playbackId: asset.playback_ids![0].id,
    /* Reformat Mux's aspect ratio (e.g. 16:9) to be CSS-friendly (e.g. 16/9) */
    aspectRatio: asset.aspect_ratio!.replace(':', '/'),
    duration: asset.duration,
    ...(videoTrack ? {
      maxWidth: videoTrack.max_width,
      maxHeight: videoTrack.max_height
    } : {})
  })
}

export default getAssetMetadata;