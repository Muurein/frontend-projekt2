"use strict"

import nyTimesApi from "./secondapi.js";

/**
 * Platser där text skrivs ut som gäller för både små och stora skärmar.
 */
const searchInputEl = document.getElementById("search");
const searchButtonEl = document.getElementById("searchButton");
let displaySearchEl = document.getElementById("displaySearch");
let titleMessageEl = document.getElementById("writeTitle");


/**
 * Variabler för mobilversionen.
 */
const reviewsDivEl = document.getElementById("reviews");
const reviewsH2El = document.getElementById("reviewsH2");
let displayOnPhoneEl = document.getElementById("displayOnPhone");

/**
 * Variabler för desktop-versionen, dvs blädderboken.
 */
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");
const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const paper3 = document.querySelector("#p3");
const paper4 = document.querySelector("#p4");
const paper5 = document.querySelector("#p5");
const paper6 = document.querySelector("#p6");
const back1El = document.getElementById("b1");
const front2El = document.getElementById("f2");
const back2El = document.getElementById("b2");
const front3El = document.getElementById("f3");
const back3El = document.getElementById("b3");
const front4El = document.getElementById("f4");
const back4El = document.getElementById("b4");
const front5El = document.getElementById("f5");
const back5El = document.getElementById("b5");
const front6El = document.getElementById("f6");
const back6El = document.getElementById("b6");
let books = [];


/**
 * Övriga variabler.
 */
let currentLocation = 0;
let numOfPapers = 7;
let maxLocationBooks = numOfPapers + 1;


/**

 * Eventlyssnare
 */
searchButtonEl.addEventListener("click", e => {initializeBooks(e)});
prevBtn.addEventListener("click", () => goPrevPage());
nextBtn.addEventListener("click", () => goNextPage());


/**
 * Hämtar sökresultatet från formuläret, dvs hämtar användarens sökfras/input.
 * @param {string} event för att se till att användarens sökfras/input inte skickas iväg via formuläret.
 * 
 * Tar användaren till funktionen goPrevPage om i är större än currentLocation.
 * Säger att värdet på currentLocation ska vara 0 från början för att switch-satsen i funktionen updateBookState ska stämma.
 * Tar användaren till funktionen goNextPage, hämtar datan från NYTimes API:t och hämtar datan som ska synas i mobilversionen sålänge
 * som arrayen books (datan från Google Books API) har ett värde
 */
async function initializeBooks(event){
    event.preventDefault();

    console.log("sökt");
    const search = searchInputEl.value;
   // slides = await getBooks(search);
    books = await getBooks(search);

    for(let i = 0; i < currentLocation; i++) {
        goPrevPage();
    }

    currentLocation = 0;
    
    //tar användaren till nästa sida, hämtar NYtimes-api:t efter en check samt hänvisar till hur
    //innehållet ska presenteras i mobilversionen
    if(books != null) {
        goNextPage();
        initializeReviews();
        phoneBookState(books);
    }

}

/**
 * 
 * @param {string} search som är användarens input i formuläret.
 * @returns {array} data om fetchen gick som planerat.
 * @returns {null} null om fetchen inte gick som planerat.
 */
async function getBooks(search) {
    try {
        //ajax-anrop
        const dataFetch = await fetch(`https://www.googleapis.com/books/v1/volumes?q=volume:${search}&maxResults=5`);
      
        if (!dataFetch.ok) {
            document.querySelector("#error").innerHTML = "<p>Book not found</p>"
        }
  
        //lägger in datan arrayen
        const data = await dataFetch.json();
        console.log(data);

        return data;


    } catch(error) {
        console.log("booksearch: " + error);

        document.querySelector("#bookError").innerHTML = "<p>Something went wrong with the connection. Please, try again later!</p>";
    }
    return null;
 } 

/**
 * Hämtar NYTimes-API:t från den andra JS-filen (secondapi.js) och kopplar den med variabeln searchInputEl
 * som styr användarens input i sökfältet. 
 */
 async function initializeReviews() { 
    let reviewInfo = new nyTimesApi();

    let reviewsResult = await reviewInfo.search(searchInputEl.value);

    //begränsar till tre recensioner
    reviewsResult.response.docs.length = 3;

    let newReview = "";

    reviewsResult.response.docs.forEach((review) => {
        newReview += `<p>${review.web_url}</p>`;
    });

    reviewsDivEl.innerHTML = newReview;

    if (reviewsResult.response.docs.length !== 0) {
        reviewsH2El.style.display = "block";
        reviewsH2El.style.backgroundColor = "base.$color-primary";
        reviewsDivEl.style.backgroundColor = "base.$color-primary";
    } else {
        reviewsH2El.style.display = "none";
    }
}


/**
 * Öppnar boken, stylar knappar därefter.
 */
 function openBook() {
    book.style.transform = "translateX(50%)";
    prevBtn.style.transform = "translateX(-180px)";
    nextBtn.style.transform = "translateX(180px)";
}
 
/**
 * Stänger boken, stylar bok och knappar därefter.
 */
function closeBook() {
    if(currentLocation <= 1) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }

    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
}


/**
 * 
 * Funktionen används bara i desktop-versionen. Uppdaterar innehållet i boken.
 * Vilket state som switch-satsen ska gå efter, kan ses som vilken sida, eller uppslag, i boken som är öppen.
 * @param {number} state 
 * 
 * Om parametern är true betyder det att det är nästa och om den är false är det föregående sida. 
 * @param {boolean} isNextPage 
 * 
 * Datan från Google Books API.
 * @param {array} books 
 */
function updateBookState(state, isNextPage, books) {
    let bookHTMLContent;

    switch(state) {
        case 0:
            closeBook(true);
            paper1.classList.remove("flipped");
            paper1.style.zIndex = 7; 
            break;
        case 1:
            openBook();

            if(isNextPage) {
                paper1.classList.add("flipped");
                paper1.style.zIndex = 1; 
            }   else {
                paper2.classList.remove("flipped");
                paper2.style.zIndex = 6; 
            }

            bookHTMLContent = renderBookSearchResult(books, 0);

            back1El.innerHTML =  bookHTMLContent.meta;
            front2El.innerHTML = bookHTMLContent.summary;
            break;
        case 2:
            if(isNextPage) {
                paper2.classList.add("flipped");
                paper2.style.zIndex = 2; 
            } else {
                paper3.classList.remove("flipped");
                paper3.style.zIndex = 5; 
            }
            bookHTMLContent = renderBookSearchResult(books, 1);

            back2El.innerHTML =  bookHTMLContent.meta;
            front3El.innerHTML = bookHTMLContent.summary;
            break;
        case 3:
            if(isNextPage) {
                paper3.classList.add("flipped");
                paper3.style.zIndex = 3; 
            } else {
                paper4.classList.remove("flipped");
                paper4.style.zIndex = 4; 
            }

            bookHTMLContent = renderBookSearchResult(books, 2);

            back3El.innerHTML =  bookHTMLContent.meta;
            front4El.innerHTML = bookHTMLContent.summary;
            break;
        case 4:
            if(isNextPage) {
                paper4.classList.add("flipped");
                paper4.style.zIndex = 4; 
            } else {
                paper5.classList.remove("flipped");
                paper5.style.zIndex = 3; 
            }
    
            bookHTMLContent = renderBookSearchResult(books, 3);
    
            back4El.innerHTML =  bookHTMLContent.meta;
            front5El.innerHTML = bookHTMLContent.summary;
            break;
        case 5:
            if(isNextPage) {
                paper5.classList.add("flipped");
                paper5.style.zIndex = 5; 
            } else {
                openBook();
                paper6.classList.remove("flipped");
                paper6.style.zIndex = 2; 
            }

            bookHTMLContent = renderBookSearchResult(books, 4);

            back5El.innerHTML =  bookHTMLContent.meta;
            front6El.innerHTML = bookHTMLContent.summary;
            break;
        case 6:
            if(isNextPage) {
                paper6.classList.add("flipped");
                paper6.style.zIndex = 6; 
                closeBook(true);
            }
            break;
        default:
            throw new Error("unkown state");
    }
}


/**
 * Gäller desktop-versionen.
 * 
 * @returns {null} null om books.items, dvs datan från Google Books API, inte har ett värde och avbryter därmed funktionen.
 * 
 * Annars går funktionen vidare för att se om currentLocation är mindre än maxLocationBooks, om det stämmer läggs
 * det på 1 till currentLocations väde och sidan bläddras framåt.
 */
function goNextPage() {
    if(!books.items) {
        return;
    }
    
    if(currentLocation < maxLocationBooks) {
        currentLocation++;
        updateBookState(currentLocation, true, books);
    }
}

/**
 * Gäller desktop-versionen.
 * 
 * @returns {null} null om books.items, dvs datan från Google Books API, inte har ett värde och avbryter därmed funktionen.
 * 
 * Annars går funktionen vidare för att se om currentLocation är större än 0, om det stämmer subtraheras
 * currentLocations värde med 1 och sidan bläddras bakåt.
 */
function goPrevPage(){
    if(!books.items) {
        return;
    }

    if (currentLocation > 0) {
        currentLocation--;
        updateBookState(currentLocation, false, books);
    }
}


/**
 * Hur datan ska presenteras i mobilversionen.
 * @param {array} books 
 * @param {number} index 
 */
function phoneBookState(books, index) {
    displayOnPhoneEl.innerHTML = "";
    console.log(books.items, index);

    books.items.forEach((book) => {
        const newBook = 
                `
                    <img src=${book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail: "Image unavailable"} alt="book cover" >
                    <article>
                        <h3>${book.volumeInfo.title ?? "Unavailable"}</h3>
                    </article>
                    <article>
                        <h4><b>Author(s):</b></h4>
                        <span>${book.volumeInfo.authors ? book.volumeInfo.authors.join(", "): "Unavailable"}</span>
        -            </article>
                    <article>
                        <h4><b>First published:</b></h4>
                        <span>${book.volumeInfo.publishedDate ?? "Unavailable"}</span>
                    </article>
                    <article>
                        <h4><b>Page Count:</b></h4>
                        <span>${book.volumeInfo.pageCount ?? "Unavailable"}</span>
                    </article>
                    <article>
                        <h4><b>Description:</b></h4>
                        <h4>${book.volumeInfo.description ?? "Unavailable"}</h4>
                    </article>
                `
        displayOnPhoneEl.innerHTML += newBook;
    })


}

/**
 * 
 * Gäller desktop-versionen.
 * Bygger upp hur innehållet/sökresultatet ska visas.
 * 
 * @param {array} books datan från Google Books API.
 * @param {number} index , vilket index i books som gäller.
 * @returns {object} meta och summary. Detta delas upp då metas värde kommer synas på den vänstra sidan i boken
 * och summarys värde kommer synas på den högra. 
 */

function renderBookSearchResult(books, index) {

    const book = books.items[index];
    const newBook1 =
                `
                <img src=${book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail: "Image unavailable"} alt="book cover" >
                <article>
                    <h3>${book.volumeInfo.title ?? "Unavailable"}</h3>
                </article>
                <article>
                    <p><b>Author(s):</b></p>
                    <span>${book.volumeInfo.authors ? book.volumeInfo.authors.join(", "): "Unavailable"}</span>
                </article>
                <article>
                    <p><b>First published:</b></p>
                    <span>${book.volumeInfo.publishedDate ?? "Unavailable"}</span>
                </article>
                <article>
                    <p><b>Page Count:</b></p>
                    <span>${book.volumeInfo.pageCount ?? "Unavailable"}</span>
                </article>
                `

                const newBook1Desc = 
                `
                <div>
                    <p><b>Description:</b></p>
                    <p>${book.volumeInfo.description ?? "Unavailable"}</p>
                </div>
                `

                return {meta: newBook1, summary: newBook1Desc};
}