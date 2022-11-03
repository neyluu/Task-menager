export async function createAlert(type)
{
    //possible types
    //"info_content_saved"  = info alert with information that content was saved
    //"info_title_saved"    = info alert with information that title was saved
    //"confirm_save   "     = confirm alert asked you want save task
    //"confirm_delete"      = confirm alert asked you want delete task
    
    const blockSite = document.querySelector(".alert-block-site");
    const contentToBlur = document.querySelector("#whole-content");

    let confirmYesButton, confirmNoButton, infoOkButton;
    let message, mode;

    switch (type) {
        case "info_content_saved":
            contentWasSavedInfo();
            break;
        case "info_title_saved":
            titleWasSavedInfo();
            break;
        case "confirm_save":
            return await confirmSave();
        case "confirm_delete":
            return await confirmDelete();
        default:
            break;
    }

    function contentWasSavedInfo()
    {
        message = "Task content was saved succesfully!";
        mode = "info";

        showAlert(message, mode);

        infoOkButton.addEventListener("click", closeAlert);
    }
    function titleWasSavedInfo()
    {
        message = "Task title was saved succesfully!";
        mode = "info";

        showAlert(message, mode);

        infoOkButton.addEventListener("click", closeAlert);
    }
    function confirmSave()
    {
        message = "Do you want save?";
        mode = "confirm";

        showAlert(message, mode);

        return new Promise(resolve => {
            confirmYesButton.addEventListener("click", () => {
                closeAlert();
                resolve(true);
            });
            confirmNoButton.addEventListener("click", () => {
                closeAlert();
                resolve(false);
            });
        });
    }
    function confirmDelete()
    {
        message = "Do you want delete this?";
        mode = "confirm";

        showAlert(message, mode);

        return new Promise(resolve => {
            confirmYesButton.addEventListener("click", () => {
                closeAlert();
                resolve(true);
            });
            confirmNoButton.addEventListener("click", () => {
                closeAlert();
                resolve(false);
            });
        });
    }

    function showAlert(message, mode)
    {
        //modes = confirm, info

        const alertMessage = document.querySelector(".alert-message");
        const infoButtons = document.querySelector(".info-btns");
        const confirmButtons = document.querySelector(".confirm-btns");

        if(mode == "confirm")
        {
            infoButtons.classList.remove("btns-visible");
            confirmButtons.classList.add("btns-visible");

            confirmYesButton = document.querySelector(".alert-yes-btn");
            confirmNoButton = document.querySelector(".alert-no-btn");
        }
        if(mode == "info")
        {
            confirmButtons.classList.remove("btns-visible");
            infoButtons.classList.add("btns-visible");

            infoOkButton = document.querySelector(".alert-ok-btn");
        }
        
        alertMessage.textContent = message;
        blockSite.style.display = "block";
        contentToBlur.classList.add("blur")
    }
    function closeAlert()
    {
        blockSite.style.display = "none";
        contentToBlur.classList.remove("blur")
    }
}