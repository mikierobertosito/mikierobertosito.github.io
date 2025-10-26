// shop_inventory.js - VERSIONE CONSOLIDATA E OTTIMIZZATA

// =========================================================================
// VARIABILI CORE
// =========================================================================
const INVENTORY_KEY = 'shopInventory';
const WHATSAPP_NUMBER = '393201986375'; 

// Inventario iniziale (lo stato di base)
let currentInventory = {
    '1': { name: 'MYSTERY BOX di cibo', price: 10, quantity: 1 },
    '2': { name: 'Latiao', price: 10, quantity: 0 }, 
    '3': { name: 'MYSTERY BOX di cibo', price: 20, quantity: 1 },
    '4': { name: 'prime a caso', price: 15, quantity: 2 },
    '5': { name: 'monster a caso', price: 5, quantity: 2 },
    '6': { name: 'monster giapponese', price: 15, quantity: 1 },
};



// =========================================================================
// FUNZIONI DI GESTIONE INTERFACCIA (UI)
// =========================================================================

/**
 * Aggiorna la disponibilità dei prodotti sulla pagina HTML.
 */
    // 1. Legge l'inventario aggiornato
    const currentInventory = getInventory();
    
    // 2. Itera su tutte le schede prodotto nell'HTML
    document.querySelectorAll('.product-card').forEach(card => {
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
            button.textContent = 'Ordina Ora'; 

            // Assicuriamoci che l'evento sia collegato e chiami placeOrder
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
 * Gestisce l'ordine: decrementa l'inventario e informa l'utente.
 */
function placeOrder(productId) {
    const currentInventory = getInventory();
    const prodotto = currentInventory[productId];

    if (prodotto && prodotto.quantity > 0) {
        
        // 1. SIMULAZIONE: Decrementa l'inventario localmente (riserva il pezzo)
        prodotto.quantity -= 1;
        saveInventory(currentInventory);

        // 2. Aggiorna l'interfaccia UI IMMEDIATAMENTE
        updateProductDisplay();

        // 3. Genera e mostra il messaggio
        const message = `Ciao, vorrei confermare l'acquisto di 1 pezzo di *${prodotto.name}* (ID: ${productId}).`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        const istruzione = `
            Per completare l'ordine, devi contattare via WhatsApp il numero ${WHATSAPP_NUMBER}.
            L'inventario è stato aggiornato, un pezzo è riservato per te!
        `;
        
        if (confirm(istruzione + "\n\nClicca OK per aprire WhatsApp e inviare il messaggio.")) {
            window.open(whatsappUrl, '_blank');
        }

    } else {
        alert("Spiacenti, l'articolo è esaurito.");
    }
}

// =========================================================================
// ESECUZIONE (Il punto cruciale della velocità)
// =========================================================================

// Chiamiamo la funzione subito, non appena lo script viene caricato dal browser.
// Dato che il tag <script> è alla fine del <body>, l'HTML sarà già disponibile.
updateProductDisplay();
