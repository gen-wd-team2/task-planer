import { TaskManager } from './taskManager.js'

const team2TaskManager = new TaskManager()

// javascript for index.html
const container = document.querySelector('.tasks');
// const searchForm = document.querySelector('.search');

const renderTasks = async () => {

  let template = '';
  team2TaskManager.tasks.slice().reverse().forEach(task => {
    template += `
      <div class="card mb-3 shadow-lg rounded">
        <div class="card-body" data-id="${task.id}">
          <h5 class="card-title">${task.name}</h5>
          <p class="card-text">${task.description}</p> 
        </div>
        <ul class="list-group list-group-flush">
              <li class="list-group-item"><span>Assigned To: </span>${task.assignedTo} </li>
              <li class="list-group-item"><span>Due Date</span>: ${task.dueDate}</li>
              <li class="list-group-item"><span>Status</span>: ${task.status}</li>
        </ul>
      </div>
    `
  });


  container.innerHTML = template;
}


// javascript for create.html
const form = document.querySelector('form');

const createTask = async (e) => {
  e.preventDefault();

  team2TaskManager.addTask({
    name: form.name.value,
    description: form.description.value,
    assignedTo: form.assignedTo.value,
    dueDate: form.dueDate.value,
    status: form.status.value,
  })

  console.log(team2TaskManager.tasks)
  window.location.replace('/')
  
}


// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }else {
        createTask(event);
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// form.addEventListener('submit', createTask);

// search by name or keyword
container.innerHTML = template;

searchInput.addEventListener('input', (e) => {
  renderTasks(e.target.value);
});

window.addEventListener('DOMContentLoaded', () => renderTasks());

