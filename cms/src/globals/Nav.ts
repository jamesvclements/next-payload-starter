import { GlobalConfig } from 'payload/types';
import { link } from '../fields/link';

export const Nav: GlobalConfig = {
  slug: 'nav',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Components'
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      minRows: 1,
      required: true,
      admin: {
        components: {
          RowLabel: ({ data }) => {
            return `${data.title}`;
          },
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        link()
      ],
    },
  ],
};
