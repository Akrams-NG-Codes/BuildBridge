import sqlite3
import os

# Connect to database
db_path = r'C:\Users\This Pc\Desktop\BuildBridge\db.sqlite3'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create tables
cursor.executescript("""
CREATE TABLE IF NOT EXISTS projects_project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects_projectmember (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'staff',
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects_project(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS updates_update (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    uploaded_by_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    file VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects_project(id) ON DELETE CASCADE,
    FOREIGN KEY(uploaded_by_id) REFERENCES accounts_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS updates_comment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    update_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(update_id) REFERENCES updates_update(id) ON DELETE CASCADE,
    FOREIGN KEY(author_id) REFERENCES accounts_user(id) ON DELETE CASCADE
);
""")

conn.commit()

# List tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("Tables in database:")
for table in tables:
    print("  OK - " + table[0])

conn.close()
print("\nDatabase tables created successfully!")
