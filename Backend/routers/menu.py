from fastapi import APIRouter
from models.menu_model import Menu
from database.mongo import menu_collection
from bson import ObjectId

router = APIRouter()


def convert_menu(menu) -> dict:
    return {
        "id": str(menu["_id"]),
        "name": menu["name"],
        "type": menu["type"],
        "category": menu["category"],
        "price": menu["price"],
        "image": menu.get("image", None),
    }


@router.get("/menus", response_model=list[Menu])
async def get_menus():
    cursor = menu_collection.find()
    result = []
    async for menu in cursor:
        result.append(convert_menu(menu))
    return result
