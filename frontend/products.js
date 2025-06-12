import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Load and render products from Firestore
async function loadProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear if already loaded

  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc) => {
      const p = doc.data();

      const card = document.createElement("div");
      card.className = "product-card";

      // 🔹 Product Image
      const img = document.createElement("img");
      img.src = p.image && p.image.startsWith("http")
        ? p.image
        : "https://via.placeholder.com/300x300?text=Product+Image";
      img.alt = p.name;
      img.className = "product-image";

      // 🔹 Info section
      const name = document.createElement("h3");
      name.textContent = p.name;

      const desc = document.createElement("p");
      desc.textContent = p.description;

      const price = document.createElement("strong");
      price.className = "price";
      price.textContent = `₹${p.price}`;

      // 🔹 Add to Cart Button
      const button = document.createElement("button");
      button.textContent = "Add to Cart";
      button.onclick = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(item => item.name === p.name);

        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({
            name: p.name,
            price: p.price,
            quantity: 1
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`✅ "${p.name}" added to cart!`);
      };

      // 🔹 Structure layout
      const info = document.createElement("div");
      info.className = "product-info";
      info.appendChild(name);
      info.appendChild(desc);
      info.appendChild(price);
      info.appendChild(button);

      const container = document.createElement("div");
      container.className = "product-image-container";
      container.appendChild(img);

      // Final card assembly
      card.appendChild(container);
      card.appendChild(info);
      productList.appendChild(card);
    });

  } catch (error) {
    console.error("❌ Failed to load products:", error);
  }
}

loadProducts();
