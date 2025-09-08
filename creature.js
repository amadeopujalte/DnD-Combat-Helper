class Action {
  constructor({ name, desc, attack_bonus = null, damage_dice = null }) {
    this.name = name;
    this.desc = desc;
    this.attack_bonus = attack_bonus;
    this.damage_dice = damage_dice;
  }
}

class Trait {
  constructor({ name, desc }) {
    this.name = name;
    this.desc = desc;
  }
}



class Creature {
  constructor({
    slug,    
    name,
    type,
    hit_points,
    armor_class,
    speed,         // Esperado: { walk, swim, burrow, fly }
    actions = [],
    stats,// { str, dex, con, int, wis, cha }
    saves,
    resistances = [],
    immunities = [],
    vulnerabilities = [],
    traits,
    features,
    hit_dice
  }) {
    this.slug = slug;
    this.name = name;
    this.type = type;
    this.hit_points = hit_points;
    this.armor_class = armor_class;

    // Velocidades individuales (null si no tiene)
    this.speed = {
      walk: speed.walk || 0,
      swim: speed.swim || 0,
      burrow: speed.burrow || 0,
      fly: speed.fly || 0
    }

    this.actions = actions
    this.stats = stats
    this.saves = saves
    this.resistances = resistances
    this.immunities = immunities
    this.vulnerabilities = vulnerabilities
    this.traits = traits
    this.hit_dice = hit_dice
    this.init = Math.floor((stats.dexterity-10)/2) //Initiative
    this.initiativeRoll
  }
    d20(){
       var roll = this.getRandomIntInclusive(1,20)
        return roll
        }
    d12(){
        var roll = this.getRandomIntInclusive(1,12)
        return roll
        }
    d10(){
        //The d10 also represents the percentile dice. 
        var roll = this.getRandomIntInclusive(1,12)
        return roll
        }
    d8(){
        var roll = this.getRandomIntInclusive(1,12)
        return roll
        }
     d6(){
        var roll = this.getRandomIntInclusive(1,12)
        return roll
        }
     d4(){
        var roll = this.getRandomIntInclusive(1,4)
        return roll
        }

    getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min)
        const maxFloored = Math.floor(max)
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    }
}

let creatureList = []
let homebrewCreatureList = []

function transformIntoSlug(monsterName){
    var slug =  monsterName.toLowerCase().replaceAll(' ', '-')
    return slug
}
async function searchMonster(monsterName){
    var monsterSlug = transformIntoSlug(monsterName)
    var monster
    monster =  creatureList.find(p => p.slug === monsterSlug) || homebrewCreatureList.find(p => p.slug === monsterSlug)
    if(!monster){
            monster = await getMonster(monsterSlug)
            console.log("monster is:" , monster)
            if(monster!== 0){
            // Adapta los monstruos extraidos del fecth a los datos de la clase Creature para poder usar cosas como iniative.
                monster = convertToCreature(monster)
                creatureList.push(monster)
            }
    }
    return monster
        }

async function getMonster(monsterSlug){
    console.log("getting monster by api")
    try{
    const response = await fetch(`https://api.open5e.com/v1/monsters/${monsterSlug}/`)
    var data = await response.json()
    var monster = data
    if(response.ok === true){
        return monster
    }

    else{
        console.log("Server Error", response)
        return 0}
    }
    catch(error){
        console.log("Error connecting to API.",error)
        return 0}
}


//Save creature List
//Save hombrew List

function createHomebrew(info){

let monster = {
    slug: transformIntoSlug(info.get("name")),
    name: info.get("name"),
    type: info.get("type"),
    hit_points: Number(info.get("hit_points")),
    armor_class: Number(info.get("armor_class")),
    hit_dice: info.get("hit_dice"),
    speed: {
        speed_walk: Number(info.get("speed_walk")),
        speed_climb: Number(info.get("speed_climb")),
        speed_fly: Number(info.get("speed_fly")),
        speed_burrow: Number(info.get("speed_burrow"))
    },
    strength: Number(info.get("strength")),
    dexterity: Number(info.get("dexterity")),
    constitution: Number(info.get("constitution")),
    intelligence: Number(info.get("intelligence")),
    wisdom: Number(info.get("wisdom")),
    charisma: Number(info.get("charisma")),
    saves:{
        strenght_save: Number(info.get("strength_save")),
        dexteruty_save: Number(info.get("dexterity_save")),
        constitution_save: Number(info.get("constitution_save")),
        intelligence_save: Number(info.get("intelligence_save")),
        wisdom_save: Number(info.get("wisdom_save")),
        charisma_save: Number(info.get("charisma_save")),
    },
    damage_resistances: info.getAll("damage_resistances"),
    damage_immunities: info.getAll("damage_immunities"),
    damage_vulnerabilities: info.getAll("damage_vulnerabilities"),
    condition_immunities: info.getAll("condition_immunities"),
    senses: info.getAll("senses"),

    actions: info.getAll("action_name").map((name, i) => ({
        name: name,
        desc: info.getAll("action_desc")[i]
    })),

    legendary_actions: info.getAll("legendary_action_name").map((name, i) => ({
        name: name,
        desc: info.getAll("legendary_action_desc")[i]
    })),

    special_abilities: info.getAll("special_ability_name").map((name, i) => ({
        name: name,
        desc: info.getAll("special_ability_desc")[i]
    })),
    spell_list: info.getAll("spell_name")
    }
    const homebrew = convertToCreature(monster)
    homebrewCreatureList.push(homebrew)
    console.log(homebrewCreatureList)
}

function removeHomebrew(homebrewName){
    console.log(homebrewCreatureList)
    var index = homebrewCreatureList.findIndex(e => e.name == homebrewName)
    if(index != -1){
        homebrewCreatureList.splice(index,1)
        alert("Homebrew Eliminated")
        console.log(homebrewCreatureList)
    }
    else{
        alert(`Homebrew named : ${homebrewName} doesnt exist`)
    }
}
function convertToCreature(monsterData) {
  const {
    slug,
    name,
    type,
    hit_points,
    armor_class,
    hit_dice,
    speed = {},
    actions = [],
    spell_list = [],
    legendary_actions = [],
    damage_resistances,
    damage_immunities,
    damage_vulnerabilities, 
    condition_immunities,
    strength, dexterity, constitution, intelligence, wisdom, charisma,
    strength_save, dexterity_save, constitution_save, intelligence_save, wisdom_save, charisma_save,
    special_abilities = [],
    senses = ""
  } = monsterData;

    // 1. Unificar acciones, hechizos y acciones legendarias
  const allActions = [
    ...actions,
    ...spell_list.map(spell => {
      const slug = spell.replace("https://api.open5e.com/v2/spells/", "").replaceAll("/", "");
      return {
        name: slug,
        desc: `<a href="https://dnd5e.wikidot.com/spell:${slug}" target="_blank">View spell on Wiki.</a>`,
      };
    }),
    ...(legendary_actions || []).map(la => ({
      name: la.name,
      desc: la.desc
    }))
  ];

  // 2. Construir stats
    let stats
        if(monsterData.stats){
             stats = {
                strength: Number(monsterData.stats.strength),
                dexterity: Number(monsterData.stats.dexterity),
                constitution: Number(monsterData.stats.constitution),
                intelligence: Number(monsterData.stats.intelligence),
                wisdom: Number(monsterData.stats.wisdom),
                charisma: Number(monsterData.stats.charisma)
        }
    }
        else{
             stats = {
                strength: Number(strength),
                dexterity: Number(dexterity),
                constitution: Number(constitution),
                intelligence: Number(intelligence),
                wisdom: Number(wisdom),
                charisma: Number(charisma)
        }
    }

    //Saves
    let saves
    if(monsterData.saves){
         saves = {
            strength_save: Number(monsterData.saves.strength_save),
            dexterity_save: Number(monsterData.saves.dexterity_save),
            constitution_save: Number(monsterData.saves.constitution_save),
            intelligence_save: Number(monsterData.saves.intelligence_save),
            wisdom_save: Number(monsterData.saves.wisdom_save),
            charisma_save: Number(monsterData.saves.charisma_save),
    }
    }
    else{
         saves = {
            strength_save: Number(strength_save),
            dexterity_save: Number(dexterity_save),
            constitution_save: Number(constitution_save),
            intelligence_save: Number(intelligence_save),
            wisdom_save: Number(wisdom_save),
            charisma_save: Number(charisma_save),
    }

    }
  // 3. Traits: convertir special_abilities y senses
  const traits = [
    ...(special_abilities || []).map(t => ({
      name: t.name,
      desc: t.desc
    })),
    ...(senses ? [{
      name: "Senses",
      desc: senses
    }] : [])
  ];

  // 5. Resistencias, inmunidades y vulnerabilidades como arrays
  const resistances = parseDelimitedList(damage_resistances);
  const immunities = [
    ...parseDelimitedList(damage_immunities),
    ...parseDelimitedList(condition_immunities)
  ];
  const vulnerabilities = parseDelimitedList(damage_vulnerabilities); 

  // 6. Crear instancia
  return new Creature({
    slug,
    name,
    type,
    hit_points: Number(hit_points),
    armor_class: Number(armor_class),
    speed,
    actions: allActions,
    stats,
    saves,
    resistances,
    immunities,
    vulnerabilities, 
    traits,
    hit_dice
  });
}

// Helper para convertir strings en arrays limpios
function parseDelimitedList(input) {
  if (!input || typeof input !== 'string') return [];
  return input
    .split(/[,;]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
} 
 
export { Creature, creatureList, homebrewCreatureList, createHomebrew, removeHomebrew, transformIntoSlug , searchMonster, getMonster, convertToCreature, parseDelimitedList }
