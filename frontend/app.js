// URL de l'API
const API_URL = 'https://todo-app-revision-1mt79wbgl-jahfidea-5222s-projects.vercel.app/api/todos';

// Charger les todos au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
});

// Charger tous les todos
async function loadTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error('Erreur:', error);
        showError('Impossible de charger les tâches. Vérifiez que le serveur est démarré.');
    }
}

// Afficher les todos
function displayTodos(todos) {
    const todoList = document.getElementById('todoList');
    
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">🎉 Aucune tâche ! Profitez-en !</div>';
        return;
    }
    
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.innerHTML = `
            <input type="checkbox" 
                   class="todo-checkbox" 
                   ${todo.completed ? 'checked' : ''}
                   onchange="toggleTodo(${todo.id}, ${!todo.completed})">
            <span class="todo-text">${escapeHtml(todo.title)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Supprimer</button>
        `;
        todoList.appendChild(todoItem);
    });
}

// Ajouter un todo
async function addTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();
    
    if (!title) {
        alert('⚠️ Veuillez entrer une tâche');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            input.value = '';
            loadTodos();
        } else {
            showError('Erreur lors de l\'ajout de la tâche');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Impossible d\'ajouter la tâche');
    }
}

// Basculer l'état d'un todo
async function toggleTodo(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        
        if (response.ok) {
            loadTodos();
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Impossible de modifier la tâche');
    }
}

// Supprimer un todo
async function deleteTodo(id) {
    if (!confirm('❓ Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok || response.status === 204) {
            loadTodos();
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Impossible de supprimer la tâche');
    }
}

// Permettre d'ajouter avec Enter
document.getElementById('todoInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Fonction utilitaire pour échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Afficher une erreur
function showError(message) {
    alert('❌ ' + message);
}