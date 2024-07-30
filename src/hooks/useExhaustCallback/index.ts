import { useCallback, useRef } from 'react';

/**
 * Only allows running callback as long as no other callback is running.
 *
 * Notice: This hook does not persists callback as `useCallback` or `useEventCallback` does.
 * If you need to persist callback, please wrap it with `useCallback` or `useEventCallback` yourself. For example:
 *
 * ```ts
 * useExhaustCallback(useEventCallback(() => {}));
 *
 * // or
 *
 * useExhaustCallback(useCallback(() => {}, []));
 * ```
 */
export const useExhaustCallback = <I extends unknown[], O>(callback: (...i: I) => O) => {
    const isRunningRef = useRef(false);

    return useCallback(
        (...i: I) => {
            if (isRunningRef.current) {
                return;
            }

            isRunningRef.current = true;

            const result = callback(...i);
            if (result instanceof Promise) {
                result.finally(() => {
                    isRunningRef.current = false;
                });
            } else {
                isRunningRef.current = false;
            }

            return result;
        },
        [callback],
    );
};
