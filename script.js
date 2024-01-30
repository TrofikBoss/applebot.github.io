let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

class Game {
    constructor() {
        this.offsetY = 0;
        this.offsetX = 0;
        this.gamerun = true;
        this.displaywidth = 1280;
        this.displayheight = 720;
    }
}

class Entity {
    constructor(type, posx, posy) {
        this.type = type;
        this.posx = posx;
        this.posy = posy;
        this.moveup = 0;
        this.onGround = false;
        if (type == "player") {
            this.sizex = 80;
            this.sizey = 80;
            this.pressleft = false;
            this.pressright = false;
        }
    }
    update() {
        this.onGround = false;
        this.blockleft = false;
        this.blockright = false;
        this.blocktop = false;
        for (let y in map1) {
            for (let x in map1[y]) {
                if (map1[y][x] == 1) {
                    let inx = (this.posx + this.sizex > x * 50) && (this.posx < x * 50 + 50);
                    let inx2 = (this.posx + this.sizex > x * 50 - 1) && (this.posx < x * 50 + 50 + 1);
                    let ony = (this.posy + this.sizey > y * 50 - 5) && (this.posy + this.sizey < y * 50 + 10)
                    let iny = (this.posy + this.sizey > y * 50) && (this.posy < y * 50 + 50);
                    let undery = (this.posy > y * 50 + 50 - 10) && (this.posy < y * 50 + 50 + 1) && inx;
                    if (!undery && (inx && ony) && this.moveup >= 0) {
                        this.posy = y * 50 - this.sizey - 0;
                        this.moveup = 0;
                        this.onGround = true;
                    }
                    if (!undery && !(inx && ony) && inx2 && iny) {
                        let xmove = (this.posx + this.sizex / 2) < (x * 50 + 25);
                        if (xmove == true) {
                            this.posx = x * 50 - this.sizex;
                            this.blockright = true;
                        }
                        if (xmove == false) {
                            this.posx = x * 50 + 50;
                            this.blockleft = true;
                        }
                    }
                    if (undery && this.moveup <= 0) {
                        this.moveup = 0;
                        this.blocktop = true;
                    }
                }
            }
        }
        if (this.type == "player") {
            if (!this.blockleft && this.pressleft) {
                this.posx -= 10;
            }
            if (!this.blockright && this.pressright) {
                this.posx += 10;
            }
            if (this.onGround && this.pressup && !this.blocktop) {
                this.moveup -= 15;
                this.onGround = false;
            }
        }
        if (!this.onGround) {
            if (this.moveup < 14) {
                this.moveup += 0.8;
            }
        } else {
            this.moveup = 0;
        }
        this.posy += this.moveup;
    }
}

let player = new Entity("player", 100, 100);
let entities = [player];
let game = new Game();
let map1;
let playerimg = new Image();
playerimg.src = "textures/entity/apple.png";

function draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1280, 720);
    ctx.fill();
    drawMap();
    ctx.fillStyle = "#00000029";
    ctx.fillRect(player.posx + game.offsetX, player.posy + game.offsetY, player.sizex, player.sizey);
    ctx.drawImage(playerimg, player.posx + game.offsetX - 10, player.posy + game.offsetY - 10, player.sizex + 20, player.sizey + 20);
    ctx.fill();
}
draw();

function drawMap() {
    map1 = getLevel(1);
    //let ymin = map1.length;
    for(let y in map1) {
        for (let x in map1[y]) {
            if (map1[y][x] == 1) {
                ctx.fillStyle = "green";
                ctx.fillRect(x * 50 + game.offsetX, y * 50 + game.offsetY, 50, 50);
                ctx.fill();
            }
        }
    }
}

function update() {
    draw();
    for (let x in entities) {
        entities[x].update();
    }
    game.offsetX = 640 - player.posx - (player.sizex / 2);
    game.offsetY = 360 - player.posy - (player.sizey / 2);
    if (game.offsetX >= 0) {
        game.offsetX = 0;
    } else if (game.offsetX + (map1[0].length * 50) - game.displaywidth <= 0) {
        game.offsetX = game.displaywidth - (map1[0].length * 50);
    }
    if (game.offsetY + (map1.length * 50) - game.displayheight <= 0) {
        game.offsetY = game.displayheight - (map1.length * 50);
    }
}

function setup() {
    setInterval(update, 35);
}

setup()

function genMap(type) {
    let result = [];
    if (type == 1) {
        for(let y = 0; y < 10; y++) {
            let resy = [];
            if (y == 8) {
                resy = [0, 0, 0, 1, 0, 0, 0, 1, 0]
            }
            for(let x = 0; x < 30; x++) {
                if (y < 8) {
                    resy.push(0);
                }
                if (y == 9) {
                    resy.push(1);
                }
            }
            result.push(resy);
        }
    }
    if (type == 2) {
        result = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
    }
    return result;
}

function getLevel(x) {
    let result1;
    if (x == 1) {
        result1 = genMap(2);
    }
    return result1;
}

document.addEventListener("keydown", (ev) => {
    if (ev.code == "ArrowLeft") {
        player.pressleft = true;
    }
    if (ev.code == "ArrowRight") {
        player.pressright = true;
    }
    if (ev.code == "ArrowUp") {
        player.pressup = true;
    }
})
document.addEventListener("keyup", (ev) => {
    if (ev.code == "ArrowLeft") {
        player.pressleft = false;
    }
    if (ev.code == "ArrowRight") {
        player.pressright = false;
    }
    if (ev.code == "ArrowUp") {
        player.pressup = false;
    }
})