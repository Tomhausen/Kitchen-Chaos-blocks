namespace SpriteKind {
    export const icon = SpriteKind.create()
    export const recipe_items = SpriteKind.create()
    export const plate = SpriteKind.create()
    export const belt = SpriteKind.create()
}
function not_carrying_item () {
    ingredients_close = spriteutils.getSpritesWithin(SpriteKind.Food, 24, cook)
    icon_close = spriteutils.getSpritesWithin(SpriteKind.icon, 24, cook)
    if (ingredients_close.length > 0) {
        item_carrying = ingredients_close[0]
    } else if (icon_close.length > 0) {
        get_new_item(icon_close[0])
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (item_carrying) {
        carrying_item()
    } else {
        not_carrying_item()
    }
})
function get_new_item (crate: Sprite) {
    item_carrying = sprites.create(crate.image, SpriteKind.Food)
    ingredient = sprites.readDataString(crate, "ingredient")
    sprites.setDataString(item_carrying, "ingredient", ingredient)
    item_carrying.z = 5
    item_carrying.scale = 0.75
}
function display_order () {
    sprites.destroyAllSpritesOfKind(SpriteKind.recipe_items)
    i = 16
    for (let value of recipe) {
        recipe_item = sprites.create(images.getImage(value), SpriteKind.recipe_items)
        recipe_item.setPosition(i, 20)
        i += 16
    }
}
function add_ingredient () {
    item = sprites.readDataString(item_carrying, "ingredient")
    recipe.removeAt(recipe.indexOf(item))
    info.changeScoreBy(100)
    item_carrying.destroy()
    item_carrying = spriteutils.nullConsts(spriteutils.NullConsts.Null)
    display_order()
    if (recipe.length < 1) {
        plate_sprite = sprites.allOfKind(SpriteKind.plate)[0]
        plate_sprite.setImage(assets.image`meal`)
        item_carrying = plate_sprite
    }
}
function setup () {
    tiles.setCurrentTilemap(tilemap`kitchen`)
    for (let i = 0; i <= ingredients.length - 1; i++) {
        icon_sprite = sprites.create(images.getImage(ingredients[i]), SpriteKind.icon)
        sprites.setDataString(icon_sprite, "ingredient", ingredients[i])
        tiles.placeOnTile(icon_sprite, tiles.getTilesByType(assets.tile`crate`)[i])
    }
    for (let tile of tiles.getTilesByType(assets.tile`conveyor spawn`)) {
        conveyor_belt = sprites.create(image.create(16, 16), SpriteKind.belt)
        tiles.placeOnTile(conveyor_belt, tile)
        animation.runImageAnimation(
        conveyor_belt,
        assets.animation`conveyor belt`,
        200,
        true
        )
    }
}
function carrying_item () {
    belt_close = spriteutils.getSpritesWithin(SpriteKind.belt, 24, cook)
    plates_close = spriteutils.getSpritesWithin(SpriteKind.plate, 24, cook)
    if (item_carrying.kind() == SpriteKind.plate && belt_close.length > 0) {
        info.changeScoreBy(500)
        item_carrying.destroy()
        create_order()
    } else if (plates_close.length > 0) {
        ingredient = sprites.readDataString(item_carrying, "ingredient")
        if (recipe.indexOf(ingredient) != -1) {
            add_ingredient()
        }
    } else {
        item_carrying.z = -1
        item_carrying = spriteutils.nullConsts(spriteutils.NullConsts.Null)
    }
}
function create_order () {
    recipe = [ingredients[0], ingredients[1]]
    if (randint(1, 2) == 1) {
        recipe.push(ingredients[2])
    }
    if (randint(1, 2) == 1) {
        recipe.push(ingredients[3])
    }
    plate_sprite = sprites.create(assets.image`plate`, SpriteKind.plate)
    plate_sprite.scale = 1 / 3
    tiles.placeOnRandomTile(plate_sprite, assets.tile`counter`)
    display_order()
}
let plates_close: Sprite[] = []
let belt_close: Sprite[] = []
let conveyor_belt: Sprite = null
let icon_sprite: Sprite = null
let plate_sprite: Sprite = null
let item = ""
let recipe_item: Sprite = null
let i = 0
let ingredient = ""
let item_carrying: Sprite = null
let icon_close: Sprite[] = []
let ingredients_close: Sprite[] = []
let recipe: string[] = []
let ingredients: string[] = []
let cook: Sprite = null
cook = sprites.create(assets.image`cook`, SpriteKind.Player)
controller.moveSprite(cook)
scene.centerCameraAt(80, 68)
info.startCountdown(60)
ingredients = [
"meat",
"bread",
"lettuce",
"tomato"
]
recipe = []
setup()
create_order()
game.onUpdate(function () {
    if (item_carrying) {
        item_carrying.setPosition(cook.x, cook.y + 6)
        item_carrying.z = 5
    }
})
