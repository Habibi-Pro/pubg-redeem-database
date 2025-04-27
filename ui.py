# ui.py
# ------------------------------
# این فایل رابط کاربری گرافیکی (GUI) رو میسازه
# ------------------------------

import tkinter as tk
from tkinter import simpledialog, messagebox
import database

# رنگ‌ها
GREEN_COLOR = "#4CAF50"  # سبز متوسط
RED_COLOR = "#F44336"    # سرخ

# ساخت پنجره اصلی
def start_app():
    root = tk.Tk()
    root.title("مدیریت ریدیم کدهای پابجی")
    root.geometry("800x600")
    root.configure(bg="#f0f0f0")

    # تابع برای نمایش کدها
    def refresh_codes():
        for widget in frame_codes.winfo_children():
            widget.destroy()

        codes = database.get_all_codes()
        for code in codes:
            frame = tk.Frame(frame_codes, bd=1, relief="solid", padx=10, pady=5)
            frame.pack(fill="x", pady=2)

            color = GREEN_COLOR if code[9] == 0 else RED_COLOR
            label = tk.Label(frame, text=f"کد: {code[1]} | مقدار: {code[2]} | مدل: {code[3]}", bg=color, fg="white")
            label.pack(side="left", fill="x", expand=True)

            if code[9] == 0:
                btn_use = tk.Button(frame, text="برداشت", command=lambda c=code: use_code_action(c[0]))
                btn_use.pack(side="right")

    # تابع اضافه کردن کد جدید
    def add_code_action():
        code = simpledialog.askstring("کد", "کد را وارد کن:")
        value = simpledialog.askstring("مقدار", "مقدار یوسی یا توضیح:")
        model = simpledialog.askstring("مدل", "مدل یا نوع کد:")
        description = simpledialog.askstring("توضیحات", "توضیحات اضافی:")

        if code:
            database.add_code(code, value, model, description)
            refresh_codes()

    # تابع برداشت کد
    def use_code_action(code_id):
        pubg_id = simpledialog.askstring("آیدی پابجی", "آیدی پابجی را وارد کن:")
        pubg_name = simpledialog.askstring("اسم پابجی", "اسم پابجی را وارد کن:")

        if pubg_id and pubg_name:
            database.use_code(code_id, pubg_id, pubg_name)
            refresh_codes()
        else:
            messagebox.showerror("خطا", "آیدی و اسم باید وارد شود!")

    # دکمه اضافه کردن
    btn_add = tk.Button(root, text="اضافه کردن کد جدید", command=add_code_action)
    btn_add.pack(pady=10)

    # فریم نمایش کدها
    frame_codes = tk.Frame(root)
    frame_codes.pack(fill="both", expand=True)

    refresh_codes()

    root.mainloop()
