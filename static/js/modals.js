function createModal(id, headerText) {
    const modal = createElementWithClasses('div', ['modal']);
    const modalContent = createElementWithClasses('div', ['modal-content']);
    const modalHeader = createElementWithClasses('div', ['modal-header']);
    const modalBody = createElementWithClasses('div', ['modal-body']);
    const modalFooter = createElementWithClasses('div', ['modal-footer']);

    const closeXButton = createElementWithClasses('span', ['close']);
    const textXButton = document.createTextNode('x');
    closeXButton.appendChild(textXButton);

    closeXButton.onclick = function(){
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
    for (let classOnList of listOfClasses){
        element.classList.add(classOnList);
    }

    return element
}

const body = document.querySelector('body');

const newBoardModal = createModal('new-board-modal', 'Create new board');
const newBoardButton = document.getElementById('new-board-button');
body.appendChild(newBoardModal);

const testSpan = document.querySelector('#new-board-modal > .modal-content > .modal-header > .close');
const test = document.querySelector('.modal-body');
const testText = document.createTextNode('moj tekst')
test.appendChild(testText);

newBoardButton.onclick = function(){
    newBoardModal.style.display = "block";
}
