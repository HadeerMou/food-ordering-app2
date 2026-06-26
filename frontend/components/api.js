import menu from "../data/menu";
import orders from "../data/orders";
import users from "../data/users";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function api(path, { method = "GET", body, token } = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  } catch (error) {
    console.warn("Backend unavailable. Using local mock data.");

    if (path === "/orders/me") {
      const currentUser = JSON.parse(localStorage.getItem("mock-user"));

      if (!currentUser) {
        throw new Error("Please login first");
      }
      return {
        orders: orders.filter((order) => order.userId === currentUser?.id),
      };
    }

    if (path.startsWith("/orders/")) {
      const id = path.split("/").pop();

      const order = orders.find((o) => o.id === id);

      if (!order) throw new Error("Order not found");

      return { order };
    }

    if (path.startsWith("/menu/") && method === "PATCH") {
      const id = path.split("/").pop();

      const product = menu.find((p) => p.id === id);

      if (!product) throw new Error("Product not found");

      Object.assign(product, body);

      return {
        product,
        message: "Updated",
      };
    }
    if (path.startsWith("/menu/") && method === "DELETE") {
      const id = path.split("/").pop();

      const index = menu.findIndex((p) => p.id === id);

      if (index === -1) throw new Error("Product not found");

      menu.splice(index, 1);

      return {
        message: "Deleted",
      };
    }
    if (
      path.startsWith("/admin/orders/") &&
      path.endsWith("/status") &&
      method === "PATCH"
    ) {
      const id = path.split("/")[3];

      const order = orders.find((o) => o.id === id);

      if (!order) throw new Error("Order not found");

      order.status = body.status;

      return {
        order,
        message: "Status updated",
      };
    }

    switch (path) {
      case "/menu":
      case "/menu?includeInactive=true":
        if (method === "POST") {
          const product = {
            id: `p${menu.length + 1}`,
            ...body,
          };

          menu.push(product);

          return {
            product,
            message: "Product created",
          };
        }

        return {
          products: menu,
        };

      case "/menu/categories":
        return {
          categories: [...new Set(menu.map((item) => item.category))],
        };

      case "/admin/orders":
        return {
          orders,
        };

      case "/admin/dashboard":
        return {
          stats: {
            totalOrders: orders.length,
            revenue: orders.reduce((s, o) => s + o.total, 0),
            activeOrders: orders.filter(
              (o) => !["delivered", "cancelled"].includes(o.status),
            ).length,
            menuItems: menu.length,
          },
          recentOrders: orders.slice(0, 5),
        };

      case "/orders":
        if (method === "POST") {
          const items = body.items.map((item) => {
            const product = menu.find((p) => p.id === item.productId);

            return {
              productId: product.id,
              name: product.name,
              nameAr: product.nameAr,
              price: product.price,
              quantity: item.quantity,
            };
          });

          const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
          const currentUser = JSON.parse(localStorage.getItem("mock-user"));

          const order = {
            id: `ORD-${1000 + orders.length + 1}`,
            userId: currentUser.id,
            customer: currentUser.name,
            phone: currentUser.phone,
            address: body.address,
            notes: body.notes,
            items,
            subtotal,
            deliveryFee: 15,
            total: subtotal + 15,
            paymentMethod: body.paymentMethod,
            paymentStatus: body.paymentMethod === "online" ? "paid" : "pending",
            status: "confirmed",
            createdAt: new Date().toISOString(),
          };

          orders.unshift(order);

          return {
            order,
            message: "Order placed successfully",
          };
        }

        return { orders };

      case "/auth/login": {
        const user = users.find(
          (u) => u.email === body?.email && u.password === body?.password,
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        localStorage.setItem("mock-user", JSON.stringify(user));

        return {
          user,
          token: "mock-token",
        };
      }

      case "/auth/register": {
        const newUser = {
          id: `usr_${Date.now()}`,
          role: "user",
          ...body,
        };

        users.push(newUser);

        localStorage.setItem("mock-user", JSON.stringify(newUser));

        return {
          user: newUser,
          token: "mock-token",
        };
      }

      default:
        throw error;
    }
  }
}

export { API_URL };
