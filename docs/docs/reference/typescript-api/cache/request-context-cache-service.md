---
title: "RequestContextCacheService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RequestContextCacheService

<GenerationInfo sourceFile="packages/core/src/cache/request-context-cache.service.ts" sourceLine="15" packageName="@vendure/core" />

This service is used to cache arbitrary data relative to an ongoing request.
It does this by using a WeakMap bound to the current RequestContext, so the cached
data is available for the duration of the request. Once the request completes, the
cached data will be automatically garbage-collected.

This is useful for caching data which is expensive to compute and which is needed
multiple times during the handling of a single request.

```ts title="Signature"
class RequestContextCacheService {
    set(ctx: RequestContext, key: any, val: T) => void;
    get(ctx: RequestContext, key: any) => T | undefined;
    get(ctx: RequestContext, key: any, getDefault?: () => T) => T;
    get(ctx: RequestContext, key: any, getDefault?: () => T) => T | Promise<T> | undefined;
}
```

<div className="members-wrapper">

### set

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, key: any, val: T) => void`}   />

Set a value in the RequestContext cache.
### get

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, key: any) => T | undefined`}   />

Get a value from the RequestContext cache. If the value is not found, the `getDefault`
function will be called to get the value, which will then be cached and returned.
### get

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, key: any, getDefault?: () =&#62; T) => T`}   />


### get

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, key: any, getDefault?: () =&#62; T) => T | Promise&#60;T&#62; | undefined`}   />




</div>
