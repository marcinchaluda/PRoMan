const defaultColumns = ['New', 'In Progress', 'Testing', 'Done'];
const captureInnerTextContainer = 16;

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
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </li>
            <div class="cards-container flex-row-start hide-details"}>${generateBoardDetails()}</div>
        `;
    }
    return boardList;
}

export function generateBoardDetails() {
    let cardList = '';

    for (let index in defaultColumns) {
        cardList += `
            <div class='cell'>
                <h3>${defaultColumns[index]}</h3>
                <div class="tasks flex-column">asdas</div>
            </div>
        `;
    }
    return cardList;
}

export function handleDetailButton() {
    const detailBtn = document.querySelectorAll('.fas.fa-ellipsis-h');
        console.log(detailBtn)
        detailBtn.forEach(button => {
            button.addEventListener('click', function () {
                const cardsContainer = button.parentElement.parentElement.nextElementSibling;
                cardsContainer.classList.toggle('show');
                if (cardsContainer.style.maxHeight){
                  cardsContainer.style.maxHeight = null;
                } else {
                  cardsContainer.style.maxHeight = cardsContainer.scrollHeight + captureInnerTextContainer + "px";
                }
            });
        });
}