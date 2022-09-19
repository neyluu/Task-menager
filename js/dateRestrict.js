const dateInput = document.querySelector("#add-task-deadline");

let date = new Date();

let month = date.getMonth() + 1;
let day = date.getDate();
let year = date.getFullYear();

if(month < 10) month = "0" + month;
if(day < 10) day = "0" + day;

let minDate = year + "-" + month + "-" + day;

dateInput.setAttribute("value", minDate);
dateInput.setAttribute("min", minDate);