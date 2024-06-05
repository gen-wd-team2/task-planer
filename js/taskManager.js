export class TaskManager {
    constructor(){
        this.tasks = []
        this.currentId = 0
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

    }
}


    