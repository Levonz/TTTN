from fastapi import APIRouter
from models.table_model import Table
from database.mongo import table_collection
from bson import ObjectId

router = APIRouter()

def convert_table(table) -> dict:
    return {
        "id": str(table["_id"]),
        "label": table["label"],
        "capacity": table["capacity"],
        "status": table["status"]
    }

@router.get("/tables", response_model=list[Table])
async def get_tables():
    tables_cursor = table_collection.find()
    tables = []
    async for table in tables_cursor:
        tables.append(convert_table(table))
    return tables
