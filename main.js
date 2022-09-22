const canvas = document.getElementById('mycanvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext('2d');
var img = document.getElementById("sadi-evren-seker");
var playerimg = document.getElementById("sans");
let objeler = [];

class Controls {
    constructor() {
        this.ust = false;
        this.alt = false;
        this.sol = false;
        this.sag = false;
        this.#addKeyboardListeners();
    }
    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "w":
                    this.ust = true;
                    break;
                case "s":
                    this.alt = true;
                    break;
                case "a":
                    this.sol = true;
                    break;
                case "d":
                    this.sag = true;
                    break;
            }
        }
        document.onkeyup = (event) => {
            switch (event.key) {
                case "w":
                    this.ust = false;
                    break;
                case "s":
                    this.alt = false;
                    break;
                case "a":
                    this.sol = false;
                    break;
                case "d":
                    this.sag = false;
                    break;
            }
        }
    }



}
class Player {
    constructor(hiz, asset, num, gravity, ziplama, ziplamasuresi, ...points) {
        this.ziplamasuresi = ziplamasuresi;
        this.hiz = hiz;
        if (typeof (asset) == "string") {
            this.asset = document.getElementById(asset ? asset.split(".")[0] : 0)
        } else {
            this.asset = [];
            for (let i = 0; i < asset.length; i++) {
                this.asset.push(document.getElementById(asset[i] ? asset[i].split(".")[0] : 0));
            }
            if (this.asset.length == 0) {
                this.asset = undefined;
            }
        }
        this.num = num;
        this.gravity = 0;
        this.gravityamount = gravity / 100;
        this.kalicigravity = ziplama * 100;
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        for (let p of points) {
            p.x += window.innerWidth;
            p.y += window.innerHeight;
        }
        this.points = points;
        this.controls = new Controls();
        this.onfloor = false;
        this.gravityon = true;
        this.gravitycounter = this.kalicigravity;
        this.stabilX = window.innerWidth / 2;
        this.stabilY = window.innerHeight / 2;
    }

    update() {

        this.onfloor = false;
        if (this.gravityon) {
            this.gravity += this.gravityamount;
            this.y += this.gravity;
            for (let i = 0; i < this.points.length; i++) {
                this.points[i].y += this.gravity;
            }
            while (this.#physics()) {
                this.onfloor = true;
                this.y -= this.gravity;
                for (let i = 0; i < this.points.length; i++) {
                    this.points[i].y -= this.gravity;
                }
                this.gravity = 0;
            }
        }
        if (this.controls.ust) {
            if (this.onfloor && this.gravitycounter == this.kalicigravity) {
                this.gravitycounter = 0;
                this.gravityon = false;
                let temp;
                let carpisti = false;
                for (let k = this.ziplamasuresi + 100; k < this.kalicigravity + this.ziplamasuresi + 100; k++) {
                    setTimeout(() => {
                        if (!carpisti) {
                            this.y -= this.kalicigravity / k / 10;
                            for (let i = 0; i < this.points.length; i++) {
                                this.points[i].y -= this.kalicigravity / k / 10;
                            }
                            if (this.#physics()) {
                                carpisti = true;
                                this.gravityon = true;
                                this.y += this.kalicigravity / k / 10;
                                for (let i = 0; i < this.points.length; i++) {
                                    this.points[i].y += this.kalicigravity / k / 10;
                                }
                            }
                        }
                    }, k * this.ziplamasuresi / 10)
                    this.gravitycounter++;
                    temp = k;

                }
                setTimeout(() => {
                    this.gravityon = true;
                }, temp * this.ziplamasuresi / 10)
            }
        }
        if (this.controls.alt) {
            this.y += 1;
            for (let i = 0; i < this.points.length; i++) {
                this.points[i].y += 1;
            }
            if (this.#physics()) {
                this.y -= 1;
                for (let i = 0; i < this.points.length; i++) {
                    this.points[i].y -= 1;
                }
            }
        }
        if (this.controls.sol) {
            this.x -= this.hiz;
            for (let i = 0; i < this.points.length; i++) {
                this.points[i].x -= this.hiz;
            }
            while (this.#physics()) {
                this.x += 1;
                for (let i = 0; i < this.points.length; i++) {
                    this.points[i].x += 1;
                }
            }
        }
        if (this.controls.sag) {
            this.x += this.hiz;
            for (let i = 0; i < this.points.length; i++) {
                this.points[i].x += this.hiz;
            }
            while (this.#physics()) {
                this.x -= 1;
                for (let i = 0; i < this.points.length; i++) {
                    this.points[i].x -= 1;
                }
            }
        }
        if (this.asset) {
            ctx.drawImage(this.asset, this.x - player.x + this.stabilX - 100, this.y - player.y + this.stabilY - 100, 200, 200);
        }
    }

    draw(ctx) {
        if (!this.asset) {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 0; i < this.points.length; i++) {
                ctx.lineTo(this.points[(i + 1) % this.points.length].x, this.points[(i + 1) % this.points.length].y);
            }
            ctx.fill();
        }
    }

    #physics() {
        for (let i = 0; i < objeler.length; i++) {
            if (i != this.num && polysIntersect(objeler[i].points, this.points)) {
                return true;
            }
        }
        return false;
    }
}

class Cordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class EObject {
    constructor(karisik, x, y, asset, num, gravity, ...points) {
        if (typeof (asset) == "string") {
            this.asset = document.getElementById(asset ? asset.split(".")[0] : 0)
        } else {
            this.asset = [];
            for (let i = 0; i < asset.length; i++) {
                this.asset.push(document.getElementById(asset[i] ? asset[i].split(".")[0] : 0));
            }
            if (this.asset.length == 0) {
                this.asset = undefined;
            }
        }
        this.num = num;
        this.ww = window.innerHeight;
        this.wh = window.innerWidth;
        this.gravity = 0;
        this.gravityamount = gravity / 100;
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.stabilX = this.x;
        this.stabilY = this.y;
        for (let p of points) {
            p.x += this.x;
            p.y += this.y;
        }
        if (karisik) {
            this.x = x;
            this.y = y;
        }
        this.points = points;
        this.render();
        this.makeasset();
    }
    makeasset() { }
    update() {
        this.onfloor = false;
        if (this.gravityamount != 0) {
            this.gravity += this.gravityamount;
            this.y += this.gravity;
            for (let i = 0; i < this.points.length; i++) {
                this.points[i].y += this.gravity;
            }
            if (this.physics()) {
                this.onfloor = true;
                this.y -= this.gravity;
                for (let i = 0; i < this.points.length; i++) {
                    this.points[i].y -= this.gravity;
                }
                this.gravity = 0;
            }
        }
        this.makeasset();
    }
    render() {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 0; i < this.points.length; i++) {
            ctx.lineTo(this.points[(i + 1) % this.points.length].x, this.points[(i + 1) % this.points.length].y);
        }
        ctx.fill();
    }

    physics() {
        for (let i = 0; i < objeler.length; i++) {
            if (i != this.num && polysIntersect(objeler[i].points, this.points)) {
                return true;
            }
        }
        return false;
    }
}





let tempharita = [];
for (let i = 0; i < harita.length; i++) {
    tempharita.push({ "x": harita[i][0], "y": harita[i][1] })
}
const player = new Player(5, "sans.png", 0, 20, 10, 2, { "x": -100, "y": -100 }, { "x": 100, "y": -100 }, { "x": 100, "y": 100 }, { "x": -100, "y": 100 });






let wall1 = new EObject(false, undefined, undefined, ["grass.jpg", "dirt.jpg"], 1, 0, ...tempharita);




wall1.makeasset = function () {
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x < player.x + this.stabilX * 2 && this.points[i].x > player.x - this.stabilX * 2) {
            ctx.drawImage(this.asset[0], this.points[i].x - player.x, this.points[i].y - player.y, 100, 100);
            for (let j = 100; j < this.points[i].y / 2; j += 100) {
                ctx.drawImage(this.asset[1], this.points[i].x - player.x, this.points[i].y - player.y + j, 100, 100);
            }
        }
        else {
        }
    }
}

wall1.render = function () {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    let ilk = true;
    let tempx;
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].x < player.x + this.stabilX * 2 && this.points[i].x > player.x - this.stabilX * 2) {
            if (ilk) {
                tempx = this.points[i].x;
                ilk = false;
                ctx.moveTo(this.points[i].x, this.points[i].y);
            }
            ctx.lineTo(this.points[(i + 1) % this.points.length].x, this.points[(i + 1) % this.points.length].y);
        }
        else {
        }
    }
    ctx.lineTo(i, 10000);
    ctx.lineTo(tempx, 10000)
    ctx.fill();
}







let wall2 = new EObject(false, undefined, undefined, "sadi-evren-seker.jpg", 2, 1, { "x": 900, "y": -100 }, { "x": 1400, "y": -100 }, { "x": 1400, "y": 300 }, { "x": 900, "y": 300 });
wall2.makeasset = function () {
    if (this.asset) {
        ctx.drawImage(this.asset, this.x - player.x + 900, this.y - player.y - 100, 500, 400);
    }
}



bot1 = new EObject(true,-900,0,"aras.png",3,3,{ "x": -1000, "y": -100 }, { "x": -800, "y": -100 }, { "x": -800, "y": 100 }, { "x": -1000, "y": 100 });
bot1.bot = true;
bot1.makeasset = function () {
    if (this.asset) {
        ctx.drawImage(this.asset, this.x - player.x + this.stabilX - 100, this.y - player.y + this.stabilY - 100, 200, 200);
    }
}
bot1.oynabot = function () {
    let ans = this.x-player.x;
    //if(Math.abs(ans)<1000){
        let deg = player.hiz/2;
        if(ans>0){
            this.x-=deg;
            for(let p of this.points){
                p.x-=deg;
            }
        }
        if(ans<0){
            this.x+=deg;
            for(let p of this.points){
                p.x+=deg;
            }
        }
    //}
    while(this.physics()){
        this.y-=1;
        for(let p of this.points){
            p.y-=1;
        }
    }
}
let durum = true;
objeler.push(player);
objeler.push(wall1);
objeler.push(wall2);
objeler.push(bot1)





animate();
function animate() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    ctx.save();
    player.update();
    guncelle(objeler);
    ctx.translate(-player.x, -player.y);
    player.draw(ctx);
    ciz(objeler);
    requestAnimationFrame(animate);
}
function guncelle(obj) {
    for (let obje of obj) {
        if (obje.num != 0) {
            obje.update();
        }
    }
}
function ciz(obj) {
    for (let obje of obj) {
        if (obje.num != 0) {
            if (!obje.asset) {
                    obje.render();
            }
            if(obje.bot){
                obje.oynabot();
            }
        }
    }
}
let currentTexture = "wood.png";
let currentGravity = 0;
var p = 4;
document.addEventListener('mousedown', (e) => {
    e = e || window.event;
    let leftclick = false;
    if ("buttons" in e) {
        leftclick = e.buttons == 1;
    }
    if (leftclick) {
        if(durum){
            var canvasX = Math.round(e.clientX + player.x - window.innerWidth / 2);
        var canvasY = Math.round(e.clientY + player.y - window.innerHeight / 2);
        let u = [{ "x": canvasX - 50, "y": canvasY - 50 }, { "x": canvasX + 50, "y": canvasY - 50 }, { "x": canvasX + 50, "y": canvasY + 50 }, { "x": canvasX - 50, "y": canvasY + 50 }]
        let rect = new EObject(true, canvasX, canvasY, currentTexture, p, currentGravity, ...u);
        rect.makeasset = function () {
            if (this.asset) {
                ctx.drawImage(this.asset, this.x - player.x + this.stabilX - 50, this.y - player.y + this.stabilY - 50, 100, 100);
            }
        }
        let legalmi = true;
        for(let obje of objeler) {
            if (polysIntersect(obje.points, rect.points)) {
                legalmi = false;
            }
        }
        if (legalmi) {
            p++;
            objeler.push(rect);
        }
        }
        else {
            var canvasX = Math.round(e.clientX + player.x - window.innerWidth / 2);
            var canvasY = Math.round(e.clientY + player.y - window.innerHeight / 2);
            let u = [{ "x": canvasX - 50, "y": canvasY - 50 }, { "x": canvasX + 50, "y": canvasY - 50 }, { "x": canvasX + 50, "y": canvasY + 50 }, { "x": canvasX - 50, "y": canvasY + 50 }]
            let rect = new EObject(true, canvasX, canvasY, currentTexture, p, currentGravity, ...u);
            for(let i=0;i<objeler.length;i++) {
                if (!objeler[i].bot&&objeler[i].num!=1&&objeler[i].num!=0&&polysIntersect(objeler[i].points, rect.points)) {
                    objeler.splice(i,1);
                    for(let j=i;j<objeler.length; j++){
                        objeler[j].num-=1;
                    }
                    p-=1;
                    break;
                }
            }
        }
    }
})

document.addEventListener("keypress", function (event) {
    if(event.key=='q'){
        durum = !durum;
    }
    if (!isNaN(event.key)) {
        switch (event.key) {
            case "1":
                currentTexture = "wood.png";
                currentGravity = 0;
                break;
            case "2":
                currentTexture = "sand.jpg";
                currentGravity = 10;
                break;
            case "3":
                currentTexture = "glass.png";
                currentGravity = 0;
                break;
        }
    }
});