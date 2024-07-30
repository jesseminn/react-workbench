import { useEffect } from 'react';

// hooks
import { useEventCallback } from '../useEventCallback';

type SetTimeoutHandler = Parameters<typeof setTimeout>[0];

export const useTimeout = (handler: SetTimeoutHandler, delay: number | null) => {
    const eventCallback = useEventCallback(handler);

    useEffect(() => {
        if (delay === null) {
            return;
        }

        const id = setTimeout(eventCallback, delay);

        return () => clearTimeout(id);
    }, [delay]);
};
