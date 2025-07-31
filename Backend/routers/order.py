from fastapi import APIRouter, HTTPException
from database.mongo import db
from datetime import datetime

router = APIRouter()
orders_collection = db["orders"]


@router.get("/orders/{table_id}")
async def get_orders_by_table(table_id: str):
    orders = []
    cursor = orders_collection.find({"table_id": table_id}).sort("timestamp", -1)
    async for order in cursor:
        order["_id"] = str(order["_id"])
        orders.append(order)
    return orders


@router.post("/orders")
async def create_order(order: dict):
    order["timestamp"] = datetime.utcnow()
    order["status"] = "pending"
    order["paid"] = False
    result = await orders_collection.insert_one(order)
    return {"message": "Order created", "order_id": str(result.inserted_id)}
