import path from 'path';
import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    // staticDir: path.resolve(__dirname, '../../media'),
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'webp_1800',
        width: 1800,
        formatOptions: {
          format: 'webp',
        },
        withoutEnlargement: true,
      },
      {
        name: 'webp_512',
        width: 512,
        formatOptions: {
          format: 'webp',
        },
        withoutEnlargement: true,
      },
      {
        name: 'jpeg_512',
        width: 512,
        formatOptions: {
          format: 'jpeg',
        },
        withoutEnlargement: true,
      },
      {
        height: 256,
        width: 256,
        position: 'center',
        name: 'thumbnail',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: `Describe the image in a short phrase (e.g., 'man riding a bicycle').`,
      },
    },
  ],
};

export default Media;
