import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const button = document.getElementById("checkout-button");

button.addEventListener("click", async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const stripe = Stripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"); // 👉 Replace with your Stripe test key

  alert(`✅ Stripe test mode: ₹${total} would be charged.`);

  // ✅ Save order to Firestore
  try {
    await addDoc(collection(db, "orders"), {
      items: cart,
      totalAmount: total,
      createdAt: serverTimestamp()
    });
    console.log("✅ Order saved to Firebase");
  } catch (err) {
    console.error("❌ Error saving order:", err);
  }

  // ✅ Simulate success
  localStorage.removeItem("cart");
  window.location.href = "success.html";
});
