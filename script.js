fetch('/insegnanti')
.then(res => res.json())
.then(console.log);

var list = [ "Elena Baldino", "Elena Bozzola", "Marco Matteo", "Vincenzo Bisci" ]

let elem = document.querySelector('#insegnanti')
elem.addEventListener('input', e => {
    closeAllLists()
    let container = document.querySelector('#autocomplete')
    let box = document.createElement('div')
    box.classList.add('autocomplete-items')
    container.appendChild(box)
    list.forEach(p => {
        let entry = document.createElement("div")
        entry.innerHTML = p
        entry.addEventListener('click', e => {
            elem.value = p
        })
        box.appendChild(entry)
    });

})
elem.addEventListener('keydown', e => {
    switch (e.keyCode) {
        case 40: // down
            break;
        case 38: // up
            break;
        case 13: // enter
            break;
        default:
            break;
    }
})

function closeAllLists() {
    let elems = document.getElementsByClassName("autocomplete-items")
    for (let i = 0; i < elems.length; i++) {
        console.log(elems[i])
        elems[i].remove()
    }
}
document.addEventListener('click', e => {})