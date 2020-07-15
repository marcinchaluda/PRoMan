import { dataHandler } from './data_handler.js';
import { dom } from './dom.js';

const defaultColumns = {0: 'New', 1: 'In Progress', 2: 'Testing', 3:'Done'};
const captureInnerTextContainer = 16;
const taskContainer = 1;

export function generateBoards(boards) {
    let boardList = '';

    for(let board of boards){
        boardList += `
            <li class="flex-row-start">
                <div class="title flex-row-start">
                    <h3>${board.title}</h3>
                    <a href="#" type="button">
                        <i class="fas fa-plus-circle"></i>New card
                    </a>
                </div>
                <div class="board-details flex-row-end">
                    <i class="detail-button fas fa-ellipsis-h" boardId="${board.id}"></i>
                </div>
            </li>
            <div class="cards-container flex-row-start hide-details"} containerBoardId="${board.id}">${generateBoardDetails(board)}</div>
        `;

    }
    return boardList;
}

export function generateBoardDetails(board) {
    let cardList = '';

    for (let index in defaultColumns) {
        cardList += `
            <div class='cell' id="${defaultColumns[index]}">
                <h3>${defaultColumns[index]}</h3>
                <div class="tasks flex-column" cardId="${board.id}"></div>
            </div>
        `;
    }
    return cardList;
}

export function handleDetailButton() {
    const detailBtn = document.querySelectorAll('.detail-button');

    detailBtn.forEach(button => {
        button.addEventListener('click', function () {
            const id = button.getAttribute('boardId');
            dom.loadCards(id);
            const cardsContainer = button.parentElement.parentElement.nextElementSibling;
            cardsContainer.classList.toggle('show');
            if (cardsContainer.style.maxHeight){
              cardsContainer.style.maxHeight = null;
            } else {
              cardsContainer.style.maxHeight = cardsContainer.scrollHeight + captureInnerTextContainer + "px";
            }

            button.className = button.classList.contains('fa-ellipsis-h') ?
                'detail-button fas fa-times' : 'detail-button fas fa-ellipsis-h';

            dom.loadCards(id);
        });
    });
}

export function assignTask(cards) {

    cards.forEach(card => {

        const columnName = defaultColumns[card.status_id];
        const tasks = [...document.querySelector(`[containerBoardId="${card.board_id}"]`).children];

        tasks.forEach(column => {
            // column.setAttribute('statusID', card.status_id);
            // column.children[taskContainer].setAttribute('cardId', card.id);
            // column.children[taskContainer].setAttribute('order', card.order);
            clearTaskContainer(card, column);
            if (column.getAttribute('id') === columnName) {
                const task = document.createElement('div');
                task.textContent = card.title;
                column.children[taskContainer].appendChild(task);
            }
        });
    });
}

function clearTaskContainer(card, column) {
    const cardsContainer = document.querySelector(`[containerBoardId="${card.board_id}"]`)
    if (!cardsContainer.classList.contains('show')) {
        column.children[taskContainer].innerHTML = '';
    }
}
