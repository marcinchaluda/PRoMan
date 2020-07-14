// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
const defaultColumns = ['New', 'In Progress', 'Testing', 'Done'];

export let dom = {
    init: function () {
        // fetch(displayTablesURL).then(response => {
        //     if(response.status !== 200) {
        //         console.log(`Looks like there was a problem. Status code: ${response.status}`)
        //         return;
        //     }
        //     response.json().then(tables => {
        //         document.querySelector('.boards').innerHTML = tables;
        //         console.log(tables);
        //     });
        // }).catch(error => {
        //     console.error(`Fetch error ${error}`);
        // });
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        const boardList = generateBoards(boards);

        const outerHtml = `
            <ul class="board-container flex-column">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        const showFirstTableDetails = document.querySelector('.box-container div:first-child');
        showFirstTableDetails.classList.add('.show');
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        // let cardsContainer = document.querySelector('.cards-container');
        // console.log(cardsContainer)
        // pipe extension -> pipes value into a function
        // cards |> generateBoardDetails |> cardsContainer.appendChild;
        // cardsContainer.appendChild(generateBoardDetails(cards))
    },
    // here comes more features
};

function generateBoards(boards) {
    let boardList = '';

    for(let [index, board] of boards.entries()){
        boardList += `
            <li class="flex-row-start">
                <div class="title flex-row-start">
                    <h3>${board.title}</h3>
                    <a href="#" type="button">
                        <i class="fas fa-plus-circle"></i>New card
                    </a>
                </div>
                <div class="board-details flex-row-end">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </li>
            <div class="cards-container flex-row-start ${index == 0 ? 'show' : ''}"}>${generateBoardDetails()}</div>
        `;
    }
    return boardList;
}

function generateBoardDetails() {
    let cardList = '';

    for (let index in defaultColumns) {
        cardList += `
            <div class='cell'>
                <h3>${defaultColumns[index]} ${index}</h3>
                <div class="tasks flex-column">asdas</div>
            </div>
        `;
    }
    return cardList;
}