from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.get_json()

    name = data.get("name")
    score = data.get("score")
    cause = data.get("cause")
    duration = data.get("duration")

    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    
    line = f"[{timestamp}] {name} | {score} | {cause.upper()} | {duration}\n"

    
    with open("history.txt", "a") as file:
        file.write(line)

    print("Saved:", line)

    return jsonify({"message": "Saved!"})

if __name__ == "__main__":
    app.run(debug=True)
