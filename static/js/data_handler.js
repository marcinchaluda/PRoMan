// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(data),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json"
            })
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_delete: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin',
            body: JSON.stringify(data),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json"
            })
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data['cards'] = response;
            callback(response);
        });
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardDetails, callback) {
        // console.log(boardDetails)
        // creates new board, saves it and calls the callback function with its data
        this._api_post('/boards', boardDetails, (response) => {
            console.log(response)
            this._data['newBoard'] = response;
            callback(response);
        });
    },
    createNewCard: function (cardData, callback) {
        // creates new card, saves it and calls the callback function with its data
        this._api_post('/save-new-card', cardData, (response) => {
            this._data['newCard'] = response;
            callback(response);
        });
    },
    updateCardsPosition: function (cardsData, callback) {
        this._api_post('/update-cards-position', cardsData, callback);
    },

    updateCardsOrderNumbers: function (cardsOrderNumbers, callback) {
        this._api_post('/update-cards-order-numbers', cardsOrderNumbers, (response) => {
            this._data['cardsOrderNumbers'] = response;
            callback(response);
        });
    },

    deleteBoard: function (boardId, callback) {
        // delete board with provided id
        this._api_delete('/boards', boardId, (response) => {
            this._data['boardId'] = response;
            callback(response);
        });
    },

    // here comes more features
};
