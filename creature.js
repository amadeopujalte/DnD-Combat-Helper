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
    key,    
    name,
    type,
    languages, //{orc, common , ...}
    hit_points,
    armor_class,
    cr,
    speed,         // expected: { walk, swim, burrow, fly }
    actions = [], //actions, spells, special abilities and legendary actions
    legendarySlots, //String expected 
    stats,// { str, dex, con, int, wis, cha }
    saves,
    resistances = [],
    immunities = [],
    vulnerabilities = [],
    traits,
    hit_dice,
    init,
    document__title
  }) {
    this.key = key
    this.name = name
    this.type = type
    this.languages = languages
    this.hit_points = hit_points
    this.armor_class = armor_class
    this.cr = cr

    this.speed = {
      walk: speed.walk || 0,
      swim: speed.swim || 0,
      burrow: speed.burrow || 0,
      climb: speed.burrow || 0,
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
    this.init = init //Initiative
    this.initiativeRoll = null
    this.document__title = document__title
  }

}

let creatureList = []
let homebrewCreatureList = []

function normalizeName(monsterName){
    var normalized = (monsterName.toLowerCase().split(/\s+/)).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    .trim()
    return normalized
}
async function filterApiByName(monsterName){
    try{
    const response = await fetch(`https://api.open5e.com/v2/creatures/?name__icontains=${monsterName}&limit=20`)
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
    apiResults = apiResults.filter(creature => !localResults.some(local => local.key === creature.key)) //Desduplicate
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
        return results.local[0].key
    }
     if(results.local.length == 0 && results.api.length == 1){
        return results.api[0].key
    }
    else{
        const monster =  await chooseMonster(results)
        if(!monster){return null}
        return monster.key
    } 
}
async function getMonster(monsterKey){
  //console.log(monsterKey)
    if(monsterKey == 0){return monsterKey}
    var monster =  creatureList.find(p => p.key === monsterKey) || homebrewCreatureList.find(p => p.key === monsterKey)
    if(!monster){
            //console.log("fetching monster")
            monster = await fetchMonster(monsterKey)
            if(monster!== 0){
                monster = convertToCreature(monster)
                creatureList.push(monster)
            }
    }
    return monster
        }
async function fetchMonster(monsterKey){
    //console.log("getting monster by api")
    try{
    const response = await fetch(`https://api.open5e.com/v2/creatures/${monsterKey}`)
    var data = await response.json()
    var monster = data
    //console.log("Monster fetched: ", monster)
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
  const monster = {
    key: normalizeName(info.get("name")),
    name: normalizeName(info.get("name")),
    type: { name: info.get("type") },
    languages: { as_string: info.get("languages") },
    hit_points: Number(info.get("hit_points")),
    armor_class: Number(info.get("armor_class")),
    challenge_rating: Number(info.get("cr")),
    hit_dice: info.get("hit_dice"),
    initiative_bonus: Math.floor(Number((Number(info.get("dexterity") - 10)/2))),
    speed_all: {
      walk:   Number(info.get("speed_walk")),
      fly:    Number(info.get("speed_fly")),
      climb:  Number(info.get("speed_climb")),
      burrow: Number(info.get("speed_burrow")),
      swim:   Number(info.get("speed_swim")),
    },
    ability_scores: {
      strength:     Number(info.get("strength")),
      dexterity:    Number(info.get("dexterity")),
      constitution: Number(info.get("constitution")),
      intelligence: Number(info.get("intelligence")),
      wisdom:       Number(info.get("wisdom")),
      charisma:     Number(info.get("charisma")),
    },
    saving_throws_all: {
      strength:     Number(info.get("strength_save")),
      dexterity:    Number(info.get("dexterity_save")),
      constitution: Number(info.get("constitution_save")),
      intelligence: Number(info.get("intelligence_save")),
      wisdom:       Number(info.get("wisdom_save")),
      charisma:     Number(info.get("charisma_save")),
    },
    resistances_and_immunities: {
      damage_resistances:          info.getAll("damage_resistances").map(r => ({ name: r })),
      damage_immunities:           info.getAll("damage_immunities").map(i => ({ name: i })),
      damage_vulnerabilities:      info.getAll("damage_vulnerabilities").map(v => ({ name: v })),
      condition_immunities:        info.getAll("condition_immunities").map(c => ({ name: c })),
    },
    senses: info.get("senses") || "",
    traits: info.getAll("special_ability_name").map((name, i) => ({
      name,
      desc: info.getAll("special_ability_desc")[i]
    })),
    actions: [
      ...info.getAll("action_name").map((name, i) => ({
        name,
        desc: info.getAll("action_desc")[i],
        action_type: "ACTION",
        legendary_action_cost: null,
        order_in_statblock: i + 1,
      })),
      ...info.getAll("legendary_action_name").map((name, i) => ({
        name,
        desc: info.getAll("legendary_action_desc")[i],
        action_type: "LEGENDARY_ACTION",
        legendary_action_cost: 1,
        order_in_statblock: i + 1,
      })),
    ],
    legendarySlots: info.get("legendarySlots"),
    document: { display_name: "Homebrew" },
  }

  const homebrew = convertToCreature(monster)
  homebrewCreatureList.push(homebrew)
 // console.log(homebrewCreatureList)

}

function removeHomebrew(homebrewName){
   // console.log(homebrewCreatureList)
    var index = homebrewCreatureList.findIndex(e => e.name == homebrewName)
    if(index != -1){
        homebrewCreatureList.splice(index,1)
        alert("Homebrew Eliminated")
    }
    else{
        alert(`Homebrew named : ${homebrewName} doesnt exist`)
    }
}
function convertToCreature(monsterData) {
 const {
    key,
    name,
    type,
    languages,
    hit_points,
    armor_class,
    challenge_rating,
    initiative_bonus,
    hit_dice,
    speed_all = {},
    actions = [],
    traits = [],
    senses = "",
    resistances_and_immunities = {},
    ability_scores = {},
    saving_throws_all = {},
    document,
  } = monsterData
  const { walk, fly, burrow, swim, climb } = monsterData.speed_all ?? {}
  const regularActions = actions
    .filter(a => a.action_type === "ACTION")
    .map(a => ({ name: a.name, desc: a.desc }))

  const legendaryActions = actions
    .filter(a => a.action_type === "LEGENDARY_ACTION" && a.legendary_action_cost)
    .map(a => ({ name: "(L) " + a.name, desc: a.desc }))

  const allActions = [...regularActions, ...legendaryActions]

  const stats = {
    strength:     Number(ability_scores.strength),
    dexterity:    Number(ability_scores.dexterity),
    constitution: Number(ability_scores.constitution),
    intelligence: Number(ability_scores.intelligence),
    wisdom:       Number(ability_scores.wisdom),
    charisma:     Number(ability_scores.charisma),
  };

  const saves = {
    strength_save:     Number(saving_throws_all.strength),
    dexterity_save:    Number(saving_throws_all.dexterity),
    constitution_save: Number(saving_throws_all.constitution),
    intelligence_save: Number(saving_throws_all.intelligence),
    wisdom_save:       Number(saving_throws_all.wisdom),
    charisma_save:     Number(saving_throws_all.charisma),
  };

  const allTraits = [
    ...traits.map(t => ({ name: t.name, desc: t.desc })),
    ...(senses ? [{ name: "Senses", desc: senses }] : []),
  ]
  const resistances = resistances_and_immunities.damage_resistances.map(r => r.name)
  const immunities = [
    ...resistances_and_immunities.damage_immunities.map(i => i.name),
    ...resistances_and_immunities.condition_immunities.map(i => i.name),
  ]
const vulnerabilities = resistances_and_immunities.damage_vulnerabilities.map(v => v.name)
  
  const legendarySlots = actions
    .find(a => a.action_type === "LEGENDARY_ACTION" && a.order_in_statblock === 0)
    ?.desc || null

  return new Creature({
    key: key,
    name,
    type: type?.name || type,
    languages: languages?.as_string || "",
    hit_points: Number(hit_points),
    armor_class: Number(armor_class),
    cr: Number(challenge_rating),
    speed: {walk, fly, burrow, swim, climb},
    init: initiative_bonus,
    actions: allActions,
    legendarySlots,
    stats,
    saves,
    resistances,
    immunities,
    vulnerabilities,
    traits: allTraits,
    hit_dice,
    document__title: document?.display_name || "",
  })
}
 
export { Creature, creatureList, homebrewCreatureList, createHomebrew, removeHomebrew , searchMonster, getMonster, selectSlugFromResults, convertToCreature}
