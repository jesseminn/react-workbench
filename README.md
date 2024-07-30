## TODOs

https://dev.to/igaponov/how-to-create-and-publish-react-typescript-npm-package-with-demo-and-automated-build-4hn1
remove tsx from react-workbench?
arc-recoil
Debugger
useDebugger

## Parcel

Parcel bundler might be the simplest tool to serve a web page for dev, _almost_ don't need any configuration.

### Resolve packages with `package.json#exports`

In order to resolve packages with `package.json#exports`, Parcel needs to add additional config:

```json
{
    "@parcel/resolver-default": {
        "packageExports": true
    }
}
```

Check

-   The [official doc](https://parceljs.org/features/dependency-resolution/#package-exports)
-   [This release note](https://parceljs.org/blog/v2-9-0/#new-resolver)
-   [This answer](https://github.com/parcel-bundler/parcel/issues/4155#issuecomment-2193642588)

p.s. Tried to use Parcel to build, but it failed to produce `.d.ts` files, even tried [the tsc transformer](https://parceljs.org/languages/typescript/#tsc)
