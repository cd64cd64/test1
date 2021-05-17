namespace SpriteKind {
    export const Mountain = SpriteKind.create()
    export const Goat = SpriteKind.create()
}
function drop_goat () {
    moving_goat.ay = 300
    moving_goat.vx = 0
    moving_goat.setFlag(SpriteFlag.BounceOnWall, false)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    drop_goat()
})
// calculate new center of gravity
function will_the_stack_fall_down_ () {
    mountain_goats = sprites.allOfKind(SpriteKind.Mountain)
    center_of_gravity = 0
    for (let value of mountain_goats) {
        center_of_gravity += value.x
    }
    if (center_of_gravity / mountain_goats.length < bottom_goat.left || center_of_gravity / mountain_goats.length > bottom_goat.right) {
        return true
    }
    return false
}
function will_the_goat_fall_off (falling_goat: Sprite, mountain_goat: Sprite) {
    if (falling_goat.x > mountain_goat.right) {
        falling_goat.setVelocity(50, -50)
        falling_goat.setFlag(SpriteFlag.Ghost, true)
        falling_goat.setFlag(SpriteFlag.AutoDestroy, true)
        info.changeLifeBy(-1)
        return true
    } else if (falling_goat.x < mountain_goat.left) {
        falling_goat.setVelocity(-50, 50)
        falling_goat.setFlag(SpriteFlag.Ghost, true)
        falling_goat.setFlag(SpriteFlag.AutoDestroy, true)
        info.changeLifeBy(-1)
        return true
    } else {
        return false
    }
}
scene.onHitWall(SpriteKind.Goat, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        game.over(false)
    }
})
function explode_goats () {
    current_goat = bottom_goat
    while (current_goat) {
        current_goat.setFlag(SpriteFlag.Ghost, true)
        current_goat.setVelocity(randint(-200, 200), randint(-200, 200))
        current_goat = sprites.readDataSprite(current_goat, "goat on top of me")
        scene.cameraFollowSprite(null)
    }
}
sprites.onOverlap(SpriteKind.Goat, SpriteKind.Mountain, function (sprite, otherSprite) {
    sprite.vy = 0
    sprite.ay = 0
    sprite.setKind(SpriteKind.Mountain)
    goat_fell_off = will_the_goat_fall_off(sprite, otherSprite)
    if (goat_fell_off) {
        sprite.startEffect(effects.fire)
    } else if (will_the_stack_fall_down_()) {
        sprites.setDataSprite(otherSprite, "goat on top of me", sprite)
        explode_goats()
        pause(1000)
        game.over(false)
    } else {
        top_goat = sprite
        scene.cameraFollowSprite(sprite)
        sprites.setDataSprite(otherSprite, "goat on top of me", sprite)
    }
    make_a_new_goat()
})
function make_a_new_goat () {
    moving_goat = sprites.create(goat_species[randint(0, goat_species.length - 1)], SpriteKind.Goat)
    moving_goat.setPosition(80, top_goat.y - 30)
    moving_goat.setFlag(SpriteFlag.BounceOnWall, true)
    moving_goat.vx = 40
}
let goat_fell_off = false
let current_goat: Sprite = null
let center_of_gravity = 0
let mountain_goats: Sprite[] = []
let moving_goat: Sprite = null
let bottom_goat: Sprite = null
let top_goat: Sprite = null
let goat_species: Image[] = []
goat_species = [
img`
    . . . . . . . . . . . . f e e . 
    . . . . . . . . . . . . . e e . 
    . . . . . . . . . . . . d c d c 
    . . . . . . . . . . . . d d d d 
    e d d d d d d d d d d d d a d d 
    . d d d d d d d d d d d d d a a 
    . d d d d d d d d d d d d . . . 
    . d d d d d d d d d d d d . . . 
    . . d d d d d d d d d d . . . . 
    . . . d . d . . d . d . . . . . 
    . . . d . d . . d . d . . . . . 
    . . . e . e . . e . e . . . . . 
    `,
img`
    . . . . f f . . . . . . . . . . . . . 
    . . d f f d f . . . . . . . . . . . . 
    . 4 4 4 4 4 4 4 . . . . . . . . . . . 
    . . 1 4 4 1 . . . . . . . . . . . . . 
    . 4 4 4 4 4 4 . . . . . . . . . . . . 
    . 4 4 4 4 4 4 . . . . . . . . . . . . 
    4 4 4 2 4 4 4 4 4 4 4 4 4 4 4 4 4 . . 
    . 4 2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
    . . 2 . . 4 4 4 4 4 4 4 4 4 4 4 4 4 . 
    . . . . . 4 4 4 4 4 4 4 4 4 4 4 4 4 . 
    . . . . . 4 2 4 2 2 2 2 2 2 2 2 2 . . 
    . . . . . 4 . 4 . . . . . 2 . 4 . . . 
    . . . . . 4 . 4 . . . . . 2 . 4 . . . 
    . . . . . 4 . 4 . . . . . 2 . 4 . . . 
    `,
img`
    . . . . . . . . b b d . . d d b . . . 
    . . . . . . . . b b b b b b b b . . . 
    . . . . . . . . . b b d b b d . . . . 
    . . . . . . . . . . b b b b b c . . . 
    . b . . . . . . . b b b b b b b . . . 
    . b . . . . b b b b b b b b b b . . . 
    . c b b b b b b b b b b . . . . . . . 
    . c b b b b b b b b b b . . . . . . . 
    . . c b b b b b b b b b . . . . . . . 
    . . c c b b b b b b b c . . . . . . . 
    . . c c c c c c c c c c . . . . . . . 
    . . c . b . . . c c c c . . . . . . . 
    . . c . b . . . . b . c . . . . . . . 
    . . c . b . . . . b . c . . . . . . . 
    `,
img`
    . . . . . . . . . . . . e . . e . . . 
    . . . . . . . . . . . e e e e e e . . 
    . . . . . . . . . . e e e e e e e e . 
    . . . . . . . . . e e e e c c c e e e 
    . . . . . . . . . . . . c c b c . . . 
    . . . c c c c c c c c c c f b f c . . 
    . . c c b b b b b b b b b f b f . . . 
    . . c b b b c c c b b b b b b c . . . 
    . c c b b c b b b b b b f b b c . . . 
    c c b b c b b b b b b b b f f f . . . 
    c b b b b b b b b b b b c c c . . . . 
    c c c c c c c c c c c c c . . . . . . 
    . . . . c . c . . . c . c . . . . . . 
    . . . . c . c . . . c . c . . . . . . 
    `,
img`
    . . . 1 . . . . . . . . . . . . . . 
    . . 1 c c c . . . . . . . . . . . . 
    . 1 1 1 1 c c . . . . . . . . . . 1 
    1 1 f 1 c 1 c c . . . . . . . . . 1 
    1 1 1 c 1 1 c c 1 1 1 1 1 1 1 1 1 1 
    1 1 1 c c c c 1 1 1 1 1 1 1 1 1 1 . 
    . . . 1 c c 1 1 1 1 1 1 1 1 1 1 1 . 
    . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
    . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
    . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
    . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
    . . . . 1 . 1 . . . . . . . 1 . 1 . 
    . . . . 1 . 1 . . . . . . . 1 . 1 . 
    . . . . 1 . 1 . . . . . . . 1 . 1 . 
    . . . . 1 . 1 . . . . . . . 1 . 1 . 
    . . . . c . c . . . . . . . c . c . 
    `,
img`
    .........................
    ff.............ff...ff...
    .ff............ffffff....
    ..ff............ff2f2ffff
    ...f............fffffffff
    ...f............ffffff...
    ...ff2f2ffffffffffffff...
    ....f2f22fffffffff.......
    ....f2ff2fffffffff.......
    ....ff22ffffffffff.......
    ....ffffffffffffff.......
    ....fffffffff222ff.......
    ....ffffffff2ff2ff.......
    ....ffffffff22f2ff.......
    ....fffffffff222f........
    .....f...f...f..f........
    .....f...f...f..f........
    .....f...f...f..f........
    `
]
scene.setBackgroundColor(9)
tiles.setTilemap(tilemap`级别2`)
let goat = sprites.create(img`
    . . . . f f . . . . . . . . . . . . . 
    . . d f f d f . . . . . . . . . . . . 
    . 4 4 4 4 4 4 4 . . . . . . . . . . . 
    . . 1 4 4 1 . . . . . . . . . . . . . 
    . 4 4 4 4 4 4 . . . . . . . . . . . . 
    . 4 4 4 4 4 4 . . . . . . . . . . . . 
    4 4 4 2 4 4 4 4 4 4 4 4 4 4 4 4 4 . . 
    . 4 2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
    . . 2 . . 4 4 4 4 4 4 4 4 4 4 4 4 4 . 
    . . . . . 4 4 4 4 4 4 4 4 4 4 4 4 4 . 
    . . . . . 4 2 4 2 2 2 2 2 2 2 2 2 . . 
    . . . . . 4 . 4 . . . . . 2 . 4 . . . 
    . . . . . 4 . 4 . . . . . 2 . 4 . . . 
    . . . . . 4 . 4 . . . . . 2 . 4 . . . 
    `, SpriteKind.Mountain)
goat.ay = 300
goat.setPosition(80, 600)
scene.cameraFollowSprite(goat)
top_goat = goat
make_a_new_goat()
let how_much_does_a_goat_weigh = 22
info.setLife(3)
bottom_goat = goat
