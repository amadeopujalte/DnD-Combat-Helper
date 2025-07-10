import * as Creatures from './creature.js'
import * as Main from './main.js'

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Test fallido: esperado ${expected}, recibido ${actual}`);
      }
    }
    }
}

async function testAddToCombatList(){
    console.log("TEST ADD TO COMBAT LIST")
    try{
        await Main.addMonsterToCombatList("Goblin")
        await Main.addMonsterToCombatList("Alchemical Golem")
        //console.log("dentro de la lista estan:")
       // console.log(Main.getCombatList())
        expect(Main.getCombatList().length).toBe(2)
        console.log("✅Test pasó correctamente")
    }
    catch(error){
        console.log("❌Test fallido: ", error.message)
    }
}

function testConvertToCreature(){
const rawZombie = {
  "slug": "blood-zombie",
  "name": "Blood Zombie",
  "tpe": "Undead",
  "hit_points": 51,
  "armor_class": 10,
  "hit_dice": "6d8+24",
  "speed": { "walk": 20 },
  "strength": 16,
  "dexterity": 6,
  "constitution": 18,
  "intelligence": 3,
  "wisdom": 6,
  "charisma": 5,
  "damage_resistances": "",
  "damage_immunities": "poison",
  "condition_immunities": "poisoned",
  "actions": [
    {
      "attack_bonus": 5,
      "damage_dice": "1d10+2",
      "desc": "Melee Weapon Attack: +5 to hit...",
      "name": "Slam"
    }
  ],
  "special_abilities": [
    {
      "desc": "A creature that touches the zombie...",
      "name": "Blood Drain"
    },
    {
      "desc": "If damage reduces the zombie to 0 hp...",
      "name": "Undead Fortitude"
    }
  ],
  "spell_list": [],
  "legendary_actions": [],
  "senses": "darkvision 60 ft., passive Perception 8"
};

const myCreature = Creatures.convertToCreature(rawZombie);
console.log(myCreature);

}
function runAllTests(){
    testAddToCombatList()
   // testConvertToCreature()
}
runAllTests()
