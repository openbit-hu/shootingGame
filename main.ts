let point: number = 0;
let fail: number = 0;
let resulting: number = 0;
class Element {
    x: number
    y: number
    constructor(x: number, y: number){
        this.x=x
        this.y=y
        led.plot(this.x,this.y)
    }
    move(x:number,y:number){
        led.unplot(this.x,this.y)
        this.x += x
        this.y += y
        led.plot(this.x, this.y)
    }
    run(){}
}
class Ship extends Element{
    target: Target
    bullet: Bullet
    constructor(trgt:Target) {
        super(2,4)
    }
    shoot(){
        this.bullet=new Bullet(this.x, this.target);
    }
    run(){
        if(this.bullet)this.bullet.run()
    }
}

class Target extends Element{
    constructor() {
        super(0,4)
    }
    targetForever() {
        while (fail != 3) {
            basic.clearScreen();
            resulting = 1;
            this.x = randint(0, 4);
            led.plot(this.x, 0);
            while (resulting == 1) {
                basic.pause(1000);
            }
        }
        basic.showNumber(point);
    }
}
class Bullet extends Element{
    target: Target
    constructor(x:number, trgt: Target) {
        super(x,0)
        this.target = trgt
        this.run()
    }
    run() {
        this.move(0,-1)
        if(this.y==0)this.resulting()
    }
    resulting() {
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
        basic.pause(100);
        resulting = 0;
    }
}
let target = new Target();
let ship = new Ship(target);

let elements:Element[]=[]
elements[0]=target
elements[1]=ship

basic.forever(function () {
    for(let i=0;i<elements.length;i++){
        elements[i].run()
    }
    basic.pause(200)
})

input.onButtonPressed(Button.A, function () {
    if (ship.x != 0) {
        ship.move(-1,0);
    }
})
input.onButtonPressed(Button.B, function () {
    if (ship.x != 4) {
        ship.move(1,0);
    }
})
input.onButtonPressed(Button.AB, function () {
    ship.shoot();
})
