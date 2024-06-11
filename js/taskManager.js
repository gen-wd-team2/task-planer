export class TaskManager {
    constructor(){
        if (localStorage.getItem('tasks') == null){
            localStorage.setItem('tasks', JSON.stringify([]));
            this.tasks = JSON.parse(localStorage.getItem('tasks'))
        }
        else{
            this.tasks = JSON.parse(localStorage.getItem('tasks'))
        }
        this.currentId = 0
    }
    _saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    addTask({name,description, assignedTo, dueDate, status}){
        this.tasks.push({
            id: this.currentId + 1,
            name:name,
            description:description,
            assignedTo: assignedTo,
            dueDate: dueDate,
            status: status
        })
        this.currentId++
        this._saveToLocalStorage()
    }
    deleteTask(id){
        this.tasks.splice(this.tasks.findIndex(task => task.id == id), 1)
        this._saveToLocalStorage()
    }
    updateTask(updatedTask){
        this.tasks[this.tasks.findIndex(task => task.id == updatedTask.id)] = updatedTask
        this._saveToLocalStorage()

    }
    getTasks(){
        return this.tasks
    }
}


    