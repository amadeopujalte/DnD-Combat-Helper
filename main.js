import * as Creature from './creature.js'
import * as Unit from './unit.js'

var i = 0 //index (represents the current turn in the lists)

function renderTable(){
    //Document conecta el HTML especificamente de la tabla con la variable para poder modificarla
    const tbody = document.getElementById("table_stats")
    //Limpia lo que sea que haya dentro
    tbody.innerHTML= ""
    Unit.unitList.forEach( (e) => {
        const row = document.createElement("tr")

        const cellInitiative = document.createElement("td")
        cellInitiative.textContent = e.initiative

        const cellName = document.createElement("td")
        cellName.textContent = e.name

        const cellHp = document.createElement("td")
        cellHp.textContent = e.hp

        const cellAc = document.createElement("td")
        cellAc.textContent = e.ac

        const cellStateEffects = document.createElement("td")
        cellStateEffects.textContent = " "
        row.appendChild(cellInitiative)
        row.appendChild(cellName)
        row.appendChild(cellHp)
        row.appendChild(cellAc)
        row.appendChild(cellStateEffects)
        tbody.appendChild(row)
    })
    console.log("Tabla renderizada")
}

function addNewUnit(){
    const input = document.createElement("input")
    input.type = "text"
    input.id = "monster_name"
    input.placeholder = "Insert monster's name"
    document.body.appendChild(input)
    input.focus()
    input.addEventListener("keydown", async (event) => {
        if(event.key == "Enter"){
            const monster = input.value
            await Unit.newUnit(monster)
            input.remove()
            renderTable()
        }})
}
function updateRound(){
   const numRound = document.getElementById("current_round") 
   const newNum = Number(document.getElementById("current_round").textContent) +1
   numRound.innerHTML = ""
   numRound.textContent = newNum 
}
//funcion para Mostrar la info de cada uno.
function renderCreatureInfo(index){
    console.log("Index is:", index)
    const creature = Unit.combatList[index]
    console.log("creature to render is: ", Unit.combatList[index]) 
    const block = document.getElementById("creature_stats")
    block.innerHTML = ""

    const name = document.createElement("p")
    name.textContent = "Name: " + creature.name

    const type = document.createElement("p")
    type.textContent = "Type: " + creature.type

    const hp = document.createElement("p")
    hp.textContent = "HP: " + creature.hp

    const ac = document.createElement("p")
    ac.textContent = "AC: " + creature.ac

    const hitDice = document.createElement("p")
    hitDice.textContent = "Hit Dice: " + creature.hit_dice

    const initiative = document.createElement("p")
    initiative.textContent = "Initiative: " + creature.initiative
    
    const speed = document.createElement("p")
    const s = creature.speed
    speed.textContent = `Speed: Walk ${s.walk}, Swim ${s.swim}, Burrow ${s.burrow}, Fly ${s.fly}`
    
    const actions = document.createElement("p")
    actions.innerHTML = "Actions: <br>"
    creature.actions.forEach(action => {
        actions.innerHTML += `${action.name}:<br>`
        actions.innerHTML += `${action.desc}<br>` //La desc contiene tambien el atk bonus y damage dice
    })
    
    const vulnerabilities = document.createElement("p")
    vulnerabilities.textContent = "Vulnerabilities: " + creature.vulnerabilities.join(", ")

    const resistances = document.createElement("p")
    resistances.textContent = "Resistances: " + creature.resistances.join(", ")

    const immunities = document.createElement("p")
    immunities.textContent = "Immunities: " + creature.immunities.join(", ")

    const traits = document.createElement("p")
    traits.innerHTML = "Traits: <br>"
    creature.traits.forEach(trait => { 
        traits.innerHTML += `${trait.name}:<br>`
        traits.innerHTML += `${trait.desc}<br>` 
    })

    const stats = document.createElement("p")
    const st = creature.stats
   stats.textContent = `Stats: STR ${st.str} (${(Math.floor((st.str - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.str - 10) / 2)}), DEX ${st.dex} (${(Math.floor((st.dex - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.dex - 10) / 2)}), CON ${st.con} (${(Math.floor((st.con - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.con - 10) / 2)}), INT ${st.int} (${(Math.floor((st.int - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.int - 10) / 2)}), WIS ${st.wis} (${(Math.floor((st.wis - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.wis - 10) / 2)}), CHA ${st.cha} (${(Math.floor((st.cha - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.cha - 10) / 2)})` 
    
    block.appendChild(name)
    block.appendChild(type)
    block.appendChild(hp)
    block.appendChild(ac)
    block.appendChild(hitDice)
    block.appendChild(initiative)
    block.appendChild(speed)
    block.appendChild(actions)
    block.appendChild(vulnerabilities)
    block.appendChild(resistances)
    block.appendChild(immunities)
    block.appendChild(traits)
    block.appendChild(stats)
    console.log("rendering creature stats")

}


function startCombat(){
    console.log("starting combat")
    var index = 0
    console.log("when starting combat, unitlist: ", Unit.unitList)
    console.log("when starting combat, combatlist: ", Unit.combatList)
    renderCreatureInfo(index)
    return index
}

function next(index){
    console.log( index +1, ">", Unit.combatList.length -1)
    if(index + 1 > Unit.combatList.length -1){
        index = 0
        updateRound()
    }
    else{index += 1}
    console.log("next")
    console.log("index now", index)
    return index
}
//Buttons
// Start Combat Button
document.getElementById("start_combat").addEventListener("click", () => {
    console.log("starting combat")
    console.log("combatlist", Unit.combatList)
    console.log("unitList", Unit.unitList)
    i = startCombat()
    renderCreatureInfo(i)})
// Next button
document.getElementById("next").addEventListener("click", () =>{ 
    i = next(i)
    renderCreatureInfo(i)
    })
//New Unit button
document.getElementById("new_unit").addEventListener("click", addNewUnit)
//Sort Button
document.getElementById("sort").addEventListener("click", () =>{
    Unit.sortUnitList()
    Unit.sortCombatList()
    renderTable()
    renderCreatureInfo(i)})

//En index, poder escribir en current state and effects
//  *tal vez agregar la opcion de contador para cosas que necesiten turnos poder trackearlas.
//Poder modificar la tabla
//poder agregar los players
//Crear los homebrew
//
