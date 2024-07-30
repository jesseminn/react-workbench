import { useEffect, useMemo, useState } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

// hooks
import { useEventCallback } from '../useEventCallback';

export function useObservable<T>(observable: Observable<T>): T | undefined {
    const [state, setState] = useState<T | undefined>(undefined);

    useEffect(() => {
        const sub = observable.subscribe(v => {
            setState(v);
        });

        return () => {
            sub.unsubscribe();
        };
    });

    return state;
}

export function useBehaviorSubject<T>(behaviorSubject: BehaviorSubject<T>): readonly [T, (v: T) => void] {
    const initialState = useMemo(() => {
        return behaviorSubject.getValue();
    }, [behaviorSubject]);

    const [state, setState] = useState(initialState);

    useEffect(() => {
        const sub = behaviorSubject.subscribe(v => {
            setState(v);
        });

        return () => {
            sub.unsubscribe();
        };
    }, [behaviorSubject]);

    const next = useEventCallback((v: T) => {
        behaviorSubject.next(v);
    });

    return [state, next] as const;
}
