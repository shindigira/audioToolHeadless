# AudioTool Headless

A lightweight TypeScript module for utility functions without UI dependencies.

## Features

- ✨ **TypeScript first** - Full type safety and IntelliSense support
- 📦 **Dual package** - Works with both ESM and CommonJS
- 🔧 **Zero dependencies** - Lightweight and fast
- 📋 **Well documented** - Complete JSDoc coverage
- 🧪 **Fully typed** - Comprehensive TypeScript definitions

## Installation

```bash
npm install audiotoolheadless
# or
pnpm add audiotoolheadless
# or
yarn add audiotoolheadless
```

## Usage

### ES Modules

```typescript
import { calculateTotal, groupByPriceRange, type Item } from 'audiotoolheadless';

const items: Item[] = [
  { id: 1, name: 'Coffee', price: 5.99 },
  { id: 2, name: 'Book', price: 25.50 },
  { id: 3, name: 'Laptop', price: 999.99 }
];

// Calculate total price
const total = calculateTotal(items);
console.log(`Total: $${total}`); // Total: $1031.48

// Group items by price range
const grouped = groupByPriceRange(items);
console.log(grouped);
// {
//   cheap: [{ id: 1, name: 'Coffee', price: 5.99 }],
//   medium: [{ id: 2, name: 'Book', price: 25.50 }],
//   expensive: [{ id: 3, name: 'Laptop', price: 999.99 }]
// }
```

### CommonJS

```javascript
const { calculateTotal, groupByPriceRange } = require('audiotoolheadless');

const items = [
  { id: 1, name: 'Coffee', price: 5.99 },
  { id: 2, name: 'Book', price: 25.50 }
];

const total = calculateTotal(items);
console.log(`Total: $${total}`);
```

## API Reference

### Types

#### `Item`

```typescript
interface Item {
  id: number;
  name: string;
  price: number;
}
```

### Functions

#### `calculateTotal(items: Item[]): number`

Calculate the total price of all items using typed reduce.

**Parameters:**
- `items` - Array of items to calculate total for

**Returns:**
- `number` - Sum of all item prices

**Example:**
```typescript
const total = calculateTotal([
  { id: 1, name: 'Coffee', price: 5.99 },
  { id: 2, name: 'Book', price: 25.50 }
]);
// Returns: 31.49
```

#### `groupByPriceRange(items: Item[]): Record<string, Item[]>`

Group items by price range (cheap, medium, expensive) using typed reduce.

**Parameters:**
- `items` - Array of items to group

**Returns:**
- `Record<string, Item[]>` - Object with price range keys and item arrays

**Price ranges:**
- `cheap`: < $10
- `medium`: $10 - $50  
- `expensive`: > $50

**Example:**
```typescript
const grouped = groupByPriceRange([
  { id: 1, name: 'Coffee', price: 5.99 },
  { id: 2, name: 'Laptop', price: 999.99 }
]);
// Returns: {
//   cheap: [{ id: 1, name: 'Coffee', price: 5.99 }],
//   expensive: [{ id: 2, name: 'Laptop', price: 999.99 }]
// }
```

## Development

### Requirements

- Node.js 16+
- pnpm (recommended)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd audioToolHeadless

# Install dependencies
pnpm install

# Install git hooks
pnpm run prepare
```

### Scripts

```bash
# Development
pnpm run dev          # Watch mode with auto-rebuild
pnpm run build        # Build for production
pnpm run typecheck    # Type checking only

# Code Quality
pnpm run lint         # Lint code
pnpm run lint:fix     # Lint and auto-fix
pnpm run format       # Format code

# Documentation
pnpm run docs         # Generate documentation
pnpm run docs:clean   # Clean docs folder

# Testing
pnpm run test         # Run tests

# Release
pnpm run release:patch   # Patch release (0.0.1 -> 0.0.2)
pnpm run release:minor   # Minor release (0.0.1 -> 0.1.0)  
pnpm run release:major   # Major release (0.0.1 -> 1.0.0)
```

### Project Structure

```
audioToolHeadless/
├── src/
│   └── index.ts          # Main source file
├── dist/                 # Built files
│   ├── index.js          # ESM build
│   ├── index.cjs         # CommonJS build
│   └── index.d.ts        # Type definitions
├── docs/                 # Generated documentation
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── tsup.config.ts        # Build configuration
├── typedoc.json          # Documentation configuration
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Commit using conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to the branch: `git push origin feat/amazing-feature`
6. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## License

ISC License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
