from fastapi import APIRouter, HTTPException, Body
from database.mongo import menu_collection
from bson import ObjectId

router = APIRouter()


@router.get("/menus")
async def get_menus():
    menus = []
    async for menu in menu_collection.find({}):
        menus.append(
            {
                "id": str(menu.get("_id", "")),
                "name": menu.get("name", ""),
                "category": menu.get("category", ""),
                "price": menu.get("price", 0),
                "image": menu.get("image", None),
            }
        )
    return menus


@router.post("/menus")
async def create_menu(menu: dict = Body(...)):
    new_menu = {
        "name": menu.get("name", ""),
        "category": menu.get("category", ""),
        "price": menu.get("price", 0),
        "image": menu.get("image", None),
    }
    result = await menu_collection.insert_one(new_menu)
    return {"id": str(result.inserted_id)}


@router.put("/menus/{menu_id}")
async def update_menu(menu_id: str, menu: dict = Body(...)):
    updated_menu = {
        "name": menu.get("name", ""),
        "category": menu.get("category", ""),
        "price": menu.get("price", 0),
        "image": menu.get("image", None),
    }
    result = await menu_collection.update_one(
        {"_id": ObjectId(menu_id)}, {"$set": updated_menu}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy món ăn")
    return {"msg": "Cập nhật thành công"}


@router.delete("/menus/{menu_id}")
async def delete_menu(menu_id: str):
    result = await menu_collection.delete_one({"_id": ObjectId(menu_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy món ăn")
    return {"msg": "Đã xóa thành công"}
