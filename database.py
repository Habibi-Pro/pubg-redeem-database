# database.py
# ------------------------------
# این فایل مدیریت دیتابیس sqlite رو انجام میده
# ------------------------------

import sqlite3
import datetime

# ایجاد یا اتصال به دیتابیس
conn = sqlite3.connect('redeem_codes.db')
cursor = conn.cursor()

# ایجاد جدول اگر وجود نداشت
cursor.execute('''
CREATE TABLE IF NOT EXISTS redeem_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    value TEXT,
    model TEXT,
    description TEXT,
    created_at TEXT,
    used_at TEXT,
    used_by_id TEXT,
    used_by_name TEXT,
    is_used INTEGER DEFAULT 0
)
''')

conn.commit()

# تابع اضافه کردن ریدیم کد
def add_code(code, value, model, description):
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        INSERT INTO redeem_codes (code, value, model, description, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', (code, value, model, description, created_at))
    conn.commit()

# تابع گرفتن همه کدها
def get_all_codes():
    cursor.execute('SELECT * FROM redeem_codes')
    return cursor.fetchall()

# تابع برداشت (استفاده) از یک کد
def use_code(code_id, pubg_id, pubg_name):
    used_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        UPDATE redeem_codes
        SET is_used = 1, used_at = ?, used_by_id = ?, used_by_name = ?
        WHERE id = ?
    ''', (used_at, pubg_id, pubg_name, code_id))
    conn.commit()
