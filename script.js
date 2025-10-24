// =======================================================================
// CONFIGURAZIONE GLOBALE e AUTENTICAZIONE
// =======================================================================

// Chiave per i file (usa localStorage per mantenere i dati nel tempo)
const STORAGE_KEY = 'clientFilesDB'; 
// Chiave per lo stato di login (usa sessionStorage per forzare il login ad ogni apertura scheda)
const IS_LOGGED_IN_KEY = 'isLoggedInSession'; 

// Credenziali Utenti
const USERS = {
    'miki': 'miki1209la',
    'roberto': 'robertomartino2'
};

// Funzione di Autenticazione (usata in index.html)
function handleLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');

        if (USERS[username] && USERS[username] === password) {
            // LOGIN OK: salva lo stato NELLA SESSIONE CORRENTE
            sessionStorage.setItem(IS_LOGGED_IN_KEY, 'true'); 
            window.location.href = 'dashboard.html';
        } else {
            // LOGIN FALLITO
            errorMessage.textContent = 'Nome utente o password non validi.';
            errorMessage.style.display = 'block';
        }
    });
}

// Funzione di Logout (usata in dashboard.html)
function handleLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (!logoutButton) return;

    logoutButton.addEventListener('click', function() {
        // Rimuovi lo stato di login dalla sessione
        sessionStorage.removeItem(IS_LOGGED_IN_KEY); 
        // Reindirizza al login
        window.location.href = 'index.html'; 
    });
}

// Controlla lo stato di autenticazione
function checkAuth(isDashboard) {
    // Legge lo stato SOLO da sessionStorage
    const isLoggedIn = sessionStorage.getItem(IS_LOGGED_IN_KEY) === 'true'; 
    
    if (isDashboard && !isLoggedIn) {
        // Se si tenta di accedere alla dashboard senza sessione attiva, reindirizza
        window.location.href = 'index.html';
    } 
}


// =======================================================================
// GESTIONE DEI DATI (DATABASE CLIENT-SIDE)
// =======================================================================

let files = []; 

// Carica i file da LocalStorage
function loadFiles() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        files = JSON.parse(data);
    }
}

// Salva i file su LocalStorage
function saveFiles() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

// Aggiunge un nuovo file (CREATE)
function addFile(name, content) {
    const newFile = {
        id: Date.now(), // ID univoco
        name: name,
        content: content
    };
    files.push(newFile);
    saveFiles();
    renderFiles();
}

// Rimuove un file per ID (DELETE)
function deleteFile(id) {
    files = files.filter(file => file.id !== id);
    saveFiles();
    renderFiles();
}

// Renderizza la tabella dei file (READ)
function renderFiles() {
    const listBody = document.getElementById('filesList');
    if (!listBody) return; 

    listBody.innerHTML = ''; 

    files.forEach(file => {
        const row = listBody.insertRow();

        row.insertCell().textContent = file.id;
        row.insertCell().textContent = file.name;
        
        // Questo è il campo "Contenuto" che mostra il testo che hai scritto
        const contentCell = row.insertCell();
        contentCell.textContent = file.content.length > 50 ? 
                                  file.content.substring(0, 50) + '...' : 
                                  file.content;

        const actionCell = row.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Elimina';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            if (confirm(`Sei sicuro di voler eliminare il file "${file.name}"?`)) {
                deleteFile(file.id);
            }
        };
        actionCell.appendChild(deleteBtn);
    });
}

// Gestisce l'invio del form di aggiunta file
function handleAddFileForm() {
    const addFileForm = document.getElementById('addFileForm');
    if (!addFileForm) return;

    addFileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const fileName = document.getElementById('fileName').value.trim();
        const fileContent = document.getElementById('fileContent').value.trim();

        if (fileName && fileContent) {
            addFile(fileName, fileContent);
            addFileForm.reset();
        } else {
            alert('Per favore, compila tutti i campi.');
        }
    });
}


// =======================================================================
// ESECUZIONE DEL CODICE
// =======================================================================

const isDashboardPage = window.location.pathname.includes('dashboard.html');

// 1. Controllo Autenticazione
checkAuth(isDashboardPage);

if (isDashboardPage) {
    // 2. Inizializzazione Dashboard
    loadFiles();
    renderFiles();
    handleAddFileForm();
    handleLogout();
    // Funzione handleFileInput (visualizzatore) è stata rimossa
} else {
    // 2. Inizializzazione Pagina di Login
    handleLogin();
}
