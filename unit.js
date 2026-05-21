import * as Creature from "./creature.js"

class Unit{
    constructor( name,hp, ac, initiative, dex){
        this.name = name
        this.hp = hp
        this.ac = ac
        this.initiative = initiative
        this.dex = dex
        this.stateAndEffects = []
    }

    modifyName(name){
        this.name = name
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
    modifyStateAndEffects(form){
       const effect = {
            condition: form.get("effect"),
            endsAt: form.get("endsAt"), // || ""
            creature: form.get("creature"),
            duration: form.get("rounds")
        }
        this.stateAndEffects.push(effect)
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
    combatList.sort((a,b) => {
        if(a.initiative || b.initiative){
            return compareIfPlayer(a,b)
        }
        if(b.initiativeRoll !== a.initiativeRoll){
            return b.initiativeRoll - a.initiativeRoll
        }
        else{
             return Number(b.stats.dexterity) - Number(a.stats.dexterity)}  //se desempata por quien tiene mas dex
    })
}

async function addMonsterToCombatList(monsterName){
    const results = await Creature.searchMonster(monsterName)
    const monsterSlug = await Creature.selectSlugFromResults(results) //This await simply unwrapps the value form the promise. it does not have to wait
    if(monsterSlug == null){return 0}
    let monster = 0
    if(monsterSlug){ 
        monster = await Creature.getMonster(monsterSlug)
    }
    if(monster != 0){
        combatList.push(monster)
    }
    else{
        alert("Monster could not be added, Reason: does not exist or error connecting to API")
        return 0 // Control value
    }
}

let unitList = []

function getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min)
        const maxFloored = Math.floor(max)
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

function d20(){return getRandomIntInclusive(1,20)}
function createUnits(){
        var index = combatList.length
        const e = combatList[index -1] 
      //  console.log("Element e is:",e)
        const unit = new Unit(e.name, e.hit_points, e.armor_class, (e.init + d20()), e.stats.dexterity)
        e.initiativeRoll = unit.initiative
        unitList.push(unit)
}

function sortUnitList(){
    unitList = unitList.sort((a,b) => {
      //  console.log(typeof b.dex, typeof a.dex)
        if(b.initiative !== a.initiative){
            return b.initiative - a.initiative
        }
        else{
            return Number(b.dex) - Number(a.dex)}  
    })
}
async function newUnit(monsterName){
    const control = await addMonsterToCombatList(monsterName)
    if(control != 0){createUnits()}
}

export {Unit, addMonsterToCombatList, sortCombatList, getCombatList, sortUnitList, combatList, createUnits, unitList, newUnit}
