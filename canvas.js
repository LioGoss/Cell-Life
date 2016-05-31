window.onload = function(){
	$("#startModal").modal('show');
}
$(document).ready(function()
{
	$("#start").click(function(){
		start();
		$("#startModal").modal('toggle');
	});
});


function start(){
    var canvas = document.getElementById('main_canvas');
        if(!canvas){
            alert("Impossible de récupérer le canvas");
            return;
        }
    var context = canvas.getContext('2d');
        if(!context){
            alert("Impossible de récupérer le context du canvas");
            return;
        }

	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	var playerPush = 0; //passe à 1 quand user appuie sur une touche
	var timer = 0; //timer pour la génération des ennemis
	var count = 1; //numéro pour compter les ennemis
	var pause = 0;
	
	//object Pool : contient les éléments non joueur
	var pool = {};//déclaration d'un objet pool

	function enemyGenerate(){
		var x = Math.floor((Math.random() * canvas.width)+1 );
		var y = Math.floor((Math.random() * canvas.height)+1 );
		var size = Math.floor((Math.random() * (cellPlayer.size)*2)+1 );
		var xSpeed = 1;
		var ySpeed = 1;
		var initialOrientation = randomInt(1,8);
		pool["cell"+count] = new cell(size,x,y,xSpeed, ySpeed,initialOrientation);
		count++;
		timer = 0;
		document.getElementById("score").innerHTML = size;
	}

	function contact(){ //verifier si player a une collision avec un ennemi
		var sizePlayer, xPlayer, Yplayer, sizeCollision, xCollision, yCollision;
		for(var id in pool){
			//alert(pool[id].size)
			sizeCollision = pool[id].size;
			xCollision = pool[id].xPos;
			yCollision = pool[id].yPos;
			sizePlayer = cellPlayer.size;
			xPlayer = cellPlayer.xPos;
			yPlayer = cellPlayer.yPos;
			if(xCollision<xPlayer+(sizePlayer/2) && xCollision>xPlayer-(sizePlayer/2)){
				if(yCollision<yPlayer+(sizePlayer/2) && yCollision>yPlayer-(sizePlayer/2)){
					if(sizePlayer>=sizeCollision){
						// ENNEMI MANGE
						delete pool[id];
						cellPlayer.size = cellPlayer.size+(Math.round(sizeCollision/7));
					}
					else{
						// JEU PERDU
						pause=1;
					}
					
				}
			}
		}
	}

	// Choisit une direction vers laquelle aller.
	function updateDirection()
	{
		for(var id in pool) {
			pool[id].direction = randomInt(1, 8);
		}
	}

	function ennemy(){ //dessiner les ennemis
		//var sizePlayer, xPlayer, Yplayer, sizeCollision, xCollision, yCollision;
		for(var id in pool){
			s = pool[id].size;
			x = pool[id].xPos;
			y = pool[id].yPos;
			
			context.beginPath();
			context.arc(x, y, s, 0, Math.PI*2);
			
			if(s>cellPlayer.size){
				context.fillStyle = "#ff0000";
			}
			else{
				context.fillStyle = "#ff9900";
			}
			
			context.fill();
			context.closePath();
			context.fillStyle = 'white';
		}
	}

	// déplace les ennemis
	function ennemyAI(){
		for(var id in pool){
			s = pool[id].size;
			x = pool[id].xPos;
			y = pool[id].yPos;
			dx = pool[id].xSpeed;
			dy = pool[id].ySpeed;
			direction = pool[id].direction;

			switch (direction) {
				case 1:
					// GAUCHE
					pool[id].xPos -= dx;
					pool[id].yPos += 0;
					break;
				case 2:
					// DROITE
					pool[id].xPos += dx;
					pool[id].yPos += 0;
					break;
				case 3:
					// HAUT
					pool[id].xPos += 0;
					pool[id].yPos -= dy;
					break;
				case 4:
					// BAS
					pool[id].xPos += 0;
					pool[id].yPos += dy;
					break;
				case 5:
					// BAS à DROITE
					pool[id].xPos += dx;
					pool[id].yPos += dy;
					break;
				case 6:
					// BAS à GAUCHE
					pool[id].xPos -= dx;
					pool[id].yPos += dy;
					break;
				case 7:
					// HAUT à DROITE
					pool[id].xPos += dx;
					pool[id].yPos -= dy;
					break;
				case 8:
					// HAUT à GAUCHE
					pool[id].xPos -= dx;
					pool[id].yPos -= dy;
					break;

			}

			if (pool[id].xPos<0){
				pool[id].xPos=canvas.width;
			}
			if (pool[id].xPos>canvas.width){
				pool[id].xPos=0;
			}
			if (pool[id].yPos<0){
				pool[id].yPos=canvas.height;
			}
			if (pool[id].yPos>canvas.height){
				pool[id].yPos=0;
			}
			$("#ennemyCell").html("Cell("+s+","+x+","+y+","+pool[id].xPos+","+pool[id].yPos+","+dx+","+dy+")");
		}
	}

	
	//Player
	var pSize = 10,
		pX = canvas.width/2;
		pY = canvas.height/2;
	cellPlayer = new cell(pSize, pX, pY, 0, 0);	
	
    var myInterval = setInterval(animate, 1000/60);//boucle de rafraichissement
	var updateDirectionInterval = setInterval(updateDirection, 1000*3);//boucle de rafraichissement

	function animate(){
		if(pause==0){
			//vider canvas
			context.clearRect(0, 0, canvas.width, canvas.height);
			//contact();
			//vérif clavier
			//userInput();
			
			//playerCell
			cellPlayer.xPos = cellPlayer.xPos + xSpeed;
			cellPlayer.yPos = cellPlayer.yPos + ySpeed;
			if (cellPlayer.xPos<0){
				cellPlayer.xPos=canvas.width;
			}
			if (cellPlayer.xPos>canvas.width){
				cellPlayer.xPos=0;
			}
			if (cellPlayer.yPos<0){
				cellPlayer.yPos=canvas.height;
			}
			if (cellPlayer.yPos>canvas.height){
				cellPlayer.yPos=0;
			}
			
			context.fillStyle = '#ffff00';
			context.beginPath();
			context.arc(cellPlayer.xPos, cellPlayer.yPos, cellPlayer.size, 0, Math.PI*2);
				//context.fillStyle = "#ff0000";
			context.fill();
			context.closePath();
			context.fillStyle = 'white';
				//context.fillStyle = "#000000";
			
			//ennemyCell
			if (timer >= 200)
				enemyGenerate();

			// déplace les ennemis
			ennemyAI();
			//dessiner ennemis
			ennemy();
			//vérifier collisions
			contact();
			
			
			//texte "your CELL" qui disparait quand user appui sur une touche
			if (!playerPush){
				context.strokeStyle = 'white';
				context.font = "50px Arial";
				context.strokeText("CELL LIFE",(canvas.width/2)-120,80);
				
				context.font = "12px Arial"; 
				context.fillText("< This is your cell", (canvas.width/2)+15, canvas.height/2+5); //text fait 210 de large
				context.fillText("Use Z,Q,S,D to move ", (canvas.width/2)+20, canvas.height/2+20); //text fait 210 de large
				context.font = "14px Arial"; 
				context.fillText("Grow by eating smaller cells...", (canvas.width/2)-160, (canvas.height/2)-150); //text fait 210 de large
				context.fillText("...but be careful! Avoid the bigger ones!", (canvas.width/2)-20, (canvas.height/2)-100); //text fait 210 de large
			}
			else{
				context.font = "16px Arial"; 
				context.fillText(("SIZE: "+(cellPlayer.size-4)), canvas.width - 100, 25);	
			}
			
			/*cercle
			 context.beginPath();
			 context.arc(100, 100, 50, 0, Math.PI*2);
			 context.fill();
			 context.closePath();
			*/
			
			/*rectangle
			context.fillRect(370, 210, 5, 10);//(xPos, yPos, taille, taille)
			*/
			
			//rectangle = bouffe. faire apparaitre de manière random toutes les x frames un nouveau carré.
			// avoir un compteur de carré pour pas en mettre trop? --> boucle
			
			
			timer++;
			$("#timer").html(timer);
		}
		else{
			//context.strokeStyle = 'red';
			context.strokeStyle = 'white';
			context.font = "100px Arial";
			context.strokeText("WASTED",(canvas.width/2)-200,canvas.height/2 +200);
			context.font = "12px Arial"; 
			context.strokeStyle = 'white';
			context.fillText("Cell Life v0.1 by Lionel GOSSELIN - 2016", (canvas.width/2)-110, canvas.height-20);

			clearInterval(myInterval);
			clearInterval(updateDirectionInterval);
			$("#startModal").modal('show');
		}
    } 
	
	//Gestion du clavier
	var ySpeed=0, xSpeed=0;
	document.onkeydown=function(e){
		playerPush=2;
		if(e.keyCode ===90){//Z
			ySpeed=-2;
		}
		if(e.keyCode ===83){//S
			ySpeed=+2
		}
		if(e.keyCode ===81){//Q
			xSpeed=-2;
		}
		if(e.keyCode ===68){//D
			xSpeed=2;
		}
	}
	document.onkeyup=function(e){
		if(e.keyCode ===90){//Z
			ySpeed =0;
		}
		if(e.keyCode ===83){//S
			ySpeed=0;
		}
		if(e.keyCode ===81){//Q
			xSpeed =0;
		}
		if(e.keyCode ===68){//D
			xSpeed =0;
		}
	}
	
	
/*test déplacement à la souris
function draw(e) {
    var pos = getMousePos(canvas, e);
    cellPlayer.xPos = pos.x;
    cellPlayer.yPos = pos.y;
    
	
	//context.fillStyle = "#000000";
    //context.fillRect(posx, posy, 4, 4);
}
window.addEventListener('mousemove', draw, false);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
*/

}

//object Cell
/*
*  orientation:
*    1: GAUCHE
*    2: DROITE
*    3: HAUT
*    4: BAS
*    5: BAS DROITE
*    6: BAS GAUCHE
*    7: HAUT DROITE
*    8: HAUT GAUCHE
*
* */
function cell(size, xPos, yPos, xSpeed, ySpeed, direction) {
	this.size = size;
	this.xPos = xPos;
	this.yPos = yPos;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;
	this.direction = direction;
}

function randomInt(min, max) {
	// inclut les bornes !
	return Math.floor(Math.random() * (max - min +1)) + min;
}


