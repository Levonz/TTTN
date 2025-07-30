from fastapi import APIRouter
from database.mongo import menu_collection

router = APIRouter()

@router.get("/menus")
async def get_menus():
    menus = []
    async for menu in menu_collection.find({}):
        menus.append({
            "id": str(menu.get("_id", "")),
            "name": menu.get("name", ""),
            "type": menu.get("type", ""),
            "category": menu.get("category", ""),
            "price": menu.get("price", 0),
            "image": menu.get("image", None),
        })
    return menus
