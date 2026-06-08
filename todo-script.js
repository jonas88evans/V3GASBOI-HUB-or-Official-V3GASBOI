// To-Do List Application with Local Storage

const STORAGE_KEY = 'todoList';
let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');

// Event Listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});
clearCompletedBtn.addEventListener('click', clearCompleted);
clearAllBtn.addEventListener('click', clearAll);

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        render();
    });
});

// Load todos from local storage on page load
function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    todos = stored ? JSON.parse(stored) : [];
    console.log('Loaded todos from local storage:', todos);
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    console.log('Saved todos to local storage');
}

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    if (text.length > 200) {
        alert('Task is too long! Maximum 200 characters.');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    todos.unshift(todo);
    saveTodos();
    todoInput.value = '';
    todoInput.focus();
    render();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    render();
}

// Clear all completed todos
function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }

    if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        render();
    }
}

// Clear all todos
function clearAll() {
    if (todos.length === 0) {
        alert('No tasks to delete!');
        return;
    }

    if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
        todos = [];
        saveTodos();
        render();
    }
}

// Filter todos based on current filter
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    
    totalCount.textContent = total;
    completedCount.textContent = completed;
    
    clearCompletedBtn.disabled = completed === 0;
}

// Render the todo list
function render() {
    todoList.innerHTML = '';
    const filteredTodos = getFilteredTodos();

    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${todo.completed ? 'checked' : ''} 
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        
        todoList.appendChild(li);
    });

    updateStats();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize app
window.addEventListener('load', () => {
    loadTodos();
    render();
    todoInput.focus();
    console.log('To-Do List App initialized!');
});
