import tkinter as tk
from tkinter import messagebox

# 1. Create the Main Window
window = tk.Tk()
window.title("Login Page")
window.geometry("300x250")  # Set size (Width x Height)

# 2. Define the Login Logic (Function)
def login():
    # Get text from the input boxes
    username = username_entry.get()
    password = password_entry.get()
    
    # Check credentials (Hardcoded for this assignment)
    if username == "admin" and password == "1234":
        messagebox.showinfo("Success", "Login Successful! Welcome Admin.")
    else:
        messagebox.showerror("Error", "Invalid username or password.")

# 3. Create Widgets (Labels, Inputs, Buttons)

# Username Section
tk.Label(window, text="Username").pack(pady=5)
username_entry = tk.Entry(window)
username_entry.pack()

# Password Section
tk.Label(window, text="Password").pack(pady=5)
password_entry = tk.Entry(window, show="*")  # show="*" hides the password
password_entry.pack()

# Login Button
login_button = tk.Button(window, text="Login", command=login, bg="lightblue")
login_button.pack(pady=20)

# 4. Run the Application Loop
print("🖥️ GUI Window Launched...")
window.mainloop()