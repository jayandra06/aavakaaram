# AavaKaaram - Pickles E-Commerce Platform

A modern e-commerce platform for AavaKaaram pickles business, built with Next.js, Firebase, and DHL API integration..

## Features

### Customer Features
- 🔐 Phone number authentication (Firebase)
- 🛍️ Browse products with categories
- 🛒 Shopping cart and checkout
- 📦 Order management and tracking
- 📍 Address management
- ⭐ Product reviews and ratings
- 🔗 Share product links
- 🖼️ Image gallery with zoom
- 🌓 Light/Dark mode

### Admin Features
- 📊 Admin dashboard
- 📝 Catalogue management (Add/Edit/Delete products)
- 📦 Inventory management (Stock updates)
- 🏷️ Category management
- 📋 Order management
- 🚚 DHL shipment creation and tracking
- 💬 Review moderation (Edit/Reply/Disable)
- 📦 Consignment management

### Shipping Integration
- 🌍 DHL Express API integration
- 📍 Domestic (India) and International shipping
- 📊 Real-time shipment tracking
- ❌ Shipment cancellation

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Shipping**: DHL Express API
- **State Management**: Zustand
- **UI Components**: Headless UI, Heroicons

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- DHL API credentials

### Installation

1. Clone the repository
```bash
cd "/media/jay/DATA/pickles website"
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file (already created) with your Firebase and DHL credentials.

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/
│   ├── firebase/       # Firebase configuration and utilities
│   └── dhl/            # DHL API integration
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

## Firebase Setup

1. Enable Phone Authentication in Firebase Console
2. Set up Firestore Database
3. Configure Storage rules
4. Set up Firestore Security Rules

## DHL API Setup

The project uses DHL Express API for shipping:
- Shipment Creation (MyDHL API)
- Shipment Tracking
- Shipment Cancellation

API credentials are stored in `.env.local`.

## Theme

The application features a "Red Hot Spicy & Black" theme with:
- Primary colors: Red (#DC2626, #B91C1C)
- Secondary: Black (#000000, #1F1F1F)
- Accent: Spicy Orange (#F97316)
- Light and Dark mode support

## License

Private - AavaKaaram Business

