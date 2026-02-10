import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Gift,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Search,
  X,
  Package,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Home,
  ArrowLeft,
  MessageCircle,
  Send,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

export default function GiftStore() {
  // Main State
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // View States
  const [currentView, setCurrentView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Modal States
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "नमस्ते! 👋 मैं Happyoffers Assistant हूँ। क्या मैं आपकी कोई मदद कर सकता हूँ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "gifts",
    image: "",
    description: "",
    trending: false,
    onSale: false,
    discount: 0,
  });

  const categories = [
    {
      id: "gifts",
      name: "Gifts",
      icon: "🎁",
      color: "from-pink-500 to-red-500",
    },
    {
      id: "birthday",
      name: "Birthday",
      icon: "🎂",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "anniversary",
      name: "Anniversary",
      icon: "💑",
      color: "from-red-500 to-pink-500",
    },
    {
      id: "flowers",
      name: "Flowers",
      icon: "🌹",
      color: "from-pink-400 to-purple-500",
    },
    {
      id: "chocolates",
      name: "Chocolates",
      icon: "🍫",
      color: "from-amber-600 to-yellow-500",
    },
    {
      id: "toys",
      name: "Toys",
      icon: "🧸",
      color: "from-purple-500 to-pink-500",
    },
  ];

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // API Calls
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setApiError(false);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  // Chatbot response logic
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    const responses = {
      hello:
        "नमस्ते! 👋 आपका स्वागत है Happyoffers में। मैं आपकी कैसे सहायता कर सकता हूँ?",
      hi: "नमस्ते! 👋 आपका स्वागत है Happyoffers में। मैं आपकी कैसे सहायता कर सकता हूँ?",
      products:
        "हमारे पास 6 अलग-अलग categories हैं: 🎁 Gifts, 🎂 Birthday, 💑 Anniversary, 🌹 Flowers, 🍫 Chocolates, और 🧸 Toys। आप किसी भी category को explore कर सकते हैं!",
      category:
        "हमारे पास 6 अलग-अलग categories हैं: 🎁 Gifts, 🎂 Birthday, 💑 Anniversary, 🌹 Flowers, 🍫 Chocolates, और 🧸 Toys। आप किसी भी category को explore कर सकते हैं!",
      price:
        "हमारी prices बहुत competitive हैं। आप categories browse करके अपने budget के अनुसार products देख सकते हैं। Sale और Trending items पर अतिरिक्त discount भी मिलते हैं! 🎉",
      delivery:
        "Delivery के लिए कृपया checkout के समय अपना address provide करें। हम जल्द ही delivery tracking feature add करेंगे! 📦",
      payment:
        "Checkout functionality जल्द ही launch हो रही है। अभी आप अपनी cart देख सकते हैं। 💳",
      cart: "आप 'Cart' button से अपने selected products को देख सकते हैं, quantity को adjust कर सकते हैं। 🛒",
      admin:
        "Admin panel से आप नए products add कर सकते हैं, edit कर सकते हैं, या delete कर सकते हैं। 📊",
      trending:
        "Trending products हमारी best-selling और most-loved items हैं। Home page पर 'Trending Now' section में देखें! 🔥",
      sale: "Sale items पर special discounts हैं। Home page पर 'Special Offers' section में amazing deals मिलेंगी! 🎉",
      search:
        "Search bar का उपयोग करके आप product name या description के आधार पर search कर सकते हैं। 🔍",
      contact:
        "हमारे support team से संपर्क करें: 📞 +91-8698568729 (Ansh Mishra) या नीचे दिए गए details देखें। हम 24/7 available हैं! ✉️",
      support:
        "हमारे support team से संपर्क करें: 📞 +91-8698568729 (Ansh Mishra) या नीचे दिए गए details देखें। हम 24/7 available हैं! ✉️",
      help: "आप क्या जानना चाहते हैं? मैं आपकी मदद कर सकता हूँ:\n- Products & Categories\n- Cart & Checkout\n- Delivery\n- Admin Panel\n- Payment\n- Support Contact Info\n\nकृपया अपना सवाल पूछें! 😊",
      thank: "आपका स्वागत है! 😊 क्या मैं और कोई मदद कर सकता हूँ?",
      thanks: "आपका स्वागत है! 😊 क्या मैं और कोई मदद कर सकता हूँ?",
      "thanks you": "आपका स्वागत है! 😊 क्या मैं और कोई मदद कर सकता हूँ?",
      bye: "धन्यवाद! 👋 Happy shopping! 🎁",
      goodbye: "धन्यवाद! 👋 Happy shopping! 🎁",
    };

    for (const [key, value] of Object.entries(responses)) {
      if (message.includes(key)) {
        return value;
      }
    }

    return "माफ़ी चाहता हूँ, मैं समझ नहीं पाया। कृपया अन्य प्रश्न पूछें या support team से संपर्क करें: 📞 +91-8698568729 🤔";
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = {
      id: chatMessages.length + 1,
      text: chatInput,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, userMessage]);
    setChatInput("");

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        text: getBotResponse(chatInput),
        sender: "bot",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount: parseFloat(formData.discount) || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setProducts([...products, data.product]);
      resetForm();
      alert("✅ Product added!");
    } catch (error) {
      alert("❌ Error adding product");
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`${API_URL}/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount: parseFloat(formData.discount) || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setProducts(
        products.map((p) => (p._id === editingProduct._id ? data.product : p)),
      );
      resetForm();
      alert("✅ Product updated!");
    } catch (error) {
      alert("❌ Error updating");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      setProducts(products.filter((p) => p._id !== id));
      alert("✅ Product deleted!");
    } catch (error) {
      alert("❌ Error deleting");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "gifts",
      image: "",
      description: "",
      trending: false,
      onSale: false,
      discount: 0,
    });
    setEditingProduct(null);
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item._id !== id));
    } else {
      setCart(
        cart.map((item) => (item._id === id ? { ...item, quantity } : item)),
      );
    }
  };

  const getDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.onSale
      ? getDiscountedPrice(item.price, item.discount)
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categoryProducts = selectedCategory
    ? filteredProducts.filter((p) => p.category === selectedCategory)
    : [];

  const trendingProducts = products.filter((p) => p.trending).slice(0, 6);
  const saleProducts = products.filter((p) => p.onSale).slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center px-4">
          <Gift className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-bounce" />
          <p className="text-lg sm:text-xl font-semibold text-gray-700">
            Loading Happyoffers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40 border-b-4 border-pink-400">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={() => {
                setCurrentView("home");
                setSelectedCategory(null);
              }}
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition flex-shrink-0"
            >
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                <Gift className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Happyoffers
                </h1>
              </div>
            </button>

            {/* Navigation & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {currentView !== "home" && (
                <button
                  onClick={() => {
                    setCurrentView("home");
                    setSelectedCategory(null);
                    setSelectedProduct(null);
                  }}
                  className="hidden sm:flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm sm:text-base"
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Home</span>
                </button>
              )}

              <button
                onClick={() => setShowAdminModal(true)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-xs sm:text-sm"
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Admin</span>
              </button>

              <button
                onClick={() => setShowCartModal(true)}
                className="relative flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-xs sm:text-sm"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {apiError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded flex items-center text-xs sm:text-base">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span>
              ⚠️ Backend not available. Make sure your API is running!
            </span>
          </div>
        )}

        {/* HOME VIEW */}
        {currentView === "home" && (
          <>
            {/* Hero Section */}
            <div className="mb-8 sm:mb-12 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-white text-center shadow-2xl">
              <h2 className="text-2xl sm:text-5xl font-bold mb-2 sm:mb-4">
                Welcome to Happyoffers! 🎁
              </h2>
              <p className="text-base sm:text-xl opacity-90">
                Discover perfect gifts for every occasion
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8 sm:mb-12">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 border-4 border-pink-300 rounded-xl sm:rounded-2xl text-sm sm:text-lg focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all shadow-lg"
                />
              </div>
            </div>

            {/* Categories Grid */}
            <div className="mb-12 sm:mb-16">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">
                Shop by Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentView("category");
                    }}
                    className={`bg-gradient-to-br ${cat.color} p-3 sm:p-6 rounded-xl sm:rounded-2xl text-white text-center font-bold shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 group`}
                  >
                    <div className="text-2xl sm:text-4xl mb-1 sm:mb-2 group-hover:scale-125 transition-transform">
                      {cat.icon}
                    </div>
                    <div className="text-xs sm:text-sm">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Section */}
            {trendingProducts.length > 0 && (
              <div className="mb-12 sm:mb-16">
                <div className="flex items-center justify-between mb-4 sm:mb-8 flex-wrap gap-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                    <h3 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      Trending Now 🔥
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentView("products")}
                    className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 font-bold text-xs sm:text-base"
                  >
                    View All <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {trendingProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onView={() => {
                        setSelectedProduct(product);
                        setCurrentView("detail");
                      }}
                      onAdd={() => {
                        addToCart(product);
                        setShowCartModal(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sale Section */}
            {saleProducts.length > 0 && (
              <div className="mb-12 sm:mb-16">
                <div className="flex items-center justify-between mb-4 sm:mb-8 flex-wrap gap-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
                    <h3 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      Special Offers 🎉
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentView("products")}
                    className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 font-bold text-xs sm:text-base"
                  >
                    View All <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {saleProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onView={() => {
                        setSelectedProduct(product);
                        setCurrentView("detail");
                      }}
                      onAdd={() => {
                        addToCart(product);
                        setShowCartModal(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* PRODUCTS VIEW */}
        {currentView === "products" && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                All Products
              </h2>
              <span className="text-xs sm:text-base text-gray-600">
                {filteredProducts.length} products
              </span>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-2xl sm:rounded-3xl shadow-lg">
                <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-lg sm:text-xl text-gray-500 font-semibold">
                  No products found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onView={() => {
                      setSelectedProduct(product);
                      setCurrentView("detail");
                    }}
                    onAdd={() => {
                      addToCart(product);
                      setShowCartModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* CATEGORY VIEW */}
        {currentView === "category" && selectedCategory && (
          <>
            <div className="flex items-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
              <button
                onClick={() => setCurrentView("home")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800 capitalize">
                {selectedCategory} ({categoryProducts.length})
              </h2>
            </div>
            {categoryProducts.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-2xl sm:rounded-3xl shadow-lg">
                <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-base sm:text-xl text-gray-500">
                  No products in this category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onView={() => {
                      setSelectedProduct(product);
                      setCurrentView("detail");
                    }}
                    onAdd={() => {
                      addToCart(product);
                      setShowCartModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* PRODUCT DETAIL VIEW */}
        {currentView === "detail" && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => setCurrentView("home")}
            onAddToCart={() => {
              addToCart(selectedProduct);
              setShowCartModal(true);
            }}
          />
        )}
      </div>

      {/* ADMIN MODAL */}
      {showAdminModal && (
        <AdminModal
          onClose={() => {
            setShowAdminModal(false);
            resetForm();
          }}
          products={products}
          formData={formData}
          setFormData={setFormData}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onEdit={(product) => {
            setEditingProduct(product);
            setFormData({
              name: product.name,
              price: product.price.toString(),
              category: product.category,
              image: product.image,
              description: product.description,
              trending: product.trending,
              onSale: product.onSale,
              discount: product.discount,
            });
          }}
        />
      )}

      {/* CART MODAL */}
      {showCartModal && (
        <CartModal
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setShowCartModal(false)}
          onUpdateQuantity={updateCartQuantity}
          getDiscountedPrice={getDiscountedPrice}
        />
      )}

      {/* CHATBOT MODAL */}
      {showChatbot && (
        <ChatbotModal
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onSendMessage={handleSendMessage}
          onClose={() => setShowChatbot(false)}
          chatEndRef={chatEndRef}
        />
      )}

      {/* FLOATING CHATBOT BUTTON */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all z-30 flex items-center justify-center border-4 border-white"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white py-8 sm:py-12 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
            {/* Brand */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 mb-2">
                <Gift className="w-8 h-8 sm:w-10 sm:h-10" />
                <h3 className="text-2xl sm:text-3xl font-bold">Happyoffers</h3>
              </div>
              <p className="text-xs sm:text-sm opacity-90">
                Making every moment special with perfect gifts
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="font-bold mb-3 text-sm sm:text-base">
                Quick Links
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm opacity-90">
                <li>
                  <button
                    onClick={() => setCurrentView("home")}
                    className="hover:opacity-100"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView("products")}
                    className="hover:opacity-100"
                  >
                    Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowCartModal(true)}
                    className="hover:opacity-100"
                  >
                    Cart
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center sm:text-right">
              <h4 className="font-bold mb-3 text-sm sm:text-base">
                Contact Us
              </h4>
              <div className="space-y-2 text-xs sm:text-sm opacity-90">
                <div className="flex items-center justify-center sm:justify-end space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91-8698568729</span>
                </div>
                <div className="text-xs sm:text-sm">Ansh Mishra</div>
                <button
                  onClick={() => setShowChatbot(true)}
                  className="text-yellow-300 hover:text-yellow-100 font-semibold text-xs sm:text-sm mt-2"
                >
                  💬 Chat with us
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white border-opacity-20 pt-6 text-center text-xs sm:text-sm opacity-75">
            <p>
              © 2026 Happyoffers. All rights reserved. | Made with ❤️ for gift
              lovers
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap");
        * {
          font-family: "Poppins", sans-serif;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// PRODUCT CARD COMPONENT
function ProductCard({ product, onView, onAdd }) {
  const discountedPrice = product.onSale
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-pink-300 group cursor-pointer h-full flex flex-col">
      <div
        onClick={onView}
        className="relative overflow-hidden h-40 sm:h-64 bg-gray-100"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
            <Gift className="w-12 h-12 sm:w-20 sm:h-20 text-pink-300" />
          </div>
        )}

        {product.trending && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
            <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" />
            <span>TRENDING</span>
          </div>
        )}

        {product.onSale && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5 flex-1 flex flex-col">
        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full uppercase w-fit">
          {product.category}
        </span>

        <h3
          onClick={onView}
          className="text-sm sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-2 mt-2 hover:text-pink-600 transition"
        >
          {product.name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2 flex-1 min-w-0">
            {product.onSale ? (
              <>
                <span className="text-lg sm:text-2xl font-bold text-pink-600 truncate">
                  ₹{discountedPrice.toFixed(0)}
                </span>
                <span className="text-xs sm:text-sm text-gray-400 line-through truncate">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-lg sm:text-2xl font-bold text-gray-800">
                ₹{product.price}
              </span>
            )}
          </div>

          <button
            onClick={onAdd}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all flex-shrink-0"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// PRODUCT DETAIL VIEW
function ProductDetailView({ product, onBack, onAddToCart }) {
  const discountedPrice = product.onSale
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="animate-fadeIn">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-bold mb-4 sm:mb-6 text-xs sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
        {/* Image */}
        <div className="flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 sm:h-96 object-cover rounded-xl sm:rounded-2xl"
            />
          ) : (
            <div className="w-full h-64 sm:h-96 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Gift className="w-20 h-20 sm:w-32 sm:h-32 text-pink-300" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 flex-wrap gap-2">
              <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full uppercase">
                {product.category}
              </span>
              {product.trending && (
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 sm:px-3 py-1 rounded-full">
                  🔥 Trending
                </span>
              )}
              {product.onSale && (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 sm:px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              {product.name}
            </h2>

            <p className="text-gray-600 text-sm sm:text-lg mb-4 sm:mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-6 sm:mb-8">
              {product.onSale ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="text-4xl sm:text-5xl font-bold text-pink-600">
                    ₹{discountedPrice.toFixed(0)}
                  </span>
                  <span className="text-lg sm:text-2xl text-gray-400 line-through">
                    ₹{product.price}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-green-600">
                    Save ₹{(product.price - discountedPrice).toFixed(0)}!
                  </span>
                </div>
              ) : (
                <span className="text-4xl sm:text-5xl font-bold text-gray-800">
                  ₹{product.price}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onAddToCart}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2 sm:space-x-3"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ADMIN MODAL
function AdminModal({
  onClose,
  products,
  formData,
  setFormData,
  editingProduct,
  setEditingProduct,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onEdit,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl my-4 sm:my-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-8 border-b-2 border-gray-200">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
            Admin Panel
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 max-h-96 overflow-y-auto">
          {/* Form */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Product Name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-pink-200 text-sm sm:text-base"
            />

            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Price (₹)"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-pink-200 text-sm sm:text-base"
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-pink-200 text-sm sm:text-base"
            >
              <option value="gifts">Gifts</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="flowers">Flowers</option>
              <option value="chocolates">Chocolates</option>
              <option value="toys">Toys</option>
            </select>

            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="Image URL"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-pink-200 text-sm sm:text-base"
            />

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-pink-200 text-sm sm:text-base"
            />

            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap gap-2">
              <label className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={formData.trending}
                  onChange={(e) =>
                    setFormData({ ...formData, trending: e.target.checked })
                  }
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span>Trending</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={formData.onSale}
                  onChange={(e) =>
                    setFormData({ ...formData, onSale: e.target.checked })
                  }
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span>On Sale</span>
              </label>

              {formData.onSale && (
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  placeholder="Discount %"
                  className="w-16 sm:w-20 px-2 sm:px-3 py-2 border-2 border-pink-300 rounded-lg text-sm sm:text-base"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-2 sm:space-x-4 mb-6 sm:mb-8">
            {editingProduct ? (
              <>
                <button
                  onClick={onUpdateProduct}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:shadow-xl text-sm sm:text-base"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({
                      name: "",
                      price: "",
                      category: "gifts",
                      image: "",
                      description: "",
                      trending: false,
                      onSale: false,
                      discount: 0,
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={onAddProduct}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Product</span>
              </button>
            )}
          </div>

          {/* Product List */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
              Products ({products.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-gray-200 gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 text-sm sm:text-base truncate">
                      {product.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      ₹{product.price}
                    </p>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product._id)}
                      className="p-1 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CART MODAL
function CartModal({
  cart,
  cartTotal,
  onClose,
  onUpdateQuantity,
  getDiscountedPrice,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl animate-fadeIn max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-8 border-b-2 border-gray-200">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="p-4 sm:p-8 text-center flex-1 flex items-center justify-center">
            <div>
              <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-xl text-gray-500 font-semibold">
                Your cart is empty
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
              {cart.map((item) => {
                const displayPrice = item.onSale
                  ? getDiscountedPrice(item.price, item.discount)
                  : item.price;
                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-gray-200 gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        ₹{displayPrice.toFixed(0)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-white border-2 border-pink-300 rounded-lg flex-shrink-0">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item._id, item.quantity - 1)
                        }
                        className="px-2 py-1 text-pink-600 font-bold text-sm sm:text-base"
                      >
                        -
                      </button>
                      <span className="px-2 sm:px-3 font-bold text-xs sm:text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-2 py-1 text-pink-600 font-bold text-sm sm:text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with Total */}
            <div className="p-4 sm:p-8 border-t-2 border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
                <span className="text-xl sm:text-2xl font-bold text-gray-800">
                  Total:
                </span>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{cartTotal.toFixed(0)}
                </span>
              </div>
              <button
                onClick={() =>
                  alert(
                    "Checkout functionality coming soon! Total: ₹" +
                      cartTotal.toFixed(0),
                  )
                }
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// CHATBOT MODAL
function ChatbotModal({
  chatMessages,
  chatInput,
  setChatInput,
  onSendMessage,
  onClose,
  chatEndRef,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-screen sm:h-auto sm:max-h-96 animate-slideUp flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold">
              Happyoffers Support
            </h2>
            <p className="text-xs sm:text-sm opacity-90">24/7 Available 💬</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t-2 border-gray-200 p-3 sm:p-4 bg-white rounded-b-2xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 sm:px-4 py-2 border-2 border-pink-300 rounded-lg focus:ring-4 focus:ring-pink-200 text-sm sm:text-base"
            />
            <button
              onClick={onSendMessage}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 sm:p-3 rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            📞 Call us: +91-8698568729 (Ansh Mishra) | Email:
            support@happyoffers.com
          </p>
        </div>
      </div>
    </div>
  );
}
