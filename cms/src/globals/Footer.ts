import { GlobalConfig } from 'payload/types';
import { link } from '../fields/link';

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Components',
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        link(),
      ],
    }
  ],
};
