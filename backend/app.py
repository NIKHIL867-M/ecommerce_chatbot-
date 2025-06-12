from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot_logic import get_bot_response

app = Flask(__name__)
CORS(app)  # Allow frontend to talk to backend

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()

    # Debug print to see if frontend is sending correctly
    print("✅ Message received from frontend:", data)

    user_message = data.get("message", "")
    bot_reply = get_bot_response(user_message)

    # Debug print to see what bot is replying
    print("🤖 Bot reply:", bot_reply)

    return jsonify({"reply": bot_reply})

if __name__ == '__main__':
    app.run(debug=True)
