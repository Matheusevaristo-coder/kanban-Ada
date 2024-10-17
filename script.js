
// Função para buscar personagens aleatórios da API Rick and Morty
async function fetchRickAndMortyCharacter() {
    const randomId = Math.floor(Math.random() * 826) + 1; // 826 personagens no total
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
    const data = await response.json();
    return data.image; // Retorna a URL da imagem do personagem
}

// Função para adicionar as imagens de ME e LS
async function loadCharacterImages() {
    const meImage = await fetchRickAndMortyCharacter(); // Busca um personagem aleatório para ME
    const lsImage = await fetchRickAndMortyCharacter(); // Busca um personagem aleatório para LS
    
    document.querySelector('.user-icon.me').innerHTML = `<img src="${meImage}" alt="ME" style="width: 35px; height: 35px; border-radius: 50%;"> ME`;
    document.querySelector('.user-icon.ls').innerHTML = `<img src="${lsImage}" alt="LS" style="width: 35px; height: 35px; border-radius: 50%;"> LS`;
}

window.onload = loadCharacterImages;


// Chama a função para carregar as imagens ao carregar a página
window.onload = loadCharacterImages;

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

    const task = document.createElement('div');
    task.className = 'card';
    task.setAttribute('data-user', user);
    task.setAttribute('data-type', title);
    task.innerHTML = `
        <strong>${title}</strong>
        <p>${desc}</p>
        <span class="task-user"><img src="${userImage}" alt="${user}" style="width: 35px; height: 35px; border-radius: 50%;"> ${user}</span>
        <button class="delete" onclick="deleteTask(this)">X</button>
        <button class="move-left" onclick="moveTask(this, -1)"><</button>
        <button class="move-right" onclick="moveTask(this, 1)">></button>
        <button class="edit" onclick="editTask(this)">Editar</button>
    `;

    column.querySelector('.tasks').appendChild(task);
}


function editTask(button) {
    const task = button.parentElement;
    const desc = task.querySelector('p').innerText;
    const user = task.querySelector('.task-user').innerText.trim();
    const type = task.getAttribute('data-type');

    task.innerHTML = `
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
    const task = button.parentElement;
    const newDesc = task.querySelector('#edit-desc').value;
    const newUser = task.querySelector('#edit-user').value;
    const newType = task.querySelector('#edit-type').value;

    let userImage = "";
    if (newUser === "ME") {
        userImage = await fetchRickAndMortyCharacter();
    } else if (newUser === "LS") {
        userImage = await fetchRickAndMortyCharacter();
    }

    task.setAttribute('data-type', newType);
    task.innerHTML = `
        <strong>${newType}</strong>
        <p>${newDesc}</p>
        <span class="task-user"><img src="${userImage}" alt="${newUser}" style="width: 35px; height: 35px; border-radius: 50%;"> ${newUser}</span>
        <button class="delete" onclick="deleteTask(this)">X</button>
        <button class="move-left" onclick="moveTask(this, -1)"><</button>
        <button class="move-right" onclick="moveTask(this, 1)">></button>
        <button class="edit" onclick="editTask(this)">Editar</button>
    `;
}


function deleteTask(button) {
    const task = button.parentElement;
    task.remove();
}

let currentUserFilter = null;

function filterTasks(user) {
    const tasks = document.querySelectorAll('.card');
    if (currentUserFilter === user) {
        tasks.forEach(task => task.style.display = 'block');
        currentUserFilter = null;
    } else {
        tasks.forEach(task => {
            if (task.getAttribute('data-user') === user) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
        currentUserFilter = user;
    }
}


let currentFilter = null;

function filterTasksByType(type) {
    const tasks = document.querySelectorAll('.card');
    if (currentFilter === type) {
        tasks.forEach(task => task.style.display = 'block');
        currentFilter = null;
    } else {
        tasks.forEach(task => {
            if (task.getAttribute('data-type') === type) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
        currentFilter = type;
    }
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
