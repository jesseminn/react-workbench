import { useEffect } from 'react';
import { useEventCallback } from '../useEventCallback';
import { setExactInterval } from 'ts-workbench/timer';

type SetIntervalHandler = Parameters<typeof setInterval>[0];

export const useInterval = (handler: SetIntervalHandler, delay: number | null = 1000) => {
    const eventCallback = useEventCallback(handler);

    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(eventCallback, delay);

            return () => clearInterval(id);
        }
    }, [delay]);
};

export const useExactInterval = (callback: () => void, delay: number | null = 1000) => {
    const eventCallback = useEventCallback(callback);

    useEffect(() => {
        if (delay !== null) {
            const clearOnTimeInterval = setExactInterval(eventCallback, delay);

            return clearOnTimeInterval;
        }
    }, [delay]);
};
