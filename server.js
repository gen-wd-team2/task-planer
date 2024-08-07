const container = document.querySelector('.tasks');
const todoCheckbox = document.getElementById('todoCheckbox');
const progressCheckbox = document.getElementById('progressCheckbox');
const reviewCheckbox = document.getElementById('reviewCheckbox');
const doneCheckbox = document.getElementById('doneCheckbox');
const searchInput = document.getElementById('searchInput');

const getSelectedStatuses = () => {
  const statuses = [];
  if (todoCheckbox.checked) statuses.push('Todo');
  if (progressCheckbox.checked) statuses.push('In-Progress');
  if (reviewCheckbox.checked) statuses.push('Review');
  if (doneCheckbox.checked) statuses.push('Done');
  return statuses;
};

const renderTasks = async (term = '') => { 
  let uri = 'http://localhost:3000/tasks';

  const res = await fetch(uri);
  const tasks = await res.json();

  let statuses = getSelectedStatuses();

  let filteredTasks = tasks.filter(task => 
    (statuses.length === 0 || statuses.includes(task.status)) && 
    (task.name.toLowerCase().includes(term.toLowerCase()) || 
     task.description.toLowerCase().includes(term.toLowerCase()))
  );

  let template = '';
  filteredTasks.reverse().forEach(task => {
    const priorityClass = task.priority.toLowerCase();
    template += `
      <div class="card mb-3 shadow-lg rounded border-${task.status.toLowerCase()} ${priorityClass}" data-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title" contenteditable="true" data-field="name"><strong>Name: </strong>${task.name}<span class="status-circle ${task.status}"></span></h5>
          <p class="card-text" contenteditable="true" data-field="description"><strong>Description: </strong>${task.description}</p> 
        </div>
        <ul class="list-group list-group-flush">
              <li class="list-group-item border-${task.status.toLowerCase()}" contenteditable="true" data-field="assignedTo"><strong>Assigned To: </strong>${task.assignedTo}</li>
              <li class="list-group-item border-${task.status.toLowerCase()}" contenteditable="true" data-field="dueDate"><strong>Due Date</strong>: ${task.dueDate}</li>
              <li class="list-group-item border-${task.status.toLowerCase()}" contenteditable="true" data-field="status"><strong>Status</strong>: ${task.status}</li>
              <li class="list-group-item border-${task.status.toLowerCase()}" contenteditable="true" data-field="priority"><strong>Priority</strong>: ${task.priority}</li>
              <li class="list-group-item flex justify-content-between">
                <button class="delete-button btn btn-danger" id="${task.id}"><i class="fa-solid fa-trash"></i> Delete</button>
                <button class="save-button btn btn-primary" data-id="${task.id}">Save edit</button>
              </li>
        </ul>
      </div>
    `;
  });

  container.innerHTML = template;
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      deletor(button.id);
    });
  });

  const saveButtons = document.querySelectorAll('.save-button');
  saveButtons.forEach(button => {
    button.addEventListener('click', function() {
      saveEdit(button.dataset.id);
    });
  });
};

const saveEdit = async (id) => {
  const card = document.querySelector(`div[data-id='${id}']`);
  const updatedTask = {
    name: card.querySelector("[data-field='name']").innerText.replace('Name: ', ''),
    description: card.querySelector("[data-field='description']").innerText.replace('Description: ', ''),
    assignedTo: card.querySelector("[data-field='assignedTo']").innerText.replace('Assigned To: ', ''),
    dueDate: card.querySelector("[data-field='dueDate']").innerText.replace('Due Date: ', ''),
    status: card.querySelector("[data-field='status']").innerText.replace('Status: ', ''),
    priority: card.querySelector("[data-field='priority']").innerText.replace('Priority: ', '')
  };

  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedTask),
    headers: { 'Content-Type': 'application/json' }
  });

  renderTasks();
};

// Event listeners for checkboxes
[todoCheckbox, progressCheckbox, reviewCheckbox, doneCheckbox].forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    renderTasks(searchInput.value);
  });
});

// Event listener for search input
searchInput.addEventListener('input', (e) => {
  renderTasks(e.target.value);
});

// Initial rendering of tasks
window.addEventListener('DOMContentLoaded', () => renderTasks());

// JavaScript for create.html
const form = document.querySelector('form');

const createTask = async (e) => {
  e.preventDefault();

  const task = {
    name: form.name.value,
    description: form.description.value,
    assignedTo: form.assignedTo.value,
    dueDate: form.dueDate.value,
    status: form.status.value,
    priority: form.priority.value,
  };

  await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
    headers: { 'Content-Type': 'application/json' }
  });

  // Re-render tasks after creating a new task
  renderTasks();
};

async function deletor(id) {
  let uri = 'http://localhost:3000/tasks/' + id;

  await fetch(uri, {
    method: 'DELETE',
  });

  // Re-render tasks after deleting a task
  renderTasks();
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        createTask(event);
      }

      form.classList.add('was-validated');
    }, false);
  });
})();
