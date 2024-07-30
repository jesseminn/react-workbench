import { useMemo } from 'react';

// Hooks
import { useEventCallback } from '../useEventCallback';
import { useForceUpdateState } from '../useForceUpdate';
import { useIsChanged } from '../useIsChanged';

// Utils
import { equalArray } from 'ts-workbench/array';

type StateOrUpdater<T> = T | ((current: T | undefined) => T);

const resolveState = <T>(state: StateOrUpdater<T>, current: T | undefined) => {
    return state instanceof Function ? state(current) : state;
};

/**
 * Similar to `useState` + `useMemo`, which
 *
 * - returns a `state` with `setState`
 * - accepts a `deps` array. When `deps` changed, derive new state.
 *
 * This hook is for deriving state from a "source", which could be other state or props.
 * The state itself can also be set by `setState`.
 * When "source" changed, the state will also update accordingly.
 *
 * ```ts
 * // `state` could be a simple value or a "thunk".
 * const [state, setState] = useDerivedState(value, []);
 * const [state, setState] = useDerivedState(() => compute(), []);
 *
 * // Like `useMemo`, when `deps` changed, `source` will be re-evaluated
 * const [isEnabled, setIsEnabled] = useDerivedState(props.isEnabled, [props.isEnabled]);
 * // The state can set. When `props.isEnabled` changes, `state` will be updated
 * setIsEnabled(false);
 * ```
 */
export function useDerivedState<T>(sourceState: StateOrUpdater<T>, deps: unknown[]) {
    const initialState = useMemo(() => {
        return resolveState(sourceState, undefined);
    }, []);
    const [stateRef, forceUpdate] = useForceUpdateState(initialState);

    const isDepsChanged = useIsChanged(deps, (currDeps, prevDeps) => {
        return !equalArray(currDeps, prevDeps);
    });

    if (isDepsChanged) {
        stateRef.current = resolveState(sourceState, stateRef.current);
    }

    const setState = useEventCallback((state: StateOrUpdater<T>) => {
        const _state = resolveState(state, stateRef.current);

        if (stateRef.current !== _state) {
            forceUpdate(_state);
        }
    });

    return [stateRef.current, setState] as const;
}
