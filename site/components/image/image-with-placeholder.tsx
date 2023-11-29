import "server-only";

import { ImageProps } from "next/image";
import Image from "./image";
import { src } from "@/lib/utils/utils";
import { getPlaiceholder } from "plaiceholder";
import { Media } from "@cms/payload-types";

export default async function ImageWithPlaceholder({
  media,
  ...rest
}: Partial<ImageProps> & {
  media: Media;
}) {
  // const file = await fs.readFile(path.join('./public', src));
  const source = src(media.url!);

  const buffer = await fetch(source).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const { base64 } = await getPlaiceholder(buffer);
  return (
    <Image
      media={media}
      placeholder="blur"
      blurDataURL={base64}
      {...rest}
    ></Image>
  );
}
