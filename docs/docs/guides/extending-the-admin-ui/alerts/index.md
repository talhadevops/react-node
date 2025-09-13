---
title: 'Alerts'
---

Alerts appear in the top bar of the Admin UI and provide a way of notifying the administrator of important information
that may require action.

You can define custom alerts with the [`registerAlert` function](/reference/admin-ui-api/alerts/register-alert/).

Let's say you have a custom order process where certain orders require manual review & approval. You could define an
alert to notify the administrator when there are orders that require review:

```ts title="src/plugins/manual-order-review/ui/providers.ts"
import { registerAlert } from '@vendure/admin-ui/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

import { ManualOrderReviewService } from './providers/manual-order-review.service';

export default [
    ManualOrderReviewService,
    registerAlert({
        id: 'orders-require-approval',
        // This function is responsible for fetching the data needed to determine
        // whether the alert should be displayed.
        check: ({ injector }) => {
            const manualOrderReviewService = injector.get(ManualOrderReviewService);
            return manualOrderReviewService.getOrdersRequiringApproval()
                .then(orders => orders.length);
        },
        // This function is responsible for determining whether and how often the
        // `check` function should be called. In this case, we will check every 60 seconds.
        recheck: () => interval(60_000),
        // This function gets passed the data returned by the `check` function and
        // should return `true` if the alert should be displayed.
        isAlert: orderCount => orderCount > 0,
        // This function is called when the alert is clicked. Here, we will navigate to
        // a new route to display the orders requiring approval.
        action: (orderCount, { injector }) => {
            injector.get(Router).navigate(['/extensions/manual-order-review']);
        },
        // This function is called to determine the label of the alert.
        label: (orderCount) => ({
            text: `${orderCount} ${orderCount === 1 ? 'order' : 'orders'} require approval`,
        }),
    }),
];
```

With this example, a check will be performed every 60 seconds to see if there are any orders requiring approval. The actual
implementation of the check is left to the `ManualOrderReviewService` which in this case would make a request to the 
Vendure server to fetch the required data.

If there are orders requiring approval, the alert will appear in the Admin UI like this:

![Alerts](./alerts-01.webp)
