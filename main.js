import * as Creature from './creature.js'
import * as Unit from './unit.js'

var i = 0 //index (represents the current turn in the lists)

function renderTable(){
    //Document conecta el HTML especificamente de la tabla con la variable para poder modificarla
    const tbody = document.getElementById("table_stats")
    //Limpia lo que sea que haya dentro
    tbody.innerHTML= ""
    var index = 0
    Unit.unitList.forEach( (e) => {
        index = Unit.unitList.indexOf(e) 
        const row = document.createElement("tr")
        row.dataset.index = index

        const cellInitiative = document.createElement("td")
        cellInitiative.textContent = e.initiative
        cellInitiative.dataset.field = "initiative"

        const cellName = document.createElement("td")
        cellName.textContent = e.name.replace("P.","")
        cellName.dataset.field = "name"

        const cellHp = document.createElement("td")
        cellHp.textContent = e.hp
        cellHp.dataset.field = "hp"

        const cellAc = document.createElement("td")
        cellAc.textContent = e.ac
        cellAc.dataset.field = "ac"

        const cellStateEffects = document.createElement("td")
        cellStateEffects.textContent = e.stateAndEffects
        cellStateEffects.dataset.field = "stateAndEffects"

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
function resetRound(){
    const numRound = document.getElementById("current_round")
    numRound.innerHTML = ""
    numRound.textContent = 1

}
//funcion para Mostrar la info de cada uno.
function renderCreatureInfo(index){
    console.log("Index is:", index)
    const creature = Unit.combatList[index]
    console.log("creature to render is: ", Unit.combatList[index]) 
    const block = document.getElementById("creature_stats")
    block.innerHTML = ""
    //Chequeo si es player
    if(creature.name.includes("P.")){
        console.log("Player's turn", creature.name)
        const player = document.createElement("p")
        player.textContent = "Turn of : " + creature.name.replace("P.","")
        block.appendChild(player)
    }    
    else{
        const name = document.createElement("p")
        name.textContent = "Name: " + creature.name

        const type = document.createElement("p")
        type.textContent = "Type: " + creature.type

        const hp = document.createElement("p")
        hp.textContent = "HP: " + creature.hit_points

        const ac = document.createElement("p")
        ac.textContent = "AC: " + creature.armor_class

        const hitDice = document.createElement("p")
        hitDice.textContent = "Hit Dice: " + creature.hit_dice

        const initiative = document.createElement("p")
        initiative.textContent = "Initiative: " + creature.init
    
        const speed = document.createElement("p")
        const s = creature.speed
        speed.textContent = `Speed: Walk ${s.walk}, Swim ${s.swim}, Burrow ${s.burrow}, Fly ${s.fly}`
    
        const actions = document.createElement("p")
        actions.innerHTML =  "Actions: <br>"
        creature.actions.forEach(action => {
            actions.innerHTML += ` <b> ${action.name}: </b> <br>`
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
        stats.textContent = `Stats: STR ${st.strength} (${(Math.floor((st.strength - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.strength - 10) / 2)}), DEX ${st.dexterity} (${(Math.floor((st.dexterity - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.dexterity - 10) / 2)}), CON ${st.constitution} (${(Math.floor((st.constitution - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.constitution - 10) / 2)}), INT ${st.intelligence} (${(Math.floor((st.intelligence - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.intelligence - 10) / 2)}), WIS ${st.wisdom} (${(Math.floor((st.wisdom - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.wisdom - 10) / 2)}), CHA ${st.charisma} (${(Math.floor((st.charisma - 10) / 2) >= 0 ? '+' : '') + Math.floor((st.charisma - 10) / 2)})` 
        
        const saves = document.createElement("p")
        saves.textContent = `Saves: Str (${creature.saves.strength_save >= 0 ? '+' + creature.saves.strength_save : creature.saves.strength_save}), Dex (${creature.saves.dexterity_save >= 0 ? '+' + creature.saves.dexterity_save : creature.saves.dexterity_save}), Con(${creature.saves.constitution_save >= 0 ? '+' + creature.saves.constitution_save : creature.saves.constitution_save}), Int(${creature.saves.intelligence_save >= 0 ? '+' + creature.saves.intelligence_save : creature.saves.intelligence_save}), Wis(${creature.saves.wisdom_save >= 0 ? '+' + creature.saves.wisdom_save : creature.saves.wisdom_save}), Cha(${creature.saves.charisma_save >= 0 ? '+' + creature.saves.charisma_save : creature.saves.charisma_save})`

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
        block.appendChild(saves)
        console.log("rendering creature stats")
    }
}


function startCombat(){
    console.log("starting combat")
    var index = 0
    resetRound()
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
//New player button  //Corregir (creo que solucionado, o se bugea en un caso muy especifico)
document.getElementById("new_player").addEventListener("click", () => {
    var playerName = ""
    var playerHp = 0
    var playerAc = 0
    var playerInitiative = 0
    // Pedir nombre, HP, AC e iniciativa
    const inputName = document.createElement("input")
    inputName.type = "text"
    inputName.placeholder = "Enter player's name"
    document.body.appendChild(inputName)
    inputName.focus()
    inputName.addEventListener("keydown", async (event) => {
        if(event.key == "Enter"){
            playerName = "P."+ inputName.value
            inputName.remove()
            const unit = new Unit.Unit(playerName, playerHp, playerAc, playerInitiative)
            //como es el ultimo input que rellena, ponemos la creacion de la clase aca.
            Unit.unitList.push(unit)
            Unit.combatList.push(unit)
            renderTable()

        }})
    const inputHp = document.createElement("input")
    inputHp.type = "text"
    inputHp.placeholder = "Enter player's hp"
    document.body.appendChild(inputHp)
    inputHp.focus()
    inputHp.addEventListener("keydown", async (event) => {
        if(event.key == "Enter"){ 
            if(inputHp.value >= 0){
                playerHp = inputHp.value
                inputHp.remove()
        }
            else{ alert("Hp must be a number, below 0 is not valid, try again.")}
        }})

 const inputAc = document.createElement("input")
    inputAc.type = "text"
    inputAc.placeholder = "Enter player's armor class"
    document.body.appendChild(inputAc)
    inputAc.focus()
    inputAc.addEventListener("keydown", async (event) => {
        if(event.key == "Enter"){
            if(inputAc.value >= 0){
                playerAc = inputAc.value
                inputAc.remove()
        }
            else{ alert("AC must be a number, below 0 is not valid, try again")}
    }})

 const inputInitiative = document.createElement("input")
    inputInitiative.type = "text"
    inputInitiative.placeholder = "Enter player's initiative roll"
    document.body.appendChild(inputInitiative)
    inputInitiative.focus()
    inputInitiative.addEventListener("keydown", async (event) => {
        if(event.key == "Enter"){ 
            if(!isNaN(inputInitiative.value)){
                playerInitiative = inputInitiative.value
                inputInitiative.remove()
        }
            else{alert("The initiative must be a number")}
    }})
})

//Eliminate current creature Button
document.getElementById("eliminate").addEventListener("click", () => {
    Unit.unitList.splice(i,1) 
    Unit.combatList.splice(i,1)
    renderTable()
    renderCreatureInfo(i)
})

//Editar tabla
document.querySelector("#table_stats").addEventListener("click", (event) => {
    const cell = event.target
    if (cell.tagName !== "TD") return

    const index = cell.parentElement.dataset.index  
    const field = cell.dataset.field                
    const originalValue = Unit.unitList[index][field]

    // Limpiar celda y crear input
    cell.textContent = ""
    const input = document.createElement("input")
    input.type = "text"
    input.value = originalValue
    input.style.width = "50px"
    cell.appendChild(input)
    input.focus()

    if (field === "hp") {
        // Crear botones
        const btnAdd = document.createElement("button")
        btnAdd.textContent = "+"
        const btnSubtract = document.createElement("button")
        btnSubtract.textContent = "–"
        const btnSet = document.createElement("button")
        btnSet.textContent = "📝"

        cell.appendChild(btnAdd)
        cell.appendChild(btnSubtract)
        cell.appendChild(btnSet)

        btnAdd.addEventListener("click", () => {
            const number = parseInt(input.value)
            if (!isNaN(number)) {
                Unit.unitList[index].increaseHp(number)
                renderTable()
            }
        })

        btnSubtract.addEventListener("click", () => {
            const number = parseInt(input.value)
            if (!isNaN(number)) {
                Unit.unitList[index].decreaseHp(number)
                renderTable()
            }
        })

        btnSet.addEventListener("click", () => {
            const number = parseInt(input.value)
            if (!isNaN(number)) {
                Unit.unitList[index].modifyHp(number)
                renderTable()
            }
        })
    }
    else {
        function applyEdit(value) {
            if (!isNaN(value)) {
                const number = parseInt(value)
                if (number >= 0) {
                    switch (field) {
                        case "initiative":
                            Unit.unitList[index].modifyInitiative(number)
                            if(!Unit.combatList[index].name.includes("P.")){  //Cambia la iniciativa en la combatList
                                Unit.combatList[index].initiativeRoll = number
                            }
                            else{
                                Unit.combatList[index].init = number    
                            }
                            break
                        case "ac":
                            Unit.unitList[index].modifyAc(number)
                            break
                    }
                } 
                else {alert("Invalid number, cannot be below 0")}   
            } 
            else if(field == "name"){
                Unit.unitList[index].modifyName(value)
            }
            else {
                Unit.unitList[index].modifyStateAndEffects(value)
            }
            renderTable()
        }

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                applyEdit(input.value)
            }
        })

        input.addEventListener("blur", () => {
            applyEdit(input.value)
        })
    }

})

function addAction() {
  const container = document.getElementById("actions")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="action_name" placeholder="Nombre de la acción">
    <input type="text" name="action_desc" placeholder="Descripción">
    `
  container.appendChild(div)
}

function addLegendaryAction() {
  const container = document.getElementById("legendary_actions")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="legendary_name" placeholder="Nombre de legendary">
    <input type="text" name="legendary_desc" placeholder="Descripción">
  `
  container.appendChild(div)
}

function addSpecialAbility() {
  const container = document.getElementById("special_abilities")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="ability_name" placeholder="Nombre habilidad especial">
    <input type="text" name="ability_desc" placeholder="Descripción">
  `
  container.appendChild(div)
}

function addSpell() {
  const container = document.getElementById("spell_list")
  const input = document.createElement("input")
  input.type = "text"
  input.name = "spell_name"
  input.placeholder = "Nombre del hechizo"
  container.appendChild(input)
}
function addSense() {
  const container = document.getElementById("senses")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="sense_name" placeholder="Sense (e.g., darkvision)">
    <input type="text" name="sense_value" placeholder="Value (e.g., 60 ft.)"><br>
  `
  container.appendChild(div)
}

document.getElementById("eliminate_homebrew").addEventListener( "click", () =>{
        const input = document.createElement("input")
        input.type = "text"
        input.placeholder = "Homebrew's name"
        document.getElementById("eliminate_homebrew").appendChild(input)
        input.focus()
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const monsterName = input.value
                input.remove()
                Creature.removeHomebrew(monsterName)
            }
        })
    })

document.getElementById("create_homebrew").addEventListener("click" , () =>{
    const div = document.getElementById("create_homebrew_form")
    div.style.display = "block"
    document.getElementById("monster_form").addEventListener("click", (event) => {
        const dynamicFieldId = event.target.id
        switch(dynamicFieldId){
            case "button_actions":
                addAction()
                break
            case "button_legendary_actions":
                addLegendaryAction()
                break
            case "button_special_abilities":
                addSpecialAbility()
                break
            case "button_spells":
                addSpell()
                break
            case "button_senses":
                addSense()
                break;
        }
    })
document.getElementById("submit").addEventListener( "click" , () =>{
        const requiredFields = document.querySelectorAll("#monster_form [required]")
        console.log(requiredFields)
        const array = Array.from(requiredFields)
        if(array.some( e => e.value == "")){
            const missingFields = array.filter( e => e.value === "") 
            alert("Missing required fields: (" + missingFields.map( e => e.name).join(",") + ")")
        }
        else{
            const nameInput = document.querySelector('#monster_form input[name = "name"]')
            if(Creature.homebrewCreatureList.some(e => e.name == nameInput.value)){
                alert("Homebrew with this name already exists")
            }
            else{
                const form = document.getElementById("monster_form")
                const formData = new FormData(form)
                Creature.createHomebrew(formData)
                form.reset()
                document.getElementById("create_homebrew_form").style.display = "none"
                alert("monster added")
        }
        }
    })
    document.getElementById("cancel").addEventListener( "click", () =>{
        const form = document.getElementById("monster_form")
        form.reset()
        document.getElementById("create_homebrew_form").style.display = "none"
    }) 
})

window.addEventListener("beforeunload", () => {
    localStorage.setItem("homebrewList", JSON.stringify(Creature.homebrewCreatureList))
    localStorage.setItem("creatureList", JSON.stringify(Creature.creatureList))
})

//Both lists should start empty or else this may duplicate items
window.addEventListener("DOMContentLoaded", () => {
    const hbl = JSON.parse(localStorage.getItem("homebrewList"))
    const cl = JSON.parse(localStorage.getItem("creatureList"))

    if(hbl){
        const convertedHbl = hbl.map(e => Creature.convertToCreature(e))
        Creature.homebrewCreatureList.push(...convertedHbl)
    }
    if(cl){ 
        const convertedCl = cl.map(e => Creature.convertToCreature(e))
        Creature.creatureList.push(...convertedCl)
    }
})
