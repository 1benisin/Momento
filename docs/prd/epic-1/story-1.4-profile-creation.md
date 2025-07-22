# Story 1.4: Enhanced User Profile Creation

## Status

Draft

## Story

**As a** user completing onboarding,
**I want** to create a comprehensive profile with essential information and visual elements,
**so that** the platform can begin personalizing my experience and matching me with events.

## Acceptance Criteria

1. Enhanced profile form with name, bio, age, location, and interests fields
2. Profile photo upload with image validation and editing capabilities
3. Privacy controls for profile visibility and individual field settings
4. Real-time profile preview as user fills form
5. Integration with existing Clerk user metadata and Convex socialProfile
6. Form validation with real-time feedback and error handling
7. Accessibility compliance and responsive design
8. Backward compatibility with existing user profiles

## Tasks / Subtasks

- [ ] Enhance profile form fields (AC: 1)
  - [ ] Add bio field with multi-line text input and character limit
  - [ ] Implement age picker with date calculation
  - [ ] Add location search integration with city/state fields
  - [ ] Create interests selection with predefined categories
  - [ ] Integrate with existing Clerk user data for name fields
  - [ ] Update Convex schema with new profile fields
- [ ] Enhance photo management (AC: 2)
  - [ ] Extend existing ImageUploader component functionality
  - [ ] Add image validation for size, format, and dimensions
  - [ ] Implement basic image editing (crop, rotate, brightness)
  - [ ] Create preview before saving functionality
  - [ ] Add fallback to default avatar if no photo
  - [ ] Integrate authentic photo badge functionality
- [ ] Implement privacy controls (AC: 3)
  - [ ] Create profile visibility toggle (public/private)
  - [ ] Add individual field privacy settings
  - [ ] Implement data sharing preferences
  - [ ] Store privacy settings in Convex socialProfile
  - [ ] Apply privacy settings to profile display
- [ ] Create profile preview functionality (AC: 4)
  - [ ] Implement real-time preview as user fills form
  - [ ] Create mobile-optimized preview layout
  - [ ] Add edit mode toggle functionality
  - [ ] Ensure preview matches actual profile display
- [ ] Integrate with existing systems (AC: 5)
  - [ ] Enhance existing createSocialProfile mutation
  - [ ] Maintain integration with Clerk user metadata
  - [ ] Ensure existing addProfilePhoto mutation continues to work
  - [ ] Preserve existing onboarding navigation flow
  - [ ] Maintain backward compatibility with existing profiles
- [ ] Implement form validation and error handling (AC: 6)
  - [ ] Add form validation with real-time feedback
  - [ ] Implement error handling for network issues
  - [ ] Create loading states for async operations
  - [ ] Follow existing form validation patterns
  - [ ] Add comprehensive error recovery
- [ ] Ensure accessibility and responsive design (AC: 7)
  - [ ] Add screen reader support for all form elements
  - [ ] Implement keyboard navigation
  - [ ] Create responsive design for different screen sizes
  - [ ] Ensure WCAG 2.1 AA compliance
  - [ ] Test accessibility with screen readers
- [ ] Maintain backward compatibility (AC: 8)
  - [ ] Ensure existing user profiles continue to work
  - [ ] Test integration with existing authentication flow
  - [ ] Verify existing onboarding flow remains intact
  - [ ] Maintain performance standards for mobile devices
  - [ ] Ensure minimal performance impact

## Dev Notes

**Technology Integration:**

- Integrates with existing Clerk authentication system and Convex database
- Follows existing form patterns from sign-up flow and Convex mutation patterns
- Uses existing ImageUploader component and extends its functionality
- Maintains integration with existing onboarding navigation flow

**Source Tree Integration:**

- Profile setup screens in `app/(onboarding)/(social)/` directory
- Form components follow patterns from existing sign-up/sign-in flows
- User management mutations in `convex/user.ts`
- Image handling extends existing `ImageUploader.tsx` component
- Navigation follows onboarding flow patterns

**Testing Standards:**

- Test file location: `__tests__/` directories alongside profile components
- Testing framework: Jest + React Native Testing Library
- Test standards: Unit tests for all profile creation flows, integration tests with Convex
- E2E tests for complete profile creation journey
- Cross-platform testing (iOS/Android)

**Key Constraints:**

- Must work offline-first with sync when connection restored
- Profile data must be encrypted at rest
- Image uploads must be optimized for mobile bandwidth
- Must support both iOS and Android platforms
- Must maintain backward compatibility with existing user profiles
- Must integrate with existing Clerk authentication flow

**Schema Changes Required:**

```typescript
// Enhance existing socialProfile in convex/schema.ts
socialProfile: v.optional(
  v.object({
    bio: v.optional(v.string()),
    age: v.optional(v.number()),
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.string(),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
      }),
    ),
    interests: v.optional(v.array(v.string())),
    privacy_settings: v.optional(
      v.object({
        profile_visibility: v.union(v.literal('public'), v.literal('private')),
        show_age: v.boolean(),
        show_location: v.boolean(),
        show_interests: v.boolean(),
      }),
    ),
    // ... existing fields
  }),
)
```

## Testing

**Test File Location:** `__tests__/` directories alongside profile components
**Test Standards:** Unit tests for all profile creation flows, integration tests with Convex
**Testing Frameworks:** Jest + React Native Testing Library
**Specific Testing Requirements:**

- Unit tests for all profile creation flows
- Integration tests with Convex mutations
- E2E tests for complete profile creation journey
- Cross-platform testing (iOS/Android)
- Accessibility testing with screen readers
- Backward compatibility testing with existing profiles

## Change Log

| Date       | Version | Description            | Author |
| ---------- | ------- | ---------------------- | ------ |
| 2024-01-01 | 1.0     | Initial story creation | PO     |

## Dev Agent Record

### Agent Model Used

[To be populated by development agent]

### Debug Log References

[To be populated by development agent]

### Completion Notes List

[To be populated by development agent]

### File List

[To be populated by development agent]

## QA Results

[To be populated by QA agent]
