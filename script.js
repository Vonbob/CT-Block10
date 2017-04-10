/* This script is using HTML local-storage to save user notes */

var idMax = 0;

var bg = ["blue", "brown", "green", "purple", "red"];

/* loading notes when page starts */
var loadNotes = function () {
    var key;
    for (key in localStorage) {
        if (key.search("note-") === 0) {
            var note = createNote(localStorage[key], key);
            note.prependTo(".notes-panel");
            var idNr = Number(key.substr(5));
            if (idMax <= idNr) {
                idMax = idNr+1;
            }
        }
    }
}

var ncClickEventHandler = function (event) {
    if (this === event.target) {
        return;
    }

    if ($(event.target).hasClass("remove-icon")) {
        var note = $(this).parent();
        localStorage.removeItem(note.attr("id"));
        note.remove();
    }
    else if ($(event.target).hasClass("check-box")) {
        if ($(event.target).is(":checked")) {
            $(this).parent().addClass("to-delete")
        }
        else {
            $(this).parent().removeClass("to-delete");
        }
    }
    else if ($(event.target).hasClass("save-icon")) {
        var noteId = $(this).parent().attr("id");
        localStorage[noteId] = $(this).parent(".note").text();
    }
}

/* creating new note */
var createNote = function (content, id) {

    var note = $("<div>").addClass("note");

    /* choosing random background for note */
    var bgIndex = Math.floor(Math.random() * 5);
    note.addClass(bg[bgIndex]);

    /* creating editable note content */
    var noteContent = $("<div>")
        .addClass("note-content")
        .attr("contenteditable", "true")
        .text(content);

    /* preparing control panel */
    var noteControl = $("<div>")
        .addClass("note-controls")
        .click(ncClickEventHandler);

    /* adding icons to control panel */
    /* delete icon */
    var removeIcon = $("<img>")
        .attr("src", "images/remove.png")
        .attr("title", "remove note")
        .addClass("control remove-icon");
    noteControl.append(removeIcon);

    /* checkbox */
    var checkbox = $("<input>")
        .attr("type", "checkbox")
        .addClass("control check-box");
    noteControl.append(checkbox);

    /* save icon */
    var saveIcon = $("<img>")
        .attr("src", "images/save.png")
        .attr("title", "save changes")
        .addClass("control save-icon");
    noteControl.append(saveIcon);

    note.append(noteControl);
    note.append(noteContent);

    note.attr("id", id);

    return note;
}

/* creates new note and adds its content to browser local storage */
var addNoteEventHandler = function () {
    var noteText = $(".text-input").val();
    $(".text-input").val("");

    var noteId = "note-" + idMax;

    var note = createNote(noteText, noteId);
    note.prependTo(".notes-panel");
    localStorage.setItem(noteId, noteText);

    idMax += 1;
}

/* removes selected notes from page and browser local storage */
var removeCheckedEventHandler = function () {
    var notes = $(".notes-panel").children();
    var i = 0;
    for (; i < notes.length; ++i) {
        if ($(notes[i]).hasClass("to-delete")) {
            localStorage.removeItem($(notes[i]).attr("id"));
            $(notes[i]).remove(); 
        }      
    }
}

var addEventDOMListeners = function () {
    $(".add-note-btn").click(addNoteEventHandler);
    $(".remove-checked-btn").click(removeCheckedEventHandler);
};

$(document).ready(loadNotes);
$(document).ready(addEventDOMListeners);