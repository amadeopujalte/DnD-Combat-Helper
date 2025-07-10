import * as Creature from './creature.js'

let combatList = []   // list of creatures in combat

function getCombatList(){
    return combatList
}
function sortCombatList(){
    combatList.forEach( (e) =>{ e.initiativeRoll = (e.initiative + e.d20())
        console.log("Roll: ", e.initiativeRoll)})
    combatList.sort((a,b) => b.initiativeRoll - a.initiativeRoll)
}

async function addMonsterToCombatList(monsterName){
    const monster = await Creature.searchMonster(monsterName)
    if(monster !== 0){
        combatList.push(monster)
    }
    else{
        console.log("Monster could not be added")
    }
}
export { addMonsterToCombatList, sortCombatList, getCombatList }

await addMonsterToCombatList("Goblin")
await addMonsterToCombatList("Angelic Enforcer")
await addMonsterToCombatList("Alchemical Golem")
combatList.forEach( (e) => console.log(e.name))
sortCombatList()
combatList.forEach( (e) => console.log(e.name))

