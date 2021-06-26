let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let scoreText = document.getElementById("sc");
let hScoreText= document.getElementById("hsc");
let startPrompt = document.getElementById("strtgm");
let start;
let user = document.getElementById("name");
console.log(user);
canvas.height = 500;
canvas.width=800;
let player;
let spacePressed=0;
let obstacles = [];
let score=0;
let highscore=0;

function getRandomColor() 
{
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function getRandomInt(min, max)
{    
       return Math.floor(Math.random() * (max - min + 1)) + min;
}


document.addEventListener('keydown', keyDownHandler);

function genPlayArea()
{
    
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,150);
    ctx.fillStyle="black";
    ctx.fillRect(0,350,canvas.width,150);

}

function keyDownHandler(evt)
{
    if(evt.keyCode==32)
    {
        if(spacePressed==1)
         spacePressed=0;
        else
        spacePressed=1;
        evt.preventDefault();
    }
}

class Player
{   
    constructor()
    {
        this.height=20;
        this.width=20;
        this.y=250;
        this.x=5;
    }

    render()
    {
        ctx.fillStyle=getRandomColor();
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    update()
    {
        if(this.y>=320)
            this.y=320;
        if(this.y<=160)
            this.y=160;   
        if(spacePressed)
        { 
            this.y+=10;
        }
        else
        {
             this.y-=10;
        }
    }
}

class Hole
{
    constructor(x,y,w,h)
    {
        this.height=h;
        this.width=w;
        this.y=y;
        this.x=x;
        this.gmSpeed = -4;
    }

    render()
    {
        ctx.fillStyle="grey";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    update()
    {
        this.x+=this.gmSpeed;
        this.render();
        this.gmSpeed=-4;
    }
}


function genObstacles()
{
    let upDownChange = getRandomInt(0,1); // indicates whether hole will spawn up or down
    console.log(upDownChange)
    if(upDownChange==0)
        obstacle = new Hole(canvas.width+20,0 ,150,150);
    else
        obstacle = new Hole(canvas.width+20, 350, 150,150);
    obstacles.push(obstacle);
    
}

function startGm()
{
    window.addEventListener('keyup', function(){
        start = 1;
    });
    
}

player=new Player();

let spawnTimer=100;
let initialSpawnTimer=200;

function gameLoop()
{
    
    ctx.clearRect(0,150,canvas.width,200);
    genPlayArea();
    highscore = localStorage.getItem("hscore");
    hScoreText.innerText=highscore;
    spawnTimer-=3;
    if(spawnTimer<=0)
     {
        genObstacles();
        spawnTimer=initialSpawnTimer-1*8;
        if(spawnTimer<60)
            spawnTimer=60;
     }
    for(let i=0;i<obstacles.length;i++)
    {
        let o = obstacles[i];  
        if(player.x<o.x+o.width&&player.x+player.width>o.x)
        {
            if((player.y+30<o.y+o.height&&player.y+player.height+30>o.y)||(player.y+player.height-10>o.y&&player.y-10<o.y+o.height))
                {
                    if(score>highscore)
                     {
                         highscore=score;
                         hScoreText.innerText=highscore;
                         localStorage.setItem("hscore", highscore);
                     }
                    alert("Score - "+score);
                    score=0;
                    obstacles=[];
                    spawnTimer=initialSpawnTimer;
                }
        }      
        score++;
        o.update();
        player.update();
        scoreText.innerText=score;
        player.render();
    }
    requestAnimationFrame(gameLoop)
}


gameLoop();