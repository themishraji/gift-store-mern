const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: 'Premium Gift Hamper',
    price: 2499,
    category: 'gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop',
    description: 'Luxury gift box with chocolates, dry fruits, and greeting card',
    trending: true,
    onSale: false,
    discount: 0
  },
  {
    name: 'Birthday Celebration Kit',
    price: 1799,
    category: 'birthday',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop',
    description: 'Complete birthday package with balloons, cake toppers, and decorations',
    trending: true,
    onSale: true,
    discount: 15
  },
  {
    name: 'Romantic Rose Bouquet',
    price: 899,
    category: 'flowers',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop',
    description: 'Fresh red roses with elegant wrapping',
    trending: false,
    onSale: false,
    discount: 0
  },
  {
    name: 'Ferrero Rocher Collection',
    price: 1299,
    category: 'chocolates',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop',
    description: 'Premium Ferrero Rocher chocolate gift box - 24 pieces',
    trending: true,
    onSale: true,
    discount: 20
  },
  {
    name: 'Anniversary Special Combo',
    price: 3499,
    category: 'anniversary',
    image: 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?w=400&h=400&fit=crop',
    description: 'Flowers, chocolates, and personalized greeting card combo',
    trending: true,
    onSale: true,
    discount: 10
  },
  {
    name: 'Teddy Bear with Heart',
    price: 699,
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400&h=400&fit=crop',
    description: 'Cute soft teddy bear holding a heart - perfect gift for loved ones',
    trending: false,
    onSale: false,
    discount: 0
  },
  {
    name: 'Mixed Dry Fruits Pack',
    price: 1599,
    category: 'gifts',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop',
    description: 'Premium quality cashews, almonds, pistachios, and raisins - 1kg',
    trending: false,
    onSale: true,
    discount: 25
  },
  {
    name: 'Personalized Photo Frame',
    price: 549,
    category: 'gifts',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop',
    description: 'Beautiful wooden photo frame - customizable with names and messages',
    trending: false,
    onSale: false,
    discount: 0
  },
  {
    name: 'Orchid Plant in Ceramic Pot',
    price: 999,
    category: 'flowers',
    image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=400&fit=crop',
    description: 'Live orchid plant in designer ceramic pot - perfect home decor gift',
    trending: true,
    onSale: false,
    discount: 0
  },
  {
    name: 'Luxury Perfume Gift Set',
    price: 2999,
    category: 'gifts',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    description: 'Premium perfume collection - set of 3 fragrances in elegant box',
    trending: false,
    onSale: true,
    discount: 30
  },
  {
    name: 'Kids Birthday Party Pack',
    price: 2199,
    category: 'birthday',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop',
    description: 'Complete party package with balloons, caps, banners, and return gifts',
    trending: true,
    onSale: false,
    discount: 0
  },
  {
    name: 'Handmade Greeting Cards - Set of 10',
    price: 399,
    category: 'gifts',
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400&h=400&fit=crop',
    description: 'Beautiful handcrafted greeting cards for various occasions',
    trending: false,
    onSale: true,
    discount: 15
  },
  {
    name: 'Sunflower Bouquet',
    price: 749,
    category: 'flowers',
    image: 'https://images.unsplash.com/photo-1500628550463-c8881a54d4d4?w=400&h=400&fit=crop',
    description: 'Bright and cheerful sunflower arrangement with seasonal greens',
    trending: false,
    onSale: false,
    discount: 0
  },
  {
    name: 'Cadbury Celebration Pack',
    price: 799,
    category: 'chocolates',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop',
    description: 'Assorted Cadbury chocolates - perfect for celebrations',
    trending: false,
    onSale: true,
    discount: 10
  },
  {
    name: 'Scented Candle Gift Set',
    price: 1199,
    category: 'gifts',
    image: 'https://images.unsplash.com/photo-1602874801006-96ec97d89edf?w=400&h=400&fit=crop',
    description: 'Luxury aromatherapy candles - set of 4 different fragrances',
    trending: true,
    onSale: false,
    discount: 0
  },
  {
    name: 'Remote Control Car',
    price: 1499,
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd58?w=400&h=400&fit=crop',
    description: 'High-speed RC car with rechargeable battery - perfect for kids',
    trending: false,
    onSale: true,
    discount: 20
  },
  {
    name: 'Mixed Flower Arrangement',
    price: 1199,
    category: 'flowers',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
    description: 'Beautiful arrangement of roses, lilies, and carnations',
    trending: true,
    onSale: false,
    discount: 0
  },
  {
    name: 'Personalized Coffee Mug',
    price: 349,
    category: 'gifts',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
    description: 'Custom printed ceramic mug - add name and photo',
    trending: false,
    onSale: false,
    discount: 0
  },
  {
    name: 'Anniversary Cake Special',
    price: 899,
    category: 'anniversary',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop',
    description: '1kg heart-shaped anniversary cake with photo print option',
    trending: false,
    onSale: true,
    discount: 12
  },
  {
    name: 'Wireless Bluetooth Speaker',
    price: 1999,
    category: 'gifts',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    description: 'Portable speaker with excellent sound quality - perfect tech gift',
    trending: true,
    onSale: true,
    discount: 25
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected ✅');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Old products cleared ✅');

    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
