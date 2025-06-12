// Sample order data - in a real app, this would come from an API
const orders = [
  {
    id: 1,
    product: "Wireless Headphones",
    status: "Shipped",
    date: "2023-05-15",
    amount: "$99.99",
    tracking: "UPS-123456789"
  },
  {
    id: 2,
    product: "Smart Watch",
    status: "Processing",
    date: "2023-05-18",
    amount: "$199.99",
    tracking: "Not shipped yet"
  },
  {
    id: 3,
    product: "Bluetooth Speaker",
    status: "Delivered",
    date: "2023-05-10",
    amount: "$59.99",
    tracking: "FEDEX-987654321"
  },
  {
    id: 4,
    product: "Laptop Backpack",
    status: "Shipped",
    date: "2023-05-20",
    amount: "$39.99",
    tracking: "USPS-456123789"
  }
];

// Get the container element
const board = document.getElementById('orders-board');
const orderCount = document.getElementById('order-count');

// Update order count
orderCount.textContent = orders.length;

// Generate cards for each order dynamically
orders.forEach((order, index) => {
  const card = document.createElement('button');
  card.className = 'card';
  card.onclick = function() { this.classList.toggle('flipped'); };

  // Set z-index translation based on position
  card.style.setProperty('--translate-z', `${(index + 1) * 3}px`);

  card.innerHTML = `
    <span class="wrapper">
      <span class="content">
        <span class="face back">
          <span class="order-title">Order #${order.id}</span>
          <span class="order-detail">Click to flip</span>
        </span>
        <span class="face front">
          <span class="order-title">${order.product}</span>
          <span class="order-detail">Status: ${order.status}</span>
          <span class="order-detail">Date: ${order.date}</span>
          <span class="order-detail">Amount: ${order.amount}</span>
          <span class="order-detail">Tracking: ${order.tracking}</span>
        </span>
      </span>
    </span>
  `;

  board.appendChild(card);
});
