// shop_inventory.js

// CHIAVE DI INVENTARIO IN LOCALSTORAGE
const INVENTORY_KEY = 'shopInventory';

// IL TUO NUMERO DI TELEFONO (con prefisso internazionale, es. Italia +39)
const WHATSAPP_NUMBER = '393201986375';

// Inventario iniziale 
const INITIAL_INVENTORY = {
    '1': { name: 'Tazza da Viaggio Esclusiva', price: 24.99, quantity: 12 },
    '2': { name: 'Kit Lenti Wide-Angle (V2)', price: 49.99, quantity: 0 }, 
    '3': { name: 'E-book: Le Ricette di Miki', price: 9.99, quantity: 999 },
    // Aggiungi qui tutti i tuoi prodotti
};

/**
 * Funzioni di base per la gestione dell'inventario (getInventory e saveInventory)
 * ... (Queste funzioni restano invariate) ...
 */
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

/**
 * Aggiorna la disponibilità dei prodotti sulla pagina HTML.
 * ... (Questa funzione resta invariata) ...
 */
function updateProductDisplay() {
    const currentInventory = getInventory();
    
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const inventoryData = currentInventory[productId];
        
        if (!inventoryData) return;

        const quantity = inventoryData.quantity;
        const availabilitySpan = card.querySelector('.availability');
        const button = card.querySelector('.btn.add-to-cart');
        
        if (quantity > 0) {
            availabilitySpan.classList.replace('sold-out', 'available');
            availabilitySpan.innerHTML = `Disponibilità: <span>${quantity}</span> pezzi`;
            
            button.classList.remove('disabled');
            button.removeAttribute('disabled');
            button.textContent = 'Ordina Ora'; 

            // Collega l'evento click alla funzione di ordine
            button.onclick = () => placeOrder(productId);
            
        } else {
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
 * Gestisce l'ordine: decrementa l'inventario e informa l'utente di contattare via WhatsApp.
 */
function placeOrder(productId) {
    const currentInventory = getInventory();
    const prodotto = currentInventory[productId];

    if (prodotto && prodotto.quantity > 0) {
        
        // 1. SIMULAZIONE: Decrementa l'inventario localmente (per riservare il pezzo)
        prodotto.quantity -= 1;
        saveInventory(currentInventory);

        // 2. Aggiorna l'interfaccia utente (UI)
        updateProductDisplay();

        // 3. Genera il messaggio WhatsApp
        const message = `Ciao, vorrei confermare l'acquisto di 1 pezzo di *${prodotto.name}* (ID: ${productId}).`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        // 4. Mostra il popup di istruzione e il link
        const istruzione = `
            Per completare l'ordine, devi contattare via WhatsApp il numero ${WHATSAPP_NUMBER}.
            L'inventario è stato aggiornato, un pezzo è riservato per te!
        `;
        
        if (confirm(istruzione + "\n\nClicca OK per aprire WhatsApp e inviare il messaggio.")) {
            // Se l'utente clicca OK, apre WhatsApp
            window.open(whatsappUrl, '_blank');
        }

    } else {
        alert("Spiacenti, l'articolo è esaurito.");
    }
}

// Inizializza la visualizzazione quando la pagina è completamente caricata
document.addEventListener('DOMContentLoaded', updateProductDisplay);
