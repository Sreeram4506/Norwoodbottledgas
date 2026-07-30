import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import { User } from './models/User';
import { Product } from './models/Product';

// Real MHP Grills product-family data (names, models, specs) gathered from
// mhpgrills.com — factual specs only, no copied marketing copy or MHP
// photography. MHP doesn't publish consumer pricing (dealers set their own),
// so prices below are drafts — update them in /admin/inventory before going
// live. Photos are generic placeholders until licensed product photos are
// uploaded via /admin/inventory.
const SEED_PRODUCTS = [
  {
    slug: 'mhp-jnr4-freestanding-cart-grill',
    name: 'MHP JNR4 Freestanding Cart Grill',
    category: 'grill' as const,
    brand: 'MHP',
    model: 'JNR4',
    description:
      'Cart-mount grill head with a solid cast-aluminum housing, H-style stainless burner, and a stainless drop-down shelf. Pairs with MHP cart, post, or column mounting options. Photo pending — official product photo to be added.',
    specs: {
      fuel: 'Propane / Natural Gas',
      burners: '1 (H-Style)',
      btu: '30,000 BTU',
      'grilling area': '495 sq in',
      material: 'Cast aluminum housing, stainless steel burner',
    },
    price: 1899,
    images: ['/grills/placeholder-1.svg'],
    stock: 4,
    isPlaceholder: true,
  },
  {
    slug: 'mhp-wnk4-freestanding-cart-grill',
    name: 'MHP WNK4 Freestanding Cart Grill',
    category: 'grill' as const,
    brand: 'MHP',
    model: 'WNK4',
    description:
      'MHP larger cart-mount grill head with two stainless drop-down shelves and a bigger cooking surface than the JNR4, on the same cast-aluminum housing and H-style burner. Photo pending — official product photo to be added.',
    specs: {
      fuel: 'Propane / Natural Gas',
      burners: '1 (H-Style)',
      btu: '40,000 BTU',
      'grilling area': '642 sq in',
      material: 'Cast aluminum housing, stainless steel burner',
    },
    price: 2199,
    images: ['/grills/placeholder-1.svg'],
    stock: 3,
    isPlaceholder: true,
  },
  {
    slug: 'profire-dlx27g-grill-head',
    name: 'ProFire DLX27G Grill Head',
    category: 'grill' as const,
    brand: 'ProFire',
    model: 'PFDLX27G',
    description:
      '27-inch ProFire DLX grill head with commercial-grade 16-gauge stainless tube burners and two independently controlled grilling zones. Available with an infrared rotisserie kit. Photo pending — official product photo to be added.',
    specs: {
      fuel: 'Propane / Natural Gas',
      burners: '2 zones',
      btu: '44,000 BTU',
      'grilling area': '525 sq in',
      material: '304 stainless steel',
    },
    price: 2499,
    images: ['/grills/placeholder-2.svg'],
    stock: 4,
    isPlaceholder: true,
  },
  {
    slug: 'profire-dlx36g-grill-head',
    name: 'ProFire DLX36G Grill Head',
    category: 'grill' as const,
    brand: 'ProFire',
    model: 'PFDLX36G',
    description:
      '36-inch ProFire DLX grill head with three independently controlled grilling zones and commercial-grade stainless tube burners. Available with an infrared rotisserie kit. Photo pending — official product photo to be added.',
    specs: {
      fuel: 'Propane / Natural Gas',
      burners: '3 zones',
      btu: '66,000 BTU',
      'grilling area': '714 sq in',
      material: '304 stainless steel',
    },
    price: 3199,
    images: ['/grills/placeholder-2.svg'],
    stock: 3,
    isPlaceholder: true,
  },
  {
    slug: 'profire-dlx48g-grill-head',
    name: 'ProFire DLX48G Grill Head',
    category: 'grill' as const,
    brand: 'ProFire',
    model: 'PFDLX48G',
    description:
      'Largest ProFire DLX grill head with four independently controlled grilling zones for high-volume cooking. Available with an infrared rotisserie kit. Photo pending — official product photo to be added.',
    specs: {
      fuel: 'Propane / Natural Gas',
      burners: '4 zones',
      btu: '88,000 BTU',
      'grilling area': '966 sq in',
      material: '304 stainless steel',
    },
    price: 4299,
    images: ['/grills/placeholder-2.svg'],
    stock: 2,
    isPlaceholder: true,
  },
  {
    slug: 'phoenix-sdss-portable-grill',
    name: 'Phoenix SDSS Portable Grill',
    category: 'grill' as const,
    brand: 'Phoenix',
    model: 'SDSS',
    description:
      'Phoenix cast-aluminum end-cap grill with a dual stainless burner for independent left/right heat zones, built for slow roasting and smoking as well as high-heat grilling. Photo pending — official product photo to be added.',
    specs: {
      fuel: 'Propane / Natural Gas',
      btu: '25,000 BTU',
      'temperature range': '250°-500°F',
      'grilling area': '400 sq in',
      material: 'Stainless steel column',
    },
    price: 1799,
    images: ['/grills/placeholder-3.svg'],
    stock: 5,
    isPlaceholder: true,
  },
  {
    slug: 'dragon-fire-df32-p-portable-grill',
    name: 'Dragon Fire DF32-P Portable Grill',
    category: 'grill' as const,
    brand: 'Dragon Fire',
    model: 'DF32-P',
    description:
      '32-inch all stainless-steel Dragon Fire grill head with Spit Fire ignition and an integrated infrared rear burner across four grilling zones. Photo pending — official product photo to be added.',
    specs: {
      fuel: 'Propane',
      burners: '4 zones',
      btu: '61,000 BTU (incl. 13,000 infrared)',
      'grilling area': '758 sq in',
      material: '304 stainless steel',
    },
    price: 2799,
    images: ['/grills/placeholder-3.svg'],
    stock: 3,
    isPlaceholder: true,
  },
  {
    slug: 'dragon-fire-df40-p-portable-grill',
    name: 'Dragon Fire DF40-P Portable Grill',
    category: 'grill' as const,
    brand: 'Dragon Fire',
    model: 'DF40-P',
    description:
      '40-inch all stainless-steel Dragon Fire grill head with Spit Fire ignition and an integrated infrared rear burner across five grilling zones. Photo pending — official product photo to be added.',
    specs: {
      fuel: 'Propane',
      burners: '5 zones',
      btu: '73,000 BTU (incl. 13,000 infrared)',
      'grilling area': '928 sq in',
      material: '304 stainless steel',
    },
    price: 3499,
    images: ['/grills/placeholder-3.svg'],
    stock: 2,
    isPlaceholder: true,
  },
  {
    slug: 'profire-double-side-burner',
    name: 'ProFire Double Side Burner',
    category: 'accessory' as const,
    brand: 'ProFire',
    model: 'PFDLXDSB',
    description: 'Bolt-on stainless side burner with push-button ignition, designed to match the ProFire DLX grill line.',
    specs: { btu: '30,000 BTU', material: '18-gauge stainless steel' },
    price: 499,
    images: ['/grills/placeholder-accessory.svg'],
    stock: 6,
    isPlaceholder: true,
  },
  {
    slug: 'mhp-rotisserie-kit',
    name: 'MHP Rotisserie Kit',
    category: 'accessory' as const,
    brand: 'MHP',
    model: 'RKMHP',
    description: 'Stainless rotisserie motor and spit kit for MHP grill heads.',
    specs: { capacity: '25 lb balanced load', material: 'Stainless steel' },
    price: 249,
    images: ['/grills/placeholder-accessory.svg'],
    stock: 8,
    isPlaceholder: true,
  },
  {
    slug: 'profire-36in-grill-cover',
    name: 'ProFire 36in Grill Cover',
    category: 'accessory' as const,
    brand: 'ProFire',
    model: 'PFVC36C',
    description: 'Heavy-duty vinyl cover embossed with the ProFire logo, sized for the 36-inch cart grill.',
    specs: { material: 'Heavy-duty vinyl', fits: '36-inch ProFire cart models' },
    price: 89,
    images: ['/grills/placeholder-accessory.svg'],
    stock: 12,
    isPlaceholder: true,
  },
  {
    slug: 'dragon-fire-portable-grill-cover',
    name: 'Dragon Fire Portable Grill Cover',
    category: 'accessory' as const,
    brand: 'Dragon Fire',
    model: 'DFVC32C / DFVC40C',
    description: 'Weatherproof cover with a soft PVC-lined interior to protect Dragon Fire portable grill carts.',
    specs: { material: 'Polyester outer, PVC-lined interior', fits: '32-inch and 40-inch Dragon Fire carts' },
    price: 99,
    images: ['/grills/placeholder-accessory.svg'],
    stock: 10,
    isPlaceholder: true,
  },
];

export async function seedPlaceholderProducts() {
  for (const product of SEED_PRODUCTS) {
    await Product.updateOne({ slug: product.slug }, { $setOnInsert: product }, { upsert: true });
  }
}

export async function seedDefaultAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@norwoodgas.local').toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) return;

  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name: 'Site Admin', email, passwordHash, role: 'admin' });
  console.warn(
    `[seed] Created default admin account ${email} with a placeholder password. ` +
      'Set ADMIN_EMAIL / ADMIN_PASSWORD env vars and change this before going to production.'
  );
}

async function main() {
  await connectDB();
  await seedDefaultAdmin();
  await seedPlaceholderProducts();
  console.log('[seed] Done.');
  process.exit(0);
}

// Only run standalone when executed directly (not when imported by dev-server).
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
