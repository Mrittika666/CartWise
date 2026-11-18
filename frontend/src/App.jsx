
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import AdminPanel from "./AdminPanel";

import {
  ShoppingCart,
  Heart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Settings,
} from "lucide-react";

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [showLogin, setShowLogin] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [orderTracking, setOrderTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [accountTab, setAccountTab] = useState("profile");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormTitle, setAddressFormTitle] = useState("Add Delivery Address");

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  // Fetch Cart, Wishlist and Addresses
  const fetchUserData = async () => {
    if (!token) {
      setCart([]);
      setWishlist([]);
      setAddresses([]);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCart(data.cart);
      }

      const wishlistResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const wishlistData = await wishlistResponse.json();

      if (wishlistResponse.ok && wishlistData.success) {
        setWishlist(
          wishlistData.wishlist.map((item) => item.product_id)
        );
      }

      const addressResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const addressData = await addressResponse.json();

      if (addressResponse.ok && addressData.success) {
        setAddresses(addressData.addresses);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setProducts(data.products);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Product fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Search Products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate Cart Total
  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.subtotal),
    0
  );

  // Add to Cart
  const addToCart = async (product) => {
    if (!token) {
      alert("Please login first to add products to cart.");
      setShowLogin(true);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add product");
      }

      await fetchUserData();
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.message);
    }
  };

  // Toggle Wishlist
  const toggleWishlist = async (id) => {
    if (!token) {
      alert("Please login first to use your wishlist.");
      setShowLogin(true);
      return;
    }

    const isWishlisted = wishlist.includes(id);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/wishlist${isWishlisted ? `/${id}` : ""
        }`,
        {
          method: isWishlisted ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          ...(isWishlisted
            ? {}
            : {
              body: JSON.stringify({ productId: id }),
            }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Wishlist update failed");
      }

      await fetchUserData();
    } catch (error) {
      console.error("Wishlist error:", error);
      alert(error.message);
    }
  };

  // Remove from Cart
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to remove product");
      }

      await fetchUserData();
    } catch (error) {
      console.error("Remove cart error:", error);
      alert(error.message);
    }
  };

  // Add New Address
  const addAddress = async (e) => {
    e.preventDefault();

    if (!token) {
      setShowLogin(true);
      return;
    }

    const isEditing = editingAddressId !== null;

    try {
      const response = await fetch(
        isEditing
          ? `${import.meta.env.VITE_API_URL}/api/addresses/${editingAddressId}`
          : `${import.meta.env.VITE_API_URL}/api/addresses`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressForm),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save address");
      }

      await fetchUserData();

      setAddressForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });

      setEditingAddressId(null);
      setAddressFormTitle("Add Delivery Address");
      setShowAddressForm(false);

      alert(
        isEditing
          ? "Address updated successfully!"
          : "Address added successfully!"
      );
    } catch (error) {
      console.error("Save address error:", error);
      alert(error.message);
    }
  };

  // Delete Address
  const deleteAddress = async (addressId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete address");
      }

      await fetchUserData();

      alert("Address deleted successfully!");
    } catch (error) {
      console.error("Delete address error:", error);
      alert(error.message);
    }
  };

  // Open Address Form for Editing
  const startEditAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressFormTitle("Edit Delivery Address");

    setAddressForm({
      fullName: address.full_name,
      phone: address.phone,
      addressLine1: address.address_line1,
      addressLine2: address.address_line2 || "",
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      postalCode: address.postal_code,
      country: address.country || "India",
      isDefault: address.is_default,
    });

    setShowAddressForm(true);
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);

    const selectedAddress = addresses.find(
      (address) => address.id === Number(addressId)
    );

    if (selectedAddress) {
      const fullAddress = [
        selectedAddress.full_name,
        selectedAddress.phone,
        selectedAddress.address_line1,
        selectedAddress.address_line2,
        selectedAddress.landmark,
        selectedAddress.city,
        selectedAddress.state,
        selectedAddress.postal_code,
        selectedAddress.country,
      ]
        .filter(Boolean)
        .join(", ");

      setShippingAddress(fullAddress);
    } else {
      setShippingAddress("");
    }
  };

  // Place Order
  const placeOrder = async () => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Please enter your shipping address.");
      return;
    }

    try {
      setOrderLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddress: shippingAddress.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Order placement failed");
      }

      setOrderSuccess(data.order);
      setShippingAddress("");

      await fetchUserData();
    } catch (error) {
      console.error("Place order error:", error);
      alert(error.message);
    } finally {
      setOrderLoading(false);
    }
  };

  // Fetch My Orders
  const fetchMyOrders = async () => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      setOrdersLoading(true);
      setShowMyOrders(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setMyOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
      alert(error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Order Tracking
  const fetchOrderTracking = async (orderId) => {
    try {
      setTrackingLoading(true);
      setOrderTracking(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/tracking`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch tracking");
      }

      setOrderTracking(data);
    } catch (error) {
      console.error("Order tracking error:", error);
      alert(error.message);
    } finally {
      setTrackingLoading(false);
    }
  };

  // Login Page
  if (showLogin) {
    return (
      <Login
        onLogin={(loggedInUser, loginToken) => {
          setUser(loggedInUser);
          setToken(loginToken);
          setShowLogin(false);
        }}
      />
    );
  }
  if (user?.role === "admin") {
    return (
      <AdminPanel
        token={token}
        user={user}
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
          setCart([]);
          setWishlist([]);
          setAddresses([]);
        }}
      />
    );
  }

  return (
    <div className="app">
      {showProfile && (
        <div className="profile-section" id="profile-section">
          <div className="profile-header">
            <h2>My Account</h2>
            <button onClick={() => setShowProfile(false)}>
              ✕ Close
            </button>
          </div>

          <div className="profile-card">
            {accountTab === "profile" && (
              <>
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
              </>
            )}
          </div>

          <div className="profile-card">
            <h3>Your Addresses</h3>

            <button onClick={() => setShowAddressForm(true)}>
              + Add New Address
            </button>

            {showAddressForm && (
              <form className="address-form" onSubmit={addAddress}>
                <h3>{addressFormTitle}</h3>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={addressForm.addressLine1}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, addressLine1: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={addressForm.addressLine2}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, addressLine2: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={addressForm.landmark}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, landmark: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Postal Code"
                  value={addressForm.postalCode}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, postalCode: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, country: e.target.value })
                  }
                  required
                />

                <label>
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        isDefault: e.target.checked,
                      })
                    }
                  />
                  Set as default address
                </label>

                <button type="submit">Save Address</button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddressId(null);
                    setAddressFormTitle("Add Delivery Address");

                    setAddressForm({
                      fullName: "",
                      phone: "",
                      addressLine1: "",
                      addressLine2: "",
                      landmark: "",
                      city: "",
                      state: "",
                      postalCode: "",
                      country: "India",
                      isDefault: false,
                    });
                  }}
                >
                  Cancel
                </button>
              </form>
            )}

            {addresses.length === 0 ? (
              <p>No saved addresses yet.</p>
            ) : (
                addresses.map((address) => (
                  <div className="saved-address-card" key={address.id}>
                    {address.is_default && (
                      <span className="default-address-label">
                        DEFAULT ADDRESS
                      </span>
                    )}

                    <h4>{address.full_name}</h4>

                    <p>{address.phone}</p>

                    <p>{address.address_line1}</p>

                    {address.address_line2 && <p>{address.address_line2}</p>}

                    {address.landmark && <p>Landmark: {address.landmark}</p>}

                    <p>
                      {address.city}, {address.state} - {address.postal_code}
                    </p>

                    <p>{address.country}</p>
                    <button
                      className="edit-address-button"
                      onClick={() => startEditAddress(address)}
                    >
                      Edit Address
                    </button>
                  </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Top Bar */}
      <div className="top-bar">
        Free delivery on orders above ₹999 | Shop smarter with CartWise!
      </div>

      {/* Navbar */}
      <header className="navbar">
        <a href="#" className="logo">
          Cart<span>Wise.</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#products">Products</a>
          <a href="#ai-assistant">AI Assistant</a>
        </nav>

        <div className="nav-actions">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <button
            className="nav-icon"
            aria-label="Wishlist"
            onClick={() => {
              if (!user) {
                setShowLogin(true);
              } else {
                document.getElementById("wishlist-section")?.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
          >
            <Heart size={18} />
            {wishlist.length}
          </button>

          {user ? (
            <>
              <button
                className="nav-icon"
                onClick={() => {
                  setShowProfile(true);
                  setAccountTab("profile");
                }}
              >
                Profile
              </button>
              <button
                className="nav-icon"
                onClick={() => {
                  setShowProfile(false);
                  fetchMyOrders();
                }}
              >
                My Orders
              </button>
              <button
                className="nav-icon settings-button"
                aria-label="Account Settings"
                title="Account Settings"
                onClick={() => {
                  setShowProfile(true);
                  setAccountTab("settings");
                  setTimeout(() => {
                    document.getElementById("profile-section")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }}
              >
                <Settings size={20} />
              </button>

              <button
                className="nav-icon"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");

                  setUser(null);
                  setToken(null);
                  setCart([]);
                  setWishlist([]);
                  setAddresses([]);
                  setShowProfile(false);
                  setShowLogin(false);

                  window.location.hash = "home";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="nav-icon"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}

          <button
            className="cart-button"
            onClick={() => {
              if (!user) {
                alert("Please login to view your cart.");
                setShowLogin(true);
              } else {
                document.getElementById("cart-section")?.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
          >
            <ShoppingCart size={18} />
            Cart ({cart.length})
          </button>
        </div>
      </header>

      <main>
        {/* My Orders Section */}
        {showMyOrders && (
          <section className="my-orders-section">
            <div className="section-heading">
              <div>
                <span className="section-label">YOUR PURCHASES</span>
                <h2>My Orders</h2>
              </div>

              <button
                className="secondary-button"
                onClick={() => setShowMyOrders(false)}
              >
                Close
              </button>
            </div>

            {ordersLoading ? (
              <p>Loading your orders...</p>
            ) : myOrders.length === 0 ? (
              <p>You haven't placed any orders yet.</p>
            ) : (
              <div className="my-orders-list">
                {myOrders.map((order) => (
                  <div className="my-order-card" key={order.id}>
                    <h3>Order #{order.id}</h3>

                    <p>
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </p>

                    <p>
                      Total: ₹{Number(order.total_amount).toFixed(2)}
                    </p>

                    <p>
                      Status: <strong>{order.status}</strong>
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => fetchOrderTracking(order.id)}
                    >
                      Track Order
                    </button>

                    <p>
                      Shipping Address: {order.shipping_address}
                    </p>
                  </div>
                ))}
                  </div>
                  
            )}

            {trackingLoading && (
              <p>Loading tracking details...</p>
            )}

            {orderTracking && (
              <div className="order-tracking-card">
                <h3>Order Tracking #{orderTracking.orderId}</h3>

                <p>
                  Current Status: <strong>{orderTracking.currentStatus}</strong>
                </p>

                <h4>Order Status History</h4>

                {orderTracking.history?.length > 0 ? (
                  orderTracking.history.map((item, index) => (
                    <div className="tracking-history-item" key={index}>
                      <strong>{item.status}</strong>
                      <p>
                        {new Date(item.changed_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No tracking history available.</p>
                )}
              </div>
            )}
          </section>
        )}
        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-content">
            <span className="hero-label">
              SMARTER SHOPPING STARTS HERE
            </span>

            <h1>
              Shop Smart.
              <br />
              Live <span>Better.</span>
            </h1>

            <p>
              Discover amazing products, compare prices and get
              personalized recommendations powered by AI.
            </p>

            <div className="hero-buttons">
              <a href="#products" className="primary-button">
                Explore Products →
              </a>

              <a href="#ai-assistant" className="secondary-button">
                ✨ Meet Your AI Assistant
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>100%</strong>
                <small>Smart Shopping</small>
              </div>

              <div>
                <strong>AI</strong>
                <small>Powered Assistant</small>
              </div>

              <div>
                <strong>24/7</strong>
                <small>Shopping Access</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle">
              <span className="hero-emoji">🛍️</span>
            </div>

            <div className="floating-card card-one">
              <span>✨</span>
              <div>
                <strong>Smart Choice</strong>
                <small>AI recommended</small>
              </div>
            </div>

            <div className="floating-card card-two">
              <span>🔥</span>
              <div>
                <strong>Best Deals</strong>
                <small>Save more today</small>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="benefits">
          <div>
            <span>🚚</span>
            <div>
              <strong>Fast Delivery</strong>
              <small>Quick doorstep delivery</small>
            </div>
          </div>

          <div>
            <span>🔒</span>
            <div>
              <strong>Secure Shopping</strong>
              <small>Your data is protected</small>
            </div>
          </div>

          <div>
            <span>🤖</span>
            <div>
              <strong>AI Recommendations</strong>
              <small>Find what you love</small>
            </div>
          </div>

          <div>
            <span>💬</span>
            <div>
              <strong>Customer Support</strong>
              <small>We're here to help</small>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE COLLECTIONS</span>
              <h2>Shop by Category</h2>
            </div>

            <p>Find everything you need, all in one place.</p>
          </div>

          <div className="category-grid">
            <a href="#products" className="category-card">
              <span>🎧</span>
              <h3>Electronics</h3>
              <small>Explore gadgets →</small>
            </a>

            <a href="#products" className="category-card">
              <span>👗</span>
              <h3>Fashion</h3>
              <small>Discover styles →</small>
            </a>

            <a href="#products" className="category-card">
              <span>🏠</span>
              <h3>Home & Living</h3>
              <small>Upgrade your space →</small>
            </a>

            <a href="#products" className="category-card">
              <span>💄</span>
              <h3>Beauty</h3>
              <small>Explore beauty →</small>
            </a>
          </div>
        </section>

        {/* Products */}
        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <span className="section-label">HANDPICKED FOR YOU</span>
              <h2>Featured Products</h2>
            </div>

            <span className="product-count">
              {filteredProducts.length} Products
            </span>
          </div>

          {loading ? (
            <p className="empty-message">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="empty-message">No products found.</p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <span className="product-tag">
                      {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                    </span>

                    <button
                      className="wishlist-button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Add to wishlist"
                    >
                      {wishlist.includes(product.id) ? "♥" : "♡"}
                    </button>

                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-photo"
                      />
                    ) : (
                      <span className="product-emoji">🛍️</span>
                    )}
                  </div>

                  <div className="product-info">
                    <small>{product.category}</small>
                    <h3>{product.name}</h3>

                    <div className="price-row">
                      <strong>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <button
                      className="add-cart-button"
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product)}
                    >
                      {product.stock > 0 ? "+ Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Wishlist Section */}
        <section className="wishlist-section" id="wishlist-section">
          <div className="section-heading">
            <div>
              <span className="section-label">YOUR SAVED COLLECTION</span>
              <h2>My Wishlist</h2>
              <p>Your favourite products, saved for later.</p>
            </div>

            <span className="product-count">
              {wishlist.length} Items
            </span>
          </div>

          {wishlist.length === 0 ? (
            <div className="wishlist-empty">
              <Heart size={48} strokeWidth={1.5} />
              <h3>Your Wishlist is Empty</h3>
              <p>Save products you love by clicking the heart icon.</p>
              <a href="#products">Explore Products →</a>
            </div>
          ) : (
            <div className="product-grid">
              {products
                .filter((product) => wishlist.includes(product.id))
                .map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image">
                      <span className="product-tag">
                        {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                      </span>

                      <button
                        className="wishlist-button"
                        aria-label="Remove from wishlist"
                        onClick={() => toggleWishlist(product.id)}
                      >
                        ♥
                      </button>

                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="product-photo"
                        />
                      ) : (
                        <span className="product-emoji">🛍️</span>
                      )}
                    </div>

                    <div className="product-info">
                      <small>{product.category}</small>
                      <h3>{product.name}</h3>

                      <div className="price-row">
                        <strong>
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <button
                        className="add-cart-button"
                        disabled={product.stock <= 0}
                        onClick={() => addToCart(product)}
                      >
                        {product.stock > 0 ? "+ Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </section>

        {/* Shopping Cart */}
        <section className="cart-section" id="cart-section">
          <div className="cart-page-heading">
            <div>
              <span className="section-label">YOUR SHOPPING BAG</span>
              <h2>Shopping Cart</h2>
              <p>Review your selected products before checkout.</p>
            </div>

            <span className="product-count">{cart.length} Items</span>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart size={52} strokeWidth={1.5} />
              <h3>Your Cart is Empty</h3>
              <p>Discover products and add your favourites!</p>
              <a href="#products">
                Continue Shopping <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Cart Items */}
              <div className="cart-main">
                <div className="cart-list-heading">
                  <h3>Shopping Cart ({cart.length} items)</h3>
                  <span>Price</span>
                </div>

                {cart.map((item) => (
                  <div className="cart-item" key={item.product_id}>
                    <div className="cart-item-image">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} />
                      ) : (
                        <ShoppingBag size={42} />
                      )}
                    </div>

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p className="stock-label">In Stock</p>

                      <p className="cart-item-price">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>

                      <p>Quantity: {item.quantity}</p>

                      <strong className="cart-subtotal">
                        Subtotal: ₹
                        {Number(item.subtotal).toLocaleString("en-IN")}
                      </strong>

                      <button
                        className="remove-cart-button"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="checkout-form">
                <h3>Delivery Address</h3>
                <p>Where should we deliver your order?</p>

                  <select
                    value={selectedAddressId}
                    onChange={(e) => handleAddressSelect(e.target.value)}
                  >
                    <option value="">Select a saved address</option>

                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.full_name} - {address.city}, {address.state}
                        {address.is_default ? " (Default)" : ""}
                      </option>
                    ))}
                  </select>

                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your full shipping address..."
                    rows={4}
                  />
              </div>

              {/* Order Summary */}
              <aside className="cart-summary">
                <h3>Order Summary</h3>

                <div className="summary-row">
                  <span>Items ({cart.length})</span>
                  <strong>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>
                  <strong className="free-delivery">FREE</strong>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Order Total</span>
                  <strong>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <button
                  className="checkout-button"
                  onClick={placeOrder}
                  disabled={orderLoading || cart.length === 0}
                >
                  {orderLoading ? "Placing Order..." : "Place Order"}
                  <ArrowRight size={17} />
                </button>

                <p className="secure-checkout">
                  <ShieldCheck size={16} />
                  Secure checkout
                </p>
              </aside>
            </div>
          )}
        </section>

        {/* AI Assistant */}
        <section className="ai-section" id="ai-assistant">
          <div className="ai-icon">🤖</div>

          <div className="ai-content">
            <span className="section-label">
              YOUR PERSONAL SHOPPING EXPERT
            </span>

            <h2>Meet Your AI Shopping Assistant</h2>

            <p>
              Confused about what to buy? Let AI understand your needs,
              compare products and find the perfect match for your budget.
            </p>

            <button
              className="ai-button"
              onClick={() =>
                alert("Gemini AI Assistant will be connected soon!")
              }
            >
              ✨ Explore AI Assistant
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <a href="#" className="logo">
          Cart<span>Wise.</span>
        </a>

        <p>Smart choices. Better shopping. Powered by AI.</p>
        <small>© 2026 CartWise. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default App;
