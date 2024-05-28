const container = document.querySelector('.tasks');

// Function to render tasks
const renderTasks = async () => {
  let uri = 'http://localhost:3000/tasks';
  const res = await fetch(uri);
  const tasks = await res.json();

  let template = '';
  tasks.reverse().forEach(task => {
    template += `
      <div class="card mb-3 shadow-lg rounded" contenteditable="true" data-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title">${task.name}</h5>
          <p class="card-text">${task.description}</p> 
        </div>
        <ul class="list-group list-group-flush">
              <li class="list-group-item"><span>Assigned To: </span>${task.assignedTo} </li>
              <li class="list-group-item"><span>Due Date</span>: ${task.dueDate}</li>
              <li class="list-group-item"><span>Status</span>: ${task.status}</li>
        </ul>
      </div>
    `;
  });

  container.innerHTML = template;

  // Add event listener to each editable task
  document.querySelectorAll('.card[contenteditable="true"]').forEach(card => {
    card.addEventListener('blur', updateTask);
  });
};

// Function to update task
const updateTask = async (e) => {
  const card = e.currentTarget;
  const id = card.getAttribute('data-id');
  const name = card.querySelector('.card-title').innerText;
  const description = card.querySelector('.card-text').innerText;
  const assignedTo = card.querySelectorAll('.list-group-item')[0].innerText.replace('Assigned To: ', '').trim();
  const dueDate = card.querySelectorAll('.list-group-item')[1].innerText.replace('Due Date: ', '').trim();
  const status = card.querySelectorAll('.list-group-item')[2].innerText.replace('Status: ', '').trim();

  const updatedTask = { name, description, assignedTo, dueDate, status };

  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedTask),
    headers: { 'Content-Type': 'application/json' }
  });

  alert('Task updated successfully!');
};

window.addEventListener('DOMContentLoaded', () => renderTasks());
