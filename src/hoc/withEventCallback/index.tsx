import React, { ComponentType, PropsWithoutRef, useRef } from 'react';
// FIXME
import { ObjectEntries } from 'ts-workbench/types';

// Types

type AnyFunction = (...args: unknown[]) => unknown;
type Key = string | number | symbol;

const EVENT_CALLBACK_PROP_REGEX = /^on[A-Z0-9].+$/;
const checkIsPropEventCallback = (key: Key, value: unknown): value is AnyFunction => {
    return typeof key === 'string' && EVENT_CALLBACK_PROP_REGEX.test(key) && typeof value === 'function';
};

/**
 * An prop named `on<Event>` and the value type is function will be considered as an "event callback"
 * Any further update to an event callback prop won't trigger component re-render
 *
 * @example
 * ```tsx
 * const AppButton = withEventCallback<{ title: string, onClick: () => void }>(({ title, onClick }) => {
 *      return <button onClick={onClick}>{title}</button>
 * });
 *
 * // pass inline function to `onClick` prop won't trigger `AppButton` re-render anymore
 * <AppButton title="Click" onClick={() => {}} />
 * ```
 *
 */
export function withEventCallback<P extends PropsWithoutRef<any>>(Component: ComponentType<P>) {
    const Memoized = React.memo(Component);

    const WithEventCallback = React.memo((props: P) => {
        const cache = useRef<Partial<{ [key in keyof P]: AnyFunction }>>({}).current;
        const callbacks = useRef<Partial<{ [key in keyof P]: AnyFunction }>>({}).current;

        (Object.entries(props) as ObjectEntries<P>).forEach(([key, value]) => {
            if (checkIsPropEventCallback(key, value)) {
                callbacks[key] = value;

                // callbacks in cache only be created once
                if (!cache[key]) {
                    cache[key] = (...args: any) => {
                        const callback = callbacks[key];
                        if (typeof callback === 'function') {
                            callback(...args);
                        }
                    };
                }
            }
        });

        // FIXME: try remove any
        const forwardedProps: any = {
            ...props,
            ...cache,
        };

        return <Memoized {...forwardedProps} />;
    });

    WithEventCallback.displayName = `withEventCallback(${Component.displayName || Component.name})`;

    return WithEventCallback;
}
