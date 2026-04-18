const SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : window.location.origin;
const API_BASE = `${SERVER_URL}/api`;
let allMenuItems = [];

// Check if user is logged in
if (!localStorage.getItem('isAdminLoggedIn')) {
  window.location.href = 'admin.html';
}

// Section Switching
function switchSection(section) {
  const menuSec = document.getElementById('menuSection');
  const ordersSec = document.getElementById('ordersSection');
  const menuBtn = document.getElementById('showMenuBtn');
  const ordersBtn = document.getElementById('showOrdersBtn');

  if (section === 'menu') {
    menuSec.style.display = 'grid';
    ordersSec.style.display = 'none';
    menuBtn.classList.add('active');
    ordersBtn.classList.remove('active');
    loadMenuItems();
  } else {
    menuSec.style.display = 'none';
    ordersSec.style.display = 'block';
    menuBtn.classList.remove('active');
    ordersBtn.classList.add('active');
    
    // Default to today's date if not already set, to ensure we only see specific date orders
    const dateInput = document.getElementById('orderDate');
    if (dateInput && !dateInput.value) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
    }
    
    loadOrders();
  }
}

// Initial setup for date picker
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('orderDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
});

// Logout button
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'admin.html';
  });
}

// --- MENU MANAGEMENT ---

// Load menu items on page load
loadMenuItems();

async function loadMenuItems() {
  try {
    const response = await fetch(`${API_BASE}/menu/admin/all`, {
      method: 'GET',
      headers: {
        'x-admin-auth': 'true'
      }
    });

    const result = await response.json();

    if (result.success) {
      allMenuItems = result.data;
      displayMenuItems(result.data);
    } else {
      document.getElementById('adminMenuList').innerHTML = `<p style="text-align: center; color: var(--danger); padding: 40px;">Failed to load menu items</p>`;
    }
  } catch (error) {
    document.getElementById('adminMenuList').innerHTML = `<p style="text-align: center; color: var(--danger); padding: 40px;">Error connecting to server</p>`;
  }
}

function displayMenuItems(items) {
  const container = document.getElementById('adminMenuList');
  
  if (items.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">No dishes in your menu yet.</p>';
    return;
  }

  container.innerHTML = items.map((item, index) => `
    <div class="admin-item-card reveal" style="animation-delay: ${index * 0.05}s">
      <img src="${item.image_path ? SERVER_URL + item.image_path : 'https://via.placeholder.com/100?text=Dish'}" 
           onerror="this.src='https://via.placeholder.com/100?text=Dish'" 
           alt="${item.item_name}" class="admin-item-thumb" />
      <div class="admin-item-info">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
          <h3 style="margin:0;">${item.item_name}</h3>
          <span style="font-size: 0.75rem; padding: 2px 10px; border-radius: 6px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; 
            ${item.category === 'Non-Veg' ? 'background: rgba(239, 68, 68, 0.15); color: #fca5a5;' : 
              item.category === 'Veg' ? 'background: rgba(16, 185, 129, 0.15); color: #6ee7b7;' : 
              item.category === 'Desserts' ? 'background: rgba(167, 139, 250, 0.15); color: #c4b5fd;' : 
              item.category === 'Ice Cream' ? 'background: rgba(244, 114, 182, 0.15); color: #fbcfe8;' : 
              item.category === 'Fresh Juice' ? 'background: rgba(251, 191, 36, 0.15); color: #fde68a;' : 
              'background: rgba(59, 130, 246, 0.15); color: #93c5fd;'}">
            ${item.category}
          </span>
          ${Number(item.is_special) === 1 ? '<span style="font-size: 0.75rem; padding: 2px 10px; border-radius: 6px; background: rgba(212, 93, 38, 0.2); color: #fb923c; font-weight: 800;">SPECIAL</span>' : ''}
        </div>
        <p style="margin: 0 0 10px 0; font-size: 0.85rem; color: var(--text-muted);">${item.description || 'No description'}</p>
        <div style="font-weight: 700; color: var(--primary);">₹${item.price}</div>
      </div>
      <div class="admin-item-actions">
        <button class="small-btn edit-btn" onclick="editItem(${item.id})">Edit</button>
        <button class="small-btn delete-btn" onclick="deleteItem(${item.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Add new item form
if (document.getElementById('addItemForm')) {
  document.getElementById('addItemForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('item_name', document.getElementById('itemName').value.trim());
    formData.append('description', document.getElementById('description').value.trim());
    formData.append('price', parseFloat(document.getElementById('price').value));
    formData.append('category', document.getElementById('category').value);
    formData.append('is_special', document.getElementById('isSpecial').checked);
    formData.append('is_available', document.getElementById('isAvailable').checked);
    
    const imageFile = document.getElementById('itemImage').files[0];
    if (imageFile) formData.append('image', imageFile);

    try {
      const response = await fetch(`${API_BASE}/menu`, {
        method: 'POST',
        headers: { 'x-admin-auth': 'true' },
        body: formData
      });

      const result = await response.json();
      const statusMsg = document.getElementById('statusMessage');

      if (result.success) {
        statusMsg.textContent = 'Item added successfully!';
        statusMsg.style.color = 'var(--success)';
        document.getElementById('addItemForm').reset();
        loadMenuItems();
      } else {
        statusMsg.textContent = result.message || 'Failed to add item';
        statusMsg.style.color = 'var(--danger)';
      }
    } catch (error) {
      document.getElementById('statusMessage').textContent = 'Server connection error';
      document.getElementById('statusMessage').style.color = 'var(--danger)';
    }
  });
}

// --- ORDER MANAGEMENT ---

async function loadOrders() {
  const container = document.getElementById('adminOrdersList');
  const orderDate = document.getElementById('orderDate') ? document.getElementById('orderDate').value : '';
  
  let url = `${API_BASE}/orders/admin/all`;
  if (orderDate) {
    // Treat a single date as a range of one day
    url += `?startDate=${orderDate}&endDate=${orderDate}`;
  }

  try {
    const response = await fetch(url, {
      headers: { 'x-admin-auth': 'true' }
    });
    const result = await response.json();

    if (result.success) {
      displayOrders(result.data);
    } else {
      container.innerHTML = `<p style="text-align: center; color: var(--danger); padding: 40px;">${result.message || 'Failed to load orders'}</p>`;
    }
  } catch (error) {
    container.innerHTML = `<p style="text-align: center; color: var(--danger); padding: 40px;">Error connecting to server</p>`;
  }
}

function clearDateFilter() {
  if (document.getElementById('orderDate')) document.getElementById('orderDate').value = '';
  loadOrders();
}

function displayOrders(orders) {
  const container = document.getElementById('adminOrdersList');
  
  if (orders.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">No orders found.</p>';
    return;
  }

  container.innerHTML = orders.map((order, index) => {
    const date = new Date(order.created_at).toLocaleString();
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const tableNum = String(order.table_number).replace(/\D/g, '') || order.table_number;

    return `
      <div class="admin-item-card reveal order-card-refined" style="animation-delay: ${index * 0.05}s;">
        <!-- Card Header -->
        <div class="order-card-header">
          <div style="display: flex; align-items: center; gap: 18px;">
            <div class="table-badge ${order.order_type === 'Parcel' ? 'parcel-badge' : ''}">${order.order_type === 'Parcel' ? 'P' : tableNum}</div>
            <div class="order-meta">
              <div class="order-header-title">${order.order_type === 'Parcel' ? 'PARCEL' : 'TABLE ' + tableNum} ${order.customer_name ? '• ' + order.customer_name : ''}</div>
              <div class="order-id-label">Order #${order.id} • ${date}</div>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 15px;">
            <div class="status-dropdown-container">
              <div class="status-badge ${order.status.toLowerCase()}" onclick="toggleStatusDropdown(${order.id}, event)">
                <span class="status-dot dot-${order.status.toLowerCase()}"></span>
                ${order.status}
              </div>
              <div id="status-menu-${order.id}" class="status-dropdown-menu">
                <div class="status-option" onclick="selectOrderStatus(${order.id}, 'Pending')">
                  <span class="status-dot dot-pending"></span> Pending
                </div>
                <div class="status-option" onclick="selectOrderStatus(${order.id}, 'Processing')">
                  <span class="status-dot dot-processing"></span> Processing
                </div>
                <div class="status-option" onclick="selectOrderStatus(${order.id}, 'Completed')">
                  <span class="status-dot dot-completed"></span> Completed
                </div>
                <div class="status-option" onclick="selectOrderStatus(${order.id}, 'Cancelled')">
                  <span class="status-dot dot-cancelled"></span> Cancelled
                </div>
              </div>
            </div>
            <button class="add-item-badge" onclick="openQuickAdd(${order.id})" title="Add Item">
              <span>➕</span> Item
            </button>
          </div>
        </div>
        
        <!-- Card Items List -->
        <div class="order-items-container">
          <div style="padding: 10px 0;">
            ${items.map(item => `
              <div class="order-item-row">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="order-item-qty">${item.quantity}x</span>
                  <span style="font-weight: 500; color: var(--text-main);">${item.item_name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <span style="font-weight: 600; color: var(--text-muted);">₹${(item.price * item.quantity).toFixed(2)}</span>
                  <button class="remove-item-btn" onclick="removeItemFromOrder(${order.id}, ${item.order_item_id})" title="Remove Item">×</button>
                </div>
              </div>
            `).join('')}
          </div>
          
          <!-- Grand Total Bar -->
          <div class="order-total-refined">
            <span class="order-total-label">TOTAL AMOUNT DUE</span>
            <span class="order-total-value">₹${Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`${API_BASE}/orders/admin/${orderId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-auth': 'true'
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if ((await response.json()).success) {
      loadOrders(); // Refresh list to update UI
    }
  } catch (error) {
    alert('Error updating status');
  }
}

// Custom Dropdown Logic
function toggleStatusDropdown(orderId, event) {
  event.stopPropagation();
  // Close all other dropdowns
  document.querySelectorAll('.status-dropdown-menu').forEach(menu => {
    if (menu.id !== `status-menu-${orderId}`) menu.classList.remove('show');
  });
  
  const menu = document.getElementById(`status-menu-${orderId}`);
  menu.classList.toggle('show');
}

function selectOrderStatus(orderId, status) {
  updateOrderStatus(orderId, status);
  document.getElementById(`status-menu-${orderId}`).classList.remove('show');
}

// Close dropdowns when clicking outside
window.addEventListener('click', () => {
  document.querySelectorAll('.status-dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
});

// --- EDIT MODAL LOGIC ---

let currentEditingItem = null;

async function editItem(id) {
  try {
    const response = await fetch(`${API_BASE}/menu/admin/all`, {
      method: 'GET',
      headers: { 'x-admin-auth': 'true' }
    });
    const result = await response.json();

    if (result.success) {
      const item = result.data.find(i => i.id === id);
      if (item) {
        currentEditingItem = item;
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editItemName').value = item.item_name;
        document.getElementById('editDescription').value = item.description || '';
        document.getElementById('editPrice').value = item.price;
        document.getElementById('editCategory').value = item.category;
        document.getElementById('editIsSpecial').checked = Boolean(Number(item.is_special));
        document.getElementById('editIsAvailable').checked = Boolean(Number(item.is_available));
        document.getElementById('removeImage').checked = false;
        
        const previewDiv = document.getElementById('currentImagePreview');
        const imgPath = item.image_path ? (item.image_path.startsWith('http') ? item.image_path : SERVER_URL + item.image_path) : null;
        previewDiv.innerHTML = imgPath 
          ? `<img src="${imgPath}" 
                  onerror="this.src='https://via.placeholder.com/300?text=No+Image+Found'" 
                  style="max-width: 100%; max-height: 120px; object-fit: contain;" />` 
          : '<div style="color: var(--text-muted); font-size: 0.9rem; font-style: italic;">No image available</div>';
        
        const modal = document.getElementById('editModal');
        modal.style.display = 'flex';
      }
    }
  } catch (error) {
    alert('Error loading item details');
  }
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  currentEditingItem = null;
}

if (document.getElementById('editItemForm')) {
  document.getElementById('editItemForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const itemId = document.getElementById('editItemId').value;
    const formData = new FormData();
    formData.append('item_name', document.getElementById('editItemName').value.trim());
    formData.append('description', document.getElementById('editDescription').value.trim());
    formData.append('price', parseFloat(document.getElementById('editPrice').value));
    formData.append('category', document.getElementById('editCategory').value);
    formData.append('is_special', document.getElementById('editIsSpecial').checked);
    formData.append('is_available', document.getElementById('editIsAvailable').checked);
    
    if (document.getElementById('removeImage').checked) formData.append('remove_image', 'true');
    const imageFile = document.getElementById('editItemImage').files[0];
    if (imageFile) formData.append('image', imageFile);

    try {
      const response = await fetch(`${API_BASE}/menu/${itemId}`, {
        method: 'PUT',
        headers: { 'x-admin-auth': 'true' },
        body: formData
      });
      if ((await response.json()).success) {
        closeEditModal();
        loadMenuItems();
      }
    } catch (error) {
      alert('Error updating item');
    }
  });
}

async function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  try {
    const response = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-auth': 'true' }
    });
    if ((await response.json()).success) loadMenuItems();
  } catch (error) {
    alert('Error deleting item');
  }
}

window.onclick = function (event) {
  const editModal = document.getElementById('editModal');
  const quickModal = document.getElementById('quickAddModal');
  const takeOrderModal = document.getElementById('takeOrderModal');
  if (editModal && event.target === editModal) closeEditModal();
  if (quickModal && event.target === quickModal) closeQuickAdd();
  if (takeOrderModal && event.target === takeOrderModal) closeTakeOrderModal();
}

// --- TAKE NEW ORDER LOGIC ---
let newOrderItems = [];

function openTakeOrderModal() {
  newOrderItems = [];
  updateNewOrderUI();
  
  const select = document.getElementById('modalItemSelect');
  select.innerHTML = allMenuItems.map(item => `
    <option value="${item.id}" data-price="${item.price}" data-name="${item.item_name}">${item.item_name} - ₹${item.price}</option>
  `).join('');
  
  document.getElementById('takeOrderModal').style.display = 'flex';
}

function closeTakeOrderModal() {
  document.getElementById('takeOrderModal').style.display = 'none';
}

function toggleTableInput() {
  const type = document.getElementById('newOrderType').value;
  const group = document.getElementById('tableInputGroup');
  group.style.display = type === 'Dine-in' ? 'block' : 'none';
}

function addItemToNewOrder() {
  const select = document.getElementById('modalItemSelect');
  const qty = parseInt(document.getElementById('modalItemQty').value);
  const selectedOption = select.options[select.selectedIndex];
  
  if (!selectedOption) return;
  
  const id = parseInt(selectedOption.value);
  const name = selectedOption.dataset.name;
  const price = parseFloat(selectedOption.dataset.price);
  
  const existing = newOrderItems.find(i => i.id === id);
  if (existing) {
    existing.quantity += qty;
  } else {
    newOrderItems.push({ id, name, price, quantity: qty });
  }
  
  updateNewOrderUI();
}

function updateNewOrderUI() {
  const list = document.getElementById('newOrderItemsList');
  const totalDisplay = document.getElementById('newOrderTotal');
  
  if (newOrderItems.length === 0) {
    list.innerHTML = '<p style="text-align:center; color: var(--text-muted); font-size: 0.9rem;">No items added yet</p>';
    totalDisplay.textContent = '₹0.00';
    return;
  }
  
  let total = 0;
  list.innerHTML = newOrderItems.map((item, index) => {
    total += item.price * item.quantity;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <span>${item.quantity}x ${item.name}</span>
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="color: var(--text-muted);">₹${(item.price * item.quantity).toFixed(2)}</span>
          <button onclick="removeNewOrderItem(${index})" style="background:none; border:none; color:var(--danger); cursor:pointer;">×</button>
        </div>
      </div>
    `;
  }).join('');
  
  totalDisplay.textContent = `₹${total.toFixed(2)}`;
}

function removeNewOrderItem(index) {
  newOrderItems.splice(index, 1);
  updateNewOrderUI();
}

async function submitNewOrder() {
  if (newOrderItems.length === 0) {
    alert('Please add at least one item');
    return;
  }
  
  const type = document.getElementById('newOrderType').value;
  const table = type === 'Parcel' ? 'Parcel' : (document.getElementById('newOrderTable').value || 'TBD');
  const customer = document.getElementById('newOrderCustomer').value.trim();
  
  const total = newOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const orderData = {
    table_number: table,
    customer_name: customer,
    order_type: type,
    items: newOrderItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price
    })),
    total_amount: total
  };

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    if (result.success) {
      closeTakeOrderModal();
      switchSection('orders'); // Jump to orders page to see the new order
      loadOrders();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Server error');
  }
}

// --- QUICK ADD (ADD-ON) LOGIC ---
function openQuickAdd(orderId) {
  document.getElementById('quickAddOrderId').value = orderId;
  const select = document.getElementById('quickAddItemSelect');
  
  // Populate dropdown with menu items
  select.innerHTML = allMenuItems.map(item => `
    <option value="${item.id}">${item.item_name} - ₹${item.price}</option>
  `).join('');
  
  document.getElementById('quickAddModal').style.display = 'flex';
}

function closeQuickAdd() {
  document.getElementById('quickAddModal').style.display = 'none';
}

if (document.getElementById('quickAddForm')) {
  document.getElementById('quickAddForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const orderId = document.getElementById('quickAddOrderId').value;
    const itemId = document.getElementById('quickAddItemSelect').value;
    const qty = document.getElementById('quickAddQuantity').value;

    try {
      const response = await fetch(`${API_BASE}/orders/admin/${orderId}/add-item`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-auth': 'true'
        },
        body: JSON.stringify({ item_id: itemId, quantity: parseInt(qty) })
      });

      if ((await response.json()).success) {
        closeQuickAdd();
        loadOrders(); // Refresh list to show new total and items
      }
    } catch (error) {
      alert('Error adding item to order');
    }
  });
}

async function removeItemFromOrder(orderId, orderItemId) {
  // We use orderItemId which is safe and unique
  if (!confirm('Are you sure you want to remove this item from the order?')) return;
  
  const url = `${API_BASE}/orders/admin/remove-item/${orderItemId}`;
  console.log('Sending DELETE request to:', url);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'x-admin-auth': 'true' }
    });
    
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server responded with status ${response.status}. Details: ${text.substring(0, 100)}`);
    }

    const result = await response.json();
    if (result.success) {
      loadOrders(); // Refresh table
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    alert('DEBUG ERROR INFO:\n' + error.message + '\n\nPlease ensure the backend server is restarted.');
  }
}