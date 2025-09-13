---
title: "DefaultCachePlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultCachePlugin

<GenerationInfo sourceFile="packages/core/src/plugin/default-cache-plugin/default-cache-plugin.ts" sourceLine="48" packageName="@vendure/core" since="3.1.0" />

This plugin provides a simple SQL-based cache strategy <a href='/reference/typescript-api/cache/sql-cache-strategy#sqlcachestrategy'>SqlCacheStrategy</a> which stores cached
items in the database.

It is suitable for production use (including multi-instance setups). For increased performance
you can also consider using the <a href='/reference/typescript-api/cache/redis-cache-plugin#rediscacheplugin'>RedisCachePlugin</a>.

```ts title="Signature"
class DefaultCachePlugin {
    static options: DefaultCachePluginInitOptions = {
        cacheSize: 10_000,
    };
    init(options: DefaultCachePluginInitOptions) => ;
}
```

<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/cache/default-cache-plugin#defaultcacheplugininitoptions'>DefaultCachePluginInitOptions</a>`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/cache/default-cache-plugin#defaultcacheplugininitoptions'>DefaultCachePluginInitOptions</a>) => `}   />




</div>


## DefaultCachePluginInitOptions

<GenerationInfo sourceFile="packages/core/src/plugin/default-cache-plugin/default-cache-plugin.ts" sourceLine="18" packageName="@vendure/core" since="3.1.0" />

Configuration options for the <a href='/reference/typescript-api/cache/default-cache-plugin#defaultcacheplugin'>DefaultCachePlugin</a>.

```ts title="Signature"
interface DefaultCachePluginInitOptions {
    cacheSize?: number;
    cacheTtlProvider?: CacheTtlProvider;
}
```

<div className="members-wrapper">

### cacheSize

<MemberInfo kind="property" type={`number`} default={`10_000`}   />

The maximum number of items to store in the cache. Once the cache reaches this size,
the least-recently-used items will be evicted to make room for new items.
### cacheTtlProvider

<MemberInfo kind="property" type={`CacheTtlProvider`}   />

Optionally provide a custom CacheTtlProvider to control the TTL of cache items.
This is useful for testing.


</div>
