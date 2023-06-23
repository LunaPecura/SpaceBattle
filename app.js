
function randomInt(min, max) { // taken from MDN website; both min and max are inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); 
}



class Spaceship {

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


class Game {

  assembly;
  alienFleet = [];
  fleetStrength = 6;
  roundCount = 0;
  currentEnemy;
  
  constructor() {

    this.alienFleet = Array.from(Array(this.fleetStrength), () => {
      let h = randomInt(3, 6);
      let fp = randomInt(2, 4);
      let ac = randomInt(6, 8)/10.0;
      return new Spaceship(h, fp, ac);
    });

    this.assembly = new Spaceship(20, 5, .7);
    textOutput.innerHTML = "********** NEW GAME **********";
  }

  attack() {
    let currentAction = this.assembly.attack(this.currentEnemy);
    displayActionRight.innerHTML = currentAction;
    if(currentAction === "HIT") {
      displayActionRight.setAttribute("color", "red");
    } else {
      displayActionRight.setAttribute("color", "green");
    }
    
    return currentAction;
  };

  counterAttack() {
    let currentAction = this.currentEnemy.attack(this.assembly);
    displayActionLeft.innerHTML = currentAction;
    return currentAction;
  }
}

let myGame;
const displayHealthLeft = document.querySelector("#healthDisplaySelf");
const displayHealthRight = document.querySelector("#healthDisplayEnemy");
const displayActionLeft = document.querySelector("#actionDisplaySelf");
const displayActionRight = document.querySelector("#actionDisplayEnemy");
const textOutput = document.querySelector(".textOutput")



const newGame = () => {
  myGame = new Game();
  displayHealthLeft.innerHTML = myGame.assembly.hull;
}

const newEnemy = () => {
  if(myGame.alienFleet.length > 0) {
    myGame.currentEnemy = myGame.alienFleet.pop();
    textOutput.innerHTML = "NEW ENEMY: hull " + myGame.currentEnemy.hull + " / firepower " +
      myGame.currentEnemy.firepower + " / accuracy " + myGame.currentEnemy.accuracy;
    displayHealthRight.innerHTML = myGame.currentEnemy.hull;
  }
}

const fightEnemy = () => {
  if (myGame.assembly.isAlive() && myGame.currentEnemy.isAlive()) {
      myGame.roundCount++;
      textOutput.innerHTML += "<br>ROUND " + myGame.roundCount;
      
      let currentAction = myGame.attack();
      displayHealthRight.innerHTML = myGame.currentEnemy.hull;
      textOutput.innerHTML += "<br>ATTACK!";
      if(currentAction === "HIT") {
        textOutput.innerHTML += "... SUCCESS";
      } else {
        textOutput.innerHTML += "... failure";
      }

      if(myGame.currentEnemy.isAlive()) {
        let counterAction = myGame.counterAttack(); 
        textOutput.innerHTML += "<br>INCOMING ATTACK!";
        if(counterAction === "HIT") {
          textOutput.innerHTML += "... defense failed";
        } else {
          textOutput.innerHTML += "... DEFENSE SUCCESSFUL!";
        }
        displayHealthLeft.innerHTML = myGame.assembly.hull;
      }
  }
}
      /* if (myGame.currentEnemy.isAlive()) {  // END OF GAME (LOSS)
        console.log("YOU LOSE");
        return;
      }
 */


/* 

    if(myGame.assembly.isAlive()) {     // END OF GAME (WIN)
      console.log("YOU WIN");  
    }
  
 */
  //myGame.playGame();





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