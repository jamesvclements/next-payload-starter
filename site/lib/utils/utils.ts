import { Home, Media, Nav } from "@cms/payload-types";
import deepmerge from "deepmerge";
import { Metadata } from "next";

/**
  Removes the file extension from a filename.
  @param {string} filename - The filename to trim.
  @returns {string} The filename without the extension.
*/
export const trimExtension = (filename: string) => {
  return filename.replace(/.[^/.]+$/, "");
};

/**
 * Prefix a URL with the API URL.
 * @param {string} url - The URL to prefix.
 * @returns {string} The prefixed URL.
 */
export const src = (url: string) => `${process.env.NEXT_PUBLIC_CMS_URL}${url}`;

/**
 * Resolve internal and external links from payload
 */
export const href = (link: Nav["links"][0]['link']) => {
  if (link.type === '') {
    return `/${(link.page.value as Page).slug}`;
  } else if (link.type === "internal" && link.page?.relationTo === "projects") {
    return `/work/${(link.page.value as Project).slug}`;
  } else if (link.type === 'external') {
    return link.url!;
  } else {
    console.error('Invalid link type', link);
    throw new Error('Invalid link type');
  }
}
/**
 * Parses a CSS value in `rem` units to pixels.
 *
 * @param rem - The CSS value in `rem` units.
 * @returns The parsed value in pixels.
 */
export const parseRemToPx = (rem: string): number => {
  return typeof window !== "undefined"
    ? parseFloat(rem) *
    parseFloat(getComputedStyle(window.document.documentElement).fontSize)
    : 16 * parseFloat(rem);
};

/**
 * Checks if a value is a percentage string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a percentage string, `false` otherwise.
 */
export const isPercentageString = (value: string): boolean => {
  return value.endsWith("%") && !isNaN(parseFloat(value));
};

/**
 * Parses a percentage value.
 *
 * @param value - The percentage value to parse.
 * @returns The parsed value as a decimal.
 */
export const parsePercentage = (value: string): number => {
  const percentage = parseFloat(value);
  return percentage / 100;
};

/**
 * Parses a CSS value.
 *
 * @param value - The CSS value to parse.
 * @returns The parsed value.
 */
export const parseCSSValue = (value: string): number => {
  if (isPercentageString(value)) {
    return parsePercentage(value);
  } else if (value.endsWith("rem")) {
    console.log(`Parsing ${value} to ${parseRemToPx(value)}...`)
    return parseRemToPx(value);
  } else if (value.endsWith("px")) {
    return parseFloat(value);
  } else {
    console.warn(`Unknown CSS value: ${value}`);
    return 1;
  }
};

export const mapPayloadMetadataToNextMetadata = (meta: Home["meta"] = {}, parent: Metadata = {}): Metadata => {
  const media = (meta.image ? meta.image as Media : undefined);
  const metadata: Metadata = {
    ...(meta.title ? { title: meta.title } : {}),
    ...(meta.description ? { description: meta.description } : {}),
    openGraph: {
      type: 'website',
      ...(meta.title ? { title: meta.title } : {}),
      ...(meta.description ? { description: meta.description } : {}),
      ...(media ? {
        images: [
          {
            url: src(media.url!),
            width: media.width,
            height: media.height,
            alt: media.alt,
          }
        ]
      } : {})
    }
  }
  return deepmerge(parent, metadata, {
    /* Overwrite arrays instead of merging them */
    arrayMerge: (_, sourceArray) => sourceArray,
  });
}

export const removeProtocol = (url: String) =>
  url.replace(/(^\w+:|^)\/\//, '');


