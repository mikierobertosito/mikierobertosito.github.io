// La chiave che useremo in localStorage per simulare la sessione
const SESSION_KEY = 'isLoggedIn';

/**
 * Funzione per simulare l'accesso (salva una "sessione" nel browser)
 */
function loginUser() {
    // Salviamo una stringa nel browser che indica che l'utente è "loggato"
    localStorage.setItem(SESSION_KEY, 'true');
    // Reindirizziamo l'utente alla pagina del profilo
    window.location.href = 'profilo.html';
}

/**
 * Funzione per simulare il logout (rimuove la "sessione")
 */
function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    // Reindirizziamo l'utente alla pagina di login
    window.location.href = 'login.html';
}

/**
 * Funzione per verificare se l'utente è "loggato"
 */
function checkAuth() {
    return localStorage.getItem(SESSION_KEY) === 'true';
}

// Aggiungi un ascoltatore per il logout se il link ha l'ID 'logout-btn'
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});
