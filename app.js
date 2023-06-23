
function randomInt(min, max) { // taken from MDN website; both min and max are inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); 
}

/* SPACESHIP CLASS *********************************************************/

class Spaceship {
  hull;
  firepower;
  accuracy;

  constructor(hull, firepower, accuracy) {
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }

  attack(otherShip) {
    let successKey = Math.random();
    if (successKey <= this.accuracy) {
      otherShip.hull -= this.firepower;
      return "HIT";
    } else { return "MISS"; }
  }

  isAlive() {
    return (this.hull > 0);
  }
}

/* GAME CLASS **********************************************************************/

class Game {
  assembly;
  alienFleet = [];
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
    this.assembly = new Spaceship(20, 5, .7);
  }


  attack() {
    let currentAction = this.assembly.attack(this.currentEnemy);
    displayActionRight.innerHTML = currentAction;
    return currentAction;
  }

  counterAttack() {
    let currentAction = this.currentEnemy.attack(this.assembly);
    displayActionLeft.innerHTML = currentAction;
    return currentAction;
  }
}



/* GAME PLAY ********************************************************************/

let myGame;
const displayHealthLeft = document.querySelector("#healthDisplaySelf");
const displayHealthRight = document.querySelector("#healthDisplayEnemy");
const displayActionLeft = document.querySelector("#actionDisplaySelf");
const displayActionRight = document.querySelector("#actionDisplayEnemy");
const textOutput = document.querySelector(".textOutput");
const gameButton = document.querySelector(".gameButton");
const enemyButton = document.querySelector(".enemyButton");
const attackButton = document.querySelector(".attackButton");

const newGame = () => {
  myGame = new Game();
  textOutput.innerHTML = "********** NEW GAME **********";
  displayHealthLeft.innerHTML = myGame.assembly.hull;
  displayActionLeft.innerHTML = "";
  displayHealthRight.innerHTML = "";
  displayActionRight.innerHTML = "";
  //gameButton.style.backgroundColor = 'lightgray';
  gameButton.setAttribute("class", "inactive");
  enemyButton.setAttribute("class", "active");
  attackButton.setAttribute("class", "inactive");
  //newEnemy();
}

const newEnemy = () => {
  myGame.currentEnemy = myGame.alienFleet.pop();
  textOutput.innerHTML = "NEW ENEMY: hull " + myGame.currentEnemy.hull + " / firepower " +
          myGame.currentEnemy.firepower + " / accuracy " + myGame.currentEnemy.accuracy;
  displayHealthRight.innerHTML = myGame.currentEnemy.hull;
  displayActionRight.innerHTML = "";
  enemyButton.setAttribute("class", "inactive");
  attackButton.setAttribute("class", "active");
}

/* ATTACK *******************************************************************************************/
const attack = () => {
  myGame.roundCount++;
  textOutput.innerHTML += "<br>ROUND " + myGame.roundCount;
  let currentAction = myGame.attack();
  displayHealthRight.innerHTML = myGame.currentEnemy.hull;
  textOutput.innerHTML += "<br>ATTACK!";
  attackButton.setAttribute("class", "inactive");

  if(currentAction === "HIT") {
    textOutput.innerHTML += " ...SUCCESS";

    if(!myGame.currentEnemy.isAlive()) {

      // END OF GAME (WIN)
      if(myGame.alienFleet.length === 0) {
        textOutput.innerHTML += "<br><br>********** Y O U   W O N **********";
        gameButton.setAttribute("class", "active");
        return;
      } else {
        enemyButton.setAttribute("class", "active");
        displayActionLeft.innerHTML = "";
      }
    } 
  } else { textOutput.innerHTML += " ...failure"; }
 
  if(myGame.currentEnemy.isAlive()) {
    counterAttack();
  }
}

/* COUNTER ATTACK ***********************************************************************************/
const counterAttack = () => {
  let counterAction = myGame.counterAttack(); 
  textOutput.innerHTML += "<br>INCOMING ATTACK!";
  if(counterAction === "HIT") {
    textOutput.innerHTML += " ... defense failed";
  } else { textOutput.innerHTML += " ... DEFENSE SUCCESSFUL!"; }
  displayHealthLeft.innerHTML = myGame.assembly.hull;


  // END OF GAME (LOSS)
  if(!myGame.assembly.isAlive()) {
    textOutput.innerHTML += "<br><br>++++++++++ Y O U   D I E D ++++++++++";
    gameButton.setAttribute("class", "active");
    return;
  } else {
    attackButton.setAttribute("class", "active");
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