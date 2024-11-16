// "use strict";
//
// elements
//
// select where notes will be added
const notesContainer = document.querySelector("#notes-container");

// select a note text to be created
const noteInput = document.querySelector("#note-content");

// select button to create a note
const addNoteBtn = document.querySelector(".add-note");

//
// functions
//
// old notes show up
function showNotes() {
    console.log("oi")
  getNotes().forEach((storageNotes) => {
    console.log("uaia")
    const oldNotesElement = createNote(
      storageNotes.id,
      storageNotes.content,
      storageNotes.fixed
    );
    notesContainer.appendChild(oldNotesElement);
  });
}

// new note creation
function addNote() {
  // create an array to record or load notes to the local storage
  const newNote = getNotes();
  // create an object to hold all note components
  const noteObject = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
  };
  // to separate responsabilities another funcion is called. Only 2 parameters because one is fixed to all
  const noteElement = createNote(noteObject.id, noteObject.content);
  // add note html to the main code
  notesContainer.appendChild(noteElement);
  // add note to the array
  newNote.push(noteObject);
  console.log("add note")
  console.log(newNote)
console.log(noteObject)
  // call a save function in the local storage
  saveNotes(newNote);
  // clean create note input field
  noteInput.value = "";
}

// generate a random id in a 5000 numbers
function generateId() {
  return Math.floor(Math.random() * 5000);
}

// create html for new added note or local storage notes old
function createNote(id, content, fixed) {
  const element = document.createElement("div");
  element.classList.add("note");
  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.placeholder = "Some text..";
  element.appendChild(textarea);
  return element;
}

//
// local storage
//

// get notes from local storage
function getNotes() {
  // JSON convert to array, if no data, initializa an empty array
  const oldNotes = JSON.parse(localStorage.getItem("oldNotes") || "[]");
  console.log("getnotes")
  console.log(oldNotes)

  return oldNotes;
}

// save note in the local storage
function saveNotes(allNotes) {
    console.log("save notes")
    console.log(allNotes)
  // convert an array in JSON
  localStorage.setItem("allNotes", JSON.stringify(allNotes));
}

//
// events
//
// btn add note select, calling addNote function
addNoteBtn.addEventListener("click", () => addNote());

//
// initial setup
//
// load old notes from local storage
showNotes();
