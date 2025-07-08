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

function testAddToCombatList(){
    console.log("TEST ADD TO COMBAT LIST")
    try{
        Main.addMonsterToCombatList("Goblin")
        Main.addMonsterToCombatList("Alchemical Golem")
        Main.sortCombatList()

        expect(Main.combatList.size()).toBe(2)
        console.log("✅Test pasó correctamente")
    }
    catch(error){
        console.log("❌Test fallido: ", error.message)
    }
}
function runAllTests(){
    testAddToCombatList()
}
runAllTests()
