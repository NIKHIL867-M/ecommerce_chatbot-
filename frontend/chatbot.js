import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// -------------------- BOT CONFIG ---------------------
const BOT_CONFIG = {
  fallbackResponses: [
    "I'm still learning. Could you rephrase that?",
    "Interesting question! Let me find that info for you...",
    "🤔 I'm not sure I understand. Try asking about products or orders.",
    "Let me connect you to a human who can help with that."
  ],
  greetingResponses: [
    "Hey there! 👋 What can I help you discover today?",
    "Hello! Ready to find some awesome products?",
    "Hi friend! What brings you here today?",
    "Yo! 😎 Let's get shopping!"
  ],
  farewellResponses: [
    "Goodbye! 👋 Come back soon!",
    "See you later! Happy shopping!",
    "Bye for now! Need anything else before you go?",
    "Catch you on the flip side! ✌️"
  ]
};

// -------------------- STATE ---------------------
const conversationState = {
  lastProductCategory: null,
  awaitingOrderId: false,
  cartItems: []
};

// -------------------- MAIN CHAT HANDLER ---------------------
async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message === "") return;

  appendMessage("user", message);
  input.value = "";
  showTypingIndicator();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: message,
        context: conversationState 
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (data?.reply) {
      updateConversationState(message, data.reply);
      appendMessage("bot", data.reply);
    } else {
      throw new Error("No reply in backend response");
    }
  } catch (err) {
    console.warn("⚠️ Backend error or timeout — fallback triggered.");
    const fallback = await getEnhancedBotReply(message);
    updateConversationState(message, fallback.text || fallback.html);
    appendMessage("bot", fallback.html || fallback.text);
  } finally {
    hideTypingIndicator();
  }
}

// -------------------- UI: MESSAGE DISPLAY ---------------------
function appendMessage(sender, content) {
  const chatBox = document.getElementById("chat-messages");
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;

  if (typeof content === "string") {
    const formatted = content
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
      .replace(/#(\d+)/g, '<strong>#$1</strong>');
    msg.innerHTML = formatted;
  } else {
    msg.appendChild(content);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const chatBox = document.getElementById("chat-messages");
  const indicator = document.createElement("div");
  indicator.className = "message bot typing";
  indicator.id = "typing-indicator";
  indicator.innerHTML = "<span></span><span></span><span></span>";
  chatBox.appendChild(indicator);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

// -------------------- FALLBACK LOGIC ---------------------
async function getEnhancedBotReply(userInput) {
  const msg = userInput.toLowerCase().trim();

  if (conversationState.awaitingOrderId) {
    conversationState.awaitingOrderId = false;
    if (msg.match(/\d+/)) return simulateOrderStatus(msg.match(/\d+/)[0]);
    return { text: "Please provide a valid order number like #12345." };
  }

  if (/^(hi|hello|hey|yo|greetings|sup)/i.test(msg)) {
    return { text: randomResponse(BOT_CONFIG.greetingResponses) };
  }

  if (/(price|cost|how much|rate|pricing)/.test(msg)) {
    const match = msg.match(/(?:of|for) (.+?)(?:\?|$)/);
    if (match) {
      const name = match[1];
      return {
        html: `<strong>${name}</strong>: ₹${Math.floor(Math.random() * 9000) + 1000}`
      };
    }
    return { text: "Which product are you asking the price for?" };
  }

  if (/(laptop|phone|t-shirt|product|item|gadget|watch|headphones)/.test(msg)) {
    const category = msg.match(/(laptop|phone|t-shirt|headphones|watch)/)?.[0] || "all";
    conversationState.lastProductCategory = category;
    const html = await getEnhancedProductMatches(msg, category);
    return {
      html: `<h4>🔍 Here's what we found:</h4>${html}`
    };
  }

  if (/(order|track|status|where is|delivery)/.test(msg)) {
    const match = msg.match(/(?:#|number|no\.?)\s?(\d+)/);
    if (match) return simulateOrderStatus(match[1]);
    conversationState.awaitingOrderId = true;
    return { text: "Please provide your order number (like #12345)." };
  }

  if (/(cart|basket)/.test(msg)) {
    return handleCartOperations(msg);
  }

  if (/(bye|goodbye|see you|exit|quit)/.test(msg)) {
    return { text: randomResponse(BOT_CONFIG.farewellResponses) };
  }

  return {
    text: randomResponse(BOT_CONFIG.fallbackResponses)
  };
}

// -------------------- FIRESTORE PRODUCT MATCH ---------------------
async function getEnhancedProductMatches(queryText, category) {
  try {
    let q;
    if (category !== "all") {
      q = query(collection(db, "products"), where("category", "==", category));
    } else {
      q = query(collection(db, "products"));
    }

    const snapshot = await getDocs(q);
    let results = [];

    snapshot.forEach(doc => {
      const p = doc.data();
      results.push(`
        <div class="product-card">
          <img src="${p.image || 'https://via.placeholder.com/150'}" alt="${p.name}" class="product-image">
          <div class="product-info">
            <h5>${p.name}</h5>
            <div class="price">₹${p.price}</div>
            <div class="rating">${'★'.repeat(Math.floor(p.rating || 0))}${'☆'.repeat(5 - Math.floor(p.rating || 0))}</div>
            <button onclick="alert('Adding ${p.name} to cart')">🛒 Add to Cart</button>
          </div>
        </div>
      `);
    });

    return results.length ? `<div class="product-grid">${results.join("")}</div>` : `<p>No matching products found.</p>`;
  } catch (err) {
    console.error("🔥 Firestore query failed:", err);
    return "<p>⚠️ Product lookup is unavailable right now.</p>";
  }
}

// -------------------- UTILITIES ---------------------
function randomResponse(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function updateConversationState(userMessage, botReply) {
  const keywords = ['laptop', 'phone', 't-shirt', 'headphones', 'watch'];
  keywords.forEach(cat => {
    if (userMessage.includes(cat)) conversationState.lastProductCategory = cat;
  });

  if (botReply.includes("order number")) {
    conversationState.awaitingOrderId = true;
  }
}

function simulateOrderStatus(orderId) {
  const responses = [
    `📦 Order #${orderId} is out for delivery!`,
    `⏳ Order #${orderId} is processing. Check again soon.`,
    `✅ Order #${orderId} was delivered yesterday!`,
    `🚫 Order #${orderId} is delayed. We apologize.`
  ];
  return { text: randomResponse(responses) };
}

function handleCartOperations(msg) {
  if (/(add|put)/.test(msg)) {
    const item = msg.match(/(?:add|put) (.+?)(?: to|$)/)?.[1];
    if (item) {
      conversationState.cartItems.push(item);
      return { html: `✅ Added <strong>${item}</strong> to cart.` };
    }
  } else if (/(remove|delete)/.test(msg)) {
    const item = msg.match(/(?:remove|delete) (.+?)(?: from|$)/)?.[1];
    if (item && conversationState.cartItems.includes(item)) {
      conversationState.cartItems = conversationState.cartItems.filter(i => i !== item);
      return { html: `❌ Removed <strong>${item}</strong> from cart.` };
    }
    return { text: `That item isn't in your cart.` };
  }

  return {
    html: conversationState.cartItems.length ?
      `🛒 Cart Items:<ul>${conversationState.cartItems.map(i => `<li>${i}</li>`).join("")}</ul>` :
      "Your cart is empty."
  };
}

export { sendMessage };
