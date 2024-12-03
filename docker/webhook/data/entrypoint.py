import os
import requests
from pymongo import MongoClient

# Database configuration
DATABASE_HOST = os.getenv('DATABASE_HOST')
DATABASE_PORT = int(os.getenv('DATABASE_PORT'))
DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')

# Webhook configuration
WEBHOOK_URL = os.getenv('WEBHOOK_URL')

# Fetch data from the database
def fetch_data():
    uri = f"mongodb://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
    client = MongoClient(uri)
    db = client[DATABASE_NAME]
    collection = db['payments']
    rows = list(collection.find({"status": "pending"}))
    client.close()
    return rows

# Dispatch POST request
def dispatch_post_request(id):
    data = {
        "event": "invoice.status_changed",
        "data": {
            "id": id,
            "status": "paid"
        }
    }
    response = requests.post(WEBHOOK_URL, json=data)
    return response.status_code

def main():
    rows = fetch_data()
    for row in rows:
        # Ignore id caa009cf-3dc2-4bf5-85a3-2e22f4a356a7 to prevent marking the test payment as completed
        if row['_id'] == 'caa009cf-3dc2-4bf5-85a3-2e22f4a356a7':
            continue

        status_code = dispatch_post_request(row['externalPaymentId'])
        print(f"Dispatched webhook for row {row['_id']} | Status Code: {status_code}")

if __name__ == "__main__":
    main()
