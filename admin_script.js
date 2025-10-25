// admin_script.js

// =========================================================================
// FUNZIONI CORE INVENTARIO (Devono essere identiche in shop_inventory.js)
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
    listContainer.innerHTML = ''; 

    // Mappa gli ID in un array, poi ordinali (opzionale)
    const productIds = Object.keys(inventory).sort(); 

    productIds.forEach(id => {
        const item = inventory[id];
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.innerHTML = `
            <div class="product-info-admin">
                <input type="text" id="name-${id}" value="${item.name}" data-product-id="${id}" class="product-name-input">
                <small>ID: ${id} | Prezzo: ${item.price} €</small>
            </div>
            <div class="inventory-controls">
                <label for="qty-${id}">Qtà:</label>
                <input type="number" id="qty-${id}" value="${item.quantity}" min="0" data-product-id="${id}">
                <button class="btn btn-primary save-btn" data-product-id="${id}">Salva Modifiche</button>
                <button class="delete-btn" data-product-id="${id}">Elimina</button>
            </div>
        `;
        listContainer.appendChild(itemDiv);
    });
    
    // Aggiungi gli ascoltatori
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', handleSaveClick);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteClick);
    });
}

/**
 * Gestisce il salvataggio della Quantità e del Nome.
 */
function handleSaveClick(event) {
    const productId = event.target.getAttribute('data-product-id');
    const quantityInput = document.getElementById(`qty-${productId}`);
    const nameInput = document.getElementById(`name-${productId}`);
    
    const newQuantity = parseInt(quantityInput.value, 10);
    const newName = nameInput.value.trim();
    
    if (isNaN(newQuantity) || newQuantity < 0 || newName === '') {
        showStatusMessage("Errore: Dati non validi.", 'red');
        return;
    }
    
    const currentInventory = getInventory();
    if (currentInventory[productId]) {
        currentInventory[productId].quantity = newQuantity;
        currentInventory[productId].name = newName; // Salva il nuovo nome
        saveInventory(currentInventory);
        
        showStatusMessage(`Prodotto "${newName}" (ID: ${productId}) salvato con successo!`, 'green');
    }
}

/**
 * Gestisce l'eliminazione di un prodotto.
 */
function handleDeleteClick(event) {
    const productId = event.target.getAttribute('data-product-id');
    
    if (confirm(`Sei sicuro di voler eliminare il prodotto ID ${productId}?`)) {
        const currentInventory = getInventory();
        
        // delete è un operatore JavaScript nativo per rimuovere proprietà dagli oggetti
        delete currentInventory[productId]; 
        
        saveInventory(currentInventory);
        renderInventoryList(); // Ricarica la lista per rimuovere l'elemento dall'interfaccia
        showStatusMessage(`Prodotto ID ${productId} eliminato con successo.`, 'orange');
    }
}

/**
 * Gestisce l'aggiunta di un nuovo prodotto.
 */
function handleAddProduct() {
    const nameInput = document.getElementById('new-name');
    const priceInput = document.getElementById('new-price');
    const quantityInput = document.getElementById('new-quantity');
    
    const newName = nameInput.value.trim();
    const newPrice = parseFloat(priceInput.value);
    const newQuantity = parseInt(quantityInput.value, 10);
    
    if (newName === '' || isNaN(newPrice) || newPrice <= 0 || isNaN(newQuantity) || newQuantity < 0) {
        showStatusMessage("Errore: Riempi tutti i campi correttamente.", 'red');
        return;
    }

    const currentInventory = getInventory();
    // Genera un ID univoco usando il timestamp corrente
    const newId = Date.now().toString(); 

    currentInventory[newId] = {
        name: newName,
        price: newPrice,
        quantity: newQuantity,
        // Puoi aggiungere qui 'img': 'url_immagine_default.jpg'
    };

    saveInventory(currentInventory);
    
    // Pulisci il modulo dopo l'aggiunta
    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = 1;
    
    renderInventoryList(); // Ricarica la lista
    showStatusMessage(`Nuovo prodotto "${newName}" (ID: ${newId}) aggiunto con successo!`, 'green');
}

function showStatusMessage(message, color) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.style.borderColor = color;
    statusDiv.style.color = color;
    statusDiv.style.backgroundColor = color === 'red' ? '#ffebeb' : '#eafaea';
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 4000);
}

// Inizializza
document.addEventListener('DOMContentLoaded', () => {
    renderInventoryList();
    document.getElementById('add-btn').addEventListener('click', handleAddProduct);
});
