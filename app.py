from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime

app = Flask(__name__,static_folder="static")

@app.route("/")
def home():
    return send_from_directory("static", "index.html")

@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.get_json()

    name = data.get("name")
    score = int(data.get("score"))
    cause = data.get("cause")
    duration =data.get("duration")
    if not name or not isinstance(score, int) or not cause or duration is None:
        return jsonify({"error": "Invalid data"}), 400

    # current timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # line format
    line = f"[{timestamp}] {name} | {score} | {cause} | {duration}\n"
 
    # append to file
    with open("history.txt", "a") as file:
        file.write(line)

    print("Saved:", line)
    
    highscore = score
    with open("history.txt", "r") as file:
        for row in file:
            parts = row.strip().split(" | ")
            if len(parts)>=2:
                username=parts[0].split("] ")[1]
                user_score=int(parts[1])
                
                if username == name:
                    highscore = max(highscore, user_score)
    
    return jsonify({
        "message": "Saved!",
        "highScore": highscore
    })
    # send userdata
@app.route("/get_profile/<name>")
def get_profile(name):
    highscore = 0
    games = 0
    last_score = 0
    last_cause = ""

    try:
        with open("history.txt", "r") as file:
            for row in file:
                parts = row.strip().split(" | ")

                if len(parts) >= 4:
                    username = parts[0].split("] ")[1]
                    score = int(parts[1])
                    cause = parts[2]

                    if username == name:
                        games += 1
                        highscore = max(highscore, score)
                        last_score = score
                        last_cause = cause

    except:
        pass

    return jsonify({
        "name": name,
        "highscore": highscore,
        "games": games,
        "last_score": last_score,
        "last_cause": last_cause
    })

if __name__ == "__main__":
    app.run(debug=True)
