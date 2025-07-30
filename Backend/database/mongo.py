import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()
print("🔗 Mongo URI:", os.getenv("MONGO_URI")) 

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)

db = client["restaurant"]
table_collection = db["tables"]

menu_collection = db["menus"]
reservation_collection = db["reservations"]
