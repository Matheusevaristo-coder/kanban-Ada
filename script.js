async function fetchRickAndMortyCharacter() {
    const randomId = Math.floor(Math.random() * 826) + 1; // 826 personagens no total
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
    const data = await response.json();
    return data.image; // Retorna a URL da imagem do personagem
}

async function loadCharacterImages() {
    const meImage = await fetchRickAndMortyCharacter(); // Busca um personagem aleatório para ME
    const lsImage = await fetchRickAndMortyCharacter(); // Busca um personagem aleatório para LS
    
    document.querySelector('.user-icon.me').innerHTML = `<img src="${meImage}" alt="ME" style="width: 35px; height: 35px; border-radius: 50%;"> ME`;
    document.querySelector('.user-icon.ls').innerHTML = `<img src="${lsImage}" alt="LS" style="width: 35px; height: 35px; border-radius: 50%;"> LS`;
}

window.onload = () => {
    loadCharacterImages();
    loadTasksFromStorage(); 
};

function toggleForm(columnId) {
    const form = document.getElementById(`${columnId}-form`);
    form.style.display = form.style.display === 'none' || form.style.display === '' ? 'flex' : 'none';
}

async function addTask(columnId) {
    const column = document.getElementById(columnId);
    const title = column.querySelector('#task-title').value;
    const desc = column.querySelector('#task-desc').value;
    const user = column.querySelector('#task-user').value;
    let userImage = "";
    if (user === "ME") {
        userImage = await fetchRickAndMortyCharacter();
    } else if (user === "LS") {
        userImage = await fetchRickAndMortyCharacter();
    }
    const task = {
        title,
        desc,
        user,
        userImage,
        columnId,
        createdAt: new Date().toISOString() 
    };
    addTaskToDOM(task);
    saveTaskToStorage(task);
    column.querySelector('#task-title').value = '';
    column.querySelector('#task-desc').value = '';
}

function addTaskToDOM(task) {
    const column = document.getElementById(task.columnId);
    const taskElement = document.createElement('div');
    taskElement.className = 'card';
    taskElement.setAttribute('data-user', task.user);
    taskElement.setAttribute('data-type', task.title);

    const createdAt = new Date(task.createdAt);
    const isRecent = (new Date() - createdAt) < 24 * 60 * 60 * 1000; 
    const formattedDate = createdAt.toLocaleString();

    taskElement.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.desc}</p>
        <p><small class="task-date ${isRecent ? 'recent' : ''}">Criado em: ${formattedDate}</small></p>
        <span class="task-user"><img src="${task.userImage}" alt="${task.user}" style="width: 35px; height: 35px; border-radius: 50%;"> ${task.user}</span>
        <button class="delete" onclick="deleteTask(this)">X</button>
        <button class="move-left" onclick="moveTask(this, -1)"><</button>
        <button class="move-right" onclick="moveTask(this, 1)">></button>
        <button class="edit" onclick="editTask(this)">Editar</button>
    `;
    column.querySelector('.tasks').appendChild(taskElement);
}

function saveTaskToStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

async function editTask(button) {
    const taskElement = button.parentElement;
    const desc = taskElement.querySelector('p').innerText;
    const user = taskElement.querySelector('.task-user').innerText.trim();
    const type = taskElement.getAttribute('data-type');
    taskElement.innerHTML = `
        <strong>Editar Tarefa</strong>
        <select id="edit-type">
            <option value="Front end" ${type === 'Front end' ? 'selected' : ''}>Front end</option>
            <option value="Back end" ${type === 'Back end' ? 'selected' : ''}>Back end</option>
            <option value="Full stack" ${type === 'Full stack' ? 'selected' : ''}>Full stack</option>
            <option value="Outro" ${type === 'Outro' ? 'selected' : ''}>Outro</option>
        </select>
        <textarea id="edit-desc">${desc}</textarea>
        <select id="edit-user">
            <option value="ME" ${user === 'ME' ? 'selected' : ''}>ME</option>
            <option value="LS" ${user === 'LS' ? 'selected' : ''}>LS</option>
        </select>
        <button onclick="saveTask(this)">Salvar</button>
    `;
}

async function saveTask(button) {
    const taskElement = button.parentElement;
    const newDesc = taskElement.querySelector('#edit-desc').value;
    const newUser = taskElement.querySelector('#edit-user').value;
    const newType = taskElement.querySelector('#edit-type').value;
    let userImage = "";
    if (newUser === "ME") {
        userImage = await fetchRickAndMortyCharacter();
    } else if (newUser === "LS") {
        userImage = await fetchRickAndMortyCharacter();
    }
    taskElement.setAttribute('data-type', newType);
    taskElement.innerHTML = `
        <strong>${newType}</strong>
        <p>${newDesc}</p>
        <p><small class="task-date">Criado em: ${new Date().toLocaleString()}</small></p>
        <span class="task-user"><img src="${userImage}" alt="${newUser}" style="width: 35px; height: 35px; border-radius: 50%;"> ${newUser}</span>
        <button class="delete" onclick="deleteTask(this)">X</button>
        <button class="move-left" onclick="moveTask(this, -1)"><</button>
        <button class="move-right" onclick="moveTask(this, 1)">></button>
        <button class="edit" onclick="editTask(this)">Editar</button>
    `;
    updateTaskInStorage(newType, newDesc, newUser, userImage, taskElement);
}

function updateTaskInStorage(newType, newDesc, newUser, userImage, taskElement) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = Array.from(taskElement.parentElement.children).indexOf(taskElement);
    tasks[taskIndex].title = newType;
    tasks[taskIndex].desc = newDesc;
    tasks[taskIndex].user = newUser;
    tasks[taskIndex].userImage = userImage;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(button) {
    const taskElement = button.parentElement;
    const taskIndex = Array.from(taskElement.parentElement.children).indexOf(taskElement);
    taskElement.remove();
    removeTaskFromStorage(taskIndex);
}

function removeTaskFromStorage(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function moveTask(button, direction) {
    const taskElement = button.parentElement;
    const currentColumn = taskElement.parentElement.parentElement;
    const columns = Array.from(document.querySelectorAll('.column'));
    const currentIndex = columns.indexOf(currentColumn);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < columns.length) {
        columns[newIndex].querySelector('.tasks').appendChild(taskElement);
        updateTaskColumnInStorage(taskElement, columns[newIndex].id);
    }
}

function updateTaskColumnInStorage(taskElement, newColumnId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = Array.from(taskElement.parentElement.children).indexOf(taskElement);
    tasks[taskIndex].columnId = newColumnId;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

let currentUserFilter = null;
let currentFilter = null;

function filterTasks(user) {
    currentUserFilter = currentUserFilter === user ? null : user;
    applyFilters();
}

function filterTasksByType(type) {
    currentFilter = currentFilter === type ? null : type;
    applyFilters();
}

function applyFilters() {
    const tasks = document.querySelectorAll('.card');
    tasks.forEach(task => {
        const taskUser = task.querySelector('.task-user').innerText.trim();
        const taskType = task.getAttribute('data-type');

        const matchesUser = currentUserFilter ? taskUser === currentUserFilter : true;
        const matchesType = currentFilter ? taskType === currentFilter : true;

        task.style.display = matchesUser && matchesType ? 'block' : 'none';
    });
}
