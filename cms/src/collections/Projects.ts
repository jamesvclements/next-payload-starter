/* Example of a collection that is also used as a link. Same pattern as projects, products, case studies, videos, team meambers, etc */
import { CollectionConfig } from "payload/types";

const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    }
  ]
}

export default Projects;