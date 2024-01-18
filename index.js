// Connect with firebase database
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = { databaseURL: "https://endorsements-app-database-default-rtdb.firebaseio.com/" }

// Link firebase with app 
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")


// Connect DOM and link to variables
const inputFieldEl = document.getElementById("input-field")
const publishBtnEl = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-list")

// Add event listener for button click 
publishBtnEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value

    push(endorsementListInDB, inputValue)

    clearInputFieldEl()
})

// If endorsementlist exists in database, check the items inside, reset the list with new items
onValue (endorsementListInDB, function(snapshot) { 
    if (snapshot.exists()) { // checks to see if anything exists in database
        let itemsArray = Object.entries(snapshot.val())

        clearEndorsementListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]

            appendItemToEndorsementListEl(currentItem)
        }
    } else {
        endorsementListEl.innerHTML = "Add the first review for a teammate"
    }
})

// Add functions that go above
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}


function appendItemToEndorsementListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `endorsementList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    endorsementListEl.append(newEl)
}
