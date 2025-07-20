## 2. Non-US User Onboarding (Waitlist)

This flow describes the journey for a user who attempts to sign up from outside the initial launch country (US).

- **Role:** `Prospective User`
- **Goal:** To be informed about country availability and join a waitlist.

### Flow Steps:

1.  **Entry Point**: User opens the app and navigates to the sign-up flow.

    - `->` **`AuthScreen`**: Presents "Sign Up" and "Log In" options.
    - **User Action**: Taps "Sign Up".

2.  **Phone Number Entry**:

    - `->` **`PhoneInputScreen`**: User enters a non-US phone number.
    - **System Action**: The app detects the country code is not `+1` (United States).

3.  **Joining the Waitlist**:

    - `->` **`InternationalWaitlistScreen`**: The user is shown a message explaining that Momento is not yet available in their country.
    - The screen includes a button like "Notify Me When You Launch Here."
    - **User Action**: Taps the button to confirm.
    - **System Action**: The user's phone number is securely stored in the `waitlist_users` table for future communication.
    - The flow ends here for the user.

---

### Future Consideration

- This custom flow, including the `waitlist_users` table, could be simplified or replaced in the future by leveraging Clerk's pre-built `<Waitlist />` component. This would offload the UI and data storage to Clerk, streamlining our implementation.
