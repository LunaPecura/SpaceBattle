
function randomInt(min, max) { // taken from MDN website; both min and max are inclusive
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); 
}



class Player { // Player
	health; 
	firepower;
	accuracy;

	constructor(health, firepower, accuracy) {
		this.health = health;
		this.firepower = firepower;
		this.accuracy = accuracy;
	}

	attack(otherPlayer) {
		let successKey = Math.random();
		if (successKey <= this.accuracy) {
			otherPlayer.health -= this.firepower;
			return "HIT";
		} else { return "MISS"; }
	}

	isAlive() { return (this.health > 0); }

} // end of Player class



class Game {
	player; 
	alienFleet = []; 
	fleetStrength = 6;
	roundCount = 0;
	currentEnemy;

	constructor() {
		this.player = new Player(20, 5, .7);
		this.alienFleet = Array.from(Array(this.fleetStrength), () => {
			let h = randomInt(3, 6);
			let fp = randomInt(2, 4);
			let ac = randomInt(6, 8)/10.0;
			return new Player(h, fp, ac);
		});
	}	

	attack() { return this.player.attack(this.currentEnemy); }
	counterAttack() { return this.currentEnemy.attack(this.player); }

} // end of Game class



/* GAME PLAY ****************************************************************************************/

// DISPLAYS
const playerHealthDisplay = document.querySelector(".display.health.left"); 
const enemyHealthDisplay = document.querySelector(".display.health.right"); 
const playerActionDisplay = document.querySelector(".display.action.left"); 
const enemyActionDisplay = document.querySelector(".display.action.right"); 

// BUTTONS
const gameButton = document.querySelector(".gameButton");
const enemyButton = document.querySelector(".enemyButton");
const attackButton = document.querySelector(".attackButton");

// IMAGES
const alienImgs = [1,2,3,4,5,6].map(i => document.querySelector("#alienImg" + i));
const bigAlienImg = document.querySelector(".bigAlienImg");

// CONTENT
const alienDivs = [1,2,3,4,5,6].map(i => document.querySelector("#alienDiv" + i));
const bigAlienDiv = document.querySelector(".currentEnemy");
const messageTargetDiv = document.querySelector(".message.target");
const messageWinDiv = document.querySelector(".message.win");
const messageLossDiv = document.querySelector(".message.loss");


// VARIABLES
let myGame;
let alienCounter;
let currentTarget; // int in {1,...,6}



const newGame = () => {
	myGame = new Game();
	alienCounter = 0;
	currentTarget = 0;

	// RESET ALIEN IMAGES
	bigAlienDiv.setAttribute("hidden", true);
	alienImgs.map((element, index) => {
		element.removeAttribute("hidden");
		element.setAttribute("onclick", `setTarget(${index+1})`);
	});
	messageTargetDiv.removeAttribute("hidden");
	
	// RESET DISPLAYS
	playerHealthDisplay.innerHTML = myGame.player.health;
	playerActionDisplay.innerHTML = "";
	enemyHealthDisplay.innerHTML = "";
	enemyActionDisplay.innerHTML = "";

	// RESET BUTTONS
	gameButton.setAttribute("disabled", true);
	enemyButton.setAttribute("disabled", true);
	attackButton.setAttribute("disabled", true);

	messageWinDiv.setAttribute("hidden", true);
	messageLossDiv.setAttribute("hidden", true);

} // end of newGame



const setTarget = (i) => {
	currentTarget = i;

	alienDivs.forEach(div => div.classList.remove("target"));
	alienDivs[i-1].classList.add("target");
	enemyButton.removeAttribute("disabled");
	enemyHealthDisplay.innerHTML = myGame.alienFleet[i-1].health;
	messageTargetDiv.setAttribute("hidden", true);
}


const newEnemy = () => {
	
	alienCounter++;
	myGame.currentEnemy = myGame.alienFleet[currentTarget-1];
	enemyHealthDisplay.innerHTML = myGame.currentEnemy.health;
	enemyActionDisplay.innerHTML = "";

	// ADJUST BUTTONS
	enemyButton.setAttribute("disabled", true);
	attackButton.removeAttribute("disabled");

	// ADJUST ALIEN IMAGES
	alienImgs[currentTarget-1].setAttribute("hidden", true)
	alienDivs[currentTarget-1].removeAttribute("onclick");
	bigAlienDiv.removeAttribute("hidden");
	alienDivs[currentTarget-1].classList.remove("target");

}



const attack = () => {
	myGame.roundCount++;
	let currentAction = myGame.attack();

	// ADJUST BUTTONS
	attackButton.setAttribute("disabled", true);

	// UPDATE DISPLAY
	enemyHealthDisplay.innerHTML = myGame.currentEnemy.health;
	enemyActionDisplay.innerHTML = currentAction;

	if(currentAction === "HIT") {

		// IF ENEMY IS DEAD
		if(!myGame.currentEnemy.isAlive()) {

			if(alienCounter === myGame.fleetStrength) {      // END OF GAME (WIN)
				gameButton.removeAttribute("disabled");
				messageWinDiv.removeAttribute("hidden");
				return;
			} else {  // THIS ENEMY DEAD, BUT MORE IN WAITING
				playerActionDisplay.innerHTML = "";
				bigAlienDiv.setAttribute("hidden", true);
				messageTargetDiv.removeAttribute("hidden");
			}
		} 
	} 

	if(myGame.currentEnemy.isAlive()) { 
		setTimeout(() => {
			counterAttack(); 
		}, 1000);
	}

	return currentAction;

} // end of attack()


const counterAttack = () => {
	let counterAction = myGame.counterAttack(); 
	playerHealthDisplay.innerHTML = myGame.player.health;
	playerActionDisplay.innerHTML = counterAction;

	if(!myGame.player.isAlive()) {			// END OF GAME (LOSS)
		gameButton.removeAttribute("disabled");
		messageLossDiv.removeAttribute("hidden");
		return;
	} else {
		attackButton.removeAttribute("disabled");
	}

	return counterAction;

} // end of counterAttack()

