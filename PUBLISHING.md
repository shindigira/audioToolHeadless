# Publishing Guide for AudioToolHeadless

This guide explains how to publish your TypeScript module to npm.

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **NPM CLI**: Make sure you have npm installed and are logged in:
   ```bash
   npm login
   ```
3. **Git Repository**: Ensure your code is committed and pushed to GitHub

## Package Configuration

The package is already configured for npm publishing with:

- ✅ **Dual Package Support**: ESM (`dist/index.js`) and CommonJS (`dist/index.cjs`)
- ✅ **TypeScript Declarations**: Includes `dist/index.d.ts` for type support
- ✅ **Proper Exports**: Configured for modern Node.js module resolution
- ✅ **Package Metadata**: Repository, keywords, license, and author information

## Publishing Scripts

### Available Commands

```bash
# Development and validation
pnpm run dev          # Watch mode for development
pnpm run build        # Build the package
pnpm run validate     # Run linting, type checking, and build
pnpm run typecheck    # Check TypeScript types
pnpm run lint         # Check code style
pnpm run format       # Format code

# Pre-publishing checks
pnpm run publish:dry  # Dry run to see what would be published
pnpm run size:check   # Check bundle size

# Publishing to npm
pnpm run publish:npm  # Publish to npm (latest tag)
pnpm run publish:beta # Publish with beta tag
pnpm run publish:next # Publish with next tag

# Version management
pnpm run version:check      # Check current version
pnpm run release:patch      # Release patch version (1.0.1)
pnpm run release:minor      # Release minor version (1.1.0)
pnpm run release:major      # Release major version (2.0.0)
```

## Step-by-Step Publishing Process

### 1. Validate Your Package

Before publishing, always validate your package:

```bash
# Run all checks
pnpm run validate

# Check what will be published
pnpm run publish:dry
```

### 2. Choose Your Publishing Method

#### Method A: Manual Publishing (Recommended for first time)

```bash
# 1. Ensure you're logged into npm
npm whoami

# 2. Build and validate
pnpm run validate

# 3. Check package contents
pnpm run publish:dry

# 4. Publish to npm
pnpm run publish:npm
```

#### Method B: Using Release-it (Automated versioning)

```bash
# For patch version (1.0.0 → 1.0.1)
pnpm run release:patch

# For minor version (1.0.0 → 1.1.0)
pnpm run release:minor

# For major version (1.0.0 → 2.0.0)
pnpm run release:major
```

### 3. Beta/Preview Releases

For testing or preview releases:

```bash
# Publish as beta version
npm version prerelease --preid=beta
pnpm run publish:beta

# Install beta version
npm install audiotoolheadless@beta
```

## Package Name and Scoping

Your package will be published as `audiotoolheadless`. If you want to use a scoped package (recommended for personal/organization packages):

1. Update package name in `package.json`:
   ```json
   {
     "name": "@shindigira/audiotoolheadless"
   }
   ```

2. Publish with public access:
   ```bash
   npm publish --access public
   ```

## Post-Publishing Checklist

After successful publishing:

1. ✅ **Verify on npm**: Check [npmjs.com/package/audiotoolheadless](https://www.npmjs.com/package/audiotoolheadless)
2. ✅ **Test Installation**: 
   ```bash
   npm install audiotoolheadless
   ```
3. ✅ **Update Documentation**: Add installation and usage instructions to README.md
4. ✅ **Create Git Tag**: Tag the release in your repository
5. ✅ **Announce**: Share your package with the community

## Installation for Users

Once published, users can install your package:

```bash
# npm
npm install audiotoolheadless

# yarn
yarn add audiotoolheadless

# pnpm
pnpm add audiotoolheadless
```

## Usage Example

```typescript
import { AudioHeadless } from 'audiotoolheadless';

const player = new AudioHeadless();
await player.initialize({
  enableHls: true,
  enableEqualizer: true,
  showNotificationActions: true
});

await player.loadAndPlay({
  id: '1',
  title: 'Example Song',
  artist: 'Example Artist',
  source: 'https://example.com/song.mp3'
});
```

## Troubleshooting

### Common Issues

1. **Authentication Error**: Run `npm login` to authenticate
2. **Package Name Conflict**: Choose a unique name or use a scoped package
3. **Build Errors**: Run `pnpm run validate` to check for issues
4. **Permission Denied**: Ensure you have publish rights for the package name

### Getting Help

- **npm Documentation**: https://docs.npmjs.com/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Issues**: Report issues at https://github.com/shindigira/audioToolHeadless/issues

## Continuous Integration

Consider setting up automated publishing with GitHub Actions:

1. Add npm token to GitHub Secrets
2. Create workflow to publish on release
3. Automate version bumping and changelog generation

This ensures consistent and reliable publishing process.
