// Select all initial tasks and drop zones
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const todoLane = document.getElementById("todo-lane");
const taskZones = document.querySelectorAll(".task-zone");

// Function to add drag events to a task element
function attachDragEvents(task) {
    task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging");
    });

    task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
    });
}

// Attach events to tasks currently in the DOM on page load
const existingTasks = document.querySelectorAll(".task");
existingTasks.forEach(attachDragEvents);

// Handle adding a new task
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload
    const taskText = input.value.trim();

    if (!taskText) return; // Don't add empty tasks

    // Create the new task element
    const newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerText = taskText;

    // Attach drag events to the new task
    attachDragEvents(newTask);

    // Append it to the To Do lane and clear the input
    todoLane.appendChild(newTask);
    input.value = "";
});

// Setup the drop zones (the lanes)
taskZones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault(); // Necessary to allow dropping
        
        // Find the element currently being dragged
        const currentTask = document.querySelector(".is-dragging");
        
        // Append it to the zone the mouse is currently hovering over
        if (currentTask) {
            zone.appendChild(currentTask);
        }
    });
});
