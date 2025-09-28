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
            console.log("One is player")
            return compareIfPlayer(a,b)
        }
        if(b.initiativeRoll !== a.initiativeRoll){
            console.log("Sorting two non players")
            return b.initiativeRoll - a.initiativeRoll
        }
        else{
             console.log("Sorting by dex in combatlist")
             console.log(b.name, b.stats.dexterity, a.name, a.stats.dexterity)
             return Number(b.stats.dexterity) - Number(a.stats.dexterity)}  //se desempata por quien tiene mas dex
    })
}

async function addMonsterToCombatList(monsterName){
    console.log("Searching monster")
    const results = await Creature.searchMonster(monsterName)
    const monsterSlug = await Creature.selectSlugFromResults(results) //This await simply unwrapps the value form the promise. it does not have to wait
    if(!monsterSlug){return 0}
    console.log("monsterSlug in AddMonsterTocomabtList: ",monsterSlug)
    const monster = await Creature.getMonster(monsterSlug)
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
        const e = combatList[index -1] 
      //  console.log("Element e is:",e)
        const unit = new Unit(e.name, e.hit_points, e.armor_class, (e.init + e.d20()), e.stats.dexterity)
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
            console.log("sorting by dex")
            return Number(b.dex) - Number(a.dex)}  //se desempata por quien tiene mas dex
    })
    console.log("sorting...")
}
async function newUnit(monsterName){
    const control = await addMonsterToCombatList(monsterName)
    if(control != 0){createUnits()}
}

export {Unit, addMonsterToCombatList, sortCombatList, getCombatList, sortUnitList, combatList, createUnits, unitList, newUnit}
