document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const assignedToInput = document.getElementById('assignedTo');
    const dueDateInput = document.getElementById('dueDate');
    const statusInput = document.getElementById('status');
    const errorAlert = document.getElementById('errorAlert');
    const tasksContainer = document.querySelector('.tasks');
    const filters = document.querySelectorAll('.groupby');
    const taskList = document.querySelector('.task-list');

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
        taskElement.classList.add('task', 'mb-3', 'p-3', 'border', 'rounded', status);
        taskElement.innerHTML = `
            <h5>${name}</h5>
            <p>${description}</p>
            <p><strong>Assigned To:</strong> ${assignedTo}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <p><strong>Status:</strong> ${status}</p>
        `;
        tasksContainer.appendChild(taskElement);
        updateTasks();
    }

    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const tasks = data.tasks;
            renderTasks(tasks);
            filters.forEach(filter => {
                filter.addEventListener('change', () => updateTasks());
            });
            updateTasks(); // Initialize with current filter state
        });

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.status}`;
            taskElement.innerHTML = `
                <h5>${task.title}</h5>
                <p>${task.description}</p>
                <p><strong>Assigned To:</strong> ${task.assignedTo}</p>
                <p><strong>Due Date:</strong> ${task.dueDate}</p>
                <p><strong>Status:</strong> ${task.status}</p>
            `;
            taskList.appendChild(taskElement);
        });
    }

    function updateTasks() {
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

    // Function to handle checkbox clicks
    function handleCheckboxClick(event) {
        const status = event.target.value;
        const taskElements = document.querySelectorAll('.task');
        taskElements.forEach(taskElement => {
            if (taskElement.classList.contains(status)) {
                taskElement.classList.toggle('selected', event.target.checked);
            }
        });
    }

    // Adding event listeners to the checkboxes
    document.getElementById('pendingCheckbox').addEventListener('click', handleCheckboxClick);
    document.getElementById('inProgressCheckbox').addEventListener('click', handleCheckboxClick);
    document.getElementById('completedCheckbox').addEventListener('click', handleCheckboxClick);
});
