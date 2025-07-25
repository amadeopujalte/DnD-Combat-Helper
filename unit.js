import * as Creature from "./creature.js"

class Unit{
    constructor( name,hp, ac, initiative){
        this.name = name
        this.hp = hp
        this.ac = ac
        this.initiative = initiative
    }
    modifyHp(value){
        hp = value    
    }
    increaseHp(value){
        hp += value
    }
    decreaseHp(value){
        hp -=value
    }
    modifyAc(value){
        ac = value
    }
    modify(value){
        initiative = value
    }

}
let combatList = []   // list of creatures in combat

function getCombatList(){
    return combatList
}
function sortCombatList(){
    combatList.forEach( (e) =>
    { e.initiativeRoll = (e.initiative + e.d20())
    console.log("Roll: ", e.initiativeRoll)
        })
    combatList.sort((a,b) => b.initiativeRoll - a.initiativeRoll)
}

async function addMonsterToCombatList(monsterName){
    console.log("Searching monster")
    const monster = await Creature.searchMonster(monsterName)
    if(monster !== 0){
        combatList.push(monster)
    }
    else{
        console.log("Monster could not be added")
    }
}

let unitList = []

function createUnits(){
        var index = combatList.length
        const e = combatList[index -1] //Also could use combatList.at(-1) but i dont like it.
        console.log("Element e is:",e)
        const unit = new Unit(e.name, e.hp, e.ac, (e.initiative + e.d20()))
        unitList.push(unit)
}

function sortUnitList(){
    unitList = unitList.sort((a,b) => b.initiative - a.initiative)
    console.log("sorting...")

    
}
async function newUnit(monsterName){
    await addMonsterToCombatList(monsterName)
    //sortCombatList()
    createUnits()
}

export {Unit, addMonsterToCombatList, sortCombatList, getCombatList, sortUnitList, combatList, createUnits, unitList, newUnit}
