---
title: "DefaultStockLocationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultStockLocationStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/default-stock-location-strategy.ts" sourceLine="105" packageName="@vendure/core" since="2.0.0" />

The DefaultStockLocationStrategy was the default implementation of the <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>
prior to the introduction of the <a href='/reference/typescript-api/products-stock/multi-channel-stock-location-strategy#multichannelstocklocationstrategy'>MultiChannelStockLocationStrategy</a>.
It assumes only a single StockLocation and that all stock is allocated from that location. When
more than one StockLocation or Channel is used, it will not behave as expected.

```ts title="Signature"
class DefaultStockLocationStrategy extends BaseStockLocationStrategy {
    init(injector: Injector) => ;
    getAvailableStock(ctx: RequestContext, productVariantId: ID, stockLevels: StockLevel[]) => AvailableStock;
    forAllocation(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => LocationWithQuantity[] | Promise<LocationWithQuantity[]>;
}
```
* Extends: <code>BaseStockLocationStrategy</code>



<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### getAvailableStock

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, stockLevels: <a href='/reference/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]) => <a href='/reference/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a>`}   />


### forAllocation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />




</div>
