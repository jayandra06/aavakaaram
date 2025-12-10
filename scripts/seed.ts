import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

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

const products = [
  // Veg Pickles
  {
    name: "Mango Pickle (Aavakaaya)",
    description: "Traditional Andhra style raw mango pickle with red chilies and spices. Perfect blend of tangy and spicy flavors.",
    images: ["🥭"],
    categoryId: "", // Will be set after category creation
    price: 350,
    inInventory: true,
    stock: 50,
  },
  {
    name: "Lemon Pickle",
    description: "Tangy lemon pickle with mustard seeds and aromatic spices. Great for digestion and adds zing to any meal.",
    images: ["🍋"],
    categoryId: "",
    price: 280,
    inInventory: true,
    stock: 75,
  },
  {
    name: "Mixed Vegetable Pickle",
    description: "A delightful mix of vegetables including carrot, cauliflower, and beans, all pickled in spicy oil.",
    images: ["🥕"],
    categoryId: "",
    price: 320,
    inInventory: true,
    stock: 60,
  },
  {
    name: "Ginger Pickle",
    description: "Spicy ginger pickle with a perfect balance of heat and flavor. Great for cold and cough relief.",
    images: ["🫚"],
    categoryId: "",
    price: 290,
    inInventory: true,
    stock: 40,
  },
  {
    name: "Garlic Pickle",
    description: "Strong and flavorful garlic pickle. Packed with health benefits and amazing taste.",
    images: ["🧄"],
    categoryId: "",
    price: 310,
    inInventory: true,
    stock: 55,
  },
  // Non-Veg Pickles
  {
    name: "Chicken Pickle",
    description: "Spicy chicken pickle with tender pieces marinated in traditional spices. A perfect accompaniment to rice or roti.",
    images: ["🍗"],
    categoryId: "",
    price: 450,
    inInventory: true,
    stock: 30,
  },
  {
    name: "Fish Pickle",
    description: "Tangy and spicy fish pickle with authentic coastal flavors. Made with fresh fish and traditional spices.",
    images: ["🐟"],
    categoryId: "",
    price: 480,
    inInventory: true,
    stock: 25,
  },
  {
    name: "Prawn Pickle",
    description: "Delicious prawn pickle with a perfect blend of spices. Rich in flavor and protein.",
    images: ["🦐"],
    categoryId: "",
    price: 520,
    inInventory: true,
    stock: 20,
  },
  // Snacks
  {
    name: "Spicy Mixture",
    description: "Crispy and spicy mixture with peanuts, sev, and spices. Perfect tea-time snack.",
    images: ["🥜"],
    categoryId: "",
    price: 180,
    inInventory: true,
    stock: 100,
  },
  {
    name: "Murukku",
    description: "Traditional crispy murukku with perfect crunch and spice level.",
    images: ["🥨"],
    categoryId: "",
    price: 200,
    inInventory: true,
    stock: 80,
  },
  {
    name: "Spicy Peanuts",
    description: "Roasted peanuts coated with spicy masala. Addictively delicious!",
    images: ["🥜"],
    categoryId: "",
    price: 150,
    inInventory: true,
    stock: 120,
  },
  // Karappodi
  {
    name: "Red Chili Karappodi",
    description: "Traditional red chili karappodi with intense heat and flavor. Not for the faint-hearted!",
    images: ["🌶️"],
    categoryId: "",
    price: 250,
    inInventory: true,
    stock: 45,
  },
  {
    name: "Garlic Karappodi",
    description: "Garlic-infused karappodi with a strong flavor profile. Perfect for spice lovers.",
    images: ["🧄"],
    categoryId: "",
    price: 270,
    inInventory: true,
    stock: 35,
  },
];

async function seedData() {
  try {
    console.log("🌱 Starting to seed data...");

    // Seed Categories
    console.log("📁 Creating categories...");
    const categoryMap: { [key: string]: string } = {};
    
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
      { start: 0, end: 5, category: "veg" },
      { start: 5, end: 8, category: "non-veg" },
      { start: 8, end: 11, category: "snacks" },
      { start: 11, end: 13, category: "karappodi" },
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

