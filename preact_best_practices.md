# Preact Best Practices for Code Review & Refactoring

> Adapted from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules) React best practices, filtered to only include rules that apply to Preact v10 applications.
>
> **Preact compatibility notes:**
> - Core hooks (`useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`, `useReducer`) work identically to React.
> - `memo()`, `Suspense`, `lazy()`, `forwardRef()` require `preact/compat`.
> - `useTransition`, `startTransition`, and `useDeferredValue` are **stubs** in Preact (no concurrent rendering) — rules relying on these are excluded.
> - `useEffectEvent` and `<Activity>` are **not available** — rules relying on these are excluded.
>
> References: [Preact Hooks](https://preactjs.com/guide/v10/hooks/), [Differences to React](https://preactjs.com/guide/v10/differences-to-react/)

---

## Table of Contents

1. [Critical: Async Performance](#1-critical-async-performance)
2. [High: Re-render Prevention](#2-high-re-render-prevention)
3. [High: Component Architecture](#3-high-component-architecture)
4. [High: State Management](#4-high-state-management)
5. [Medium: Hooks Best Practices](#5-medium-hooks-best-practices)
6. [Medium: Rendering Optimization](#6-medium-rendering-optimization)
7. [Medium: JavaScript Performance](#7-medium-javascript-performance)
8. [Preact-Specific Patterns](#8-preact-specific-patterns)

---

## 1. Critical: Async Performance

### Use Promise.all() for Independent Operations

Sequential awaits create unnecessary waterfalls. **2-10x improvement.**

```typescript
// Bad - sequential (3 round trips)
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// Good - parallel (1 round trip)
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

### Defer Await Until Needed

Move `await` into the branch where the result is actually used.

```typescript
// Bad - blocks both branches
async function handleRequest(userId, skipProcessing) {
  const userData = await fetchUserData(userId)
  if (skipProcessing) return { skipped: true }
  return processUserData(userData)
}

// Good - only blocks when needed
async function handleRequest(userId, skipProcessing) {
  if (skipProcessing) return { skipped: true }
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

### Check Cheap Conditions Before Async Calls

Evaluate synchronous guards before expensive async operations.

```typescript
// Bad - always awaits even when someCondition is false
const someFlag = await getFlag()
if (someFlag && someCondition) { /* ... */ }

// Good - skips await when unnecessary
if (someCondition) {
  const someFlag = await getFlag()
  if (someFlag) { /* ... */ }
}
```

---

## 2. High: Re-render Prevention

### Never Define Components Inside Components

Creates a new component type on every render, causing full remounts and state loss. **This is a common and severe bug — applies identically in Preact.**

```tsx
// Bad - remounts Avatar on every render, destroys state
function UserProfile({ user, theme }) {
  const Avatar = () => (
    <img src={user.avatarUrl} className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'} />
  )
  return <Avatar />
}

// Good - stable component, pass props
function Avatar({ src, theme }) {
  return <img src={src} className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'} />
}

function UserProfile({ user, theme }) {
  return <Avatar src={user.avatarUrl} theme={theme} />
}
```

**Symptoms:** Input fields lose focus on keystroke, animations restart, effects run on every parent render, scroll position resets.

### Derive State During Render, Not in useEffect

If a value can be computed from current props/state, don't store it in state and sync via effects.

```tsx
// Bad - extra render + state drift risk
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, [firstName, lastName])

// Good - derive directly
const fullName = firstName + ' ' + lastName
```

### Use Functional setState Updates

Prevents stale closures and creates stable callback references.

```tsx
// Bad - stale closure risk, callback recreated on every items change
const addItems = useCallback((newItems) => {
  setItems([...items, ...newItems])
}, [items])

// Good - always uses latest state, stable reference
const addItems = useCallback((newItems) => {
  setItems(curr => [...curr, ...newItems])
}, [])
```

### Narrow Effect Dependencies

Use primitives instead of whole objects.

```tsx
// Bad - re-runs on any user field change
useEffect(() => { console.log(user.id) }, [user])

// Good - re-runs only when id changes
useEffect(() => { console.log(user.id) }, [user.id])
```

---

## 3. High: Component Architecture

### Put Interaction Logic in Event Handlers, Not Effects

If a side effect is triggered by a user action, run it in the event handler.

```tsx
// Bad - models action as state + effect
const [submitted, setSubmitted] = useState(false)
useEffect(() => {
  if (submitted) {
    post('/api/register')
    showToast('Registered', theme)
  }
}, [submitted, theme])

// Good - do it in the handler
function handleSubmit() {
  post('/api/register')
  showToast('Registered', theme)
}
```

### Suspense for Code-Splitting (preact/compat)

> **Preact caveat:** `Suspense` and `lazy()` are available via `preact/compat` and work for **code-splitting** only. Preact does not support React's data-fetching-with-Suspense pattern (async server components, `use()` hook). Use them strictly for lazy-loading components.

```tsx
import { lazy, Suspense } from 'preact/compat'

const HeavyEditor = lazy(() => import('./HeavyEditor'))

function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <HeavyEditor />
      </Suspense>
      <Footer />
    </div>
  )
}
```

### Use Explicit Conditional Rendering

Use ternaries instead of `&&` to avoid rendering falsy values like `0`.

```tsx
// Bad - renders "0" when count is 0
{count && <span class="badge">{count}</span>}

// Good
{count > 0 ? <span class="badge">{count}</span> : null}
```

---

## 4. High: State Management

### Use Lazy State Initialization

Pass a function to `useState` for expensive initial values.

```tsx
// Bad - buildSearchIndex runs on EVERY render
const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))

// Good - runs only once
const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
```

### Use useRef for Transient Values

For values that change frequently but don't need to trigger re-renders.

```tsx
// Bad - re-renders on every mouse move
const [lastX, setLastX] = useState(0)
useEffect(() => {
  const onMove = (e) => setLastX(e.clientX)
  window.addEventListener('mousemove', onMove)
  return () => window.removeEventListener('mousemove', onMove)
}, [])

// Good - updates DOM directly, no re-renders
const lastXRef = useRef(0)
const dotRef = useRef(null)
useEffect(() => {
  const onMove = (e) => {
    lastXRef.current = e.clientX
    if (dotRef.current) dotRef.current.style.transform = `translateX(${e.clientX}px)`
  }
  window.addEventListener('mousemove', onMove)
  return () => window.removeEventListener('mousemove', onMove)
}, [])
```

### Use toSorted() Instead of sort()

`.sort()` mutates the array in place, breaking Preact's immutability expectations for state/props.

```tsx
// Bad - mutates the users prop array
const sorted = useMemo(() => users.sort((a, b) => a.name.localeCompare(b.name)), [users])

// Good - creates new sorted array
const sorted = useMemo(() => users.toSorted((a, b) => a.name.localeCompare(b.name)), [users])
```

---

## 5. Medium: Hooks Best Practices

### Initialize App Once, Not Per Mount

Use a module-level guard for one-time initialization. While Preact doesn't double-mount in StrictMode like React, this is still good defensive practice.

```tsx
// Bad - re-runs on remount
useEffect(() => { loadFromStorage(); checkAuthToken() }, [])

// Good - once per app load
let didInit = false
function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])
}
```

### Split Combined Hooks with Independent Dependencies

```tsx
// Bad - changing sortOrder recomputes filtering
const sorted = useMemo(() => {
  const filtered = products.filter(p => p.category === category)
  return filtered.toSorted((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price)
}, [products, category, sortOrder])

// Good - filtering only recomputes when products or category change
const filtered = useMemo(() => products.filter(p => p.category === category), [products, category])
const sorted = useMemo(
  () => filtered.toSorted((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price),
  [filtered, sortOrder]
)
```

### Don't Wrap Simple Expressions in useMemo

The hook overhead may exceed the computation cost for simple primitives.

```tsx
// Bad
const isLoading = useMemo(() => user.isLoading || notifications.isLoading, [user.isLoading, notifications.isLoading])

// Good
const isLoading = user.isLoading || notifications.isLoading
```

### Extract Default Values from Memoized Components (preact/compat)

> Requires `memo()` from `preact/compat`.

Broken memoization when non-primitive defaults create new references each render.

```tsx
import { memo } from 'preact/compat'

// Bad - new function created every render, breaks memo
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }) { /* ... */ })

// Good - stable reference
const NOOP = () => {}
const UserAvatar = memo(function UserAvatar({ onClick = NOOP }) { /* ... */ })
```

---

## 6. Medium: Rendering Optimization

> **Excluded from React version:** `useTransition`/`startTransition` and `useDeferredValue` rules are omitted because Preact has no concurrent rendering — these are no-op stubs in `preact/compat`.

### CSS content-visibility for Long Lists

Pure CSS optimization — works identically regardless of framework.

```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

For 1000 items, browser skips layout/paint for ~990 off-screen items (10x faster initial render).

### Use Passive Event Listeners

Preact uses native DOM event listeners, making this even more directly relevant.

```typescript
// Bad - delays scrolling
document.addEventListener('touchstart', handleTouch)

// Good - eliminates scroll delay
document.addEventListener('touchstart', handleTouch, { passive: true })
```

---

## 7. Medium: JavaScript Performance

### Build Index Maps for Repeated Lookups

```typescript
// Bad - O(n) per lookup (1000 orders x 1000 users = 1M ops)
orders.map(order => ({ ...order, user: users.find(u => u.id === order.userId) }))

// Good - O(1) per lookup (2K ops)
const userById = new Map(users.map(u => [u.id, u]))
orders.map(order => ({ ...order, user: userById.get(order.userId) }))
```

### Use Set for O(1) Membership Checks

```typescript
// Bad - O(n) per check
const allowedIds = ['a', 'b', 'c']
items.filter(item => allowedIds.includes(item.id))

// Good - O(1) per check
const allowedIds = new Set(['a', 'b', 'c'])
items.filter(item => allowedIds.has(item.id))
```

### Defer Non-Critical Work with requestIdleCallback

```typescript
// Bad - blocks main thread
function handleSearch(query) {
  const results = searchItems(query)
  setResults(results)
  analytics.track('search', { query })
  saveToRecentSearches(query)
}

// Good - defers non-critical work
function handleSearch(query) {
  const results = searchItems(query)
  setResults(results)
  requestIdleCallback(() => analytics.track('search', { query }))
  requestIdleCallback(() => saveToRecentSearches(query))
}
```

### Early Length Check for Array Comparisons

```typescript
// Bad - always sorts and joins
function hasChanges(current, original) {
  return current.sort().join() !== original.sort().join()
}

// Good - O(1) check first
function hasChanges(current, original) {
  if (current.length !== original.length) return true
  const a = current.toSorted(), b = original.toSorted()
  return a.some((v, i) => v !== b[i])
}
```

---

## 8. Preact-Specific Patterns

These patterns are unique to Preact or differ from React conventions.

### Use `class` Instead of `className`

Preact supports both, but `class` is shorter and matches native HTML.

```tsx
// React-style (works in Preact)
<div className="container">...</div>

// Preact-preferred (also valid)
<div class="container">...</div>
```

### Use `onInput` Instead of `onChange` for Text Inputs (Core Preact)

In core Preact (without `preact/compat`), form inputs fire `onInput` on every keystroke. React's `onChange` is synthetic and fires on every change — but Preact's native `onChange` only fires on blur.

```tsx
// With preact/compat: onChange works like React (fires on every keystroke)
// Without preact/compat: use onInput for real-time updates
<input onInput={(e) => setValue(e.currentTarget.value)} />
```

> If you use `preact/compat`, `onChange` is automatically aliased to behave like React's version.

### Use SVG Attributes in Native Casing

Preact preserves SVG attribute casing. No need to convert to camelCase.

```tsx
// React requires camelCase
<svg><path strokeWidth="2" strokeLinecap="round" /></svg>

// Preact supports native kebab-case
<svg><path stroke-width="2" stroke-linecap="round" /></svg>
```

### Consider Signals for Fine-Grained Reactivity

Preact Signals (`@preact/signals`) offer an alternative to `useState` that can update the DOM directly without triggering component re-renders.

```tsx
import { signal, computed } from '@preact/signals'

const count = signal(0)
const doubled = computed(() => count.value * 2)

function Counter() {
  // Component doesn't re-render — Signal updates DOM directly
  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  )
}
```

Signals are especially useful for high-frequency updates (scroll position, animations, real-time data) where you'd otherwise use `useRef` + manual DOM manipulation.

---

## Rules Excluded (Not Applicable to Preact)

These rules from the React best practices were **excluded** because they rely on APIs that are stubs or unavailable in Preact:

| Rule | Reason |
|------|--------|
| Use Transitions for Non-Urgent Updates (`startTransition`) | Preact has no concurrent rendering — `startTransition` is a no-op stub |
| Use `useDeferredValue` for Expensive Derived Renders | Stub in `preact/compat` — immediately returns the value, does nothing |
| `useEffectEvent` for Stable Callback Refs | Not available in Preact |
| Store Event Handlers in Refs (via `useEffectEvent`) | Alternative ref pattern still works, but `useEffectEvent` does not exist |
| Use `<Activity>` Component for Show/Hide | React-only experimental API, not in Preact |
| React DOM Resource Hints (`prefetchDNS`, `preconnect`, `preload`, `preinit`) | React DOM-specific APIs, not in Preact |
| Strategic Suspense for Data Fetching (async components + `use()`) | Preact Suspense only supports `lazy()` code-splitting, not data fetching |

---

## Quick Reference Checklist

Use this during Preact code reviews:

- [ ] **No components defined inside components** (causes remount every render)
- [ ] **No derived state stored in useState + synced via useEffect** (derive during render)
- [ ] **Promise.all() for independent async operations** (no sequential awaits)
- [ ] **Functional setState when depending on current state** (`setItems(curr => ...)`)
- [ ] **Lazy state initialization for expensive computations** (`useState(() => ...)`)
- [ ] **Primitive effect dependencies** (`[user.id]` not `[user]`)
- [ ] **Interaction logic in event handlers, not effects**
- [ ] **No `.sort()` mutation on state/props** (use `.toSorted()`)
- [ ] **No inline `&&` rendering with potentially falsy numbers** (use ternary)
- [ ] **Split hooks with independent dependencies** into separate hooks
- [ ] **No useMemo around simple primitive expressions**
- [ ] **Stable default values for memo'd component props** (extract to constants)
- [ ] **useRef for high-frequency transient values** (or consider Preact Signals)
- [ ] **Passive event listeners** on touch/wheel events
- [ ] **Map/Set instead of array.find()/includes()** for repeated lookups
- [ ] **`onInput` not `onChange`** for real-time text input (core Preact without compat)
