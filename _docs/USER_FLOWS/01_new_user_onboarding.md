## 1. New User Onboarding & First Invitation Acceptance

This flow describes the journey of a brand new user from first launch to accepting their first event invitation.

- **Role:** `Participant` (default for all new users)
- **Goal:** Create an account, set up a basic profile, and confirm attendance for an event.

### Flow Steps:

1.  **Entry Point**: User opens the app for the first time.

    - `->` **`SplashScreen`**: Displays the Momento logo.

2.  **Authentication Choice**:

    - `->` **`AuthScreen`**: Presents "Sign Up" and "Log In" options.
    - **User Action**: Taps "Sign Up".

3.  **Account Creation (US-Based User)**:

    - `->` **`SignUpFlow`**
    - **`PhoneInputScreen`**: User enters a valid US phone number. The screen will include a statement like, "By continuing, you agree to our Terms of Service and Privacy Policy," with links to both documents.
    - **User Action**: Taps "Continue".
    - `->` **`OTPScreen`**: User receives an SMS with a one-time password and enters it.
    - Upon successful verification, the flow continues to the profile creation steps:
    - **`ProfileSetupScreen`**: User provides their public `first_name` and a short `bio`.
    - **`InitialPhotoScreen`**: User uploads or takes their first profile photo. The UI encourages using the in-app camera to earn the "Authentic" badge.
    - **`InterestDiscoveryScreen`**: The user is presented with a swipeable deck of "Possibility Cards." They swipe right or left on a series of beautifully designed, fictitious event concepts. This engaging flow establishes their initial interest vectors for the matching algorithm.

4.  **Landing in the App**:

    - Upon successful sign-up, the user is directed to the main app interface.
    - `->` **`HomeTab`**: The main dashboard. It may be in an empty state, perhaps with a welcome message.

5.  **Receiving First Invitation**:

    - **Trigger**: The backend matching algorithm identifies the new user as a good fit for an event.
    - **Notification**: The user receives a push notification and/or an SMS.
    - **`InAppNotificationBanner`**: If the user is in the app, a banner appears.
    - **User Action**: Taps the notification or a prompt on the `HomeTab`.

6.  **Viewing the Invitation**:

    - `->` **`InvitationDetailScreen`**: Displays all details for the event: itinerary, host info, description, etc. Upon opening the screen, the user first sees the `MatchReasonBanner` at the top, explaining why they were invited (e.g., "We thought you'd like this because you're interested in Live Music."). This immediately reassures the user that the invitation is personalized. The UI will also prominently display a `ShortNoticeBadge` if the event's lead-time is less than the user's preference.
    - **User Actions**:
      - Taps "Accept." (Proceeds to Step 7)
      - Taps "Decline."
        - `->` **`DeclineFeedbackModal`**: A modal appears asking for a reason.
        - **User Action**: Selects the "Too short notice" option.
        - **System Action**: The user's `min_lead_time` preference is slightly increased. The invitation is dismissed.

7.  **First-Time Payment**:

    - **Trigger**: The system detects the user has no saved payment method.
    - `->` **`PaymentMethodsScreen`**: Prompted modally for the user to add a credit card.
    - **User Action**: Enters card details and saves.

8.  **Confirmation**:
    - The payment is processed for the $5 event fee.
    - `->` **`EventDetailScreen` (Upcoming State)**: The user sees the confirmed event details. The screen prominently features an "Add to Calendar" button.
    - **User Action**: User can optionally tap "Add to Calendar" to download an `.ics` file.
