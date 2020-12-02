var snippets = [];

load();

var addInput = document.getElementById("add");
var snippetDiv = document.getElementById("snippetDiv");
var preCopy = document.createElement("input");

preCopy.type = "text";
preCopy.classList.add("offscreen");
document.body.appendChild(preCopy);

document.addEventListener("keydown", keyDownFn);

function generate(array) {
    snippetDiv.innerHTML = "";
    array.forEach((e, i) => {
        var newDiv = document.createElement("div");
        newDiv.id = i;

        var newSpan = document.createElement("span");
        newSpan.innerText = i + 1;
        newSpan.id = "span" + (i + 1);
        newSpan.addEventListener("click", function(e) {
            deleteSnippet(e.target.parentNode.id);
        });
        newSpan.addEventListener("mouseenter", () => {
                newSpan.style.color = "red";
                newSpan.style.textDecoration = "line-through";
        });
        newSpan.addEventListener("mouseleave", () => {          
                newSpan.style.color = "";
                newSpan.style.textDecoration = "";
        });

        var newInput = document.createElement("input");
        newInput.type = "text";
        newInput.value = e;
        newInput.id = "input" + (i + 1);

        newButton = document.createElement("button");
        newButton.id = "button" + (i + 1);
        newButton.innerHTML = "Copy";
        newButton.onclick = function(event) {
            
            var copyTarget = event.target.previousElementSibling;
            // console.log(copyTarget);
            // console.log(copyTarget.value);
            if (event.ctrlKey === false) {
                resetButtonColour();
                preCopy.value = "";
            }
    
            var btnNm = event.target.id.substring(6,7);
            selectButton(btnNm);

            copyToClipboard(copyTarget.value)
        };
        
        newDiv.appendChild(newSpan);
        newDiv.appendChild(newInput);
        newDiv.appendChild(newButton);
        snippetDiv.appendChild(newDiv);
    });
};

generate(snippets);

function addSnippet(thing) {
    if (thing.keyCode === 13) {
        snippets.push(thing.target.value);
        generate(snippets);
        thing.target.value = "";
    } else if (!thing.keyCode) {
        var targetInput = thing.previousElementSibling
        var text = targetInput.value;
        snippets.push(text);
        generate(snippets);
        targetInput.value = "";
    }
    save()
}

function resetButtonColour() {
    var buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.style.background = "";
        button.style.color = "";
    });
}

function selectButton(number) {
    var theButton = document.getElementById("button" + number);
    console.log('number', number);
    theButton.style.background = "blue";
    theButton.style.color = "white";
}

function keyDownFn(e) {
    if (parseInt(e.key) >= 0 && parseInt(e.key) <=10 && e.target !== addInput) {
        // console.log(e.key);
        var searchTerm = "input" + e.key;
        // console.log(searchTerm);
        var targetInput = document.getElementById(searchTerm);
        if (targetInput) {
            if (e.ctrlKey === false) {
                resetButtonColour();
                preCopy.value = "";
            }
            copyToClipboard(targetInput.value);
            selectButton(parseInt(e.key));
        }
    }
}

function copyToClipboard(contents) {
    if (preCopy.value !== "") {
        preCopy.value = preCopy.value + ", " + contents;
    } else {
        preCopy.value += contents;
    }
    preCopy.select();
    preCopy.setSelectionRange(0,999999);
    document.execCommand("copy");
}

function save() {
    localStorage.setItem('snippets', JSON.stringify(snippets));
}

function load() {
    if (localStorage.getItem('snippets')) {
        snippets = JSON.parse(localStorage.getItem('snippets'))
    } else {
        snippets = ["wrong suburb", "no unit number", "changed unit number", "typo"];
    }
}

function deleteSnippet(number) {
    snippets.splice(number,1);
    generate(snippets);
    save();
}
// to add:
// css to make big clickable buttons and look nice
// save and load preset copy panels like geocoding