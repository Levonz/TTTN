import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def seed_menus():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["restaurant"]
    menu_collection = db["menus"]

    await menu_collection.delete_many({})  # Xoá cũ nếu có

    menus = [
        {
            "name": "Cơm gà",
            "price": 45000,
            "category": "main",
            "image": "https://ibb.co/qL4ywRPD"
        },
        {
            "name": "Bò lúc lắc",
            "price": 60000,
            "category": "main",
            "image": "https://ibb.co/gF7TWjDZ"
        },
        {
            "name": "Gà chiên mắm",
            "price": 50000,
            "category": "main",
            "image": "https://ibb.co/Z18796d3"
        },
        {
            "name": "Coca Cola",
            "price": 15000,
            "category": "drink",
            "image": "https://ibb.co/qYgjRh6S"
        },
        {
            "name": "Trà đào",
            "price": 20000,
            "category": "drink",
            "image": "https://ibb.co/5gG5jxsR"
        },
        {
            "name": "Bánh flan",
            "price": 10000,
            "category": "dessert",
            "image": "https://ibb.co/1YskNVPG"
        },
        {
            "name": "Chè khúc bạch",
            "price": 25000,
            "category": "dessert",
            "image": "https://ibb.co/1GGtnkdv"
        },
    ]

    await menu_collection.insert_many(menus)
    print("Đã seed menu có ảnh vào MongoDB!")

asyncio.run(seed_menus())







