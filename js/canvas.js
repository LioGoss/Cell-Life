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
	
	//object goodPool : contient les éléments non joueur
	var goodPool = {};//déclaration d'un objet goodPool
	var badPool = {};//déclaration d'un objet goodPool

	function enemyGenerate(){
		var goodX = Math.floor((Math.random() * canvas.width)+1 );
		var goodY = Math.floor((Math.random() * canvas.height)+1 );
		var goodSize = Math.floor((Math.random() * (cellPlayer.size)*2)+1 );
		var goodXSpeed = 1;
		var goodYSpeed = 1;

		var badX = Math.floor((Math.random() * canvas.width)+1 );
		var badY = Math.floor((Math.random() * canvas.height)+1 );
		var badSize = Math.floor((Math.random() * (cellPlayer.size)*2)+1 );
		var badXSpeed = 1;
		var badYSpeed = 1;

		var initialOrientation = randomInt(1,8);

		goodPool["cell"+count] = new cell(goodSize,goodX,goodY,goodXSpeed, goodYSpeed,initialOrientation);
		badPool["cell"+count] = new cell(badSize,badX,badY,badXSpeed,badYSpeed,initialOrientation);
		count++;
		timer = 0;
		document.getElementById("score").innerHTML = goodSize;
	}

	function contact(){ //verifier si player a une collision avec un ennemi
		var sizePlayer, xPlayer, yPlayer, sizeCollision, xCollision, yCollision;

		sizePlayer = cellPlayer.size;
		xPlayer = cellPlayer.xPos;
		yPlayer = cellPlayer.yPos;
		for(var id in goodPool){
			sizeCollision = goodPool[id].size;
			xCollision = goodPool[id].xPos;
			yCollision = goodPool[id].yPos;

			if(xCollision<xPlayer+(sizePlayer/2) && xCollision>xPlayer-(sizePlayer/2)){
				if(yCollision<yPlayer+(sizePlayer/2) && yCollision>yPlayer-(sizePlayer/2)){
					if(sizePlayer>=sizeCollision){
						// ENNEMI MANGE
						delete goodPool[id];
						cellPlayer.size = cellPlayer.size+(Math.round(sizeCollision/7));
					}
					else{
						// JEU PERDU
						pause=1;
					}
					
				}
			}
		}

		for(var id in badPool){
			sizeCollision = badPool[id].size;
			xCollision = badPool[id].xPos;
			yCollision = badPool[id].yPos;

			if(xCollision<xPlayer+(sizePlayer/2) && xCollision>xPlayer-(sizePlayer/2)){
				if(yCollision<yPlayer+(sizePlayer/2) && yCollision>yPlayer-(sizePlayer/2)){
					if(sizePlayer>=sizeCollision){
						// ENNEMI MANGE
						delete badPool[id];
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
		for(var id in goodPool) {
			goodPool[id].direction = randomInt(1, 8);
		}

		for(var id in badPool) {
			badPool[id].direction = randomInt(1, 8);
		}
	}

	function ennemy(){ //dessiner les ennemis
		//var sizePlayer, xPlayer, Yplayer, sizeCollision, xCollision, yCollision;
		for(var id in goodPool){
			s = goodPool[id].size;
			x = goodPool[id].xPos;
			y = goodPool[id].yPos;
			
			context.beginPath();
			context.arc(x, y, s, 0, Math.PI*2);
			
			if(s>cellPlayer.size){
				context.fillStyle = "#ff0000";
			}
			else{
				context.fillStyle = "#ff9900"; // #ff9900
			}
			
			context.fill();
			context.closePath();
			context.fillStyle = 'white';
		}

		for(var id in badPool){
			s = badPool[id].size;
			x = badPool[id].xPos;
			y = badPool[id].yPos;

			context.beginPath();
			context.arc(x, y, s, 0, Math.PI*2);

			if(s>cellPlayer.size){
				context.fillStyle = "#3300FF";
			}
			else{
				context.fillStyle = "#99CCFF"; // #ff9900
			}

			context.fill();
			context.closePath();
			context.fillStyle = 'white';
		}
	}

	// déplace les ennemis
	function ennemyAI(){
		for(var id in goodPool){
			s = goodPool[id].size;
			x = goodPool[id].xPos;
			y = goodPool[id].yPos;
			dx = goodPool[id].xSpeed;
			dy = goodPool[id].ySpeed;
			direction = goodPool[id].direction;

			switch (direction) {
				case 1:
					// GAUCHE
					goodPool[id].xPos -= dx;
					goodPool[id].yPos += 0;
					break;
				case 2:
					// DROITE
					goodPool[id].xPos += dx;
					goodPool[id].yPos += 0;
					break;
				case 3:
					// HAUT
					goodPool[id].xPos += 0;
					goodPool[id].yPos -= dy;
					break;
				case 4:
					// BAS
					goodPool[id].xPos += 0;
					goodPool[id].yPos += dy;
					break;
				case 5:
					// BAS à DROITE
					goodPool[id].xPos += dx;
					goodPool[id].yPos += dy;
					break;
				case 6:
					// BAS à GAUCHE
					goodPool[id].xPos -= dx;
					goodPool[id].yPos += dy;
					break;
				case 7:
					// HAUT à DROITE
					goodPool[id].xPos += dx;
					goodPool[id].yPos -= dy;
					break;
				case 8:
					// HAUT à GAUCHE
					goodPool[id].xPos -= dx;
					goodPool[id].yPos -= dy;
					break;

			}

			if (goodPool[id].xPos<0){
				goodPool[id].xPos=canvas.width;
			}
			if (goodPool[id].xPos>canvas.width){
				goodPool[id].xPos=0;
			}
			if (goodPool[id].yPos<0){
				goodPool[id].yPos=canvas.height;
			}
			if (goodPool[id].yPos>canvas.height){
				goodPool[id].yPos=0;
			}
			$("#ennemyCell").html("Cell("+s+","+x+","+y+","+goodPool[id].xPos+","+goodPool[id].yPos+","+dx+","+dy+")");
		}

		for(var id in badPool){
			s = badPool[id].size;
			x = badPool[id].xPos;
			y = badPool[id].yPos;
			dx = badPool[id].xSpeed;
			dy = badPool[id].ySpeed;
			direction = badPool[id].direction;

			switch (direction) {
				case 1:
					// GAUCHE
					badPool[id].xPos -= dx;
					badPool[id].yPos += 0;
					break;
				case 2:
					// DROITE
					badPool[id].xPos += dx;
					badPool[id].yPos += 0;
					break;
				case 3:
					// HAUT
					badPool[id].xPos += 0;
					badPool[id].yPos -= dy;
					break;
				case 4:
					// BAS
					badPool[id].xPos += 0;
					badPool[id].yPos += dy;
					break;
				case 5:
					// BAS à DROITE
					badPool[id].xPos += dx;
					badPool[id].yPos += dy;
					break;
				case 6:
					// BAS à GAUCHE
					badPool[id].xPos -= dx;
					badPool[id].yPos += dy;
					break;
				case 7:
					// HAUT à DROITE
					badPool[id].xPos += dx;
					badPool[id].yPos -= dy;
					break;
				case 8:
					// HAUT à GAUCHE
					badPool[id].xPos -= dx;
					badPool[id].yPos -= dy;
					break;

			}

			if (badPool[id].xPos<0){
				badPool[id].xPos=canvas.width;
			}
			if (badPool[id].xPos>canvas.width){
				badPool[id].xPos=0;
			}
			if (badPool[id].yPos<0){
				badPool[id].yPos=canvas.height;
			}
			if (badPool[id].yPos>canvas.height){
				badPool[id].yPos=0;
			}
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


