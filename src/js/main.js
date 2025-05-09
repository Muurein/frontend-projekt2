"use strict"

//globala variabler
let bookArray = [];

async function loadBooks() {
    try {
        //ajax-anrop
        const dataFetch = await fetch("https://www.google.com/books/jsapi.js")

        //vänta på svar, kovertera till json, lagra i global array
        bookArray = await dataFetch.json();

        initialize(bookArray);

    } catch (error) {
        //till utvecklare
        console.error(error);

        //till användare
        document.getElementById("error").innerHTML = "<p>Något blev fel med anslutningen. Försök igen senare!</p>"
    }
}

google.books.load();

//om något går fel i hämtningen
function alertNotFound() {
    alert("could not embed the book!");
}


//initialize viewer med specifik bok genom att hämta bokens ISBN
//måste sändas innan någon annan operation utförs på vy-objektet
function initialize() {
    //hämta viewer
    const viewer = new google.books.DefaultViewer(document.getElementById("viewerCanvas"));

    viewer.load("ISBN:9781635570298", alertNotFound);
}


//för att se om allt har laddat in ordentligt
//This callback may be useful if, for example, you only want to show certain elements on your page if the viewer has fully rendered.
/*function alertInitialized() {
    alert("book successfully loaded and initialized!");
  }

function initialize() {
    var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
    viewer.load('ISBN:0738531367', null, alertInitialized);
} */ 

google.books.setOnLoadCallback(initialize);