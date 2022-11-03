import {createAlert} from "./alerts.js";

const addTaskButton = document.querySelector("#add-task");
const tasksContainer = document.querySelector("#tasks");
const saveTaskButton = document.querySelector("#save-task");
const editField = document.querySelector("#task-edit-field");
const taskTitleField = document.querySelector("#task-title");
const editTitleButton = document.querySelector(".edit-title-btn");
const editTitleImg = document.querySelector(".edit-title-img");
const startTaskID = 0;
const createTasks = [];

const todayMessage = "To today!";
const endOfTimeMessage = "End of time!";

//add variables to local storage if there no variables(first start or after reset)
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
let selectedTaskID;
let tasksElements;
let isTaskSelected = false;
let isTaskEdited = false;
let isTitleEdited = false;

addTaskButton.addEventListener("click", addTask);
saveTaskButton.addEventListener("click", saveTask); 

showTasksList();
addEventToGeneratedButtons();

function showTasksList()
{
    //generate task list from tasks from localStorage and show it on the left panel
    tasksContainer.innerHTML = "";
    tasks = JSON.parse(window.localStorage.getItem("tasks"));
    
    tasks.forEach((task, index) => {
        let taskTemplate = `<div class="task task-${task.ID}" data-taskID="${index}"> 
                                <div class="top">
                                    <h4>${task.taskTitle}</h4>
                                </div>
                                <div class="bottom flex-standard">
                                    <div class="task-checkbox"> 
                                        <input type="checkbox" name="done" id="done-${task.ID}" class="done-checkbox"> 
                                        <label for="done-${task.ID}" class="done-label">DONE</label>
                                    </div>
                                    <p class="deadline-field">${calculateDeadline(task.deadline)}</p>
                                    <div class="task-buttons">
                                        <button class="edit-task-btn svg-button">
                                            <img src="svg/edit2_icon.svg">
                                        </button>
                                        <button class="delete-task-button svg-button">
                                            <img src="svg/delete_icon.svg">
                                            </button>
                                        </div> 
                                    </div>
                             </div>`;
        
        tasksContainer.innerHTML += taskTemplate;
    });
    
    tasksElements = document.querySelectorAll(".task");
    let deadlines = document.querySelectorAll(".deadline-field");

    //change deadline color by left time
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

    tasksElements.forEach((task, index) => {
        task.addEventListener("click", () => {
            selectTask(index);
        });
    });
}

async function selectTask(index)
{
    if(isTaskEdited)
    {
       let save = await createAlert("confirm_save");
       if(save)
       {
        saveTask();
       }
       else
       {
        editField.setAttribute("disabled", true);
        isTaskEdited = false;
       }
    }

    if(isTitleEdited) saveTitle();

    isTaskSelected = true;
    selectedTaskID = index;

    tasksElements.forEach(task => {
        task.classList.remove("selected");
    });
    tasksElements[selectedTaskID].classList.add("selected");

    console.log(`Selected task: ${selectedTaskID}`);

    showTaskContent(selectedTaskID);
}

function showTaskContent(selectedTaskID)
{
    taskTitleField.value = "";
    editField.value = "";

    tasks = JSON.parse(window.localStorage.getItem("tasks"));

    if(isTaskSelected)
    {
        taskTitleField.value = tasks[selectedTaskID].taskTitle;
        editField.value = tasks[selectedTaskID].taskContent;
    }
}

function addTask()
{
    //get values from form
    let taskTitle = document.querySelector("#add-task-title").value;
    let deadlineDate = document.querySelector("#add-task-deadline").value;   
    tasks = JSON.parse(window.localStorage.getItem("tasks"));

    //clear form after get data
    document.querySelector("#add-task-title").value = "";
    document.querySelector("#add-task-deadline").value = "";
    
    if(taskTitle != "")
    {
        function Task(id, title)
        {
            this.ID = id;
            this.taskTitle = title;
            this.deadline = "";
            this.taskContent = "";
            this.isDone = false;
        }
        //create task object with data from form
        let taskTmp = new Task(taskID, taskTitle);
        
        //set deadline
        if(deadlineDate == "")
        {
            taskTmp.deadline = "No deadline";
        }
        else taskTmp.deadline = deadlineDate;
        
        //store all in local storage
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
    isTaskEdited = false;

    let contentToSave = editField.value;
    let currentContent = tasks[selectedTaskID];
   
    currentContent.taskContent = contentToSave;
    window.localStorage.setItem("tasks", JSON.stringify(tasks));

    editField.setAttribute("disabled", true);
    
    createAlert("info_content_saved");
}

function saveTitle()
{
    isTitleEdited = false;

    let newTitle = taskTitleField.value;

    tasks[selectedTaskID].taskTitle = newTitle;
    window.localStorage.setItem("tasks", JSON.stringify(tasks));

    taskTitleField.setAttribute("disabled", true);
    
    createAlert("info_title_saved");

    editTitleImg.setAttribute("src", "svg/edit1_icon.svg");

    
    showTasksList();
    selectTask(selectedTaskID);
    addEventToGeneratedButtons();
    
    editTitleButton.removeEventListener("click", saveTitle);
    editTitleButton.addEventListener("click", editTitle);
}

function editTask(e, index)
{
    e.stopPropagation();

    selectTask(index);
    
    editField.removeAttribute("disabled");
    editField.focus();
    
    isTaskEdited = true;
}

function editTitle()
{
    taskTitleField.removeAttribute("disabled");
    taskTitleField.focus();

    editTitleImg.setAttribute("src", "svg/checkmark_icon.svg")
    
    isTitleEdited = true;
    
    editTitleButton.removeEventListener("click", editTitle);
    editTitleButton.addEventListener("click", saveTitle);
}

function addEventToGeneratedButtons()
{
    let editTaskButtons = document.querySelectorAll(".edit-task-btn");
    let deleteTaskButtons = document.querySelectorAll(".delete-task-button");

    editTaskButtons.forEach((button, index) => {
        button.addEventListener("click", (e) => { 
            console.log(index)
            editTask(e, index);
        })
    })

    deleteTaskButtons.forEach((button, index) => {
        button.addEventListener("click", (e) => {
            deleteTask(e, index);
        });
    });

    editTitleButton.addEventListener("click", editTitle);
}

async function deleteTask(e, index)
{
    e.stopPropagation();

    //show alert, if true delete task, if false return
    if(await createAlert("confirm_delete"))
    {
        tasks.splice(index, 1);
        window.localStorage.setItem("tasks", JSON.stringify(tasks));
        
        isTaskSelected = false;
        
        showTasksList();
        addEventToGeneratedButtons();
    }
    else return
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
