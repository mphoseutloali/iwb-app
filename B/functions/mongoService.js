const functions = require("firebase-functions");
const mongoose = require("mongoose");

// Get MongoDB URI from Firebase Config
const uri = functions.config().mongo.uri;

// Connect to MongoDB Atlas
async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas via Mongoose');
  } catch (error) {
    console.error('❌ Mongoose connection error:', error);
    process.exit(1); // Exit on failure
  }
}

// ----------------------------
// 🔐 User Model (for role-based access)
// ----------------------------
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Store hashed passwords in production!
  role: { 
    type: String, 
    enum: ['sales', 'finance', 'developer', 'investor', 'partner'],
    default: 'sales'
  }
});
const User = mongoose.model('User', userSchema);

// ----------------------------
// 📦 Product Model
// ----------------------------
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// ----------------------------
// 🛒 Purchase Model
// ----------------------------
const purchaseSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number,
  supplier: String,
  purchaseDate: { type: Date, default: Date.now }
});
const Purchase = mongoose.model('Purchase', purchaseSchema);

// ----------------------------
// 💬 Query Model
// ----------------------------
const querySchema = new mongoose.Schema({
  userId: String,
  subject: String,
  message: String,
  status: { type: String, default: 'pending' },
  response: String,
  createdAt: { type: Date, default: Date.now },
  respondedAt: Date
});
const Query = mongoose.model('Query', querySchema);

// ----------------------------
// 💰 Financial Model
// ----------------------------
const financialSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'] },
  amount: Number,
  description: String,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});
const FinancialData = mongoose.model('FinancialData', financialSchema);

// ----------------------------
// 🧩 Operations
// ----------------------------

// Product Operations
const productOperations = {
  getAll: async () => await Product.find(),
  add: async (data) => await Product.create(data),
  update: async (id, updates) => await Product.findByIdAndUpdate(id, updates),
  delete: async (id) => await Product.findByIdAndDelete(id),
};

// Purchase Operations
const purchaseOperations = {
  getAll: async () => await Purchase.find(),
  add: async (data) => await Purchase.create(data),
};

// Query Operations
const queryOperations = {
  getAll: async () => await Query.find(),
  add: async (data) => await Query.create(data),
  updateStatus: async (id, status, response) => {
    return await Query.findByIdAndUpdate(id, {
      status,
      response,
      respondedAt: new Date()
    });
  }
};

// Finance Operations
const financeOperations = {
  getData: async () => await FinancialData.find(),
  addStatement: async (data) => await FinancialData.create(data),
};

// User Operations
const userOperations = {
  create: async (data) => await User.create(data),
  findByEmail: async (email) => await User.findOne({ email }),
};

// ----------------------------
// 🧪 Test Script (Run with: node mongoService.js)
// ----------------------------
async function main() {
  await connectToDatabase();

  // 🧪 Create test user (uncomment to test)
  /*
  await userOperations.create({
    email: "admin@example.com",
    password: "securepassword123", // Hash this in production!
    role: "developer"
  });
  */

  // 🧪 Create test product (uncomment to test)
  /*
  await productOperations.add({
    name: "Hard Drive",
    category: "Storage",
    price: 50,
    quantity: 10,
    description: "Used 500GB HDD"
  });
  */

  // 📊 Fetch data
  const products = await productOperations.getAll();
  console.log("📦 Products:", products.length ? products : "No products found");

  const users = await User.find();
  console.log("👥 Users:", users.length ? users : "No users found");
}

// Only run test script if file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

// ----------------------------
// 📤 Export for Express API
// ----------------------------
module.exports = {
  connectToDatabase,
  // Models
  Product,
  Purchase,
  Query,
  FinancialData,
  User,
  // Operations
  productOperations,
  purchaseOperations,
  queryOperations,
  financeOperations,
  userOperations
};