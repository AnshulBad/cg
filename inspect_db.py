import sqlite3
import os

db_path = "data.db"
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
else:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT username FROM player_stats LIMIT 20;")
    rows = cur.fetchall()
    print("Player usernames in player_stats:")
    for row in rows:
        print(f"- {row[0]}")
    conn.close()
