import { Field } from 'payload/types';
import deepMerge from '../lib/utils';
import pages from '../globals/pages';

export const link = (overrides: Partial<Field> = {}): Field =>
  deepMerge(
    {
      name: 'link',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'radio',
          options: [
            { label: 'Page', value: 'page' },
            { label: 'URL', value: 'url' },
            // { label: 'Production', value: 'project' }
          ],
          defaultValue: 'page',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, siblingData) =>
              siblingData.type === 'url',
          },
        },
        {
          name: 'page',
          type: 'select',
          options: [
            ...Object.keys(pages).map((key) => ({
              label: pages[key].title,
              value: key,
            })),
          ],
          admin: {
            condition: (_, siblingData) =>
              siblingData.type === 'page',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    overrides
  );
