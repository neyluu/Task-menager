// window.localStorage.clear();

const addTaskButton = document.querySelector("#add-task");
const tasksContainer = document.querySelector("#tasks");
const startTaskID = 0;

if(window.localStorage.getItem("ID") == null) 
{
    window.localStorage.setItem("ID", JSON.stringify(startTaskID));
}

let taskID = JSON.parse(window.localStorage.getItem("ID"));

addTaskButton.addEventListener("click", addTask);

function addTask()
{
    let taskTitle = document.querySelector("#add-task-title").value;
    let deadlineDate = document.querySelector("#add-task-deadline").value;   

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
        
        let taskTmpName = "task" + taskID;  
        let taskTemplate =`<div class="task task-1 flex-standard" data-taskID="${taskID}"> <input type="checkbox" name="done" id="done"> <label for="done">DONE</label> <h4>${taskTitle}</h4> <p></p> <button>EDIT</button> <button>DELETE</button> </div>`;
    
        window.localStorage.setItem(taskTmpName, JSON.stringify(taskTmp));
        console.log(window.localStorage)
        
        tasksContainer.innerHTML += taskTemplate;
        taskID++;
        window.localStorage.setItem("ID", JSON.stringify(taskID));
    }
    else window.alert("You must enter title");
   
 
    //writeTasks()
    //funkcja ktora będzie pokazywac taski po wczytaniu ich z local storage
    //ID DO LOCAL STORAGE

    // zapisac do obiektu json wszystki potrzebne dane > zrobic html element wklejąc zmienne do templatu > zrobic go na stronie
}