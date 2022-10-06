const addTaskButton = document.querySelector("#add-task");
const tasksContainer = document.querySelector("#tasks");
const saveTaskButton = document.querySelector("#save-task");
const editField = document.querySelector("#task-edit-field");
const taskTitleField = document.querySelector("#task-title");
const startTaskID = 0;
const createTasks = [];

const todayMessage = "To today!";
const endOfTimeMessage = "End of time!";

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
let tasksElements;

addTaskButton.addEventListener("click", addTask);
saveTaskButton.addEventListener("click", saveTask); 

showTasksList();
addEventToGeneratedButtons();

function showTasksList()
{
    //generate task list from tasks from localStorage and show it on the left panel
    tasksContainer.innerHTML = "";
    tasks = JSON.parse(window.localStorage.getItem("tasks"));
    
    tasks.forEach(task => {
        // let taskTemplate =`<div class="task task-${task.ID} flex-standard" data-taskID="${task.ID}"> <div class="task-checkbox"> <input type="checkbox" name="done" id="done-${task.ID}"> <label for="done-${task.ID}">DONE</label></div> <h4>${task.taskTitle}</h4> <p class="deadline-field">${calculateDeadline(task.deadline)}</p> <div class="task-buttons"><button class="edit-task-btn"><img src="svg/edit_icon.svg"></button> <button class="delete-task-button"><img src="svg/delete_icon.svg"></button></div> </div>`;
        let taskTemplate = `<div class="task task-${task.ID}" data-taskID="${task.ID}"> <div class="top"><h4>${task.taskTitle}</h4></div><div class="bottom flex-standard"><div class="task-checkbox"> <input type="checkbox" name="done" id="done-${task.ID}" class="done-checkbox"> <label for="done-${task.ID}" class="done-label">DONE</label></div><p class="deadline-field">${calculateDeadline(task.deadline)}</p><div class="task-buttons"><button class="edit-task-btn"><img src="svg/edit_icon.svg"></button><button class="delete-task-button"><img src="svg/delete_icon.svg"></button></div> </div></div>`;
        tasksContainer.innerHTML += taskTemplate;
    });
    
    tasksElements = document.querySelectorAll(".task");
    let deadlines = document.querySelectorAll(".deadline-field");
    
    tasks.forEach((task, index) => {
        console.log(task.isDone)
        if(task.isDone)
        {
            tasksElements[index].classList.add("task-done");
        }
    });

    deadlines.forEach(element => {
        let value = element.outerText;
        if(value === todayMessage)
        {
            element.classList.add("deadline-warning");
        }
        else if(value === endOfTimeMessage)
        {
            element.classList.add("deadline-end");
        }
    });

    console.log(deadlines)
    // deadlines.forEach("")


    //generate and show task content with title on top from tasks from localStorage
    tasksElements.forEach((task, currentID) => {
        currentTaskID = currentID;

        task.setAttribute("data-current-id", currentID);



        editField.value = "";
        taskTitleField.textContent = "";
        task.addEventListener("click", () => {
            currentTaskID = parseInt(task.getAttribute("data-current-id"));

            tasksElements.forEach(el => {
                el.classList.remove("selected");
            });
            task.classList.add("selected");

            if(tasks.length != 0)
            {
                if(tasks.length == currentID)
                {
                    currentTaskID -= 1;
                }
                editField.value = tasks[currentTaskID].taskContent;
                taskTitleField.textContent = tasks[currentTaskID].taskTitle;
            }
            else
            {
                editField.value = "";
            }
        });
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

        showTasksList();
        addEventToGeneratedButtons();
    }
    else window.alert("You must enter title");
}

function saveTask()
{
    let contentToSave = editField.value;
    let currentContent = tasks[currentTaskID];
   
    currentContent.taskContent = contentToSave;
    window.localStorage.setItem("tasks", JSON.stringify(tasks));

    editField.setAttribute("disabled", true);
    window.alert("Saved");
}

function editTask()
{
    editField.removeAttribute("disabled")
    editField.focus();
}

function addEventToGeneratedButtons()
{
    let editTaskButtons = document.querySelectorAll(".edit-task-btn");
    let deleteTaskButtons = document.querySelectorAll(".delete-task-button");
    let doneLabels = document.querySelectorAll(".done-label");
    let doneCheckboxes = document.querySelectorAll(".done-checkbox");


    editTaskButtons.forEach(button => {
        button.addEventListener("click", editTask);
    });

    deleteTaskButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            deleteTask(index);
        });
    });

    doneLabels.forEach((el, index) => {
        el.addEventListener("click", () => {
            doneChecked(index);
        });
    });
    doneCheckboxes.forEach((el, index) => {
        el.addEventListener("click", () => {
            doneChecked(index);
        });
    });
}

function deleteTask(index)
{
    //usunąc task z tasks
    //dodac nowe tasks do local storage
    //showTasksList
    tasks.splice(index, 1);
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasksList();
    addEventToGeneratedButtons();
}

function doneChecked(index)
{
    if(tasks[index].isDone)
    {
        console.log("to false")
        tasks[index].isDone = false;
    }
    if(tasks[index].isDone == false)
    {
        console.log("to true")
        tasks[index].isDone = true;
    }
    
    window.localStorage.setItem("tasks", JSON.stringify(tasks));

    console.log(tasks[index])
    console.log(tasks)
    showTasksList();
    // addEventToGeneratedButtons();
}

function calculateDeadline(deadlineDate)
{
    if(deadlineDate === "No deadline")
    {
        return "No deadline";
    }
    else
    {
        let date_1 = new Date(deadlineDate);
        let date_2 = new Date();
    
        let difference = date_1.getTime() - date_2.getTime();
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
       
        if(totalDays == 0)
        {
            return todayMessage;
        }
        else if(totalDays < 0)
        {
            return endOfTimeMessage;
        }
        else 
        {
            return totalDays + " days left";
        }
    }
}

















// dev buttons

document.querySelector("#dev-btn").addEventListener("click", () => {
    console.log(JSON.parse(window.localStorage.getItem("tasks")))
})

document.querySelector("#dev-clear-storage").addEventListener("click", () => {
    window.localStorage.clear();
    window.location.reload();
})
