# Handle verification outcomes

Listen for verification results so your integration can automatically trigger reactions.

You wrote code to [display a modal to collect identity documents](https://docs.stripe.com/identity/verify-identity-documents.md). Now, when your user submits a document, you can listen to verification results to trigger reactions in your application.

In this guide, you’ll learn how to:

1. Receive an event notification when a verification finishes processing.
1. Handle successful and failed verification checks.
1. Turn your event handler on in production.

[Verification checks](https://docs.stripe.com/identity/verification-checks.md) are asynchronous, which means that verification results aren’t immediately available. When the processing completes, the VerificationSession status updates and the verified information is available. Stripe generates [events](https://docs.stripe.com/api/events.md) every time a session changes status. In this guide, we’ll implement [webhooks](https://docs.stripe.com/webhooks.md) to notify your app when verification results become available.

## Set up Stripe

Install our official libraries for access to the Stripe API from your application:

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

## Create a webhook and handle VerificationSession events

See the [Build a webhook endpoint](https://docs.stripe.com/webhooks/quickstart.md) guide for a step by step explanation on how to create a webhook endpoint.

A [webhook](https://docs.stripe.com/webhooks.md) is an endpoint on your server that receives requests from Stripe, notifying you about events that happen on your account. In this step, we’ll build an endpoint to receive events on VerificationSession [status changes](https://docs.stripe.com/identity/verification-sessions.md).

Webhook endpoints must be publicly accessible so Stripe can send unauthenticated requests. You’ll need to verify that Stripe sent the event by using the Stripe library and request header:

```javascript
<<setup key>>

// You can find your endpoint's secret in your webhook settings
const endpointSecret = 'whsec_...';

// This example uses Express to receive webhooks
const express = require('express');

// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

const app = express();

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
  let event;

  // Verify the event came from Stripe
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Successfully constructed event

  res.json({received: true});
});

app.listen(4242, () => {
  console.log('Running on port 4242');
});
```

```ruby
\# This example sets up an endpoint using the Sinatra framework.


require 'sinatra'
require 'stripe'

<<setup key>>

# You can find your endpoint's secret in your webhook settings
endpoint_secret = 'whsec_...'

set :port, 4242

post '/webhook' do
  event = nil

  # Verify webhook signature and extract the event
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  begin
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    payload = request.body.read
    event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
  rescue JSON::ParserError => e
    # Invalid payload
    return status 400
  rescue Stripe::SignatureVerificationError => e
    # Invalid signature
    return status 400
  end

  status 200
end
```

```python
\# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import stripe

from flask import (
    Flask,
    request,
    Response,
    jsonify,
)
<<setup key>>

app = Flask(__name__)

# You can find your endpoint's secret in your webhook settings
endpoint_secret = 'whsec_...'

@app.route('/webhook', methods=['POST'])
def webhook():
  signature = request.headers.get('stripe-signature')
  payload = request.data

  # Verify webhook signature and extract the event.
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  try:
    event = stripe.Webhook.construct_event(
      payload=payload,
      sig_header=signature,
      secret=endpoint_secret,
    )
  except ValueError as e:
    # Invalid payload.
    return Response(status=400)
  except stripe.error.SignatureVerificationError as e:
    # Invalid Signature.
    return Response(status=400)

  return jsonify(received=True)

if __name__ == "__main__":
  app.run(port=4242)
```

```php
<?php
require 'vendor/autoload.php';

// You can find your endpoint's secret in your webhook settings
$endpoint_secret = 'whsec_...';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$event = null;

try {
  $event = \Stripe\Webhook::constructEvent(
    $payload, $sig_header, $endpoint_secret
  );
} catch(\UnexpectedValueException $e) {
  // Invalid payload
  http_response_code(400);
  exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
  // Invalid signature
  http_response_code(400);
  exit();
}
http_response_code(200);
```

```java
package com.stripe.sample;

import com.stripe.Stripe;
import com.stripe.model.identity.VerificationSession;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.net.Webhook;
import com.google.gson.JsonSyntaxException;
import spark.Response;

// Using Spark.
import static spark.Spark.*;

public class Server {
  public static void main(String[] args) {
    port(4242);
<<setup key>>

    post("/webhook", (request, response) -> {
      String payload = request.body();
      String sigHeader = request.headers("Stripe-Signature");

      // If you are testing your webhook locally with the Stripe CLI you
      // can find the endpoint's secret by running `stripe listen`
      // Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
      String endpointSecret = "whsec_...";

      Event event = null;

      // Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try {
        event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
      } catch (JsonSyntaxException e) {
        // Invalid payload.
        response.status(400);
        return "";
      } catch (SignatureVerificationException e) {
        // Invalid Signature.
        response.status(400);
        return "";
      }

      response.status(200);
      return "";
    });
  }
}
```

```go
package main

import (
  "encoding/json"
  "log"
  "fmt"
  "net/http"
  "io/ioutil"

  "github.com/stripe/stripe-go/v{{golang.major_version}}"
  "github.com/stripe/stripe-go/v{{golang.major_version}}/webhook"

  "os"
)

func main() {
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/apikeys
  stripe.Key = "<<secret key>>"

  http.HandleFunc("/webhook", handleWebhook)
  addr := "localhost:4242"

  log.Printf("Listening on %s ...", addr)
  log.Fatal(http.ListenAndServe(addr, nil))
}

func handleWebhook(w http.ResponseWriter, req *http.Request) {
  const MaxBodyBytes = int64(65536)
  req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
  body, err := ioutil.ReadAll(req.Body)
  if err != nil {
      fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", err)
      w.WriteHeader(http.StatusServiceUnavailable)
      return
  }

  // You can find your endpoint's secret in your webhook settings
  endpointSecret := "whsec_..."

  // Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks#verify-events for more information.
  event, err := webhook.ConstructEvent(body, req.Header.Get("Stripe-Signature"), endpointSecret)

  if err != nil {
      fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", err)
      w.WriteHeader(http.StatusBadRequest) // Return a 400 error on a bad signature.
      return
  }

  w.WriteHeader(http.StatusOK)
}
```

```dotnet
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Stripe;
using Stripe.Identity;

<<setup key>>

namespace Controllers
{
  public class ConnectController : Controller
  {
    [HttpPost("webhook")]
    public async Task<IActionResult> ProcessWebhookEvent()
    {
      var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

      // You can find your endpoint's secret in your webhook settings
      var endpointSecret = "whsec_...";

      // Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try
      {
        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], endpointSecret);
        return Ok();
      }
      catch (Exception e)
      {
        Console.WriteLine(e.ToString());
        return BadRequest();
      }
    }
  }
}
```

Now that you have the basic structure and security in place to listen to notifications from Stripe, update your webhook endpoint to handle verification session events.

All [session events](https://docs.stripe.com/identity/verification-sessions.md#events) include the [VerificationSession](https://docs.stripe.com/api/identity/verification_sessions.md) object, which contains details about the verification checks performed. See [Accessing verification results](https://docs.stripe.com/identity/access-verification-results.md) to learn how to retrieve verified information not included in session events.

Stripe sends the following events when the session status changes:

| Event name                                                                                                                                           | Description                                                                                                                                                 | Next steps                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [identity.verification_session.verified](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.verified)             | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and they’re all successfully verified. | Trigger relevant actions in your application.                                                           |
| [identity.verification_session.requires_input](https://docs.stripe.com/api/events/types.md#event_types-identity.verification_session.requires_input) | Processing of all the [verification checks](https://docs.stripe.com/identity/verification-checks.md) have completed, and at least one of the checks failed. | Trigger relevant actions in your application and potentially allow your user to retry the verification. |

Your webhook code needs to handle the `identity.verification_session.verified` and `identity.verification_session.requires_input` events. You can subscribe to other [session events](https://docs.stripe.com/identity/verification-sessions.md#events) to trigger additional reactions in your app.

### Handle VerificationSession verified status change

The `identity.verification_session.verified` event is sent when verification checks have completed and are all successfully verified.

Add code to your event handler to handle all verification checks passing:

```javascript
<<setup key>>

// You can find your endpoint's secret in your webhook settings
const endpointSecret = 'whsec_...';

// This example uses Express to receive webhooks
const express = require('express');

// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

const app = express();

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
  let event;

  // Verify the event came from Stripe
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Successfully constructed event
  switch (event.type) {
    case 'identity.verification_session.verified': {
      // All the verification checks passed
      const verificationSession = event.data.object;
      break;
    }
  }

  res.json({received: true});
});

app.listen(4242, () => {
  console.log('Running on port 4242');
});
```

```ruby
\# This example sets up an endpoint using the Sinatra framework.


require 'sinatra'
require 'stripe'

<<setup key>>

# You can find your endpoint's secret in your webhook settings
endpoint_secret = 'whsec_...'

set :port, 4242

post '/webhook' do
  event = nil

  # Verify webhook signature and extract the event
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  begin
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    payload = request.body.read
    event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
  rescue JSON::ParserError => e
    # Invalid payload
    return status 400
  rescue Stripe::SignatureVerificationError => e
    # Invalid signature
    return status 400
  end

  case event['type']
  when 'identity.verification_session.verified'
    # All the verification checks passed
    verification_session = event.data.object
  else
    # some other event type
  end

  status 200
end
```

```python
\# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import stripe

from flask import (
    Flask,
    request,
    Response,
    jsonify,
)
<<setup key>>

app = Flask(__name__)

# You can find your endpoint's secret in your webhook settings
endpoint_secret = 'whsec_...'

@app.route('/webhook', methods=['POST'])
def webhook():
  signature = request.headers.get('stripe-signature')
  payload = request.data

  # Verify webhook signature and extract the event.
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  try:
    event = stripe.Webhook.construct_event(
      payload=payload,
      sig_header=signature,
      secret=endpoint_secret,
    )
  except ValueError as e:
    # Invalid payload.
    return Response(status=400)
  except stripe.error.SignatureVerificationError as e:
    # Invalid Signature.
    return Response(status=400)

  if event['type'] == 'identity.verification_session.verified':
    print("All the verification checks passed")
    verification_session = event.data.object

  return jsonify(received=True)

if __name__ == "__main__":
  app.run(port=4242)
```

```php
<?php
require 'vendor/autoload.php';

// You can find your endpoint's secret in your webhook settings
$endpoint_secret = 'whsec_...';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$event = null;

try {
  $event = \Stripe\Webhook::constructEvent(
    $payload, $sig_header, $endpoint_secret
  );
} catch(\UnexpectedValueException $e) {
  // Invalid payload
  http_response_code(400);
  exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
  // Invalid signature
  http_response_code(400);
  exit();
}

if ($event->type == 'identity.verification_session.verified') {
  // All the verification checks passed
  $verification_session = $event->data->object;
}
http_response_code(200);
```

```java
package com.stripe.sample;

import com.stripe.Stripe;
import com.stripe.model.identity.VerificationSession;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.net.Webhook;
import com.google.gson.JsonSyntaxException;
import spark.Response;

// Using Spark.
import static spark.Spark.*;

public class Server {
  public static void main(String[] args) {
    port(4242);
<<setup key>>

    post("/webhook", (request, response) -> {
      String payload = request.body();
      String sigHeader = request.headers("Stripe-Signature");

      // If you are testing your webhook locally with the Stripe CLI you
      // can find the endpoint's secret by running `stripe listen`
      // Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
      String endpointSecret = "whsec_...";

      Event event = null;

      // Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try {
        event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
      } catch (JsonSyntaxException e) {
        // Invalid payload.
        response.status(400);
        return "";
      } catch (SignatureVerificationException e) {
        // Invalid Signature.
        response.status(400);
        return "";
      }

      VerificationSession verificationSession = null;
      EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();

      switch(event.getType()) {
        case "identity.verification_session.verified":
          // All the verification checks passed
          if (dataObjectDeserializer.getObject().isPresent()) {
            verificationSession = (VerificationSession) dataObjectDeserializer.getObject().get();
          } else {
            // Deserialization failed, probably due to an API version mismatch.
            // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
            // instructions on how to handle this case, or return an error here.
          }
          break;
        default:
          // other event type
      }

      response.status(200);
      return "";
    });
  }
}
```

```go
package main

import (
  "encoding/json"
  "log"
  "fmt"
  "net/http"
  "io/ioutil"

  "github.com/stripe/stripe-go/v{{golang.major_version}}"
  "github.com/stripe/stripe-go/v{{golang.major_version}}/webhook"

  "os"
)

func main() {
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/apikeys
  stripe.Key = "<<secret key>>"

  http.HandleFunc("/webhook", handleWebhook)
  addr := "localhost:4242"

  log.Printf("Listening on %s ...", addr)
  log.Fatal(http.ListenAndServe(addr, nil))
}

func handleWebhook(w http.ResponseWriter, req *http.Request) {
  const MaxBodyBytes = int64(65536)
  req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
  body, err := ioutil.ReadAll(req.Body)
  if err != nil {
      fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", err)
      w.WriteHeader(http.StatusServiceUnavailable)
      return
  }

  // You can find your endpoint's secret in your webhook settings
  endpointSecret := "whsec_..."

  // Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks#verify-events for more information.
  event, err := webhook.ConstructEvent(body, req.Header.Get("Stripe-Signature"), endpointSecret)

  if err != nil {
      fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", err)
      w.WriteHeader(http.StatusBadRequest) // Return a 400 error on a bad signature.
      return
  }

  switch event.Type {
  case "identity.verification_session.verified":
      fmt.Fprintf(os.Stdout, "All the verification checks passed\n")
      var verificationSession stripe.IdentityVerificationSession
      err := json.Unmarshal(event.Data.Raw, &verificationSession)
      if err != nil {
          fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
          w.WriteHeader(http.StatusBadRequest)
          return
      }
  default:
    fmt.Fprintf(os.Stdout, "Unhandled event type: %v", event.Type)
  }

  w.WriteHeader(http.StatusOK)
}
```

```dotnet
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Stripe;
using Stripe.Identity;

<<setup key>>

namespace Controllers
{
  public class ConnectController : Controller
  {
    [HttpPost("webhook")]
    public async Task<IActionResult> ProcessWebhookEvent()
    {
      var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

      // You can find your endpoint's secret in your webhook settings
      var endpointSecret = "whsec_...";

      // Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try
      {
        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], endpointSecret);

        // If on SDK version < 46, use class Events instead of EventTypes
        if (stripeEvent.Type == EventTypes.IdentityVerificationSessionVerified) {
            var verificationSession = stripeEvent.Data.Object as VerificationSession;
            // All the verification checks passed
        }
        return Ok();
      }
      catch (Exception e)
      {
        Console.WriteLine(e.ToString());
        return BadRequest();
      }
    }
  }
}
```

When handling this event, you might also consider:

- Saving the verification status in your own database
- Sending an email to your user letting them know they’ve been verified
- [Expanding](https://docs.stripe.com/api/expanding_objects.md) the VerificationSession [verified outputs](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-verified_outputs) and comparing them against an expected value.

### Handle VerificationSession requires_input status changes

The `identity.verification_session.requires_input` event is sent when at least one of the checks failed. You can inspect the [last_error](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-last_error) hash on the verification session to handle specific failure reasons:

- The [last_error.code](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-last_error-code) field can be used to programmatically handle verification failures.
- The [last_error.reason](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-last_error-reason) field contains a descriptive message explaining the failure reason and can be shown to your user.

#### Event error codes

| Error code              | Description                                                                                                                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `consent_declined`      | The user declined to be verified by Stripe. Check with your legal counsel to see if you have an obligation to offer an alternative, non-biometric means to verify, such as through a manual review. |
| `under_supported_age`   | Stripe doesn’t verify users under the age of majority.                                                                                                                                              |
| `country_not_supported` | Stripe doesn’t verify users from the provided country.                                                                                                                                              |

| Error code                    | Description                                                                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `document_expired`            | The provided identity document has expired.                                                                                                                                                                                          |
| `document_unverified_other`   | Stripe couldn’t verify the provided identity document. [See list of supported document types](https://docs.stripe.com/identity/verification-checks.md?type=document).                                                                |
| `document_type_not_supported` | The provided identity document isn’t one of the session’s [allowed document types](https://docs.stripe.com/api/identity/verification_sessions/create.md#create_identity_verification_session-options-document-allow_document_types). |

| Error code                      | Description                                                         |
| ------------------------------- | ------------------------------------------------------------------- |
| `selfie_document_missing_photo` | The provided identity document did not contain a picture of a face. |
| `selfie_face_mismatch`          | The captured face image did not match with the document’s face.     |
| `selfie_unverified_other`       | Stripe couldn’t verify the provided selfie.                         |
| `selfie_manipulated`            | The captured face image was manipulated.                            |

| Error code                             | Description                                                                                                                                                |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id_number_unverified_other`           | Stripe couldn’t verify the provided ID number. [See list of supported ID numbers](https://docs.stripe.com/identity/verification-checks.md?type=id-number). |
| `id_number_insufficient_document_data` | The provided document didn’t contain enough data to match against the ID number.                                                                           |
| `id_number_mismatch`                   | The information provided couldn’t be matched against global databases.                                                                                     |

| Error code         | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| `address_mismatch` | The information provided couldn’t be matched against global databases. |

Add code to your event handler to handle verification check failure:

```javascript
<<setup key>>

// You can find your endpoint's secret in your webhook settings
const endpointSecret = 'whsec_...';

// This example uses Express to receive webhooks
const express = require('express');

// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

const app = express();

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
  let event;

  // Verify the event came from Stripe
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Successfully constructed event
  switch (event.type) {
    case 'identity.verification_session.verified': {
      // All the verification checks passed
      const verificationSession = event.data.object;
      break;
    }
    case 'identity.verification_session.requires_input': {
      // At least one of the verification checks failed
      const verificationSession = event.data.object;

      console.log('Verification check failed: ' + verificationSession.last_error.reason);

      // Handle specific failure reasons
      switch (verificationSession.last_error.code) {
        case 'document_unverified_other': {
          // The document was invalid
          break;
        }
        case 'document_expired': {
          // The document was expired
          break;
        }
        case 'document_type_not_supported': {
          // document type not supported
          break;
        }
        default: {
          // ...
        }
      }
    }
  }

  res.json({received: true});
});

app.listen(4242, () => {
  console.log('Running on port 4242');
});
```

```ruby
\# This example sets up an endpoint using the Sinatra framework.


require 'sinatra'
require 'stripe'

<<setup key>>

# You can find your endpoint's secret in your webhook settings
endpoint_secret = 'whsec_...'

set :port, 4242

post '/webhook' do
  event = nil

  # Verify webhook signature and extract the event
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  begin
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    payload = request.body.read
    event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
  rescue JSON::ParserError => e
    # Invalid payload
    return status 400
  rescue Stripe::SignatureVerificationError => e
    # Invalid signature
    return status 400
  end

  case event['type']
  when 'identity.verification_session.verified'
    # All the verification checks passed
    verification_session = event.data.object
  when 'identity.verification_session.requires_input'
    # At least one of the verification checks failed
    verification_session = event.data.object

    case verification_session.last_error.code
    when 'document_unverified_other'
      # The document was invalid
    when 'document_expired'
      # The document was expired
    when 'document_type_not_supported'
      # The document type was not supported
    else
      # ...
    end
  else
    # some other event type
  end

  status 200
end
```

```python
\# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import stripe

from flask import (
    Flask,
    request,
    Response,
    jsonify,
)
<<setup key>>

app = Flask(__name__)

# You can find your endpoint's secret in your webhook settings
endpoint_secret = 'whsec_...'

@app.route('/webhook', methods=['POST'])
def webhook():
  signature = request.headers.get('stripe-signature')
  payload = request.data

  # Verify webhook signature and extract the event.
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  try:
    event = stripe.Webhook.construct_event(
      payload=payload,
      sig_header=signature,
      secret=endpoint_secret,
    )
  except ValueError as e:
    # Invalid payload.
    return Response(status=400)
  except stripe.error.SignatureVerificationError as e:
    # Invalid Signature.
    return Response(status=400)

  if event['type'] == 'identity.verification_session.verified':
    print("All the verification checks passed")
    verification_session = event.data.object

  elif event['type'] == 'identity.verification_session.requires_input':
    print("At least one verification check failed")
    verification_session = event.data.object

    if verification_session.last_error.code == 'document_unverified_other':
      print("The document was invalid")
    elif verification_session.last_error.code == 'document_expired':
      print("The document was expired")
    elif verification_session.last_error.code == 'document_type_not_supported':
      print("The document type was not supported")
    else:
      print("other error code")

  return jsonify(received=True)

if __name__ == "__main__":
  app.run(port=4242)
```

```php
<?php
require 'vendor/autoload.php';

// You can find your endpoint's secret in your webhook settings
$endpoint_secret = 'whsec_...';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$event = null;

try {
  $event = \Stripe\Webhook::constructEvent(
    $payload, $sig_header, $endpoint_secret
  );
} catch(\UnexpectedValueException $e) {
  // Invalid payload
  http_response_code(400);
  exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
  // Invalid signature
  http_response_code(400);
  exit();
}

if ($event->type == 'identity.verification_session.verified') {
  // All the verification checks passed
  $verification_session = $event->data->object;
} elseif ($event->type == 'identity.verification_session.requires_input') {
  // At least one of the verification checks failed
  $verification_session = $event->data->object;

  if ($verification_session->last_error->code == 'document_unverified_other') {
    // The document was invalid
  } elseif ($verification_session->last_error->code == 'document_expired') {
    // The document was expired
  } elseif ($verification_session->last_error->code == 'document_type_not_supported') {
    // The document type was not supported
  } else {
    // ...
  }
}
http_response_code(200);
```

```java
package com.stripe.sample;

import com.stripe.Stripe;
import com.stripe.model.identity.VerificationSession;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.net.Webhook;
import com.google.gson.JsonSyntaxException;
import spark.Response;

// Using Spark.
import static spark.Spark.*;

public class Server {
  public static void main(String[] args) {
    port(4242);
<<setup key>>

    post("/webhook", (request, response) -> {
      String payload = request.body();
      String sigHeader = request.headers("Stripe-Signature");

      // If you are testing your webhook locally with the Stripe CLI you
      // can find the endpoint's secret by running `stripe listen`
      // Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
      String endpointSecret = "whsec_...";

      Event event = null;

      // Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try {
        event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
      } catch (JsonSyntaxException e) {
        // Invalid payload.
        response.status(400);
        return "";
      } catch (SignatureVerificationException e) {
        // Invalid Signature.
        response.status(400);
        return "";
      }

      VerificationSession verificationSession = null;
      EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();

      switch(event.getType()) {
        case "identity.verification_session.verified":
          // All the verification checks passed
          if (dataObjectDeserializer.getObject().isPresent()) {
            verificationSession = (VerificationSession) dataObjectDeserializer.getObject().get();
          } else {
            // Deserialization failed, probably due to an API version mismatch.
            // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
            // instructions on how to handle this case, or return an error here.
          }
          break;
        case "identity.verification_session.requires_input":
          // At least one of the verification checks failed
          if (dataObjectDeserializer.getObject().isPresent()) {
            verificationSession = (VerificationSession) dataObjectDeserializer.getObject().get();

            switch(verificationSession.getLastError().getCode()) {
            case "document_unverified_other":
              // the document was invalid
              break;
            case "document_expired":
               // the document was expired
               break;
            case "document_type_not_supported":
              // document type not supported
              break;
            default:
              // ...
            }
          } else {
            // Deserialization failed, probably due to an API version mismatch.
            // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
            // instructions on how to handle this case, or return an error here.
          }
          break;
        default:
          // other event type
      }

      response.status(200);
      return "";
    });
  }
}
```

```go
package main

import (
  "encoding/json"
  "log"
  "fmt"
  "net/http"
  "io/ioutil"

  "github.com/stripe/stripe-go/v{{golang.major_version}}"
  "github.com/stripe/stripe-go/v{{golang.major_version}}/webhook"

  "os"
)

func main() {
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/apikeys
  stripe.Key = "<<secret key>>"

  http.HandleFunc("/webhook", handleWebhook)
  addr := "localhost:4242"

  log.Printf("Listening on %s ...", addr)
  log.Fatal(http.ListenAndServe(addr, nil))
}

func handleWebhook(w http.ResponseWriter, req *http.Request) {
  const MaxBodyBytes = int64(65536)
  req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
  body, err := ioutil.ReadAll(req.Body)
  if err != nil {
      fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", err)
      w.WriteHeader(http.StatusServiceUnavailable)
      return
  }

  // You can find your endpoint's secret in your webhook settings
  endpointSecret := "whsec_..."

  // Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks#verify-events for more information.
  event, err := webhook.ConstructEvent(body, req.Header.Get("Stripe-Signature"), endpointSecret)

  if err != nil {
      fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", err)
      w.WriteHeader(http.StatusBadRequest) // Return a 400 error on a bad signature.
      return
  }

  switch event.Type {
  case "identity.verification_session.verified":
      fmt.Fprintf(os.Stdout, "All the verification checks passed\n")
      var verificationSession stripe.IdentityVerificationSession
      err := json.Unmarshal(event.Data.Raw, &verificationSession)
      if err != nil {
          fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
          w.WriteHeader(http.StatusBadRequest)
          return
      }
  case "identity.verification_session.requires_input":
      fmt.Fprintf(os.Stdout, "At least one of the verification checks failed\n")
      var verificationSession stripe.IdentityVerificationSession
      err := json.Unmarshal(event.Data.Raw, &verificationSession)
      if err != nil {
          fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
          w.WriteHeader(http.StatusBadRequest)
          return
      }
      switch verificationSession.LastError.Code {
      case "document_unverified_other":
        fmt.Fprintf(os.Stdout, "The document was invalid")
      case "document_expired":
        fmt.Fprintf(os.Stdout, "The document was expired")
      case "document_type_not_supported":
        fmt.Fprintf(os.Stdout, "The document type was not supported")
      default:
        fmt.Fprintf(os.Stdout, "Other document error code")
      }
  default:
    fmt.Fprintf(os.Stdout, "Unhandled event type: %v", event.Type)
  }

  w.WriteHeader(http.StatusOK)
}
```

```dotnet
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Stripe;
using Stripe.Identity;

<<setup key>>

namespace Controllers
{
  public class ConnectController : Controller
  {
    [HttpPost("webhook")]
    public async Task<IActionResult> ProcessWebhookEvent()
    {
      var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

      // You can find your endpoint's secret in your webhook settings
      var endpointSecret = "whsec_...";

      // Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try
      {
        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], endpointSecret);

        // If on SDK version < 46, use class Events instead of EventTypes
        if (stripeEvent.Type == EventTypes.IdentityVerificationSessionVerified) {
          var verificationSession = stripeEvent.Data.Object as VerificationSession;
          // All the verification checks passed

        } else if (stripeEvent.Type == EventTypes.IdentityVerificationSessionRequiresInput) {
          var verificationSession = stripeEvent.Data.Object as VerificationSession;
          if (verificationSession.LastError.Code == "document_unverified_other") {
            // The document was invalid
          } else if (verificationSession.LastError.Code == "document_expired") {
            // The document was expired
          } else if (verificationSession.LastError.Code == "document_type_not_supported") {
            // The document type was not supported
          } else {
            // ...
          }
        }

        return Ok();
      }
      catch (Exception e)
      {
        Console.WriteLine(e.ToString());
        return BadRequest();
      }
    }
  }
}
```

Depending on your use case, you might want to allow your users to retry the verification if it fails. We recommend that you limit the amount of submission attempts.

When handling this event, you might also consider:

- Manually reviewing the collected information
- Sending an email to your user letting them know that their verification failed
- Providing your user an alternative verification method

## Go live in production

After you’ve deployed your event handler endpoint to production, set up the endpoint so Stripe knows where to send live mode events. It’s also helpful to go through the [development checklist](https://docs.stripe.com/get-started/checklist/go-live.md) to ensure a smooth transition when taking your integration live.

Webhook endpoints are configured in the Dashboard or programmatically using the API.

### Add an endpoint in the Dashboard

In the Dashboard’s [Webhooks settings](https://dashboard.stripe.com/webhooks) page, click **Add an endpoint** to add a new webhook endpoint. Enter the URL of your webhook endpoint and select which events to listen to. See the full list of [Verification Session events](https://docs.stripe.com/identity/verification-sessions.md#events).

### Add endpoint with the API

You can also programmatically [create webhook endpoints](https://docs.stripe.com/api/webhook_endpoints/create.md). As with the form in the Dashboard, you can enter any URL as the destination for events and which event types to subscribe to.

```bash
curl https://api.stripe.com/v1/webhook_endpoints \
  -u <<secret key>>: \
  -d "url"="https://{{DOMAIN}}/my/webhook/endpoint" \
  -d "enabled_events[]"="identity.verification_session.verified" \
  -d "enabled_events[]"="identity.verification_session.requires_input"
```

## See Also

- [Test a webhook endpoint](https://docs.stripe.com/webhooks.md#test-webhook)
- [Best practices for using webhooks](https://docs.stripe.com/webhooks.md#best-practices)
- [Webhook development checklist](https://docs.stripe.com/get-started/checklist/go-live.md)
