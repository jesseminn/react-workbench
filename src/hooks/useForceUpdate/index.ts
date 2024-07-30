import { useCallback, useState } from 'react';

export const useForceUpdateState = <T>(initialState: T) => {
    const [state, setState] = useState({ current: initialState });

    const forceUpdate = useCallback((newState: T) => {
        setState({ current: newState });
    }, []);

    return [state, forceUpdate] as const;
};

export const useForceUpdate = () => {
    const [_, forceUpdate] = useForceUpdateState(undefined);

    return forceUpdate;
};
