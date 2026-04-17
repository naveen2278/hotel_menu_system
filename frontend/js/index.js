const SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : window.location.origin;
const API_BASE = `${SERVER_URL}/api`;
let allMenuItems = [];
let currentFilter = 'All';

async function fetchMenu() {
  try {
    const response = await fetch(`${API_BASE}/menu`);
    const result = await response.json();

    if (result.success) {
      allMenuItems = result.data;
      renderSpecialItems();
      renderMenuItems();
    } else {
      document.getElementById('menuContainer').innerHTML =
        '<div class="empty-text">Failed to load menu.</div>';
    }
  } catch (error) {
    document.getElementById('menuContainer').innerHTML =
      '<div class="empty-text">Server connection error.</div>';
  }
}

// Render special items
function renderSpecialItems() {
  const specialContainer = document.getElementById('specialItems');
  const specialItems = allMenuItems.filter(item => Number(item.is_special) === 1);

  if (specialItems.length === 0) {
    document.getElementById('specialSection').style.display = 'none';
    return;
  }

  document.getElementById('specialSection').style.display = 'block';
  specialContainer.innerHTML = specialItems.map((item, index) => createMenuCard(item, index)).join('');
}

// Render menu items based on current filter
function renderMenuItems() {
  const menuContainer = document.getElementById('menuContainer');
  let filteredItems = allMenuItems;

  if (currentFilter !== 'All') {
    filteredItems = allMenuItems.filter(item => item.category === currentFilter);
  }

  if (filteredItems.length === 0) {
    menuContainer.innerHTML = '<div class="empty-text">No menu items available.</div>';
    return;
  }

  menuContainer.innerHTML = filteredItems.map((item, index) => createMenuCard(item, index)).join('');
}

let cart = [];

function createMenuCard(item, index) {
  const isVeg = item.category === 'Veg';
  const specialClass = Number(item.is_special) === 1 ? 'special' : '';
  const imageHtml = item.image_path 
    ? `<img src="${SERVER_URL}${item.image_path}" 
            onerror="this.src='https://via.placeholder.com/400x300?text=Delicious+Dish'" 
            alt="${item.item_name}" class="menu-card-image" />` 
    : `<div style="height: 220px; background: #0b0c10; display: flex; align-items: center; justify-content: center; color: rgba(212, 93, 38, 0.5); font-size: 2rem;">🍽️</div>`;

  return `
    <div class="reveal" style="animation-delay: ${index * 0.1}s; height: 100%;">
      <div class="menu-card ${specialClass}">
        <div class="menu-card-image-wrapper">
          ${imageHtml}
          <div class="badge-row">
            <span class="badge ${item.category === 'Non-Veg' ? 'nonveg' : 'veg'}">${item.category}</span>
            ${Number(item.is_special) === 1 ? '<span class="badge special-badge">Daily Special</span>' : ''}
          </div>
        </div>
        <div class="menu-card-content">
          <h3>${item.item_name}</h3>
          <p>${item.description || 'A delicious dish prepared with fresh ingredients and traditional spices.'}</p>
          <div class="menu-card-footer">
            <p class="price">₹${Number(item.price).toFixed(2)}</p>
            <button class="primary-btn" style="width: auto; padding: 8px 16px; font-size: 0.9rem;" onclick="addToCart(${item.id})">Add +</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Cart Functions
function addToCart(itemId) {
  const item = allMenuItems.find(i => i.id === itemId);
  const existing = cart.find(i => i.id === itemId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  updateCartUI();
  // Enhance cart bounce animation
  const toggle = document.getElementById('cartToggle');
  toggle.classList.remove('bump');
  void toggle.offsetWidth; // Trigger browser reflow
  toggle.classList.add('bump');
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const toggle = document.getElementById('cartToggle');
  const countSpan = document.getElementById('cartCount');

  if (count > 0) {
    toggle.style.display = 'flex';
    countSpan.textContent = count;
  } else {
    toggle.style.display = 'none';
  }

  renderCartItems();
}

function renderCartItems() {
  const list = document.getElementById('cartItemsList');
  const totalSpan = document.getElementById('cartTotalText');
  
  if (cart.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Your cart is empty.</p>';
    totalSpan.textContent = '₹0.00';
    return;
  }

  let total = 0;
  list.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div style="flex: 1; padding-right: 15px;">
          <div style="font-weight: 600; color: var(--text-main); font-size: 1rem; margin-bottom: 2px;">${item.item_name}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">₹${item.price} &times; ${item.quantity}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="display: flex; align-items: center; background: rgba(0,0,0,0.3); padding: 4px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1);">
            <button onclick="updateQuantity(${item.id}, -1)" style="width: 28px; height: 28px; border-radius: 50%; border: none; background: #2c3e50; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 800;">&minus;</button>
            <span style="min-width: 30px; text-align: center; font-weight: 700; color: var(--text-main);">${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)" style="width: 28px; height: 28px; border-radius: 50%; border: none; background: #2c3e50; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 800;">&plus;</button>
          </div>
          <div style="width: 80px; text-align: right; font-weight: 700; color: var(--text-main); font-size: 0.95rem;">₹${itemTotal.toFixed(2)}</div>
        </div>
      </div>
    `;
  }).join('');

  totalSpan.textContent = `₹${total.toFixed(2)}`;
}

function updateQuantity(itemId, delta) {
  const index = cart.findIndex(i => i.id === itemId);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function toggleCartModal() {
  const modal = document.getElementById('cartModal');
  const isOpening = modal.style.display === 'none';
  modal.style.display = isOpening ? 'flex' : 'none';
  
  if (isOpening) renderCartItems();
}

document.getElementById('cartToggle').addEventListener('click', toggleCartModal);

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('cartModal');
  if (event.target == modal) toggleCartModal();
}

// Place Order
document.getElementById('placeOrderBtn').addEventListener('click', async () => {
  const tableNum = document.getElementById('tableNumber').value.trim();
  const statusEl = document.getElementById('orderStatus');

  if (!tableNum) {
    statusEl.textContent = 'Please enter your table number.';
    statusEl.style.color = 'var(--danger)';
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const orderData = {
    table_number: tableNum,
    total_amount: total,
    items: cart.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price
    }))
  };

  try {
    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = 'Processing...';

    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (result.success) {
      statusEl.textContent = 'Order placed successfully! Please wait.';
      statusEl.style.color = 'var(--success)';
      cart = [];
      updateCartUI();
      setTimeout(() => {
        toggleCartModal();
        statusEl.textContent = '';
        document.getElementById('tableNumber').value = '';
      }, 3000);
    } else {
      statusEl.textContent = result.message || 'Failed to place order.';
      statusEl.style.color = 'var(--danger)';
    }
  } catch (error) {
    statusEl.textContent = 'Server error. Please try again.';
    statusEl.style.color = 'var(--danger)';
  } finally {
    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = false;
    btn.textContent = 'Confirm Order';
  }
});

function setActiveFilterButton(selectedButton) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  selectedButton.classList.add('active');
}

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.getAttribute('data-filter');
    setActiveFilterButton(button);
    renderMenuItems();
  });
});

// INITIALIZE
fetchMenu();

// --- SPLASH SCREEN AUTO-HIDE (3 SECONDS) ---
window.addEventListener('load', () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      setTimeout(() => {
        splash.style.display = 'none';
      }, 1000); // Allow time for CSS transition
    }, 3000); 
  }
});