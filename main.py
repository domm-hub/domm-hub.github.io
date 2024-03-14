from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.config['DEBUG'] = True

# Dummy database to store user data
users = {
    'user1': {'password': 'pass'},
    'user2': {'password': 'word'}
}

usersdata = ["user1", "user2"]

# Dummy database to store messages
messages = {
    'user1': [],
    'user2': []
}

# Variable to store sent messages to anyone
sent_messages = {}

# Authentication endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username in users and users[username]['password'] == password:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Send message endpoint
@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.get_json()
    sender = data.get("sender")
    recipient = data.get("recipent")
    message = data.get("message")
    password = data.get("pass")
    if sender in users and recipient in users:
        messages[recipient].append({'sender': sender, 'message': message})
        
        # Store the message in sent_messages
        if (sender, recipient) not in sent_messages:
            sent_messages[(sender, recipient)] = []
        sent_messages[(sender, recipient)].append({'sender': sender, 'message': message})
        
        if sender in users and users[sender]['password'] == password:
            pass
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
        return jsonify({'message': 'Message sent'}), 200
    else:
        return jsonify({'message': 'Sender or recipient not found'}), 404
@app.route('/get_avaliable_usernames', methods=['GET', 'POST'])
def get_avaliable_usernames():
    if request.method == 'POST':
        data = request.get_json()
        sender = data.get("username")
        password = data.get("password")
        if sender in users and users[sender]['password'] == password:
            return jsonify(usersdata), 200
        else:
            return jsonify("Invalid Credentials."), 401
    elif request.method == 'GET':
        # Handle GET requests here if needed
        return jsonify({'message': 'GET requests not supported for this endpoint'}), 501

# Get messages endpoint
@app.route('/get_messages/<username>', methods=['GET'])
def get_messages(username):
    password = request.args.get("password")
    if username in users and users[username]["password"] == password:
        user_messages = messages[username]
        return jsonify(user_messages), 200
    elif username in users and not users[username]["password"] == password:
        return jsonify({"message": "invalid Credentials"}), 401
    else:
        return jsonify({'message': 'invalid Credentials'}), 401

# Get sent messages endpoint
@app.route('/get_sent_messages/<sender>', methods=['GET'])
def get_sent_messages(sender):
    if sender in users:
        sent_msgs = [message for key, message in sent_messages.items() if key[0] == sender]
        return jsonify(sent_msgs), 200
    else:
        return jsonify({'message': 'Sender not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
