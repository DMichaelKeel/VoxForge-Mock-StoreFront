/**
 * VoxForge Gaming Storefront & Rig Configurator
 * Master-Grade Static Application Logic
 */

'use strict';

/* ==========================================================================
   1. Central Hardware Database (Single Source of Truth)
   ========================================================================== */
const HARDWARE_CATALOG = [
  // Processors
  {
    id: 'cpu-ryzen-9-7950x',
    name: 'AMD Ryzen 9 7950X',
    category: 'cpu',
    price: 549.00,
    socket: 'AM5',
    tdp: 170,
    specs: '16 Cores, 32 Threads, 5.7 GHz Boost',
    img: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cpu-intel-i9-14900k',
    name: 'Intel Core i9-14900K',
    category: 'cpu',
    price: 589.00,
    socket: 'LGA1700',
    tdp: 253,
    specs: '24 Cores, 32 Threads, 6.0 GHz Max',
    img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80'
  },

  // Motherboards
  {
    id: 'mobo-asus-x670e',
    name: 'ASUS ROG Crosshair X670E Hero',
    category: 'mobo',
    price: 499.00,
    socket: 'AM5',
    tdp: 50,
    specs: 'PCIe 5.0, DDR5, Wi-Fi 6E, USB4',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mobo-msi-z790',
    name: 'MSI MPG Z790 Carbon WiFi',
    category: 'mobo',
    price: 379.00,
    socket: 'LGA1700',
    tdp: 50,
    specs: 'PCIe 5.0, DDR5 Ready, 19+1+1 Phases',
    img: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80'
  },

  // Graphics Cards
  {
    id: 'gpu-rtx-4090',
    name: 'NVIDIA GeForce RTX 4090 24GB',
    category: 'gpu',
    price: 1599.00,
    tdp: 450,
    specs: 'Ada Lovelace, 24GB GDDR6X, DLSS 3.5',
    img: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'gpu-rx-7900xtx',
    name: 'AMD Radeon RX 7900 XTX 24GB',
    category: 'gpu',
    price: 949.00,
    tdp: 355,
    specs: 'RDNA 3 Chiplet, 24GB GDDR6, FSR 3',
    img: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80'
  },

  // Memory
  {
    id: 'ram-corsair-ddr5',
    name: 'Corsair Dominator Titanium 32GB DDR5',
    category: 'ram',
    price: 189.00,
    tdp: 15,
    specs: '6000MHz CL30, Intel XMP & AMD EXPO',
    img: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80'
  },

  // Peripherals & Displays
  {
    id: 'mech-keyboard-razer',
    name: 'Razer Huntsman V3 Pro Analog',
    category: 'peripherals',
    price: 249.00,
    tdp: 5,
    specs: 'Gen-2 Analog Optical Switches, Rapid Trigger',
    img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mouse-steelseries',
    name: 'SteelSeries Aerox 5 Wireless',
    category: 'peripherals',
    price: 139.00,
    tdp: 0,
    specs: '74g Ultra Lightweight, TrueMove Air Sensor',
    img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'monitor-curved-4k',
    name: 'VoxForge UltraCurve 34" OLED',
    category: 'displays',
    price: 899.00,
    tdp: 65,
    specs: '0.03ms Response, 175Hz, Quantum Dot OLED',
    img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80'
  }
];

/* Curated Cross-Sell Recommendation Rules */
const COMPLEMENTARY_RULES = [
  {
    triggerCategory: 'gpu',
    suggestId: 'monitor-curved-4k',
    reason: 'Take full advantage of your graphics card with 175Hz Quantum Dot OLED.'
  },
  {
    triggerCategory: 'peripherals',
    suggestId: 'mouse-steelseries',
    reason: 'Sync your battle station setup with competitive ultra-low latency peripherals.'
  },
  {
    triggerCategory: 'cpu',
    suggestId: 'ram-corsair-ddr5',
    reason: 'Unlock optimal memory bandwidth with paired low-latency DDR5 modules.'
  }
];

/* ==========================================================================
   2. State Management & Storage Resilience (Supports file:// protocol)
   ========================================================================== */
class StoreState {
  constructor() {
    this.cartKey = 'voxforge_cached_cart';
    this.memoryFallback = [];
    this.isStorageAvailable = this.checkStorage();
    this.cart = this.loadCart();
  }

  checkStorage() {
    try {
      const testKey = '__test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('LocalStorage unavailable on file:// origin. Operating in resilient session memory.');
      return false;
    }
  }

  loadCart() {
    if (this.isStorageAvailable) {
      try {
        const raw = window.localStorage.getItem(this.cartKey);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }
    return this.memoryFallback;
  }

  saveCart() {
    if (this.isStorageAvailable) {
      try {
        window.localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
      } catch (e) {
        console.warn('Failed writing to localStorage');
      }
    } else {
      this.memoryFallback = this.cart;
    }
  }

  addItem(productId, quantity = 1) {
    const item = HARDWARE_CATALOG.find(p => p.id === productId);
    if (!item) return;

    const existing = this.cart.find(c => c.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ id: item.id, quantity });
    }
    this.saveCart();
  }

  updateQuantity(productId, delta) {
    const index = this.cart.findIndex(c => c.id === productId);
    if (index === -1) return;

    this.cart[index].quantity += delta;
    if (this.cart[index].quantity <= 0) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
  }

  removeItem(productId) {
    this.cart = this.cart.filter(c => c.id !== productId);
    this.saveCart();
  }

  clear() {
    this.cart = [];
    this.saveCart();
  }

  getTotalCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => {
      const product = HARDWARE_CATALOG.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }
}

const state = new StoreState();

/* ==========================================================================
   3. Notification UI (Toasts)
   ========================================================================== */
function showToast(message, icon = '✓') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color:var(--accent-cyan); font-weight:800;">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}

/* ==========================================================================
   4. Component Catalog Renderer & Filter
   ========================================================================== */
function renderProductGrid(filterCategory = 'all') {
  const grid = document.getElementById('demoPartsGrid');
  if (!grid) return;

  const filtered = filterCategory === 'all'
    ? HARDWARE_CATALOG
    : HARDWARE_CATALOG.filter(p => p.category === filterCategory);

  grid.innerHTML = filtered.map(product => `
    <article class="card" data-category="${product.category}">
      <div class="card-media">
        <span class="card-tag">${product.category.toUpperCase()}</span>
        <img class="product-img" 
             src="${product.img}" 
             alt="${product.name}" 
             width="400" 
             height="240" 
             loading="lazy"
             onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'240\\' viewBox=\\'0 0 400 240\\'><rect width=\\'400\\' height=\\'240\\' fill=\\'%23131d27\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%239aa4b2\\' font-family=\\'sans-serif\\' font-size=\\'14\\' text-anchor=\\'middle\\'>Hardware Visual Offline</text></svg>'">
      </div>
      <h3 class="card-title">${product.name}</h3>
      <p class="card-spec">${product.specs}</p>
      <div class="card-footer">
        <span class="price">$${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        <button type="button" class="btn btn-primary btn-sm add-cart-btn" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </article>
  `).join('');
}

function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-chip');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProductGrid(btn.dataset.filter);
    });
  });

  // Global event delegation for "Add to Cart"
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-cart-btn');
    if (btn && btn.dataset.productId) {
      const product = HARDWARE_CATALOG.find(p => p.id === btn.dataset.productId);
      state.addItem(btn.dataset.productId, 1);
      updateCartDrawer();
      showToast(`${product ? product.name : 'Component'} added to order.`);
    }
  });
}

/* ==========================================================================
   5. Interactive Rig Configurator & Compatibility Engine
   ========================================================================== */
function initRigConfigurator() {
  const selectCpu = document.getElementById('selectCpu');
  const selectMobo = document.getElementById('selectMobo');
  const selectGpu = document.getElementById('selectGpu');
  const selectRam = document.getElementById('selectRam');
  const addAllBtn = document.getElementById('addBuildToCartBtn');

  if (!selectCpu || !selectMobo || !selectGpu || !selectRam) return;

  // Populate dynamic select options
  const populate = (select, category) => {
    const items = HARDWARE_CATALOG.filter(p => p.category === category);
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = `${item.name} (+$${item.price.toFixed(0)})`;
      select.appendChild(opt);
    });
  };

  populate(selectCpu, 'cpu');
  populate(selectMobo, 'mobo');
  populate(selectGpu, 'gpu');
  populate(selectRam, 'ram');

  const recalculateRig = () => {
    const cpu = HARDWARE_CATALOG.find(p => p.id === selectCpu.value);
    const mobo = HARDWARE_CATALOG.find(p => p.id === selectMobo.value);
    const gpu = HARDWARE_CATALOG.find(p => p.id === selectGpu.value);
    const ram = HARDWARE_CATALOG.find(p => p.id === selectRam.value);

    // Update Spec Previews
    document.getElementById('cpuSpecPreview').textContent = cpu ? `${cpu.socket} | ${cpu.tdp}W TDP` : 'Select CPU';
    document.getElementById('moboSpecPreview').textContent = mobo ? `${mobo.socket} Chipset` : 'Select Motherboard';
    document.getElementById('gpuSpecPreview').textContent = gpu ? `${gpu.tdp}W TDP` : 'Select GPU';
    document.getElementById('ramSpecPreview').textContent = ram ? `${ram.specs}` : 'Select RAM';

    // Calculate Telemetry
    let totalTdp = 45; // Baseline fans, storage & chipset
    let totalPrice = 0;
    const selectedList = [cpu, mobo, gpu, ram].filter(Boolean);

    selectedList.forEach(item => {
      totalTdp += (item.tdp || 0);
      totalPrice += item.price;
    });

    const recommendedPsu = Math.ceil((totalTdp * 1.35) / 50) * 50;

    document.getElementById('telemetryTdp').textContent = `${totalTdp} W`;
    document.getElementById('telemetryPsu').textContent = `${recommendedPsu} W`;
    document.getElementById('telemetryTotal').textContent = `$${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    // Rule Verification
    const statusBox = document.getElementById('compatibilityStatus');
    statusBox.className = 'compatibility-banner';

    if (cpu && mobo) {
      if (cpu.socket === mobo.socket) {
        statusBox.classList.add('is-valid');
        statusBox.innerHTML = `
          <div class="status-indicator status-success"></div>
          <div class="status-copy">
            <strong>Architecture Verified:</strong> Socket <code>${cpu.socket}</code> properly aligns between processor and motherboard trace lines.
          </div>
        `;
      } else {
        statusBox.classList.add('is-invalid');
        statusBox.innerHTML = `
          <div class="status-indicator status-danger"></div>
          <div class="status-copy">
            <strong>Hardware Mismatch Detected:</strong> CPU uses <code>${cpu.socket}</code> but motherboard provides <code>${mobo.socket}</code>. System will not POST.
          </div>
        `;
      }
    } else {
      statusBox.innerHTML = `
        <div class="status-indicator status-idle"></div>
        <div class="status-copy">
          Select both CPU and Motherboard to verify socket compatibility.
        </div>
      `;
    }

    // Enable "Add Full Rig to Cart" if at least 2 components chosen and no mismatch
    const isMismatched = (cpu && mobo && cpu.socket !== mobo.socket);
    addAllBtn.disabled = selectedList.length < 2 || isMismatched;
  };

  [selectCpu, selectMobo, selectGpu, selectRam].forEach(el => {
    el.addEventListener('change', recalculateRig);
  });

  addAllBtn.addEventListener('click', () => {
    const selectedIds = [selectCpu.value, selectMobo.value, selectGpu.value, selectRam.value].filter(Boolean);
    selectedIds.forEach(id => state.addItem(id, 1));
    updateCartDrawer();
    openCartDrawer();
    showToast(`Added ${selectedIds.length} custom rig components to cart.`);
  });
}

/* ==========================================================================
   6. Shopping Cart Drawer Logic
   ========================================================================== */
const drawer = document.getElementById('cartDrawer');
const backdrop = document.getElementById('cartBackdrop');

function openCartDrawer() {
  if (!drawer || !backdrop) return;
  drawer.removeAttribute('hidden');
  // Trigger DOM reflow for transition
  void drawer.offsetWidth;
  drawer.classList.add('open');
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  if (!drawer || !backdrop) return;
  drawer.classList.remove('open');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (!drawer.classList.contains('open')) {
      drawer.setAttribute('hidden', '');
    }
  }, 280);
}

function updateCartDrawer() {
  const countBadge = document.getElementById('headerCartCount');
  const listEl = document.getElementById('cartItemList');
  const emptyState = document.getElementById('cartEmptyState');
  const subtotalEl = document.getElementById('cartSubtotal');
  const grandTotalEl = document.getElementById('cartGrandTotal');
  const footerEl = document.getElementById('cartFooter');

  const count = state.getTotalCount();
  if (countBadge) {
    countBadge.textContent = count;
    countBadge.setAttribute('aria-label', `${count} items in shopping cart`);
  }

  if (!listEl) return;

  if (state.cart.length === 0) {
    emptyState.style.display = 'block';
    listEl.innerHTML = '';
    footerEl.style.opacity = '0.5';
    footerEl.style.pointerEvents = 'none';
    subtotalEl.textContent = '$0.00';
    grandTotalEl.textContent = '$0.00';
    updateRecommendations();
    return;
  }

  emptyState.style.display = 'none';
  footerEl.style.opacity = '1';
  footerEl.style.pointerEvents = 'auto';

  listEl.innerHTML = state.cart.map(cartItem => {
    const product = HARDWARE_CATALOG.find(p => p.id === cartItem.id);
    if (!product) return '';
    const itemTotal = (product.price * cartItem.quantity).toFixed(2);

    return `
      <li class="cart-item">
        <img class="cart-item-thumb" src="${product.img}" alt="${product.name}" loading="lazy">
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${product.name}</h4>
            <div class="cart-item-price">$${itemTotal}</div>
          </div>
          <div class="cart-item-controls">
            <button type="button" class="qty-btn" data-action="decrement" data-id="${product.id}" aria-label="Decrease quantity">-</button>
            <span class="qty-count">${cartItem.quantity}</span>
            <button type="button" class="qty-btn" data-action="increment" data-id="${product.id}" aria-label="Increase quantity">+</button>
            <button type="button" class="cart-item-remove" data-action="remove" data-id="${product.id}">Remove</button>
          </div>
        </div>
      </li>
    `;
  }).join('');

  const subtotal = state.getSubtotal();
  subtotalEl.textContent = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  grandTotalEl.textContent = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  updateRecommendations();
}

function initCartListeners() {
  const openBtn = document.getElementById('cartOpenBtn');
  const closeBtn = document.getElementById('cartCloseBtn');
  const shopNowBtn = document.getElementById('cartShopNowBtn');
  const clearBtn = document.getElementById('clearCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (openBtn) openBtn.addEventListener('click', openCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (backdrop) backdrop.addEventListener('click', closeCartDrawer);
  if (shopNowBtn) shopNowBtn.addEventListener('click', closeCartDrawer);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeCartDrawer();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.clear();
      updateCartDrawer();
      showToast('Cache cleared.');
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      showToast('Master Build Order Confirmed! Initializing allocation.', '🚀');
      setTimeout(() => {
        state.clear();
        updateCartDrawer();
        closeCartDrawer();
      }, 1400);
    });
  }

  // Cart item increment/decrement delegation
  const listEl = document.getElementById('cartItemList');
  if (listEl) {
    listEl.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('button[data-action]');
      if (!actionBtn) return;

      const { action, id } = actionBtn.dataset;
      if (action === 'increment') state.updateQuantity(id, 1);
      if (action === 'decrement') state.updateQuantity(id, -1);
      if (action === 'remove') state.removeItem(id);
      updateCartDrawer();
    });
  }
}

/* ==========================================================================
   7. Rule-Based Dynamic Recommendations Engine
   ========================================================================== */
function updateRecommendations() {
  const shelf = document.getElementById('recItemsShelf');
  const desc = document.getElementById('recDescription');
  if (!shelf || !desc) return;

  const cartCategories = new Set(
    state.cart.map(c => {
      const prod = HARDWARE_CATALOG.find(p => p.id === c.id);
      return prod ? prod.category : null;
    }).filter(Boolean)
  );

  let suggestions = [];
  COMPLEMENTARY_RULES.forEach(rule => {
    if (cartCategories.has(rule.triggerCategory)) {
      const product = HARDWARE_CATALOG.find(p => p.id === rule.suggestId);
      const isAlreadyInCart = state.cart.some(c => c.id === rule.suggestId);
      if (product && !isAlreadyInCart) {
        suggestions.push({ product, reason: rule.reason });
      }
    }
  });

  if (suggestions.length === 0) {
    // Default Fallback
    const fallback = HARDWARE_CATALOG.find(p => p.id === 'mech-keyboard-razer');
    suggestions = [{ product: fallback, reason: 'Enthusiast-tier analog responsiveness for any modern rig.' }];
  }

  desc.textContent = suggestions[0].reason;
  shelf.innerHTML = suggestions.map(({ product }) => `
    <button type="button" class="rec-chip-btn add-cart-btn" data-product-id="${product.id}" aria-label="Add ${product.name} to order">
      <span>+ ${product.name}</span>
      <span class="rec-chip-price">$${product.price.toFixed(0)}</span>
    </button>
  `).join('');
}

/* ==========================================================================
   8. Countdown Timer & Marquee Animation Controls
   ========================================================================== */
function initFlashSaleTimer() {
  const timerDisplay = document.getElementById('flashTimer');
  const pauseBtn = document.getElementById('promoPauseBtn');
  const promoTrack = document.getElementById('promoTrack');

  // Realistic Session Countdown (4 Hours, 22 Minutes, 10 Seconds)
  let totalSeconds = (4 * 3600) + (22 * 60) + 10;

  const updateClock = () => {
    if (totalSeconds <= 0) {
      totalSeconds = 4 * 3600; // Reset loop
    }
    totalSeconds--;

    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');

    if (timerDisplay) {
      timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
    }
  };

  setInterval(updateClock, 1000);

  // Marquee pause toggle (WCAG 2.2.2 Pause, Stop, Hide compliance)
  if (pauseBtn && promoTrack) {
    pauseBtn.addEventListener('click', () => {
      const isPaused = promoTrack.style.animationPlayState === 'paused';
      promoTrack.style.animationPlayState = isPaused ? 'running' : 'paused';
      pauseBtn.setAttribute('aria-pressed', (!isPaused).toString());
      pauseBtn.textContent = isPaused ? '⏸' : '▶';
    });
  }
}

/* ==========================================================================
   9. Application Bootstrap
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderProductGrid('all');
  initCatalogFilters();
  initRigConfigurator();
  initCartListeners();
  updateCartDrawer();
  initFlashSaleTimer();
});