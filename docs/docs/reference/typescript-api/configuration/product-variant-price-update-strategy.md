---
title: "ProductVariantPriceUpdateStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariantPriceUpdateStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/product-variant-price-update-strategy.ts" sourceLine="58" packageName="@vendure/core" since="2.2.0" />

This strategy determines how updates to a ProductVariantPrice is handled in regard to
any other prices which may be associated with the same ProductVariant.

For instance, in a multichannel setup, if a price is updated for a ProductVariant in one
Channel, this strategy can be used to update the prices in other Channels.

Using custom logic, this can be made more sophisticated - for example, you could have a
one-way sync that only updates prices in child channels when the price in the default
channel is updated. You could also have a conditional sync which is dependent on the
permissions of the current administrator, or based on custom field flags on the ProductVariant
or Channel.

Another use-case might be to update the prices of a ProductVariant in other currencies
when a price is updated in one currency, based on the current exchange rate.


:::info

This is configured via the `catalogOptions.productVariantPriceUpdateStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface ProductVariantPriceUpdateStrategy extends InjectableStrategy {
    onPriceCreated(
        ctx: RequestContext,
        createdPrice: ProductVariantPrice,
        prices: ProductVariantPrice[],
    ): UpdatedProductVariantPrice[] | Promise<UpdatedProductVariantPrice[]>;
    onPriceUpdated(
        ctx: RequestContext,
        updatedPrice: ProductVariantPrice,
        prices: ProductVariantPrice[],
    ): UpdatedProductVariantPrice[] | Promise<UpdatedProductVariantPrice[]>;
    onPriceDeleted(
        ctx: RequestContext,
        deletedPrice: ProductVariantPrice,
        prices: ProductVariantPrice[],
    ): UpdatedProductVariantPrice[] | Promise<UpdatedProductVariantPrice[]>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### onPriceCreated

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, createdPrice: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>, prices: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]) => UpdatedProductVariantPrice[] | Promise&#60;UpdatedProductVariantPrice[]&#62;`}   />

This method is called when a ProductVariantPrice is created. It receives the created
ProductVariantPrice and the array of all prices associated with the ProductVariant.

It should return an array of UpdatedProductVariantPrice objects which will be used to update
the prices of the specific ProductVariantPrices.
### onPriceUpdated

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, updatedPrice: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>, prices: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]) => UpdatedProductVariantPrice[] | Promise&#60;UpdatedProductVariantPrice[]&#62;`}   />

This method is called when a ProductVariantPrice is updated. It receives the updated
ProductVariantPrice and the array of all prices associated with the ProductVariant.

It should return an array of UpdatedProductVariantPrice objects which will be used to update
the prices of the specific ProductVariantPrices.
### onPriceDeleted

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, deletedPrice: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>, prices: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]) => UpdatedProductVariantPrice[] | Promise&#60;UpdatedProductVariantPrice[]&#62;`}   />

This method is called when a ProductVariantPrice is deleted. It receives the deleted
ProductVariantPrice and the array of all prices associated with the ProductVariant.

It should return an array of UpdatedProductVariantPrice objects which will be used to update
the prices of the specific ProductVariantPrices.


</div>


## DefaultProductVariantPriceUpdateStrategyOptions

<GenerationInfo sourceFile="packages/core/src/config/catalog/default-product-variant-price-update-strategy.ts" sourceLine="14" packageName="@vendure/core" since="2.2.0" />

The options available to the <a href='/reference/typescript-api/configuration/product-variant-price-update-strategy#defaultproductvariantpriceupdatestrategy'>DefaultProductVariantPriceUpdateStrategy</a>.

```ts title="Signature"
interface DefaultProductVariantPriceUpdateStrategyOptions {
    syncPricesAcrossChannels: boolean;
}
```

<div className="members-wrapper">

### syncPricesAcrossChannels

<MemberInfo kind="property" type={`boolean`}   />

When `true`, any price changes to a ProductVariant in one Channel will update any other
prices of the same currencyCode in other Channels. Note that if there are different
tax settings across the channels, these will not be taken into account. To handle this
case, a custom strategy should be implemented.


</div>


## DefaultProductVariantPriceUpdateStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/default-product-variant-price-update-strategy.ts" sourceLine="56" packageName="@vendure/core" since="2.2.0" />

The default <a href='/reference/typescript-api/configuration/product-variant-price-update-strategy#productvariantpriceupdatestrategy'>ProductVariantPriceUpdateStrategy</a> which by default will not update any other
prices when a price is created, updated or deleted.

If the `syncPricesAcrossChannels` option is set to `true`, then when a price is updated in one Channel,
the price of the same currencyCode in other Channels will be updated to match.  Note that if there are different
tax settings across the channels, these will not be taken into account. To handle this
case, a custom strategy should be implemented.

*Example*

```ts
import { DefaultProductVariantPriceUpdateStrategy, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
  // ...
  catalogOptions: {
    // highlight-start
    productVariantPriceUpdateStrategy: new DefaultProductVariantPriceUpdateStrategy({
      syncPricesAcrossChannels: true,
    }),
    // highlight-end
  },
  // ...
};
```

```ts title="Signature"
class DefaultProductVariantPriceUpdateStrategy implements ProductVariantPriceUpdateStrategy {
    constructor(options: DefaultProductVariantPriceUpdateStrategyOptions)
    onPriceCreated(ctx: RequestContext, price: ProductVariantPrice) => ;
    onPriceUpdated(ctx: RequestContext, updatedPrice: ProductVariantPrice, prices: ProductVariantPrice[]) => ;
    onPriceDeleted(ctx: RequestContext, deletedPrice: ProductVariantPrice, prices: ProductVariantPrice[]) => ;
}
```
* Implements: <code><a href='/reference/typescript-api/configuration/product-variant-price-update-strategy#productvariantpriceupdatestrategy'>ProductVariantPriceUpdateStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/configuration/product-variant-price-update-strategy#defaultproductvariantpriceupdatestrategyoptions'>DefaultProductVariantPriceUpdateStrategyOptions</a>) => DefaultProductVariantPriceUpdateStrategy`}   />


### onPriceCreated

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, price: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>) => `}   />


### onPriceUpdated

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, updatedPrice: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>, prices: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]) => `}   />


### onPriceDeleted

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, deletedPrice: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>, prices: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]) => `}   />




</div>
