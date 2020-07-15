const defaultColumns = ['New', 'In Progress', 'Testing', 'Done'];

export function generateBoards(boards) {
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

export function generateBoardDetails() {
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