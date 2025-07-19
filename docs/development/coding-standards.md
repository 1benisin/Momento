# Coding Standards & Development Guidelines

This document outlines the coding standards, development practices, and architectural principles for the Momento project.

## Table of Contents

- [Core Development Principles](#core-development-principles)
- [Code Style & Formatting](#code-style--formatting)
- [Architecture Guidelines](#architecture-guidelines)
- [Directory Structure](#directory-structure)
- [Development Workflow](#development-workflow)
- [Testing Standards](#testing-standards)
- [Documentation Standards](#documentation-standards)
- [Performance Guidelines](#performance-guidelines)
- [Security Guidelines](#security-guidelines)

---

## Core Development Principles

### 1. Expo First

- **Priority**: Use Expo SDK packages (`expo-...`) over third-party or core React Native packages
- **Rationale**: Ensures maximum compatibility and stability
- **Exception**: Only use alternatives when Expo doesn't provide the needed functionality

### 2. File System for Artifacts, Tools for State

- **Artifacts**: Store documentation, PRDs, and planning in the file system

### 3. Type Safety First

- **TypeScript**: All code must be written in TypeScript
- **Strict Mode**: Enable strict TypeScript configuration
- **Type Definitions**: Create comprehensive type definitions for all data structures

### 4. Component-Driven Development

- **Reusability**: Build components to be reusable across the application
- **Composition**: Prefer composition over inheritance
- **Single Responsibility**: Each component should have a single, well-defined purpose

---

## Code Style & Formatting

### TypeScript Standards

#### Type Definitions

```typescript
// ✅ Good: Explicit type definitions
interface UserProfile {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  createdAt: Date;
}

// ❌ Bad: Implicit any types
const user = {
  id: "123",
  name: "John",
};
```

#### Function Signatures

```typescript
// ✅ Good: Explicit parameter and return types
function createUser(userData: CreateUserData): Promise<User> {
  // implementation
}

// ✅ Good: Arrow functions with types
const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User> => {
  // implementation
};

// ❌ Bad: Missing type annotations
function processUser(user) {
  return user.id;
}
```

#### Error Handling

```typescript
// ✅ Good: Proper error handling with types
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  if (error instanceof NetworkError) {
    devLog("Network error occurred", { error: error.message });
    throw new UserFriendlyError("Connection failed. Please try again.");
  }
  throw error;
}
```

### React Component Standards

#### Component Structure

```typescript
// ✅ Good: Well-structured component
import React from 'react';
import { View, Text } from 'react-native';
import { devLog } from '../utils/devLog';

interface UserCardProps {
  user: User;
  onPress?: (user: User) => void;
  variant?: 'default' | 'compact';
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  variant = 'default'
}) => {
  const handlePress = () => {
    devLog('User card pressed', { userId: user.id });
    onPress?.(user);
  };

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm">
      <Text className="text-lg font-semibold">{user.firstName}</Text>
      {variant === 'default' && (
        <Text className="text-gray-600">{user.email}</Text>
      )}
    </View>
  );
};
```

#### Hooks Usage

```typescript
// ✅ Good: Custom hook with proper typing
export const useUserProfile = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(userId);
        setUser(userData);
      } catch (err) {
        setError(err as Error);
        devLog("Failed to fetch user profile", { userId, error: err });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
```

### Naming Conventions

#### Files and Directories

- **Components**: PascalCase (`UserCard.tsx`, `EventDetails.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useNotifications.ts`)
- **Utilities**: camelCase (`devLog.ts`, `dateUtils.ts`)
- **Constants**: PascalCase (`Colors.ts`, `Constants.ts`)
- **Types**: PascalCase (`UserTypes.ts`, `EventTypes.ts`)

#### Variables and Functions

- **Variables**: camelCase (`userProfile`, `eventList`)
- **Functions**: camelCase (`getUserData`, `createEvent`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `EventData`)

#### Database and API

- **Database Tables**: snake_case (`user_profiles`, `event_attendees`)
- **API Endpoints**: kebab-case (`/api/user-profiles`, `/api/event-details`)
- **Environment Variables**: UPPER_SNAKE_CASE (`EXPO_PUBLIC_API_URL`)

---

## Architecture Guidelines

### Component Architecture

#### Component Hierarchy

```
components/
├── core/           # Atomic, reusable primitives
│   ├── Button/
│   ├── Input/
│   └── Card/
├── layout/         # Layout helpers
│   ├── Container/
│   ├── Grid/
│   └── Spacer/
└── domain/         # App-specific components
    ├── EventCard/
    ├── UserProfile/
    └── HostDashboard/
```

#### Component Guidelines

- **Core Components**: Completely generic, reusable across projects
- **Layout Components**: Help maintain consistent structure
- **Domain Components**: Specific to Momento features

### State Management

#### Local State

```typescript
// ✅ Good: Use useState for local component state
const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState<FormData>(initialData);
```

#### Global State

```typescript
// ✅ Good: Use Convex for global state management
import { useQuery, useMutation } from "convex/react";

export const useUserData = () => {
  return useQuery("users.getCurrentUser");
};

export const useUpdateUser = () => {
  return useMutation("users.updateProfile");
};
```

#### Context Usage

```typescript
// ✅ Good: Use Context for theme, auth, or app-wide state
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Data Flow

#### Convex Integration

```typescript
// ✅ Good: Proper Convex function structure
// convex/users.ts
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});
```

#### Error Handling

```typescript
// ✅ Good: Consistent error handling
export const createEvent = mutation({
  args: { eventData: v.object({...}) },
  handler: async (ctx, args) => {
    try {
      const eventId = await ctx.db.insert('events', args.eventData);
      devLog('Event created successfully', { eventId });
      return eventId;
    } catch (error) {
      devLog('Failed to create event', { error, eventData: args.eventData });
      throw new Error('Failed to create event');
    }
  },
});
```

---

## Directory Structure

### Recommended Structure

```
Momento/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication routes
│   ├── (tabs)/            # Main tab navigation
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── core/              # Atomic components
│   ├── layout/            # Layout components
│   └── domain/            # App-specific components
├── convex/               # Backend logic & schema
│   ├── schema.ts         # Database schema
│   ├── users.ts          # User-related functions
│   └── events.ts         # Event-related functions
├── constants/            # App-wide constants
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── docs/                 # Documentation
└── _old planning docs/   # Legacy documentation
```

### File Organization Rules

#### Component Files

```
components/EventCard/
├── EventCard.tsx         # Main component
├── EventCard.test.tsx    # Tests
├── EventCard.stories.tsx # Storybook stories (if applicable)
└── index.ts             # Export file
```

#### Hook Files

```
hooks/
├── useAuth.ts           # Authentication hook
├── useNotifications.ts  # Notifications hook
└── useUserProfile.ts    # User profile hook
```

---

## Development Workflow

### Git Workflow

#### Branch Naming

- **Feature**: `feature/001-user-profile`
- **Bug Fix**: `fix/authentication-error`
- **Hotfix**: `hotfix/critical-payment-issue`
- **Release**: `release/v1.0.0`

#### Commit Messages

```bash
# ✅ Good: Conventional commit format
feat(profile): add user profile editing functionality
fix(auth): resolve login redirect issue
docs(readme): update setup instructions
refactor(components): extract reusable button component

# ❌ Bad: Unclear commit messages
fixed stuff
updated code
wip
```

#### Pull Request Process

1. **Create Feature Branch**: `git checkout -b feature/001-user-profile`
2. **Make Changes**: Implement feature with proper commits
3. **Create PR**: Use PR template and link related issues
4. **Code Review**: Address feedback and make changes
5. **Merge**: Squash and merge to main branch

### Code Review Guidelines

#### Review Checklist

- [ ] Code follows style guidelines
- [ ] Proper error handling implemented
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No console.log statements (use devLog)
- [ ] TypeScript types are comprehensive
- [ ] Performance considerations addressed

#### Review Comments

```typescript
// ✅ Good: Constructive feedback
// Consider extracting this logic into a custom hook for reusability
// The error handling could be more specific for different error types

// ❌ Bad: Unhelpful feedback
// This is wrong
// Fix this
```

---

## Testing Standards

### Test Structure

#### Unit Tests

```typescript
// ✅ Good: Comprehensive unit test
import { render, fireEvent } from '@testing-library/react-native';
import { UserCard } from '../UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  };

  it('renders user information correctly', () => {
    const { getByText } = render(<UserCard user={mockUser} />);

    expect(getByText('John')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <UserCard user={mockUser} onPress={onPress} />
    );

    fireEvent.press(getByTestId('user-card'));
    expect(onPress).toHaveBeenCalledWith(mockUser);
  });
});
```

#### Integration Tests

```typescript
// ✅ Good: Integration test for data flow
describe('User Profile Flow', () => {
  it('loads and displays user profile data', async () => {
    const { getByText, findByText } = render(<UserProfileScreen />);

    // Wait for loading to complete
    await findByText('John Doe');

    expect(getByText('john@example.com')).toBeTruthy();
  });
});
```

### Testing Guidelines

#### Test Coverage

- **Minimum**: 80% code coverage
- **Critical Paths**: 100% coverage for authentication, payments, data persistence
- **Components**: Test all user interactions and edge cases

#### Test Data

```typescript
// ✅ Good: Centralized test data
export const mockUsers = {
  john: {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  },
  jane: {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
  },
};
```

---

## Documentation Standards

### Code Documentation

#### JSDoc Comments

```typescript
/**
 * Creates a new user profile in the system
 * @param userData - The user data to create
 * @param options - Additional options for user creation
 * @returns Promise resolving to the created user
 * @throws {ValidationError} When user data is invalid
 * @throws {NetworkError} When network request fails
 */
export const createUser = async (
  userData: CreateUserData,
  options?: CreateUserOptions
): Promise<User> => {
  // implementation
};
```

#### Component Documentation

````typescript
/**
 * UserCard component displays user information in a card format
 *
 * @example
 * ```tsx
 * <UserCard
 *   user={userData}
 *   onPress={handleUserPress}
 *   variant="compact"
 * />
 * ```
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  variant,
}) => {
  // implementation
};
````

### README Standards

#### Project README

- **Overview**: Clear project description
- **Setup**: Step-by-step setup instructions
- **Usage**: Basic usage examples
- **Contributing**: Guidelines for contributors
- **License**: Project license information

#### Component README

- **Purpose**: What the component does
- **Props**: All available props with types
- **Examples**: Usage examples
- **Dependencies**: Required dependencies

---

## Performance Guidelines

### React Performance

#### Memoization

```typescript
// ✅ Good: Use React.memo for expensive components
export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
  ({ data }) => {
    // Expensive rendering logic
  }
);

// ✅ Good: Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.filter((item) => item.isActive).map((item) => item.value);
}, [data]);

// ✅ Good: Use useCallback for function props
const handlePress = useCallback(
  (id: string) => {
    onItemPress(id);
  },
  [onItemPress]
);
```

#### List Optimization

```typescript
// ✅ Good: Use FlatList for large lists
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ListItem item={item} />}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Network Performance

#### API Optimization

```typescript
// ✅ Good: Implement proper caching
export const useUserData = (userId: string) => {
  return useQuery(
    "users.getUser",
    { userId },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};
```

#### Image Optimization

```typescript
// ✅ Good: Use optimized image loading
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="cover"
  loading="lazy"
/>
```

---

## Security Guidelines

### Data Validation

#### Input Validation

```typescript
// ✅ Good: Validate all inputs
export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate email format
    if (!isValidEmail(args.email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (!isStrongPassword(args.password)) {
      throw new Error("Password does not meet requirements");
    }

    // Continue with user creation
  },
});
```

#### Authentication

```typescript
// ✅ Good: Always verify authentication
export const updateUserProfile = mutation({
  args: { updates: v.object({...}) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Only allow users to update their own profile
    const userId = identity.subject;
    // ... rest of implementation
  },
});
```

### Sensitive Data

#### Environment Variables

```typescript
// ✅ Good: Use environment variables for secrets
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

// ❌ Bad: Hardcoded secrets
const apiKey = "sk_test_1234567890";
```

#### Data Sanitization

```typescript
// ✅ Good: Sanitize user input
export const sanitizeUserInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .substring(0, 1000); // Limit length
};
```

---

## Logging Standards

### Using devLog

#### Proper Logging

```typescript
// ✅ Good: Use devLog for consistent logging
import { devLog } from "../utils/devLog";

// Informational logging
devLog("User profile updated", { userId, changes });

// Error logging
devLog("Failed to create event", { error: error.message, eventData });

// Debug logging
devLog("API response received", { endpoint, responseTime, dataSize });
```

#### Log Levels

- **Info**: General application flow
- **Warning**: Potential issues that don't break functionality
- **Error**: Errors that affect functionality
- **Debug**: Detailed information for debugging

---

**Last Updated:** 2024-12-19
