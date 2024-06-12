// Import TaskManager class
import { TaskManager } from './taskManager.js';

const taskManager = new TaskManager();

// DOM elements
const container = document.querySelector('.tasks');
const todoCheckbox = document.getElementById('todoCheckbox');
const progressCheckbox = document.getElementById('progressCheckbox');
const reviewCheckbox = document.getElementById('reviewCheckbox');
const doneCheckbox = document.getElementById('doneCheckbox');
const searchInput = document.getElementById('searchInput');
const deletedCheckbox = document.getElementById('deletedCheckbox');
let hideDeleted = 1;

// Get selected statuses from checkboxes
const getSelectedStatuses = () => {
  let statuses = [];
  if (todoCheckbox.checked) statuses.push('Todo');
  if (progressCheckbox.checked) statuses.push('In-Progress');
  if (reviewCheckbox.checked) statuses.push('Review');
  if (doneCheckbox.checked) statuses.push('Done');
  hideDeleted = deletedCheckbox.checked ? 0 : 1;
  return statuses;
};

// Render tasks based on selected statuses and search term
const renderTasks = (term = '') => {
  let statuses = getSelectedStatuses();
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  console.log('Fetched tasks from localStorage:', tasks);
  console.log('Selected statuses:', statuses);
  console.log('Hide deleted:', hideDeleted);

  let filteredTasks = tasks.filter(task =>
    (statuses.length === 0 || statuses.includes(task.status)) && 
    task.isVisible === hideDeleted &&
    (task.name.toLowerCase().includes(term.toLowerCase()) ||
      task.description.toLowerCase().includes(term.toLowerCase()))
  );

  console.log('Filtered tasks:', filteredTasks);

  let template = '';
  filteredTasks.reverse().forEach(task => {
    template += `
      <div class="card mb-3 shadow-lg rounded border-${task.status.toLowerCase()}" data-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title" data-field="name"><strong>Name: </strong><span contenteditable="true">${task.name}<span><span class="status-circle ${task.status}"></span></h5>
          <p class="card-text" data-field="description"><strong>Description: </strong><span contenteditable="true">${task.description}</span></p>
        </div>
        <ul class="list-group list-group-flush">
              <li class="list-group-item"  data-field="assignedTo"><strong>Assigned To: </strong><span contenteditable="true">${task.assignedTo}<span></li>
              <li class="list-group-item"  data-field="dueDate"><strong>Due Date: </strong><span contenteditable="true">${task.dueDate}</span></li>
              <li class="list-group-item" data-field="status"><strong>Status: </strong><span contenteditable="true">${task.status}</span></li>
              <li class="list-group-item d-flex justify-content-between">
                <button class="delete-button btn btn-danger" data-id="${task.id}">
                  ${task.isVisible ? '<i class="fa-solid fa-trash"></i> Delete' : '<i class="fa-solid fa-undo"></i> Undo Delete'}
                </button>
                <button class="save-button btn btn-primary" data-id="${task.id}">Save edit</button>
              </li>
        </ul>
      </div>
    `;
  });

  container.innerHTML = template;

  // Attach event listeners for delete and save buttons
  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', function() {
      if (button.innerHTML.includes('Undo Delete')) {
        undoDelete(button.dataset.id);
      } else {
        deletor(button.dataset.id);
      }
    });
  });

  document.querySelectorAll('.save-button').forEach(button => {
    button.addEventListener('click', function() {
      saveEdit(button.dataset.id);
    });
  });
};

// Save edited task
const saveEdit = (id) => {
  const card = document.querySelector(`div[data-id='${id}']`);
  const updatedTask = {
    id: Number(id),
    name: card.querySelector("[data-field='name']").innerText.replace('Name: ', ''),
    description: card.querySelector("[data-field='description']").innerText.replace('Description: ', ''),
    assignedTo: card.querySelector("[data-field='assignedTo']").innerText.replace('Assigned To: ', ''),
    dueDate: card.querySelector("[data-field='dueDate']").innerText.replace('Due Date: ', ''),
    status: card.querySelector("[data-field='status']").innerText.replace('Status: ', ''),
    isVisible: 1 // Ensure task isVisible is set to 1 on save
  };

  console.log('Updated task:', updatedTask);

  taskManager.updateTask(updatedTask);
  renderTasks();
};

// Event listeners for checkboxes
[todoCheckbox, progressCheckbox, reviewCheckbox, doneCheckbox, deletedCheckbox].forEach(checkbox => {
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

const createTask = (e) => {
  e.preventDefault();

  const task = {
    name: form.name.value,
    description: form.description.value,
    assignedTo: form.assignedTo.value,
    dueDate: form.dueDate.value,
    status: form.status.value,
    isVisible: 1
  };

  taskManager.addTask(task);

  window.location.replace('/');

  // Re-render tasks after creating a new task
  renderTasks();
};

const deletor = (id) => {
  const confirmed = confirm('Are you sure you want to delete this task?');
  if (confirmed) {
    taskManager.deleteTask(Number(id));
    renderTasks();
  }
};

const undoDelete = (id) => {
  taskManager.undoDeleteTask(Number(id));
  renderTasks();
};

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
