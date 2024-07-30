import { MutableRefObject, useRef, useMemo } from 'react';

/**
 * The `forwardedRef` arg in `forwardRef` function has 2 problems:
 *
 * 1. It might not exists if the component's `ref` prop did not receive anything.
 * 2. `ref` prop can be ref object or ref callback.
 *
 * What this hook can do
 *
 * 1. Ensure ref can be access internally, no matter `forwardedRef` exists or not.
 * 2. No matter `forwardedRef` is function or object, the ref is always ref object.
 */
export function useForwardedRef<T>(forwardedRef?: React.ForwardedRef<T>): MutableRefObject<T | null> {
    const internalRef = useRef<T | null>(null);

    // return a special ref object
    return useMemo(() => {
        return {
            get current() {
                return internalRef.current;
            },
            set current(node: T | null) {
                internalRef.current = node;

                if (typeof forwardedRef === 'function') {
                    forwardedRef(node);
                } else if (forwardedRef) {
                    forwardedRef.current = node;
                }
            },
        };
    }, [forwardedRef]);
}
