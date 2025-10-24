// =======================================================================
// CONFIGURAZIONE E AUTENTICAZIONE (Rimane come prima, ma è concettuale)
// =======================================================================

// L'autenticazione è ancora gestita tramite sessionStorage per la sessione corrente
const IS_LOGGED_IN_KEY = 'isLoggedInSession'; 
const USERS = { 'miki': 'miki', 'roberto': 'roberto' };

// Le funzioni handleLogin, handleLogout, checkAuth RIMANGONO INVARIATE, 
// ma la parte di checkAuth e di reindirizzamento deve essere mantenuta.
// ... (omesso per brevità, usa la versione precedente di queste funzioni) ...


// =======================================================================
// NUOVA GESTIONE DEI DATI (FIREBASE FIRESTORE)
// =======================================================================

let files = []; // Array per la visualizzazione locale

// Riferimento al database
let db; 

// Funzione di inizializzazione che chiama la tua configurazione
function initializeFirebase() {
    // Se la configurazione è avvenuta in firebase_config.js, 
    // otteniamo il riferimento al servizio Firestore
    if (typeof firebase !== 'undefined') {
        db = firebase.firestore();
        console.log("Connessione a Firestore stabilita.");
    } else {
        console.error("Firebase non è stato inizializzato. Controlla firebase_config.js");
    }
}

// 🔄 Carica i dati da Firebase e attiva il listener
function loadFiles() {
    if (!db) return;

    // Sostituiamo localStorage.getItem con una query in tempo reale
    db.collection("database_miki_international")
      .orderBy("id", "asc") // Ordina per l'ID di creazione (timestamp)
      .onSnapshot((snapshot) => {
        files = []; // Pulisci l'array locale
        snapshot.forEach((doc) => {
            // Aggiungi l'ID del documento Firestore per le operazioni di eliminazione
            files.push({ ...doc.data(), firestoreId: doc.id }); 
        });
        renderFiles(); // Renderizza i dati appena ricevuti
    }, (error) => {
        console.error("Errore nel caricamento dati da Firestore: ", error);
        alert("Impossibile caricare i dati dal server.");
    });
}

// 💾 Salva un nuovo file su Firebase (CREATE)
function addFile(name, content) {
    if (!db) return;

    const newItem = {
        id: Date.now(), // ID basato sul timestamp per l'ordinamento
        name: name,
        content: content
    };
    
    // Invia i dati al cloud
    db.collection("database_miki_international").add(newItem)
      .then(() => {
          console.log("Documento aggiunto con successo!");
          // Non c'è bisogno di chiamare renderFiles() qui, 
          // perché il listener (onSnapshot) si attiva automaticamente.
      })
      .catch((error) => {
          console.error("Errore nell'aggiunta del documento: ", error);
          alert("Errore durante il salvataggio sul cloud.");
      });
}

// 🗑️ Rimuove un file da Firebase (DELETE)
function deleteFile(firestoreId) {
    if (!db) return;
    
    // Elimina il documento usando l'ID univoco di Firestore
    db.collection("database_miki_international").doc(firestoreId).delete()
      .then(() => {
          console.log("Documento eliminato con successo!");
      })
      .catch((error) => {
          console.error("Errore nell'eliminazione del documento: ", error);
          alert("Errore durante l'eliminazione sul cloud.");
      });
}

// Modifica la funzione renderFiles per usare l'ID di Firestore per l'eliminazione
function renderFiles() {
    const listBody = document.getElementById('filesList');
    if (!listBody) return; 

    listBody.innerHTML = ''; 

    files.forEach(file => {
        const row = listBody.insertRow();

        // Mostra l'ID del timestamp (o firestoreId, a tua scelta)
        row.insertCell().textContent = file.id; 
        row.insertCell().textContent = file.name;
        
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
                // CHIAMATA AL DELETE con l'ID di Firestore
                deleteFile(file.firestoreId);
            }
        };
        actionCell.appendChild(deleteBtn);
    });
}

// ... handleAddFileForm RIMANE INVARIATA (chiama addFile) ...
// ... checkAuth, handleLogin, handleLogout RIMANGONO INVARIATE ...

// =======================================================================
// ESECUZIONE DEL CODICE
// =======================================================================

const isDashboardPage = window.location.pathname.includes('dashboard.html');

checkAuth(isDashboardPage);

if (isDashboardPage) {
    // 1. Inizializza la connessione al database
    initializeFirebase(); 
    
    // 2. Carica i dati dal cloud (attiva il listener in tempo reale)
    loadFiles(); 
    
    // 3. Logica dell'interfaccia
    handleAddFileForm();
    handleLogout();
} else {
    handleLogin();
}
