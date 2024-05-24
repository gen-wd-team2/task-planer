// Create a new task
fetch('http://localhost:3000/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Task 3',
    description: 'Description for Task 3',
    completed: false
  })
});

// Retrieve all tasks
fetch('http://localhost:3000/tasks')
 .then(response => response.json())
 .then(data => console.log(data));

// Retrieve a single task by ID
fetch('http://localhost:3000/tasks/1')
 .then(response => response.json())
 .then(data => console.log(data));

// Update a task by ID
fetch('http://localhost:3000/tasks/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Updated Task 1',
    description: 'Updated Description for Task 1',
    completed: true
  })
});

// Partially update a task by ID
fetch('http://localhost:3000/tasks/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    completed: true
  })
});

// Delete a task by ID
fetch('http://localhost:3000/tasks/1', {
  method: 'DELETE'
});