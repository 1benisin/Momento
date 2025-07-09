---
title: useClerk()
description: Access and manage the Clerk object in your React application with
  Clerk's useClerk() hook.
lastUpdated: 2025-07-08T15:25:49.000Z
---

> \[!WARNING]
> This hook should only be used for advanced use cases, such as building a completely custom OAuth flow or as an escape hatch to access to the `Clerk` object.

The `useClerk()` hook provides access to the <SDKLink href="/docs/references/javascript/clerk" sdks={["js-frontend"]} code={true}>Clerk</SDKLink> object, allowing you to build alternatives to any Clerk Component.

## Returns

<SDKLink href="/docs/references/javascript/clerk" sdks={["js-frontend"]}>Clerk</SDKLink> — The `useClerk()` hook returns the `Clerk` object, which includes all the methods and properties listed in the <SDKLink href="/docs/references/javascript/clerk" sdks={["js-frontend"]} code={true}>Clerk reference</SDKLink>.

## Example

The following example uses the `useClerk()` hook to access the `clerk` object. The `clerk` object is used to call the <SDKLink href="/docs/references/javascript/clerk#sign-in" sdks={["js-frontend"]} code={true}>openSignIn()</SDKLink> method to open the sign-in modal.

<Tabs items={['React', 'Next.js']}>
<Tab>
```tsx {{ filename: 'src/Home.tsx' }}
import { useClerk } from "@clerk/clerk-react";

    export default function Home() {
      const clerk = useClerk();

      return <button onClick={() => clerk.openSignIn({})}>Sign in</button>;
    }
    ```

  </Tab>

  <Tab>
    ```tsx {{ filename: 'app/page.tsx' }}
    "use client";

    import { useClerk } from "@clerk/nextjs";

    export default function HomePage() {
      const clerk = useClerk();

      return <button onClick={() => clerk.openSignIn({})}>Sign in</button>;
    }
    ```

  </Tab>
</Tabs>
