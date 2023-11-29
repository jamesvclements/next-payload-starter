import { Field, FieldBase } from "payload/types";
import { title } from "./title";
import { link } from "./link";

export const textLink = (): Field[] => [
  title(),
  link()
]