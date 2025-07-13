# Send your first Stripe API request

Get started with the Stripe API.

Every call to a Stripe API must include an API secret key. After you create a Stripe account, we generate two pairs of [API keys](https://docs.stripe.com/keys.md) for you—a publishable client-side key and a secret server-side key—for both testing in a _sandbox_ and in _live_ modes. To start moving real money with your live-mode keys, you need to [activate your account](https://docs.stripe.com/get-started/account/activate.md).

## Before you begin

This guide walks you through a simple interaction with the Stripe API—creating a customer. For a better understanding of Stripe API objects and how they fit together, take a [tour of the API](https://docs.stripe.com/payments-api/tour.md) or visit the [API reference](https://docs.stripe.com/api.md). If you’re ready to start accepting payments, see our [quickstart](https://docs.stripe.com/payments/quickstart.md).

## Send your first API request

You can begin exploring Stripe APIs using the [Stripe Shell](https://docs.stripe.com/stripe-shell/overview.md). The Stripe Shell allows you to execute Stripe CLI commands directly within the Stripe docs site. As it operates in a _sandbox_ environment only, you don’t have to worry about initiating any real money-moving transactions.

1. To [create a customer](https://docs.stripe.com/api/customers/create.md) using the Stripe Shell, enter the following command:

   ```bash
   stripe customers create --email=jane.smith@email.com --name="Jane Smith" --description="My First Stripe Customer"
   ```

   If everything worked, the command line displays the following response:

   ```json
   {
     "id": "cus_LfctGLAICpokzr",
     "object": "customer",
     "address": null,
     "balance": 0,
     "created": 1652283583,
     "currency": null,
     "default_source": null,
     "delinquent": false,
     "description": "My First Stripe Customer",
     "discount": null,
     "email": "jane.smith@email.com",
     "invoice_prefix": "9B1D61CF",
     "invoice_settings": {
       "custom_fields": null,
       "default_payment_method": null,
       "footer": null
     },
     "livemode": false,
     "metadata": {},
     "name": "Jane Smith",
     "next_invoice_sequence": 1,
     "phone": null,
     "preferred_locales": [],
     "shipping": null,
     "tax_exempt": "none",
     "test_clock": null
   }
   ```

1. (Optional) Run the same command by passing in your API secret key in a sandbox:

   ```bash
   stripe customers create --email=jane.smith@email.com --name="Jane Smith" --description="My First Stripe Customer" --api-key {{keys.secret}}
   ```

   If everything worked, the command line displays the following response:

   ```json
   {
     "id": "cus_LfdZgLFhah76qf",
     "object": "customer",
     "address": null,
     "balance": 0,
     "created": 1652286103,
     "currency": null,
     "default_currency": null,
     "default_source": null,
     "delinquent": false,
     "description": "My First Stripe Customer",
     "discount": null,
     "email": "jane.smith@email.com",
     "invoice_prefix": "D337F99E",
     "invoice_settings": {
       "custom_fields": null,
       "default_payment_method": null,
       "footer": null
     },
     "livemode": false,
     "metadata": {},
     "name": "Jane Smith",
     "next_invoice_sequence": 1,
     "phone": null,
     "preferred_locales": [],
     "shipping": null,
     "tax_exempt": "none",
     "test_clock": null
   }
   ```

## View logs and events

Whenever you make a call to Stripe APIs, Stripe creates and stores API and [Events](https://docs.stripe.com/api/events.md) objects for your Stripe [user account](https://docs.stripe.com/get-started/account.md). The API key you specify for the request determines whether the objects are stored in a sandbox environment or in live mode. For example, the last request used your API secret key, so Stripe stored the objects in a sandbox.

- To view the API request log:

  - Open the [Logs](https://dashboard.stripe.com/test/workbench/logs) page.
  - Click **200 OK POST /v1 customers**.

- To view the Event log:

  - Open the [Events](https://dashboard.stripe.com/test/workbench/events) page.
  - Click **jane.smith@email.com is a new customer**.

## Store your API keys

By default, all accounts have a total of four API keys, two in a _sandbox_ and two in live mode:

- **Sandbox secret key**: Use this key to authenticate requests on your server when you’re testing in a sandbox. By default, you can use this key to perform any API request without restriction. Reserve this key for testing and development to make sure that you don’t accidentally modify your live customers or charges.
- **Sandbox publishable key**: Use this key for testing purposes in your web or mobile app’s client-side code. Reserve this key for testing and development to make sure that you don’t accidentally modify your live customers or charges.
- **Live mode secret key**: Use this key to authenticate requests on your server when in live mode. By default, you can use this key to perform any API request without restriction.
- **Live mode publishable key**: Use this key, when you’re ready to launch your app, in your web or mobile app’s client-side code.

Your secret and publishable keys are in the Dashboard in the [API keys](https://dashboard.stripe.com/test/apikeys) tab. If you can’t view your API keys, ask the owner of your Stripe account to add you to their [team](https://docs.stripe.com/get-started/account/teams.md) with the proper permissions.

You can generate [restricted API keys](https://docs.stripe.com/keys-best-practices.md#limit-access) in the Dashboard to enable customizable and limited access to the API. However, Stripe doesn’t offer any restricted keys by default.

When you’re logged in to Stripe, our documentation automatically populates code examples with your test API keys. Only you can see these values. If you’re not logged in, our code examples include randomly generated API keys. You can replace them with your own test keys or log in to see the code examples populated with your test API keys.

| Type        | Value                              | When to use                                                                                                                                                                                                                                                                                                                                                     |
| ----------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secret      | {{keys.secret}}                    | **On the server side**: Must be secret and stored securely in your web or mobile app’s server-side code (such as in an environment variable or credential management system) to call Stripe APIs. Don’t expose this key on a website or embed it in a mobile application.                                                                                       |
| Publishable | {{keys.publishable}}               | **On the client side**: Can be publicly accessible in your web or mobile app’s client-side code (such as checkout.js) to securely collect payment information, such as with [Stripe Elements](https://docs.stripe.com/payments/elements.md). By default, [Stripe Checkout](https://docs.stripe.com/payments/checkout.md) securely collects payment information. |
| Restricted  | A string that starts with rk*test* | **In microservices**: Must be secret and stored securely in your microservice code to call Stripe APIs. Don’t expose this key on a website or embed it in a mobile application.                                                                                                                                                                                 |

## See Also

- [Set up your development environment](https://docs.stripe.com/get-started/development-environment.md)
- [Stripe Shell](https://docs.stripe.com/stripe-shell/overview.md)
