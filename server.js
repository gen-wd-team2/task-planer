// javascript for index.html
const container = document.querySelector('.tasks');
// const searchForm = document.querySelector('.search');

const renderTasks = async (term) => {
  console.log(term);
  let uri = 'http://localhost:3000/tasks';

  const res = await fetch(uri);
  const tasks = await res.json();
  console.log(tasks);

  let template = '';
  tasks.reverse().forEach(task => {
    template += `
      <div class="card mb-3 shadow-lg rounded" data-id${task.id} contenteditable="true">
        <div class="card-body">
          <h5 class="card-title"><strong>Name: </strong>${task.name} <span class="status-circle ${task.status}"></span></h5>
          <p class="card-text"><strong>Description: </strong>${task.description}</p> 
        </div>
        <ul class="list-group list-group-flush">
              <li class="list-group-item"><strong>Assigned To: </strong>${task.assignedTo} </li>
              <li class="list-group-item"><strong>Due Date</strong>: ${task.dueDate}</li>
              <li class="list-group-item"><strong>Status</strong>: ${task.status}</li>
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

  const task = {
    name: form.name.value,
    description: form.description.value,
    assignedTo: form.assignedTo.value,
    dueDate: form.dueDate.value,
    status: form.status.value,
  }

  await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
    headers: { 'Content-Type': 'application/json' }
  })

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
// search with keyword or name


searchInput.addEventListener('input', (e) => {
  renderTasks(e.target.value);
});

window.addEventListener('DOMContentLoaded', () => renderTasks());