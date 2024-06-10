
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

const renderTasks = async () => {
  console.log();
  let uri = 'http://localhost:3000/tasks';

  const res = await fetch(uri);
  const tasks = await res.json();

  let filteredTasks = tasks.filter(task => 
    (statuses.length === 0 || statuses.includes(task.status)) && 
    (task.name.toLowerCase().includes(term.toLowerCase()) || 
     task.description.toLowerCase().includes(term.toLowerCase()))
  );

  let template = ``;
  tasks.reverse().forEach(task => {
    template += `
      <div class="card mb-3 shadow-lg rounded border-${task.status.toLowerCase()}" data-id="${task.id}" contenteditable="true">
        <div class="card-body">
          <h5 class="card-title"><strong>Name: </strong>${task.name} <span class="status-circle ${task.status}"></span><button id=${task.id}><i class="fa-solid fa-trash"></i></button> </h5>
          <p class="card-text"><strong>Description: </strong>${task.description}</p> 
        </div>
        <ul class="list-group list-group-flush">
              <li class="list-group-item border-${task.status.toLowerCase()}"><strong>Assigned To: </strong>${task.assignedTo} </li>
              <li class="list-group-item border-${task.status.toLowerCase()}"><strong>Due Date</strong>: ${task.dueDate}</li>
              <li class="list-group-item"><strong>Status</strong>: ${task.status}</li>
        </ul>
      </div>
    `;
  });

  container.innerHTML = template;

  const allbuttons=document.querySelectorAll('button');

  allbuttons.forEach(function(button, index){
    button.addEventListener('click', function(){
      deletor(button.id);
    })
  })

}


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

  window.location.replace('/');
};

async function deletor(id)  
{
let uri = 'http://localhost:3000/tasks'

const res = await fetch(uri);
let tasks = await res.json();

// tasks.splice(index, 1);
//  console.log(tasks);
// let task=tasks[index];
  console.log(id);
//   console.log(task.id);
 let deleteUri = uri+ '/'+ id;

await fetch(deleteUri, {
  method:'DELETE',
})

 window.localion.reload('/')

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

