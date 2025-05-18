"use strict"
//google books api embed
// //globala variabler
// let bookArray = [];




// async function loadBooks() {
//     try {
//         //ajax-anrop
//         const dataFetch = await fetch("https://www.google.com/books/jsapi.js")




//         //vänta på svar, kovertera till json, lagra i global array
//         bookArray = await dataFetch.json();




//         initialize(bookArray);




//     } catch (error) {
//         //till utvecklare
//         console.error(error);




//         //till användare
//         document.getElementById("error").innerHTML = "<p>Något blev fel med anslutningen. Försök igen senare!</p>"
//     }
// }




// google.books.load();




// //om något går fel i hämtningen
// function alertNotFound() {
//     alert("could not embed the book!");
// }








// //initialize viewer med specifik bok genom att hämta bokens ISBN
// //måste sändas innan någon annan operation utförs på vy-objektet
// function initialize() {
//     //hämta viewer
//     const viewer = new google.books.DefaultViewer(document.getElementById("viewerCanvas"));




//     viewer.load("ISBN:9781635570298", alertNotFound);
// }








// //för att se om allt har laddat in ordentligt
// //This callback may be useful if, for example, you only want to show certain elements on your page if the viewer has fully rendered.
// /*function alertInitialized() {
//     alert("book successfully loaded and initialized!");
//   }




// function initialize() {
//     var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
//     viewer.load('ISBN:0738531367', null, alertInitialized);
// } */




// google.books.setOnLoadCallback(initialize);








//google books api -search
// const searchInputEl = document.getElementById("search");
// const displaySearchEl = document.getElementById("displaySearch");
// const searchButtonEl = document.getElementById("searchButton");
// const bookImageEl = document.getElementById("bookImage");
// const bookNameEl = document.getElementById("bookName");
// const authorNameEl = document.getElementById("authorName");
// const publishedDateEl = document.getElementById("publishedDate");
// const descriptionEl = document.getElementById("description");
// const genreEl  = document.getElementById("genre");
// const pageCountEl = document.getElementById("pageCount");
// const books = [];




// searchButtonEl.addEventListener("click", initializeBooks());




// async function initializeBooks() {




//     if(searchInputEl === "") {
//         alert("Write a title");
//     } else {
//         try {
//             const dataFetch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=volume:${searchInputEl}`);
         
//             if (!dataFetch.ok) {
//                 throw new Error("Book not found");
//             }




//             const data = await dataFetch.json();
//             console.log("data: " + data);




//             const book = data.items[0].volumeInfo; //datan som först kommer upp




//             console.log("book:" + book);




//             bookImageEl.src = book.imageLinks ? book.imageLinks.thumbnail : "../frog.jpg"; //om det inte finns någon bild/thumbnail till boken kommer grodan automatiskt visas
//             bookNameEl.value = book.title;
//             authorNameEl.value = book.authors ? book.authors.join(",") : "Unknown author"; //om det finns fler författare, skriv ut alla
//             publishedDateEl.value = book.publishedDate ? book.publishedDate : "Not available";
//             descriptionEl.value = book.description ? book.description : "Not available";
//             genreEl.value = book.categories ? book.categories : "Not available";
//             pageCountEl.value = book.pageCount ? book.pageCount : "Not avilable";




         




         
         
//             //writeOutSearch(books);
//         } catch(error) {
//             console.log(error);
 
//             document.querySelector("#error").innerHTML = "<p>Något gick fel med anslutningen. Kom tillbaka och försök igen senare!</p>"
//         }
//     }
 
// }




// function writeOutSearch() {
 




//     console.log("writeOutSearch");
// }








"use strict"


//hämtar variabler
const searchInputEl = document.getElementById("search");
const displaySearchEl = document.getElementById("displaySearch");
let titleMessageEl = document.getElementById("writeTitle");
const searchButtonEl = document.getElementById("searchButton");

const books = [];


//bokinfo-variabler
const bookImageEl = document.getElementById("bookImage");
const bookTitleEl = document.getElementById("bookTitle");
const bookAuthorEl = document.getElementById("bookAuthor");
const bookGenreEl = document.getElementById("bookGenre");
const bookPagesEl = document.getElementById("bookPages");
const bookPublishedEl = document.getElementById("bookPublished");
const bookIsbnEl = document.getElementById("bookIsbn");
const bookDescriptionEl = document.getElementById("bookDescription");


//lyssna efter när knappen trycks
searchButtonEl.addEventListener("click", e => {initializeBooks(e)});



//google books API - att söka efter böcker
//hämtar böcker
async function initializeBooks(event){
   event.preventDefault();

   const search = searchInputEl.value;

   titleMessageEl = "";


  //SKA INTE FINNAS HÄR?
  /*if (search === "") {
       //titleMessageEl.innerHTML = "Please, write a title";
       console.log(`${titleMessageEl}: "Please, write a title"`)
   } else {
       */
       try {
           //ajax-anrop
           const dataFetch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=volume:${search}&maxResults=5`);
         
           if (!dataFetch.ok) {
               document.querySelector("#error").innerHTML = "<p>Book not found</p>"
           }
           //console.log(`search: ${searchInputEl.id}`);
     
           //lägger in datan arrayen
           const data = await dataFetch.json();
           console.log(data.items);


           //const moreData = data.items;

          // const search = searchInputEl.value;

           //console.log(books);
          //
           // console.log(data);

           // console.log(books);
           writeOutBook(data.items);
       } catch(error) {
           console.log(error);

           document.querySelector("#error").innerHTML = "<p>Something went wrong with the connection. Please, try again later!</p>";
       }
 //  }
}




//skriver ut böcker
function writeOutBook(books) {
   console.log(books.volumeInfo);
   
   //OM BARA VISAR FÖRSTA
   const book = books[0].volumeInfo;

   bookImageEl.src = book.imageLinks ? book.imageLinks.thumbnail : "Image unavailable";
   bookTitleEl.innerHTML = book.title ? book.title : "Title not found";
   bookAuthorEl.innerHTML = book.authors ? book.authors.join(", ") : "Unknown author";
   bookGenreEl.innerHTML = book.categories ? book.categories.join(", ") : "Not available";
   bookPagesEl.innerHTML = book.pageCount ? book.pageCount : "Not available";
   bookPublishedEl.innerHTML = book.publishedDate ? book.publishedDate : "Not available";
   bookIsbnEl.innerHTML = book.isbn ? book.isbn : "Not available"; //dubbelkolla
   bookDescriptionEl.innerHTML = book.description ? book.description : "Not available";

   //fixa bokutseendet
   //fixa en knapp där man istället använder books[1].volumeInfo

   console.log(book);
   //OM VISAR 5
   /*displaySearchEl = "";


   for(let i = 0; books.length < i; i++) {
       const newBook =
       `
       <article>
           <h3>Title: </h3>
           <p>${books[i].title}</p>
       </article>
       <article>
           <h3>Author(s): </h3>
           <p>${books[i].authors}</p>
       </article>
       <article>
           <h3>Genre: </h3>
           <p>${books[i].categories}</p>
       </article>
       <article>
           <h3>Page Count: </h3>
           <p>${books[i].pagecCount}</p>
       </article>
       <article>
           <h3>First published: </h3>
           <p>${books[i].publishedDate}</p>
       </article>
               <article>
           <h3>ISBN-number: </h3>
           <p>${books[i].isbn}</p>
       </article>       
       <article>
           <h3>Description: </h3>
           <p>${books[i].description}</p>
       </article>
       `
       displaySearchEl.innerHTML += newBook;
       console.log(newBook);
   }*/


  /* if(searchInputEl == book.title) {
       bookTitleEl.innerHTML = book.title;
   } else {
       console.log("Book not found");
   }*/


   console.log("writeoutbook");
   //console.log(data.title);
}




/*
 
lägg in json data i array
searchInputEl söker efter array.title
skriv ut boktiteln
*/


/*
//för att söka
function search() {
   const searchPhrase = document.getElementById("search").value;
}
*/
