let createbtn = document.getElementById("create")
let text = document.getElementById("textarea")
let container = document.querySelector(".container")

createbtn.addEventListener("click",function(event){
  event.preventDefault();

  if(!text.value.trim()){
    return;
  }

  let noteElement = createNoteElement(text.value)
  container.append(noteElement)
  saveNotes();

  text.value=""
})

function createNoteElement(content=""){
  let notediv = document.createElement("div")
  notediv.setAttribute("class","notes")
  notediv.innerHTML=`
  <textarea class="note-content" readonly>${content}</textarea>
  <button class = "delete-btn">DELETE</button>
  <button class = "edit-btn">EDIT</button>`;

  notediv.querySelector(".delete-btn").addEventListener("click",function(){
    notediv.remove()
    saveNotes()
  })

  notediv.querySelector(".edit-btn").addEventListener("click",function(event){

    let notefield = notediv.querySelector(".note-content")

    if(notefield.hasAttribute("readonly")){
      notefield.removeAttribute("readonly")
      event.target.textContent="SAVE"

    }
    else{
      notefield.setAttribute("readonly","")
      event.target.textContent="EDIT"
    }
    saveNotes()
  })

  return notediv;
}

function saveNotes(){
  var notes =[]
  var noteElements = document.querySelectorAll(".notes")
  for(let i=0;i< noteElements.length;i++){

  var note ={ notecon:noteElements[i].querySelector(".note-content").value
    
  };
  notes.push(note);
}
localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  var savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    savedNotes = JSON.parse(savedNotes);
    for (var i = 0; i < savedNotes.length; i++) {
      var noteData = savedNotes[i];
      container.appendChild(createNoteElement( noteData.notecon));
    }
  }
}

window.addEventListener("load", loadNotes);



