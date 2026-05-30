/* =========================
   ELEMENTS
========================= */

const navItems =
document.querySelectorAll(".nav-item");

const pages =
document.querySelectorAll(".page");

const pageTitle =
document.getElementById("pageTitle");

const themeBtn =
document.getElementById("themeBtn");

const taskInput =
document.getElementById("taskInput");

const taskDate =
document.getElementById("taskDate");

const priority =
document.getElementById("priority");

const addTaskBtn =
document.getElementById("addTaskBtn");

const searchInput =
document.getElementById("searchInput");

const taskList =
document.getElementById("taskList");

const completedList =
document.getElementById("completedList");

const totalTasks =
document.getElementById("totalTasks");

const completedTasks =
document.getElementById("completedTasks");

const pendingTasks =
document.getElementById("pendingTasks");

const progressBar =
document.getElementById("progressBar");

const progressText =
document.getElementById("progressText");

const clearAllBtn =
document.getElementById("clearAllBtn");

const toast =
document.getElementById("toast");

const emptyState =
document.getElementById("emptyState");

const liveClock =
document.getElementById("liveClock");

/* =========================
   STORAGE
========================= */

let tasks =
JSON.parse(localStorage.getItem("tasks"))
|| [];

/* =========================
   NAVIGATION
========================= */

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav =>
            nav.classList.remove("active")
        );

        item.classList.add("active");

        pages.forEach(page =>
            page.classList.remove("active-page")
        );

        const selectedPage =
        item.dataset.page;

        document.getElementById(selectedPage)
        .classList.add("active-page");

        pageTitle.textContent =
        item.textContent.trim();

    });

});

/* =========================
   ADD TASK
========================= */

addTaskBtn.addEventListener("click", () => {

    const text =
    taskInput.value.trim();

    if(text === ""){

        showToast("Enter a task");

        return;

    }

    const task = {

        id:Date.now(),

        text:text,

        date:taskDate.value,

        priority:priority.value,

        completed:false

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskDate.value = "";

    showToast("Task Added");

});

/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    renderTasks
);

/* =========================
   RENDER
========================= */

renderTasks();

function renderTasks(){

    taskList.innerHTML = "";

    completedList.innerHTML = "";

    const searchText =
    searchInput.value.toLowerCase();

    const filteredTasks =
    tasks.filter(task =>
        task.text.toLowerCase()
        .includes(searchText)
    );

    filteredTasks.forEach(task => {

        const li =
        document.createElement("li");

        li.classList.add("task");

        li.innerHTML = `
        
        <div class="task-info
        ${task.completed ? 'completed' : ''}">

            <h3>${task.text}</h3>

            <p>
                ${task.date || "No Due Date"}
            </p>

            <span class="
            priority
            ${task.priority.toLowerCase()}">

                ${task.priority}

            </span>

        </div>

        <div class="actions">

            <button
            class="complete-btn"
            onclick="toggleTask(${task.id})">

            ${task.completed ? 'Undo' : 'Done'}

            </button>

            <button
            class="edit-btn"
            onclick="editTask(${task.id})">

            Edit

            </button>

            <button
            class="delete-btn"
            onclick="deleteTask(${task.id})">

            Delete

            </button>

        </div>
        
        `;

        if(task.completed){

            completedList.appendChild(li);

        }else{

            taskList.appendChild(li);

        }

    });

    updateDashboard();

    toggleEmptyState();

}

/* =========================
   COMPLETE TASK
========================= */

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.completed =
            !task.completed;

        }

        return task;

    });

    saveTasks();

    renderTasks();

    showToast("Task Updated");

}

/* =========================
   EDIT TASK
========================= */

function editTask(id){

    const task =
    tasks.find(task =>
        task.id === id
    );

    const updatedTask =
    prompt(
        "Edit Task",
        task.text
    );

    if(updatedTask !== null){

        task.text = updatedTask;

        saveTasks();

        renderTasks();

        showToast("Task Edited");

    }

}

/* =========================
   DELETE TASK
========================= */

function deleteTask(id){

    tasks = tasks.filter(task =>
        task.id !== id
    );

    saveTasks();

    renderTasks();

    showToast("Task Deleted");

}

/* =========================
   DASHBOARD
========================= */

function updateDashboard(){

    const total =
    tasks.length;

    const completed =
    tasks.filter(task =>
        task.completed
    ).length;

    const pending =
    total - completed;

    totalTasks.textContent =
    total;

    completedTasks.textContent =
    completed;

    pendingTasks.textContent =
    pending;

    const progress =
    total === 0
    ? 0
    : (completed / total) * 100;

    progressBar.style.width =
    progress + "%";

    progressText.textContent =
    Math.round(progress) + "%";

}

/* =========================
   EMPTY STATE
========================= */

function toggleEmptyState(){

    if(tasks.length === 0){

        emptyState.style.display =
        "block";

    }else{

        emptyState.style.display =
        "none";

    }

}

/* =========================
   LOCAL STORAGE
========================= */

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

/* =========================
   DARK MODE
========================= */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        themeBtn.innerHTML = "☀";

    }else{

        themeBtn.innerHTML = "🌙";

    }

});

/* =========================
   CLEAR ALL
========================= */

clearAllBtn.addEventListener("click", () => {

    const confirmDelete =
    confirm(
        "Delete all tasks?"
    );

    if(confirmDelete){

        tasks = [];

        saveTasks();

        renderTasks();

        showToast("All Tasks Deleted");

    }

});

/* =========================
   TOAST
========================= */

function showToast(message){

    toast.textContent =
    message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2000);

}

/* =========================
   LIVE CLOCK
========================= */

setInterval(() => {

    const now =
    new Date();

    liveClock.textContent =
    now.toLocaleString();

},1000);