const input = document.getElementById("inp");
const addButton = document.getElementById('btn');
const clearButton = document.getElementById('clearBtn');
const taskList = document.querySelector('.task-list');
const emptyState = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');

let taskArray = [];

// Dark Mode Functions
const initDarkMode = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerText = '☀️';
        themeToggle.title = 'Toggle Light Mode';
    }
};

const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerText = '☀️';
        themeToggle.title = 'Toggle Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerText = '🌙';
        themeToggle.title = 'Toggle Dark Mode';
    }
};

themeToggle.addEventListener('click', toggleDarkMode);

const loadTasks = () => {
    const tasks = localStorage.getItem("task");
    if (tasks) {
        try {
            const parsed = JSON.parse(tasks);
            taskArray = Array.isArray(parsed) ? parsed.map(task => {
                if (typeof task === 'string') {
                    return { title: task, completed: false };
                }
                return task;
            }) : [];
            renderTasks();
        } catch (e) {
            console.error('Error loading tasks:', e);
            taskArray = [];
        }
    }
};

const renderTasks = () => {
    taskList.innerHTML = ''; 
    if (taskArray.length === 0) {
        emptyState.style.display = 'block';
        updateTaskCount();
    } else {
        emptyState.style.display = 'none';
    }
    
    taskArray.forEach((task, index) => {
        const isCompleted = task.completed || false;
        
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        if (isCompleted) {
            taskItem.classList.add('completed');
        }
        taskItem.setAttribute('data-index', index);

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-item-content');

        const checkbox = document.createElement('div');
        checkbox.classList.add('task-checkbox');
        if (isCompleted) {
            checkbox.classList.add('checked');
            checkbox.innerText = '✓';
        }
        checkbox.setAttribute('data-index', index);
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTaskCompletion(index);
        });

        const taskText = document.createElement('span');
        taskText.innerText = typeof task === 'string' ? task : task.title;
        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerText = '🗑️';
        deleteBtn.setAttribute('data-index', index);
        deleteBtn.title = 'Delete task';

        taskItem.appendChild(taskContent);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    });
    
    updateTaskCount();
};

const toggleTaskCompletion = (index) => {
    if (typeof taskArray[index] === 'string') {
        taskArray[index] = { title: taskArray[index], completed: true };
    } else {
        taskArray[index].completed = !taskArray[index].completed;
    }
    updateLocalStorage();
    renderTasks();
};

const updateTaskCount = () => {
    let countElement = document.querySelector('.task-count');
    if (taskArray.length > 0) {
        const completedCount = taskArray.filter(task => (typeof task === 'object' ? task.completed : false)).length;
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.classList.add('task-count');
            const taskListParent = taskList.parentElement;
            taskListParent.appendChild(countElement);
        }
        countElement.innerHTML = `
            <div class="task-stats">
                <div class="stat">Total: <span class="stat-number">${taskArray.length}</span></div>
                <div class="stat">Completed: <span class="stat-number">${completedCount}</span></div>
                <div class="stat">Pending: <span class="stat-number">${taskArray.length - completedCount}</span></div>
            </div>
        `;
    } else if (countElement) {
        countElement.remove();
    }
};

// Event delegation for delete button
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        deleteTask(index);
    }
});

const addTask = () => {
    const userInput = input.value.trim();
    if (userInput !== "") {
        const newTask = {
            title: userInput,
            completed: false,
            createdAt: new Date().toISOString()
        };
        taskArray.push(newTask);
        updateLocalStorage();
        renderTasks();
        input.value = "";
        input.focus();
    }
};

const deleteTask = (index) => {
    taskArray.splice(index, 1);
    updateLocalStorage();
    renderTasks();
};

const clearAllTasks = () => {
    if (taskArray.length > 0) {
        if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
            localStorage.removeItem("task");
            taskArray = [];
            renderTasks();
        }
    }
};

const updateLocalStorage = () => {
    localStorage.setItem("task", JSON.stringify(taskArray));
};

addButton.addEventListener('click', addTask);

input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

clearButton.addEventListener('click', clearAllTasks);

window.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    loadTasks();
});
