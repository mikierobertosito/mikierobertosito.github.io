// =========================================================================
// !!! ASSICURATI CHE QUESTE VARIABILI SIANO IDENTICHE A QUELLE IN shop_inventory.js !!!
// =========================================================================

const INVENTORY_KEY = 'shopInventory';

const INITIAL_INVENTORY = {
    '1': { name: 'Tazza da Viaggio Esclusiva', price: 24.99, quantity: 12 },
    '2': { name: 'Kit Lenti Wide-Angle (V2)', price: 49.99, quantity: 0 }, 
    '3': { name: 'E-book: Le Ricette di Miki', price: 9.99, quantity: 999 },
};

function getInventory() {
    const savedInventory = localStorage.getItem(INVENTORY_KEY);
    if (savedInventory) {
        return JSON.parse(savedInventory);
    }
    saveInventory(INITIAL_INVENTORY);
    return INITIAL_INVENTORY;
}

function saveInventory(inventory) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

// =========================================================================
// LOGICA SPECIFICA DELL'ADMIN
// =========================================================================

function renderInventoryList() {
    const inventory = getInventory();
    const listContainer = document.getElementById('inventory-list');
    listContainer.innerHTML = ''; // Pulisci la lista

    for (const id in inventory) {
        const item = inventory[id];
        
        // Crea l'elemento HTML per ogni prodotto
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.innerHTML = `
            <h4>${item.name} (ID: ${id})</h4>
            <div class="inventory-controls">
                <label for="qty-${id}">Quantità:</label>
                <input type="number" id="qty-${id}" value="${item.quantity}" min="0" data-product-id="${id}">
                <button class="btn btn-primary save-btn" data-product-id="${id}">Salva</button>
            </div>
        `;
        listContainer.appendChild(itemDiv);
    }
    
    // Aggiungi gli ascoltatori per il click su ogni pulsante "Salva"
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', handleSaveClick);
    });
}

function handleSaveClick(event) {
    const button = event.target;
    const productId = button.getAttribute('data-product-id');
    const inputField = document.getElementById(`qty-${productId}`);
    
    // Leggi il nuovo valore, assicurati che sia un numero intero non negativo
    const newQuantity = parseInt(inputField.value, 10);
    
    if (isNaN(newQuantity) || newQuantity < 0) {
        alert("Inserisci una quantità valida (numero intero non negativo).");
        return;
    }
    
    // Aggiorna l'inventario in localStorage
    const currentInventory = getInventory();
    if (currentInventory[productId]) {
        currentInventory[productId].quantity = newQuantity;
        saveInventory(currentInventory);
        
        // Mostra il messaggio di successo
        showStatusMessage("Inventario salvato con successo!");
        
        // Aggiorna il testo del pulsante brevemente
        button.textContent = 'Salvato!';
        setTimeout(() => {
            button.textContent = 'Salva';
        }, 1500);
        
    } else {
        alert("Errore: Prodotto non trovato nell'inventario.");
    }
}

function showStatusMessage(message) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    // Nascondi il messaggio dopo 3 secondi
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// Avvia il caricamento della lista all'apertura della pagina
document.addEventListener('DOMContentLoaded', renderInventoryList);
