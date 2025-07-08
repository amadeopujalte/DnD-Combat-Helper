import * as creature from './creature.js'

let combatList = []   // list of creatures in combat

function sortCombatList(combatList){
    combatList.sort((a,b) => a.iniative - b.iniative)
    return combatList
}

