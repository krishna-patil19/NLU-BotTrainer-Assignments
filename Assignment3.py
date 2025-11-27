import pandas as pd
import numpy as np

# --- PART 1: Create "Messy" Data (Collection) ---
data = {
    'Student_ID': [101, 102, 103, 102, 104, 105],  # Duplicate 102
    'Name': ['Atharva', 'Rohan', 'Priya', 'Rohan', 'Sanket', np.nan], # Missing Name
    'Marks': [85, 90, 78, 90, np.nan, 88],        # Missing Mark
    'City': ['Pune', 'Mumbai', 'Delhi', 'Mumbai', 'Pune', 'Pune']
}

df = pd.DataFrame(data)

print("\n❌ BEFORE CLEANING (Raw Data):")
print(df)
print("-" * 40)

# --- PART 2: Data Cleaning (The Assignment) ---

# 1. Remove Duplicates
# Using logic from your slide: df.drop_duplicates()
df_cleaned = df.drop_duplicates()
print(f"✅ Removed Duplicates. Rows left: {len(df_cleaned)}")

# 2. Handle Missing Values (Nulls)
# Check for nulls first
print(f"Missing Values found:\n{df_cleaned.isnull().sum()}")

# Strategy A: Fill missing Marks with the average (Mean)
# Logic from slide: df.fillna(mean)
mean_marks = df_cleaned['Marks'].mean()
df_cleaned['Marks'] = df_cleaned['Marks'].fillna(mean_marks)

# Strategy B: Drop rows where Name is missing (Can't have a student without a name)
# Logic from slide: df.dropna()
df_cleaned = df_cleaned.dropna(subset=['Name'])

print("-" * 40)
print("✨ AFTER CLEANING (Clean Data):")
print(df_cleaned)

# 3. Save the clean version
df_cleaned.to_csv('cleaned_student_data.csv', index=False)
print("\n💾 Saved cleaned data to 'cleaned_student_data.csv'")