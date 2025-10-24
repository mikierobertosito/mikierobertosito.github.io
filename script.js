// =======================================================================
// CONFIGURAZIONE GLOBALE e AUTENTICAZIONE
// =======================================================================

// Chiave per i file (usa localStorage per mantenere i dati nel tempo)
const STORAGE_KEY = 'clientFilesDB'; 
// Chiave per lo stato di login (usa sessionStorage per forzare il login ad ogni apertura scheda)
const IS_LOGGED_IN_KEY = 'isLoggedInSession'; 

// Credenziali Utenti
const USERS = {
    'miki': 'miki',
    'roberto': 'roberto'
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
        
        // Contenuto: mostra solo un'anteprima
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
// GESTIONE E VISUALIZZAZIONE FILE LOCALE (FileReader API)
// =======================================================================

function handleFileInput() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput) return;

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        const imagePreview = document.getElementById('imagePreview');
        const fileContentDisplay = document.getElementById('fileContentDisplay');

        // Resetta le aree di visualizzazione
        imagePreview.style.display = 'none';
        imagePreview.src = '';
        fileContentDisplay.textContent = '';
        fileNameDisplay.textContent = file ? `File selezionato: ${file.name}` : '';

        if (!file) {
            return;
        }

        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
            // Leggi come URL dati per visualizzare l'immagine
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                fileContentDisplay.textContent = 'Tipo: Immagine - Visualizzata nell\'anteprima.';
            };
            reader.readAsDataURL(file);

        } else if (file.type.startsWith('text/')) {
            // Leggi come testo per visualizzare il contenuto completo
            reader.onload = function(e) {
                fileContentDisplay.textContent = e.target.result;
            };
            reader.readAsText(file);

        } else {
            // Gestione di altri tipi
            reader.onload = function(e) {
                fileContentDisplay.textContent = `[ATTENZIONE: File non testo/immagine (${file.type}). Non è possibile visualizzare il contenuto completo in questo contesto.]`;
            };
            // Tentiamo comunque di leggere come testo i primi byte per un riscontro rapido
            reader.readAsText(file.slice(0, 1024));
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
    handleFileInput(); // Abilita la lettura dei file locali
} else {
    // 2. Inizializzazione Pagina di Login
    handleLogin();
}