export let dragAndDropHandler = {
    init: function () {
        initDragAndDrop();
    }
}

function initDragAndDrop() {
    const tasks = document.querySelectorAll(".show .tasks");
    const columns = document.querySelectorAll(".show .cell");
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
    markColumns();
    this.classList.add("dragged-task-source", "dragged-task");
    const transferredData = event.dataTransfer;
    transferredData.setData("type/dragged-task", "dragged-task");
    transferredData.setData("text/plain", this.textContent);
    deferredOriginChanges(this, "dragged-task");

}

function dragHandler() {
    //could hide origin image here
}

function dragEndHandler() {
    markColumns(false);
    this.classList.remove("dragged-task-source");
}

function columnEnterHandler(event) {
    if (event.dataTransfer.types.includes("type/dragged-task")) {
        event.preventDefault();
        this.classList.add("over-column");
    }
}

function columnOverHandler(event) {
    if (event.dataTransfer.types.includes("type/dragged-task")) {
        event.preventDefault();
    }
}

function columnLeaveHandler(event) {
    if (event.dataTransfer.types.includes("type/dragged-task")
        && event.relatedTarget !== null
        && event.currentTarget !== event.relatedTarget.closest(".show .cell")) {
        this.classList.remove("over-column");
    }
}

function columnDropHandler(event) {
    event.preventDefault();
    const aboveDestinationTask = getDraggedTaskAboveDestinationTask(this, event.clientY);
    const draggedTaskSource = document.querySelector(".dragged-task-source");
    if (aboveDestinationTask == null) {
        event.currentTarget.appendChild(draggedTaskSource);
    } else {
        event.currentTarget.insertBefore(draggedTaskSource, aboveDestinationTask);
    }
}

function deferredOriginChanges(origin, draggedTaskClassName) {
    setTimeout(() => {
        origin.classList.remove(draggedTaskClassName);
    });
}

function markColumns(marked = true) {
    const columns = document.querySelectorAll(".show .cell");
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
    const tasks = Array.from(column.querySelectorAll(".show .tasks:not(.dragged-task-source)"));
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
