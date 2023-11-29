import { GlobalConfig } from "payload/types";

const pages = {
  home: {
    title: 'Home',
  },
}

export const getBasePageConfig = (slug: keyof typeof pages): GlobalConfig => ({
  slug,
  access: {
    read: () => true,
  },
  admin: {
    group: 'Pages',
  },
  fields: []
})

export default pages;