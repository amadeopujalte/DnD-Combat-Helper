import * as Creature from './creature.js'
import * as Unit from './unit.js'
import * as render from './renders.js'

var i = 0 //index (represents the current turn in the lists)


// Adds new monster to table
function addNewUnit(){
    const tableStats = document.getElementById("table_stats")

    const input = document.createElement("input")
    input.type = "text"
    input.id = "monster_name"
    input.placeholder = "Insert monster's name"

    const spinner = document.createElement("div")
    spinner.classList.add("loading_spinner", "hidden")

    tableStats.appendChild(input)
    tableStats.appendChild(spinner)

    input.focus()

    input.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault()

            const monster = input.value.trim()

            if (!monster) return

            input.disabled = true
            spinner.classList.remove("hidden")

            try {
                await Unit.newUnit(monster)

                input.remove()
                spinner.remove()

                render.renderTable()
            } catch (error) {
                console.error("Error loading monster:", error);
                spinner.classList.add("hidden")
                input.disabled = false
                input.focus()
            }
        }

        if (event.key === "Escape") {
            input.remove()
            spinner.remove()
            return
        }
    })
}

//Checks conditions and updates them if necessary, ex: (Stunned)
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

function startCombat(){
    var index = 0
    resetRound()
    render.renderCreatureInfo(index,"current_statBlock")
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
    return index
}
function isWriting(targetOfEvent){
    const typing = targetOfEvent.tagName === "INPUT" || targetOfEvent.tagName === "TEXTAREA" || targetOfEvent.isContentEditable
    return typing
}
//Buttons
function startCombatButtonBehaviour(){
   // console.log("combatlist", Unit.combatList)
   // console.log("unitList", Unit.unitList)
    i = startCombat()
    render.renderCreatureInfo(i,"current_statBlock")
}
// Start Combat Button
document.getElementById("start_combat").addEventListener("click", startCombatButtonBehaviour)
//Shortcut
document.addEventListener("keydown", (e) => {
    const t = e.target
    if(!isWriting(t) && e.key.toLowerCase() === "e"){startCombatButtonBehaviour()}
})
// Next button
function nextButtonBehavior(){
    i = next(i)
    render.renderTable()
    render.renderCreatureInfo(i,"current_statBlock")
}
document.getElementById("next").addEventListener("click", nextButtonBehavior)
//Shortcut
document.addEventListener("keydown", (e) =>{
    const t = e.target
    if(!isWriting(t) && e.key.toLowerCase() === "n"){nextButtonBehavior()}
})
//New Unit button
document.getElementById("new_unit").addEventListener("click", addNewUnit)
//Shortcut
document.addEventListener("keyup", (e) => {
    const t = e.target
    if(!isWriting(t) && e.key.toLowerCase() === "u"){addNewUnit()}
})
//Sort Button
function sortButtonBehavior(){
    if(!Unit.unitList){return}
    Unit.sortUnitList()
    Unit.sortCombatList()
    render.renderTable()
    render.renderCreatureInfo(i,"current_statBlock")
}
document.getElementById("sort").addEventListener("click", sortButtonBehavior)
//Shortcut
document.addEventListener("keydown", (e) => {
    const t = e.target
    if(!isWriting(t) && e.key.toLowerCase() === "s"){sortButtonBehavior()}
})
//New player button 
document.getElementById("new_player").addEventListener("click", render.newPlayer)
//Shortcut
document.addEventListener("keyup", (e) => {
    const t = e.target
    if(!isWriting(t) && e.key.toLowerCase() == "p"){render.newPlayer()}
})
//Show homebrews button
document.getElementById("show_homebrews").addEventListener("click", render.showHomebrews)


function eliminateCurrentCreature(){
    if(!Unit.unitList[i]){return}
    Unit.unitList.splice(i,1) 
    Unit.combatList.splice(i,1)
    if (i >= Unit.unitList.length) {
        i = Unit.unitList.length - 1;
    }
    render.renderTable()
    render.renderCreatureInfo(i,"current_statBlock")
}
//Eliminate current creature Button
document.getElementById("eliminate").addEventListener("click", eliminateCurrentCreature)
//Shortcut
document.addEventListener("keydown", (e) => {
    const t = e.target
    if (!isWriting(t) && e.key === "Backspace") {eliminateCurrentCreature()}})

//RemoveEffect buttons
document.getElementById("table_stats").addEventListener("click", (event) => {
    if(event.target.matches(".removeEffect")){
        const btn = event.target
        const unitId = Number(btn.dataset.unit)
        const effectId = Number(btn.dataset.effect)
        Unit.unitList[unitId].stateAndEffects.splice(effectId, 1)
        render.renderTable()
    }
})
//See Stat block buttons
document.getElementById("table_stats").addEventListener("click", (event) => {
     if(event.target.matches(".seeStats")){
    const btn = event.target
    const unit = Number(btn.dataset.unit);
    render.renderCreatureInfo(unit,"viewer_statBlock")    
    }
})

//Edit table
document.querySelector("#table_stats").addEventListener("click", (event) => {render.editTable(event)})

function addAction(){
  const container = document.getElementById("actions")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="action_name" placeholder=" action's name">
    <textarea 
      name="action_desc" 
      placeholder="action's description"
      rows="4"
      cols="40"
    ></textarea>

    `
  container.appendChild(div)
}

function addLegendaryAction(){
  const container = document.getElementById("legendary_actions")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="legendary_name" placeholder="legendary action's name">
    <textarea 
      name="legendary_desc" 
      placeholder="description of legendary action"
      rows="4"
      cols="40"
    ></textarea>
    `
  container.appendChild(div)
}

function addSpecialAbility(){
  const container = document.getElementById("special_abilities")
  const div = document.createElement("div")
  div.innerHTML = `
    <input type="text" name="ability_name" placeholder="special ability's name">
    <textarea 
      name="ability_desc" 
      placeholder="description of ability"
      rows="4"
      cols="40"
    ></textarea>

  `
  container.appendChild(div)
}

function addSpell(){
  const container = document.getElementById("spell_list")
  const input = document.createElement("input")
  input.type = "text"
  input.name = "spell_name"
  input.placeholder = "spell's name"
  container.appendChild(input)
}
function addSense(){
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
        document.getElementById("table").appendChild(input)
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
        //console.log(requiredFields)
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

window.addEventListener("DOMContentLoaded", () => {
    const hbl = JSON.parse(localStorage.getItem("homebrewList")) ?? []
    const cl = JSON.parse(localStorage.getItem("creatureList"))

    if(hbl){
        Creature.homebrewCreatureList.push(...hbl)
    }
    if(cl){
        Creature.creatureList.push(...cl)
    }
})
export async function chooseMonster(results){
    const monster =  await render.makeDialog(results)
   // console.log("Make dialog result: ", monster)
    return monster
}

//Virtual Dices
function d20(){return getRandomIntInclusive(1,20)}
function d12(){return getRandomIntInclusive(1,12)}
function d10(){return getRandomIntInclusive(1,10)}
function d8(){return getRandomIntInclusive(1,8)}
function d6(){return getRandomIntInclusive(1,6)}
function d4(){return getRandomIntInclusive(1,4)}
function d100(){return getRandomIntInclusive(1,100)}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

render.d20btn.addEventListener("click", () => render.diceBehaviour(d20(), render.d20btn))
render.d12btn.addEventListener("click", () => render.diceBehaviour(d12(), render.d12btn))
render.d10btn.addEventListener("click", () => render.diceBehaviour(d10(), render.d10btn))
render.d8btn.addEventListener("click", () => render.diceBehaviour(d8(), render.d8btn))
render.d6btn.addEventListener("click", () => render.diceBehaviour(d6(), render.d6btn))
render.d4btn.addEventListener("click", () => render.diceBehaviour(d4(), render.d4btn))
render.d100btn.addEventListener("click", () => render.diceBehaviour(d100(), render.d100btn))

export{i}
