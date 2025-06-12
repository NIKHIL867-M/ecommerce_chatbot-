function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  cartContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty. 😕</p>";
    totalElement.textContent = "₹0";
    return;
  }

  cart.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "cart-item";

    const title = document.createElement("span");
    title.innerHTML = `<strong>${item.name}</strong> - ₹${item.price} × ${item.quantity}`;

    const qtyLabel = document.createElement("label");
    qtyLabel.innerText = " Qty: ";
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.value = item.quantity;
    qtyInput.min = 1;
    qtyInput.style.width = "40px";
    qtyInput.onchange = () => updateQuantity(index, parseInt(qtyInput.value));

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.onclick = () => removeItem(index);

    wrapper.appendChild(title);
    wrapper.appendChild(document.createElement("br"));
    wrapper.appendChild(qtyLabel);
    wrapper.appendChild(qtyInput);
    wrapper.appendChild(removeBtn);

    cartContainer.appendChild(wrapper);

    total += item.price * item.quantity;
  });

  totalElement.textContent = `₹${total}`;
}

function updateQuantity(index, newQty) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity = newQty;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function goToCheckout() {
  alert("🛒 Ready to integrate Razorpay here!");
  // Future: replace alert with Razorpay checkout logic
}

window.addEventListener("DOMContentLoaded", loadCart);
