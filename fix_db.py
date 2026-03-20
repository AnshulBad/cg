import sqlite3

def upgrade():
    try:
        conn = sqlite3.connect("data.db")
        cur = conn.cursor()
        
        # Add to scenarios
        try:
            cur.execute("ALTER TABLE scenarios ADD COLUMN status VARCHAR DEFAULT 'published'")
        except Exception as e:
            print("scenarios status:", e)
            
        # Add to player_stats
        try:
            cur.execute("ALTER TABLE player_stats ADD COLUMN playtime_seconds INTEGER DEFAULT 0")
        except Exception as e:
            print("player_stats playtime:", e)
        try:
            cur.execute("ALTER TABLE player_stats ADD COLUMN highest_level INTEGER DEFAULT 1")
        except Exception as e:
            print("player_stats highest_level:", e)
            
        # Add to answer_history
        try:
            cur.execute("ALTER TABLE answer_history ADD COLUMN time_taken FLOAT DEFAULT 0.0")
        except Exception as e:
            print("answer_history time_taken:", e)
            
        conn.commit()
        conn.close()
        print("Done")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    upgrade()
