import {dataHandler} from "./data_handler.js";

const body = document.querySelector('body');


function createModal(id, headerText) {
    const modal = createElementWithClasses('div', ['modal']);
    const modalContent = createElementWithClasses('div', ['modal-content']);
    const modalHeader = createElementWithClasses('div', ['modal-header']);
    const modalBody = createElementWithClasses('div', ['modal-body']);
    const modalFooter = createElementWithClasses('div', ['modal-footer']);

    const closeXButton = createElementWithClasses('span', ['close']);
    const textXButton = document.createTextNode('x');
    closeXButton.appendChild(textXButton);

    closeXButton.onclick = function () {
        modal.style.display = "none";
    }

    const headerDescription = createElementWithClasses('h2', []);
    const textToAdd = document.createTextNode(headerText);

    headerDescription.appendChild(textToAdd);

    modalHeader.appendChild(closeXButton);
    modalHeader.appendChild(headerDescription);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modal.appendChild(modalContent);

    modal.setAttribute('id', id);

    return modal
}

function createElementWithClasses(typeOfElement, listOfClasses) {
    const element = document.createElement(typeOfElement);
    for (let classOnList of listOfClasses) {
        element.classList.add(classOnList);
    }

    return element
}

const newBoardModal = createModal('new-board-modal', 'Create new board');
body.appendChild(newBoardModal);

//----------------------------------------------------------

function fillNewBoardModalFooter() {
    const modalContent = document.querySelector('#new-board-modal > .modal-content');
    const modalBody = document.querySelector('#new-board-modal > .modal-content > .modal-body');
    const modalFooter = document.querySelector('#new-board-modal > .modal-content > .modal-footer');

    const myInput = document.createElement('input');
    myInput.setAttribute('name', 'my_input');
    myInput.setAttribute('type', 'text');
    myInput.setAttribute('id', 'board-title');

    modalBody.appendChild(myInput);

    const saveButton = createElementWithClasses('button', []);
    const myForm = document.createElement('form');
    saveButton.setAttribute('type', 'submit');
    const textSaveButton = document.createTextNode('Save');
    saveButton.appendChild(textSaveButton);

    modalFooter.appendChild(saveButton)

    myForm.appendChild(modalBody);
    myForm.appendChild(modalFooter);

    myForm.addEventListener('submit', function (evant) {
        evant.preventDefault();
        const modalNewBoard = document.querySelector('#new-board-modal');
        const inputValue = document.getElementById('board-title').value
        modalNewBoard.style.display = "none"
        dataHandler.createNewBoard(inputValue, function (response) {
            console.log(response);
        });
    })

    modalContent.appendChild(myForm);

}

//----------------------------------------------------------
fillNewBoardModalFooter(newBoardModal);

const newBoardButton = document.getElementById('new-board-button');
newBoardButton.onclick = function () {
    newBoardModal.style.display = "block";
}
