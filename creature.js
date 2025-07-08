
class Creature {
  constructor(slug,name, creatureType, cr, alignment, str, dex, con, int, wis, cha, hp, armorClass, speed) {
    this.slug = slug
    this.name = name
    this.creatureType = creatureType
    //this.isPlayer = isPlayer
    this.cr = cr
    this.alignment = alignment

    // Atributos
    this.hp = hp
    this.armorClass = armorClass
    this.speed = speed
    this.str = str
    this.dex = dex
    this.con = con
    this.wis = wis
    this.int = int
    this.cha = cha

    // Se calcula iniciativa a partir del modificador de DEX
    this.initiative = Math.floor((dex - 10) / 2)

    // Traits, features, actions
    this.traits = []
    this.features = []
    this.actions = []
    
    function d20(){
        roll = self.getRandomIntInclusive(1,20)
        return roll
        }
    function d12(){
        roll = self.getRandomIntInclusive(1,12)
        return roll
        }
 function d10(){
        roll = self.getRandomIntInclusive(1,12)
        return roll
        }
 function d8(){
        roll = self.getRandomIntInclusive(1,12)
        return roll
        }
 function d6(){
        roll = self.getRandomIntInclusive(1,12)
        return roll
        }
 function d4(){
        roll = self.getRandomIntInclusive(1,4)
        return roll
        }

    function getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}
  }
}
let creatureList = []
let homebrewCreatureList = []
//const MONSTERAPI = https://api.open5e.com/v1/monsters/

function transformIntoSlug(monsterName){
    monsterName.toLowerCase()
    monsterName.replace(' ', '-')
    return monsterName
}
async function searchMonster(monsterName){
    monsterSlug = transformIntoSlug(monsterName)
    var monster
    monster =  creatureList.find(p => p.slug === monsterSlug) || homebrewCreatureList.find(p => p.slug === monsterSlug)
    if(!monster){
        try{    
            const response = await fetch(`https://api.open5e.com/v1/monsters/${monsterSlug}/`)
            var data = await response.json()
            monster = data
            if(response.ok === true){
                creatureList.push(monster)
                }
            else{
                console.log("Server Error", response)
                return 0}
        }
        catch(error){
            console.log("Error connecting to API.",error)
            return 0}
    }
    return monster
}
//Funciones a realizar
//Create homebrew creature
//Eliminate homebrew creature
//Filtrar Info del monstruo (Tal vez)
