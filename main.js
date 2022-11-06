

let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 1000;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, enemyImage, gameOverImage, bulletImage;
let gameOver = false // true 게임 끝남
let score = 0


//우주선 좌표
let spaceshipX = canvas.width/2-40;
let spaceshipY = canvas.height-110;

let bulletList = [];
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX + 22;
        this.y = spaceshipY - 15;
        this.alive = true;
        bulletList.push(this);
    }
    this.update = function(){
        this.y-=7 ;
    };

    this.checkHit = function() {

        for(let i = 0; i < enemyList.length; i++) {
            if (
                this.y <= enemyList[i].y && 
                this.x >= enemyList[i].x &&
                this.x <= enemyList[i].x + 40 
                ) {
                score++;
                this.alive = false;
                enemyList.splice(i, 1);
            }
        }
        
    };
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random() * (max-min+1)) +min;   
    return randomNum;
}


let enemyList = [];
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-48);
        enemyList.push(this);
    };
    this.update = function(){
        this.y += 5; // enemy 속도 조절

        if ( this.y >= canvas.height - 48) {
            gameOver = true;
            console.log("gameover");
        }
    };
}

//이미지 로드
function loadImage(){
backgroundImage = new Image();
backgroundImage.src = "images/background.jpg";

spaceshipImage = new Image();
spaceshipImage.src = "images/spaceship6.png";

enemyImage = new Image();
enemyImage.src = "images/enemy.png";

gameOverImage = new Image;
gameOverImage.src = "images/gameover.jpg";

bulletImage = new Image;
bulletImage.src = "images/bullet.png";
}

let keysDown = {};
function setupKeyboardListener() {
    document.addEventListener("keydown", function (event) {
        
        
        keysDown[event.keyCode] = true;
    });
    document.addEventListener("keyup", function(event) {
        delete keysDown[event.keyCode];

        if(event.keyCode == 32){
            creatBullet() // 총알 생성 

        }
    });
}

function creatBullet(){
    console.log("총알 생성");
    let b = new Bullet();
    b.init();
    console.log("새로운 총알 리스트", bulletList);
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    }, 1000);
}


// 방향키 조정
function update() {
    if( 39 in keysDown){
        spaceshipX += 7; //우주선 속도
    }
    if(37 in keysDown){
        spaceshipX -= 7;
    }

    if(spaceshipX <=0) {
        spaceshipX=0;
    }
    if(spaceshipX >= canvas.width - 64) {
        spaceshipX = canvas.width - 64;
    }
// 위아래
    if( 40 in keysDown){
        spaceshipY += 7;
    }
    if( 38 in keysDown){
        spaceshipY -= 7;
    }

    if(spaceshipY <=0){
        spaceshipY=0;
    }
    if(spaceshipY >= canvas.height - 64){
        spaceshipY = canvas.height - 64;
    }

    for(let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive) {
        bulletList[i].update();
        bulletList[i].checkHit();
        }
    }

    for(let i=0; i<enemyList.length;i++) {
        enemyList[i].update();
    }
    
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText('Score:${score}', 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    for(let i=0; i<bulletList.length;i++) {
        if(bulletList[i].alive){
        ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
        }
    }

    for(let i=0; i<enemyList.length; i++) {
        ctx.drawImage(enemyImage,enemyList[i].x, enemyList[i].y);
    }
}

function main(){
    if(!gameOver) {
    update(); //좌표 업데이트
    render(); //그려주기
    console.log("animation calls main function");
    requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameOverImage, 0, 100, 700, 700);
    };
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
