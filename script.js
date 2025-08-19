let createbtn = document.getElementById("create")
let text = document.getElementById("textarea")
let container = document.querySelector(".container")

createbtn.addEventListener("click",function(event){
  event.preventDefault();

  if(!text.value.trim()){
    return;
  }

  let noteElement = createNoteElement(text.value)
  container.appendChild(noteElement)
  savedNotes();

  text.value=""
})

function createNoteElement(content="",posX=null,posY=null){

  let notediv = document.createElement("div");
  notediv.setAttribute("class","notes")

  if(posX==null||posY==null){
    posX=Math.floor(Math.random()*(window.innerWidth-200 ))
    posY= Math.floor(Math.random()*(window.innerHeight -150))
  }

  notediv.style.left =posX+ "px"; 
  notediv.style.top =posY+ "px";

  notediv.innerHTML=`
  <textarea class="note-content" readonly>${content}</textarea>
  <button class = "delete-btn">DELETE</button>
  <button class = "edit-btn">EDIT</button>`;

  notediv.querySelector(".delete-btn").addEventListener("click",function(){
    notediv.remove()
    savedNotes()
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
    savedNotes()
  }
)

  let offsetX,offsetY,isDragging = false;

notediv.addEventListener("mousedown",function(event){
  if(event.target.tagName.toLowerCase()==="textarea"|| event.target.tagName.toLowerCase()==="button")
  {
    return;
  }
  isDragging=true;
  offsetX=event.clientX - notediv.offsetLeft;
  offsetY=event.clientY - notediv.offsetTop;
  notediv.style.zIndex = Date.now();
})

document.addEventListener("mousemove",function(event){
 if(isDragging){
  notediv.style.left = event.clientX-offsetX+"px";
  notediv.style.top = event.clientY - offsetY+"px";
 }


})

document.addEventListener("mouseup",function(){
  if(isDragging){ 
  isDragging=false;
  savedNotes();
  }
})
return notediv;
}

function savedNotes(){
  let notes = [];
  let noteElements = document.querySelectorAll(".notes");

  noteElements.forEach(noteEl => {
    let note = {
      content: noteEl.querySelector(".note-content").value,
      left: noteEl.style.left,
      top: noteEl.style.top,
    };
    notes.push(note);
  });

  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  let savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    savedNotes = JSON.parse(savedNotes);
    savedNotes.forEach(noteData => {
      
      let left = parseInt(noteData.left) || 100;
      let top = parseInt(noteData.top) || 100;
      container.appendChild(createNoteElement(noteData.content, left, top));
    });
  }
}


window.addEventListener("load", loadNotes);


