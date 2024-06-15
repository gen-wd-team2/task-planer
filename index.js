document.addEventListener('DOMContentLoaded', () => {
    const taskColumns = document.querySelector('.taskColumns');
    const taskLabelsInput = document.getElementById('taskLabels');
    const taskForm = document.getElementById('taskForm');

    taskLabelsInput.addEventListener('input', () => {
        const numColumns = parseInt(taskLabelsInput.value, 10);
        
        // Validate the input to be within 1 to 8
         if (numColumns > 8) {
            numColumns = 8;
        }

        

        taskColumns.innerHTML = '';
        for (let i = 0; i < numColumns; i++) {
            const div = document.createElement('div');
            div.className = 'col border border-1';
            div.innerHTML = `<h5>Column ${i + 1}<h5>`;
            taskColumns.appendChild(div);
        }
    });

//     taskForm.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const taskName = document.getElementById('taskName').value;
//         const taskDescription = document.getElementById('taskDescription').value;

//         // Create and append a new task column
//         const taskDiv = document.createElement('div');
//         taskDiv.className = 'col';
//         taskDiv.innerHTML = `<strong>${taskName}</strong><p>${taskDescription}</p>`;
//         taskColumns.appendChild(taskDiv);

//         // Reset the form and hide the modal
//         taskForm.reset();
//         const taskModal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
//         taskModal.hide();
//     });
});
