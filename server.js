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
      <div class="card m-5">
        <div class="card-body">
          <h5 class="card-title">${task.name}</h5>
          <p class="card-text">${task.description}</p>
        </div>
        <ul class="list-group list-group-flush">
              <li class="list-group-item"><span>Assigned To:</span>${task.assignedTo} </li>
              <li class="list-group-item">Due Date: ${task.dueDate}</li>
              <li class="list-group-item">Status: ${task.status}</li>
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

form.addEventListener('submit', createTask);


window.addEventListener('DOMContentLoaded', () => renderTasks());