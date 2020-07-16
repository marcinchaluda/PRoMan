import { dataHandler } from "./data_handler.js";

export let dragAndDropHandler = {
    init: function () {
        initDragAndDrop();
    }
}

const tasksSelector = ".task";
const columnsSelector = ".tasks";

function initDragAndDrop() {
    const tasks = document.querySelectorAll(tasksSelector);
    const columns = document.querySelectorAll(columnsSelector);
    initTasks(tasks);
    initColumns(columns);
}

function initTasks(tasks) {
    for (const task of tasks) {
        initTask(task);
    }
}

function initTask(task) {
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", dragStartHandler);
    task.addEventListener("drag", dragHandler);
    task.addEventListener("dragend", dragEndHandler)
}

function initColumns(columns) {
    for (const column of columns) {
        initColumn(column);
    }
}

function initColumn(column) {
    column.addEventListener("dragenter", columnEnterHandler);
    column.addEventListener("dragover", columnOverHandler);
    column.addEventListener("dragleave", columnLeaveHandler);
    column.addEventListener("drop", columnDropHandler);
}


function dragStartHandler(event) {
    this.classList.add("dragged-task-source", "dragged-task");
    const transferredData = event.dataTransfer;
    const draggedTaskBoardId = this.parentElement.getAttribute("cardid");
    markColumns(draggedTaskBoardId);
    transferredData.setData(`type/boardid/${draggedTaskBoardId}`, draggedTaskBoardId);
    transferredData.setData("boardId", draggedTaskBoardId);
    transferredData.setData("text/plain", this.textContent);
    deferredOriginChanges(this, "dragged-task");

}

function dragHandler() {
    //could hide origin image here
}

function dragEndHandler() {
    const draggedTaskBoardId = this.parentElement.getAttribute("cardid");
    markColumns(draggedTaskBoardId, false);
    this.classList.remove("dragged-task-source");
}

function columnEnterHandler(event) {
    const destinationColumnBoardId = this.getAttribute("cardid");
    if (event.dataTransfer.types.includes(`type/boardid/${destinationColumnBoardId}`)) {
        event.preventDefault();
        this.classList.add("over-column");
    }
}

function columnOverHandler(event) {
    const destinationColumnBoardId = this.getAttribute("cardid");
    if (event.dataTransfer.types.includes(`type/boardid/${destinationColumnBoardId}`)) {
        event.preventDefault();
    }
}

function columnLeaveHandler(event) {
    const destinationColumnBoardId = this.getAttribute("cardid");
    if (event.dataTransfer.types.includes(`type/boardid/${destinationColumnBoardId}`)
        && event.relatedTarget !== null
        && event.currentTarget !== event.relatedTarget.closest(columnsSelector)) {
        this.classList.remove("over-column");
    }
}

function columnDropHandler(event) {
    event.preventDefault();
    const destinationColumnBoardId = this.getAttribute("cardid");
    if (event.dataTransfer.getData("boardId") === destinationColumnBoardId) {
        let changedInDropTaskIds, changedInDragTaskIds, taskPosition, changedTaskIds, changedTaskIdsUnique;
        const changedTasks = {};
        const aboveDestinationTask = getDraggedTaskAboveDestinationTask(this, event.clientY);
        const draggedTaskSource = document.querySelector(".dragged-task-source");
        const statusIdBeforeDrag = parseInt(draggedTaskSource.parentElement.parentElement.getAttribute("status-id"));
        const orderNumberBeforeDrag = parseInt(draggedTaskSource.getAttribute("order-number"));
        if (aboveDestinationTask == null) {
            event.currentTarget.appendChild(draggedTaskSource);
        } else {
            event.currentTarget.insertBefore(draggedTaskSource, aboveDestinationTask);
        }
        changedInDragTaskIds = getChangedInDragTaskIds(statusIdBeforeDrag, orderNumberBeforeDrag, destinationColumnBoardId);
        [taskPosition, changedInDropTaskIds] = getNewTaskPosition(draggedTaskSource, this, aboveDestinationTask);
        changedTaskIds = changedInDragTaskIds.concat(changedInDropTaskIds);
        changedTaskIdsUnique = changedTaskIds.filter((item, pos) => changedTaskIds.indexOf(item) === pos);
        dataHandler.updateCardPosition(taskPosition, function (response) {
            console.log(response);
        });
        if (Array.isArray(changedTaskIdsUnique) && changedTaskIdsUnique.length) {
            changedTaskIdsUnique.forEach(taskId => {
                changedTasks[parseInt(taskId)] = parseInt(document.querySelector(`[task-id='${taskId}']`).getAttribute("order-number"));
            });
            dataHandler.updateCardsOrderNumbers(changedTasks, function (response) {
            console.log(response);
        });
        }

    }
}

function deferredOriginChanges(origin, draggedTaskClassName) {
    setTimeout(() => {
        origin.classList.remove(draggedTaskClassName);
    });
}

function markColumns(boardId, marked = true) {
    const columns = document.querySelectorAll(`[cardid='${boardId}']` + columnsSelector);
    for (let column of columns) {
        if (marked) {
            column.classList.add("active-column");
        } else {
            column.classList.remove("active-column");
            column.classList.remove("over-column");
        }
    }
}

function getDraggedTaskAboveDestinationTask(column, y) {
    const tasks = Array.from(column.querySelectorAll(tasksSelector + ":not(.dragged-task-source)"));
    // console.log(tasks)
    return tasks.reduce((closest, child) => {
        const taskDiv = child.getBoundingClientRect();
        const offset = y - taskDiv.top - taskDiv.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, task: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).task;
}


function getNewTaskPosition(task, column, aboveDestinationTask) {
    let taskId, taskStatusId, taskOrderNumber, changedTaskIds;
    taskId = task.getAttribute("task-id");
    taskStatusId = column.parentElement.getAttribute("status-id");
    [taskOrderNumber, changedTaskIds] = getTaskOrderNumber(aboveDestinationTask, column);
    setOrderNumberAttribute(task, taskOrderNumber.toString());
    return [{id: parseInt(taskId), statusId: parseInt(taskStatusId), orderNumber: taskOrderNumber}, changedTaskIds];
}


function getTaskOrderNumber(aboveDestinationTask, column) {
    let taskOrderNumber;
    let changedTaskIds = [];
    if (aboveDestinationTask == null) {
        taskOrderNumber = column.childElementCount - 1;
        // changedTaskIds = [];
    } else if (parseInt(aboveDestinationTask.getAttribute("order-number")) === 0) {
        taskOrderNumber = 0;
        changedTaskIds = prepareOtherTasks(column, 1);
    } else {
        taskOrderNumber = parseInt(aboveDestinationTask.getAttribute("order-number")) - 1;
        changedTaskIds = prepareOtherTasks(column, 1, taskOrderNumber);
    }
    return [taskOrderNumber, changedTaskIds];
}

function setOrderNumberAttribute(task, orderNumber) {
    task.setAttribute("order-number", orderNumber);
}


function prepareOtherTasks(column, offset, taskOrderNumber = 0, reduce = 0) {
    let changedChildIds = [];
    Array.from(column.children).slice(taskOrderNumber + offset).forEach(child => {
        changedChildIds.push(parseInt(child.getAttribute("task-id")));
        let childOrderNumber = parseInt(child.getAttribute("order-number"));
        setOrderNumberAttribute(child, (childOrderNumber + offset - reduce).toString());
    });
    return changedChildIds;
}


function getChangedInDragTaskIds(statusIdBeforeDrag, orderNumberBeforeDrag, destinationColumnBoardId) {
    let changedInDragTaskIds;
    const sourceDragColumn = document.querySelector(`[containerboardid='${destinationColumnBoardId}'] [status-id='${statusIdBeforeDrag}']`);
    changedInDragTaskIds = prepareOtherTasks(sourceDragColumn, 0, orderNumberBeforeDrag, 1);
    return changedInDragTaskIds;
}
