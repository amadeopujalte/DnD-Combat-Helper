import * as creature from './creature.js'

let combatList = []   // list of creatures in combat

function sortCombatList(combatList){
    combatList.sort((a,b) => (a.d20 + a.iniative) - (b.d20 + b.iniative))
    return combatList
}


