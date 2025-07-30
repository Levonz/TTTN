from fastapi import APIRouter, HTTPException
from database.mongo import db
from bson import ObjectId
from datetime import datetime

router = APIRouter()
orders_collection = db["orders"]
invoices_collection = db["invoices"]
tables_collection = db["tables"]

@router.post("/invoices/{table_id}")
async def create_invoice(table_id: str):
    unpaid_orders = []
    total = 0

    async for order in orders_collection.find({"table_id": table_id, "paid": False}):
        for item in order.get("items", []):
            total += item["price"] * item["quantity"]
            unpaid_orders.append(item)

    if not unpaid_orders:
        raise HTTPException(status_code=400, detail="Không có món nào chưa thanh toán.")

    table = await tables_collection.find_one({"_id": ObjectId(table_id)})
    if not table:
        raise HTTPException(status_code=404, detail="Không tìm thấy bàn.")

    invoice = {
        "table_id": table_id,
        "table_label": table.get("label", ""),
        "items": unpaid_orders,
        "total": total,
        "created_at": datetime.utcnow(),
        "payment_method": "cash",  # bạn có thể cho chọn sau
    }

    await invoices_collection.insert_one(invoice)

    await orders_collection.update_many(
        {"table_id": table_id, "paid": False},
        {"$set": {"paid": True}}
    )
    await tables_collection.update_one(
        {"_id": ObjectId(table_id)},
        {"$set": {"status": "empty"}}
    )

    return {"message": "Hóa đơn đã được tạo và bàn đã trả", "total": total}
