export class TaskManager {
    constructor(){
        this.tasks = []
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
        delete this.tasks[this.tasks.findIndex(task => task.id == id)]
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


    