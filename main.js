import * as Creature from './creature.js'
import * as Unit from './unit.js'

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
document.getElementById("new_unit").addEventListener("click", addNewUnit)
document.getElementById("sort").addEventListener("click", () =>{
    //Unit.sortCombatList()
    Unit.sortUnitList()
    renderTable()})

