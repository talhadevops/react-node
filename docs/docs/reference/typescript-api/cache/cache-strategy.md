---
title: "CacheStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CacheStrategy

<GenerationInfo sourceFile="packages/core/src/config/system/cache-strategy.ts" sourceLine="53" packageName="@vendure/core" since="3.1.0" />

The CacheStrategy defines how the underlying shared cache mechanism is implemented.

It is used by the <a href='/reference/typescript-api/cache/cache-service#cacheservice'>CacheService</a> to take care of storage and retrieval of items
from the cache.

If you are using the `DefaultCachePlugin` or the `RedisCachePlugin`, you will not need to
manually specify a CacheStrategy, as these plugins will automatically configure the
appropriate strategy.

:::info

This is configured via the `systemOptions.cacheStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface CacheStrategy extends InjectableStrategy {
    get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined>;
    set<T extends JsonCompatible<T>>(key: string, value: T, options?: SetCacheKeyOptions): Promise<void>;
    delete(key: string): Promise<void>;
    invalidateTags(tags: string[]): Promise<void>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### get

<MemberInfo kind="method" type={`(key: string) => Promise&#60;T | undefined&#62;`}   />

Gets an item from the cache, or returns undefined if the key is not found, or the
item has expired.
### set

<MemberInfo kind="method" type={`(key: string, value: T, options?: <a href='/reference/typescript-api/cache/cache-strategy#setcachekeyoptions'>SetCacheKeyOptions</a>) => Promise&#60;void&#62;`}   />

Sets a key-value pair in the cache. The value must be serializable, so cannot contain
things like functions, circular data structures, class instances etc.

Optionally a "time to live" (ttl) can be specified, which means that the key will
be considered stale after that many milliseconds.
### delete

<MemberInfo kind="method" type={`(key: string) => Promise&#60;void&#62;`}   />

Deletes an item from the cache.
### invalidateTags

<MemberInfo kind="method" type={`(tags: string[]) => Promise&#60;void&#62;`}   />

Deletes all items from the cache which contain at least one matching tag.


</div>


## SetCacheKeyOptions

<GenerationInfo sourceFile="packages/core/src/config/system/cache-strategy.ts" sourceLine="13" packageName="@vendure/core" since="3.1.0" />

Options available when setting the value in the cache.

```ts title="Signature"
interface SetCacheKeyOptions {
    ttl?: number;
    tags?: string[];
}
```

<div className="members-wrapper">

### ttl

<MemberInfo kind="property" type={`number`}   />

The time-to-live for the cache key in milliseconds. This means
that after this time period, the key will be considered stale
and will no longer be returned from the cache. Omitting
this is equivalent to having an infinite ttl.
### tags

<MemberInfo kind="property" type={`string[]`}   />

An array of tags which can be used to group cache keys together.
This can be useful for bulk deletion of related keys.


</div>
