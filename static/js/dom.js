// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
import { generateBoards, handleDetailButton, assignTask } from './container_generator.js'

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
        dataHandler.getBoards(function(boards) {
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
        document.body.appendChild(boardsContainer);
        handleDetailButton();
    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getBoard(boardId, function (response) {
            dom.showCards(response);
        });

    },
    showCards: function (cards) {
        assignTask(cards);
    },
    displayNewBoard: function (title) {
        addBoard(title)
    },
    // here comes more features
};

// TODO temporary function, later it will be used function from feature 1
function addBoard(title) {
    const boardContainer = document.querySelector('.board-container');
    const newBoard = `
            <li class="flex-row-start">
                <div class="title flex-row-start">
                    <h3>${title}</h3>
                    <a href="#" type="button">
                        <i class="fas fa-plus-circle"></i>New card
                    </a>
                </div>
                <div class="board-details flex-row-end">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </li>
            <div class="cards-container flex-row-start">${generateBoardDetails()}</div>
        `;

    boardContainer.insertAdjacentHTML("beforeend", newBoard);
}