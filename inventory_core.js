// inventory_core.js

const INVENTORY_KEY = 'shopInventory';
const WHATSAPP_NUMBER = '393201986375'; 

// Inventario iniziale (lo stato di base)
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
