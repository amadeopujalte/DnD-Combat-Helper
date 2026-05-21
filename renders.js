import * as Creature from './creature.js'
import * as Unit from './unit.js'
import * as Main from './main.js'
function highlightCurrentCreature(index){
    if(Unit.combatList.length == 0){return}
    const table = document.getElementById("table_stats")
    const currentRow = table.querySelector(`tr[data-index="${index}"]`)
    if (!currentRow){return}
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
            data-effect="${Main.i}"> 
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
        highlightCurrentCreature(Main.i)
       // console.log("Table rendered")
}


function renderCreatureInfo(index, whereId){
    if(!Unit.combatList[index]){return}
    
    const creature = Unit.combatList[index]
   // console.log("creature to render is: ", Unit.combatList[index]) 
    
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
    //Check if it is player
    if(creature.name.includes("P.")){
       // console.log("Player's turn", creature.name)
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

        const cr = document.createElement("p")
        cr.textContent = "CR: " + creature.cr

        const hitDice = document.createElement("p")
        hitDice.textContent = "Hit Dice: " + creature.hit_dice

        const initiative = document.createElement("p")
        initiative.textContent = "Initiative: " + creature.init
    
        const speed = document.createElement("p")
        const s = creature.speed
        speed.textContent = `Speed: Walk ${s.walk}, Swim ${s.swim}, Burrow ${s.burrow}, Fly ${s.fly}, Climb ${s.climb}`
    
        const legendarySlots = document.createElement("p")
        legendarySlots.textContent = creature.legendarySlots ? creature.legendarySlots + " Those with (L)" : ""

        const actions = document.createElement("p")
        actions.innerHTML =  "Actions: <br>"
        creature.actions.forEach(action => {
            actions.innerHTML += ` <b> ${action.name}: </b> <br>`
            actions.innerHTML += `${action.desc}<br>` 
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
       // console.log("rendering creature stats")
    }
}

function editTable(event) {
    const cell = event.target

    if (cell.tagName !== "TD") return

    const index = cell.parentElement.dataset.index
    const field = cell.dataset.field
    const originalValue = Unit.unitList[index][field]

    if (field == "actions") return

    cell.textContent = ""

    if (field === "hp") {
        renderHpEditor(cell, index, originalValue)
        return
    }

    if (field === "stateAndEffects") {
        renderStateAndEffectsEditor(cell, index)
        return
    }

    renderGenericEditor(cell, index, field, originalValue)
}

function createCellInput(cell, originalValue) {
    const input = document.createElement("input")

    input.type = "text"
    input.value = originalValue
    input.style.width = "50px"

    cell.appendChild(input)
    input.focus()

    return input
}

function createSmallButton(text) {
    const button = document.createElement("button")

    button.textContent = text

    return button
}

function renderHpEditor(cell, index, originalValue) {
    const input = createCellInput(cell, originalValue)

    const btnAdd = createSmallButton("+")
    const btnSubtract = createSmallButton("–")
    const btnSet = createSmallButton("📝")

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

function renderStateAndEffectsEditor(cell, index) {
    const form = document.createElement("form")

    const conditionInput = createConditionInput()
    const advancedCheckbox = createAdvancedCheckbox()
    const advancedDiv = createAdvancedOptionsDiv(advancedCheckbox.input)

    form.appendChild(conditionInput)
    form.appendChild(advancedCheckbox.label)
    form.appendChild(advancedDiv.container)

    advancedCheckbox.input.addEventListener("change", () => {
        const isAdvanced = advancedCheckbox.input.checked

        advancedDiv.container.style.display = isAdvanced ? "block" : "none"
        advancedDiv.creature.required = isAdvanced
        advancedDiv.duration.required = isAdvanced
        advancedDiv.endsAtStart.required = isAdvanced
    })

    const submit = document.createElement("button")
    submit.type = "submit"
    submit.textContent = "create"

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        if (!form.checkValidity()) {
            form.reportValidity()
            return
        }

        if (advancedCheckbox.input.checked && !creatureIsInEncounter(advancedDiv.creature.value)) {
            alert("Creature not in the encounter")
            return
        }

        const data = new FormData(form)

        Unit.unitList[index].modifyStateAndEffects(data)
        form.reset()
        renderTable()
    })

    form.appendChild(submit)

    const cancel = document.createElement("button")
    cancel.type = "reset"
    cancel.textContent = "cancel"

    cancel.addEventListener("click", () => {
        form.reset()
        form.remove()
    })

    form.appendChild(cancel)
    cell.appendChild(form)
}

function createConditionInput() {
    const conditionInput = document.createElement("input")

    conditionInput.type = "text"
    conditionInput.placeholder = "effect"
    conditionInput.required = true
    conditionInput.name = "effect"

    return conditionInput
}

function createAdvancedCheckbox() {
    const label = document.createElement("label")
    const input = document.createElement("input")
    const text = document.createTextNode("Advanced options")

    input.type = "checkbox"

    label.appendChild(input)
    label.appendChild(text)

    return {
        label,
        input
    }
}

function createAdvancedOptionsDiv() {
    const container = document.createElement("div")

    container.style.display = "none"

    const labelStart = document.createElement("label")
    const text1 = document.createTextNode("Until the start of ... 's turn")
    const endsAtStart = document.createElement("input")

    endsAtStart.type = "radio"
    endsAtStart.name = "endsAt"
    endsAtStart.value = "start"
    endsAtStart.required = false

    labelStart.appendChild(text1)
    labelStart.appendChild(endsAtStart)
    container.appendChild(labelStart)

    const labelEnd = document.createElement("label")
    const text2 = document.createTextNode("Until the end of... 's turn")
    const endsAtEnd = document.createElement("input")

    endsAtEnd.type = "radio"
    endsAtEnd.name = "endsAt"
    endsAtEnd.value = "end"

    labelEnd.appendChild(text2)
    labelEnd.appendChild(endsAtEnd)
    container.appendChild(labelEnd)

    const creature = document.createElement("input")

    creature.type = "search"
    creature.placeholder = "creature's name"
    creature.required = false
    creature.autocomplete = "on"
    creature.name = "creature"

    fillCreatureDatalist(creature)

    container.appendChild(creature)

    const duration = document.createElement("input")

    duration.type = "number"
    duration.name = "rounds"
    duration.placeholder = "rounds"
    duration.required = false
    duration.min = 1
    duration.step = 1

    container.appendChild(duration)

    return {
        container,
        creature,
        duration,
        endsAtStart,
        endsAtEnd
    }
}

function fillCreatureDatalist(creatureInput) {
    let datalist = document.getElementById("creatures-datalist")

    if (!datalist) {
        datalist = document.createElement("datalist")
        datalist.id = "creatures-datalist"
        document.body.appendChild(datalist)
    }

    datalist.innerHTML = ""

    Unit.unitList.forEach(unit => {
        const option = document.createElement("option")

        option.value = unit.name
        datalist.appendChild(option)
    })

    creatureInput.setAttribute("list", datalist.id)
}

function creatureIsInEncounter(creatureName) {
    return Unit.unitList.some(unit => {
        return unit.name.toLowerCase() === creatureName.toLowerCase()
    })
}

function renderGenericEditor(cell, index, field, originalValue) {
    const input = createCellInput(cell, originalValue)

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            applyGenericEdit(index, field, input.value)
            renderTable()
        }

        if (e.key === "Escape") {
            renderTable()
        }
    })

    input.addEventListener("blur", () => {
        applyGenericEdit(index, field, input.value)
        renderTable()
    })
}

function applyGenericEdit(index, field, value) {
    if (!isNaN(value)) {
        const number = parseInt(value)

        if (number >= 0) {
            switch (field) {
                case "initiative":
                    Unit.unitList[index].modifyInitiative(number)

                    if (!Unit.combatList[index].name.includes("P.")) {
                        Unit.combatList[index].initiativeRoll = number
                    }
                    else {
                        Unit.combatList[index].init = number
                    }

                    break

                case "ac":
                    Unit.unitList[index].modifyAc(number)
                    break
            }
        }
        else {
            alert("Invalid number, cannot be below 0")
        }
    }
    else {
        Unit.unitList[index].modifyName(value)
    }
}


function newPlayer(){
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

}

function decimalToFraction(decimal) {
  const decimalString = decimal.toString();

  if (!decimalString.includes(".")) {
    return decimalString;
  }

  const decimalPlaces = decimalString.split(".")[1].length;
  const denominator = Math.pow(10, decimalPlaces);
  const numerator = decimal * denominator;

  const divisor = gcd(numerator, denominator);

  return `${numerator / divisor}/${denominator / divisor}`;
}

function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}
function makeDialog(results) {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog")
    dialog.className = "dialog"

    dialog.innerHTML = `
      <form method="dialog">
        <h3>Choose creature:</h3>
        <p>[Name, Hp, Ac, CR, source]</p>
        <div style="display:flex">
          <section>
            <h4>Already Used (local list)</h4>
            <ul id="local"></ul>
          </section>
          <section>
            <h4>Others</h4>
            <ul id="api"></ul>
          </section>
        </div>
        <button type="button" id="cancel" style="color: black">Cancel</button>
      </form>
    `

    const localList = dialog.querySelector("#local")
    const apiList = dialog.querySelector("#api")

    results.local.forEach((e, i) => {
      const li = document.createElement("li")

      li.dataset.index = i
      li.dataset.list = "local"
      li.textContent = `[ ${e.name}, ${e.hit_points}, ${e.armor_class}, ${decimalToFraction(e.cr)}, ${e.document__title} ]`

      localList.appendChild(li)
    })

    results.api.forEach((e, j) => {
      const li = document.createElement("li")

      li.dataset.index = j
      li.dataset.list = "api"
      li.textContent = `[ ${e.name}, ${e.hit_points}, ${e.armor_class}, ${decimalToFraction(e.challenge_rating)}, ${e.document.name} ]`

      apiList.appendChild(li)
    })

    document.body.appendChild(dialog)
    dialog.showModal()

    dialog.addEventListener("click", (event) => {
      if (event.target.id === "cancel") {
        closeDialog(null)
        return
      }

      const li = event.target.closest("li")

      if (!li) return

      const list = li.dataset.list
      const index = parseInt(li.dataset.index, 10)
      const monster = results[list][index]

      closeDialog(monster)
    })

    dialog.addEventListener("cancel", (event) => {
      event.preventDefault()
      closeDialog(null)
    })

    function closeDialog(value) {
      dialog.close()
      dialog.remove()
      resolve(value)
    }
  })
}

function showHomebrews() {
    const dialog = document.createElement("dialog")
    dialog.classList.add("dialog", "homebrew-dialog")
    const title = document.createElement("h3")
    const ul = document.createElement("ul")
    const closeButton = document.createElement("button")

    title.textContent = "Homebrew creatures"
    closeButton.textContent = "Close"

    Creature.homebrewCreatureList.forEach(e => {
        const li = document.createElement("li")

        const actionNames = e.actions && e.actions.length > 0
            ? e.actions.map(action => action.name).join(", ")
            : "No actions"

        li.textContent = `[ ${e.name}, HP: ${e.hit_points} , AC: ${e.armor_class} , CR: ${decimalToFraction(e.cr)}, Actions: ${actionNames} ]`

        ul.appendChild(li)
    })

    closeButton.addEventListener("click", () => {
        dialog.close()
        dialog.remove()
    })

    dialog.addEventListener("cancel", () => {
        dialog.remove()
    })

    dialog.appendChild(title)
    dialog.appendChild(ul)
    dialog.appendChild(closeButton)

    document.body.appendChild(dialog)
    dialog.showModal()
}

const dice_container = document.getElementById("dice_container")
dice_container.style.display = "none"

function createDiceRowButton(id, imgSrc) {
    const row = document.createElement("div")
    row.className = "dice-row"
    const btn = document.createElement("button")
    btn.title = id
    btn.id = id
    btn.className = "dice"
    btn.innerHTML = `<img src="${imgSrc}">`

    row.appendChild(btn)
    dice_container.appendChild(row)
    return btn
}
const d20btn  = createDiceRowButton("d20",  "assets/d20.webp")
const d12btn  = createDiceRowButton("d12",  "assets/d12.webp")
const d10btn  = createDiceRowButton("d10",  "assets/d10.webp")
const d8btn   = createDiceRowButton("d8",   "assets/d8.webp")
const d6btn   = createDiceRowButton("d6",   "assets/d6.webp")
const d4btn   = createDiceRowButton("d4",   "assets/d4.webp")
const d100btn = createDiceRowButton("d100", "assets/d100.webp")
   
var toggle = false

const dice_toggle = document.getElementById("dice_toggle")

dice_toggle.addEventListener("click", () => {
    toggle = !toggle
    dice_container.style.display = toggle ? "flex" : "none"
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function diceBehaviour(roll,btn){
    const rolldiv = document.createElement("div")
    rolldiv.innerHTML = '<img src="assets/rollingDice.webp" style="width: 35px; height: 40px;">'
    rolldiv.style.width = "35px"
    rolldiv.style.height = "35px"
    rolldiv.style.marginRight = "6px" 
    btn.parentNode.insertBefore(rolldiv, btn)

const otherDices = Array.from(dice_container.querySelectorAll('button')).filter(e => e !== btn)
    otherDices.forEach(e => {
        let slot = document.createElement("div")
        slot.style.width = "35px"
        slot.style.height = "35px"
        slot.style.marginRight = "6px"
        slot.classList.add("temp-slot")
        e.parentNode.insertBefore(slot, e) 
    })
    rolldiv.classList.add("roll")
    rolldiv.addEventListener('animationend', async () => {
        rolldiv.textContent = roll
        rolldiv.style.display = "flex"
        rolldiv.style.alignItems = "center"
        rolldiv.style.justifyContent = "center"
        rolldiv.style.border = "1px solid black";
        rolldiv.style.backgroundColor = "#d14a1a"
        await sleep(5000)
        rolldiv.remove()
        Array.from(dice_container.querySelectorAll('.temp-slot')).forEach(e => e.remove())
             
    })
}

export{renderTable, renderCreatureInfo, newPlayer, makeDialog, showHomebrews, editTable, diceBehaviour, d100btn, d20btn, d12btn, d10btn, d8btn, d6btn, d4btn}
