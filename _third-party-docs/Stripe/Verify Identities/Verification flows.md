# Verification flows

Apply a reusable configuration across your integration.

Flows provide a way to save and reuse the same configuration across all of your integration interfaces. You can use each flow to create verification sessions through the API, in the Dashboard, or through the flow’s static link. Flows support the management of different verification use cases and can help ensure consistency across your integration.

## Create flows

To set up your Identity integration, first create a flow to store your desired configuration:

1. Visit the [Verification flows](https://dashboard.stripe.com/identity/verification-sessions) page in your Dashboard.
1. Name the flow.
1. Configure the verification behavior you want.
1. Click **Save**.

### Manage flows

The [Verification flows](https://dashboard.stripe.com/identity/verification-flows) page displays all of your flows. You can create distinct flows for different use-cases, such as:

- Marketing campaigns
- High-value versus low-value transactions
- Known high-risk users versus trusted users
- Any other relevant use case

After you create a flow, you can visit the details page to:

- View details and edit the flow
- View a list of all the verifications created from the flow
- Activate or deactivate the flow’s static link

### Update flows

You can use flows to deploy a new configuration to production. For example, if you want to add selfie checks to your document verifications, you can edit the flow in the Dashboard to add selfie verification. Any future verifications you create with this flow automatically adopt the updated configuration, so make sure to only apply changes that you want to adopt for future verifications.

## Use flows to verify users

After you create a flow, you have two options for how to initiate an identity verification using it.

To use flows in your API integration, copy the flow ID from the details page and pass it in the [verification_flow](https://docs.stripe.com/api/identity/verification_sessions/create.md#create_identity_verification_session-verification_flow) parameter when you create a verification session.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Identity.VerificationSessionCreateOptions
{
    VerificationFlow = "<<identityVerificationFlow>>",
};
var service = new Stripe.Identity.VerificationSessionService();
Stripe.Identity.VerificationSession verificationSession = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.IdentityVerificationSessionParams{
  VerificationFlow: stripe.String("<<identityVerificationFlow>>"),
};
result, err := verificationsession.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

VerificationSessionCreateParams params =
  VerificationSessionCreateParams.builder()
    .setVerificationFlow("<<identityVerificationFlow>>")
    .build();

VerificationSession verificationSession = VerificationSession.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>')

const verificationSession = await stripe.identity.verificationSessions.create({
  verification_flow: '<<identityVerificationFlow>>',
})
```

```python
import stripe
stripe.api_key = "<<secret key>>"

verification_session = stripe.identity.VerificationSession.create(
  verification_flow="<<identityVerificationFlow>>",
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$verificationSession = $stripe->identity->verificationSessions->create([
  'verification_flow' => '<<identityVerificationFlow>>',
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

verification_session = Stripe::Identity::VerificationSession.create({
  verification_flow: '<<identityVerificationFlow>>',
})
```

### Include user-specific details

As with any verification session that you create with the API, you can attach user-specific data with the [metadata](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-metadata) and [provided_details](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-provided_details) parameters. The [client_reference_id](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-client_reference_id) parameter provides a reference to a user in your system that you can look up later.

For example, here’s how you can attach a user-specific phone number, email address, and `client_reference_id` to a verification session:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Identity.VerificationSessionCreateOptions
{
    VerificationFlow = "<<identityVerificationFlow>>",
    ProvidedDetails = new Stripe.Identity.VerificationSessionProvidedDetailsOptions
    {
        Phone = "5555551212",
        Email = "user@domain.com",
    },
    ClientReferenceId = "reference-token",
};
var service = new Stripe.Identity.VerificationSessionService();
Stripe.Identity.VerificationSession verificationSession = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.IdentityVerificationSessionParams{
  VerificationFlow: stripe.String("<<identityVerificationFlow>>"),
  ProvidedDetails: &stripe.IdentityVerificationSessionProvidedDetailsParams{
    Phone: stripe.String("5555551212"),
    Email: stripe.String("user@domain.com"),
  },
  ClientReferenceID: stripe.String("reference-token"),
};
result, err := verificationsession.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

VerificationSessionCreateParams params =
  VerificationSessionCreateParams.builder()
    .setVerificationFlow("<<identityVerificationFlow>>")
    .setProvidedDetails(
      VerificationSessionCreateParams.ProvidedDetails.builder()
        .setPhone("5555551212")
        .setEmail("user@domain.com")
        .build()
    )
    .setClientReferenceId("reference-token")
    .build();

VerificationSession verificationSession = VerificationSession.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>')

const verificationSession = await stripe.identity.verificationSessions.create({
  verification_flow: '<<identityVerificationFlow>>',
  provided_details: {
    phone: '5555551212',
    email: 'user@domain.com',
  },
  client_reference_id: 'reference-token',
})
```

```python
import stripe
stripe.api_key = "<<secret key>>"

verification_session = stripe.identity.VerificationSession.create(
  verification_flow="<<identityVerificationFlow>>",
  provided_details={"phone": "5555551212", "email": "user@domain.com"},
  client_reference_id="reference-token",
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$verificationSession = $stripe->identity->verificationSessions->create([
  'verification_flow' => '<<identityVerificationFlow>>',
  'provided_details' => [
    'phone' => '5555551212',
    'email' => 'user@domain.com',
  ],
  'client_reference_id' => 'reference-token',
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

verification_session = Stripe::Identity::VerificationSession.create({
  verification_flow: '<<identityVerificationFlow>>',
  provided_details: {
    phone: '5555551212',
    email: 'user@domain.com',
  },
  client_reference_id: 'reference-token',
})
```

### Static link

You can use a flow’s static link to verify any number of your users.

Embed these static links in email templates, include them in chat support scripts, or use them anywhere that you connect your users with Stripe’s identity verification. A static link for a verification flow remains active indefinitely until you deactivate it in the Dashboard. A flow is usable in the API even when it’s static link is inactive.

Users provide their email address, then proceed through a new Verification Session that Stripe automatically creates for them. The identity verification UI from a no-code flow is identical to one you create directly through the API. You can view verification results in the Dashboard. Stripe sends webhooks to notify you of updates to the Verification Session.

### Query parameters

Static links support the following query parameters:

- `client_reference_id`: A reference that Stripe stores in the [client_reference_id](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-client_reference_id) field of the Verification Session.
- `prefilled_email`: Stripe pre-fills this value when prompting users for an email address.

You must URL-encode query parameters that contain special characters like `+`.

[Search the Dashboard](https://docs.stripe.com/dashboard/search.md) to find the Verification Sessions that you create with a static link from a user-provided email address or a `client_reference_id`. For example, if you need to verify a user with the `user_12345` ID in your system, add `?client_reference_id=user_12345` to the end of the static link. Stripe saves this ID to the [client_reference_id](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-client_reference_id) field of the Verification Session, which you can find later in the Dashboard.
