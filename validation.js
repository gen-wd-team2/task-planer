document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const assignedToInput = document.getElementById('assignedTo');
    const dueDateInput = document.getElementById('dueDate');
    const statusInput = document.getElementById('status');
    const errorAlert = document.getElementById('errorAlert');
    const tasksContainer = document.querySelector('.tasks');

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskName = taskNameInput.value.trim();
        const taskDescription = taskDescriptionInput.value.trim();
        const assignedTo = assignedToInput.value.trim();
        const dueDate = dueDateInput.value;
        const status = statusInput.value;

        // Clear previous error messages
        errorAlert.classList.add('d-none');
        errorAlert.textContent = '';

        // Validate inputs
        if (!taskName) {
            showError('Task name cannot be empty');
            taskNameInput.focus();
            return;
        }
        if (!assignedTo) {
            showError('Assigned to cannot be empty');
            assignedToInput.focus();
            return;
        }
        if (!dueDate) {
            showError('Due date cannot be empty');
            dueDateInput.focus();
            return;
        }
        const currentDate = new Date().toISOString().split('T')[0];
        if (dueDate < currentDate) {
            showError('Due date cannot be in the past');
            dueDateInput.focus();
            return;
        }
        if (!status) {
            showError('Status cannot be empty');
            statusInput.focus();
            return;
        }

        // If validation passes, add task to the list
        addTask(taskName, taskDescription, assignedTo, dueDate, status);

        // Clear input fields
        taskForm.reset();
        taskForm.classList.remove('was-validated');
    });

    function showError(message) {
        errorAlert.textContent = message;
        errorAlert.classList.remove('d-none');
    }

    function addTask(name, description, assignedTo, dueDate, status) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task', 'mb-3', 'p-3', 'border', 'rounded');
        taskElement.innerHTML = `
            <h5>${name}</h5>
            <p>${description}</p>
            <p><strong>Assigned To:</strong> ${assignedTo}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <p><strong>Status:</strong> ${status}</p>
        `;
        tasksContainer.appendChild(taskElement);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const filters = document.querySelectorAll('.groupby');
    const taskList = document.querySelector('.task-list');

    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const tasks = data.tasks;
            renderTasks(tasks);
            filters.forEach(filter => {
                filter.addEventListener('change', () => updateTasks(tasks));
            });
            updateTasks(tasks); // Initialize with current filter state
        });

    function renderTasks(tasks) {
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.type}`;
            taskElement.textContent = task.title;
            taskList.appendChild(taskElement);
        });
    }

    function updateTasks(tasks) {
        const activeFilters = Array.from(filters)
            .filter(filter => filter.checked)
            .map(filter => filter.value);

        const taskElements = document.querySelectorAll('.task');
        taskElements.forEach(taskElement => {
            const taskClasses = Array.from(taskElement.classList);
            if (activeFilters.length === 0 || activeFilters.some(filter => taskClasses.includes(filter))) {
                taskElement.style.display = 'block';
            } else {
                taskElement.style.display = 'none';
            }
        });
    }

});
