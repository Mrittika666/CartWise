
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    LogOut,
    RefreshCw,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    AlertTriangle,
} from "lucide-react";

const API = "http://localhost:5000/api";

function AdminPanel({ token, user, onLogout }) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState({});
    const [recentOrders, setRecentOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    const emptyProduct = {
        name: "",
        description: "",
        price: "",
        image_url: "",
        category: "",
        stock: "",
    };

    const [productForm, setProductForm] = useState(emptyProduct);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    const request = async (url, options = {}) => {
        const response = await fetch(`${API}${url}`, {
            ...options,
            headers: { ...headers, ...options.headers },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    };

    const notify = (text) => {
        setMessage(text);
        window.setTimeout(() => setMessage(""), 3000);
    };

    const loadDashboard = async () => {
        const [statsData, ordersData] = await Promise.all([
            request("/admin/dashboard/stats"),
            request("/admin/dashboard/recent-orders"),
        ]);

        setStats(statsData.stats || statsData);
        setRecentOrders(
            ordersData.orders || ordersData.recentOrders || []
        );
    };

    const loadProducts = async () => {
        const [productData, stockData] = await Promise.all([
            request("/products"),
            request("/products/admin/low-stock"),
        ]);

        setProducts(productData.products || []);
        setLowStock(stockData.products || stockData.lowStockProducts || []);
    };

    const loadOrders = async () => {
        const data = await request("/orders/admin/all");
        setOrders(data.orders || []);
    };

    const loadUsers = async () => {
        const data = await request("/admin/users");
        setUsers(data.users || []);
    };

    const loadData = async () => {
        setLoading(true);

        try {
            if (activeTab === "dashboard") await loadDashboard();
            if (activeTab === "products") await loadProducts();
            if (activeTab === "orders") await loadOrders();
            if (activeTab === "users") await loadUsers();
        } catch (error) {
            notify(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const openAddProduct = () => {
        setEditingProductId(null);
        setProductForm(emptyProduct);
        setShowProductForm(true);
    };

    const openEditProduct = (product) => {
        setEditingProductId(product.id);
        setProductForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            image_url: product.image_url || "",
            category: product.category || "",
            stock: product.stock ?? "",
        });
        setShowProductForm(true);
    };

    const saveProduct = async (event) => {
        event.preventDefault();

        try {
            const editing = editingProductId !== null;

            await request(
                editing
                    ? `/products/${editingProductId}`
                    : "/products",
                {
                    method: editing ? "PUT" : "POST",
                    body: JSON.stringify({
                        ...productForm,
                        price: Number(productForm.price),
                        stock: Number(productForm.stock),
                    }),
                }
            );

            setShowProductForm(false);
            setProductForm(emptyProduct);
            await loadProducts();
            notify(editing ? "Product updated!" : "Product added!");
        } catch (error) {
            notify(error.message);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await request(`/products/${id}`, { method: "DELETE" });
            await loadProducts();
            notify("Product deleted!");
        } catch (error) {
            notify(error.message);
        }
    };

    const updateOrder = async (id, status) => {
        try {
            await request(`/orders/admin/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status }),
            });

            await loadOrders();
            notify("Order status updated!");
        } catch (error) {
            notify(error.message);
        }
    };

    const updateUser = async (id, role) => {
        try {
            await request(`/admin/users/${id}/role`, {
                method: "PUT",
                body: JSON.stringify({ role }),
            });

            await loadUsers();
            notify("User role updated!");
        } catch (error) {
            notify(error.message);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;

        try {
            await request(`/admin/users/${id}`, {
                method: "DELETE",
            });

            await loadUsers();
            notify("User deleted!");
        } catch (error) {
            notify(error.message);
        }
    };

    const money = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "products", label: "Products", icon: Package },
        { id: "orders", label: "Orders", icon: ShoppingBag },
        { id: "users", label: "Users", icon: Users },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <span>CartWise</span>
                    <small>ADMIN PANEL</small>
                </div>

                <div className="admin-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                className={
                                    activeTab === item.id ? "active" : ""
                                }
                                onClick={() => setActiveTab(item.id)}
                            >
                                <Icon size={19} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <button className="admin-logout" onClick={onLogout}>
                    <LogOut size={19} />
                    Logout
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div>
                        <h2>
                            {navItems.find((item) => item.id === activeTab)?.label}
                        </h2>
                        <p>Manage your CartWise store</p>
                    </div>

                    <div className="admin-user">
                        <div>
                            <strong>{user?.name}</strong>
                            <small>Administrator</small>
                        </div>
                        <button onClick={loadData} title="Refresh">
                            <RefreshCw size={19} />
                        </button>
                    </div>
                </header>

                {message && (
                    <div className="admin-message">{message}</div>
                )}

                {loading ? (
                    <div className="admin-loading">Loading data...</div>
                ) : (
                    <>
                        {activeTab === "dashboard" && (
                            <section>
                                <div className="admin-stats-grid">
                                    {[
                                        {
                                            label: "Total Products",
                                            value: stats.totalProducts ?? 0,
                                            icon: Package,
                                        },
                                        {
                                            label: "Total Orders",
                                            value: stats.totalOrders ?? 0,
                                            icon: ShoppingBag,
                                        },
                                        {
                                            label: "Total Users",
                                            value: stats.totalUsers ?? 0,
                                            icon: Users,
                                        },
                                        {
                                            label: "Total Revenue",
                                            value: money(stats.totalRevenue),
                                            icon: LayoutDashboard,
                                        },
                                    ].map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <div className="admin-stat-card" key={item.label}>
                                                <div className="admin-stat-icon">
                                                    <Icon size={22} />
                                                </div>
                                                <p>{item.label}</p>
                                                <h3>{item.value}</h3>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="admin-section-card">
                                    <h3>Recent Orders</h3>

                                    {recentOrders.length === 0 ? (
                                        <p>No recent orders found.</p>
                                    ) : (
                                        <div className="admin-table-wrap">
                                            <table className="admin-table">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Customer</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentOrders.map((order) => (
                                                        <tr key={order.id}>
                                                            <td>#{order.id}</td>
                                                            <td>
                                                                {order.user_name || order.name || "Customer"}
                                                            </td>
                                                            <td>{money(order.total_amount)}</td>
                                                            <td>{order.status}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div className="admin-section-card">
                                    <h3>
                                        <AlertTriangle size={19} />
                                        Low Stock Products
                                    </h3>

                                    {lowStock.length === 0 ? (
                                        <p>No low-stock products.</p>
                                    ) : (
                                        lowStock.map((product) => (
                                            <div className="admin-stock-row" key={product.id}>
                                                <span>{product.name}</span>
                                                <strong>{product.stock} left</strong>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        )}

                        {activeTab === "products" && (
                            <section className="admin-section-card">
                                <div className="admin-section-heading">
                                    <h3>Product Management</h3>
                                    <button
                                        className="admin-primary-btn"
                                        onClick={openAddProduct}
                                    >
                                        <Plus size={18} /> Add Product
                                    </button>
                                </div>

                                {products.length === 0 ? (
                                    <p>No products found.</p>
                                ) : (
                                    <div className="admin-table-wrap">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Category</th>
                                                    <th>Price</th>
                                                    <th>Stock</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((product) => (
                                                    <tr key={product.id}>
                                                        <td>{product.name}</td>
                                                        <td>{product.category}</td>
                                                        <td>{money(product.price)}</td>
                                                        <td>{product.stock}</td>
                                                        <td>
                                                            <button
                                                                className="admin-icon-btn"
                                                                onClick={() => openEditProduct(product)}
                                                            >
                                                                <Pencil size={17} />
                                                            </button>
                                                            <button
                                                                className="admin-icon-btn danger"
                                                                onClick={() => deleteProduct(product.id)}
                                                            >
                                                                <Trash2 size={17} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <h3 className="admin-subheading">Low Stock</h3>
                                {lowStock.map((product) => (
                                    <div className="admin-stock-row" key={product.id}>
                                        <span>{product.name}</span>
                                        <strong>{product.stock} left</strong>
                                    </div>
                                ))}
                            </section>
                        )}

                        {activeTab === "orders" && (
                            <section className="admin-section-card">
                                <h3>Order Management</h3>

                                {orders.length === 0 ? (
                                    <p>No orders found.</p>
                                ) : (
                                    <div className="admin-table-wrap">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer ID</th>
                                                    <th>Amount</th>
                                                    <th>Shipping Address</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td>#{order.id}</td>
                                                        <td>{order.user_id}</td>
                                                        <td>{money(order.total_amount)}</td>
                                                        <td>{order.shipping_address}</td>
                                                        <td>
                                                            <select
                                                                value={order.status}
                                                                onChange={(event) =>
                                                                    updateOrder(order.id, event.target.value)
                                                                }
                                                            >
                                                                {[
                                                                    "Pending",
                                                                    "Processing",
                                                                    "Shipped",
                                                                    "Delivered",
                                                                    "Cancelled",
                                                                ].map((status) => (
                                                                    <option key={status} value={status}>
                                                                        {status}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        )}

                        {activeTab === "users" && (
                            <section className="admin-section-card">
                                <h3>User Management</h3>

                                {users.length === 0 ? (
                                    <p>No users found.</p>
                                ) : (
                                    <div className="admin-table-wrap">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.name}</td>
                                                        <td>{item.email}</td>
                                                        <td>
                                                            <select
                                                                value={item.role}
                                                                disabled={item.id === user?.id}
                                                                onChange={(event) =>
                                                                    updateUser(item.id, event.target.value)
                                                                }
                                                            >
                                                                <option value="user">Customer</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="admin-icon-btn danger"
                                                                disabled={item.id === user?.id}
                                                                onClick={() => deleteUser(item.id)}
                                                            >
                                                                <Trash2 size={17} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>

            {showProductForm && (
                <div className="admin-modal-overlay">
                    <form className="admin-product-form" onSubmit={saveProduct}>
                        <div className="admin-section-heading">
                            <h3>
                                {editingProductId ? "Edit Product" : "Add Product"}
                            </h3>
                            <button
                                type="button"
                                className="admin-icon-btn"
                                onClick={() => setShowProductForm(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {[
                            ["name", "Product Name", "text"],
                            ["description", "Description", "text"],
                            ["price", "Price", "number"],
                            ["image_url", "Image URL", "text"],
                            ["category", "Category", "text"],
                            ["stock", "Stock Quantity", "number"],
                        ].map(([field, label, type]) => (
                            <label key={field}>
                                {label}
                                <input
                                    type={type}
                                    required={field !== "description" && field !== "image_url"}
                                    min={type === "number" ? "0" : undefined}
                                    step={field === "price" ? "0.01" : undefined}
                                    value={productForm[field]}
                                    onChange={(event) =>
                                        setProductForm({
                                            ...productForm,
                                            [field]: event.target.value,
                                        })
                                    }
                                />
                            </label>
                        ))}

                        <button type="submit" className="admin-primary-btn">
                            <Save size={18} /> Save Product
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
