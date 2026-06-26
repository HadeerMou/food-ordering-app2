import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { readDb, writeDb } from "./store.js";
import { requireAdmin, requireAuth, signToken } from "./auth.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const STATUSES = [
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
];

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "1mb" }));

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
});
const productInput = (body) => ({
  name: String(body.name || "").trim(),
  nameAr: String(body.nameAr || "").trim(),
  description: String(body.description || "").trim(),
  descriptionAr: String(body.descriptionAr || "").trim(),
  price: Number(body.price),
  category: String(body.category || "").trim(),
  image: String(body.image || "").trim(),
  badge: String(body.badge || "").trim(),
  active: body.active !== false,
});

function validateProduct(product) {
  if (
    !product.name ||
    !product.nameAr ||
    !product.description ||
    !product.descriptionAr ||
    !product.category ||
    !product.image
  )
    return "Complete all bilingual product fields and image URL.";
  if (!Number.isFinite(product.price) || product.price <= 0)
    return "Price must be greater than zero.";
  return null;
}

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "foody-api" }),
);

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { name, email, password, phone = "" } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    const db = await readDb();
    const normalizedEmail = email.trim().toLowerCase();
    if (db.users.some((user) => user.email === normalizedEmail))
      return res.status(409).json({ message: "Email already registered." });
    const user = {
      id: `usr_${uuid()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role: "user",
      phone: phone.trim(),
    };
    db.users.push(user);
    await writeDb(db);
    return res
      .status(201)
      .json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = await readDb();
    const user = db.users.find(
      (entry) =>
        entry.email ===
        String(email || "")
          .trim()
          .toLowerCase(),
    );
    if (!user || !(await bcrypt.compare(String(password || ""), user.password)))
      return res.status(401).json({ message: "Invalid email or password." });
    return res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", requireAuth, async (req, res, next) => {
  try {
    const db = await readDb();
    const user = db.users.find((entry) => entry.id === req.user.sub);
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/menu/categories", async (_req, res, next) => {
  try {
    const db = await readDb();
    const categories = [
      ...new Set(
        db.products
          .filter((product) => product.active)
          .map((product) => product.category),
      ),
    ];
    return res.json({ categories });
  } catch (error) {
    next(error);
  }
});

app.get("/api/menu", async (req, res, next) => {
  try {
    const db = await readDb();
    const category = String(req.query.category || "");
    const query = String(req.query.q || "")
      .trim()
      .toLowerCase();
    const includeInactive =
      req.query.includeInactive === "true" && req.headers.authorization;
    const products = db.products.filter((product) => {
      const matchesStatus = includeInactive || product.active;
      const matchesCategory = !category || product.category === category;
      const searchable =
        `${product.name} ${product.nameAr} ${product.description} ${product.descriptionAr}`.toLowerCase();
      return (
        matchesStatus &&
        matchesCategory &&
        (!query || searchable.includes(query))
      );
    });
    return res.json({ products });
  } catch (error) {
    next(error);
  }
});

app.post("/api/menu", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const product = productInput(req.body);
    const issue = validateProduct(product);
    if (issue) return res.status(400).json({ message: issue });
    const db = await readDb();
    const record = { id: `p_${uuid()}`, ...product };
    db.products.unshift(record);
    await writeDb(db);
    return res.status(201).json({ product: record });
  } catch (error) {
    next(error);
  }
});

app.patch(
  "/api/menu/:id",
  requireAuth,
  requireAdmin,
  async (req, res, next) => {
    try {
      const db = await readDb();
      const product = db.products.find((entry) => entry.id === req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found." });
      const nextProduct = {
        ...product,
        ...productInput({ ...product, ...req.body }),
      };
      const issue = validateProduct(nextProduct);
      if (issue) return res.status(400).json({ message: issue });
      Object.assign(product, nextProduct);
      await writeDb(db);
      return res.json({ product });
    } catch (error) {
      next(error);
    }
  },
);

app.delete(
  "/api/menu/:id",
  requireAuth,
  requireAdmin,
  async (req, res, next) => {
    try {
      const db = await readDb();
      const index = db.products.findIndex(
        (entry) => entry.id === req.params.id,
      );
      if (index < 0)
        return res.status(404).json({ message: "Product not found." });
      const [deleted] = db.products.splice(index, 1);
      await writeDb(db);
      return res.json({ product: deleted });
    } catch (error) {
      next(error);
    }
  },
);

app.post("/api/orders", requireAuth, async (req, res, next) => {
  try {
    const { items, address, notes = "", paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Your cart is empty." });
    if (!String(address || "").trim())
      return res.status(400).json({ message: "Delivery address is required." });
    if (!["cod", "online"].includes(paymentMethod))
      return res
        .status(400)
        .json({ message: "Choose a valid payment method." });

    const db = await readDb();
    const user = db.users.find((entry) => entry.id === req.user.sub);
    if (!user) return res.status(404).json({ message: "User not found." });

    const orderItems = items.map((entry) => {
      const product = db.products.find(
        (candidate) => candidate.id === entry.productId && candidate.active,
      );
      if (!product)
        throw Object.assign(
          new Error(`Product ${entry.productId} is unavailable.`),
          { status: 400 },
        );
      const quantity = Number(entry.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)
        throw Object.assign(
          new Error("Each quantity must be between 1 and 20."),
          { status: 400 },
        );
      return {
        productId: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        quantity,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = 15;
    const orderNumber = 1000 + db.orders.length + 1;
    const order = {
      id: `ORD-${orderNumber}`,
      userId: user.id,
      customer: user.name,
      phone: user.phone || "",
      address: address.trim(),
      notes: String(notes).trim(),
      items: orderItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      paymentMethod,
      paymentStatus: paymentMethod === "online" ? "paid" : "pending",
      transactionId:
        paymentMethod === "online"
          ? `PAY-DEMO-${uuid().slice(0, 8).toUpperCase()}`
          : null,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    db.orders.unshift(order);
    await writeDb(db);
    return res.status(201).json({
      order,
      message:
        paymentMethod === "online"
          ? "Mock payment approved."
          : "Order placed. Pay cash on delivery.",
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/orders/:id", async (req, res, next) => {
  try {
    const db = await readDb();
    const order = db.orders.find(
      (entry) => entry.id.toLowerCase() === req.params.id.toLowerCase(),
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.json({ order });
  } catch (error) {
    next(error);
  }
});

app.get("/api/orders/me", requireAuth, async (req, res, next) => {
  try {
    const db = await readDb();
    return res.json({
      orders: db.orders.filter((order) => order.userId === req.user.sub),
    });
  } catch (error) {
    next(error);
  }
});

app.get(
  "/api/admin/orders",
  requireAuth,
  requireAdmin,
  async (_req, res, next) => {
    try {
      const db = await readDb();
      return res.json({ orders: db.orders });
    } catch (error) {
      next(error);
    }
  },
);

app.patch(
  "/api/admin/orders/:id/status",
  requireAuth,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { status } = req.body;
      if (!STATUSES.includes(status))
        return res.status(400).json({ message: "Invalid order status." });
      const db = await readDb();
      const order = db.orders.find((entry) => entry.id === req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found." });
      order.status = status;
      await writeDb(db);
      return res.json({ order });
    } catch (error) {
      next(error);
    }
  },
);

app.get(
  "/api/admin/dashboard",
  requireAuth,
  requireAdmin,
  async (_req, res, next) => {
    try {
      const db = await readDb();
      const activeOrders = db.orders.filter(
        (order) => !["delivered", "cancelled"].includes(order.status),
      );
      return res.json({
        stats: {
          totalOrders: db.orders.length,
          revenue: db.orders
            .filter(
              (order) =>
                order.paymentStatus === "paid" || order.paymentMethod === "cod",
            )
            .reduce((sum, order) => sum + order.total, 0),
          activeOrders: activeOrders.length,
          menuItems: db.products.filter((product) => product.active).length,
        },
        recentOrders: db.orders.slice(0, 5),
      });
    } catch (error) {
      next(error);
    }
  },
);

app.use((error, _req, res, _next) => {
  console.error(error);
  res
    .status(error.status || 500)
    .json({ message: error.message || "Internal server error." });
});

app.listen(port, () =>
  console.log(`Foody API is running at http://localhost:${port}`),
);
