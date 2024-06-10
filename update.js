const container = document.querySelector('.tasks');
const pendingCheckbox = document.getElementById('pendingCheckbox');
const progressCheckbox = document.getElementById('progressCheckbox');
const completedCheckbox = document.getElementById('completedCheckbox');
const searchInput = document.getElementById('searchInput');

const getSelectedStatuses = () => {
  const statuses = [];
  if (pendingCheckbox.checked) statuses.push('Pending');
  if (progressCheckbox.checked) statuses.push('In-Progress');
  if (completedCheckbox.checked) statuses.push('Completed');
  return statuses;
};

const renderTasks = async (term = '') => { // Default term to an empty string
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
    template += `
      <div class="card mb-3 shadow-lg rounded border-${task.status.toLowerCase()}" data-id="${task.id}" data-task-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title"><strong>Name: </strong><input type="text" class="task-name form-control" value="${task.name}"/> <span class="status-circle ${task.status}"></span></h5>
          <p class="card-text"><strong>Description: </strong><textarea class="task-description form-control">${task.description}</textarea></p> 
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item border-${task.status.toLowerCase()}"><strong>Assigned To: </strong><input type="text" class="task-assignedTo form-control" value="${task.assignedTo}"/></li>
          <li class="list-group-item border-${task.status.toLowerCase()}"><strong>Due Date: </strong><input type="date" class="task-dueDate form-control" value="${task.dueDate}"/></li>
          <li class="list-group-item"><strong>Status: </strong>
            <select class="task-status form-control">
              <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="In-Progress" ${task.status === 'In-Progress' ? 'selected' : ''}>In-Progress</option>
              <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </li>
          <li class="list-group-item">
            <button class="delete-button btn btn-danger" id="${task.id}"><i class="fa-solid fa-trash"></i></button>
            <button class="btn btn-primary" data-button>Save Edit</button>
          </li>
        </ul>
      </div>
    `;
  });

  container.innerHTML = template;

  // Add event listeners for the delete buttons
  const deleteButtons = container.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      deletor(button.id);
    });
  });

  // Add event listeners for the save buttons
  const saveButtons = container.querySelectorAll('[data-button]');
  saveButtons.forEach(button => {
    button.addEventListener('click', function() {
      const taskId = button.closest('[data-task-id]').getAttribute('data-task-id');
      updateTask(button.closest('[data-task-id]'), taskId);
    });
  });
};

const updateTask = async (card, taskId) => {
  const task = {
    name: card.querySelector('.task-name').value,
    description: card.querySelector('.task-description').value,
    assignedTo: card.querySelector('.task-assignedTo').value,
    dueDate: card.querySelector('.task-dueDate').value,
    status: card.querySelector('.task-status').value,
  };

  console.log(task, ':::for me');

  await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(task),
    headers: { 'Content-Type': 'application/json' }
  });

  // Re-render tasks after updating a task
  renderTasks();
};

// Event listeners for checkboxes
[pendingCheckbox, progressCheckbox, completedCheckbox].forEach(checkbox => {
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
  