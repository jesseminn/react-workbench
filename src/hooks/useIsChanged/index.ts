import { useEffect, useRef } from 'react';

// Hooks
import { usePrevious } from '../usePrevious';

/**
 * Always return `false` on the mount phase, only start comparing during the update phase
 */
export const useIsChanged = <T>(v: T, unequal: (a: T, b: T) => boolean = (a, b) => a !== b) => {
    const prev = usePrevious(v);
    const didMountRef = useRef(false);
    useEffect(() => {
        didMountRef.current = true;
    }, []);

    // do `prev as T` because the logic only get there on update phase
    return !didMountRef.current ? false : unequal(v, prev as T);
};
