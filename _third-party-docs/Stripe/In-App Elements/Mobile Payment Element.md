# Mobile Payment Element

Accept payments in your mobile app.

The Mobile Payment Element is a UI component for building checkout flows in your mobile app. Use our [iOS](https://github.com/stripe/stripe-ios), [Android](https://github.com/stripe/stripe-android), and [React Native](https://github.com/stripe/stripe-react-native) SDKs to start building with it. You can style all Elements to match the look and feel of your app.

With the Mobile Payment Element, you get:

- [Access to over 100 global payment methods](https://docs.stripe.com/payments/payment-methods/overview.md)
  This includes Apple Pay, Link, and other popular payment methods that are automatically enabled.
- [Dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods.md)
  Simplify your payment methods code by dynamically ordering and displaying payment methods and [launch A/B tests](https://docs.stripe.com/payments/a-b-testing.md) for new payment methods.
- [UI customizations to match your app](https://docs.stripe.com/elements/appearance-api/mobile.md)
  Match the UI to the design of your app. The layout stays consistent, but you can modify colors, fonts, and more.
- [Address collection](https://docs.stripe.com/payments/mobile/save-during-payment.md?platform=ios&mobile-ui=payment-element#collect-payment-details)
  Collect full or partial billing addresses with any payment method.
- [Save and display cards and bank accounts](https://docs.stripe.com/payments/mobile/accept-payment.md?platform=ios&type=payment#enable-saved-cards)
  Save, reuse, and manage cards and bank accounts. You can also [store a customer’s payment details without an initial payment](https://docs.stripe.com/payments/mobile/set-up-future-payments.md).

## Integration options

The Mobile Payment Element has two main integration options:

- **Payment Sheet:** A prebuilt sheet you can embed anywhere in your app. The sheet displays the list of payment methods, express pay buttons, and the confirmation button.
- **Embedded Element:** A customizable drop-in component that embeds a list of payment methods on any screen in your app. When a payment method is selected from the list, a bottom sheet collects payment details.

![Comparison of Payment Sheet and Embedded Element integrations](images/mobile/mobile-payment-element/mpe-integration-options.png)
Comparison of Payment Sheet and Embedded Element integrations.

## Layout

When using the Payment Sheet, set the layout to `.automatic` for Stripe to provide the appropriate payment method layout. You can also select `.vertical` or `horizontal` layout.

When using the Embedded Element, choose between radio layout, check mark layout, or floating buttons with a selected stroke.

![Comparison of Payment Sheet and Embedded Element integrations](images/mobile/mobile-payment-element/mpe-layout.png)
The Payment Sheet is available in the following modes: horizontal, carousel, and vertical.

The Embedded Element supports: radio buttons, checkmarks, and floating button layouts.

## Appearance

Use the Appearance API to customize the look and feel of the Mobile Payment Element to match your app. With the Appearance API, you can control fonts, colors, borders, shadows, and so on.

![Comparison of Payment Sheet and Embedded Element integrations](images/mobile/mobile-payment-element/mpe-appearance.png)
The Payment Sheet supports custom styling for the following modes: horizontal, carousel, and vertical.

The Embedded Element supports custom styling for: radio buttons and floating button layouts.

## Payment methods

The Mobile Payment Element provides access to over 100 payment methods across all Stripe-supported countries. You can enable payment methods from your Stripe Dashboard or by using External Payment Methods.

Payment method providers often change their collection and display requirements. When you use the Mobile Payment Element to display payment methods, Stripe handles all payment detail collection in prebuilt, localized forms that we keep up-to-date with each payment provider.

![Comparison of payment method selection in Payment Sheet and Embedded Element integrations](images/mobile/mobile-payment-element/mpe-payment-methods.png)
The Payment Sheet shows examples of the card form and Klarna form. The Embedded Element shows examples of using P24 and SEPA debit.

## Wallets

The Mobile Payment Element supports popular wallets, including Apple Pay and Link, a wallet built by Stripe.

- The Payment Sheet can show wallets using express buttons.
- The Embedded Element shows wallets in-line as payment method options.

![Comparison of wallets in Payment Sheet and Embedded Element integrations](images/mobile/mobile-payment-element/mpe-wallets.png)
The Payment Sheet illustrates native support for Apple Pay. The Embedded Element illustrates native support for Link.

## Saved payment methods

The Mobile Payment Element has built in support for saving, displaying, and managing saved payment methods. Consent states are handled automatically, ensuring global compliance.

Saved payment methods supports cards, US bank accounts, and SEPA debit accounts.

The CustomerSessions API provides additional control over:

- When to show or hide the save consent box
- When to show or hide the saved payment methods
- Allowing buyers to remove saved payment methods
- Preventing buyers from removing the last saved payment method

![Comparison of saved payment methods in Payment Sheet and Embedded Element integrations](images/mobile/mobile-payment-element/mpe-saved-payment-methods.png)
Examples of how customers can access saved payment methods in the Payment Sheet and the Embedded Element.

## Collecting address details

You can configure The Mobile Payment Element to collect additional payment information, including name, email, phone and billing address, regardless of which payment method is being used.

![Comparison of saved payment methods in Payment Sheet and Mobile Payment Element integrations](images/mobile/mobile-payment-element/mpe-collecting-address-details.png)
The Payment Sheet displays the card form with billing details enabled. The Embedded Element shows the P24 form with billing details enabled.

## Additional features

The Mobile Payment Element contains several additional features, including:

- CVC recollection: Configure whether CVC re-collection is required when users pay with a saved payment method.
- [Card brand filtering](https://docs.stripe.com/payments/mobile/filter-card-brands.md): Configure which card brands you accept.
