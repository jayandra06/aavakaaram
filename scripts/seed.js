const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, Timestamp } = require("firebase/firestore");
require("dotenv").config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = [
  {
    name: "Veg Pickles",
    slug: "veg",
    description: "Delicious vegetarian pickles made with fresh vegetables",
    image: "🥕",
  },
  {
    name: "Non-Veg Pickles",
    slug: "non-veg",
    description: "Spicy non-vegetarian pickles with authentic flavors",
    image: "🍗",
  },
  {
    name: "Snacks",
    slug: "snacks",
    description: "Crunchy and spicy snacks to satisfy your cravings",
    image: "🍿",
  },
  {
    name: "Karappodi",
    slug: "karappodi",
    description: "Traditional spicy karappodi varieties",
    image: "🌶️",
  },
];

// Products with real images from Unsplash
const products = [
  // Veg Pickles
  {
    name: "Mango Pickle (Aavakaaya)",
    description: "Traditional Andhra style raw mango pickle with red chilies and spices. Perfect blend of tangy and spicy flavors that will make your taste buds dance.",
    images: ["https://images.unsplash.com/photo-1606914509765-5c4a5c8e8b8c?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 350,
    inInventory: true,
    stock: 50,
    rating: 4.8,
    isTrending: true,
    isTopSelling: true,
    discount: 15,
  },
  {
    name: "Lemon Pickle",
    description: "Tangy lemon pickle with mustard seeds and aromatic spices. Great for digestion and adds zing to any meal. Perfect accompaniment to rice and curries.",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 280,
    inInventory: true,
    stock: 75,
    rating: 4.6,
    isTrending: true,
    discount: 10,
  },
  {
    name: "Mixed Vegetable Pickle",
    description: "A delightful mix of vegetables including carrot, cauliflower, and beans, all pickled in spicy oil. Bursting with flavors and textures.",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 320,
    inInventory: true,
    stock: 60,
    rating: 4.7,
    isTopSelling: true,
  },
  {
    name: "Ginger Pickle",
    description: "Spicy ginger pickle with a perfect balance of heat and flavor. Great for cold and cough relief. Packed with health benefits.",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 290,
    inInventory: true,
    stock: 40,
    rating: 4.5,
  },
  {
    name: "Garlic Pickle",
    description: "Strong and flavorful garlic pickle. Packed with health benefits and amazing taste. Perfect for garlic lovers!",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 310,
    inInventory: true,
    stock: 55,
    rating: 4.6,
    discount: 12,
  },
  {
    name: "Chilli Pickle",
    description: "Fiery red chilli pickle for the brave. Intensely spicy and flavorful. Not for the faint-hearted!",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 270,
    inInventory: true,
    stock: 45,
    rating: 4.9,
    isTrending: true,
  },
  // Non-Veg Pickles
  {
    name: "Chicken Pickle",
    description: "Spicy chicken pickle with tender pieces marinated in traditional spices. A perfect accompaniment to rice or roti. Rich and flavorful.",
    images: ["https://images.unsplash.com/photo-1606914509765-5c4a5c8e8b8c?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 450,
    inInventory: true,
    stock: 30,
    rating: 4.8,
    isTopSelling: true,
    discount: 20,
  },
  {
    name: "Fish Pickle",
    description: "Tangy and spicy fish pickle with authentic coastal flavors. Made with fresh fish and traditional spices. A coastal delicacy.",
    images: ["https://images.unsplash.com/photo-1606914509765-5c4a5c8e8b8c?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 480,
    inInventory: true,
    stock: 25,
    rating: 4.7,
    isTrending: true,
  },
  {
    name: "Prawn Pickle",
    description: "Delicious prawn pickle with a perfect blend of spices. Rich in flavor and protein. A seafood lover's delight.",
    images: ["https://images.unsplash.com/photo-1606914509765-5c4a5c8e8b8c?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 520,
    inInventory: true,
    stock: 20,
    rating: 4.9,
    discount: 18,
  },
  // Snacks
  {
    name: "Spicy Mixture",
    description: "Crispy and spicy mixture with peanuts, sev, and spices. Perfect tea-time snack. Addictively delicious!",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 180,
    inInventory: true,
    stock: 100,
    rating: 4.6,
    isTopSelling: true,
    discount: 15,
  },
  {
    name: "Murukku",
    description: "Traditional crispy murukku with perfect crunch and spice level. Made with authentic recipe. Crunchy and flavorful.",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 200,
    inInventory: true,
    stock: 80,
    rating: 4.7,
    isTrending: true,
  },
  {
    name: "Spicy Peanuts",
    description: "Roasted peanuts coated with spicy masala. Addictively delicious! Perfect for munching anytime.",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 150,
    inInventory: true,
    stock: 120,
    rating: 4.5,
    discount: 10,
  },
  {
    name: "Banana Chips",
    description: "Crispy banana chips with a hint of spice. Traditional South Indian snack. Light, crispy, and flavorful.",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 160,
    inInventory: true,
    stock: 90,
    rating: 4.6,
  },
  // Karappodi
  {
    name: "Red Chili Karappodi",
    description: "Traditional red chili karappodi with intense heat and flavor. Not for the faint-hearted! Packed with authentic spices.",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 250,
    inInventory: true,
    stock: 45,
    rating: 4.8,
    isTrending: true,
    discount: 12,
  },
  {
    name: "Garlic Karappodi",
    description: "Garlic-infused karappodi with a strong flavor profile. Perfect for spice lovers. Intensely flavorful.",
    images: ["https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"],
    categoryId: "",
    price: 270,
    inInventory: true,
    stock: 35,
    rating: 4.7,
  },
];

async function seedData() {
  try {
    console.log("🌱 Starting to seed data...");

    // Seed Categories
    console.log("📁 Creating categories...");
    const categoryMap = {};
    
    for (const category of categories) {
      const docRef = await addDoc(collection(db, "categories"), {
        ...category,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      categoryMap[category.slug] = docRef.id;
      console.log(`✅ Created category: ${category.name} (${docRef.id})`);
    }

    // Seed Products
    console.log("\n📦 Creating products...");
    const productCategories = [
      { start: 0, end: 6, category: "veg" },
      { start: 6, end: 9, category: "non-veg" },
      { start: 9, end: 13, category: "snacks" },
      { start: 13, end: 15, category: "karappodi" },
    ];

    for (const range of productCategories) {
      for (let i = range.start; i < range.end; i++) {
        const product = {
          ...products[i],
          categoryId: categoryMap[range.category],
        };
        const docRef = await addDoc(collection(db, "catalogue"), {
          ...product,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        console.log(`✅ Created product: ${product.name} (${docRef.id})`);
      }
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log(`📊 Created ${categories.length} categories and ${products.length} products`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

// Run the seed function
seedData().then(() => {
  console.log("\n✨ Done!");
  process.exit(0);
});
