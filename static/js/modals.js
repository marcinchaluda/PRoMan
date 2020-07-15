import {dataHandler} from "./data_handler.js";
import {dom} from "./dom.js";

export let modals = {
    modalsInit: function () {
        const allButtonsAddNewCard = document.querySelectorAll('.board-container > .flex-row-start > .title > a');

        for (let newCardButton of allButtonsAddNewCard) {
            newCardButton.setAttribute('boardId', '1');

            newCardButton.onclick = function () {
                newCardModal.style.display = "block";
                localStorage.setItem('activeBoard', newCardButton.getAttribute('boardId'));
            }
        }
    }
}

// function create basic template for modal
function createModal(id, headerText) {
    const modal = createElementWithClasses('div', ['modal']);
    const modalContent = createElementWithClasses('div', ['modal-content']);
    const modalHeader = createElementWithClasses('div', ['modal-header']);
    const modalBody = createElementWithClasses('div', ['modal-body']);
    const modalFooter = createElementWithClasses('div', ['modal-footer']);

    const closeXButton = createCloseXButton(modal);
    const headerDescription = createHeader(headerText);

    appendChildren(modalHeader, [headerDescription, closeXButton]);
    appendChildren(modalContent, [modalHeader, modalBody, modalFooter]);

    modal.appendChild(modalContent);
    modal.setAttribute('id', id);

    return modal
}

function createHeader(headerText) {
    const header = createElementWithClasses('h2', ['modal-h2']);
    const textToAdd = document.createTextNode(headerText);
    header.appendChild(textToAdd);

    return header
}

function createCloseXButton(modal) {
    const closeXButton = createElementWithClasses('span', ['close']);
    const textXButton = document.createTextNode('x');
    closeXButton.appendChild(textXButton);

    closeXButton.onclick = function () {
        modal.style.display = "none";
    }

    return closeXButton
}

function appendChildren(parent, listOfChildren) {
    for (const child of listOfChildren) {
        parent.appendChild(child);
    }
}

function createElementWithClasses(typeOfElement, listOfClasses) {
    const element = document.createElement(typeOfElement);
    for (let classOnList of listOfClasses) {
        element.classList.add(classOnList);
    }

    return element
}

// Inject data to basic modal to create modal for adding new boards
function fillNewBoardModal(modalId, inputId) {
    const modalContent = document.querySelector(`#${modalId} > .modal-content`);
    const modalBody = document.querySelector(`#${modalId} > .modal-content > .modal-body`);
    const modalFooter = document.querySelector(`#${modalId} > .modal-content > .modal-footer`);

    const boardTitleInput = createNewTextInput(inputId)
    modalBody.appendChild(boardTitleInput);

    const saveButton = createSaveButton();
    modalFooter.appendChild(saveButton)

    const newBoardForm = createNewBoardForm(modalBody, modalFooter, modalId);

    modalContent.appendChild(newBoardForm);
}

function createNewTextInput(id) {
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('id', id);

    return newInput
}

function createSaveButton() {
    const newButton = createElementWithClasses('button', []);
    newButton.setAttribute('type', 'submit');

    const textSaveButton = document.createTextNode('Save');
    newButton.appendChild(textSaveButton);

    return newButton
}

function createNewBoardForm(modalBody, modalFooter, modalId) {
    const newForm = document.createElement('form');
    newForm.appendChild(modalBody);
    newForm.appendChild(modalFooter);
    newForm.addEventListener('submit', function (evant) {
        evant.preventDefault();
        modalId === 'new-board-modal' ? sendNewBoardTitleToServer() : sendNewCardTitleToServer();
    })

    return newForm
}

function sendNewBoardTitleToServer() {
    const modalNewBoard = document.querySelector('#new-board-modal');
    modalNewBoard.style.display = "none"

    const inputValue = document.getElementById('board-title').value
    dom.displayNewBoard(inputValue);
    dataHandler.createNewBoard(inputValue, function (response) {
        //TODO zapisuje dane do DB, co robić z jakimś responsem po stronie frontu
    });
}

function sendNewCardTitleToServer() {
    const modalNewBoard = document.querySelector('#new-card-modal');
    modalNewBoard.style.display = "none"

    const data = {
        title: document.getElementById('card-title').value,
        boardId: localStorage.getItem('activeBoard'),
        statusId: 0
    }

    dataHandler.createNewCard(data, function (response) {
        //TODO zapisuje dane do DB, co robić z jakimś responsem po stronie frontu
        console.log(response);
    });
}

// -------------------------------------------------------------------------------------

const body = document.querySelector('body');

// Add new basic modal to page for new board creation and fill with content
const newBoardModal = createModal('new-board-modal', 'Create new board');
body.appendChild(newBoardModal);
fillNewBoardModal('new-board-modal', 'board-title');

// Add new basic modal to page for new card creation and fill with content
const newCardModal = createModal('new-card-modal', 'Create new task');
body.appendChild(newCardModal);
fillNewBoardModal('new-card-modal', 'card-title');

// Call modal on click New Board button
const newBoardButton = document.getElementById('new-board-button');
newBoardButton.onclick = function () {
    newBoardModal.style.display = "block";
}
