'use client';

import { useHover } from '@/lib/hooks/use-hover';
import { HTMLAttributes, useEffect } from 'react';
import { CursorState, useCursor } from '../cursor/cursor';

interface TriggerCursorProps extends HTMLAttributes<HTMLDivElement> {
    cursorState: Partial<CursorState>;
}

export default function TriggerCursor({
    cursorState: { variant = 'interactive', text = '', ...cursorStateRest },
    ...rest
}: TriggerCursorProps) {
    const [ref, isHovered] = useHover<HTMLDivElement>();

    const { setCursorState } = useCursor();

    useEffect(() => {
        if (isHovered) {
            /* Hover-on should override hover-off, so wrap it in a timeout to prevent race conditions */
            setTimeout(() => {
                setCursorState({
                    variant,
                    text,
                    ...cursorStateRest,
                });
            }, 0);
        } else {
            setCursorState({
                variant: 'default',
                text: '',
                backgroundColor: '',
            });
        }
    }, [isHovered]);

    return <div ref={ref} {...rest} />;
}
