import { useRef, useCallback } from 'react';

/**
 * Mimic the behavior of `useEvent`, similar to `useCallback` with following differences:
 *
 * - The returned function (named "event callback") will be constant during a component lifecycle
 * - When the event callback is called, it'll always runs the latest version of the wrapped callback, thus no dep list is needed.
 *
 * Ref: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 */
export const useEventCallback = <I extends Array<any>, O, F extends ((...args: [...I]) => O) | undefined>(
    callback: F,
): F => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const exposedCallback = useCallback((...args: [...I]) => {
        return callbackRef.current?.(...args) as O;
    }, []);

    return (callback ? exposedCallback : undefined) as F;
};
