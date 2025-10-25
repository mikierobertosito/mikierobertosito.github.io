// shop_inventory.js (Più leggero e focalizzato)

// NON CI SONO PIÙ LE DEFINIZIONI getInventory/saveInventory qui, 
// sono nel file inventory_core.js

/**
 * Aggiorna la disponibilità dei prodotti sulla pagina HTML.
 */
function updateProductDisplay() {
    // ... (Il resto della funzione updateProductDisplay) ...
    const currentInventory = getInventory(); // Chiamata al core
    // ... (logica come prima) ...
}

/**
 * Gestisce l'ordine: decrementa l'inventario e informa l'utente.
 */
function placeOrder(productId) {
    // ... (logica come prima) ...
    
    // Genera il messaggio WhatsApp (usa la variabile globale dal core)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // ... (resto della logica) ...
}

// Esecuzione immediata per velocizzare la visualizzazione!
updateProductDisplay();
