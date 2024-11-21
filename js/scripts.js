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

// select input field
const searchInput = document.querySelector("#search-input");

// select export button
const exportBtn = document.querySelector("#export-notes");

//
// functions
//
// old notes show up
function showNotes() {
  cleanNotes();
  getNotes().forEach((note) => {
    const noteElement = createNote(
      note.id,
      note.content,
      note.fixed
    );
    notesContainer.appendChild(noteElement);
  });
}

// clean notes to pux from local storage and show fixed color
//  IMPORTANT, is Children not Child
function cleanNotes() {
  notesContainer.replaceChildren([]);
}


// new note creation
function addNote() {
  // create an array to record or load notes to the local storage
  const notes = getNotes();
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
  notes.push(noteObject);


  // call a save function in the local storage
  saveNotes(notes);

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

  // 
  // create icons
  // 

  // pin
  const pinIcon = document.createElement("i");
  pinIcon.classList.add(...["bi","bi-pin"]);
  element.appendChild(pinIcon);

  // delete
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add(...["bi","bi-x-lg"]);
  element.appendChild(deleteIcon);

  // duplicate
  const duplicateIcon = document.createElement("i");
  duplicateIcon.classList.add(...["bi","bi-file-earmark-plus"]);
  element.appendChild(duplicateIcon);

// add class fixed if it's fixed
  if (fixed) {
    element.classList.add("fixed")
  }


// icons events

// note textarea change
element.querySelector("textarea").addEventListener("keyup", (e) => {
  const noteContent = e.target.value;
  updateNote(id, noteContent);
})

//  PIN icon
element.querySelector(".bi-pin").addEventListener("click", () => {
  toggleFixNote(id);
});

// delete icon
element.querySelector(".bi-x-lg").addEventListener("click", () => {
  deleteNote(id,element)
})

// duplicate icon
element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
  copyNote(id)
})

return element;
}

// 
// icons functions to reflect in the localstorage and DOM
// 

// Note textarea localstorage update
function updateNote(id, noteContent) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  targetNote.content = noteContent;
  saveNotes(notes);
}

// update fixed field in the local storage
function toggleFixNote(id) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  targetNote.fixed = !targetNote.fixed;
  saveNotes(notes);
  showNotes();
}

// delete note from localstorage and remove from DOM
function deleteNote (id,element) {
  const notes = getNotes().filter((note) => note.id !== id)
  saveNotes(notes);
  notesContainer.removeChild(element);
}

// copy note to localstorage and DOM
function copyNote (id) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  const noteObject = {
    id: generateId(),
    content: targetNote.content,
    fixed: false,
  };
  const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed)
  notesContainer.appendChild(noteElement);
  notes.push (noteObject);
  saveNotes(notes);
}

//
// local storage
//

// get notes from local storage
function getNotes() {
  // JSON convert to array, if no data, initializa an empty array
  const notes = JSON.parse(localStorage.getItem("notes") || "[]")
  // sort fixed notes to be the first in the localstorage
  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1: 1));
  return orderedNotes;
}

// save note in the local storage
function saveNotes(notes) {
  // convert an array in JSON
  localStorage.setItem("notes", JSON.stringify(notes));
}

// show search notes
function searchNotes(search) {
  const searchResults = getNotes().filter((note) => 
    note.content.includes(search)
  )
  if (search !== "") {
    cleanNotes();
    searchResults.forEach((note) => {
      const noteElement = createNote(note.id, note.content, note.fixed);
      notesContainer.appendChild(noteElement);
    })
    return
  }
  cleanNotes();
  showNotes()
}


// export notes to csv file
function exportData () {
  const notes = getNotes();

  // csv pattern separate data with ' and break line with \n
  const csvString = [["ID","CONTENT","FIXED?"],
  ...notes.map((note) => [note.id, note.content, note.fixed]),
]
.map((e) => e.join(","))
.join("\n");
// download the csv file
// create a link in DOM
const element = document.createElement("a");
// create a link in DOM
element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

element.target = "_blank";
element.download = "notes.csv"
element.click();

}


//
// events
//
// btn add note select, calling addNote function
addNoteBtn.addEventListener("click", () => addNote());

// search field if filled with enter or text
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  searchNotes(search);
})

// add event with enter key
noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
})

// export btn to excel
exportBtn.addEventListener("click", () => exportData());

//
// initial setup
//
// load old notes from local storage
showNotes();
