let point: number = 0;
let fail: number = 0;
let shooting: boolean = false;

class Point {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        led.plot(this.x, this.y)
    }
    step() {
        // ez maradjon üresen, csak az örökléshez kell
        // mert ezt időzítve hívja meg a főprogram
    }
    move(x: number, y: number) {
        // ezt nem érdemes felülírni
        led.unplot(this.x, this.y)
        this.x += x
        this.y += y
        led.plot(this.x, this.y)
    }
}

class Ship extends Point {
    target: Target
    bullet: Bullet
    constructor(trgt: Target) {
        super(2, 4)
    }
    step() {
        led.plot(this.x, this.y)
        if (shooting) this.bullet.step()
    }
    shoot() {
        this.bullet = new Bullet(this.x, this.target)
        shooting = true
    }
}

class Bullet extends Point {
    target: Target
    constructor(x: number, trgt: Target) {
        super(x, 4)
        this.target = trgt
    }
    step() {
        this.move(0, -1)
        if (this.y == 0) this.score()
    }
    score() {
        if (target.x == this.x) {
            point += 1
            basic.clearScreen()
            basic.showLeds(`
            . . . . .
            . . . . #
            . . . # .
            # . # . .
            . # . . .
            `)
        } else {
            fail += 1;
            basic.clearScreen()
            basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
        }
        basic.pause(500)
        target.reset()
        shooting = false
        basic.clearScreen()
    }
}

class Target extends Point {
    direction: number
    constructor() {
        super(randint(0, 4), 0)
        this.direction = randint(0, 1)
        if (this.direction == 0) this.direction = -1
    }
    step() {
        this.move(this.direction, 0)
        if (this.x == 4) this.direction = -1
        if (this.x == 0) this.direction = 1
    }
    reset() {
        led.unplot(this.x, this.y)
        this.x = randint(0, 4)
        if (this.x == 4) this.direction = -1
        if (this.x == 0) this.direction = 1
        led.plot(this.x, this.y)
    }
}

let target = new Target();
let ship = new Ship(target);

let elements: Point[] = []
elements[0] = ship
elements[1] = target

// ez a főprogram, gyakorlatilag az időzítő is egyben
basic.forever(function () {
    for (let i = 0; i < elements.length; i++) {
        elements[i].step()
    }
    basic.pause(300)
})

input.onButtonPressed(Button.A, function () {
    if (ship.x != 0) {
        ship.move(-1, 0);
    }
})
input.onButtonPressed(Button.B, function () {
    if (ship.x != 4) {
        ship.move(1, 0);
    }
})
input.onButtonPressed(Button.AB, function () {
    ship.shoot();
})
