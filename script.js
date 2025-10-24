const STORAGE_KEY = 'clientInventoryDB'; // Key for LocalStorage
let inventory = []; // Array to hold the inventory data (our "database" table)

// --- Initial Setup and Loading ---

// 1. Load data from LocalStorage when the page loads
function loadInventory() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        inventory = JSON.parse(data);
    }
    renderInventory();
}

// 2. Save the current inventory array to LocalStorage
function saveInventory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

// --- Data Manipulation (CRUD) ---

// 3. Add a new item
function addItem(name, category, quantity) {
    const newItem = {
        id: Date.now(), // Use timestamp as a simple unique ID
        name: name,
        category: category,
        quantity: parseInt(quantity) // Ensure quantity is a number
    };
    inventory.push(newItem);
    saveInventory();
    renderInventory();
}

// --- Rendering ---

// 4. Render the inventory table
function renderInventory() {
    const listBody = document.getElementById('inventoryList');
    listBody.innerHTML = ''; // Clear existing rows

    inventory.forEach(item => {
        const row = listBody.insertRow();

        // Cells for each column
        row.insertCell().textContent = item.id;
        row.insertCell().textContent = item.name;
        row.insertCell().textContent = item.category;
        row.insertCell().textContent = item.quantity;
    });
}

// --- Event Handlers ---

// 5. Handle form submission
document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the form from refreshing the page

    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('category').value.trim();
    const quantity = document.getElementById('quantity').value;

    if (name && category && quantity) {
        addItem(name, category, quantity);

        // Clear the form fields
        document.getElementById('addItemForm').reset();
    } else {
        alert('Please fill in all fields.');
    }
});

// Load the data when the script starts
loadInventory();