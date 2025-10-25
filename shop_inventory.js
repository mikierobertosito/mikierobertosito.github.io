// shop_inventory.js

// CHIAVE DI INVENTARIO IN LOCALSTORAGE
const INVENTORY_KEY = 'shopInventory';

// Inventario iniziale (lo stato di base in caso di primo accesso o reset)
const INITIAL_INVENTORY = {
    '1': { name: 'Tazza da Viaggio Esclusiva', price: 24.99, quantity: 12 },
    '2': { name: 'Kit Lenti Wide-Angle (V2)', price: 49.99, quantity: 0 }, 
    '3': { name: 'E-book: Le Ricette di Miki', price: 9.99, quantity: 999 },
    // Aggiungi qui tutti i tuoi prodotti
};

/**
 * Carica l'inventario da localStorage o lo inizializza.
 */
function getInventory() {
    const savedInventory = localStorage.getItem(INVENTORY_KEY);
    if (savedInventory) {
        return JSON.parse(savedInventory);
    }
    // Salva l'inventario iniziale e restituiscilo
    saveInventory(INITIAL_INVENTORY);
    return INITIAL_INVENTORY;
}

/**
 * Salva lo stato corrente dell'inventario in localStorage.
 */
function saveInventory(inventory) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

/**
 * Aggiorna la disponibilità dei prodotti sulla pagina HTML.
 */
function updateProductDisplay() {
    const currentInventory = getInventory();
    
    document.querySelectorAll('.product-card').forEach(card => {
        // L'ID del prodotto è letto dal data-product-id nell'HTML
        const productId = card.getAttribute('data-product-id');
        const inventoryData = currentInventory[productId];
        
        if (!inventoryData) return;

        const quantity = inventoryData.quantity;
        const availabilitySpan = card.querySelector('.availability');
        const button = card.querySelector('.btn.add-to-cart');
        
        if (quantity > 0) {
            // Prodotto Disponibile
            availabilitySpan.classList.replace('sold-out', 'available');
            availabilitySpan.innerHTML = `Disponibilità: <span>${quantity}</span> pezzi`;
            
            button.classList.remove('disabled');
            button.removeAttribute('disabled');
            button.textContent = 'Ordina Ora'; // Testo generico

            // Collega l'evento click alla funzione di ordine (con simulazione di inventario)
            button.onclick = () => placeOrder(productId);
            
        } else {
            // Prodotto Esaurito
            availabilitySpan.classList.replace('available', 'sold-out');
            availabilitySpan.textContent = 'Esaurito';
            
            button.classList.add('disabled');
            button.setAttribute('disabled', 'disabled');
            button.textContent = 'Esaurito';
            button.onclick = null;
        }
    });
}

/**
 * Simula il processo di "ordine": decrementa l'inventario e chiede contatto manuale.
 */
function placeOrder(productId) {
    const currentInventory = getInventory();
    const prodotto = currentInventory[productId];

    if (prodotto && prodotto.quantity > 0) {
        
        // 1. SIMULAZIONE: Decrementa l'inventario localmente
        prodotto.quantity -= 1;
        saveInventory(currentInventory);

        // 2. Aggiorna l'interfaccia utente (UI)
        updateProductDisplay();

        // 3. Feedback e reindirizzamento (simula l'inoltro dell'ordine)
        alert(`Il tuo ordine per ${prodotto.name} è stato registrato (simulazione). Ti preghiamo di contattare l'assistenza per finalizzare l'acquisto. La disponibilità sul sito è stata aggiornata: ${prodotto.quantity} rimanenti.`);
        
        // Simula il reindirizzamento alla pagina di contatto/checkout manuale
        // window.location.href = 'pagina_contatto.html?prodotto=' + productId; 
        
    } else {
        alert("Spiacenti, l'articolo è esaurito.");
    }
}

// Inizializza la visualizzazione quando la pagina è completamente caricata
document.addEventListener('DOMContentLoaded', updateProductDisplay);
