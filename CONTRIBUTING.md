# Contributing to ADHD Planner

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

1. **Fork the repository**

   ```bash
   gh repo fork clcecomltd-jpg/staywise-travel-app
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/staywise-travel-app.git
   cd staywise-travel-app
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment**

   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:

- `feature/add-tags-filter` - New features
- `fix/timer-reset-bug` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/task-store` - Code refactoring
- `test/add-parser-tests` - Adding tests

### Making Changes

1. **Write clean, readable code**
   - Follow existing code style
   - Add comments for complex logic
   - Use TypeScript types

2. **Keep commits atomic**

   ```bash
   git add <files>
   git commit -m "feat: add task filtering by tags"
   ```

3. **Follow commit message conventions**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Adding tests
   - `chore:` - Maintenance

### Pre-commit Checks

Husky automatically runs before each commit:

- ESLint (code linting)
- Prettier (formatting)
- Type checking

If checks fail, fix the issues before committing.

### Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# E2E tests
npm run test:e2e

# Test UI
npm run test:ui
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

## 🎨 Code Style

### TypeScript

- Use explicit types for function parameters and return values
- Prefer interfaces over types for objects
- Use enum for fixed sets of values

```typescript
// Good
interface Task {
  id: string
  title: string
  status: TaskStatus
}

function createTask(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title,
    status: 'later',
  }
}

// Avoid
function createTask(title) {
  // ...
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks

```typescript
// Good
export function TaskCard({ task }: { task: Task }) {
  const { updateTask } = useTasksStore()

  const handleComplete = async () => {
    await updateTask(task.id, { status: 'done' })
  }

  return <div>{/* ... */}</div>
}
```

### Accessibility

Always include:

- ARIA labels for interactive elements
- Keyboard navigation
- Focus states
- Alt text for images

```tsx
<button onClick={handleClick} aria-label="Complete task" className="focus-ring">
  <CheckCircle className="h-5 w-5" />
</button>
```

## 🧪 Testing Guidelines

### Unit Tests

Test individual functions and utilities:

```typescript
describe('parseQuickAdd', () => {
  it('parses priority from task text', () => {
    const result = parseQuickAdd('Task !high')
    expect(result.priority).toBe('high')
  })
})
```

### Component Tests

Test component rendering and interactions:

```typescript
describe('Button', () => {
  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await userEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### E2E Tests

Test complete user flows:

```typescript
test('user can create and complete a task', async ({ page }) => {
  await page.goto('/today')
  // Test flow...
})
```

## 📚 Documentation

- Add JSDoc comments for complex functions
- Update README.md for new features
- Add inline comments for non-obvious code

```typescript
/**
 * Parses natural language task input
 * @example parseQuickAdd("Pay bill tomorrow !high #finance")
 * @returns Parsed task with extracted metadata
 */
export function parseQuickAdd(input: string): QuickAddParsedTask {
  // ...
}
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try the latest version
3. Reproduce in a clean environment

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots.
```

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Tests pass
2. ✅ Code is formatted
3. ✅ No TypeScript errors
4. ✅ Documentation updated
5. ✅ Commit messages follow convention

### PR Template

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots

If applicable, add screenshots.

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, we'll merge!

## 🤝 Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Be Helpful

- Help others learn and grow
- Share knowledge and resources
- Encourage and support contributors

### ADHD-Friendly Contributions

We especially welcome contributions that:

- Improve accessibility
- Reduce cognitive load
- Add helpful micro-interactions
- Enhance focus features
- Improve documentation clarity

## 📞 Getting Help

- 💬 **Questions**: Open a GitHub Discussion
- 🐛 **Bugs**: Open a GitHub Issue
- 💡 **Ideas**: Open a Feature Request
- 🔒 **Security**: Email security@example.com

## 🏆 Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- Project credits

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to ADHD Planner!** 🎉

Every contribution, no matter how small, helps make this tool better for the ADHD community.
