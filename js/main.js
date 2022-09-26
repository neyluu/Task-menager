const addTaskButton = document.querySelector("#add-task");
const tasksContainer = document.querySelector("#tasks");
const saveTaskButton = document.querySelector("#save-task");
const editField = document.querySelector("#task-edit-field");
const taskTitleField = document.querySelector("#task-title");
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
    console.log("3", tasks, tasks.length)

    tasks.forEach(task => {
        let taskTemplate =`<div class="task task-${task.ID} flex-standard" data-taskID="${task.ID}"> <input type="checkbox" name="done" id="done-${task.ID}"> <label for="done-${task.ID}">DONE</label> <h4>${task.taskTitle}</h4> <p></p> <button class="edit-task-btn">EDIT</button> <button class="delete-task-button">DELETE</button> </div>`;
        tasksContainer.innerHTML += taskTemplate;
    });
    
    tasksElements = document.querySelectorAll(".task");
    //generate and show task content with title on top from tasks from localStorage
    
    tasksElements.forEach((task, currentID) => {
        currentTaskID = currentID;
        console.log("4", currentID)

        task.setAttribute("data-current-id", currentID);
        console.log("5", task)


        editField.value = "";
        taskTitleField.textContent = "";
        task.addEventListener("click", () => {
            console.log("6", task)

            currentTaskID = parseInt(task.getAttribute("data-current-id"));
            console.log("8", currentID)
            console.log("9", tasks)
            tasksElements.forEach(el => {
                el.classList.remove("selected");
            });
            task.classList.add("selected");
            console.log(deleted)
            if(tasks.length != 0)
            {
                if(tasks.length == currentID)
                {
                    currentTaskID -= 1;
                    console.log("10")
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

    editField.setAttribute("readonly", true);
    window.alert("Saved");
}

function editTask()
{
    editField.removeAttribute("readonly")
}

function addEventToGeneratedButtons()
{
    let editTaskButtons = document.querySelectorAll(".edit-task-btn");
    let deleteTaskButtons = document.querySelectorAll(".delete-task-button");

    editTaskButtons.forEach(button => {
        button.addEventListener("click", editTask);
    });

    deleteTaskButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            deleteTask(index);
        });
    });
}

function deleteTask(index)
{
    //usunąc task z tasks
    //dodac nowe tasks do local storage
    //showTasksList
    console.log("1", tasks, tasks.length)
    tasks.splice(index, 1);
    console.log("2", tasks, tasks.length)
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasksList();
    addEventToGeneratedButtons();
}





// dev buttons

document.querySelector("#dev-btn").addEventListener("click", () => {
    console.log(JSON.parse(window.localStorage.getItem("tasks")))
})

document.querySelector("#dev-clear-storage").addEventListener("click", () => {
    window.localStorage.clear();
    window.location.reload();
})
