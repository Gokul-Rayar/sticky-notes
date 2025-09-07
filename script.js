let PRJID = "hellodemo-5013b";
let APIKEY = "AIzaSyAJ8hVZVfjihKnOFELwglcz-FJTYV9o5Vk";
let URL = `https://firestore.googleapis.com/v1/projects/${PRJID}/databases/(default)/documents/sticky`;

let createbtn = document.getElementById("create");
let text = document.getElementById("textarea");
let container = document.querySelector(".container");

let noteCount = 0;
let notesPerRow = 5;

    createbtn.addEventListener("click", async function (event) {
      event.preventDefault();
      if (!text.value.trim()) return;

      let noteData = {
        fields: {
          content: { stringValue: text.value },
          left: {integerValue: 100 + (noteCount % notesPerRow) * 200 },
          top: { integerValue: 200 + Math.floor(noteCount / notesPerRow) * 220 }
        }
      };

      let res = await fetch(`${URL}?key=${APIKEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData)
      });

      let doc = await res.json();
      let id = doc.name.split("/").pop(); 
      container.appendChild(createNoteElement(id, {
        content: text.value,
        left: parseInt(noteData.fields.left.integerValue),
        top: parseInt(noteData.fields.top.integerValue)
      }));

      noteCount++;
      text.value = "";
    });

    
    function createNoteElement(id, noteData) {
      let notediv = document.createElement("div");
      notediv.setAttribute("class", "notes");
      notediv.style.left = noteData.left + "px";
      notediv.style.top = noteData.top + "px";

      notediv.innerHTML = `
        <textarea class="note-content" readonly>${noteData.content}</textarea>
        <button class="delete-btn">DELETE</button>
        <button class="edit-btn">EDIT</button>
      `;

      
      notediv.querySelector(".delete-btn").addEventListener("click", async () => {
        await fetch(`${BASE_URL}/${id}?key=${API_KEY}`, { method: "DELETE" });
        notediv.remove();
      });

      
      notediv.querySelector(".edit-btn").addEventListener("click", async (event) => {
        let notefield = notediv.querySelector(".note-content");

        if (notefield.hasAttribute("readonly")) {
          notefield.removeAttribute("readonly");
          event.target.textContent = "SAVE";
        } else {
          notefield.setAttribute("readonly", "");
          event.target.textContent = "EDIT";

          let updatedData = {
            fields: {
              content: { stringValue: notefield.value },
              left: { integerValue: parseInt(notediv.style.left) },
              top: { integerValue: parseInt(notediv.style.top) }
            }
          };

          await fetch(`${URL}/${id}?key=${APIKEY}&updateMask.fieldPaths=content&updateMask.fieldPaths=left&updateMask.fieldPaths=top`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
          });
        }
      });

      
      let offsetX, offsetY, isDragging = false;

      notediv.addEventListener("mousedown", (event) => {
      if (event.target.tagName.toLowerCase() === "textarea" ||
          event.target.tagName.toLowerCase() === "button") return;
          isDragging = true;
          offsetX = event.clientX - notediv.offsetLeft;
          offsetY = event.clientY - notediv.offsetTop;
          notediv.style.zIndex = Date.now();
      });

      document.addEventListener("mousemove", (event) => {
        if (isDragging) {
          notediv.style.left = event.clientX - offsetX + "px";
          notediv.style.top = event.clientY - offsetY + "px";
        }
      });

      document.addEventListener("mouseup", async () => {
        if (isDragging) {
          isDragging = false;

          let updatedData = {
            fields: {
              content: { stringValue: notediv.querySelector(".note-content").value },
              left: { integerValue: parseInt(notediv.style.left) },
              top: { integerValue: parseInt(notediv.style.top) }
            }
          };

          await fetch(`${URL}/${id}?key=${APIKEY}&updateMask.fieldPaths=content&updateMask.fieldPaths=left&updateMask.fieldPaths=top`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
          });
        }
      });

      return notediv;
    }

    
    async function loadNotes() {
      let res = await fetch(`${URL}?key=${APIKEY}`);
      let saved = await res.json();

      if (!saved.documents) return;

      saved.documents.forEach((docSnap) => {
        const id = docSnap.name.split("/").pop();
        const noteData = {
          content: docSnap.fields.content.stringValue,
          left: parseInt(docSnap.fields.left.integerValue),
          top: parseInt(docSnap.fields.top.integerValue)
        };
        container.appendChild(createNoteElement(id, noteData));
        noteCount++;
      });
    }

    window.addEventListener("load", loadNotes);

