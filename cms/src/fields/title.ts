import { Field } from "payload/types";

export const title = (): Field => ({
  name: 'title',
  type: 'text',
  required: true
})