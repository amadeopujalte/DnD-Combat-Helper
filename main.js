import * as Creature from './creature.js'

let combatList = []   // list of creatures in combat

function sortCombatList(combatList){
    combatList.sort((a,b) => (a.d20 + a.iniative) - (b.d20 + b.iniative))
    return combatList
}

function addMonsterToCombatList(monsterName){
    const monster = Creature.searchMonster(monsterName)
    if(monster !== 0){
        combatList.push(monster)
    }
    else{
        console.log("Monster could not be added")
    }
}
export { addMonsterToCombatList, sortCombatList, combatList }



