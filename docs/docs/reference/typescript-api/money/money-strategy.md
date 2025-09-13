---
title: "MoneyStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## MoneyStrategy

<GenerationInfo sourceFile="packages/core/src/config/entity/money-strategy.ts" sourceLine="63" packageName="@vendure/core" since="2.0.0" />

The MoneyStrategy defines how monetary values are stored and manipulated. The MoneyStrategy
is defined in <a href='/reference/typescript-api/configuration/entity-options#entityoptions'>EntityOptions</a>:

*Example*

```ts
const config: VendureConfig = {
  entityOptions: {
    moneyStrategy: new MyCustomMoneyStrategy(),
  }
};
```

## Range

The <a href='/reference/typescript-api/money/default-money-strategy#defaultmoneystrategy'>DefaultMoneyStrategy</a> uses an `int` field in the database, which puts an
effective limit of ~21.4 million on any stored value. For certain use cases
(e.g. business sales with very high amounts, or currencies with very large
denominations), this may cause issues. In this case, you can use the
<a href='/reference/typescript-api/money/big-int-money-strategy#bigintmoneystrategy'>BigIntMoneyStrategy</a> which will use the `bigint` type to store monetary values,
giving an effective upper limit of over 9 quadrillion.

## Precision

Both the `DefaultMoneyStrategy` and `BigIntMoneyStrategy` store monetary values as integers, representing
the price in the minor units of the currency (i.e. _cents_ in USD or _pennies_ in GBP).

Since v2.2.0, you can configure the precision of the stored values via the `precision` property of the
strategy. Changing the precision has **no effect** on the stored value. It is merely a hint to the
UI as to how many decimal places to display.

*Example*

```ts
import { DefaultMoneyStrategy, VendureConfig } from '@vendure/core';

export class ThreeDecimalPlacesMoneyStrategy extends DefaultMoneyStrategy {
  readonly precision = 3;
}

export const config: VendureConfig = {
  // ...
  entityOptions: {
    moneyStrategy: new ThreeDecimalPlacesMoneyStrategy(),
  }
};
```

:::info

This is configured via the `entityOptions.moneyStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface MoneyStrategy extends InjectableStrategy {
    readonly moneyColumnOptions: ColumnOptions;
    readonly precision?: number;
    round(value: number, quantity?: number): number;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### moneyColumnOptions

<MemberInfo kind="property" type={`ColumnOptions`}   />

Defines the TypeORM column used to store monetary values.
### precision

<MemberInfo kind="property" type={`number`} default={`2`}  since="2.2.0"  />

Defines the precision (i.e. number of decimal places) represented by the monetary values.
For example, consider a product variant with a price value of `12345`.

- If the precision is `2`, then the price is `123.45`.
- If the precision is `3`, then the price is `12.345`.

Changing the precision has **no effect** on the stored value. It is merely a hint to the
UI as to how many decimal places to display.
### round

<MemberInfo kind="method" type={`(value: number, quantity?: number) => number`}   />

Defines the logic used to round monetary values. For instance, the default behavior
in the <a href='/reference/typescript-api/money/default-money-strategy#defaultmoneystrategy'>DefaultMoneyStrategy</a> is to round the value, then multiply.

```ts
return Math.round(value * quantity);
```

However, it may be desirable to instead round only _after_ the unit amount has been
multiplied. In this case you can define a custom strategy with logic like this:

```ts
return Math.round(value * quantity);
```


</div>
