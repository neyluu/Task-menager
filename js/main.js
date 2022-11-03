import {createAlert} from "./alerts.js";

const addTaskButton = document.querySelector("#add-task");
const tasksContainer = document.querySelector("#tasks");
const saveTaskButton = document.querySelector("#save-task");
const editField = document.querySelector("#task-edit-field");
const taskTitleField = document.querySelector("#task-title");
const editTitleButton = document.querySelector(".edit-title-btn");
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
let currentTaskID;
let tasksElements;
let isTaskSelected = false;

addTaskButton.addEventListener("click", addTask);
saveTaskButton.addEventListener("click", saveTask); 

showTasksList();
addEventToGeneratedButtons();

function showTasksList(forcedID)
{
    //generate task list from tasks from localStorage and show it on the left panel
    tasksContainer.innerHTML = "";
    tasks = JSON.parse(window.localStorage.getItem("tasks"));
    
    tasks.forEach(task => {
        let taskTemplate = `<div class="task task-${task.ID}" data-taskID="${task.ID}"> 
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
    
    //beta DONE checkbox
    // tasks.forEach((task, index) => {
    //     console.log(task.isDone)
    //     if(task.isDone)
    //     {
    //         tasksElements[index].classList.add("task-done");
    //     }
    // });

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

    //generate and show task content with title on top from tasks from localStorage
    tasksElements.forEach((task, currentID) => {
        currentTaskID = currentID;
        task.setAttribute("data-current-id", currentID);

        editField.value = "";
        taskTitleField.value = "";

        task.addEventListener("click", () => {
            isTaskSelected = true;
            console.log("clicked")
            generateContent();
        });

        generateContent();

        function generateContent()
        {
            if(isTaskSelected)
            {
                if(forcedID != undefined) 
                {
                    currentTaskID = forcedID;
                    console.log("forced1")
                }
                else 
                {
                    currentTaskID = parseInt(task.getAttribute("data-current-id"));
                }
                
                //outline on selected task
                tasksElements.forEach(el => {
                    el.classList.remove("selected");
                });
                if(forcedID != undefined)
                {
                    tasksElements[currentTaskID].classList.add("selected");
                    console.log("forced2")
                    forcedID = null;
                }
                else
                {
                    task.classList.add("selected");
                }
    
                if(tasks.length != 0)
                {
                    //to work deleteTask() properly
                    if(tasks.length == currentID)
                    {
                        currentTaskID -= 1;
                    }
                    //write content and title
                    editField.value = tasks[currentTaskID].taskContent;
                    taskTitleField.value = tasks[currentTaskID].taskTitle;
                }
                else
                {
                    editField.value = "";
                }
            }
        }
    });
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
        function task(id, title)
        {
            this.ID = id;
            this.taskTitle = title;
            this.deadline = "";
            this.taskContent = "";
            this.isDone = false;
        }
        //create task object with data from form
        let taskTmp = new task(taskID, taskTitle);
        
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
    let contentToSave = editField.value;
    let currentContent = tasks[currentTaskID];
   
    currentContent.taskContent = contentToSave;
    window.localStorage.setItem("tasks", JSON.stringify(tasks));

    editField.setAttribute("disabled", true);
    
    createAlert("info_task_saved");
}

function saveTitle()
{
    let newTitle = taskTitleField.value;

    tasks[currentTaskID].taskTitle = newTitle;
    window.localStorage.setItem("tasks", JSON.stringify(tasks));

    taskTitleField.setAttribute("disabled", true);
    
    createAlert("info_title_saved");

    let editTitleImg = document.querySelector(".edit-title-img");
    editTitleImg.setAttribute("src", "svg/edit1_icon.svg");

    editTitleButton.addEventListener("click", editTitle);

    showTasksList();
    addEventToGeneratedButtons();
}

function editTask(e, index)
{
    e.stopPropagation();
    isTaskSelected = true;
    currentTaskID = index;
    console.log(currentTaskID)

    showTasksList(currentTaskID);
    addEventToGeneratedButtons();

    editField.removeAttribute("disabled");
    editField.focus();
}

function editTitle()
{
    taskTitleField.removeAttribute("disabled");
    taskTitleField.focus();

    let editTitleImg = document.querySelector(".edit-title-img");
    editTitleImg.setAttribute("src", "svg/checkmark_icon.svg")
    
    editTitleButton.addEventListener("click", saveTitle);
}

function addEventToGeneratedButtons()
{
    let editTaskButtons = document.querySelectorAll(".edit-task-btn");
    let deleteTaskButtons = document.querySelectorAll(".delete-task-button");
    // let doneLabels = document.querySelectorAll(".done-label");
    // let doneCheckboxes = document.querySelectorAll(".done-checkbox");

    // editTaskButtons.forEach(button => {
    //     button.addEventListener("click", editTask);
    // });

    //test
    editTaskButtons.forEach((button, index) => {
        button.addEventListener("click", (e) => { 
            editTask(e, index);
        })
    })

    deleteTaskButtons.forEach((button, index) => {
        button.addEventListener("click", (e) => {
            deleteTask(e, index);
        });
    });

    editTitleButton.addEventListener("click", editTitle);

    //beta DONE checked
    // doneLabels.forEach((el, index) => {
    //     el.addEventListener("click", () => {
    //         doneChecked(index);
    //     });
    // });
    // doneCheckboxes.forEach((el, index) => {
    //     el.addEventListener("click", () => {
    //         doneChecked(index);
    //     });
    //});
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

//beta DONE checkbox
// function doneChecked(index)
// {
//     if(tasks[index].isDone)
//     {
//         console.log("to false")
//         tasks[index].isDone = false;
//     }
//     if(tasks[index].isDone == false)
//     {
//         console.log("to true")
//         tasks[index].isDone = true;
//     }
    
//     window.localStorage.setItem("tasks", JSON.stringify(tasks));

//     console.log(tasks[index])
//     console.log(tasks)
//     showTasksList();
//     // addEventToGeneratedButtons();
// }

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
