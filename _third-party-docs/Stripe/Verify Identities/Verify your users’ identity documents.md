# Verify your users’ identity documents

Create sessions and collect identity documents.

This guide explains how to use Stripe Identity to securely collect and verify identity documents.

1. [Activate your account](https://dashboard.stripe.com/account/onboarding).
1. Fill out your [Stripe Identity application](https://dashboard.stripe.com/identity/application).
1. (Optional) Customize your brand settings on the [branding settings page](https://dashboard.stripe.com/settings/branding).

&nbsp;

Show a document upload modal inside your website. Here’s what you’ll do:

1. Add a verification button to your webpage that displays a document upload modal.
1. Display a confirmation page on identity document submission.
1. Handle verification results.

## Set up Stripe

Then install the libraries for access to the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Add a button to your website

Create a button on your website for starting the verification.

### Add a button

Start by adding a verify button to your page:

```html
<html>
  <head>
    <title>Verify your identity</title>
  </head>
  <body>
    <button id="verify-button">Verify</button>
  </body>
</html>
```

### Add a button

Start by adding a verify button to your page:

```jsx
import React from "react";

class VerifyButton extends React.Component {
  render() {
    return <button role="link">Verify</button>;
  }
}

const App = () => {
  return <VerifyButton />;
};

export default App;
```

## Show the document upload modal

Set up the new button to show a document upload modal. After clicking the button, your user can capture and upload a picture of their passport, driver’s license, or national ID.

The modal reduces development time and maintenance and allows you to collect identity documents as part of your existing flows. It also decreases the amount of private information you handle on your site, allows you to support users in a variety of platforms and languages, and allows you to customize the style to match your branding.

### Create a VerificationSession

A [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) is the programmatic representation
of the verification. It contains details about the type of verification, such as what
[check](https://docs.stripe.com/identity/verification-checks.md) to perform. You can [expand](https://docs.stripe.com/api/expanding_objects.md) the [verified
outputs](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-verified_outputs) field to see details of the data that was verified.

You can use verification flows for re-usable configuration, which is passed to the [verification_flow](https://docs.stripe.com/api/identity/verification_sessions/create.md#create_identity_verification_session-verification_flow) parameter. Read more in the [Verification flows guide](https://docs.stripe.com/identity/verification-flows.md).

You need a server-side endpoint to [create the VerificationSession](https://docs.stripe.com/api/identity/verification_sessions/create.md). Creating the `VerificationSession` server-side prevents malicious users from overriding verification options and incurring processing charges on your account. Add authentication to this endpoint by including a user reference in the session metadata or storing the session ID in your database.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

Test your endpoint by starting your web server (for example, `localhost:4242`) and sending a POST request with curl to create a VerificationSession:

```bash
curl -X POST -is "http://localhost:4242/create-verification-session" -d ""
```

The response in your terminal looks like this:

```bash
HTTP/1.1 200 OK
Content-Type: application/json

```

### Add an event handler to the verify button

```html
<html>
  <head>
    <title>Verify your identity</title>
    <script src="https://js.stripe.com/basil/stripe.js"></script>
  </head>
  <body>
    <button id="verify-button">Verify</button>

    <script type="text/javascript">
      var verifyButton = document.getElementById("verify-button");

      verifyButton.addEventListener("click", function () {
        // Get the VerificationSession client secret using the server-side
        // endpoint you created in step 3.
        fetch("/create-verification-session", {
          method: "POST",
        })
          .then(function (response) {
            return response.json();
          })
          .catch(function (error) {
            console.error("Error:", error);
          });
      });
    </script>
  </body>
</html>
```

```jsx
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

class VerifyButton extends React.Component {}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("<<publishable key>>");

const App = () => {
  return <VerifyButton stripePromise={stripePromise} />;
};

export default App;
```

### Event error codes

| Error code                    | Description                                                                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `consent_declined`            | The user declined verification by Stripe. Check with your legal counsel to see if you have an obligation to offer an alternative, non-biometric means to verify, such as through a manual review. |
| `device_unsupported`          | The verification requires a camera and the user is on a device without one.                                                                                                                       |
| `under_supported_age`         | Stripe doesn’t verify users under the age of majority.                                                                                                                                            |
| `phone_otp_declined`          | The user is unable to verify the provided phone number.                                                                                                                                           |
| `email_verification_declined` | The user is unable to verify the provided email address.                                                                                                                                          |

### Test the upload modal

Test that the verify button shows a document upload modal:

- Click the verify button, which opens the Stripe document upload modal.
- Ensure no error messages are shown.

If your integration isn’t working:

1. Open the Network tab in your browser’s developer tools.
1. Click the verify button to see if it makes an XHR request to your server-side endpoint (`POST /create-verification-session`).
1. Verify that the request returns a 200 status.
1. Use `console.log(session)` inside your button click listener to confirm that it returns the correct data.

## Show a confirmation page

### Test the confirmation page

Test that your confirmation page works:

- Click your verify button.
- Submit the session by selecting a predefined test case.
- Confirm that the new confirmation page is shown.
- Test the entire flow for failure cases (such as declining consent or refusing camera permissions) and ensure your app handles them without any issues.

Next, find the verification in the Stripe Dashboard. Verification sessions appear in the Dashboard’s [list of VerificationSessions](https://dashboard.stripe.com/identity). Click a session to go to the Session details page. The summary section contains verification results, which you can use in your app.

## Handle verification events

[Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are typically completed as soon as the user redirects back to your site and you can retrieve the result from the API immediately. In some rare cases, the document verification isn’t ready yet and must continue asynchronously. In these cases, you’re notified through webhooks when the verification result is ready. After the processing completes, the VerificationSession status changes from `processing` to `verified`.

Stripe sends the following events when the session status changes:

| Event name                                                                                                                                           | Description                                                                                                                                                 | Next steps                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [identity.verification_session.verified](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.verified)             | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified. | Trigger relevant actions in your application.                                                           |
| [identity.verification_session.requires_input](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.requires_input) | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed. | Trigger relevant actions in your application and potentially allow your user to retry the verification. |

Use a [webhook handler](https://docs.stripe.com/identity/handle-verification-outcomes.md) to receive these events and automate actions like sending a confirmation email, updating the verification results in your database, or completing an onboarding step. You can also view [verification events in the Dashboard](https://dashboard.stripe.com/events?type=identity.%2A).

## Receive events and run business actions

### With code

Build a webhook handler to listen for events and build custom asynchronous verification flows. Test and debug your webhook integration locally with the Stripe CLI.

[Build a custom webhook](https://docs.stripe.com/identity/handle-verification-outcomes.md)

### Without code

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

[View your test verifications in the Dashboard](https://dashboard.stripe.com/test/identity/verification-sessions)

## See Also

- [Handle verification outcomes](https://docs.stripe.com/identity/handle-verification-outcomes.md)
- [Learn about VerificationSessions](https://docs.stripe.com/identity/verification-sessions.md)
- [Learn about Stripe.js](https://docs.stripe.com/payments/elements.md)

Send your users to Stripe to upload their identity documents. Here’s what you’ll do:

1. Add a verification button to your webpage that redirects to Stripe Identity.
1. Display a confirmation page on identity document submission.
1. Handle verification results.

## Set up Stripe

Then install the libraries for access to the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Add a button to your website

Create a button on your website for starting the verification.

### Add a button

Start by adding a verify button to your page:

```html
<html>
  <head>
    <title>Verify your identity</title>
  </head>
  <body>
    <button id="verify-button">Verify</button>
  </body>
</html>
```

### Add a button

Start by adding a verify button to your page:

```jsx
import React from "react";

class VerifyButton extends React.Component {
  render() {
    return <button role="link">Verify</button>;
  }
}

const App = () => {
  return <VerifyButton />;
};

export default App;
```

## Redirect to Stripe Identity

Set up the button to redirect to Stripe Identity. After clicking the button, your frontend redirects to a Stripe-hosted page where they can capture and upload a picture of their passport, driver’s license, or national ID.

The redirect to Stripe Identity cuts down on development time and maintenance and gives you added security. It also decreases the amount of private information you handle on your site, allows you to support users in a variety of platforms and languages, and allows you to customize the style to match your branding.

### Create a VerificationSession

A [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) is the programmatic representation
of the verification. It contains details about the type of verification, such as what
[check](https://docs.stripe.com/identity/verification-checks.md) to perform. You can [expand](https://docs.stripe.com/api/expanding_objects.md) the [verified
outputs](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-verified_outputs) field to see details of the data that was verified.

You can use verification flows for re-usable configuration, which is passed to the [verification_flow](https://docs.stripe.com/api/identity/verification_sessions/create.md#create_identity_verification_session-verification_flow) parameter. Read more in the [Verification flows guide](https://docs.stripe.com/identity/verification-flows.md).

You need a server-side endpoint to [create the VerificationSession](https://docs.stripe.com/api/identity/verification_sessions/create.md). Creating the `VerificationSession` server-side prevents malicious users from overriding verification options and incurring processing charges on your account. Add authentication to this endpoint by including a user reference in the session metadata or storing the session ID in your database.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

Test your endpoint by starting your web server (for example, `localhost:4242`) and sending a POST request with curl to create a VerificationSession:

```bash
curl -X POST -is "http://localhost:4242/create-verification-session" -d ""
```

The response in your terminal looks like this:

```bash
HTTP/1.1 200 OK
Content-Type: application/json

```

### Add an event handler to the verify button

```html
<html>
  <head>
    <title>Verify your identity</title>
    <script src="https://js.stripe.com/basil/stripe.js"></script>
  </head>
  <body>
    <button id="verify-button">Verify</button>

    <script type="text/javascript">
      var verifyButton = document.getElementById("verify-button");

      verifyButton.addEventListener("click", function () {
        // Get the VerificationSession client secret using the server-side
        // endpoint you created in step 3.
        fetch("/create-verification-session", {
          method: "POST",
        })
          .then(function (response) {
            return response.json();
          })
          .catch(function (error) {
            console.error("Error:", error);
          });
      });
    </script>
  </body>
</html>
```

```jsx
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

class VerifyButton extends React.Component {}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("<<publishable key>>");

const App = () => {
  return <VerifyButton stripePromise={stripePromise} />;
};

export default App;
```

### Test the redirect

Test that the verify button redirects to Stripe Identity:

- Click the verify button.
- Ensure your browser redirects to Stripe Identity.

If your integration isn’t working:

1. Open the Network tab in your browser’s developer tools.
1. Click the verify button to see if it makes an XHR request to your server-side endpoint (`POST /create-verification-session`).
1. Verify that the request returns a 200 status.
1. Use `console.log(session)` inside your button click listener to confirm that it returns the correct data.

## Handle verification events

[Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are typically completed as soon as the user redirects back to your site and you can retrieve the result from the API immediately. In some rare cases, the document verification isn’t ready yet and must continue asynchronously. In these cases, you’re notified through webhooks when the verification result is ready. After the processing completes, the VerificationSession status changes from `processing` to `verified`.

Stripe sends the following events when the session status changes:

| Event name                                                                                                                                           | Description                                                                                                                                                 | Next steps                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [identity.verification_session.verified](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.verified)             | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified. | Trigger relevant actions in your application.                                                           |
| [identity.verification_session.requires_input](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.requires_input) | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed. | Trigger relevant actions in your application and potentially allow your user to retry the verification. |

Use a [webhook handler](https://docs.stripe.com/identity/handle-verification-outcomes.md) to receive these events and automate actions like sending a confirmation email, updating the verification results in your database, or completing an onboarding step. You can also view [verification events in the Dashboard](https://dashboard.stripe.com/events?type=identity.%2A).

## Receive events and run business actions

### With code

Build a webhook handler to listen for events and build custom asynchronous verification flows. Test and debug your webhook integration locally with the Stripe CLI.

[Build a custom webhook](https://docs.stripe.com/identity/handle-verification-outcomes.md)

### Without code

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

[View your test verifications in the Dashboard](https://dashboard.stripe.com/test/identity/verification-sessions)

## Show a confirmation page

### Test the confirmation page

Test that your confirmation page works:

- Click your verify button.
- Submit the session by selecting a predefined test case.
- Confirm that the new confirmation page is shown.
- Test the entire flow for failure cases (such as declining consent or refusing camera permissions) and ensure your app handles them without any issues.

Next, find the verification in the Stripe Dashboard. Verification sessions appear in the Dashboard’s [list of VerificationSessions](https://dashboard.stripe.com/identity). Click a session to go to the Session details page. The summary section contains verification results, which you can use in your app.

## See Also

- [Handle verification outcomes](https://docs.stripe.com/identity/handle-verification-outcomes.md)
- [Learn about VerificationSessions](https://docs.stripe.com/identity/verification-sessions.md)
- [Learn about Stripe.js](https://docs.stripe.com/payments/elements.md)

To get access to the Identity iOS SDK, visit the [Identity Settings](https://dashboard.stripe.com/settings/identity) page and click **Enable**.

To verify the identity of your users on iOS, present a verification sheet in your application. This guide includes the following steps:

1. Set up Stripe.
1. Add a server endpoint.
1. Present the verification sheet.
1. Handle verification events.

The steps in this guide are fully implemented in the [example app](https://github.com/stripe/stripe-ios/tree/master/Example/IdentityVerification%20Example) and [example backend server](https://codesandbox.io/p/devbox/compassionate-violet-gshhgf).

## Set up

If you intend to use this SDK with Stripe’s Identity service, you must not modify this SDK. Using a modified version of this SDK with Stripe’s Identity service, without Stripe’s written authorization, is a breach of your agreement with Stripe and might result in your Stripe account being shut down.

### Install the SDK

The [Stripe iOS SDK](https://github.com/stripe/stripe-ios) is open source, [fully documented](https://stripe.dev/stripe-ios/index.html), and compatible with apps supporting iOS {{minimumiOSVersion}} or above.

For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-ios/releases) page on GitHub. To receive notifications when a new release is published, [watch releases](https://help.github.com/en/articles/watching-and-unwatching-releases-for-a-repository#watching-releases-for-a-repository) for the repository.

### Set up camera authorization

The Stripe Identity iOS SDK requires access to the device’s camera to capture identity documents. To enable your app to request camera permissions:

1. Open your project’s **Info.plist** in Xcode.
1. Add the `NSCameraUsageDescription` key.
1. Add a string value that explains to your users why your app requires camera permissions, something such as:

> This app uses the camera to take a picture of your identity documents.

See [Apple’s documentation](https://developer.apple.com/documentation/avfoundation/cameras_and_media_capture/requesting_authorization_for_media_capture_on_ios) to learn more about requesting camera authorization.

### Install Stripe on your server

Then install the libraries for access to the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Add a server endpoint

### Create a VerificationSession

A [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) is the programmatic representation
of the verification. It contains details about the type of verification, such as what
[check](https://docs.stripe.com/identity/verification-checks.md) to perform. You can [expand](https://docs.stripe.com/api/expanding_objects.md) the [verified
outputs](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-verified_outputs) field to see details of the data that was verified.

You can use verification flows for re-usable configuration, which is passed to the [verification_flow](https://docs.stripe.com/api/identity/verification_sessions/create.md#create_identity_verification_session-verification_flow) parameter. Read more in the [Verification flows guide](https://docs.stripe.com/identity/verification-flows.md).

You need a server-side endpoint to [create the VerificationSession](https://docs.stripe.com/api/identity/verification_sessions/create.md). Creating the `VerificationSession` server-side prevents malicious users from overriding verification options and incurring processing charges on your account. Add authentication to this endpoint by including a user reference in the session metadata or storing the session ID in your database.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

Test your endpoint by starting your web server (for example, `localhost:4242`) and sending a POST request with curl to create a VerificationSession:

```bash
curl -X POST -is "http://localhost:4242/create-verification-session" -d ""
```

The response in your terminal looks like this:

```bash
HTTP/1.1 200 OK
Content-Type: application/json

```

## Present the verification sheet

Set up a button to . After tapping the button, your user can capture and upload a picture of their passport, driver’s license, or national ID.

Before getting started, your verification page should:

- Explain to the user why they need to verify their identity.
- Include a verify identity button to present Stripe’s UI.

## Handle verification events

[Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are typically completed as soon as the user redirects back to your site and you can retrieve the result from the API immediately. In some rare cases, the document verification isn’t ready yet and must continue asynchronously. In these cases, you’re notified through webhooks when the verification result is ready. After the processing completes, the VerificationSession status changes from `processing` to `verified`.

Stripe sends the following events when the session status changes:

| Event name                                                                                                                                           | Description                                                                                                                                                 | Next steps                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [identity.verification_session.verified](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.verified)             | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified. | Trigger relevant actions in your application.                                                           |
| [identity.verification_session.requires_input](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.requires_input) | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed. | Trigger relevant actions in your application and potentially allow your user to retry the verification. |

Use a [webhook handler](https://docs.stripe.com/identity/handle-verification-outcomes.md) to receive these events and automate actions like sending a confirmation email, updating the verification results in your database, or completing an onboarding step. You can also view [verification events in the Dashboard](https://dashboard.stripe.com/events?type=identity.%2A).

## Receive events and run business actions

### With code

Build a webhook handler to listen for events and build custom asynchronous verification flows. Test and debug your webhook integration locally with the Stripe CLI.

[Build a custom webhook](https://docs.stripe.com/identity/handle-verification-outcomes.md)

### Without code

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

[View your test verifications in the Dashboard](https://dashboard.stripe.com/test/identity/verification-sessions)

To get access to the Identity iOS SDK, visit the [Identity Settings](https://dashboard.stripe.com/settings/identity) page and click **Enable**.

This guide demonstrates how to migrate a Stripe Identity integration from [Web Redirect](https://docs.stripe.com/identity/verify-identity-documents.md?platform=web&type=redirect) to native iOS SDK for your mobile app. This guide includes the following steps:

1. Set up Stripe.
1. Update your server endpoint.
1. Present the verification sheet.
1. Handle verification events.

The steps in this guide are fully implemented in the [example app](https://github.com/stripe/stripe-ios/tree/master/Example/IdentityVerification%20Example) and [example backend server](https://codesandbox.io/p/devbox/compassionate-violet-gshhgf).

## Set up

If you intend to use this SDK with Stripe’s Identity service, you must not modify this SDK. Using a modified version of this SDK with Stripe’s Identity service, without Stripe’s written authorization, is a breach of your agreement with Stripe and might result in your Stripe account being shut down.

### Install the SDK

The [Stripe iOS SDK](https://github.com/stripe/stripe-ios) is open source, [fully documented](https://stripe.dev/stripe-ios/index.html), and compatible with apps supporting iOS {{minimumiOSVersion}} or above.

For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-ios/releases) page on GitHub. To receive notifications when a new release is published, [watch releases](https://help.github.com/en/articles/watching-and-unwatching-releases-for-a-repository#watching-releases-for-a-repository) for the repository.

### Set up camera authorization

The Stripe Identity iOS SDK requires access to the device’s camera to capture identity documents. To enable your app to request camera permissions:

1. Open your project’s **Info.plist** in Xcode.
1. Add the `NSCameraUsageDescription` key.
1. Add a string value that explains to your users why your app requires camera permissions, something such as:

> This app uses the camera to take a picture of your identity documents.

See [Apple’s documentation](https://developer.apple.com/documentation/avfoundation/cameras_and_media_capture/requesting_authorization_for_media_capture_on_ios) to learn more about requesting camera authorization.

### Install Stripe on your server

Then install the libraries for access to the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Update the server endpoint

### Existing web integration

If you had a [Modal](https://docs.stripe.com/identity/verify-identity-documents.md?platform=web&type=modal) integration, a [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) was created and `VerificationSession` [client_secret](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-client_secret) was passed to the Stripe API object.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

If you had a [redirect](https://docs.stripe.com/identity/verify-identity-documents.md?platform=web&type=redirect) integration, a [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) was created and the `VerificationSession` [url](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-url) was sent to the client mobile app and opened within an in-app browser.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

### Migrate to SDK integration

To use native SDK, create the same [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) and create an ephemeral key secret.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

After successfully creating a `VerificationSession` and ephemeral key, send the `VerificationSession` [ID](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-id) and `ephemeral key secret` to the client mobile app.

You can find a running implementation of this endpoint [available here](https://codesandbox.io/p/devbox/compassionate-violet-gshhgf) for quick testing.

The ephemeral key secret lets your app collect sensitive verification information. It’s single-use and expires after 1 hour. Don’t store it, log it, embed it in a URL, or expose it to anyone other than the user. Make sure that you have TLS enabled on any endpoint that returns the ephemeral key secret. Send only the ephemeral key secret to your app to avoid exposing the verification configuration or results.

## Present the verification sheet

Set up a button to . After tapping the button, your user can capture and upload a picture of their passport, driver’s license, or national ID.

Before getting started, your verification page should:

- Explain to the user why they need to verify their identity.
- Include a verify identity button to present Stripe’s UI.

## Handle verification events

[Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are typically completed as soon as the user redirects back to your site and you can retrieve the result from the API immediately. In some rare cases, the document verification isn’t ready yet and must continue asynchronously. In these cases, you’re notified through webhooks when the verification result is ready. After the processing completes, the VerificationSession status changes from `processing` to `verified`.

Stripe sends the following events when the session status changes:

| Event name                                                                                                                                           | Description                                                                                                                                                 | Next steps                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [identity.verification_session.verified](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.verified)             | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified. | Trigger relevant actions in your application.                                                           |
| [identity.verification_session.requires_input](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.requires_input) | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed. | Trigger relevant actions in your application and potentially allow your user to retry the verification. |

Use a [webhook handler](https://docs.stripe.com/identity/handle-verification-outcomes.md) to receive these events and automate actions like sending a confirmation email, updating the verification results in your database, or completing an onboarding step. You can also view [verification events in the Dashboard](https://dashboard.stripe.com/events?type=identity.%2A).

## Receive events and run business actions

### With code

Build a webhook handler to listen for events and build custom asynchronous verification flows. Test and debug your webhook integration locally with the Stripe CLI.

[Build a custom webhook](https://docs.stripe.com/identity/handle-verification-outcomes.md)

### Without code

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

[View your test verifications in the Dashboard](https://dashboard.stripe.com/test/identity/verification-sessions)

To get access to the Identity Android SDK, visit the [Identity Settings](https://dashboard.stripe.com/settings/identity) page and click **Enable**.

To verify the identity of your users on Android, present a verification sheet in your application. This guide includes the following steps:

1. Set up Stripe.
1. Add a server endpoint.
1. Present the verification sheet.
1. Handle verification events.

The steps in this guide are fully implemented in the [example app](https://github.com/stripe/stripe-android/tree/master/identity-example) and [example backend server](https://codesandbox.io/p/devbox/compassionate-violet-gshhgf).

## Set up

If you intend to use this SDK with Stripe’s Identity service, you must not modify this SDK. Using a modified version of this SDK with Stripe’s Identity service, without Stripe’s written authorization, is a breach of your agreement with Stripe and might result in your Stripe account being shut down.

### Install the SDK

```kotlin
plugins {
    id("com.android.application")
}


dependencies {
  // ...

}
```

```groovy
apply plugin: 'com.android.application'

android { ... }

dependencies {
  // ...

}
```

For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-android/releases) page on GitHub. To receive notifications when a new release is published, [watch releases for the repository](https://docs.github.com/en/github/managing-subscriptions-and-notifications-on-github/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository).

### Use TFLite in Google Play to reduce binary size

Identity Android SDK uses a portable TFLite runtime to execute AI models. If your application is released through Google Play, you can use the Google Play runtime to reduce SDK size by about 1.2mb.

```groovy
dependencies {
  // ...

  // Stripe Identity Android SDK
  implementation('com.stripe:identity:21.20.2') {
    exclude group: 'com.stripe', module: 'ml-core-default' // exclude the default TFLite runtime
  }
  implementation('com.stripe:ml-core-googleplay:21.20.2') // include the Google Play TFLite runtime
}
```

```kotlin
dependencies {
    // ...

    // Stripe Identity Android SDK
    implementation("com.stripe:identity:21.20.2") {
        exclude(group = "com.stripe", module = "ml-core-default") // exclude the default TFLite runtime
    }
    implementation("com.stripe:ml-core-googleplay:21.20.2") // include the Google Play TFLite runtime
}
```

### Set up material theme

The Stripe Identity Android SDK requires the hosting activity to use material theme. To enable material theme:

1. Open your project’s `app/src/main/AndroidManifest.xml`.
1. Make sure the `android:theme` applied to the `application` is a child of one of the material themes(for example, `Theme.MaterialComponents.DayNight`).

See more details about material theme [here](https://material.io/develop/android/theming/dark).

### Install Stripe on your server

Then install the libraries for access to the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Add a server endpoint

### Create a VerificationSession

A [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) is the programmatic representation
of the verification. It contains details about the type of verification, such as what
[check](https://docs.stripe.com/identity/verification-checks.md) to perform. You can [expand](https://docs.stripe.com/api/expanding_objects.md) the [verified
outputs](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-verified_outputs) field to see details of the data that was verified.

You can use verification flows for re-usable configuration, which is passed to the [verification_flow](https://docs.stripe.com/api/identity/verification_sessions/create.md#create_identity_verification_session-verification_flow) parameter. Read more in the [Verification flows guide](https://docs.stripe.com/identity/verification-flows.md).

You need a server-side endpoint to [create the VerificationSession](https://docs.stripe.com/api/identity/verification_sessions/create.md). Creating the `VerificationSession` server-side prevents malicious users from overriding verification options and incurring processing charges on your account. Add authentication to this endpoint by including a user reference in the session metadata or storing the session ID in your database.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

Test your endpoint by starting your web server (for example, `localhost:4242`) and sending a POST request with curl to create a VerificationSession:

```bash
curl -X POST -is "http://localhost:4242/create-verification-session" -d ""
```

The response in your terminal looks like this:

```bash
HTTP/1.1 200 OK
Content-Type: application/json

```

## Present the verification sheet

Set up a button to . After tapping the button, your user can capture and upload a picture of their passport, driver’s license, or national ID.

Before getting started, your verification page should:

- Explain to the user why they need to verify their identity.
- Include a verify identity button to present Stripe’s UI.

## Handle verification events

[Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are typically completed as soon as the user redirects back to your site and you can retrieve the result from the API immediately. In some rare cases, the document verification isn’t ready yet and must continue asynchronously. In these cases, you’re notified through webhooks when the verification result is ready. After the processing completes, the VerificationSession status changes from `processing` to `verified`.

Stripe sends the following events when the session status changes:

| Event name                                                                                                                                           | Description                                                                                                                                                 | Next steps                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [identity.verification_session.verified](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.verified)             | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified. | Trigger relevant actions in your application.                                                           |
| [identity.verification_session.requires_input](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.requires_input) | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed. | Trigger relevant actions in your application and potentially allow your user to retry the verification. |

Use a [webhook handler](https://docs.stripe.com/identity/handle-verification-outcomes.md) to receive these events and automate actions like sending a confirmation email, updating the verification results in your database, or completing an onboarding step. You can also view [verification events in the Dashboard](https://dashboard.stripe.com/events?type=identity.%2A).

## Receive events and run business actions

### With code

Build a webhook handler to listen for events and build custom asynchronous verification flows. Test and debug your webhook integration locally with the Stripe CLI.

[Build a custom webhook](https://docs.stripe.com/identity/handle-verification-outcomes.md)

### Without code

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

[View your test verifications in the Dashboard](https://dashboard.stripe.com/test/identity/verification-sessions)

To get access to the Identity Android SDK, visit the [Identity Settings](https://dashboard.stripe.com/settings/identity) page and click **Enable**.

This guide demonstrates how to migrate a Stripe Identity integration from [Web Redirect](https://docs.stripe.com/identity/verify-identity-documents.md?platform=web&type=redirect) to native Android SDK for your mobile app. This guide includes the following steps:

1. Set up Stripe.
1. Update your server endpoint.
1. Present the verification sheet.
1. Handle verification events.

The steps in this guide are fully implemented in the [example app](https://github.com/stripe/stripe-android/tree/master/identity-example) and [example backend server](https://codesandbox.io/p/devbox/compassionate-violet-gshhgf).

## Set up

If you intend to use this SDK with Stripe’s Identity service, you must not modify this SDK. Using a modified version of this SDK with Stripe’s Identity service, without Stripe’s written authorization, is a breach of your agreement with Stripe and might result in your Stripe account being shut down.

### Install the SDK

```kotlin
plugins {
    id("com.android.application")
}


dependencies {
  // ...

}
```

```groovy
apply plugin: 'com.android.application'

android { ... }

dependencies {
  // ...

}
```

For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-android/releases) page on GitHub. To receive notifications when a new release is published, [watch releases for the repository](https://docs.github.com/en/github/managing-subscriptions-and-notifications-on-github/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository).

### Use TFLite in Google Play to reduce binary size

Identity Android SDK uses a portable TFLite runtime to execute AI models. If your application is released through Google Play, you can use the Google Play runtime to reduce SDK size by about 1.2mb.

```groovy
dependencies {
  // ...

  // Stripe Identity Android SDK
  implementation('com.stripe:identity:21.20.2') {
    exclude group: 'com.stripe', module: 'ml-core-default' // exclude the default TFLite runtime
  }
  implementation('com.stripe:ml-core-googleplay:21.20.2') // include the Google Play TFLite runtime
}
```

```kotlin
dependencies {
    // ...

    // Stripe Identity Android SDK
    implementation("com.stripe:identity:21.20.2") {
        exclude(group = "com.stripe", module = "ml-core-default") // exclude the default TFLite runtime
    }
    implementation("com.stripe:ml-core-googleplay:21.20.2") // include the Google Play TFLite runtime
}
```

### Set up material theme

The Stripe Identity Android SDK requires the hosting activity to use material theme. To enable material theme:

1. Open your project’s `app/src/main/AndroidManifest.xml`.
1. Make sure the `android:theme` applied to the `application` is a child of one of the material themes(for example, `Theme.MaterialComponents.DayNight`).

See more details about material theme [here](https://material.io/develop/android/theming/dark).

### Install Stripe on your server

Then install the libraries for access to the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Update the server endpoint

### Existing web integration

If you had a [Modal](https://docs.stripe.com/identity/verify-identity-documents.md?platform=web&type=modal) integration, a [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) was created and `VerificationSession` [client_secret](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-client_secret) was passed to the Stripe API object.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

If you had a [redirect](https://docs.stripe.com/identity/verify-identity-documents.md?platform=web&type=redirect) integration, a [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) was created and the `VerificationSession` [url](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-url) was sent to the client mobile app and opened within an in-app browser.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

### Migrate to SDK integration

To use native SDK, create the same [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) and create an ephemeral key secret.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

After successfully creating a `VerificationSession` and ephemeral key, send the `VerificationSession` [ID](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-id) and `ephemeral key secret` to the client mobile app.

You can find a running implementation of this endpoint [available here](https://codesandbox.io/p/devbox/compassionate-violet-gshhgf) for quick testing.

The ephemeral key secret lets your app collect sensitive verification information. It’s single-use and expires after 1 hour. Don’t store it, log it, embed it in a URL, or expose it to anyone other than the user. Make sure that you have TLS enabled on any endpoint that returns the ephemeral key secret. Send only the ephemeral key secret to your app to avoid exposing the verification configuration or results.

## Present the verification sheet

Set up a button to . After tapping the button, your user can capture and upload a picture of their passport, driver’s license, or national ID.

Before getting started, your verification page should:

- Explain to the user why they need to verify their identity.
- Include a verify identity button to present Stripe’s UI.

## Handle verification events

[Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are typically completed as soon as the user redirects back to your site and you can retrieve the result from the API immediately. In some rare cases, the document verification isn’t ready yet and must continue asynchronously. In these cases, you’re notified through webhooks when the verification result is ready. After the processing completes, the VerificationSession status changes from `processing` to `verified`.

Stripe sends the following events when the session status changes:

| Event name                                                                                                                                           | Description                                                                                                                                                 | Next steps                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [identity.verification_session.verified](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.verified)             | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified. | Trigger relevant actions in your application.                                                           |
| [identity.verification_session.requires_input](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.requires_input) | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed. | Trigger relevant actions in your application and potentially allow your user to retry the verification. |

Use a [webhook handler](https://docs.stripe.com/identity/handle-verification-outcomes.md) to receive these events and automate actions like sending a confirmation email, updating the verification results in your database, or completing an onboarding step. You can also view [verification events in the Dashboard](https://dashboard.stripe.com/events?type=identity.%2A).

## Receive events and run business actions

### With code

Build a webhook handler to listen for events and build custom asynchronous verification flows. Test and debug your webhook integration locally with the Stripe CLI.

[Build a custom webhook](https://docs.stripe.com/identity/handle-verification-outcomes.md)

### Without code

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

[View your test verifications in the Dashboard](https://dashboard.stripe.com/test/identity/verification-sessions)

To get access to the Identity React Native SDK, visit the [Identity Settings](https://dashboard.stripe.com/settings/identity) page and click **Enable**.

To verify the identity of your users on React Native, present a verification sheet in your application. This guide includes the following steps:

1. Set up Stripe.
1. Add a server endpoint.
1. Present the verification sheet.
1. Handle verification events.

The steps in this guide are fully implemented in the [example app](https://github.com/stripe/stripe-identity-react-native/tree/main/example) and [example backend server](https://codesandbox.io/p/devbox/compassionate-violet-gshhgf).

## Set up

### Install the SDK

The [React Native SDK](https://github.com/stripe/stripe-identity-react-native) is open source, [fully documented](https://stripe.dev/stripe-identity-react-native), and compatible with apps supporting iOS 13.0 or Android 5.0 (API level 21) and above. Internally, it uses native [iOS](https://github.com/stripe/stripe-ios/tree/master/StripeIdentity) and [Android](https://github.com/stripe/stripe-android/tree/master/identity) SDKs.

Install the SDK by running:

```bash
yarn add @stripe/stripe-identity-react-native
```

```bash
npm install @stripe/stripe-identity-react-native
```

For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-identity-react-native/releases) page on GitHub. To receive notifications when a new release is published, [watch releases for the repository](https://help.github.com/en/articles/watching-and-unwatching-releases-for-a-repository#watching-releases-for-a-repository).

For iOS, run `pod install` in the `ios` directory to ensure that you also install the required native dependencies. Android doesn’t require any additional steps.

### Set up camera authorization for iOS

The Stripe Identity iOS SDK requires access to the device’s camera to capture identity documents. To enable your app to request camera permissions:

1. Open your project’s **Info.plist** in Xcode.
1. Add the `NSCameraUsageDescription` key.
1. Add a string value that explains to your users why your app requires camera permissions, something such as:

> This app uses the camera to take a picture of your identity documents.

See [Apple’s documentation](https://developer.apple.com/documentation/avfoundation/cameras_and_media_capture/requesting_authorization_for_media_capture_on_ios) to learn more about requesting camera authorization.

### Set up material theme for Android

The Stripe Identity Android SDK requires the hosting activity to use material theme. To enable material theme:

1. Open your project’s `app/src/main/AndroidManifest.xml`.
1. Make sure the `android:theme` applied to the `application` is a child of one of the material themes(for example, `Theme.MaterialComponents.DayNight`).

See more details about material theme [here](https://material.io/develop/android/theming/dark).

### Install Stripe on your server

Then install the libraries for access to the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Add a server endpoint

### Create a VerificationSession

A [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) is the programmatic representation
of the verification. It contains details about the type of verification, such as what
[check](https://docs.stripe.com/identity/verification-checks.md) to perform. You can [expand](https://docs.stripe.com/api/expanding_objects.md) the [verified
outputs](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-verified_outputs) field to see details of the data that was verified.

You can use verification flows for re-usable configuration, which is passed to the [verification_flow](https://docs.stripe.com/api/identity/verification_sessions/create.md#create_identity_verification_session-verification_flow) parameter. Read more in the [Verification flows guide](https://docs.stripe.com/identity/verification-flows.md).

You need a server-side endpoint to [create the VerificationSession](https://docs.stripe.com/api/identity/verification_sessions/create.md). Creating the `VerificationSession` server-side prevents malicious users from overriding verification options and incurring processing charges on your account. Add authentication to this endpoint by including a user reference in the session metadata or storing the session ID in your database.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

Test your endpoint by starting your web server (for example, `localhost:4242`) and sending a POST request with curl to create a VerificationSession:

```bash
curl -X POST -is "http://localhost:4242/create-verification-session" -d ""
```

The response in your terminal looks like this:

```bash
HTTP/1.1 200 OK
Content-Type: application/json

```

## Present the verification sheet

Set up a button to . After tapping the button, your user can capture and upload a picture of their passport, driver’s license, or national ID.

Before getting started, your verification page should:

- Explain to the user why they need to verify their identity.
- Include a verify identity button to present Stripe’s UI.

## Handle verification events

[Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are typically completed as soon as the user redirects back to your site and you can retrieve the result from the API immediately. In some rare cases, the document verification isn’t ready yet and must continue asynchronously. In these cases, you’re notified through webhooks when the verification result is ready. After the processing completes, the VerificationSession status changes from `processing` to `verified`.

Stripe sends the following events when the session status changes:

| Event name                                                                                                                                           | Description                                                                                                                                                 | Next steps                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [identity.verification_session.verified](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.verified)             | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified. | Trigger relevant actions in your application.                                                           |
| [identity.verification_session.requires_input](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.requires_input) | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed. | Trigger relevant actions in your application and potentially allow your user to retry the verification. |

Use a [webhook handler](https://docs.stripe.com/identity/handle-verification-outcomes.md) to receive these events and automate actions like sending a confirmation email, updating the verification results in your database, or completing an onboarding step. You can also view [verification events in the Dashboard](https://dashboard.stripe.com/events?type=identity.%2A).

## Receive events and run business actions

### With code

Build a webhook handler to listen for events and build custom asynchronous verification flows. Test and debug your webhook integration locally with the Stripe CLI.

[Build a custom webhook](https://docs.stripe.com/identity/handle-verification-outcomes.md)

### Without code

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

[View your test verifications in the Dashboard](https://dashboard.stripe.com/test/identity/verification-sessions)

To get access to the Identity React Native SDK, visit the [Identity Settings](https://dashboard.stripe.com/settings/identity) page and click **Enable**.

This guide demonstrates how to migrate a Stripe Identity integration from [Web Redirect](https://docs.stripe.com/identity/verify-identity-documents.md?platform=web&type=redirect) to native React Native SDK for your mobile app. This guide includes the following steps:

1. Set up Stripe.
1. Update your server endpoint.
1. Present the verification sheet.
1. Handle verification events.

The steps in this guide are fully implemented in the [example app](https://github.com/stripe/stripe-identity-react-native/tree/main/example) and [example backend server](https://codesandbox.io/p/devbox/compassionate-violet-gshhgf).

## Set up

### Install the SDK

The [React Native SDK](https://github.com/stripe/stripe-identity-react-native) is open source, [fully documented](https://stripe.dev/stripe-identity-react-native), and compatible with apps supporting iOS 13.0 or Android 5.0 (API level 21) and above. Internally, it uses native [iOS](https://github.com/stripe/stripe-ios/tree/master/StripeIdentity) and [Android](https://github.com/stripe/stripe-android/tree/master/identity) SDKs.

Install the SDK by running:

```bash
yarn add @stripe/stripe-identity-react-native
```

```bash
npm install @stripe/stripe-identity-react-native
```

For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-identity-react-native/releases) page on GitHub. To receive notifications when a new release is published, [watch releases for the repository](https://help.github.com/en/articles/watching-and-unwatching-releases-for-a-repository#watching-releases-for-a-repository).

For iOS, run `pod install` in the `ios` directory to ensure that you also install the required native dependencies. Android doesn’t require any additional steps.

### Set up camera authorization for iOS

The Stripe Identity iOS SDK requires access to the device’s camera to capture identity documents. To enable your app to request camera permissions:

1. Open your project’s **Info.plist** in Xcode.
1. Add the `NSCameraUsageDescription` key.
1. Add a string value that explains to your users why your app requires camera permissions, something such as:

> This app uses the camera to take a picture of your identity documents.

See [Apple’s documentation](https://developer.apple.com/documentation/avfoundation/cameras_and_media_capture/requesting_authorization_for_media_capture_on_ios) to learn more about requesting camera authorization.

### Set up material theme for Android

The Stripe Identity Android SDK requires the hosting activity to use material theme. To enable material theme:

1. Open your project’s `app/src/main/AndroidManifest.xml`.
1. Make sure the `android:theme` applied to the `application` is a child of one of the material themes(for example, `Theme.MaterialComponents.DayNight`).

See more details about material theme [here](https://material.io/develop/android/theming/dark).

### Install Stripe on your server

Then install the libraries for access to the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Update the server endpoint

### Existing web integration

If you had a [Modal](https://docs.stripe.com/identity/verify-identity-documents.md?platform=web&type=modal) integration, a [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) was created and `VerificationSession` [client_secret](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-client_secret) was passed to the Stripe API object.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

If you had a [redirect](https://docs.stripe.com/identity/verify-identity-documents.md?platform=web&type=redirect) integration, a [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) was created and the `VerificationSession` [url](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-url) was sent to the client mobile app and opened within an in-app browser.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

### Migrate to SDK integration

To use native SDK, create the same [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) and create an ephemeral key secret.

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

```

```python
import stripe

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

```

```php
use Stripe\Stripe;

require 'vendor/autoload.php';

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

```

```java
<<setup key>>

// In the route handler for /create-verification-session:
// Authenticate your user

VerificationSessionCreateParams params = VerificationSessionCreateParams.builder()
  .setType(VerificationSessionCreateParams.Type.DOCUMENT)
  .setProvidedDetails(
    VerificationSessionCreateParams.ProvidedDetails.builder()
      .setEmail("user@example.com")
      .build()
  )
  .putMetadata("user_id", "{{USER_ID}}")
  .build();

// Create the session
VerificationSession verificationSession = VerificationSession.create(params);

```

```go
<<setup key>>

// In the route handler for /create-verification-session:
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

```

After successfully creating a `VerificationSession` and ephemeral key, send the `VerificationSession` [ID](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-id) and `ephemeral key secret` to the client mobile app.

You can find a running implementation of this endpoint [available here](https://codesandbox.io/p/devbox/compassionate-violet-gshhgf) for quick testing.

The ephemeral key secret lets your app collect sensitive verification information. It’s single-use and expires after 1 hour. Don’t store it, log it, embed it in a URL, or expose it to anyone other than the user. Make sure that you have TLS enabled on any endpoint that returns the ephemeral key secret. Send only the ephemeral key secret to your app to avoid exposing the verification configuration or results.

## Present the verification sheet

Set up a button to . After tapping the button, your user can capture and upload a picture of their passport, driver’s license, or national ID.

Before getting started, your verification page should:

- Explain to the user why they need to verify their identity.
- Include a verify identity button to present Stripe’s UI.

## Handle verification events

[Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are typically completed as soon as the user redirects back to your site and you can retrieve the result from the API immediately. In some rare cases, the document verification isn’t ready yet and must continue asynchronously. In these cases, you’re notified through webhooks when the verification result is ready. After the processing completes, the VerificationSession status changes from `processing` to `verified`.

Stripe sends the following events when the session status changes:

| Event name                                                                                                                                           | Description                                                                                                                                                 | Next steps                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [identity.verification_session.verified](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.verified)             | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified. | Trigger relevant actions in your application.                                                           |
| [identity.verification_session.requires_input](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.requires_input) | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed. | Trigger relevant actions in your application and potentially allow your user to retry the verification. |

Use a [webhook handler](https://docs.stripe.com/identity/handle-verification-outcomes.md) to receive these events and automate actions like sending a confirmation email, updating the verification results in your database, or completing an onboarding step. You can also view [verification events in the Dashboard](https://dashboard.stripe.com/events?type=identity.%2A).

## Receive events and run business actions

### With code

Build a webhook handler to listen for events and build custom asynchronous verification flows. Test and debug your webhook integration locally with the Stripe CLI.

[Build a custom webhook](https://docs.stripe.com/identity/handle-verification-outcomes.md)

### Without code

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

[View your test verifications in the Dashboard](https://dashboard.stripe.com/test/identity/verification-sessions)

The Stripe Dashboard is the most common way to create one-off verifications but you can automate this process if you integrate with the API. Here’s what you’ll do:

1. Create a VerificationSession with Dashboard.
1. Share the verification link with you user.
1. View verification results in Dashboard.

## Create a VerificationSession

A [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) is the programmatic representation of the verification. It contains details about the type of verification, such as what [check](https://docs.stripe.com/identity/verification-checks.md) to perform and exposes the [verified outputs](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-verified_outputs).

To create a VerificationSession in the Stripe Dashboard:

1. Navigate to the [Create a session page](https://dashboard.stripe.com/identity/verification-sessions/create).
1. Select **Document check**.
1. Click **Create**.

## Share the verification link with your user

1. Click **Copy verification link**.
1. Share the copied URL with your user.

Verification links expire after 48 hours after creation and are single-use. Only share the link with the user you want to verify. We don’t recommend sending verification links in emails or text messages.

## View verification results

[Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are typically completed as soon as the user redirects back to your site and you can retrieve the result from the API immediately. In some rare cases, the document verification isn’t ready yet and must continue asynchronously. In these cases, you’re notified through webhooks when the verification result is ready. After the processing completes, the VerificationSession status changes from `processing` to `verified`.

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

[View your test verifications in the Dashboard](https://dashboard.stripe.com/test/identity/verification-sessions)

## Create a verification flow

A [flow](https://docs.stripe.com/identity/verification-flows.md) represents re-usable configuration for verifications that you’ll request of your user.

To create a flow in the Dashboard:

1. Navigate to the [Verification flows](https://dashboard.stripe.com/identity/verification-flows?create=true) page in your Dashboard.
1. Fill out the form with your desired configured and click **Save**. You can customize the flow later as needed.

## Share the static link with your user

1. On the flow details page, click the URL to copy it to your clipboard.
1. Share the copied URL with your user.

This URL never expires and is usable to verify any number of users for as long as you keep the flow enabled. You can deactivate a flow on the flow details page. Only share the link with users you want to verify.

## View verification results

When your user completes verification, a verification session is created to hold the results and you can see it in your Dashboard. [Document checks](https://docs.stripe.com/identity/verification-checks.md#document-availability) are asynchronous, which means that verification results aren’t immediately available. An identity document check typically takes 1 to 3 minutes to complete. After the processing completes, the verification session’s status changes from `processing` to `verified`.

Use the Dashboard to view all your verifications, inspect collected data, and understand verification failures.

## See Also

- [Verification flows](https://docs.stripe.com/identity/verification-flows.md)
