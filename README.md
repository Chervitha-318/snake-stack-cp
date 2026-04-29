A browser-based Snake game with a full three-layer 
architecture: a JavaScript frontend that the player interacts with, a Python (Flask) backend that 
receives and store game results,and a Bash administration script for inspecting and managing stored data .

we are using python3.10,Bash and Flask packages.

 To run the server, first install the required dependency using `pip install flask`, then start the application with `python3 app.py`, and open `http://127.0.0.1:5000/` in a browser to access the game; no external web server is needed.
 
 The project also includes a Bash admin script for analyzing stored scores, which can be executed by first granting permission using `chmod +x admin.sh` and then running `bash admin.sh`.
 
 All game results are recorded in a file named `history.txt`.
 where each entry is stored on a new line in a consistent format: `[YYYY-MM-DD HH:MM:SS] <username> | <score> | <cause> | <duration>`. For example, `[2025-06-12 14:35:02] Herobrine | 42 | WALL | 85`. 

* Timestamp → Date and time when the game ended
* Username → Player name
* Score → Final score
* Cause → Reason for game over (`WALL`, `SELF`)
* Duration → Time survived (in seconds)


