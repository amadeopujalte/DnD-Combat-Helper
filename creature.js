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
    hp,
    ac,
    speed,         // Esperado: { walk, swim, burrow, fly }
    actions = [],
    stats,         // { str, dex, con, int, wis, cha }
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
    this.hp = hp;
    this.ac = ac;

    // Velocidades individuales (null si no tiene)
    this.speed = {
      walk: speed.walk || 0,
      swim: speed.swim || 0,
      burrow: speed.burrow || 0,
      fly: speed.fly || 0
    };

    this.actions = actions;
    this.stats = stats;
    this.resistances = resistances;
    this.immunities = immunities;
    this.vulnerabilities = vulnerabilities;
    this.traits = traits;
    this.hit_dice = hit_dice;
    this.init = Math.floor((stats.dex-10)/2) //Initiative
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
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    }
}

let creatureList = []
let homebrewCreatureList = []

function transformIntoSlug(monsterName){
    var slug =  monsterName.toLowerCase().replace(' ', '-')
    return slug
}
async function searchMonster(monsterName){
    var monsterSlug = transformIntoSlug(monsterName)
    var monster
    monster =  creatureList.find(p => p.slug === monsterSlug) || homebrewCreatureList.find(p => p.slug === monsterSlug)
    if(!monster){
            monster = await getMonster(monsterSlug)
            if(monster!== 0){
            // Adapta los monstruos extraidos del fecth a los datos de la clase Creature para poder usar cosas como iniative.
                monster = convertToCreature(monster)
                creatureList.push(monster)
            }
    }
    return monster
        }

async function getMonster(monsterSlug){
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
  const stats = {
    str: strength,
    dex: dexterity,
    con: constitution,
    int: intelligence,
    wis: wisdom,
    cha: charisma
  };

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
    hp: hit_points,
    ac: armor_class,
    speed,
    actions: allActions,
    stats,
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
 
//Funciones a realizar
//Create homebrew creature
//Eliminate homebrew creature
export { Creature, creatureList, homebrewCreatureList, transformIntoSlug , searchMonster, getMonster, convertToCreature, parseDelimitedList }
