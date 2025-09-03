/**
 * Example TypeScript function demonstrating typed .reduce
 */

interface Item {
  id: number;
  name: string;
  price: number;
}

/**
 * Calculate total price of items using typed reduce
 */
export function calculateTotal(items: Item[]): number {
  return items.reduce((total: number, item: Item) => total + item.price, 0);
}

/**
 * Group items by price range using typed reduce
 */
export function groupByPriceRange(items: Item[]): Record<string, Item[]> {
  return items.reduce((groups: Record<string, Item[]>, item: Item) => {
    const range = item.price < 10 ? 'cheap' : item.price < 50 ? 'medium' : 'expensive';
    
    if (!groups[range]) {
      groups[range] = [];
    }
    
    groups[range].push(item);
    return groups;
  }, {});
}

// Example usage
const sampleItems: Item[] = [
  { id: 1, name: 'Coffee', price: 5.99 },
  { id: 2, name: 'Book', price: 25.50 },
  { id: 3, name: 'Laptop', price: 999.99 }
];

export { sampleItems };
