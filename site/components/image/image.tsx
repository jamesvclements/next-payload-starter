import { Media } from '@cms/payload-types';
import { src } from '@/lib/utils/utils';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

export default function Image({
    media,
    ...rest
}: Partial<NextImageProps> & {
    media: Media;
}) {
    return (
        <NextImage
            src={src(media.url!)}
            alt={media.alt}
            width={media.width}
            height={media.height}
            {...rest}
        />
    );
}
