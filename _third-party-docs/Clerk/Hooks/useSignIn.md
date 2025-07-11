---
title: useSignIn()
description: Access and manage the current user's sign-in state in your React
  application with Clerk's useSignIn() hook.
lastUpdated: 2025-07-08T15:25:49.000Z
---

The `useSignIn()` hook provides access to the <SDKLink href="/docs/references/javascript/sign-in" sdks={["js-frontend"]} code={true}>SignIn</SDKLink> object, which allows you to check the current state of a sign-in attempt and manage the sign-in flow. You can use this to create a [custom sign-in flow](/docs/custom-flows/overview#sign-in-flow).

## Returns

This function returns a discriminated union type. There are multiple variants of this type available which you can select by clicking on one of the tabs.

<Tabs items={['Initialization', 'Loaded']}>
<Tab>
| Name | Type | Description |
| ------ | ------ | ------ |
| `isLoaded` | `false` | A boolean that indicates whether Clerk has completed initialization. Initially `false`, becomes `true` once Clerk loads. |
| `setActive` | `undefined` | A function that sets the active session. |
| `signIn` | `undefined` | An object that contains the current sign-in attempt status and methods to create a new sign-in attempt. |
</Tab>

  <Tab>
    | Name | Type | Description |
    | ------ | ------ | ------ |
    | `isLoaded` | `true` | A boolean that indicates whether Clerk has completed initialization. Initially `false`, becomes `true` once Clerk loads. |
    | `setActive()` | <code>(<SDKLink href="/docs/references/javascript/types/set-active-params" sdks={["js-frontend"]}>setActiveParams</SDKLink>) => Promise\<void\></code> | A function that sets the active session. |
    | `signIn` | <SDKLink href="/docs/references/javascript/sign-in" sdks={["js-frontend"]}>SignInResource</SDKLink> | An object that contains the current sign-in attempt status and methods to create a new sign-in attempt. |
  </Tab>
</Tabs>

## Examples

### Check the current state of a sign-in

The following example uses the `useSignIn()` hook to access the <SDKLink href="/docs/references/javascript/sign-in" sdks={["js-frontend"]} code={true}>SignIn</SDKLink> object, which contains the current sign-in attempt status and methods to create a new sign-in attempt. The `isLoaded` property is used to handle the loading state.

<Tabs items={['React', 'Next.js']}>
<Tab>
```tsx {{ filename: 'src/pages/SignInPage.tsx' }}
import { useSignIn } from "@clerk/clerk-react";

    export default function SignInPage() {
      const { isLoaded, signIn } = useSignIn();

      if (!isLoaded) {
        // Handle loading state
        return null;
      }

      return <div>The current sign-in attempt status is {signIn?.status}.</div>;
    }
    ```

  </Tab>

  <Tab>
    ```tsx {{ filename: 'app/sign-in/page.tsx' }}
    "use client";

    import { useSignIn } from "@clerk/nextjs";

    export default function SignInPage() {
      const { isLoaded, signIn } = useSignIn();

      if (!isLoaded) {
        // Handle loading state
        return null;
      }

      return <div>The current sign-in attempt status is {signIn?.status}.</div>;
    }
    ```

  </Tab>
</Tabs>

### Create a custom sign-in flow with `useSignIn()`

The `useSignIn()` hook can also be used to build fully custom sign-in flows, if Clerk's prebuilt components don't meet your specific needs or if you require more control over the authentication flow. Different sign-in flows include email and password, email and phone codes, email links, and multifactor (MFA). To learn more about using the `useSignIn()` hook to create custom flows, see the [custom flow guides](/docs/custom-flows/overview).
