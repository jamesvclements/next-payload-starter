import { Field } from 'payload/types';
import deepMerge from '../lib/utils';

export type CustomField = (overrides?: Partial<Field>) => Field;

export const customField =
    (options: Field) =>
    (overrides = {}) =>
        deepMerge<Field, Partial<Field>>(options, overrides);
