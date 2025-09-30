import * as Creature from './creature.js'
import * as Unit from './unit.js'

var i = 0 //index (represents the current turn in the lists)

function highlightCurrentCreature(index){
    if(Unit.combatList.length == 0){return}
    const table = document.getElementById("table_stats")
    const currentRow = table.querySelector(`tr[data-index="${index}"]`)
    if(index > 0){
        const formerRow = table.querySelector(`tr[data-index="${index -1}"]`)
        formerRow.classList.remove("highlight")
    }
        currentRow.classList.add("highlight")
}

function renderTable(){
    const tbody = document.getElementById("table_stats")
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

        cellStateEffects.innerHTML = e.stateAndEffects.map((effect, i) => 
            `${effect.condition} ${effect.duration ? effect.duration + "⏳" : ""}
            <button type="button"
            class="removeEffect"
            data-unit="${index}" 
            data-effect="${i}"> 
                🗑️ </button>`
        ).join("<br>") 
        cellStateEffects.dataset.field = "stateAndEffects"
    
        const cellActions = document.createElement("td")
        cellActions.dataset.field = "actions"
        cellActions.innerHTML = 
        `<button type="button"
            class = "seeStats"
            title = "See Stat block"
            data-unit="${index}">  
               👁 </button>`

        row.appendChild(cellInitiative)
        row.appendChild(cellName)
        row.appendChild(cellHp)
        row.appendChild(cellAc)
        row.appendChild(cellStateEffects)
        row.appendChild(cellActions)
        tbody.appendChild(row)
    })
        highlightCurrentCreature(i)
        console.log("Tabla renderizada")
}

function addNewUnit(){
    const input = document.createElement("input")
    input.type = "text"
    input.id = "monster_name"
    input.placeholder = "Insert monster's name"
    document.getElementById("table_stats").appendChild(input)
    input.focus()
    input.addEventListener("keydown", async (event) => {
        if(event.key == "Enter"){
            const monster = input.value
            await Unit.newUnit(monster)
            input.remove()
            renderTable()
        }
        if(event.key == "Escape"){
                input.remove()
                return
            }
        })
}
function checkConditions(index,beginOfTurn){
    if(!Unit.unitList[index]){return}
    let unitsToCheck = []
    const moment = beginOfTurn ? "start" : "end"       
    const creatureName = Unit.unitList[index].name
    if (!creatureName) return
        Unit.unitList.forEach(u => {
            u.stateAndEffects
            .filter(c => c.creature === creatureName && c.endsAt === moment)
            .forEach(c => { c.duration = Math.max(0, (c.duration ?? 0) - 1) })})
    updateConditions()
}

function updateConditions(){
    Unit.unitList.forEach(u => {
        u.stateAndEffects = u.stateAndEffects.filter(c => c.duration !== 0)
    })
  //renderTable(); Not necessary as it is done in next()
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
function renderCreatureInfo(index, whereId){
    if(!Unit.combatList[index]){return}
    
    const creature = Unit.combatList[index]
    console.log("creature to render is: ", Unit.combatList[index]) 
    
    let block = document.getElementById(whereId)
    if(!block){
        block = document.createElement("div")
        block.id = "viewer_statBlock"
        document.getElementById("creature_stats").appendChild(block)
    }

    block.innerHTML = ""
    if(block.style.display == "none"){block.style.display = "block"}
    const panel = document.createElement("h3")
    if(whereId == "current_statBlock"){
        panel.textContent = "Actual"
    }
    else{panel.textContent = "Selected"}
    
    if (whereId === "viewer_statBlock") {
        const close = document.createElement("button")
        close.textContent = "✖"
        close.title = "Close panel"
        close.className = "closeBtn"
        close.addEventListener("click", () => {
            block.innerHTML = ""
            panel.innerHTML = ""
            block.style.display = "none"
        })

        panel.appendChild(close)
    }

    block.appendChild(panel)
    //Chequeo si es player
    if(creature.name.includes("P.")){
        console.log("Player's turn", creature.name)
        const player = document.createElement("p")
        player.textContent = "Turn of : " + creature.name.replace("P.","")
        block.appendChild(player)
    }    
    else{
        const name = document.createElement("p")
        name.textContent = "Name: " + creature.name + (creature.name != Unit.unitList[index].name ? " (" + Unit.unitList[index].name + ")" : "")

        const type = document.createElement("p")
        type.textContent = "Type: " + creature.type

        const lang = document.createElement("p")
        lang.textContent = "Languages: " + (creature.languages  ? creature.languages : "none")

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
    
        const legendarySlots = document.createElement("p")
        legendarySlots.textContent = creature.legendarySlots ? creature.legendarySlots + " Those with (L)" : ""

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
        block.appendChild(lang)
        block.appendChild(hp)
        block.appendChild(ac)
        block.appendChild(hitDice)
        block.appendChild(initiative)
        block.appendChild(speed)
        block.appendChild(legendarySlots)
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
    renderCreatureInfo(index,"current_statBlock")
    return index
}

function next(index){
    checkConditions(index,false) //BeginOfTurn = false 
    if(index + 1 > Unit.combatList.length -1){
        index = 0
        updateRound()
    }
    else{index += 1}
    checkConditions(index,true)
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
    renderCreatureInfo(i,"current_statBlock")})
// Next button
document.getElementById("next").addEventListener("click", () =>{ 
    i = next(i)
    renderTable()
    renderCreatureInfo(i,"current_statBlock")
    })
//New Unit button
document.getElementById("new_unit").addEventListener("click", addNewUnit)
//Sort Button
document.getElementById("sort").addEventListener("click", () =>{
    if(!Unit.unitList){return}
    Unit.sortUnitList()
    Unit.sortCombatList()
    renderTable()
    renderCreatureInfo(i,"current_statBlock")})

//New player button 
document.getElementById("new_player").addEventListener("click", () => {
    const form = document.createElement("form")
    form.id = "playerForm"

    const inputName = document.createElement("input")
    inputName.type = "text"
    inputName.placeholder = "Enter player's name"
    inputName.name = "name"
    inputName.required = true
    form.appendChild(inputName)

    const inputHp = document.createElement("input")
    inputHp.type = "number"
    inputHp.placeholder = "Enter player's HP"
    inputHp.name = "hp"
    inputHp.min = 0
    inputHp.required = true
    form.appendChild(inputHp)

    const inputAc = document.createElement("input")
    inputAc.type = "number"
    inputAc.placeholder = "Enter player's armor class"
    inputAc.name = "ac"
    inputAc.min = 0
    inputAc.required = true
    form.appendChild(inputAc)

    const inputInitiative = document.createElement("input")
    inputInitiative.type = "number"
    inputInitiative.placeholder = "Enter player's initiative roll"
    inputInitiative.name = "initiative"
    inputInitiative.required = true
    form.appendChild(inputInitiative)
    
    const submitBtn = document.createElement("button")
    submitBtn.type = "submit"
    submitBtn.textContent = "Add Player"
    form.appendChild(submitBtn)


    document.getElementById("table").appendChild(form)
    inputName.focus()
    // Listener del form
    form.addEventListener("submit", (event) => {
        event.preventDefault() 
        if (!form.checkValidity()) {
        form.reportValidity()
        return
        }
    const data = new FormData(form)
    const playerName = "P." + data.get("name")
    const playerHp = Number(data.get("hp"))
    const playerAc = Number(data.get("ac"))
    const playerInitiative = Number(data.get("initiative"))

    const unit = new Unit.Unit(playerName, playerHp, playerAc, playerInitiative)
    Unit.unitList.push(unit)
    Unit.combatList.push(unit)

    form.reset()
    form.remove()
    renderTable()
    })
    const cancelBtn = document.createElement("button")
    cancelBtn.type = "button"
    cancelBtn.textContent = "Cancel"
    cancelBtn.addEventListener("click", () => {
        form.reset()
        form.remove()     
        })
    form.appendChild(cancelBtn)
})

//Eliminate current creature Button
document.getElementById("eliminate").addEventListener("click", () => {
    if(!Unit.unitList[i]){return}
    Unit.unitList.splice(i,1) 
    Unit.combatList.splice(i,1)
    renderTable()
    renderCreatureInfo(i,"current_statBlock")
})
//RemoveEffect buttons
document.getElementById("table_stats").addEventListener("click", (event) =>{
    if(event.target.matches(".removeEffect")){
        const btn = event.target
        const unitId = Number(btn.dataset.unit);
        const effectId = Number(btn.dataset.effect);
        Unit.unitList[unitId].stateAndEffects.splice(effectId, 1);
        renderTable()
    }
})
//See Stat block buttons
document.getElementById("table_stats").addEventListener("click", (event) => {
     if(event.target.matches(".seeStats")){
    const btn = event.target
    const unit = Number(btn.dataset.unit);
    renderCreatureInfo(unit,"viewer_statBlock")
    
}
})

//Edit table
document.querySelector("#table_stats").addEventListener("click", (event) => {
    const cell = event.target
    if (cell.tagName !== "TD") return

    const index = cell.parentElement.dataset.index  
    const field = cell.dataset.field                
    const originalValue = Unit.unitList[index][field]
    
    if(field == "actions"){return}
   
    cell.textContent = ""
    const input = document.createElement("input")
    input.type = "text"
    input.value = originalValue
    input.style.width = "50px"
    cell.appendChild(input)
    input.focus()

    if (field === "hp") {
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
    else if(field == "stateAndEffects"){
        input.remove() //Como uso el form este no me sirve    
        const form = document.createElement("form")
    
        const conditionInput = document.createElement("input")
        conditionInput.type = "text"
        conditionInput.placeholder = "effect"
        conditionInput.required = true
        conditionInput.name = "effect"

        const label = document.createElement("label")
        const advancedInput = document.createElement("input")
        advancedInput.type = "checkbox"
        const text = document.createTextNode("Advanced options")

        label.appendChild(advancedInput)
        label.appendChild(text)
        
        form.appendChild(conditionInput)
        form.appendChild(label) 

        const advancedDiv = document.createElement("div")
        advancedDiv.style.display = "none"

        const labelStart = document.createElement("label")
        const text1 = document.createTextNode("Until the start of ... 's turn")
        const endsAtStart = document.createElement("input")
        endsAtStart.type = "radio"
        endsAtStart.name = "endsAt"
        endsAtStart.value = "start"
        endsAtStart.required = false
        labelStart.appendChild(text1)
        labelStart.appendChild(endsAtStart)
        advancedDiv.appendChild(labelStart)

        const labelEnd = document.createElement("label")
        const text2 = document.createTextNode("Until the end of... 's turn")
        const endsAtEnd = document.createElement("input")
        endsAtEnd.type = "radio"
        endsAtEnd.name = "endsAt"
        endsAtEnd.value = "end"
        labelEnd.appendChild(text2)
        labelEnd.appendChild(endsAtEnd)
        advancedDiv.appendChild(labelEnd)

        const creature = document.createElement("input")
        creature.type = "search"
        creature.placeholder = "creature's name"
        creature.required = false
        creature.autocomplete = "on"
        creature.name = "creature"
        let datalist = document.getElementById("creatures-datalist")
        if (!datalist) {
            datalist = document.createElement("datalist")
            datalist.id = "creatures-datalist"
            }
            datalist.innerHTML = ""  
            Unit.unitList.forEach(e => {
                const opt = document.createElement("option")
                opt.value = e.name
                datalist.appendChild(opt)
                })
        creature.setAttribute("list", datalist.id);
        advancedDiv.appendChild(creature)
        document.body.appendChild(datalist)

        const duration = document.createElement("input")
        duration.type = "number"
        duration.name = "rounds"
        duration.placeholder = "rounds"
        duration.required = false
        duration.min = 1
        duration.step = 1
        advancedDiv.appendChild(duration)

        form.appendChild(advancedDiv)
        
        advancedInput.addEventListener("change", () =>{
            advancedDiv.style.display = advancedInput.checked ? "block" : "none"
            creature.required = !creature.required
            duration.required = !duration.required
            endsAtStart.required = !endsAtStart.required
        })

        const submit = document.createElement("button")
        submit.type = "submit"
        submit.textContent = "create"
        form.addEventListener("submit", (e) => {
        if (!form.checkValidity()) {
            e.preventDefault()
            form.reportValidity()
            if(creature.value.toLowerCase() != Unit.unitList.some(e => e.toLowerCase)){
                    alert("Creature not in the encounter")
            }            
            return
        }
        e.preventDefault()
        const data = new FormData(form)
        Unit.unitList[index].modifyStateAndEffects(data)
        form.reset()
        renderTable()
        })

        form.appendChild(submit)

        const cancel = document.createElement("button")
        cancel.type = "reset"
        cancel.textContent = "cancel"
        cancel.addEventListener("click", () =>{
            form.reset()
            renderTable()
        })
        form.appendChild(cancel)
        cell.appendChild(form)
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
            else {  //Name
                Unit.unitList[index].modifyName(value)
            }
            }
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                applyEdit(input.value)
                renderTable()
            }
            if(e.key === "Escape"){
                renderTable() //cancels
            }
        })

        input.addEventListener("blur", () => {
            applyEdit(input.value)
            renderTable()
        })
    }
})



function addAction() {
  const container = document.getElementById("actions")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="action_name" placeholder=" action's name">
    <input type="text" name="action_desc" placeholder="description">
    `
  container.appendChild(div)
}

function addLegendaryAction() {
  const container = document.getElementById("legendary_actions")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="legendary_name" placeholder="legendary action's name">
    <input type="text" name="legendary_desc" placeholder="description">
  `
  container.appendChild(div)
}

function addSpecialAbility() {
  const container = document.getElementById("special_abilities")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="ability_name" placeholder="special ability's name">
    <input type="text" name="ability_desc" placeholder="description">
  `
  container.appendChild(div)
}

function addSpell() {
  const container = document.getElementById("spell_list")
  const input = document.createElement("input")
  input.type = "text"
  input.name = "spell_name"
  input.placeholder = "spell's name"
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
            if(e.key === "Escape"){
                input.remove()
                return
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

function makeDialog(results){
  return new Promise((resolve,reject) => {
    const dialog = document.createElement("dialog")
    dialog.className = "dialog"
    dialog.innerHTML = `
      <form method="dialog">
        <h3>Choose creature:</h3>
        <p> [Name , Hp, Ac, source] </p>
        <div style="display:flex">
          <section>
            <h4>Already Used (local list)</h4>
            <ul id="local"></ol>
          </section>
          <section>
            <h4>Others</h4>
            <ul id="api"></ol>
          </section>
        </div>
        <button type="button" id="cancel" style="color: black">Cancel</button>
      </form>
    `

    const localList = dialog.querySelector("#local")
    const apiList   = dialog.querySelector("#api")

    results.local.forEach((e, i) => {
      const li = document.createElement("li")
      li.dataset.index = i
      li.dataset.list  = "local"
      li.textContent   = `[ ${e.name}, ${e.hit_points}, ${e.armor_class}, ${e.document__title} ]`
      localList.appendChild(li)
    })

    results.api.forEach((e, j) => {
      const li = document.createElement("li")
      li.dataset.index = j
      li.dataset.list  = "api" 
      li.textContent   = `[ ${e.name}, ${e.hit_points}, ${e.armor_class}, ${e.document__title} ]`
      apiList.appendChild(li)
    })

    document.body.appendChild(dialog)
    dialog.showModal()

    dialog.addEventListener("click", (event) => {
      if (event.target.id === "cancel") {
        dialog.close()
        dialog.remove()
        resolve(null)
        return
      }
      const li = event.target.closest("li")
      if (!li){return}
      const list  = li.dataset.list
      const index = parseInt(li.dataset.index, 10)
      const monster  = results[list][index]
      dialog.close()
      dialog.remove()
      resolve(monster)
    })
  })
}
 export async function chooseMonster(results){
    const monster =  await makeDialog(results)
    //console.log("Make dialog result: ", monster)
    return monster
}

//Shortcuts for buttons
//footer with email and posibile donation and how to use.
//Virtual Dices
//Investigar como hacer para que aparezca en top results al buscar en google
//Publish!!!!

