# Access verification results

Learn how to access sensitive verification results.

You wrote code to [display a modal to collect identity documents](https://docs.stripe.com/identity/verify-identity-documents.md) and [handle verification outcomes](https://docs.stripe.com/identity/handle-verification-outcomes.md). Now you might need access to the sensitive verification results such as your user’s date of birth or pictures of the collected document.

First, consider using the [Identity Dashboard](https://dashboard.stripe.com/identity) to access sensitive verification results. If needed, [give team members controlled access](https://docs.stripe.com/get-started/account/teams.md) to your Stripe account. This saves you development time and ensures the sensitive verification data is kept [securely](https://support.stripe.com/questions/managing-your-id-verification-information) on Stripe.

You can [access most verification details programmatically](https://docs.stripe.com/identity/verification-sessions.md#results), such as the result of a verification check or the user’s name and address using your [secret key](https://docs.stripe.com/keys.md). Access to more sensitive fields require [restricted API keys](https://docs.stripe.com/keys-best-practices.md#limit-access).

| Verification result              | Available in Dashboard | Secret key access | Restricted API key access | Recommended Verification Session field                       | Expand property                                     |
| -------------------------------- | ---------------------- | ----------------- | ------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| Address                          | Yes                    | Yes               | Yes                       | `verified_outputs.address`                                   | `verified_outputs`                                  |
| Document type                    | Yes                    | Yes               | Yes                       | `last_verification_report.document.type`                     | `last_verification_report`                          |
| First and last names             | Yes                    | Yes               | Yes                       | `verified_outputs.first_name and verified_outputs.last_name` | `last_verification_report`                          |
| Issuing country of the document  | Yes                    | Yes               | Yes                       | `last_verification_report.document.issuing_country`          | `last_verification_report`                          |
| Result of the verification check | Yes                    | Yes               | Yes                       | `status`                                                     | Expand not required                                 |
| Issued date of the document      | Yes                    | Yes               | Yes                       | `last_verification_report.document.issued_date`              | `last_verification_report`                          |
| Type of ID number                | Yes                    | Yes               | Yes                       | `last_verification_report.document.id_number.type`           | `last_verification_report`                          |
| Email address                    | Yes                    | Yes               | Yes                       | `verified_outputs.email`                                     | `verified_outputs`                                  |
| Phone number                     | Yes                    | Yes               | Yes                       | `verified_outputs.phone`                                     | `verified_outputs`                                  |
| Expiration date of the document  | Yes                    | No                | Yes                       | `last_verification_report.document.expiration_date`          | `last_verification_report.document.expiration_date` |
| Date of birth                    | Yes                    | No                | Yes                       | `verified_outputs.dob`                                       | `verified_outputs.dob`                              |
| Document ID number               | Yes                    | No                | Yes                       | `last_verification_report.document.number`                   | `last_verification_report.document.number`          |
| Document images                  | Yes                    | No                | Yes                       | `last_verification_report.document.files`                    | `last_verification_report`                          |
| Face images                      | Yes                    | No                | Yes                       | `last_verification_report.selfie.selfie`                     | `last_verification_report`                          |
| ID number                        | Yes                    | No                | Yes                       | `verified_outputs.id_number`                                 | `verified_outputs.id_number`                        |

Restricted API keys allow access based on the security measures associated with it:

- **Restricted keys** — Allow access to sensitive verification results for verifications processed in the last 48 hours.
- **IP restricted keys** - Allow access to sensitive verification results for all verifications.

In this guide, you’ll learn how to:

1. Consider your sensitive data access requirements carefully.
1. Create restricted API keys.
1. Make API requests to obtain sensitive verification results.
1. Roll your keys if they’re compromised.
1. Communicate your sensitive verification results and security measures to your users.
1. Add IP restrictions to your key for long-term access to sensitive verification results.

1. Consider your sensitive data access requirements carefully.
1. Create restricted API keys.
1. Make API requests to obtain sensitive verification results.
1. Roll your keys if they’re compromised.
1. Communicate your sensitive verification results and security measures to your users.

## Consider your sensitive data access requirements carefully

To build an integration with Stripe Identity that prioritizes your user’s privacy, you must first decide the minimum amount of PII that you need access to. If you don’t need access to the most sensitive data (that requires authentication with a restricted API key), then your integration can authenticate using your secret key only.

To access PII resulting from a verification, you can retrieve a VerificationSession and [expand](https://docs.stripe.com/api/expanding_objects.md) either the [verified_outputs](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-verified_outputs) field or - if you need more granular detail on the verification result - the [last_verification_report](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-last_verification_report). Expanding either of these fields automatically includes all of the PII fields they contain that only require a secret key.

Here is an example of how to expand the `verified_outputs` field to retrieve a user’s name that was verified by Stripe Identity.

```javascript
<<setup key>>

const verificationSession = await stripe.identity.verificationSessions.retrieve(
  '{{SESSION_ID}}',
  {
    expand: [
      'verified_outputs',
    ],
  }
);

const firstName = verificationSession.verified_outputs.first_name;
```

```ruby
<<setup key>>

verification_session = Stripe::Identity::VerificationSession.retrieve({
  id: '{{SESSION_ID}}',
  expand: [
    'verified_outputs',
  ],
})
first_name = verification_session.verified_outputs.first_name
```

```python
<<setup key>>

verification_session = stripe.identity.VerificationSession.retrieve(
  '{{SESSION_ID}}',
  expand=[
    'verified_outputs',
  ],
)
first_name = verification_session.verified_outputs.first_name
```

```php
<<setup key>>

$verification_session = $stripe->identity->verificationSessions->retrieve(
  '{{SESSION_ID}}',
  [
    'expand' => [
      'verified_outputs',
    ],
  ]
);
$first_name = $verification_session->verified_outputs->first_name;
```

```java
<<setup key>>

VerificationSessionRetrieveParams params = VerificationSessionRetrieveParams.builder()
  .addExpand("verified_outputs")
  .build();

VerificationSession verificationSession = VerificationSession.retrieve("{{SESSION_ID}}", params, null);

String firstName = verificationSession.getVerifiedOutputs()
  .getFirstName();
```

```go
<<setup key>>

params := &stripe.IdentityVerificationSessionParams{}
params.AddExpand("verified_outputs")

vs, _ := verificationsession.Get("{{SESSION_ID}}", params)

first_name := vs.VerifiedOutputs.FirstName
```

```dotnet
<<setup key>>

var options = new VerificationSessionGetOptions();
options.AddExpand("verified_outputs");

var service = new VerificationSessionService();
var verificationSession = service.Get("{{SESSION_ID}}", options);

var firstName = verificationSession.VerifiedOutputs.FirstName;
```

If you do need to access sensitive PII that requires a restricted key, follow the steps in this guide.

## Create a restricted API key

You can use your account’s secret API keys to perform any API request without restriction. Accessing sensitive verification results requires [restricted keys](https://docs.stripe.com/keys-best-practices.md#limit-access), which are more secure.

To create a new restricted key,

1. Go to the [API keys page](https://dashboard.stripe.com/apikeys) in the Dashboard and click [**Create restricted key**](https://dashboard.stripe.com/apikeys/create).
1. Name your key.
1. Make sure the Identity **Verification Sessions and Reports** and **Access recent sensitive verification results** permissions are set to **Read**.
1. (optional) If you need to access collected images, add the Files **Write** permission.
1. Click **Create key**.
1. Store the key securely. [Learn more about keeping your keys safe](https://docs.stripe.com/keys-best-practices.md).

![](images/identity/rak_identity_permissions.png)

## Make API requests to obtain sensitive verification results

[VerificationReports](https://docs.stripe.com/api/identity/verification_reports.md) contain all the collected data and verification results from a submitted session. VerificationReports are created when all verification checks for a session are processed. They allow you to understand why a verification check failed and what data was successfully verified.

You can [expand](https://docs.stripe.com/expand.md) the [last_verification_report](https://docs.stripe.com/api/identity/verification_sessions/object.md#identity_verification_session_object-last_verification_report) session field to retrieve the associated VerificationReport.

By default, VerificationReports don’t include sensitive verification results. To access these, you’ll need to:

1. Authenticate using the restricted API key created in step 1.
1. [Expand](https://docs.stripe.com/api/expanding_objects.md) the fields you want to access.

Here’s an example of accessing the extracted date of birth, ID number, and document number from a [document check](https://docs.stripe.com/identity/verification-checks.md?type=document):

```javascript
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('rk_test_...')

const verificationSession = await stripe.identity.verificationSessions.retrieve(
  '{{SESSION_ID}}',
  {
    expand: [
      'verified_outputs.dob',
      'verified_outputs.id_number',
      'last_verification_report.document.number',
      'last_verification_report.document.expiration_date',
    ],
  },
)

const dateOfBirth = verificationSession.verified_outputs.dob
const idNumber = verificationSession.verified_outputs.id_number
const documentNumber =
  verificationSession.last_verification_report.document.number
const documentExpirationDate =
  verificationSession.last_verification_report.document.expiration_date
```

```ruby
\# Set your restricted key. Remember to switch to a live restricted key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = 'rk_test_...'

verification_session = Stripe::Identity::VerificationSession.retrieve({
  id: '{{SESSION_ID}}',
  expand: [
    'verified_outputs.dob',
    'verified_outputs.id_number',
    'last_verification_report.document.number',
    'last_verification_report.document.expiration_date',
  ],
})
date_of_birth = verification_session.verified_outputs.dob
id_number = verification_session.verified_outputs.id_number
document_number = verification_session.last_verification_report.document.number
document_expiration_date = verification_session.last_verification_report.document.expiration_date
```

```python
\# Set your restricted key. Remember to switch to a live restricted key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = 'rk_test_...'

verification_session = stripe.identity.VerificationSession.retrieve(
  '{{SESSION_ID}}',
  expand=[
    'verified_outputs.dob',
    'verified_outputs.id_number',
    'last_verification_report.document.number',
    'last_verification_report.document.expiration_date',
  ],
)
date_of_birth = verification_session.verified_outputs.dob
id_number = verification_session.verified_outputs.id_number
document_number = verification_session.last_verification_report.document.number
document_expiration_date = verification_session.last_verification_report.document.expiration_date
```

```php
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('rk_test_...');

$verification_session = $stripe->identity->verificationSessions->retrieve(
  '{{SESSION_ID}}',
  [
    'expand' => [
      'verified_outputs.dob',
      'verified_outputs.id_number',
      'last_verification_report.document.number',
      'last_verification_report.document.expiration_date',
    ],
  ]
);
$date_of_birth = $verification_session->verified_outputs->dob;
$id_number = $verification_session->verified_outputs->id_number;
$document_number = $verification_session->last_verification_report->document->number;
$document_expiration_date = verification_session->last_verification_report->document->expiration_date;
```

```java
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "rk_test_...";

VerificationSessionRetrieveParams params = VerificationSessionRetrieveParams.builder()
  .addExpand("verified_outputs.dob")
  .addExpand("verified_outputs.id_number")
  .addExpand("last_verification_report.document.number")
  .addExpand("last_verification_report.document.expiration_date")
  .build();

VerificationSession verificationSession = VerificationSession.retrieve("{{SESSION_ID}}", params, null);
VerificationSession.VerifiedOutputs.DateOfBirth dateOfBirth = verificationSession.getVerifiedOutputs().getDob();
String idNumber = verificationSession.getVerifiedOutputs().getIdNumber();
String documentNumber = verificationSession.getLastVerificationReportObject()
  .getDocument()
  .getNumber();
Date documentExpirationDate = verificationSession.getLastVerificationReportObject()
  .getDocument()
  .getExpirationDate()
```

```go
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.Key = "rk_test_..."

params := &stripe.IdentityVerificationSessionParams{}
params.AddExpand("verified_outputs.dob")
params.AddExpand("verified_outputs.id_number")
params.AddExpand("last_verification_report.document.number")
params.AddExpand("last_verification_report.document.expiration_date")

vs, _ := verificationsession.Get("{{SESSION_ID}}", params)

date_of_birth := vs.VerifiedOutputs.Dob
id_number := vs.VerifiedOutputs.IdNumber
document_number := vs.LastVerificationReport.Document.Number
document_expiration_date := vs.LastVerificationReport.Document.ExpirationDate
```

```dotnet
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "rk_test_...";

var options = new VerificationSessionGetOptions();
options.AddExpand("verified_outputs.dob");
options.AddExpand("verified_outputs.id_number");
options.AddExpand("last_verification_report.document.number");
options.AddExpand("last_verification_report.document.expiration_date");

var service = new VerificationSessionService();
var verificationSession = service.Get("{{SESSION_ID}}", options);

var dateOfBirth = verificationSession.VerifiedOutputs.Dob;
var idNumber = verificationSession.VerifiedOutputs.IdNumber;
var documentNumber = verificationSession.LastVerificationReport.Document.Number;
var documentExpirationDate = verificationSession.LastVerificationReport.Document.Number;
```

## Accessing collected images

You can retrieve identity document and face images that you collect as part of a session using the [File Upload API](https://docs.stripe.com/file-upload.md). The following fields on a VerificationReport can hold a reference to a [File](https://docs.stripe.com/api/files.md) resource in the Stripe API:

- [document.files](https://docs.stripe.com/api/identity/verification_reports/object.md#identity_verification_report_object-document-front) - images of the identity document
- [selfie.document](https://docs.stripe.com/api/identity/verification_reports/object.md#identity_verification_report_object-selfie-document) - image of the photo ID front
- [selfie.selfie](https://docs.stripe.com/api/identity/verification_reports/object.md#identity_verification_report_object-selfie-selfie) - image of the user’s face

Document and face images are very sensitive and some countries, such as Germany, have laws prohibiting ID Document images from being shared or kept longer than necessary. As much as possible, access image content with short-lived FileLinks, don’t make copies of the file contents, and [redact sessions](https://docs.stripe.com/identity/verification-sessions.md#redact) and collected images when you’re done using them for the purpose collected.

To access the contents of the file, you need to authenticate using the previously created restricted key and [Create a FileLink](https://docs.stripe.com/api/file_links/create.md) with a short expiration and send the [url](https://docs.stripe.com/api/file_links/object.md#file_link_object-url) to the client:

```javascript
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('rk_test_...')

// Get the VerificationReport
const session = await stripe.identity.verificationSessions.retrieve(
  '{{SESSION_ID}}',
  {
    expand: ['last_verification_report'],
  },
)

// Retrieve the File id
const report = session.last_verification_report
const documentFrontFile = report.document.files[0]

// Create a short-lived FileLink
const fileLink = await stripe.fileLinks.create({
  file: documentFrontFile,
  expires_at: Math.floor(Date.now() / 1000) + 30, // link expires in 30 seconds
})

// Access the FileLink URL to download file contents
const fileUrl = fileLink.url
```

```ruby
# Set your restricted key. Remember to switch to a live restricted key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = 'rk_test_...'

# Get the VerificationReport
verification_session = Stripe::Identity::VerificationSession.retrieve({
  id: '{{SESSION_ID}}',
  expand: ['last_verification_report'],
})

# Retrieve the File id
verification_report = verification_session.last_verification_report
document_front_file = verification_report.document.files[0]

# Create a short-lived FileLink
file_link = Stripe::FileLink.create({
  file: document_front_file,
  expires_at: Time.now.to_i + 30, # link expires in 30 seconds
})

# Access the FileLink URL to download file contents
file_url = file_link.url
```

```python
# Set your restricted key. Remember to switch to a live restricted key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = 'rk_test_...'

# Get the VerificationReport
verification_session = stripe.identity.VerificationSession.retrieve(
  '{{SESSION_ID}}',
  expand=['last_verification_report'],
)

# Retrieve the file id
report = verification_session.last_verification_report
document_front_file = report.document.files[0]

# Create a short-lived FileLink
file_link = stripe.FileLink.create(
  file=document_front_file,
  expires_at=time.time() + 30, # link expires in 30 seconds
)

# Access the FileLink URL to download file contents
file_url = file_link.url
```

```php
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('rk_test_...');

$verification_session = $stripe->identity->verificationSessions->retrieve(
  '{{SESSION_ID}}',
  [
    'expand' => [
      'last_verification_report',
    ],
  ],
]);

$verification_report = $verification_session->last_verification_report;
$document_front_file = $verification_report->document->files[0];

$file_link = $stripe->fileLinks->create([
  'file' => $document_front_file,
  'expires_at' => time() + 30,
]);

$file_url = $file_link->url;
```

```java
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "rk_test_...";

VerificationSessionRetrieveParams params = VerificationSessionRetrieveParams.builder()
  .addExpand("last_verification_report")
  .build();

VerificationSession verificationSession = VerificationSession.retrieve("{{SESSION_ID}}", params, null);
VerificationReport verificationReport = verificationSession.getLastVerificationReportObject();

String documentFrontFile = verificationReport.getDocument().getFiles().get(0);

FileLinkCreateParams fileLinkParams = FileLinkCreateParams.builder()
  .setFile(documentFrontFile)
  .setExpiresAt(Instant.now().getEpochSecond() + 30L)
  .build();

FileLink fileLink = FileLink.create(fileLinkParams);

String fileUrl = fileLink.getUrl();
```

```go
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "rk_test_..."

params := &stripe.IdentityVerificationSessionParams{}
params.AddExpand("last_verification_report")

vs, _ := verificationsession.Get(
  "{{SESSION_ID}}",
  params,
)

verification_report := vs.LastVerificationReport
document_front_file := verification_report.Document.Files[0];

filelinkparams := &stripe.FileLinkParams{
  File: stripe.String(document_front_file),
  ExpiresAt: stripe.Int64(time.Now().Unix() + 30),
}

file_link, _ := filelink.New(filelinkparams)
file_url := file_link.URL
```

```dotnet
// Set your restricted key. Remember to switch to a live restricted key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "rk_test_...";

// Get the VerificationSession
var options = new VerificationSessionGetOptions();
options.AddExpand("last_verification_report");

var service = new VerificationSessionService();
var verificationSession = service.Get("{{SESSION_ID}}", options);

// Retrieve the File id
var report = verificationSession.LastVerificationReport;
var documentFrontFile = report.Document.Files[0];

var expiresAtSeconds = DateTimeOffset.Now.ToUnixTimeSeconds() + 30;
var expiresAtDateTime = DateTimeOffset.FromUnixTimeSeconds(expiresAtSeconds).UtcDateTime;

var fileLinkCreateOptions = new FileLinkCreateOptions
{
  File = documentFrontFile,
  ExpiresAt = expiresAtDateTime,
};
var fileLinkService = new FileLinkService();
var fileLink = fileLinkService.Create(fileLinkCreateOptions);

// Access the FileLink URL to download file contents
var fileUrl = fileLink.Url;
```

FileLinks for document and selfie files must expire within 30 seconds. We recommend not downloading the file contents on your server, instead send the FileLink URL to the client to display the image.

If you believe an attacker has accessed sensitive data collected by Identity, please [reach out to support](https://support.stripe.com/contact).

## Roll your keys if they’re compromised

Using restricted API keys that only have Identity permissions allows you to roll the keys in case of emergency without affecting other Stripe product integrations.

We recommend that you regularly monitor your restricted key usage to ensure that no one has gained access to them. In the [Dashboard](https://dashboard.stripe.com/apikeys), you can use the overflow menu (**…**) to view request logs for a specific API key to view all the requests made from that key.

If an API key is compromised, roll the key in the [Dashboard](https://dashboard.stripe.com/apikeys) to block it and generate a new one. Make sure to expire it immediately to prevent bad actors from retrieving sensitive information.

Rolling blocks the API key and generates a new one. We recommend reviewing your [security history](https://dashboard.stripe.com/security_history) for events related to this key. Any webhook endpoints created with this key will stay active, even after the key is rolled.

If you believe an attacker has accessed sensitive data collected by Identity, please [reach out to support](https://support.stripe.com/contact).

## Communicate your sensitive data use and security measures

Make sure your privacy policy includes information on your use of sensitive verification results. It may also help if you provide information about your security practices.

**See also**

- [Privacy considerations for handling ID verification data as a business](https://support.stripe.com/questions/privacy-considerations-for-handling-id-verification-data-as-a-business)
- [FAQs to provide to your users](https://docs.stripe.com/identity/explaining-identity.md)

## Add IP restrictions for long-term access to results

Long term programmatic access to sensitive verification results increases the impact of leaking an API key. Consider if your use case really requires it. [Reach out to support](https://support.stripe.com/contact) if you need any help.

Restricted API keys with **Access recent sensitive verification results** permissions allow programmatic access for verifications submitted in the last 48 hours.

If you need programmatic access to verifications beyond 48 hours, you’ll need to add additional security to your restricted key by adding IP restrictions.

1. Go to the [API keys page](https://dashboard.stripe.com/apikeys) in the Dashboard.
1. In the overflow menu (**…**) click **Manage IP restrictions** for the restricted key you created in step 1.
1. Specify the IP addresses of your production servers. You can express these origins as simply an IP v4 address, or using CIDR ([Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)) notation for a whole range of IP addresses. Learn more about adding [IP Key restrictions](https://docs.stripe.com/keys-best-practices.md#ip-allowlist).
1. **Save** the key
1. Edit the key and add the **Access all sensitive verification results** permission.

You can now access sensitive verification results for verifications submitted beyond the 48 hour mark.

## See Also

- [Expanding responses](https://docs.stripe.com/api/expanding_objects.md)
- [API Keys](https://docs.stripe.com/keys.md)
- [Security at Stripe](https://docs.stripe.com/security.md)
