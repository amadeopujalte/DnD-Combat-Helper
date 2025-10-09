import { chooseMonster } from './main.js';
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
    languages, //expected {common, spanish, etc.}
    hit_points,
    armor_class,
    speed,         // expected: { walk, swim, burrow, fly }
    actions = [], //actions, spells, special abilities and legendary actions
    legendarySlots, //String expected 
    stats,// { str, dex, con, int, wis, cha }
    saves,
    resistances = [],
    immunities = [],
    vulnerabilities = [],
    traits,
    features,
    hit_dice,
    document__title
  }) {
    this.slug = slug
    this.name = name
    this.type = type
    this.languages = languages
    this.hit_points = hit_points
    this.armor_class = armor_class

    // Velocidades individuales (null si no tiene)
    this.speed = {
      walk: speed.walk || 0,
      swim: speed.swim || 0,
      burrow: speed.burrow || 0,
      fly: speed.fly || 0
    }
    this.actions = actions
    this.legendarySlots = legendarySlots
    this.stats = stats
    this.saves = saves
    this.resistances = resistances
    this.immunities = immunities
    this.vulnerabilities = vulnerabilities
    this.traits = traits
    this.hit_dice = hit_dice
    this.init = Math.floor((stats.dexterity-10)/2) //Initiative
    this.initiativeRoll = null
    this.document__title = document__title
  }

    getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min)
        const maxFloored = Math.floor(max)
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
    }
    d20(){return this.getRandomIntInclusive(1,20)}
}

let creatureList = []
let homebrewCreatureList = []

function transformIntoSlug(monsterName){
    var slug =  monsterName.toLowerCase().replaceAll(' ', '-')
    return slug
}
function normalizeName(monsterName){
    var normalized = (monsterName.toLowerCase().split(/\s+/)).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    .trim()
    return normalized
}
async function filterApiByName(monsterName){
    try{
    const response = await fetch(`https://api.open5e.com/v1/monsters/?search=${monsterName}&limit=80`)
    var data = await response.json()
    var monsterList = data.results.filter(creature => creature.name.includes(monsterName))
    //console.log(data)
    //console.log("monsterList: ", monsterList)
    if(response.ok === true){
        return monsterList
    }

    else{
        console.log("Server Error", response)
        return 0}
    }
    catch(error){
        console.log("Error connecting to API.",error)
        return 0}
}
function filterLocalByName(monsterName){
    let lista1 = creatureList.filter(creature  => creature.name.startsWith(monsterName))
    let lista2 = homebrewCreatureList.filter( e => e.name.startsWith(monsterName))
    return [...lista1, ...lista2]
}

async function searchMonster(monsterName){
    var name = normalizeName(monsterName)
    let localResults = filterLocalByName(name)
    let apiResults = await filterApiByName(name)
    apiResults = apiResults.filter(creature => !localResults.some(local => local.slug === creature.slug)) //Desduplicate
    let lists = {
        local: localResults,
        api: apiResults
        }
    return lists
}

async function selectSlugFromResults(results){
    if(results.local.length == 0 && results.api.length == 0){
        console.log("cero results")    
        return 0
    }
    if(results.local.length == 1 && results.api.length == 0){
        return results.local[0].slug
    }
     if(results.local.length == 0 && results.api.length == 1){
        return results.api[0].slug
    }
    else{
        const monster =  await chooseMonster(results)
        if(!monster){return null}
        return monster.slug
    } 
}
async function getMonster(monsterSlug){
    if(monsterSlug == 0){return monsterSlug}
    var monster =  creatureList.find(p => p.slug === monsterSlug) || homebrewCreatureList.find(p => p.slug === monsterSlug)
    if(!monster){
            monster = await fetchMonster(monsterSlug)
            if(monster!== 0){
                monster = convertToCreature(monster)
                creatureList.push(monster)
            }
    }
    return monster
        }
async function fetchMonster(monsterSlug){
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

function createHomebrew(info){

let monster = {
    slug: transformIntoSlug(info.get("name")),
    name: info.get("name"),
    type: info.get("type"),
    languages: info.get("languages"),
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
    legendarySlots: info.get("legendarySlots"),
    legendary_actions: info.getAll("legendary_action_name").map((name, i) => ({
        name: name,
        desc: info.getAll("legendary_action_desc")[i]
    })),

    special_abilities: info.getAll("special_ability_name").map((name, i) => ({
        name: name,
        desc: info.getAll("special_ability_desc")[i]
    })),
    spell_list: info.getAll("spell_name"),
    document__title: "homebrew"
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
    languages,
    hit_points,
    armor_class,
    hit_dice,
    speed = {},
    actions = [],
    spell_list = [],
    legendary_actions = [],
    legendary_desc,
    damage_resistances,
    damage_immunities,
    damage_vulnerabilities, 
    condition_immunities,
    strength, dexterity, constitution, intelligence, wisdom, charisma,
    strength_save, dexterity_save, constitution_save, intelligence_save, wisdom_save, charisma_save,
    special_abilities = [],
    senses = "",
    document__title
  } = monsterData;
    // Unifies actions, spells and legendary actions
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
      name: "(L) " + la.name,
      desc: la.desc
    }))
  ];

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
  const traits = [
    ...(special_abilities || []).map(t => ({
      name: t.name,
      desc: t.desc
    })),
    ...(senses ? [{
      name: "Senses",
      desc: senses
    }] : [])
  ]

  const resistances = parseDelimitedList(damage_resistances)
  const immunities = [
    ...parseDelimitedList(damage_immunities),
    ...parseDelimitedList(condition_immunities)
  ];
  const vulnerabilities = parseDelimitedList(damage_vulnerabilities) 

  return new Creature({
    slug,
    name,
    type,
    languages: languages || "",
    hit_points: Number(hit_points),
    armor_class: Number(armor_class),
    speed,
    actions: allActions,
    legendarySlots: legendary_desc,
    stats,
    saves,
    resistances,
    immunities,
    vulnerabilities, 
    traits,
    hit_dice,
    document__title: document__title
  });
}

function parseDelimitedList(input) {
  if (!input || typeof input !== 'string') return [];
  return input
    .split(/[,;]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
} 
 
export { Creature, creatureList, homebrewCreatureList, createHomebrew, removeHomebrew, transformIntoSlug , searchMonster, getMonster, selectSlugFromResults, convertToCreature, parseDelimitedList }
