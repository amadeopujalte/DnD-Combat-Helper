import * as Creature from "./creature.js"

class Unit{
    constructor( name,hp, ac, initiative, dex, stateAndEffects){
        this.name = name
        this.hp = hp
        this.ac = ac
        this.initiative = initiative
        this.dex = dex
        this.stateAndEffects = ""
    }
    modifyHp(value){
        this.hp = value    
    }
    increaseHp(value){
        this.hp += value
    }
    decreaseHp(value){
         this.hp -=value
    }
    modifyAc(value){
          this.ac = value
    }
    modifyInitiative(value){
        this.initiative = value
    }
    modifyStateAndEffects(string){
        this.stateAndEffects = string
    }
    

}
let combatList = []   // list of creatures in combat

function getCombatList(){
    return combatList
}
function compareIfPlayer(a,b){
    if(a.name.includes("P.") && b.name.includes("P.")){
        return b.initiative - a.initiative
    }
    else if(a.name.includes("P.")){
        return b.initiativeRoll - a.initiative 
    }
    else{ return b.initiative - a.initiativeRoll}
}
function sortCombatList(){
    //console.log("combatList before: ", combatList)
    combatList.sort((a,b) => {
        if(a.initiative || b.initiative){
            console.log("One is player")
            return compareIfPlayer(a,b)
        }
        if(b.initiativeRoll !== a.initiativeRoll){
            console.log("Sorting two non players")
            return b.initiativeRoll - a.initiativeRoll
        }
        else{
             console.log("Sorting by dex in combatlist")
             console.log(b.name, b.stats.dex, a.name, a.stats.dex)
             return Number(b.stats.dex) - Number(a.stats.dex)}  //se desempata por quien tiene mas dex
    })
    console.log("Combat list after: " , combatList )
}

async function addMonsterToCombatList(monsterName){
    console.log("Searching monster")
    const monster = await Creature.searchMonster(monsterName)
    if(monster !== 0){
        combatList.push(monster)
    }
    else{
        alert("Monster could not be added, Reason: doesnt exist or error connecting to API")
        console.log("Monster could not be added")
        return 0 // Control value
    }
}

let unitList = []

function createUnits(){
        var index = combatList.length
        const e = combatList[index -1] //Also could use combatList.at(-1) but i dont like it.
        console.log("Element e is:",e)
        const unit = new Unit(e.name, e.hp, e.ac, (e.init + e.d20()), e.stats.dex)
        e.initiativeRoll = unit.initiative
        unitList.push(unit)
}

function sortUnitList(){
    //console.log("Unit List before: ", unitList)
    unitList = unitList.sort((a,b) => {
      //  console.log(typeof b.dex, typeof a.dex)
        if(b.initiative !== a.initiative){
            return b.initiative - a.initiative
        }
        else{
            console.log("sorting by dex")
            return Number(b.dex) - Number(a.dex)}  //se desempata por quien tiene mas dex
    })
    console.log("sorting...")
    //console.log("UnitList after" , unitList)
}
async function newUnit(monsterName){
    const control = await addMonsterToCombatList(monsterName)
    if(control != 0){createUnits()}
}

export {Unit, addMonsterToCombatList, sortCombatList, getCombatList, sortUnitList, combatList, createUnits, unitList, newUnit}
