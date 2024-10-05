# Version Bump Usage Guide

## Prerequisites
Ensure you have a `package.json` in your project root with a version field:
```json
{
  "name": "your-project-name",
  "version": "1.0.0"
}
```

## Basic Usage

### 1. Patch Version (for bug fixes)
Increments the third number (1.0.0 → 1.0.1)
```bash
npm run version:patch
```

### 2. Minor Version (for new features)
Increments the second number and resets patch (1.0.1 → 1.1.0)
```bash
npm run version:minor
```

### 3. Major Version (for breaking changes)
Increments the first number and resets others (1.1.0 → 2.0.0)
```bash
npm run version:major
```

### 4. Rollback (if you made a mistake)
Reverts to the previous version
```bash
npm run rollback
```

## Example Workflow

1. **Starting point:** Version `1.0.0`
   
2. **Add a new feature:**
   ```bash
   npm run version:minor
   # Version bumped from 1.0.0 to 1.1.0
   ```

3. **Fix a bug in that feature:**
   ```bash
   npm run version:patch
   # Version bumped from 1.1.0 to 1.1.1
   ```

4. **Oops, that was unnecessary:**
   ```bash
   npm run rollback
   # Version rolled back to 1.1.0
   ```

5. **Make breaking changes:**
   ```bash
   npm run version:major
   # Version bumped from 1.1.0 to 2.0.0
   ```

## Release Workflow
The `release` task will bump the patch version, build the project, and run Git tasks:
```bash
npm run release
# This will:
# 1. Bump patch version
# 2. Build the project
# 3. Commit and push changes
```

## Notes
- Version history is tracked in your Git repository via commits
- Ensure that the version in `package.json` is synchronized correctly
- Optionally, you can create a custom `.version-history.json` if you wish to store history similarly to your Deno project

## Common Patterns

1. For regular bug fixes:
   ```bash
   npm run version:patch
   ```

2. For new features:
   ```bash
   npm run version:minor
   ```

3. For breaking changes:
   ```bash
   npm run version:major
   ```

4. For a major release:
   ```bash
   npm run release:major
   ```

5. For a minor release:
   ```bash
   npm run release:minor
   ```

6. For a patch release:
   ```bash
   npm run release:patch
   ```

7. For a quick patch release:
   ```bash
   npm run release
   ```