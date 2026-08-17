const products = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 79.99,
    rating: 4.5,
    reviewCount: 1342,
    image: 'https://picsum.photos/seed/headphones/400/400',
    description:
      'Premium wireless headphones with active noise cancellation, 30-hour battery life, and foldable design for easy travel.',
    stock: 15,
  },
  {
    id: 2,
    name: 'Stainless Steel Water Bottle',
    category: 'Kitchen',
    price: 24.99,
    rating: 4.7,
    reviewCount: 892,
    image: 'https://picsum.photos/seed/bottle/400/400',
    description:
      'Double-wall insulated 32oz bottle keeps drinks cold 24h or hot 12h. BPA-free, leak-proof lid.',
    stock: 50,
  },
  {
    id: 3,
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    price: 299.99,
    rating: 4.3,
    reviewCount: 458,
    image: 'https://picsum.photos/seed/chair/400/400',
    description:
      'Lumbar support, adjustable armrests, breathable mesh back. Supports up to 300 lbs.',
    stock: 8,
  },
  {
    id: 4,
    name: 'Running Shoes',
    category: 'Footwear',
    price: 109.95,
    rating: 4.6,
    reviewCount: 2107,
    image: 'https://picsum.photos/seed/shoes/400/400',
    description:
      'Lightweight cushioned running shoe with responsive foam midsole and breathable upper.',
    stock: 30,
  },
  {
    id: 5,
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    price: 129.99,
    rating: 4.4,
    reviewCount: 673,
    image: 'https://picsum.photos/seed/keyboard/400/400',
    description:
      'TKL layout, tactile brown switches, per-key RGB backlighting, USB-C detachable cable.',
    stock: 20,
  },
  {
    id: 6,
    name: 'Non-Stick Cookware Set',
    category: 'Kitchen',
    price: 89.99,
    rating: 4.2,
    reviewCount: 341,
    image: 'https://picsum.photos/seed/cookware/400/400',
    description:
      '10-piece set with granite-coated non-stick surface. Oven safe to 500°F, dishwasher safe.',
    stock: 12,
  },
  {
    id: 7,
    name: 'Yoga Mat',
    category: 'Sports',
    price: 34.99,
    rating: 4.8,
    reviewCount: 1521,
    image: 'https://picsum.photos/seed/yogamat/400/400',
    description:
      '6mm thick eco-friendly TPE mat with alignment lines, non-slip surface, and carrying strap.',
    stock: 45,
  },
  {
    id: 8,
    name: 'Bestselling Novel — The Last Journey',
    category: 'Books',
    price: 14.99,
    rating: 4.9,
    reviewCount: 5302,
    image: 'https://picsum.photos/seed/book/400/400',
    description:
      'Award-winning fiction about an unlikely group of travelers crossing a post-apocalyptic landscape.',
    stock: 0,
  },
  {
    id: 9,
    name: 'Smart LED Desk Lamp',
    category: 'Electronics',
    price: 49.99,
    rating: 4.1,
    reviewCount: 287,
    image: 'https://picsum.photos/seed/lamp/400/400',
    description:
      'Touch-dimmable, 5 color temperatures, USB-A charging port, flexible gooseneck arm.',
    stock: 25,
  },
  {
    id: 10,
    name: 'Backpack — 30L',
    category: 'Travel',
    price: 64.95,
    rating: 4.5,
    reviewCount: 934,
    image: 'https://picsum.photos/seed/backpack/400/400',
    description:
      'Water-resistant 30L daypack with padded laptop sleeve (fits 15"), hip belt, and hidden pocket.',
    stock: 18,
  },
];

export function getProductById(id) {
  return products.find((p) => p.id === Number(id)) ?? null;
}

export default products;
