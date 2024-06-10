
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
      <div tabindex="0" class="card mb-3 shadow-lg" data-task-id=${task.id}>
        <div class="card-body">
          <h5 class="card-title">${task.name}</h5>
          <p class="card-text">${task.description}</p> 
        </div>
        <ul class="list-group list-group-flush">
              <li class="list-group-item"><span>Assigned To: </span>${task.assignedTo} </li>
              <li class="list-group-item"><span>Due Date</span>: ${task.dueDate}</li>
              <li class="list-group-item"><span>Status</span>: ${task.status}</li>
        </ul>
        <button class="btn btn-primary" data-button>save edit</button>
      </div>
    `
  });


  container.innerHTML = template;

  const taskCardDivs = document.querySelectorAll('[data-task-id]');
// console.log(taskCardId,' idds');

taskCardDivs.forEach(card => {
  console.log('card, adding', card);

  const saveButton =  card.querySelector('[data-button]');

console.log(saveButton,'button')

saveButton.addEventListener('click', event => {
  const taskId = event.target?.parentElement?.getAttribute('data-task-id');

  if(taskId) {
    updateTask(event, taskId)
  }
})

})

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

const updateTask = async (event,taskId,) => {

  const task = {
    name: form.name.value,
    description: form.description.value,
    assignedTo: form.assignedTo.value,
    dueDate: form.dueDate.value,
    status: form.status.value,
  };

  console.log(task, ':::for me');
  console.log(form, 'name in form')

  // await fetch(`http://localhost:3000/tasks/${taskId}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(task),
  //   headers: { 'Content-Type': 'application/json' }
  // });

};

form.addEventListener('submit', createTask);


window.addEventListener('DOMContentLoaded', () => renderTasks());