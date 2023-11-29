import { customField } from '.';

export const conditionalMediaRadio = customField({
    name: 'type',
    type: 'radio',
    required: true,
    options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
    ],
});

export const conditionalImage = customField({
    name: 'image',
    type: 'relationship',
    relationTo: 'media',
    admin: {
        condition: (_, siblingData) => siblingData.type === 'image',
    },
});

export const conditionalVideo = customField({
    name: 'video',
    type: 'relationship',
    relationTo: 'videos',
    admin: {
        condition: (_, siblingData) => siblingData.type === 'video',
    },
});

export const conditionalMediaFields = ({
    radioName = 'type',
    imageName = 'image',
    videoName = 'video',
}: {
    radioName?: string;
    imageName?: string;
    videoName?: string;
} = {}) => [
    conditionalMediaRadio({ name: radioName }),
    conditionalImage({ name: imageName }),
    conditionalVideo({ name: videoName }),
];
