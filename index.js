document.addEventListener('DOMContentLoaded', () => {
    const taskColumns = document.querySelector('.taskColumns');
    const taskLabelsInput = document.getElementById('taskLabels');
    const addColumnButton = document.getElementById('addColumn');
    const removeColumnButton = document.getElementById('removeColumn');
    const reorderIndexInput = document.getElementById('reorderIndex');
    const reorderColumnButton = document.getElementById('reorderColumn');
    const taskForm = document.getElementById('taskForm');
    let currentEditIndex = null;

    const createColumn = (index) => {
        const div = document.createElement('div');
        div.className = 'col border border-1';
        div.innerHTML = `
            <h5>Column ${index + 1}</h5>
            <button class="btn btn-secondary edit-column">Edit</button>
        `;
        div.setAttribute('draggable', true);
        return div;
    };

    const updateColumns = () => {
        const numColumns = parseInt(taskLabelsInput.value, 10);
        
        // Ensure the input is within the range 1 to 8
        if (numColumns > 8) {
            taskLabelsInput.value = 8;
        } else if (numColumns < 1) {
            taskLabelsInput.value = 1;
        }

        taskColumns.innerHTML = '';
        for (let i = 0; i < taskLabelsInput.value; i++) {
            const div = createColumn(i);
            taskColumns.appendChild(div);
        }

        addEditListeners();
        addDragAndDropListeners();
    };

    const addEditListeners = () => {
        document.querySelectorAll('.edit-column').forEach((button, index) => {
            button.addEventListener('click', () => {
                currentEditIndex = index;
                const column = button.parentElement;
                const title = column.querySelector('h5').innerText;
                const color = column.style.backgroundColor || '#ffffff';
                document.getElementById('columnTitle').value = title;
                document.getElementById('columnColor').value = color;
                const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
                taskModal.show();
            });
        });
    };

    const addDragAndDropListeners = () => {
        let draggedElement = null;

        taskColumns.addEventListener('dragstart', (event) => {
            draggedElement = event.target;
        });

        taskColumns.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        taskColumns.addEventListener('drop', (event) => {
            event.preventDefault();
            if (draggedElement && event.target.className.includes('col')) {
                const columns = Array.from(taskColumns.children);
                const indexFrom = columns.indexOf(draggedElement);
                const indexTo = columns.indexOf(event.target);
                taskColumns.insertBefore(draggedElement, indexTo > indexFrom ? event.target.nextSibling : event.target);
            }
        });
    };

    addColumnButton.addEventListener('click', () => {
        const currentValue = parseInt(taskLabelsInput.value, 10);
        if (currentValue < 8) {
            taskLabelsInput.value = currentValue + 1;
            updateColumns();
        }
    });

    removeColumnButton.addEventListener('click', () => {
        const currentValue = parseInt(taskLabelsInput.value, 10);
        if (currentValue > 1) {
            taskLabelsInput.value = currentValue - 1;
            updateColumns();
        }
    });

    reorderColumnButton.addEventListener('click', () => {
        const index = parseInt(reorderIndexInput.value, 10) - 1;
        if (index >= 0 && index < taskColumns.children.length) {
            const columnToMove = taskColumns.children[index];
            taskColumns.removeChild(columnToMove);
            taskColumns.appendChild(columnToMove);
        }
    });

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('columnTitle').value;
        const color = document.getElementById('columnColor').value;
        if (currentEditIndex !== null) {
            const column = taskColumns.children[currentEditIndex];
            column.querySelector('h5').innerText = title;
            column.style.backgroundColor = color;
        }
        const taskModal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        taskModal.hide();
    });

    taskLabelsInput.addEventListener('input', updateColumns);
    updateColumns();
});
