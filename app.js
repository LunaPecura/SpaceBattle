// "https://png.pngtree.com/png-vector/20210329/ourmid/pngtree-cute-green-cartoon-spaceship-png-image_3136437.jpg"
// https://static.vecteezy.com/system/resources/previews/009/463/283/original/cute-alien-dabbing-on-moon-cartoon-icon-illustration-animal-food-flat-cartoon-concept-vector.jpg
// https://static.displate.com/280x392/displate/2022-06-30/ed7b5d1d595bdd1133cc6fd619f31f82_755c8abc064774a95c9bec3635c4884a.jpg
// https://ih1.redbubble.net/image.55849089.2532/pp,840x830-pad,1000x1000,f8f8f8.u2.jpg
// https://easydrawingguides.com/wp-content/uploads/2020/09/how-to-draw-a-spaceship-featured-image-1200.png

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
    //console.log(successKey);
    if (successKey <= this.accuracy) {
      console.log("HIT");
      otherShip.hull -= this.firepower;
    } else {console.log("MISS")}
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
    this.currentEnemy = this.alienFleet.pop();
    console.log("********** NEW GAME **********");
    console.log("FIRST ENEMY");
  }


  playRound() {
    this.roundCount++;
    console.log("Round " + this.roundCount + ": ")
    this.assembly.attack(this.currentEnemy);
    this.currentEnemy.attack(this.assembly);
    console.log("Assembly: ", this.assembly.hull);
    console.log("Enemy: ", this.currentEnemy.hull);
  }

  fightEnemy() {
    while (this.assembly.isAlive() && this.currentEnemy.isAlive()) {
      this.playRound();
    }

    if (this.currentEnemy.isAlive()) {  // END OF GAME (LOSS)
      console.log("YOU LOSE");
      return;
    }
  }

  playGame() {
    while(this.alienFleet.length > 0) {
      this.currentEnemy = this.alienFleet.pop();
      console.log("NEW ENEMY: ", this.currentEnemy);
      this.fightEnemy();
    }

    if(this.assembly.isAlive()) {     // END OF GAME (WIN)
      console.log("YOU WIN");  
    }
  }
}

const play = () => {
  const myGame = new Game();
  myGame.playGame();
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