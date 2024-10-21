const addNewList = document.querySelector("#add-new");
const deleteList = document.querySelector("#delete");
const changeListOrder = document.querySelector("#change-order");
const listContainer = document.querySelector(".list-container");
let cookies;
let lists = [];
let newListField = false;
let gotCookieLists = false;

class List {
    constructor(name, items, complete){
        this.name = name;
        this.items = items;
        this.complete = complete;
    }
}
function getCookieExpirationDate(days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // add days in milliseconds
    return date.toUTCString(); // convert to UTC string format
  }

if(document.cookie == ""){
    cookies = false;
    document.querySelector(".cookie-notice").innerHTML = 
    `
    <p class="text" id="enable-cookies-text">If you want to save your lists, you must enable cookies</p>
    <button class="button" id="enable-cookies-button">Enable</button>
    <button class="button" id="disable-cookies-button">No Thanks</button>
    `;
    document.querySelector("#enable-cookies-button").addEventListener("click", (e) => {
        cookies = true;
        document.cookie = `cookiesEnabled=true; expires=${getCookieExpirationDate(365)}`;
        document.querySelector(".cookie-notice").classList.toggle("hidden");
    });
    document.querySelector("#disable-cookies-button").addEventListener("click", (e) => {
        cookies = false;
        document.cookie = `cookiesEnabled=false; expires=${getCookieExpirationDate(365)}`;
        document.querySelector(".cookie-notice").classList.toggle("hidden");
    });
}
if(document.cookie.match(/cookiesEnabled=true/) && gotCookieLists == false){
    let webCookies = document.cookie.split(";");
    console.log(webCookies);
    if(webCookies.length > 1){
        for (let i = 0; i < webCookies.length; i++){
            if(webCookies[i].match(/list\dName=.+/)){
                let nameCapt = webCookies[i].match(/list(\d)Name=(.+)/);
                let li = nameCapt[1];
                let nm = nameCapt[2];
                lists.push(new List(nm, [], []));
            }
        }
        for (let i = 0; i < webCookies.length; i++){
            if(webCookies[i].match(/list\dItem\dValue=.+/)){
                let captures = webCookies[i].match(/list(\d)Item(\d)Value=(.+)/);
                console.log(captures);
                console.log(lists);
                let listIndex = Number(captures[1]);
                let itemIndex = Number(captures[2]);
                let value = captures[3];
                lists[listIndex].items.push(value);
            }
        }
    }
    gotCookieLists = true;
    updateLists();
}


addNewList.addEventListener("click", (e) => {
    if(!newListField){
        let newInputField = document.createElement("input");
        newInputField.classList.add("list-name");

        let listContainer = document.querySelector(".list-container");
        newInputField.placeholder = "Enter this list's name";
        listContainer.prepend(newInputField);
        newListField = true;
        newInputField.addEventListener("keydown", (e) => {
            if(newInputField.value != "" && e.key === 'Enter'){
                lists.push(new List(newInputField.value, [], []));
                listContainer.removeChild(newInputField);
                newListField = false;
                listContainer.innerHTML = '';
                updateLists();
            }
        });
    }
});

function updateLists(){
    console.log(lists);
    listContainer.innerHTML = '';
    for(let i = 0; i < lists.length; i++){
        if(lists.length > 0){
            //LIST BOX
            let listBox = document.createElement("div");
            listBox.classList.add("list-box");
            listBox.classList.add("list"+i);
            listContainer.appendChild(listBox);

            //LIST NAME
            let listTitle = document.createElement("h2");
            listTitle.innerText = lists[i].name;
            listTitle.classList.add("list-title");

            //TOP OF LIST
            let listTop = document.createElement("div");
            listTop.classList.add("list-top");
            listBox.appendChild(listTop);

            //ADD BUTTON
            let add = document.createElement("button");
            add.classList.add("add-button");
            add.innerText = "+";

            

            //CLICKED ADD
            add.addEventListener("click", (e) => {
                //ADDITEM INPUT FIELD
                let inputField = document.createElement("input");
                inputField.placeholder = "Add an item to this list";
                inputField.classList.add("new-item-input");
                listBox.appendChild(inputField);
                inputField.addEventListener("keydown", (e) => {
                    if(inputField.value != "" && e.key === 'Enter'){
                        lists[i].items.push(inputField.value);
                        lists[i].complete.push("false");
                        listBox.removeChild(inputField);
                        updateLists();
                    }
                });
            });
            listTop.appendChild(listTitle);
            let listTopButtonContainer = document.createElement("div");
            listTopButtonContainer.classList.add("lt-button-container");
            listTop.appendChild(listTopButtonContainer);

            listTopButtonContainer.appendChild(add);


            //LIST ITEMS
            if(lists[i].items.length > 0){

                for(let j = 0; j < lists[i].items.length; j++){

                    //CHECKBOX
                    let checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = lists[i].name +"-item"+j;

                    //LABEL
                    let label = document.createElement("label");
                    label.for = lists[i].name +"-item"+j;
                    label.classList.add("list-label");
                    label.classList.add("list"+i+"label"+j);
                    label.innerText = lists[i].items[j];

                    //MARKED COMPLETE?
                    if(lists[i].complete[j] == "true"){
                        label.classList.add("complete");
                        checkbox.checked = true;
                    } 
                    
                    //CHECKED THE BOX
                    checkbox.addEventListener("change", (e) => {
                        if(lists[i].complete[j] == "true"){
                            lists[i].complete[j] = "false";
                            label.classList.remove("complete");
                        }
                        else{
                            lists[i].complete[j] = "true";
                            label.classList.add("complete");
                        }
                    });

                    //REMOVE BUTTON
                    let remove = document.createElement("button");
                    remove.classList.add("remove-button");
                    remove.innerText = "X";
                    //CLICKED REMOVE
                    remove.addEventListener("click", (e) => {
                        lists[i].items.splice(j, 1);
                        document.cookie = `list${i}Item${j}Value=${lists[i].items[j]}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
                        updateLists();
                    });

                    //EDIT BUTTON
                    let edit = document.createElement("button");
                    edit.classList.add("edit-button");
                    edit.innerText = "\u{270E}";
                    

                    let listItemContainer = document.createElement("div");
                    listItemContainer.classList.add("list-item-container");
                    listItemContainer.appendChild(checkbox);
                    listItemContainer.appendChild(label);

                    edit.addEventListener("click", (e) => {
                        
                        let editInput = document.createElement("input");
                        
                        editInput.placeholder = lists[i].items[j];
                        document.querySelector(".list"+i+"label"+j).innerText = "";
                        listItemContainer.appendChild(editInput);
                        editInput.addEventListener("keydown", (e) => {
                            if(editInput.value != "" && e.key === 'Enter'){
                                lists[i].items[j] = editInput.value;
                                updateLists();
                            }
                        });
                    });
                    
                    listItemContainer.addEventListener("mouseover", (e) => {
                        listItemContainer.appendChild(edit);
                        listItemContainer.appendChild(remove);
                    });
                    listItemContainer.addEventListener("mouseleave", (e) => {
                        listItemContainer.removeChild(edit);
                        listItemContainer.removeChild(remove);
                    });
                    
                    listBox.appendChild(listItemContainer);
                    if(document.cookie.match(/cookiesEnabled=true/)){
                        document.cookie = `list${i}Item${j}Value=${lists[i].items[j]}; expires=${getCookieExpirationDate(365)}`
                    }
                }

                if(document.cookie.match(/cookiesEnabled=true/)){
                    document.cookie = `list${i}Name=${lists[i].name}; expires=${getCookieExpirationDate(365)}`
                }
            }
             
        }
        let removeListDiv = document.createElement("div");
        removeListDiv.classList.add("remove-list");
        
        //REMOVE LIST BUTTON
        let removeList = document.createElement("button");
        removeList.classList.add("remove-button");
        removeList.innerText = "Delete List";
        removeList.addEventListener("click", (e) => {
            for (let j = 0; j < lists[i].items.length; j++){
                document.cookie = `list${i}Item${j}Value=${lists[i].items[j]}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
            }
            document.cookie = `list${i}Name=${lists[i].name}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
            lists.splice(i, 1);
            updateLists();
        });
        
        removeListDiv.appendChild(document.createElement("p"));
        listContainer.appendChild(removeListDiv);

        removeListDiv.addEventListener("mouseover", (e) => {
            removeListDiv.appendChild(removeList);
        });
        removeListDiv.addEventListener("mouseleave", (e) => {
            removeListDiv.removeChild(removeList);
        });
        
    }
}