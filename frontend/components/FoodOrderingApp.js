"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

const DELIVERY_FEE = 15;
const categoryAr = {
  Starters: "المقبلات",
  "Main Course": "الأطباق الرئيسية",
  Grills: "المشويات",
  Pasta: "الباستا",
  Desserts: "الحلويات",
  Beverages: "المشروبات",
};

const copy = {
  en: {
    restaurant: "Foody",
    menu: "Menu",
    track: "Track order",
    admin: "Admin",
    login: "Login",
    logout: "Sign out",
    heroTitle: (
      <>
        Authentic flavors <em>delivered</em> to you.
      </>
    ),
    heroText:
      "Fresh Egyptian favourites, prepared with care and delivered fast.",
    orderNow: "Order now",
    trackOrder: "Track order",
    menuTitle: "Our menu",
    menuText: "Freshly prepared with premium ingredients.",
    all: "All",
    search: "Search dishes...",
    add: "Add",
    cart: "Cart",
    yourOrder: "Your order",
    emptyCart: "Your cart is empty.",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    checkout: "Checkout",
    checkoutTitle: "Complete your order",
    address: "Delivery address",
    addressHint: "123 Street, Cairo",
    notes: "Special instructions",
    notesHint: "No onions, extra sauce…",
    payment: "Payment method",
    cash: "Cash on delivery",
    cashText: "Pay once your order arrives.",
    online: "Online payment",
    onlineText: "Mock secure payment for this prototype.",
    placeOrder: "Place order",
    cancel: "Cancel",
    loginTitle: "Welcome back",
    registerTitle: "Create your account",
    register: "Register",
    name: "Full name",
    email: "Email",
    password: "Password",
    phone: "Phone",
    demo: "Demo accounts: admin@foody.com / admin123 · user@foody.com / user123",
    orderPlaced: "Order placed!",
    orderPlacedText: "We have received your order and started preparing it.",
    yourOrderId: "Your order ID",
    trackMyOrder: "Track my order",
    trackTitle: "Track your order",
    trackText: "Enter your order number to see its live status.",
    trackPlaceholder: "Example: ORD-1001",
    notFound: "Order not found.",
    myOrders: "Your orders",
    status: {
      confirmed: "Confirmed",
      preparing: "Preparing",
      on_the_way: "On the way",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    dashboard: "Admin dashboard",
    overview: "Overview",
    orders: "Orders",
    products: "Products",
    revenue: "Revenue",
    totalOrders: "Total orders",
    activeOrders: "Active orders",
    menuItems: "Menu items",
    recentOrders: "Recent orders",
    manageProducts: "Manage products",
    addProduct: "Add product",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    statusLabel: "Status",
    customer: "Customer",
    items: "Items",
    amount: "Amount",
    paymentLabel: "Payment",
    productName: "Product name (English)",
    productNameAr: "Product name (Arabic)",
    productDesc: "Description (English)",
    productDescAr: "Description (Arabic)",
    price: "Price (EGP)",
    category: "Category",
    image: "Image URL",
    badge: "Badge (optional)",
    available: "Available",
    close: "Close",
    loading: "Loading…",
    requiredLogin: "Please log in before checking out.",
    saved: "Saved successfully.",
    deleted: "Product deleted.",
    onlineDemo: "Online payment is simulated. No card data is collected.",
  },
  ar: {
    restaurant: "فودي",
    menu: "القائمة",
    track: "تتبع الطلب",
    admin: "الإدارة",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    heroTitle: (
      <>
        نكهات أصيلة <em>تصل</em> إليك.
      </>
    ),
    heroText: "أطباق مصرية طازجة تُحضّر بعناية وتصل سريعاً.",
    orderNow: "اطلب الآن",
    trackOrder: "تتبع الطلب",
    menuTitle: "قائمة الطعام",
    menuText: "يُحضّر طازجاً بأفضل المكونات.",
    all: "الكل",
    search: "ابحث عن الأطباق...",
    add: "أضف",
    cart: "السلة",
    yourOrder: "طلبك",
    emptyCart: "سلتك فارغة.",
    subtotal: "المجموع الفرعي",
    delivery: "التوصيل",
    total: "الإجمالي",
    checkout: "إتمام الطلب",
    checkoutTitle: "إتمام طلبك",
    address: "عنوان التوصيل",
    addressHint: "123 شارع، القاهرة",
    notes: "تعليمات خاصة",
    notesHint: "بدون بصل، صلصة إضافية…",
    payment: "طريقة الدفع",
    cash: "الدفع عند الاستلام",
    cashText: "ادفع عند وصول طلبك.",
    online: "الدفع الإلكتروني",
    onlineText: "دفع آمن تجريبي لهذا النموذج.",
    placeOrder: "تأكيد الطلب",
    cancel: "إلغاء",
    loginTitle: "مرحباً بعودتك",
    registerTitle: "إنشاء حساب جديد",
    register: "إنشاء حساب",
    name: "الاسم بالكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    phone: "رقم الهاتف",
    demo: "حسابات تجريبية: admin@foody.com / admin123 · user@foody.com / user123",
    orderPlaced: "تم تقديم الطلب!",
    orderPlacedText: "استلمنا طلبك وبدأنا في تحضيره.",
    yourOrderId: "رقم طلبك",
    trackMyOrder: "تتبع طلبي",
    trackTitle: "تتبع طلبك",
    trackText: "أدخل رقم الطلب لمعرفة حالته الحالية.",
    trackPlaceholder: "مثال: ORD-1001",
    notFound: "الطلب غير موجود.",
    myOrders: "طلباتك",
    status: {
      confirmed: "تم التأكيد",
      preparing: "قيد التحضير",
      on_the_way: "في الطريق",
      delivered: "تم التوصيل",
      cancelled: "ملغي",
    },
    dashboard: "لوحة الإدارة",
    overview: "نظرة عامة",
    orders: "الطلبات",
    products: "المنتجات",
    revenue: "الإيرادات",
    totalOrders: "إجمالي الطلبات",
    activeOrders: "الطلبات النشطة",
    menuItems: "عناصر القائمة",
    recentOrders: "الطلبات الأخيرة",
    manageProducts: "إدارة المنتجات",
    addProduct: "إضافة منتج",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    statusLabel: "الحالة",
    customer: "العميل",
    items: "المنتجات",
    amount: "الإجمالي",
    paymentLabel: "الدفع",
    productName: "اسم المنتج بالإنجليزية",
    productNameAr: "اسم المنتج بالعربية",
    productDesc: "الوصف بالإنجليزية",
    productDescAr: "الوصف بالعربية",
    price: "السعر (جنيه)",
    category: "الفئة",
    image: "رابط الصورة",
    badge: "شارة اختيارية",
    available: "متاح",
    close: "إغلاق",
    loading: "جارٍ التحميل…",
    requiredLogin: "يرجى تسجيل الدخول قبل إتمام الطلب.",
    saved: "تم الحفظ بنجاح.",
    deleted: "تم حذف المنتج.",
    onlineDemo: "الدفع الإلكتروني تجريبي ولا يتم جمع بيانات البطاقات.",
  },
};

const statusFlow = ["confirmed", "preparing", "on_the_way", "delivered"];
const emptyProduct = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  price: "",
  category: "Main Course",
  image: "",
  badge: "",
  active: true,
};

function money(value) {
  return new Intl.NumberFormat("en-EG").format(value || 0) + " EGP";
}
function dateTime(value, locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Modal({ open, title, children, onClose, wide = false }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default function FoodOrderingApp() {
  const [language, setLanguage] = useState("en");
  const [page, setPage] = useState("menu");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkout, setCheckout] = useState({
    address: "",
    notes: "",
    paymentMethod: "cod",
  });
  const [successOrder, setSuccessOrder] = useState(null);
  const [trackInput, setTrackInput] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [adminTab, setAdminTab] = useState("overview");
  const [adminDashboard, setAdminDashboard] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [productModal, setProductModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = copy[language];
  const isAdmin = user?.role === "admin";
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const total = subtotal + (cart.length ? DELIVERY_FEE : 0);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };
  const authHeaders = { token };

  async function refreshMenu() {
    const [menuData, categoryData] = await Promise.all([
      api("/menu"),
      api("/menu/categories"),
    ]);
    setProducts(menuData.products);
    setCategories(categoryData.categories);
  }

  useEffect(() => {
    const stored = localStorage.getItem("foody-session");
    const storedCart = localStorage.getItem("foody-cart");
    const storedLanguage = localStorage.getItem("foody-language");
    if (storedLanguage === "ar" || storedLanguage === "en")
      setLanguage(storedLanguage);
    if (storedCart) setCart(JSON.parse(storedCart));
    if (stored) {
      const session = JSON.parse(stored);
      setToken(session.token);
      setUser(session.user);
    }
    refreshMenu()
      .catch((error) => notify(error.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("foody-language", language);
  }, [language]);
  useEffect(() => {
    localStorage.setItem("foody-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("foody-session", JSON.stringify({ token, user }));
    }
  }, [token, user]);
  useEffect(() => {
    if (page === "admin" && isAdmin) loadAdmin();
    if (page === "track" && token) loadMyOrders();
  }, [page, token, isAdmin]);

  const filteredProducts = products.filter((item) => {
    const text =
      `${item.name} ${item.nameAr} ${item.description} ${item.descriptionAr}`.toLowerCase();
    return (
      (!selectedCategory || item.category === selectedCategory) &&
      (!search || text.includes(search.toLowerCase()))
    );
  });

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      return existing
        ? current.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [
            ...current,
            {
              productId: product.id,
              name: product.name,
              nameAr: product.nameAr,
              price: product.price,
              image: product.image,
              quantity: 1,
            },
          ];
    });
    notify(
      language === "ar" ? "تمت إضافة المنتج إلى السلة." : "Added to cart.",
    );
  };
  const changeQuantity = (productId, change) =>
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );

  function openCheckout() {
    if (!user) {
      setAuthOpen(true);
      notify(t.requiredLogin, "error");
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  async function submitAuth(event) {
    event.preventDefault();
    try {
      const path = authMode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;
      const data = await api(path, { method: "POST", body: payload });
      setToken(data.token);
      setUser(data.user);
      setAuthOpen(false);
      setAuthForm({ name: "", email: "", password: "", phone: "" });
      notify(
        language === "ar"
          ? "تم تسجيل الدخول بنجاح."
          : "Signed in successfully.",
      );
    } catch (error) {
      notify(error.message, "error");
    }
  }

  function signOut() {
    localStorage.removeItem("foody-session");
    localStorage.removeItem("mock-user");

    setToken("");
    setUser(null);
    setPage("menu");

    notify(language === "ar" ? "تم تسجيل الخروج." : "Signed out.");
  }
  async function placeOrder(event) {
    event.preventDefault();
    try {
      const data = await api("/orders", {
        method: "POST",
        token,
        body: {
          items: cart.map(({ productId, quantity }) => ({
            productId,
            quantity,
          })),
          ...checkout,
        },
      });
      setSuccessOrder(data.order);
      setCart([]);
      setCheckoutOpen(false);
      setCheckout({ address: "", notes: "", paymentMethod: "cod" });
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function trackOrder(id = trackInput) {
    try {
      const data = await api(`/orders/${encodeURIComponent(id.trim())}`);
      setTrackedOrder(data.order);
    } catch (error) {
      setTrackedOrder(null);
      notify(error.message || t.notFound, "error");
    }
  }
  async function loadMyOrders() {
    try {
      const data = await api("/orders/me", authHeaders);
      setMyOrders(data.orders);
    } catch {
      setMyOrders([]);
    }
  }
  async function loadAdmin() {
    try {
      const [dashboardData, ordersData, menuData] = await Promise.all([
        api("/admin/dashboard", authHeaders),
        api("/admin/orders", authHeaders),
        api("/menu?includeInactive=true", authHeaders),
      ]);
      setAdminDashboard(dashboardData);
      setAdminOrders(ordersData.orders);
      setProducts(menuData.products);
    } catch (error) {
      notify(error.message, "error");
    }
  }
  async function updateOrderStatus(orderId, status) {
    try {
      await api(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: { status },
        ...authHeaders,
      });
      await loadAdmin();
      notify(t.saved);
    } catch (error) {
      notify(error.message, "error");
    }
  }
  async function saveProduct(event) {
    event.preventDefault();
    try {
      const payload = {
        ...productModal.product,
        price: Number(productModal.product.price),
      };
      const endpoint = productModal.isEdit
        ? `/menu/${productModal.product.id}`
        : "/menu";
      await api(endpoint, {
        method: productModal.isEdit ? "PATCH" : "POST",
        body: payload,
        ...authHeaders,
      });
      setProductModal(null);
      await refreshMenu();
      await loadAdmin();
      notify(t.saved);
    } catch (error) {
      notify(error.message, "error");
    }
  }
  async function removeProduct(id) {
    if (
      !window.confirm(
        language === "ar" ? "هل تريد حذف المنتج؟" : "Delete this product?",
      )
    )
      return;
    try {
      await api(`/menu/${id}`, { method: "DELETE", ...authHeaders });
      await refreshMenu();
      await loadAdmin();
      notify(t.deleted);
    } catch (error) {
      notify(error.message, "error");
    }
  }

  const productName = (product) =>
    language === "ar" ? product.nameAr : product.name;
  const productDescription = (product) =>
    language === "ar" ? product.descriptionAr : product.description;
  const orderItems = (order) =>
    order.items
      .map(
        (item) =>
          `${language === "ar" ? item.nameAr : item.name} ×${item.quantity}`,
      )
      .join(" · ");

  return (
    <main>
      <nav className="nav">
        <button className="brand" onClick={() => setPage("menu")}>
          <span>🍽</span>
          {t.restaurant}
        </button>
        <div className="nav-links">
          <button
            className={page === "menu" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("menu")}
          >
            {t.menu}
          </button>
          <button
            className={page === "track" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("track")}
          >
            {t.track}
          </button>
          {isAdmin && (
            <button
              className={page === "admin" ? "nav-link active" : "nav-link"}
              onClick={() => setPage("admin")}
            >
              {t.admin}
            </button>
          )}
        </div>
        <div className="nav-actions">
          <button
            className="language"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          >
            {language === "en" ? "عربي" : "EN"}
          </button>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            🛒 <span>{t.cart}</span>
            <b>{cart.reduce((sum, item) => sum + item.quantity, 0)}</b>
          </button>
          {user ? (
            <button className="outline-button" onClick={signOut}>
              {t.logout}
            </button>
          ) : (
            <button
              className="primary-button"
              onClick={() => {
                setAuthMode("login");
                setAuthOpen(true);
              }}
            >
              {t.login}
            </button>
          )}
        </div>
      </nav>

      {page === "menu" && (
        <>
          <section className="hero">
            <div>
              <p className="eyebrow">FOODY RESTAURANT</p>
              <h1>{t.heroTitle}</h1>
              <p>{t.heroText}</p>
              <div className="hero-actions">
                <button
                  className="primary-button big"
                  onClick={() =>
                    document
                      .getElementById("menu-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {t.orderNow}
                </button>
                <button
                  className="ghost-button big"
                  onClick={() => setPage("track")}
                >
                  {t.trackOrder}
                </button>
              </div>
            </div>
          </section>
          <section id="menu-section" className="content-section">
            <header className="section-head">
              <div>
                <p className="eyebrow">FRESH TODAY</p>
                <h2>{t.menuTitle}</h2>
                <p>{t.menuText}</p>
              </div>
            </header>
            <input
              className="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`⌕  ${t.search}`}
            />
            <div className="categories">
              <button
                className={!selectedCategory ? "category active" : "category"}
                onClick={() => setSelectedCategory("")}
              >
                {t.all}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "category active"
                      : "category"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {language === "ar"
                    ? categoryAr[category] || category
                    : category}
                </button>
              ))}
            </div>
            {loading ? (
              <p className="loading">{t.loading}</p>
            ) : (
              <div className="menu-grid">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <img src={product.image} alt={productName(product)} />
                    <div className="product-content">
                      {product.badge && (
                        <span className="badge">{product.badge}</span>
                      )}
                      <h3>{productName(product)}</h3>
                      <p>{productDescription(product)}</p>
                      <div className="product-footer">
                        <strong>{money(product.price)}</strong>
                        <button
                          className="add-button"
                          onClick={() => addToCart(product)}
                        >
                          + {t.add}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {page === "track" && (
        <section className="content-section narrow">
          <p className="eyebrow">LIVE UPDATES</p>
          <h1 className="page-title">{t.trackTitle}</h1>
          <p className="page-subtitle">{t.trackText}</p>
          <form
            className="track-form"
            onSubmit={(event) => {
              event.preventDefault();
              trackOrder();
            }}
          >
            <input
              value={trackInput}
              onChange={(event) => setTrackInput(event.target.value)}
              placeholder={t.trackPlaceholder}
            />
            <button className="primary-button">{t.trackOrder}</button>
          </form>
          {trackedOrder && (
            <OrderCard
              order={trackedOrder}
              language={language}
              t={t}
              orderItems={orderItems}
            />
          )}{" "}
          {user && (
            <div className="history">
              <h2>{t.myOrders}</h2>
              {myOrders.map((order) => (
                <button
                  className="history-row"
                  key={order.id}
                  onClick={() => {
                    setTrackedOrder(order);
                    setTrackInput(order.id);
                  }}
                >
                  <span>
                    <b>{order.id}</b>
                    <small>{orderItems(order)}</small>
                  </span>
                  <Status status={order.status} t={t} />
                </button>
              ))}
              {!myOrders.length && <p className="muted">{t.loading}</p>}
            </div>
          )}
        </section>
      )}

      {page === "admin" && isAdmin && (
        <section className="content-section admin">
          <div className="admin-head">
            <div>
              <p className="eyebrow">RESTAURANT CONTROL</p>
              <h1 className="page-title">{t.dashboard}</h1>
            </div>
            <button
              className="primary-button"
              onClick={() =>
                setProductModal({ isEdit: false, product: { ...emptyProduct } })
              }
            >
              + {t.addProduct}
            </button>
          </div>
          <div className="tabs">
            {["overview", "orders", "products"].map((tab) => (
              <button
                key={tab}
                className={adminTab === tab ? "tab active" : "tab"}
                onClick={() => setAdminTab(tab)}
              >
                {t[tab]}
              </button>
            ))}
          </div>
          {adminTab === "overview" && (
            <AdminOverview
              data={adminDashboard}
              t={t}
              language={language}
              orderItems={orderItems}
            />
          )}
          {adminTab === "orders" && (
            <OrdersTable
              orders={adminOrders}
              t={t}
              language={language}
              onChange={updateOrderStatus}
              orderItems={orderItems}
            />
          )}
          {adminTab === "products" && (
            <ProductsTable
              products={products}
              t={t}
              language={language}
              onEdit={(product) =>
                setProductModal({ isEdit: true, product: { ...product } })
              }
              onDelete={removeProduct}
            />
          )}
        </section>
      )}

      <aside className={`cart-panel ${cartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>{t.yourOrder}</h2>
          <button className="icon-button" onClick={() => setCartOpen(false)}>
            ×
          </button>
        </div>
        <div className="cart-items">
          {cart.length ? (
            cart.map((item) => (
              <div className="cart-item" key={item.productId}>
                <img src={item.image} alt="" />
                <div>
                  <b>{language === "ar" ? item.nameAr : item.name}</b>
                  <span>{money(item.price)}</span>
                  <div className="quantity">
                    <button onClick={() => changeQuantity(item.productId, -1)}>
                      −
                    </button>
                    <em>{item.quantity}</em>
                    <button onClick={() => changeQuantity(item.productId, 1)}>
                      +
                    </button>
                  </div>
                </div>
                <strong>{money(item.price * item.quantity)}</strong>
              </div>
            ))
          ) : (
            <p className="empty">
              🛒
              <br />
              {t.emptyCart}
            </p>
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-summary">
            <p>
              <span>{t.subtotal}</span>
              <b>{money(subtotal)}</b>
            </p>
            <p>
              <span>{t.delivery}</span>
              <b>{money(DELIVERY_FEE)}</b>
            </p>
            <p className="grand-total">
              <span>{t.total}</span>
              <b>{money(total)}</b>
            </p>
            <button className="primary-button checkout" onClick={openCheckout}>
              {t.checkout}
            </button>
          </div>
        )}
      </aside>
      {cartOpen && <div className="scrim" onClick={() => setCartOpen(false)} />}

      <Modal
        open={authOpen}
        title={authMode === "login" ? t.loginTitle : t.registerTitle}
        onClose={() => setAuthOpen(false)}
      >
        <div className="auth-tabs">
          <button
            className={authMode === "login" ? "active" : ""}
            onClick={() => setAuthMode("login")}
          >
            {t.login}
          </button>
          <button
            className={authMode === "register" ? "active" : ""}
            onClick={() => setAuthMode("register")}
          >
            {t.register}
          </button>
        </div>
        <form className="form-stack" onSubmit={submitAuth}>
          {authMode === "register" && (
            <>
              <label>
                {t.name}
                <input
                  required
                  value={authForm.name}
                  onChange={(event) =>
                    setAuthForm({ ...authForm, name: event.target.value })
                  }
                />
              </label>
              <label>
                {t.phone}
                <input
                  value={authForm.phone}
                  onChange={(event) =>
                    setAuthForm({ ...authForm, phone: event.target.value })
                  }
                />
              </label>
            </>
          )}
          <label>
            {t.email}
            <input
              required
              type="email"
              value={authForm.email}
              onChange={(event) =>
                setAuthForm({ ...authForm, email: event.target.value })
              }
            />
          </label>
          <label>
            {t.password}
            <input
              required
              minLength="6"
              type="password"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm({ ...authForm, password: event.target.value })
              }
            />
          </label>
          <button className="primary-button">
            {authMode === "login" ? t.login : t.register}
          </button>
        </form>
        <p className="demo-text">{t.demo}</p>
      </Modal>

      <Modal
        open={checkoutOpen}
        title={t.checkoutTitle}
        onClose={() => setCheckoutOpen(false)}
      >
        <form className="form-stack" onSubmit={placeOrder}>
          <label>
            {t.address}
            <input
              required
              value={checkout.address}
              placeholder={t.addressHint}
              onChange={(event) =>
                setCheckout({ ...checkout, address: event.target.value })
              }
            />
          </label>
          <label>
            {t.notes}
            <textarea
              value={checkout.notes}
              placeholder={t.notesHint}
              onChange={(event) =>
                setCheckout({ ...checkout, notes: event.target.value })
              }
            />
          </label>
          <fieldset>
            <legend>{t.payment}</legend>
            <label
              className={`payment-option ${checkout.paymentMethod === "cod" ? "selected" : ""}`}
            >
              <input
                checked={checkout.paymentMethod === "cod"}
                type="radio"
                name="payment"
                onChange={() =>
                  setCheckout({ ...checkout, paymentMethod: "cod" })
                }
              />
              <span>💵</span>
              <div>
                <b>{t.cash}</b>
                <small>{t.cashText}</small>
              </div>
            </label>
            <label
              className={`payment-option ${checkout.paymentMethod === "online" ? "selected" : ""}`}
            >
              <input
                checked={checkout.paymentMethod === "online"}
                type="radio"
                name="payment"
                onChange={() =>
                  setCheckout({ ...checkout, paymentMethod: "online" })
                }
              />
              <span>💳</span>
              <div>
                <b>{t.online}</b>
                <small>{t.onlineText}</small>
              </div>
            </label>
            {checkout.paymentMethod === "online" && (
              <p className="info-box">ⓘ {t.onlineDemo}</p>
            )}
          </fieldset>
          <div className="checkout-summary">
            <p>
              <span>{t.subtotal}</span>
              <b>{money(subtotal)}</b>
            </p>
            <p>
              <span>{t.delivery}</span>
              <b>{money(DELIVERY_FEE)}</b>
            </p>
            <p className="grand-total">
              <span>{t.total}</span>
              <b>{money(total)}</b>
            </p>
          </div>
          <button className="primary-button">{t.placeOrder}</button>
        </form>
      </Modal>

      <Modal
        open={Boolean(successOrder)}
        title={t.orderPlaced}
        onClose={() => setSuccessOrder(null)}
      >
        <div className="success">
          <span>✓</span>
          <p>{t.orderPlacedText}</p>
          <small>{t.yourOrderId}</small>
          <strong>{successOrder?.id}</strong>
          <button
            className="primary-button"
            onClick={() => {
              setTrackInput(successOrder.id);
              setTrackedOrder(successOrder);
              setSuccessOrder(null);
              setPage("track");
            }}
          >
            {t.trackMyOrder}
          </button>
        </div>
      </Modal>

      <Modal
        open={Boolean(productModal)}
        title={productModal?.isEdit ? t.edit : t.addProduct}
        onClose={() => setProductModal(null)}
        wide
      >
        <ProductForm
          product={productModal?.product || emptyProduct}
          setProduct={(product) =>
            setProductModal({ ...productModal, product })
          }
          t={t}
          language={language}
          onSubmit={saveProduct}
        />
      </Modal>
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </main>
  );
}

function Status({ status, t }) {
  return (
    <span className={`status ${status}`}>{t.status[status] || status}</span>
  );
}
function OrderCard({ order, language, t, orderItems }) {
  const stage =
    order.status === "cancelled" ? -1 : statusFlow.indexOf(order.status);
  return (
    <article className="order-card">
      <div className="order-card-top">
        <div>
          <small>{order.id}</small>
          <h2>{money(order.total)}</h2>
        </div>
        <Status status={order.status} t={t} />
      </div>
      <p>{orderItems(order)}</p>
      <p className="muted">{dateTime(order.createdAt, language)}</p>
      {order.status !== "cancelled" && (
        <div className="order-steps">
          {statusFlow.map((status, index) => (
            <div className={index <= stage ? "step done" : "step"} key={status}>
              <span>
                {index < stage ? "✓" : index === stage ? "●" : index + 1}
              </span>
              <small>{t.status[status]}</small>
            </div>
          ))}
        </div>
      )}
      <div className="order-details">
        <span>{order.address}</span>
        <span>{order.paymentMethod === "online" ? t.online : t.cash}</span>
      </div>
    </article>
  );
}
function AdminOverview({ data, t, language, orderItems }) {
  if (!data) return <p className="loading">{t.loading}</p>;
  const stats = data.stats;
  return (
    <>
      <div className="stats">
        <Stat label={t.totalOrders} value={stats.totalOrders} />
        <Stat label={t.revenue} value={money(stats.revenue)} />
        <Stat label={t.activeOrders} value={stats.activeOrders} />
        <Stat label={t.menuItems} value={stats.menuItems} />
      </div>
      <h2 className="table-title">{t.recentOrders}</h2>
      <OrdersTable
        orders={data.recentOrders}
        t={t}
        language={language}
        orderItems={orderItems}
      />
    </>
  );
}
function Stat({ label, value }) {
  return (
    <article className="stat">
      <small>{label}</small>
      <strong>{value}</strong>
    </article>
  );
}
function OrdersTable({ orders, t, language, onChange, orderItems }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{t.customer}</th>
            <th>{t.items}</th>
            <th>{t.amount}</th>
            <th>{t.paymentLabel}</th>
            <th>{t.statusLabel}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <b>{order.id}</b>
                <small>{dateTime(order.createdAt, language)}</small>
              </td>
              <td>{order.customer}</td>
              <td className="items-cell">{orderItems(order)}</td>
              <td>{money(order.total)}</td>
              <td>{order.paymentMethod === "online" ? t.online : t.cash}</td>
              <td>
                {onChange ? (
                  <select
                    value={order.status}
                    onChange={(event) => onChange(order.id, event.target.value)}
                  >
                    {Object.keys(t.status).map((status) => (
                      <option value={status} key={status}>
                        {t.status[status]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Status status={order.status} t={t} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function ProductsTable({ products, t, language, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t.products}</th>
            <th>{t.category}</th>
            <th>{t.price}</th>
            <th>{t.available}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="product-cell">
                <img src={product.image} alt="" />
                <span>
                  <b>{language === "ar" ? product.nameAr : product.name}</b>
                  <small>{product.id}</small>
                </span>
              </td>
              <td>
                {language === "ar"
                  ? categoryAr[product.category] || product.category
                  : product.category}
              </td>
              <td>{money(product.price)}</td>
              <td>{product.active ? "✓" : "—"}</td>
              <td className="actions">
                <button onClick={() => onEdit(product)}>{t.edit}</button>
                <button className="danger" onClick={() => onDelete(product.id)}>
                  {t.delete}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function ProductForm({ product, setProduct, t, language, onSubmit }) {
  const update = (key, value) => setProduct({ ...product, [key]: value });
  return (
    <form className="form-stack product-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          {t.productName}
          <input
            required
            value={product.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </label>
        <label>
          {t.productNameAr}
          <input
            required
            value={product.nameAr}
            onChange={(event) => update("nameAr", event.target.value)}
          />
        </label>
      </div>
      <label>
        {t.productDesc}
        <textarea
          required
          value={product.description}
          onChange={(event) => update("description", event.target.value)}
        />
      </label>
      <label>
        {t.productDescAr}
        <textarea
          required
          value={product.descriptionAr}
          onChange={(event) => update("descriptionAr", event.target.value)}
        />
      </label>
      <div className="form-grid">
        <label>
          {t.price}
          <input
            required
            min="1"
            type="number"
            value={product.price}
            onChange={(event) => update("price", event.target.value)}
          />
        </label>
        <label>
          {t.category}
          <select
            value={product.category}
            onChange={(event) => update("category", event.target.value)}
          >
            {Object.keys(categoryAr).map((category) => (
              <option key={category} value={category}>
                {language === "ar" ? categoryAr[category] : category}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        {t.image}
        <input
          required
          type="url"
          value={product.image}
          onChange={(event) => update("image", event.target.value)}
        />
      </label>
      <div className="form-grid">
        <label>
          {t.badge}
          <input
            value={product.badge}
            onChange={(event) => update("badge", event.target.value)}
          />
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={product.active}
            onChange={(event) => update("active", event.target.checked)}
          />
          {t.available}
        </label>
      </div>
      <button className="primary-button">{t.save}</button>
    </form>
  );
}
