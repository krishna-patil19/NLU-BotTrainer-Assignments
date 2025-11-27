import requests
import pandas as pd

def fetch_data():
    # 1. Define the target URL (This is a free testing API)
    url = "https://jsonplaceholder.typicode.com/posts"
    
    print(f"🔌 Connecting to {url}...")

    # 2. Make the Request (The "Connector" part)
    response = requests.get(url)

    # 3. Check if it worked (Status Code 200 means OK)
    if response.status_code == 200:
        print("✅ Connection Successful!")
        
        # 4. Get the data as JSON (dictionary)
        data = response.json()
        
        # OPTIONAL: Let's save it to CSV to look extra professional
        # This combines Ass-1 skills with Ass-2
        df = pd.DataFrame(data)
        df.to_csv('api_data.csv', index=False)
        print(f"📊 Fetched {len(data)} records and saved to 'api_data.csv'")
        
        # Print the first 2 items just to show we got them
        print("\n--- Preview Data ---")
        print(df.head(2))
        
    else:
        print(f"❌ Error: Failed to connect. Status Code: {response.status_code}")

# Run the function
if __name__ == "__main__":
    fetch_data()