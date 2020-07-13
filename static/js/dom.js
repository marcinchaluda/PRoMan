// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
const displayTablesURL = '/get-boards';

export let dom = {
    init: function () {
        fetch(displayTablesURL).then(response => {
            if(response.status !== 200) {
                console.log(`Looks like there was a problem. Status code: ${response.status}`)
                return;
            }
            response.json().then(tables => {
                document.querySelector('.boards').innerHTML = tables;
                console.log(tables);
            });
        }).catch(error => {
            console.error(`Fetch error ${error}`);
        });
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

        let boardList = '';

        for(let board of boards){
            boardList += `
                <li>${board.title}</li>
            `;
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
};
