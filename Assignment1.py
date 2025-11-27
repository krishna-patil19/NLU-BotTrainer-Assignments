import pandas as pd

# --- PART 1: Setup (Run this once to create a dummy file) ---
data = {
    'Name': ['Atharva', 'Rohan', 'Priya'],
    'Role': ['Developer', 'Designer', 'Manager'],
    'ID': [101, 102, 103]
}
df_dummy = pd.DataFrame(data)
df_dummy.to_excel('student_data.xlsx', index=False)
print("✅ Created dummy Excel file: student_data.xlsx")


# --- PART 2: The Actual Assignment Solution ---

# 1. Read the Excel file
# Make sure the file name matches exactly what is on your computer
df = pd.read_excel('student_data.xlsx')

# 2. (Optional) Check the data to make sure it loaded correctly
print("\nPreview of Data:")
print(df.head())

# 3. Convert and Save as CSV
# index=False prevents pandas from adding that annoying 0,1,2,3 row number column
df.to_csv('student_data_converted.csv', index=False)

print("\n✅ Success! Converted 'student_data.xlsx' to 'student_data_converted.csv'")