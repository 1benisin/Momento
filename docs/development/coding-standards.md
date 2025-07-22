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
  id: string
  firstName: string
  lastName?: string
  email: string
  createdAt: Date
}

// ❌ Bad: Implicit any types
const user = {
  id: '123',
  name: 'John',
}
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
  updates: Partial<User>,
): Promise<User> => {
  // implementation
}

// ❌ Bad: Missing type annotations
function processUser(user) {
  return user.id
}
```

#### Error Handling

```typescript
// ✅ Good: Proper error handling with types
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  if (error instanceof NetworkError) {
    devLog('Network error occurred', {error: error.message})
    throw new UserFriendlyError('Connection failed. Please try again.')
  }
  throw error
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
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const userData = await getUserProfile(userId)
        setUser(userData)
      } catch (err) {
        setError(err as Error)
        devLog('Failed to fetch user profile', {userId, error: err})
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return {user, loading, error}
}
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
const [isLoading, setIsLoading] = useState(false)
const [formData, setFormData] = useState<FormData>(initialData)
```

#### Global State

```typescript
// ✅ Good: Use Convex for global state management
import {useMutation, useQuery} from 'convex/react'

export const useUserData = () => {
  return useQuery('users.getCurrentUser')
}

export const useUpdateUser = () => {
  return useMutation('users.updateProfile')
}
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
  args: {userId: v.string()},
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('_id'), args.userId))
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    return user
  },
})
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

### Git Workflow: Branching, Committing, and Pull Requests

This section outlines the standard process for creating branches, committing code, and submitting pull requests. Following these guidelines ensures a consistent and understandable version control history.

#### 1. Branching

All new work should be done on a feature branch. Branches should be created from the `main` branch.

##### Branch Naming Convention

Branches should be named using the following pattern:

`story/{story_number}-{kebab-case-story-name}`

- `{story_number}`: The story number, including the epic number (e.g., `1.1`).
- `{kebab-case-story-name}`: A short, descriptive name for the story in kebab-case.

**Example:**

For a story file named `story-1.1-project-setup.md`, the branch name would be:

`story/1.1-project-setup`

##### Checking for Existing Branches

Before creating a new branch, check if a branch for the story already exists.

```bash
git branch --list 'story/1.1-*'
```

If a branch for your story already exists, switch to it instead of creating a new one:

```bash
git checkout story/1.1-project-setup
```

##### Creating a New Branch

If a branch does not exist, create and switch to it:

```bash
git checkout -b story/1.1-project-setup
```

#### 2. Committing

Once you have made changes, you need to commit them.

##### Staging Changes

Add all relevant changes to the staging area.

```bash
git add .
```

##### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Your commit messages should be structured as follows:

`<type>(<scope>): <subject>`

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- **scope**: The part of the codebase you're changing (e.g., `auth`, `profile`, `onboarding`).
- **subject**: A short, imperative-tense description of the change.

**Example Commit Message:**

```
feat(profile): Implement basic UI for social profile setup
```

**To commit your staged changes:**

```bash
git commit -m "feat(profile): Implement basic UI for social profile setup"
```

#### 3. Pushing

Push your branch to the remote repository. The `-u` flag sets the upstream branch.

```bash
git push -u origin story/1.1-project-setup
```

#### 4. Creating a Pull Request (PR)

Once your branch is pushed, the AI assistant will create a Pull Request on GitHub using the `gh` CLI.

##### PR Title

The PR title should be clear and concise, similar to your primary commit message.

**Example:**

`feat(profile): Social Profile Creation`

##### PR Body

The PR body will be populated from a template, but should include:

- **Link to the Story:** Reference the story file path (e.g., `docs/prd/epic-1/story-1.1-project-setup.md`).
- **Changes Made:** A summary of what was implemented.

**CLI Command for the Assistant:**

```bash
gh pr create --title "feat(setup): Project Setup" --body "Closes #issue_number. Implements the project setup as described in story 1.1."
```

#### 5. Returning to Main

After creating the pull request, the assistant will switch back to the `main` branch to ensure a clean working state.

```bash
git checkout main
```

By following this process, we maintain a clean and traceable project history, making it easier for everyone to collaborate effectively.

#### 6. Pull Changes from Main

Lastly, pull the latest changes from the `main` branch to ensure your branch is up to date.

```bash
git pull origin main
```

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
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  },
  jane: {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
  },
}
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
  options?: CreateUserOptions,
): Promise<User> => {
  // implementation
}
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
export const UserCard: React.FC<UserCardProps> = ({user, onPress, variant}) => {
  // implementation
}
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
  ({data}) => {
    // Expensive rendering logic
  },
)

// ✅ Good: Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.filter(item => item.isActive).map(item => item.value)
}, [data])

// ✅ Good: Use useCallback for function props
const handlePress = useCallback(
  (id: string) => {
    onItemPress(id)
  },
  [onItemPress],
)
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
    'users.getUser',
    {userId},
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  )
}
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
      throw new Error('Invalid email format')
    }

    // Validate password strength
    if (!isStrongPassword(args.password)) {
      throw new Error('Password does not meet requirements')
    }

    // Continue with user creation
  },
})
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
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const clerkSecretKey = process.env.CLERK_SECRET_KEY

// ❌ Bad: Hardcoded secrets
const apiKey = 'sk_test_1234567890'
```

#### Data Sanitization

```typescript
// ✅ Good: Sanitize user input
export const sanitizeUserInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .substring(0, 1000) // Limit length
}
```

---

## Logging Standards

### Using devLog

#### Proper Logging

```typescript
// ✅ Good: Use devLog for consistent logging
import {devLog} from '../utils/devLog'

// Informational logging
devLog('User profile updated', {userId, changes})

// Error logging
devLog('Failed to create event', {error: error.message, eventData})

// Debug logging
devLog('API response received', {endpoint, responseTime, dataSize})
```

#### Log Levels

- **Info**: General application flow
- **Warning**: Potential issues that don't break functionality
- **Error**: Errors that affect functionality
- **Debug**: Detailed information for debugging

---

## Styling with NativeWind

This project uses [NativeWind](https://www.nativewind.dev/) for styling, which brings the power of Tailwind CSS to React Native. All new styling should be implemented using NativeWind's utility classes via the `className` prop. The use of `StyleSheet.create` is deprecated and should be migrated to NativeWind where possible.

### Core Principles

- **Utility-First:** Use utility classes for all styling. This promotes consistency and reduces the need for custom CSS.
- **Co-location:** Styles are co-located with the component markup, making them easier to manage and understand.
- **Design System:** All colors, fonts, spacing, and other design tokens are defined in `tailwind.config.js`. This file is the single source of truth for the app's visual identity, and it should be updated to reflect any changes to the design system defined in `/docs/design`.

### Light and Dark Mode

NativeWind has built-in support for dark mode. To apply a style only in dark mode, use the `dark:` prefix.

```tsx
<View className="bg-off-white dark:bg-deep-ink">
  <Text className="text-deep-ink dark:text-off-white">Hello World</Text>
</View>
```

The color scheme is managed by the `useColorScheme` hook, and NativeWind automatically applies the correct styles.

### Styling Custom Components

If you need to style a component that does not have a `className` prop, you can wrap it with the `styled` Higher-Order Component (HOC) from NativeWind.

```tsx
import {styled} from 'nativewind'
import SomeThirdPartyComponent from 'some-library'

const StyledThirdPartyComponent = styled(SomeThirdPartyComponent)

// Now you can use className
;<StyledThirdPartyComponent className="p-4 bg-gold" />
```

### Creating Reusable Components

If you find yourself repeating the same set of utility classes on multiple elements, it is a strong signal that you should extract that element into a reusable component.

**Don't do this:**

```tsx
<View className="p-4 bg-gold rounded-lg">
  <Text>Card 1</Text>
</View>
<View className="p-4 bg-gold rounded-lg">
  <Text>Card 2</Text>
</View>
```

**Do this:**

```tsx
// components/Card.tsx
export function Card({ children }) {
  return (
    <View className="p-4 bg-gold rounded-lg">
      {children}
    </View>
  );
}

// Usage
<Card>
  <Text>Card 1</Text>
</Card>
<Card>
  <Text>Card 2</Text>
</Card>
```

**Last Updated:** 2024-12-19

## Linting & Common Linting Issues

### Linting Configuration

We use ESLint with TypeScript and React Native plugins to enforce code quality and consistency. The configuration is in `eslint.config.mjs` and is tailored for Expo, React Native, and Convex projects.

### Common Linting Issues & Best Practices

#### 1. Asset Imports (Fonts, Images, etc.)

- **Expo Best Practice:** Use `require()` for static asset imports (e.g., fonts, images) in Expo projects. ES module imports do not work for these file types and will cause build or type errors.

```typescript
// ❌ Bad: ES import for font
import SpaceMonoFont from '../assets/fonts/SpaceMono-Regular.ttf'

// ✅ Good: Font loading in Expo
const [loaded] = useFonts({
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
})
```

- **ESLint Exception:** Our ESLint config allows `require()` for asset file extensions (e.g., `.ttf`, `.png`).

#### 2. Escaping Characters in JSX

- **Best Practice:** Use JSX expressions for strings with apostrophes or quotes instead of HTML entities.

```tsx
// ✅ Good
<Text>{"Don't have an account?"}</Text>

// ❌ Bad
<Text>Don&apos;t have an account?</Text>
```

- This approach is more readable and maintainable, and is preferred for all JSX text content.

#### 3. require() Style Imports

- **Rule:** Only use `require()` for static assets (see above). For all code modules, use ES imports.

```typescript
// ✅ Good: ES import for code
import {MyComponent} from './MyComponent'

// ✅ Good: require() for asset
const logo = require('../assets/logo.png')

// ❌ Bad: require() for code
const MyComponent = require('./MyComponent')
```

#### 4. TypeScript 'any' Usage

- **Rule:** Avoid `any` in all code. Use explicit types or `unknown` with type guards for error handling.

```typescript
// ✅ Good
catch (err: unknown) {
  if (err instanceof Error) {
    // handle error
  }
}

// ❌ Bad
catch (err: any) {
  // ...
}
```

#### 5. Unused Variables and Styles

- **Rule:** Remove all unused variables, imports, and styles. This keeps the codebase clean and avoids confusion.

#### 6. React Hook Rules

- **Rule:** Do not call hooks conditionally. Always call hooks at the top level of your component or custom hook.

```tsx
// ✅ Good
if (someCondition) {
  doSomething()
}
const value = useMyHook()

// ❌ Bad
if (someCondition) {
  const value = useMyHook()
}
```

---

**See also:**

- [Expo Asset System](https://docs.expo.dev/guides/assets/)
- [Expo Font Loading](https://docs.expo.dev/guides/using-custom-fonts/)
- [ESLint Configuration](../../eslint.config.mjs)
