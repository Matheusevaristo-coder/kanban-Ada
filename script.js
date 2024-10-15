function toggleForm(columnId) {
    const form = document.getElementById(`${columnId}-form`);
    form.style.display = form.style.display === 'none' || form.style.display === '' ? 'flex' : 'none';
}

function addTask(columnId) {
    const column = document.getElementById(columnId);
    const title = column.querySelector('#task-title').value;
    const desc = column.querySelector('#task-desc').value;
    const user = column.querySelector('#task-user').value;

    const task = document.createElement('div');
    task.className = 'card';
    task.setAttribute('data-user', user);
    task.setAttribute('data-type', title);
    task.innerHTML = `
        <strong>${title}</strong>
        <p>${desc}</p>
        <span class="task-user">${user}</span>
        <button onclick="deleteTask(this)">X</button>
        <button class="move-left" onclick="moveTask(this, -1)"><</button>
        <button class="move-right" onclick="moveTask(this, 1)">></button>
    `;

    column.querySelector('.tasks').appendChild(task);
}

function deleteTask(button) {
    const task = button.parentElement;
    task.remove();
}

function filterTasks(user) {
    const tasks = document.querySelectorAll('.card');
    tasks.forEach(task => {
        if (task.getAttribute('data-user') === user) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}

function filterTasksByType(type) {
    const tasks = document.querySelectorAll('.card');
    tasks.forEach(task => {
        if (task.getAttribute('data-type') === type) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}

function moveTask(button, direction) {
    const task = button.parentElement;
    const currentColumn = task.parentElement.parentElement;
    const columns = Array.from(document.querySelectorAll('.column'));
    const currentIndex = columns.indexOf(currentColumn);
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < columns.length) {
        columns[newIndex].querySelector('.tasks').appendChild(task);
    }
}
