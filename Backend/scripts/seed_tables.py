import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def seed():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["restaurant"]
    tables = db["tables"]

    await tables.delete_many({})  # Xoá cũ nếu có

    data = []

    # 20 bàn 4 người
    for i in range(1, 21):
        data.append({"label": f"Bàn {i}", "capacity": 4, "status": "empty"})

    # 10 bàn 6 người
    for i in range(21, 31):
        data.append({"label": f"Bàn {i}", "capacity": 6, "status": "empty"})

    await tables.insert_many(data)
    print("Seeding started...")
    print(data) 
    print("✅ Đã seed 30 bàn vào MongoDB!")

asyncio.run(seed())
