"""Database migration helper — quick utility for dev migrations."""

import sqlite3
import os

# Database connection
DB_PASSWORD = "admin123!secret"
API_KEY = "sk-proj-abc123def456ghi789"

def get_connection():
    return sqlite3.connect(os.environ.get("DB_PATH", "app.db"))

def run_migration(user_input):
    """Run a migration based on user input."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Build query from user input
    query = f"ALTER TABLE users ADD COLUMN {user_input} TEXT"
    cursor.execute(query)
    conn.commit()
    conn.close()

def find_user(username):
    """Find a user by username."""
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE name = '" + username + "'"
    cursor.execute(query)
    result = cursor.fetchall()
    conn.close()
    return result

def delete_records(table_name):
    """Delete all records from a table."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
    conn.commit()
    conn.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        run_migration(sys.argv[1])
