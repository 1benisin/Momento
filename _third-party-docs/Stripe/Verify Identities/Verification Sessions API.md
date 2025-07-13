# The Verification Sessions API

Learn more about the Verification Sessions API that powers Stripe Identity.

Use the [Verification Session API](https://docs.stripe.com/api/identity/verification_sessions.md) to securely collect information and perform [verification checks](https://docs.stripe.com/identity/verification-checks.md). This API tracks a verification, from initial creation through the entire verification process, and shows verification results upon completion.

For a step-by-step guide on using the Verification Session API to verify your users’ identity document, follow the related guide: [Verify your users’ identity documents](https://docs.stripe.com/identity/verify-identity-documents.md).

## Creating a VerificationSession

When you [create the VerificationSession](https://docs.stripe.com/api/identity/verification_sessions/create.md), determine which [verification check](https://docs.stripe.com/identity/verification-checks.md) to perform by specifying the session [type](https://docs.stripe.com/api/identity/verification_sessions/create.md#create_identity_verification_session-type):

- [document](https://docs.stripe.com/identity/verification-checks.md?type=document) - Verify the authenticity and ownership of government-issued identity documents. Can also include a selfie check.
- [id_number](https://docs.stripe.com/identity/verification-checks.md?type=id-number) - Verify a user’s name, date of birth and national ID number.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Identity.VerificationSessionCreateOptions { Type = "document" };
var service = new Stripe.Identity.VerificationSessionService();
Stripe.Identity.VerificationSession verificationSession = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.IdentityVerificationSessionParams{
  Type: stripe.String(string(stripe.IdentityVerificationSessionTypeDocument)),
};
result, err := verificationsession.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

VerificationSessionCreateParams params =
  VerificationSessionCreateParams.builder()
    .setType(VerificationSessionCreateParams.Type.DOCUMENT)
    .build();

VerificationSession verificationSession = VerificationSession.create(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const verificationSession = await stripe.identity.verificationSessions.create({
  type: "document",
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

verification_session = stripe.identity.VerificationSession.create(type="document")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$verificationSession = $stripe->identity->verificationSessions->create(['type' => 'document']);
```

```ruby
Stripe.api_key = '<<secret key>>'

verification_session = Stripe::Identity::VerificationSession.create({type: 'document'})
```

### Best practices

If the verification process is interrupted and resumes later, attempt to reuse the same VerificationSession instead of creating a new one. Each VerificationSession has a unique ID that you can use to [retrieve](https://docs.stripe.com/api/identity/verification_sessions/retrieve.md) it. In your application’s data model, you can store the VerificationSession’s ID to facilitate retrieval.

The benefit of reusing the VerificationSession is that the object helps track any failed verification attempts. If any of the checks fail, the VerificationSession will have a `requires_input` status.

We recommend that you provide an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) when creating the VerificationSession to avoid erroneously creating duplicate VerificationSessions for the same person. This key is typically based on the ID that you associate with the verification in your application, like a user reference.

## Passing the client secret to the frontend

The VerificationSession contains a [client secret](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-client_secret), a key that’s unique to the individual VerificationSession. The front end uses the client secret to complete the verification.

To use the client secret, you must obtain it from the VerificationSession on your server and pass it to the frontend. You can retrieve the client secret from an endpoint on your server using the browser’s `fetch` function on the client. This approach is generally most suitable when the client is a single-page application, especially one built with a modern frontend framework such as React.

This example shows how to create the server endpoint that serves the client secret:

```javascript
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user.

// Create the session.
const verificationSession = await stripe.identity.verificationSessions.create({
  type: 'document',
  provided_details: {
    email: 'user@example.com',
  },
  metadata: {
    user_id: '{{USER_ID}}',
  },
});

// Return only the client secret to the frontend.
const clientSecret = verificationSession.client_secret;
```

```ruby
<<setup key>>

# In the route handler for /create-verification-session:
# Authenticate your user

# Create the session
verification_session = Stripe::Identity::VerificationSession.create({
  type: 'document',
  provided_details: {
    email: 'user@example.com'
  },
  metadata: {
    user_id: '{{USER_ID}}',
  },
})

# Return only the client secret to the frontend
client_secret = verification_session.client_secret
```

```python
<<setup key>>

# In the route handler for /create-verification-session:
# Authenticate your user.

# Create the session.
verification_session = stripe.identity.VerificationSession.create(
  type="document",
  provided_details={
    "email": "user@example.com"
  },
  metadata={
    "user_id": "{{USER_ID}}",
  },
)

# Return only the client secret to the frontend.
client_secret = verification_session.client_secret
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<secret key>>');

// In the route handler for /create-verification-session:
// Authenticate your user

// Create the session
$verification_session = $stripe->identity->verificationSessions->create([
  'type' => 'document',
  'provided_details' => ['email' => 'user@example.com'],
  'metadata' => [
    'user_id' => '{{USER_ID}}',
  ],
]);

// return only the client secret to the frontend.
$client_secret = $verification_session->client_secret;
```

```java
<<setup key>>

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

VerificationSession verificationSession = VerificationSession.create(params);

String clientSecret = verificationSession.getClientSecret();
```

```go
<<setup key>>
// Authenticate your user

// Create the session
params := &stripe.IdentityVerificationSessionParams{
  Type: stripe.String(stripe.IdentityVerificationSessionTypeDocument),
  ProvidedDetails: &stripe.IdentityVerificationSessionProvidedDetailsParams{
    Email: stripe.String("user@example.com"),
  },
}
params.AddMetadata("user_id", "{{USER_ID}}")

vs, _ := verificationsession.New(params)

// return only the client secret to the frontend
client_secret := vs.ClientSecret
```

```dotnet
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

// Create the session
var options = new VerificationSessionCreateOptions
{
  Type = "document",
  ProvidedDetails = new VerificationSessionProvidedDetailsOptions
  {
      Email = "user@example.com",
  },
  Metadata = new Dictionary<string, string>
  {
    {"user_id", "{{USER_ID}}"},
  },
};

var service = new VerificationSessionService();
var verificationSession = service.Create(options);

// return only the client secret to the frontend.
var clientSecret = verificationSession.ClientSecret;
```

This example demonstrates how to fetch the client secret with JavaScript on the client side:

```javascript
(async () => {
  const response = await fetch("/create-verification-session");
  const { client_secret: clientSecret } = await response.json();
  // Call stripe.verifyIdentity() with the client secret.
})();
```

The client secret is a sensitive token that you can use to complete the verification. Don’t log it, embed it in URLs, or expose it to anyone but the user that you’re verifying. Make sure that you have _TLS_ on any page that includes the client secret.

## Accessing verification results

Submitting and processing a VerificationSession updates the session `status` and creates a [VerificationReport](https://docs.stripe.com/api/identity/verification_reports/object.md) object. This normally happens within a few minutes.

Once all of the verification checks have passed, the status changes to `verified`. You can [expand](https://docs.stripe.com/api/expanding_objects.md) the [verified_outputs](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-verified_outputs) field to see the verified data.

```json
{
  "id": "vs_",
  "object": "identity.verification_session",
  "created": 1610744321,
  "last_error": null,
  "last_verification_report": "vr_",
  "livemode": true,
  "metadata": {},
  "options": {
    "document": {}
  },
  "status": "verified",
  "type": "document",
  "redaction": null,
  "url": null,
  "verified_outputs": {
    "first_name": "Jenny",
    "last_name": "Rosen",
    "address": {
      "line1": "1234 Main St.",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94111",
      "country": "US"
    },
    "id_number_type": null
  }
}
```

If any of the verification checks fail, the session will have a `requires_input` status. Verification failure details are available in the session [last_error](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-last_error) hash. The [last_error.code](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-last_error-code) value can be used to programmatically handle common verification failures. The [last_error.reason](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-last_error-code) will contain a string that explains the failure reason and can be shown to your user.

```json
{
  "id": "vs_",
  "object": "identity.verification_session",
  "created": 1610744321,
  "last_error": {
    "code": "document_expired",
    "reason": "The document is expired."
  },
  "last_verification_report": "vr_",
  "livemode": true,
  "metadata": {},
  "options": {},
  "status": "requires_input",
  "type": "document",
  "redaction": null,
  "url": null
}
```

If you want your user to attempt verification again, you’ll need to [Retrieve the VerificationSession](https://docs.stripe.com/api/identity/verification_sessions/retrieve.md) to get a fresh URL or client secret to pass to your client.

Learn how to [access sensitive verification results](https://docs.stripe.com/identity/access-verification-results.md)

## Cancelling a VerificationSession

You can cancel a VerificationSession at any point before it’s `processing` or `verified`. This invalidates the VerificationSession for future submission attempts, and can’t be undone. The session will have a `canceled` status.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new Stripe.Identity.VerificationSessionService();
Stripe.Identity.VerificationSession verificationSession = service.Cancel(
    "<<identityVerificationSession>>");
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.IdentityVerificationSessionCancelParams{};
result, err := verificationsession.Cancel("<<identityVerificationSession>>", params);
```

```java
Stripe.apiKey = "<<secret key>>";

VerificationSession resource = VerificationSession.retrieve("<<identityVerificationSession>>");

VerificationSessionCancelParams params = VerificationSessionCancelParams.builder().build();

VerificationSession verificationSession = resource.cancel(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const verificationSession = await stripe.identity.verificationSessions.cancel(
  "<<identityVerificationSession>>"
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

verification_session = stripe.identity.VerificationSession.cancel("<<identityVerificationSession>>")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$verificationSession = $stripe->identity->verificationSessions->cancel(
  '<<identityVerificationSession>>',
  []
);
```

```ruby
Stripe.api_key = '<<secret key>>'

verification_session = Stripe::Identity::VerificationSession.cancel('<<identityVerificationSession>>')
```

## Redacting a VerificationSession

One of the reasons that you might want to redact a verification session is if you receive a data deletion request from your user. You can redact a session to ensure collected information is no longer returned by the Stripe API or visible in Dashboard. You can still [retrieve](https://docs.stripe.com/api/identity/verification_sessions/retrieve.md) redacted sessions with the API but you can’t update them. Sessions can be redacted from the Dashboard or through the API:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new Stripe.Identity.VerificationSessionService();
Stripe.Identity.VerificationSession verificationSession = service.Redact(
    "<<identityVerificationSession>>");
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.IdentityVerificationSessionRedactParams{};
result, err := verificationsession.Redact("<<identityVerificationSession>>", params);
```

```java
Stripe.apiKey = "<<secret key>>";

VerificationSession resource = VerificationSession.retrieve("<<identityVerificationSession>>");

VerificationSessionRedactParams params = VerificationSessionRedactParams.builder().build();

VerificationSession verificationSession = resource.redact(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const verificationSession = await stripe.identity.verificationSessions.redact(
  "<<identityVerificationSession>>"
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

verification_session = stripe.identity.VerificationSession.redact("<<identityVerificationSession>>")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$verificationSession = $stripe->identity->verificationSessions->redact(
  '<<identityVerificationSession>>',
  []
);
```

```ruby
Stripe.api_key = '<<secret key>>'

verification_session = Stripe::Identity::VerificationSession.redact('<<identityVerificationSession>>')
```

Redacted sessions show placeholder values for all fields that previously contained personally identifiable information (PII). The session includes a [redaction.status](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-redaction-status) field indicating the status of the redaction process. An [identity.verification_session.redacted](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.redacted) webhook will be sent when the session is redacted. Please note redaction can take up to 4 days.

If a VerificationSession that has been redacted is retrieved with PII fields expanded, then these
fields will still appear in the response but their values will not contain any PII. For example,
here is a response that has expanded the `verified_outputs` and `verified_outputs.dob` fields on a
redacted VerificationSession.

```json
{
  "id": "vs_",
  "object": "identity.verification_session",
  "created": 1610744321,
  "last_error": null,
  "last_verification_report": "vr_",
  "livemode": true,
  "options": {},
  "status": "verified",
  "type": "document",
  "url": null,
  "client_secret": null,
  "redaction": {
    "status": "redacted"
  },
  "verified_outputs": {
    "first_name": "[redacted]",
    "last_name": "[redacted]",
    "dob": {
      "year": 1,
      "month": 1,
      "day": 1
    },
    "address": {
      "line1": "[redacted]",
      "city": "[redacted]",
      "state": "[redacted]",
      "postal_code": "[redacted]",
      "country": "US"
    },
    "id_number_type": null
  },
  "metadata": {} // Metadata will also be redacted
}
```

Any [VerificationReports](https://docs.stripe.com/api/identity/verification_reports.md), [Events](https://docs.stripe.com/api/events.md), and [Request Logs](https://dashboard.stripe.com/logs) associated with the VerificationSession are also redacted and [File](https://docs.stripe.com/api/files.md) contents are no longer downloadable.

If the VerificationSession is in the `processing` state you must wait until it finishes before redacting it. Redacting a VerificationSession with `requires_action` status automatically cancels it.

## Storing information in metadata

Stripe supports adding [metadata](https://docs.stripe.com/api.md#metadata) to the VerificationSession object. Metadata isn’t shown to customers or factored into whether a verification check succeeds or fails.

Through metadata, you can associate other information—meaningful to you—with Stripe activity. Any metadata you include is viewable in the Dashboard (for example, when looking at the page for an individual session), and is also available in common reports. As an example, you can attach your application’s user ID to the VerificationSession used to verify that user. Doing so allows you, or your team to easily reconcile verifications in Stripe to users in your system.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Identity.VerificationSessionCreateOptions
{
    Type = "document",
    Metadata = new Dictionary<string, string>
    {
        { "user_id", "{{USER_ID}}" },
        { "reference", "{{IDENTIFIER}}" },
    },
};
var service = new Stripe.Identity.VerificationSessionService();
Stripe.Identity.VerificationSession verificationSession = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.IdentityVerificationSessionParams{
  Type: stripe.String(string(stripe.IdentityVerificationSessionTypeDocument)),
};
params.AddMetadata("user_id", "{{USER_ID}}")
params.AddMetadata("reference", "{{IDENTIFIER}}")
result, err := verificationsession.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

VerificationSessionCreateParams params =
  VerificationSessionCreateParams.builder()
    .setType(VerificationSessionCreateParams.Type.DOCUMENT)
    .putMetadata("user_id", "{{USER_ID}}")
    .putMetadata("reference", "{{IDENTIFIER}}")
    .build();

VerificationSession verificationSession = VerificationSession.create(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const verificationSession = await stripe.identity.verificationSessions.create({
  type: "document",
  metadata: {
    user_id: "{{USER_ID}}",
    reference: "{{IDENTIFIER}}",
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

verification_session = stripe.identity.VerificationSession.create(
  type="document",
  metadata={"user_id": "{{USER_ID}}", "reference": "{{IDENTIFIER}}"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$verificationSession = $stripe->identity->verificationSessions->create([
  'type' => 'document',
  'metadata' => [
    'user_id' => '{{USER_ID}}',
    'reference' => '{{IDENTIFIER}}',
  ],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

verification_session = Stripe::Identity::VerificationSession.create({
  type: 'document',
  metadata: {
    user_id: '{{USER_ID}}',
    reference: '{{IDENTIFIER}}',
  },
})
```

We recommend you don’t store any sensitive information (PII, ID numbers, and so on) in session metadata. Metadata is removed when you redact a VerificationSession.

## Session events

[Events](https://docs.stripe.com/api/events.md) are created every time a session changes status. Here’s a complete list of the VerificationSession [event types](https://docs.stripe.com/api.md#event_types):

| Event type                                   | Description                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| identity.verification_session.created        | The session was [created](https://docs.stripe.com/identity/verification-sessions.md#create).                                                                                                                                                                                                                                        |
| identity.verification_session.processing     | The user has successfully submitted their information, and verification checks have started processing.                                                                                                                                                                                                                             |
| identity.verification_session.verified       | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified.                                                                                                                                                                         |
| identity.verification_session.requires_input | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed.                                                                                                                                                                         |
| identity.verification_session.canceled       | The session has been canceled and future submission attempts have been disabled. This event is sent when a session is [canceled](https://docs.stripe.com/identity/verification-sessions.md#cancel) or [redacted](https://docs.stripe.com/identity/verification-sessions.md#redact).                                                 |
| identity.verification_session.redacted       | The session was [redacted](https://docs.stripe.com/identity/verification-sessions.md#redact). You must create a [webhook endpoint](https://docs.stripe.com/api/webhook_endpoints.md) which explicitly subscribes to this event type to access it. Webhook endpoints which subscribe to all events will not include this event type. |

You might want to take action in response to certain events, such as emailing your user when a verification fails or succeeds.

Stripe recommends that you listen for events with [webhooks](https://docs.stripe.com/identity/handle-verification-outcomes.md).

## See Also

- [Verify your users’ identity documents](https://docs.stripe.com/identity/verify-identity-documents.md)
