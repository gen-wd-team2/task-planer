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
        deleteTask(id) {
            for(let i = 0; i < this.tasks.length; i++){
                if( this.tasks[i].id == id) 
                    delete this.tasks[i]
             }
    }

}