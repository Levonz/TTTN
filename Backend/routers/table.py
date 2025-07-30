from fastapi import APIRouter, HTTPException
from models.table_model import Table
from models.reserve_model import ReservationRequest
from database.mongo import table_collection
from bson import ObjectId

router = APIRouter()


def convert_table(table) -> dict:
    return {
        "id": str(table["_id"]),
        "label": table["label"],
        "capacity": table["capacity"],
        "status": table["status"],
    }


@router.get("/tables", response_model=list[Table])
async def get_tables():
    tables_cursor = table_collection.find()
    tables = []
    async for table in tables_cursor:
        tables.append(convert_table(table))
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
