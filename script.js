const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskZones = document.querySelectorAll(".task-zone");

// 1. Load tasks from Local Storage on startup
document.addEventListener("DOMContentLoaded", loadTasks);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = input.value.trim();
    if (!taskText) return;

    // Generate a unique ID for the task
    const taskId = 'task-' + Date.now();
    
    // Create the DOM element
    const newTask = createTaskElement(taskId, taskText);
    
    // Append to "To Do" lane
    document.getElementById("todo-lane").appendChild(newTask);
    
    // Save to local storage and reset input
    saveTasks();
    input.value = "";
});

// 2. Function to generate a Task Element
function createTaskElement(id, text) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("draggable", "true");
    task.id = id;

    const taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.innerText = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = "&times;"; // The "X" symbol
    deleteBtn.addEventListener("click", () => {
        task.remove();
        saveTasks();
    });

    task.appendChild(taskText);
    task.appendChild(deleteBtn);

    // Drag Events
    task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging");
    });

    task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
        saveTasks(); // Save the new order/lane when dropped
    });

    return task;
}

// 3. Smart Drag and Drop Logic (inserting between tasks)
taskZones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        
        // Calculate where to drop the task
        const afterElement = getDragAfterElement(zone, e.clientY);
        const draggable = document.querySelector(".is-dragging");
        
        if (afterElement == null) {
            // Drop at the bottom if not hovering over a specific task
            zone.appendChild(draggable);
        } else {
            // Insert before the task we are hovering over
            zone.insertBefore(draggable, afterElement);
        }
    });
});

// Helper function to find the closest element based on mouse Y position
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.is-dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 4. Save and Load Data using Local Storage
function saveTasks() {
    const lanes = ['todo-lane', 'doing-lane', 'done-lane'];
    const boardData = {};

    lanes.forEach(laneId => {
        const laneElement = document.getElementById(laneId);
        const tasks = [];
        // Grab every task in this specific lane
        laneElement.querySelectorAll('.task').forEach(taskEl => {
            tasks.push({
                id: taskEl.id,
                text: taskEl.querySelector('.task-text').innerText
            });
        });
        boardData[laneId] = tasks;
    });

    localStorage.setItem('proKanbanData', JSON.stringify(boardData));
}

function loadTasks() {
    const savedData = localStorage.getItem('proKanbanData');
    
    if (savedData) {
        const boardData = JSON.parse(savedData);
        
        // Loop through each lane in our saved data
        Object.keys(boardData).forEach(laneId => {
            const laneElement = document.getElementById(laneId);
            const tasks = boardData[laneId];
            
            // Recreate and append each task
            tasks.forEach(taskData => {
                const taskElement = createTaskElement(taskData.id, taskData.text);
                laneElement.appendChild(taskElement);
            });
        });
    } else {
        // Optional: Load some dummy data if it's the user's first time
        const initialTask = createTaskElement('initial-1', 'Welcome to Pro Kanban! Try dragging me.');
        document.getElementById('todo-lane').appendChild(initialTask);
    }
}
