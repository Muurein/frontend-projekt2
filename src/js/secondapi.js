"use strict";

//hämtar New York Times article search api
class nyTimesApi {
    constructor () {
        this.baseUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?page=0&api-key=yPxGdyrd6TQgOI2EJdGW1pjVQa9KNPyR";
    }

    //vad exakt för info api:t ska hämta
    bookReviewQueryUrl() {
        return this.baseUrl+"&fq=typeOfMaterials%3AReview AND section.name%3ABooks";
    }

    //baserat på sök
    async search(searchString) {
        let result = await fetch(this.bookReviewQueryUrl()+`&q=${searchString}`).then(async (response) => {
          return await response.json();
        }); 
    
        return result;
    }
}

export default nyTimesApi;