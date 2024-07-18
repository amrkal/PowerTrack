from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    phone_number = data.get('phone_number')
    # You can add logic to process the phone number, e.g., save to a database
    return jsonify({'message': 'Phone number registered successfully!', 'phone_number': phone_number})

if __name__ == '__main__':
    app.run(debug=True)
