# Seeding Sample Data

## How to Seed Data

Run the following command to seed your Firestore database with sample categories and products:

```bash
npm run seed
```

This will create:
- **4 Categories**: Veg Pickles, Non-Veg Pickles, Snacks, Karappodi
- **13 Products**: Various pickles and snacks across all categories

## What Gets Created

### Categories
1. Veg Pickles (🥕)
2. Non-Veg Pickles (🍗)
3. Snacks (🍿)
4. Karappodi (🌶️)

### Products

#### Veg Pickles (5 products)
- Mango Pickle (Aavakaaya) - ₹350
- Lemon Pickle - ₹280
- Mixed Vegetable Pickle - ₹320
- Ginger Pickle - ₹290
- Garlic Pickle - ₹310

#### Non-Veg Pickles (3 products)
- Chicken Pickle - ₹450
- Fish Pickle - ₹480
- Prawn Pickle - ₹520

#### Snacks (3 products)
- Spicy Mixture - ₹180
- Murukku - ₹200
- Spicy Peanuts - ₹150

#### Karappodi (2 products)
- Red Chili Karappodi - ₹250
- Garlic Karappodi - ₹270

## Requirements

- Firebase project must be set up
- `.env.local` file must contain Firebase credentials
- Firestore database must be initialized
- Authentication is not required for seeding (runs server-side)

## Notes

- All products are created with `inInventory: true` and stock quantities
- Products are linked to their respective categories
- Prices are in Indian Rupees (₹)
- You can modify the seed script to add more products or categories

