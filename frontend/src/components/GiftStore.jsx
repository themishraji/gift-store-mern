import React, { useState, useEffect } from "react";
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
  const [currentView, setCurrentView] = useState("home"); // home, products, category, detail
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Modal States
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  // Filtering Logic
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
        <div className="text-center">
          <Gift className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-bounce" />
          <p className="text-xl font-semibold text-gray-700">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => {
                setCurrentView("home");
                setSelectedCategory(null);
              }}
              className="flex items-center space-x-3 hover:opacity-80 transition"
            >
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Happyoffers
                </h1>
              </div>
            </button>

            {/* Navigation & Actions */}
            <div className="flex items-center space-x-4">
              {currentView !== "home" && (
                <button
                  onClick={() => {
                    setCurrentView("home");
                    setSelectedCategory(null);
                    setSelectedProduct(null);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
              )}

              <button
                onClick={() => setShowAdminModal(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <Package className="w-5 h-5" />
                <span className="hidden sm:inline">Admin</span>
              </button>

              <button
                onClick={() => setShowCartModal(true)}
                className="relative flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {apiError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-3" />
            <span>
              ⚠️ Backend not available. Make sure your API is running!
            </span>
          </div>
        )}

        {/* HOME VIEW */}
        {currentView === "home" && (
          <>
            {/* Hero Section */}
            <div className="mb-12 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-12 text-white text-center shadow-2xl">
              <h2 className="text-5xl font-bold mb-4">
                Welcome to Happyoffers! 🎁
              </h2>
              <p className="text-xl opacity-90">
                Discover perfect gifts for every occasion
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-14 pr-6 py-4 border-4 border-pink-300 rounded-2xl text-lg focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all shadow-lg"
                />
              </div>
            </div>

            {/* Categories Grid */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">
                Shop by Category
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentView("category");
                    }}
                    className={`bg-gradient-to-br ${cat.color} p-6 rounded-2xl text-white text-center font-bold shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 group`}
                  >
                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                      {cat.icon}
                    </div>
                    <div className="text-sm">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Section */}
            {trendingProducts.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      Trending Now 🔥
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentView("products")}
                    className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-bold"
                  >
                    View All <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-8 h-8 text-pink-500" />
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      Special Offers 🎉
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentView("products")}
                    className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-bold"
                  >
                    View All <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">All Products</h2>
              <span className="text-gray-600">
                {filteredProducts.length} products
              </span>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500 font-semibold">
                  No products found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={() => setCurrentView("home")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-3xl font-bold text-gray-800 capitalize">
                {selectedCategory} ({categoryProducts.length})
              </h2>
            </div>
            {categoryProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">
                  No products in this category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Gift className="w-10 h-10" />
            <h3 className="text-3xl font-bold">Happyoffers</h3>
          </div>
          <p className="text-lg mb-6">
            Making every moment special with perfect gifts
          </p>
          <p className="text-sm opacity-75">
            © 2026 Happyoffers. All rights reserved.
          </p>
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
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-pink-300 group cursor-pointer">
      <div
        onClick={onView}
        className="relative overflow-hidden h-64 bg-gray-100"
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
            <Gift className="w-20 h-20 text-pink-300" />
          </div>
        )}

        {product.trending && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>TRENDING</span>
          </div>
        )}

        {product.onSale && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-5">
        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full uppercase">
          {product.category}
        </span>

        <h3
          onClick={onView}
          className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 mt-2 hover:text-pink-600 transition"
        >
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.onSale ? (
              <>
                <span className="text-2xl font-bold text-pink-600">
                  ₹{discountedPrice.toFixed(0)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-800">
                ₹{product.price}
              </span>
            )}
          </div>

          <button
            onClick={onAdd}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
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
        className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-bold mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl p-8 shadow-2xl">
        {/* Image */}
        <div className="flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl"
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <Gift className="w-32 h-32 text-pink-300" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full uppercase">
                {product.category}
              </span>
              {product.trending && (
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  🔥 Trending
                </span>
              )}
              {product.onSale && (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h2>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-8">
              {product.onSale ? (
                <div className="flex items-center space-x-4">
                  <span className="text-5xl font-bold text-pink-600">
                    ₹{discountedPrice.toFixed(0)}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{product.price}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    Save ₹{(product.price - discountedPrice).toFixed(0)}!
                  </span>
                </div>
              ) : (
                <span className="text-5xl font-bold text-gray-800">
                  ₹{product.price}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onAddToCart}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center space-x-3"
          >
            <ShoppingCart className="w-6 h-6" />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Admin Panel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-96 overflow-y-auto">
          {/* Form */}
          <div className="space-y-4 mb-8">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Product Name"
              className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200"
            />

            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Price (₹)"
              className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200"
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200"
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
              className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200"
            />

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
              rows="3"
              className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200"
            />

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.trending}
                  onChange={(e) =>
                    setFormData({ ...formData, trending: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span>Trending</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.onSale}
                  onChange={(e) =>
                    setFormData({ ...formData, onSale: e.target.checked })
                  }
                  className="w-5 h-5"
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
                  className="w-20 px-3 py-2 border-2 border-pink-300 rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mb-8">
            {editingProduct ? (
              <>
                <button
                  onClick={onUpdateProduct}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl"
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
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={onAddProduct}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            )}
          </div>

          {/* Product List */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Products ({products.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border-2 border-gray-200"
                >
                  <div>
                    <p className="font-bold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">₹{product.price}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fadeIn max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="p-8 text-center flex-1 flex items-center justify-center">
            <div>
              <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-semibold">
                Your cart is empty
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-8 overflow-y-auto flex-1 space-y-4">
              {cart.map((item) => {
                const displayPrice = item.onSale
                  ? getDiscountedPrice(item.price, item.discount)
                  : item.price;
                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border-2 border-gray-200"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        ₹{displayPrice.toFixed(0)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border-2 border-pink-300 rounded-lg">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item._id, item.quantity - 1)
                        }
                        className="px-2 py-1 text-pink-600 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-2 py-1 text-pink-600 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with Total */}
            <div className="p-8 border-t-2 border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-gray-800">Total:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
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
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl"
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
