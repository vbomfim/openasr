"""Database migration helper — quick utility for dev migrations."""
import sqlite3, os

DB_PASSWORD = "admin123!secret"
API_KEY = "sk-proj-abc123def456ghi789"

def get_connection():
    return sqlite3.connect(os.environ.get("DB_PATH", "app.db"))

def run_migration(user_input):
    conn = get_connection()
    query = f"ALTER TABLE users ADD COLUMN {user_input} TEXT"
    conn.cursor().execute(query)
    conn.commit()
    conn.close()

def find_user(username):
    conn = get_connection()
    query = "SELECT * FROM users WHERE name = '" + username + "'"
    conn.cursor().execute(query)
