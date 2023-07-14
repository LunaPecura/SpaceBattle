
function randomInt(min, max) { // taken from MDN website; both min and max are inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); 
}

/* SPACESHIP CLASS *********************************************************/

class Spaceship { // Player
  health; // health
  firepower;
  accuracy;

  constructor(health, firepower, accuracy) {
    this.health = health;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }

  attack(otherShip) {
    let successKey = Math.random();
    if (successKey <= this.accuracy) {
      otherShip.health -= this.firepower;
      return "HIT";
    } else { return "MISS"; }
  }

  isAlive() {
    return (this.health > 0);
  }
}

class Alien { // Enemy

}

/* GAME CLASS **********************************************************************/

class Game {
  player; // player
  alienFleet = []; // enemy
  fleetStrength = 6;
  roundCount = 0;
  currentEnemy;
  
  constructor() {

    // SET UP ALIEN ARRAY
    this.alienFleet = Array.from(Array(this.fleetStrength), () => {
      let h = randomInt(3, 6);
      let fp = randomInt(2, 4);
      let ac = randomInt(6, 8)/10.0;
      return new Spaceship(h, fp, ac);
    });

    // SET UP SPACESHIP
    this.player = new Spaceship(20, 5, .7);
  }


  attack() {
    let currentAction = this.player.attack(this.currentEnemy);
    displayActionRight.innerHTML = currentAction;
    return currentAction;
  }

  counterAttack() {
    let currentAction = this.currentEnemy.attack(this.player);
    displayActionLeft.innerHTML = currentAction;
    return currentAction;
  }
}



/* GAME PLAY ****************************************************************************************/

// DISPLAYS
const displayHealthLeft = document.querySelector(".display.health.left"); // healthDisplay1
const displayHealthRight = document.querySelector(".display.health.right"); // healthDisplay2
const displayActionLeft = document.querySelector(".display.action.left"); // actionDisplay1
const displayActionRight = document.querySelector(".display.action.right"); // actionDisplay2

// BUTTONS
const gameButton = document.querySelector(".gameButton");
const enemyButton = document.querySelector(".enemyButton");
const attackButton = document.querySelector(".attackButton");

// VARIABLES
let myGame;
let alienCounter;



/* NEW GAME *****************************************************************************************/

const newGame = () => {
  myGame = new Game();
  alienCounter = 0;

  // RESET LITTLE ALIEN IMAGES
  for(let i=1; i<=myGame.fleetStrength; i++) {
    document.querySelector("img.alien#alien" + parseInt(i)).removeAttribute("hidden");
  }
  
  // RESET DISPLAYS
  displayHealthLeft.innerHTML = myGame.player.health;
  displayActionLeft.innerHTML = "";
  displayHealthRight.innerHTML = "";
  displayActionRight.innerHTML = "";
  
  // RESET BUTTONS
  gameButton.setAttribute("class", "inactive");
  gameButton.setAttribute("disabled", true);
  enemyButton.setAttribute("class", "active");
  enemyButton.removeAttribute("disabled");
  attackButton.setAttribute("class", "inactive"); 
  attackButton.setAttribute("disabled", true);

}



/* NEW ENEMY ****************************************************************************************/

const newEnemy = () => {
  alienCounter++;
  myGame.currentEnemy = myGame.alienFleet.pop();

  // ADJUST BUTTONS
  enemyButton.setAttribute("class", "inactive");
  enemyButton.setAttribute("disabled", true);
  attackButton.setAttribute("class", "active");
  attackButton.removeAttribute("disabled");

  // ADJUST BIG & LITTLE ALIEN IMAGES
  document.querySelector("img.alien#alien" + alienCounter).setAttribute("hidden", true);

  // ADJUST DISPLAYS
  displayHealthRight.innerHTML = myGame.currentEnemy.health;
  displayActionRight.innerHTML = "";
}



/* ATTACK *******************************************************************************************/

const attack = () => {
  myGame.roundCount++;
  let currentAction = myGame.attack();

  // ADJUST BUTTONS
  attackButton.setAttribute("class", "inactive");
  attackButton.setAttribute("disabled", true);
  
  // UPDATE DISPLAY
  displayHealthRight.innerHTML = myGame.currentEnemy.health;

  if(currentAction === "HIT") {

    // IF ENEMY IS DEAD
    if(!myGame.currentEnemy.isAlive()) {

      if(myGame.alienFleet.length === 0) {      // END OF GAME (WIN)
        gameButton.setAttribute("class", "active");
        gameButton.removeAttribute("disabled");
        return;
      } else {  // THIS ENEMY DEAD, BUT MORE IN WAITING
        enemyButton.setAttribute("class", "active");
        enemyButton.removeAttribute("disabled");
        displayActionLeft.innerHTML = "";
      }
    } 

  } 
 
  if(myGame.currentEnemy.isAlive()) {
    counterAttack();
  }
}



/* COUNTER ATTACK ***********************************************************************************/

const counterAttack = () => {
  let counterAction = myGame.counterAttack(); 
  displayHealthLeft.innerHTML = myGame.player.health;

  // END OF GAME (LOSS)
  if(!myGame.player.isAlive()) {
    gameButton.setAttribute("class", "active");
    gameButton.removeAttribute("disabled");
    return;
  } else {
    attackButton.setAttribute("class", "active");
    attackButton.removeAttribute("disabled");
  }
}



/* SPECS
There are six alien ships. 
The aliens' weakness is that they are too logical and attack one at a time: ...
Your strength is that you have the initiative and get to attack first. 
However, you do not have targeting lasers and can only attack the aliens in order. 
After you have destroyed a ship, you have the option to make a hasty retreat.
*/

/* GAME ROUND
You attack the first alien ship
If the ship survives, it attacks you
If you survive, you attack the ship again
If it survives, it attacks you again ... etc
If you destroy the ship, you have the option to attack the next ship or to retreat
If you retreat, the game is over, perhaps leaving the game open for further developments or options
You win the game if you destroy all of the aliens
You lose the game if you are destroyed
*/

/* SHIP PROPERTIES
X hull is the same as hitpoints. If hull reaches 0 or less, the ship is destroyed
X firepower is the amount of damage done to the hull of the target with a successful hit
X accuracy is the chance between 0 and 1 that the ship will hit its target
*/

/* SHIP SPECS
USS ASSEMBLY: hull: 20; firepower: 5; accuracy: .7
ALIENS: hull: range(3,6); firepower: range(2,4); accuracy: range(.6,.8)
*/