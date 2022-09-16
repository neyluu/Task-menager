const addTaskButton = document.querySelector("#add-task");
const tasksContainer = document.querySelector("#tasks");
const saveTaskButton = document.querySelector("#save-task");
const editField = document.querySelector("#task-edit-field");
const editTaskButtons = document.querySelectorAll(".edit-task-btn");
const startTaskID = 0;
const createTasks = [];

if(window.localStorage.getItem("ID") == null) 
{
    window.localStorage.setItem("ID", JSON.stringify(startTaskID));
}
if(window.localStorage.getItem("tasks") == null)
{
    window.localStorage.setItem("tasks", JSON.stringify(createTasks));
}

let taskID = JSON.parse(window.localStorage.getItem("ID"));
let tasks = JSON.parse(window.localStorage.getItem("tasks"));
let currentTaskID;

addTaskButton.addEventListener("click", addTask);
saveTaskButton.addEventListener("click", saveTask); 
editTaskButtons.forEach(button => {
    console.log("123")
    button.addEventListener("click", editTask);
});

showTasks();

let tasksElements = document.querySelectorAll(".task");
tasksElements.forEach(task => {
    let currentID = task.getAttribute("data-taskID");
    task.addEventListener("click", () => {
        tasksElements.forEach(el => {
            el.classList.remove("selected");
        })
        task.classList.add("selected");

        currentTaskID = currentID;

        editField.value = tasks[currentTaskID].taskContent;
    });
});


function showTasks()
{
    tasksContainer.innerHTML = "";
    tasks = JSON.parse(window.localStorage.getItem("tasks"));
    
    tasks.forEach(task => {
        let taskTemplate =`<div class="task task-1 flex-standard" data-taskID="${task.ID}"> <input type="checkbox" name="done" id="done-${task.ID}"> <label for="done-${task.ID}">DONE</label> <h4>${task.taskTitle}</h4> <p></p> <button>DELETE</button> </div>`;
        tasksContainer.innerHTML += taskTemplate;
    });
    
}

function addTask()
{
    let taskTitle = document.querySelector("#add-task-title").value;
    let deadlineDate = document.querySelector("#add-task-deadline").value;   
    tasks = JSON.parse(window.localStorage.getItem("tasks"));

    document.querySelector("#add-task-title").value = "";
    document.querySelector("#add-task-deadline").value = "";
    
    if(taskTitle != "")
    {
        function task(id, title)
        {
            this.ID = id;
            this.taskTitle = title;
            this.deadline = "";
            this.taskContent = "";
            this.isDone = false;
        }
    
        let taskTmp = new task(taskID, taskTitle);
        if(deadlineDate == "")
        {
            taskTmp.deadline = "No deadline";
        }
        else taskTmp.deadline = deadlineDate;
        
        tasks.push(taskTmp);
        window.localStorage.setItem("tasks", JSON.stringify(tasks));
        
        taskID++;
        window.localStorage.setItem("ID", JSON.stringify(taskID));

        showTasks();
    }
    else window.alert("You must enter title");
}

function saveTask()
{
    let contentToSave = editField.value;
    let currentContent = tasks[currentTaskID];
   
    currentContent.taskContent = contentToSave;
    window.localStorage.setItem("tasks", JSON.stringify(tasks));

    editField.setAttribute("readonly", true);
}

function editTask()
{
    editField.removeAttribute("readonly")
}







// dev buttons

document.querySelector("#dev-btn").addEventListener("click", () => {
    console.log(JSON.parse(window.localStorage.getItem("tasks")))
})

document.querySelector("#dev-clear-storage").addEventListener("click", () => {
    window.localStorage.clear();    
})
