from fastapi import APIRouter, HTTPException
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
                "status": table.get("status", ""),
            }
        )
    return tables


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
        {"_id": ObjectId(table_id)},
        {"$set": {"status": "empty"}}
    )
    return {"message": "Bàn đã được hủy thành công"}