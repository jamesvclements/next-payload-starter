import { Field, FieldBase } from "payload/types";
import { textLink } from "./text-link";

export const textLinks = (): Field & FieldBase => ({
  name: 'links',
  type: 'array',
  required: true,
  admin: {
    components: {
      RowLabel: ({ data }) => {
        return `${data.title}`;
      },
    },
  },
  fields: [
    ...textLink()
  ],
})