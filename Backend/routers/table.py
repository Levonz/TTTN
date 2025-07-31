from fastapi import APIRouter, HTTPException, Body
from database.mongo import table_collection
from bson import ObjectId

router = APIRouter()


@router.get("/tables")
async def get_tables():
    tables = []
    async for table in table_collection.find():
        tables.append(
            {
                "id": str(table.get("_id", "")),
                "label": table.get("label", ""),
                "capacity": table.get("capacity", 0),
                "status": table.get("status", ""),  # empty, reserved, serving...
            }
        )
    return tables


@router.post("/tables")
async def create_table(data: dict = Body(...)):
    new_table = {
        "label": data.get("label", ""),
        "capacity": int(data.get("capacity", 0)),  # Ép về int
        "status": data.get("status", "empty"),
    }
    result = await table_collection.insert_one(new_table)
    return {"id": str(result.inserted_id)}


@router.put("/tables/{table_id}")
async def update_table(table_id: str, data: dict = Body(...)):
    updated = {
        "label": data.get("label", ""),
        "capacity": int(data.get("capacity", 0)),  # Ép về int
        "status": data.get("status", "empty"),
    }
    result = await table_collection.update_one(
        {"_id": ObjectId(table_id)}, {"$set": updated}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy bàn ăn")
    return {"msg": "Cập nhật thành công"}


@router.delete("/tables/{table_id}")
async def delete_table(table_id: str):
    result = await table_collection.delete_one({"_id": ObjectId(table_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy bàn ăn")
    return {"msg": "Đã xóa thành công"}


# Đặt/hủy bàn giữ nguyên như code của bạn
@router.post("/tables/{table_id}/reserve")
async def reserve_table(table_id: str):
    table = await table_collection.find_one({"_id": ObjectId(table_id)})
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    if table.get("status") == "reserved":
        raise HTTPException(status_code=400, detail="Table is already reserved")
    await table_collection.update_one(
        {"_id": ObjectId(table_id)}, {"$set": {"status": "reserved"}}
    )
    return {"message": "Bàn đã được đặt thành công!"}


@router.post("/tables/{table_id}/cancel")
async def cancel_table(table_id: str):
    table = await table_collection.find_one({"_id": ObjectId(table_id)})
    if not table:
        raise HTTPException(status_code=404, detail="Không tìm thấy bàn.")
    await table_collection.update_one(
        {"_id": ObjectId(table_id)}, {"$set": {"status": "empty"}}
    )
    return {"message": "Bàn đã được hủy thành công"}
