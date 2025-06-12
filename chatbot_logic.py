import random
import re
from datetime import datetime

# Dummy product list for search/suggestions (can connect to Firebase later)
demo_products = ["T-shirt", "Headphones", "Water bottle", "Smart Watch", "Graphic tee", "Bluetooth speaker"]

# In-memory mock cart (for demo)
fake_cart = []

def get_bot_response(user_input):
    msg = user_input.lower().strip()

    # ==== GREETINGS ====
    greeting_responses = [
        "Hey there! 👋 What's cookin' good lookin'?",
        "Yo yo! Ready to chat? 😎",
        "Hello sunshine! 🌞 How can I brighten your day?",
        "Hi friend! What's on your mind today?"
    ]
    if any(word in msg for word in ["hi", "hello", "hey", "yo", "sup", "greetings"]):
        return random.choice(greeting_responses)

    # ==== PRICE INQUIRIES ====
    price_patterns = [
        r"how much (?:does|do) (.*) cost",
        r"price of (.*)",
        r"what's the (?:price|cost) of (.*)",
        r"how much for (.*)"
    ]
    for pattern in price_patterns:
        match = re.search(pattern, msg)
        if match:
            item = match.group(1)
            return f"💰 Let me check... {item.title()} is going for ₹{random.randint(100, 999)} right now!"

    if any(word in msg for word in ["price", "cost", "how much", "rate", "pricing"]):
        return "Tell me the product name and I’ll look it up for you! 👀"

    # ==== RECOMMENDATIONS ====
    if "suggest" in msg or "recommend" in msg:
        categories = {
            "electronics": ["Smart watch", "Bluetooth speaker", "Wireless earbuds"],
            "clothing": ["Graphic tee", "Denim jacket", "Yoga pants"],
            "books": ["Sci-fi novel", "Self-help book", "Cookbook"]
        }
        if "electronics" in msg:
            return f"🔌 You might love: {random.choice(categories['electronics'])}!"
        elif "clothing" in msg or "clothes" in msg:
            return f"👕 Style tip: Try a {random.choice(categories['clothing'])}!"
        elif "book" in msg:
            return f"📚 Reader’s pick: {random.choice(categories['books'])}"
        else:
            return f"🌟 You can’t go wrong with a {random.choice(random.choice(list(categories.values())))}!"

    # ==== CART INTERACTIONS ====
    if "cart" in msg:
        if "add" in msg:
            match = re.search(r"add (.*) to cart", msg)
            if match:
                item = match.group(1).strip().title()
                fake_cart.append(item)
                return f"✅ Added {item} to your cart. You now have {len(fake_cart)} item(s)."
            return "🛒 Say something like 'Add T-shirt to cart'!"

        elif "remove" in msg:
            match = re.search(r"remove (.*)", msg)
            if match:
                item = match.group(1).strip().title()
                if item in fake_cart:
                    fake_cart.remove(item)
                    return f"❌ Removed {item} from cart. {len(fake_cart)} item(s) left."
                else:
                    return f"🤷‍♂️ {item} isn’t in your cart."

        elif any(w in msg for w in ["view", "show", "what's in", "check"]):
            return f"🛒 Your cart contains: {', '.join(fake_cart) if fake_cart else 'nothing yet!'}"

        return "You can say: 'Add headphones to cart' or 'Remove bottle from cart' or 'View cart'"

    # ==== ORDER STATUS ====
    if "track" in msg or "status" in msg or "where is my order" in msg:
        match = re.search(r"order #?(\d+)", msg)
        if match:
            order_id = match.group(1)
            return f"🚚 Order #{order_id} is out for delivery! Expected arrival: tomorrow."
        else:
            return "📦 Please provide your order number (e.g. Order #1234) so I can check it!"

    # ==== CHECKOUT ====
    if any(word in msg for word in ["checkout", "pay", "payment"]):
        return "🛍️ Let's get you checked out:\n1. View cart\n2. Click Checkout\n3. Pay securely via Stripe"

    # ==== TIME ====
    if any(phrase in msg for phrase in ["time", "what time", "current time"]):
        return f"⏰ It's {datetime.now().strftime('%I:%M %p')} on {datetime.now().strftime('%A, %B %d')}."

    # ==== COMPLAINTS ====
    if "problem" in msg or "issue" in msg or "complaint" in msg:
        return "😟 Sorry to hear that! Our support team will reach out ASAP. Tell me more?"

    # ==== COMPLIMENTS ====
    if any(word in msg for word in ["good", "great", "awesome", "amazing", "love"]):
        return "😊 You're awesome too! Thanks for the love 💖"

    # ==== GOODBYES ====
    if any(word in msg for word in ["bye", "goodbye", "exit", "see ya", "quit"]):
        return random.choice(["👋 Catch you later!", "✌️ Peace out!", "Bye bye! Come shop again soon!"])

    # ==== PRODUCT SEARCH ====
    if "find" in msg or "show me" in msg or "search" in msg:
        for item in demo_products:
            if item.lower() in msg:
                return f"🔍 Found {item}! Head over to products section to add it to your cart."
        return "🔎 Hmm... Couldn't find that product. Try using simpler words or check spelling."

    # ==== FALLBACK ====
    fallback_responses = [
        "🤔 I'm not sure I understood. Try asking about prices, cart, or orders!",
        "Still learning! Ask me about products, payments, or your cart 🛒",
        "🧠 Need help? You can say things like 'suggest a product', 'track order', or 'view cart'."
    ]
    return random.choice(fallback_responses)
