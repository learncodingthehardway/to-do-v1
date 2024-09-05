//Getting the key elements from the HTML

//Elements related to task dialog
const openTaskDialog = document.getElementById("open-task-dialog-button")
const closeTaskDialog = document.getElementById("close-dialog-button")
const taskDialog = document.getElementById("task-dialog")
const toDoListForm = document.getElementById("task-form")

//Elements related to the projects dialog
const openProjectsDialog = document.getElementById("open-projects-dialog-button")
const closeProjectsDialog = document.getElementById("close-projects-dialog-button")
const projectsDialog = document.getElementById("projects-dialog")

//Elements related to project list
const projectsForm = document.getElementById("projects-form")
const projectInput = document.getElementById("project-input")
const projectListContainer = document.querySelector(".projects-list")
const projectDeleteButton = document.querySelector("#project")

//Elements related to the to-do list
const toDoListInput = document.getElementById("new-task-input")
const toDoListContainer = document.getElementById("task-list-container")
const deleteTaskButton = document.getElementById("delete-task-button")
const projectSelect = document.getElementById("project-select")
const allTasks = document.getElementById("all-tasks")

//Elements related to the to-do list container
const toDoListHeading = document.getElementById("to-do-list-title")
const taskCount = document.getElementById("task-count")

//Saving local storage keys for key variables
const LOCAL_STORAGE_PROJECT_LIST_KEY = "project.list"
const LOCAL_STORAGE_PROJECT_ID_KEY = "project.id"
const LOCAL_STORAGE_TASK_LIST_KEY = "task.list"
const LOCAL_STORAGE_TASK_ID_KEY = "task.id"

//Editing a task elements
const editTaskButton = document.querySelector(".edit-task-button")
const editTaskDialog = document.getElementById("edit-task-dialog")
const editTaskInput = document.getElementById("edit-task-input")
const closeEditTaskDialog = document.getElementById("close-edit-dialog-button")
const editTaskForm = document.getElementById("edit-task-form")

//Getting project list from local storage
projectList = JSON.parse(localStorage.getItem("project.list")) || []

//Getting the project ID from local storage
projectId = localStorage.getItem(LOCAL_STORAGE_PROJECT_ID_KEY)

//Getting the task list from local storage
taskList = JSON.parse(localStorage.getItem("task.list")) || []

//Getting the task ID from local storage
taskId = localStorage.getItem(LOCAL_STORAGE_TASK_ID_KEY)

//TASKS LOGIC

//Saving a new task list to local storage
function saveTaskList() {
    localStorage.setItem(LOCAL_STORAGE_TASK_LIST_KEY, JSON.stringify(taskList))
}

//Saving a new task ID to local storage
function saveTaskId() {
    localStorage.setItem(LOCAL_STORAGE_TASK_ID_KEY, taskId)
}

//Saving a new task to the taskList
toDoListForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const taskName = toDoListInput.value
    if (taskName == null || taskName === "") return
    const task = createTask(taskName)
    taskList.push(task)
    saveTaskList()
    saveTaskId()
    console.log("Task added:", task) // Debugging line
    toDoListInput.value = ""
    taskDialog.close()
    renderTasks(getFilteredTasks())
    renderTaskCount()
})

function createTask(taskName) {
    return {name: taskName, id: Date.now().toString(), isDone: false, projectId: projectId}
}

function getFilteredTasks() {
    return taskList.filter(task => task.projectId === projectId)
}

//Rendering the tasks that are part of taskList
function renderTasks(tasks) {

    toDoListContainer.innerHTML = ""

    tasks.forEach(task => {
        const newTaskContainer = document.createElement("div")
        newTaskContainer.classList.add("task-container")
        
        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.classList.add("task-checkbox")
        checkbox.checked = task.isDone
        checkbox.dataset.taskId = task.id
        
        const checkboxBox = document.createElement("div")
        checkboxBox.classList.add("checkbox-box")
        checkboxBox.addEventListener("click", () => {
            checkbox.checked = !checkbox.checked
                task.isDone = checkbox.checked
                if (checkbox.checked) {
                    checkboxBox.classList.add("checkbox-box-checked")
                } else {
                    checkboxBox.classList.remove("checkbox-box-checked")
                }
            renderTaskCount()
        })
        
        const taskItemContainer = document.createElement("div")
        taskItemContainer.classList.add("task-item-container")
        
        const label = document.createElement("label")
        label.textContent = task.name
        label.setAttribute("for", task.id)

        const newTaskItem = document.createElement("li")
        newTaskItem.classList.add("task-list-item")
        newTaskItem.dataset.taskId = task.id
        if (task.id === taskId) {
            newTaskItem.style.fontWeight = "bold"  
        }

        const deleteTaskButton = document.createElement("button")
        deleteTaskButton.classList.add("delete-task-button")
        deleteTaskButton.dataset.taskId = task.id
        const deleteTaskButtonImage = document.createElement("img")
        deleteTaskButtonImage.src = "./assets/delete.png"
        deleteTaskButtonImage.alt = "delete task"

        deleteTaskButton.addEventListener("click", () => {
            const taskIdToDelete = deleteTaskButton.dataset.taskId
            taskList = taskList.filter(task => task.id !== taskIdToDelete)
            saveTaskList()
            renderTasks(getFilteredTasks())
            renderTaskCount()
        })

        const editTaskButton = document.createElement("button")
        editTaskButton.classList.add("edit-task-button")
        editTaskButton.dataset.taskId = task.id

        const editTaskButtonImage = document.createElement("img")
        editTaskButtonImage.src = "./assets/edit.png"
        editTaskButtonImage.alt = "edit task"

        const controlsContainer = document.createElement("div")
        controlsContainer.classList.add("controls-container")

        //Editing a task
        editTaskButton.addEventListener("click", () => {
        const taskIdToEdit = editTaskButton.dataset.taskId
        const taskToEdit = taskList.find(task => task.id === taskIdToEdit)
        if (taskToEdit) {
        editTaskDialog.showModal()
        editTaskInput.value = taskToEdit.name
      
        const handleEditSubmit = (e) => {
            e.preventDefault()
            taskToEdit.name = editTaskInput.value
            saveTaskList()
            renderTasks(tasks)
            renderTaskCount()
            editTaskDialog.close()
            editTaskForm.removeEventListener("submit", handleEditSubmit)
        }
        editTaskForm.addEventListener("submit", handleEditSubmit)
    }
    })
    closeEditTaskDialog.addEventListener("click", () => {
        editTaskDialog.close()
    })

        toDoListContainer.appendChild(newTaskContainer)
        taskItemContainer.appendChild(checkboxBox)
        taskItemContainer.appendChild(label)
        taskItemContainer.appendChild(checkbox)

        controlsContainer.appendChild(deleteTaskButton)
        deleteTaskButton.appendChild(deleteTaskButtonImage)
        
        controlsContainer.appendChild(editTaskButton)
        editTaskButton.appendChild(editTaskButtonImage)
        controlsContainer.appendChild(deleteTaskButton)
        newTaskContainer.appendChild(taskItemContainer)
        newTaskContainer.appendChild(controlsContainer)

    })   

        saveTaskList()
}

allTasks.addEventListener("click", () => {
    renderTasks(taskList)
    projectId = null
    toDoListHeading.textContent = "All Tasks"

})


//PROJECTS LOGIC
//Saving a new project list to local storage

function saveProjectList() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_LIST_KEY, JSON.stringify(projectList))
}

function saveProjectId() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_ID_KEY, projectId)
}

projectsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const projectName = projectInput.value
    if (projectName == null || projectName === "") return
    const project = createProject(projectName)
    projectList.push(project)
    saveProjectList()
    saveProjectId()
    projectInput.value = ""
    console.log(projectList)
    projectsDialog.close()
    renderProjects()
    renderTaskCount()
})

function createProject(projectName) {
 return {name: projectName, id: Date.now().toString(), tasks: []}   
}

projectListContainer.addEventListener("click", (e) => {
    //if element is clicked, it should be displayed in bolt to signify that it's been selected
    if (e.target.tagName.toLowerCase() === 'li') {
        projectId = e.target.dataset.projectId
        
        renderTasks(getFilteredTasks())

        }
        
        //Showing the name of the currently selected list on top of the container
        toDoListHeading.textContent = projectList.find(project => project.id === projectId)?.name || "All To Do's"
        saveProjectId()
        renderProjects()
        renderTaskCount()
    })

function renderProjects() {
    projectListContainer.innerHTML = ""
    projectList.forEach(project => {
        const newProjectElement = document.createElement("li")
        newProjectElement.classList.add("project-list-item")
        newProjectElement.dataset.projectId = project.id
        newProjectElement.textContent = project.name
        if (project.id === projectId) {
            newProjectElement.style.fontWeight = "bold"
        }
        projectListContainer.appendChild(newProjectElement)
}
)
    }



//To Do container logic


//Showing the number of incomplete tasks in the list - status is done = false
//Go to the task array and filter tasks by their status, assign it to a variable
//Count the number of tasks that are not done

function renderTaskCount() {
    const incompleteTasks = taskList
    .filter(task => !task.isDone)
    .filter(task => task.projectId === projectId)
    if (incompleteTasks.length === 1) {
        taskCount.textContent = `${incompleteTasks.length} task remaining`
    } else taskCount.textContent = `${incompleteTasks.length} tasks remaining`
}

//Modals
openTaskDialog.addEventListener("click", () => {
    taskDialog.showModal()
})

closeTaskDialog.addEventListener("click", () => {
    taskDialog.close()
})

openProjectsDialog.addEventListener("click", () => {
    projectsDialog.showModal()
})

closeProjectsDialog.addEventListener("click", () => {
    projectsDialog.close()
})

renderProjects()
renderTasks(taskList)
renderTaskCount()

document.addEventListener("DOMContentLoaded", () => {
    projectId = null;
});

projectSelect.addEventListener("click", () => {
    projectSelect.innerHTML = ""

    projectList.forEach(project => {
        const projectListItem = document.createElement("option")
        projectListItem.value = project.id
        projectListItem.textContent = project.name
        projectSelect.appendChild(projectListItem)
    })
})



//To Do-s
//Add additional parameters to task object: due date, priority, description, project selection
//Style the task adding dialog window
//Import data fns to the project and use it for dates

//Style the project dialog window

//Add additional parameters to project object: color
//Add functionality to edit project

