import { db } from "./firebase-config.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadOrders() {
  const orderList = document.getElementById("order-list");

  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    orderList.innerHTML = "<p>No orders found.</p>";
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const wrapper = document.createElement("div");
    wrapper.className = "order-card";

    const date = data.createdAt?.toDate().toLocaleString() || "Unknown time";

    let html = `<strong>🧾 Order Total: ₹${data.totalAmount}</strong><br/>`;
    html += `<small>Placed on: ${date}</small><br/><ul>`;

    data.items.forEach(item => {
      html += `<li>${item.name} (₹${item.price} × ${item.quantity})</li>`;
    });

    html += "</ul>";
    wrapper.innerHTML = html;

    orderList.appendChild(wrapper);
  });
}

loadOrders();
