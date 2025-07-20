# User Deletion Strategy

## Executive Summary

Momento implements a **soft delete strategy** for user accounts that balances user privacy rights with platform integrity and user experience. This approach ensures that when users delete their accounts, we maintain referential integrity while removing personal data.

## Problem Statement

When users delete their accounts, we face competing requirements:

1. **User Privacy**: Users have the right to have their personal data removed
2. **Platform Integrity**: Events, connections, and social features should remain functional
3. **User Experience**: Other users should see meaningful information instead of broken references
4. **Legal Compliance**: Must meet GDPR "right to be forgotten" requirements
5. **Analytics Continuity**: Platform analytics should continue without personal identifiers

## Solution: Soft Delete Strategy

### What We Do

1. **Hard Delete Clerk Record**: Completely remove authentication data
2. **Soft Delete Convex Record**: Anonymize personal data while preserving platform data
3. **Maintain Referential Integrity**: Keep foreign key relationships intact
4. **Preserve User Experience**: Show "User has deactivated their account" instead of broken references

### What Gets Removed

- Email address
- Phone number
- First and last name
- Profile photos
- Personal bio information
- Payment methods
- Notification preferences
- Any other personally identifiable information

### What Gets Preserved

- User ID (for referential integrity)
- Display name (e.g., "John (Deleted)")
- Event participation records
- Connection records
- Host ratings and reliability data
- Platform analytics data (anonymized)

## Benefits

### For Users

- **Privacy**: Personal data is immediately removed
- **Control**: Complete account deletion when desired
- **Transparency**: Clear understanding of what happens to their data

### For Platform

- **Integrity**: Events and connections remain functional
- **Experience**: Other users see meaningful information
- **Analytics**: Platform metrics remain accurate
- **Compliance**: Meets legal requirements

### For Business

- **Data Retention**: Maintains valuable platform data
- **User Insights**: Can analyze deletion patterns
- **Legal Protection**: Clear data handling policies
- **Scalability**: Efficient data management

## Implementation Overview

### Technical Approach

```typescript
// When user deletes account:
1. Clerk webhook triggers → user.deleted event
2. Convex receives webhook → softDeleteUser mutation
3. User record updated → accountStatus: "deleted"
4. Personal data nullified → email: null, phone: null, etc.
5. Related data cleaned up → notifications, payment methods
6. Platform data preserved → events, connections, ratings
```

### Data Flow

```
User Deletes Account
        ↓
Clerk Hard Delete
        ↓
Webhook to Convex
        ↓
Soft Delete User Record
        ↓
Anonymize Personal Data
        ↓
Clean Up Related Data
        ↓
Preserve Platform Data
```

## User Experience

### Before Deletion

- User sees "Delete Account" button
- Modal explains the process
- Option to pause instead of delete

### After Deletion

- Other users see "User has deactivated their account"
- Events show "Deleted Host" for hosted events
- Memory Book entries remain but show deleted status
- No broken links or missing data

### Example Scenarios

#### Memory Book Entry

```
Before: "John Smith - Met at Coffee & Conversation"
After:  "John (Deleted) - Met at Coffee & Conversation"
        "This user has deactivated their account"
```

#### Event History

```
Before: "Hosted by John Smith"
After:  "Hosted by Deleted Host"
        "This event was hosted by someone who has since deactivated their account"
```

## Legal & Compliance

### GDPR Compliance

- **Right to be Forgotten**: Personal data is immediately removed
- **Data Minimization**: Only essential platform data is retained
- **Transparency**: Clear documentation of data handling
- **Audit Trail**: Deletion timestamp and process are recorded

### Data Retention Policy

- **Personal Data**: Removed immediately upon deletion
- **Platform Data**: Retained indefinitely for platform integrity
- **Analytics Data**: Anonymized and retained for platform improvement

## Monitoring & Analytics

### Key Metrics

- Deletion rate and trends
- Reasons for deletion (if captured)
- Impact on platform engagement
- User feedback about deletion process

### Data Integrity

- Regular audits of deleted user records
- Verification that personal data is properly removed
- Validation of referential integrity
- Monitoring for orphaned records

## Alternative Approaches Considered

### Hard Delete with Ghost Records

**Approach**: Create minimal ghost records for deleted users
**Pros**: Complete data removal, simpler implementation
**Cons**: More complex referential integrity, potential for orphaned records

### Complete Hard Delete

**Approach**: Remove all user data completely
**Pros**: Maximum privacy, simplest compliance
**Cons**: Breaks platform integrity, poor user experience, complex data cleanup

### Why We Chose Soft Delete

- **Balanced Approach**: Meets privacy and platform needs
- **User Experience**: Maintains platform functionality
- **Legal Compliance**: Satisfies GDPR requirements
- **Scalability**: Efficient and maintainable

## Implementation Timeline

### Phase 1: Schema Updates

- Add `DELETED` account status
- Add `deletedAt` timestamp field
- Add `displayName` field for UI continuity
- Update indexes for efficient filtering

### Phase 2: Backend Implementation

- Implement `softDeleteUser` mutation
- Create cleanup module for related data
- Update webhook handler
- Add data integrity checks

### Phase 3: Frontend Updates

- Update user display logic
- Modify Memory Book component
- Update event display components
- Add deletion status indicators

### Phase 4: Testing & Monitoring

- Unit and integration tests
- Performance testing
- Monitoring setup
- User acceptance testing

## Success Metrics

### Technical Metrics

- Zero orphaned records after deletion
- All personal data properly removed
- Platform functionality maintained
- Performance impact < 5%

### User Experience Metrics

- No broken links or missing data
- Clear communication about deletion
- Positive user feedback
- Reduced support tickets

### Business Metrics

- Deletion rate remains stable
- Platform engagement unaffected
- Legal compliance maintained
- Analytics continuity preserved

## Conclusion

The soft delete strategy provides an optimal balance between user privacy rights and platform integrity. By anonymizing personal data while preserving essential platform information, we create a solution that:

- Respects user privacy
- Maintains platform functionality
- Provides excellent user experience
- Meets legal requirements
- Enables continued platform improvement

This approach positions Momento as a privacy-conscious platform that values both user rights and community integrity.
