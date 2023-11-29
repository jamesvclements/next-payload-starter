import { GlobalConfig } from 'payload/types';
import { getBasePageConfig } from './pages';

export const Home: GlobalConfig = {
  ...(getBasePageConfig('home')),
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'next-payload-starter',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'A starter for Next.js and Payload CMS. Please view the README for detailed instructions on getting started.',
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'videos'
    }
  ]
};
