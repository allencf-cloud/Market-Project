/**
 * Smart Grocery & Budget Safety Tracker (PWA)
 * Arsitektur: Mobile PWA, Ramah Jempol, Native Look & Feel
 * Fitur: F-01 (Pencatatan), F-02 (Kuantitas Otomatis), F-03 (Diskon Bertingkat),
 *        F-04 (Komparator Harga Realtime), F-05 (Pengendali Anggaran), F-06 (Riwayat & Database)
 */

(function () {
  'use strict';

  // =========================================================================
  // DEFAULT MASTER CATALOG / PREVIOUS MONTH DATASET (Untuk Demo F-04 & F-06)
  // =========================================================================
  const DEFAULT_BASELINE_CATALOG = {
    'beras ramos 5kg': { name: 'Beras Ramos 5kg', category: 'Bahan Pokok', unit: 'pack', price: 72000, month: 'September 2026' },
    'minyak goreng 2l': { name: 'Minyak Goreng 2L', category: 'Bahan Pokok', unit: 'pack', price: 34000, month: 'September 2026' },
    'telur ayam negeri': { name: 'Telur Ayam Negeri', category: 'Lauk & Protein', unit: 'kg', price: 28500, month: 'September 2026' },
    'dada ayam fillet': { name: 'Dada Ayam Fillet', category: 'Lauk & Protein', unit: 'kg', price: 46000, month: 'September 2026' },
    'sayur bayam': { name: 'Sayur Bayam', category: 'Sayur & Buah', unit: 'pack', price: 3500, month: 'September 2026' },
    'tempe mendoan': { name: 'Tempe Mendoan', category: 'Lauk & Protein', unit: 'pcs', price: 5000, month: 'September 2026' },
    'indomie goreng': { name: 'Indomie Goreng (Isi 5)', category: 'Bumbu & Instan', unit: 'pack', price: 15500, month: 'September 2026' },
    'bawang merah': { name: 'Bawang Merah', category: 'Bahan Pokok', unit: 'kg', price: 35000, month: 'September 2026' },
    'bawang putih': { name: 'Bawang Putih', category: 'Bahan Pokok', unit: 'kg', price: 38000, month: 'September 2026' },
    'susu uht 1 liter': { name: 'Susu UHT Full Cream 1L', category: 'Camilan & Minuman', unit: 'liter', price: 19500, month: 'September 2026' },
    'sabun mandi lifebuoy': { name: 'Sabun Mandi Lifebuoy (4x)', category: 'Mandi & Cuci', unit: 'pack', price: 18000, month: 'September 2026' },
    'rinso deterjen cair': { name: 'Rinso Deterjen Cair 750ml', category: 'Mandi & Cuci', unit: 'pack', price: 21500, month: 'September 2026' },
    'sunlight pencuci piring': { name: 'Sunlight Jeruk Nipis 700ml', category: 'Mandi & Cuci', unit: 'pack', price: 14000, month: 'September 2026' },
    'kopi instan kapal api': { name: 'Kopi Kapal Api Spesial Mix (10s)', category: 'Camilan & Minuman', unit: 'pack', price: 13500, month: 'September 2026' },
    'roti tawar gandum': { name: 'Roti Tawar Gandum', category: 'Camilan & Minuman', unit: 'pack', price: 16000, month: 'September 2026' }
  };

  const DEFAULT_HISTORY_PRESET = [
    {
      id: 'hist-preset-sept',
      title: 'Belanja Bulanan Kost - September 2026',
      date: '2026-09-24',
      formattedDate: '24 September 2026',
      totalSpending: 442500,
      totalSaved: 38500,
      budgetLimit: 500000,
      itemCount: 8,
      items: [
        { name: 'Beras Ramos 5kg', category: 'Bahan Pokok', unit: 'pack', qty: 1, unitPrice: 72000, disc1: 0, disc2: 0, total: 72000 },
        { name: 'Minyak Goreng 2L', category: 'Bahan Pokok', unit: 'pack', qty: 1, unitPrice: 34000, disc1: 0, disc2: 0, total: 34000 },
        { name: 'Telur Ayam Negeri', category: 'Lauk & Protein', unit: 'kg', qty: 2, unitPrice: 28500, disc1: 0, disc2: 0, total: 57000 },
        { name: 'Indomie Goreng (Isi 5)', category: 'Bumbu & Instan', unit: 'pack', qty: 3, unitPrice: 15500, disc1: 0, disc2: 0, total: 46500 },
        { name: 'Susu UHT Full Cream 1L', category: 'Camilan & Minuman', unit: 'liter', qty: 3, unitPrice: 19500, disc1: 10, disc2: 0, total: 52650 },
        { name: 'Rinso Deterjen Cair 750ml', category: 'Mandi & Cuci', unit: 'pack', qty: 2, unitPrice: 21500, disc1: 0, disc2: 0, total: 43000 },
        { name: 'Sunlight Jeruk Nipis 700ml', category: 'Mandi & Cuci', unit: 'pack', qty: 1, unitPrice: 14000, disc1: 0, disc2: 0, total: 14000 },
        { name: 'Dada Ayam Fillet', category: 'Lauk & Protein', unit: 'kg', qty: 2.5, unitPrice: 46000, disc1: 0, disc2: 0, total: 115000 }
      ]
    }
  ];

  // Category Icons & Industrial Constructivist Geometric Patterns
  const CATEGORY_MAP = {
    'Bahan Pokok': { icon: '🍚', symbol: '▣', pattern: 'pattern-staples', color: '#3A5A69', labelRu: 'ОСНОВНОЙ ПАЕК' },
    'Lauk & Protein': { icon: '🍗', symbol: '▲', pattern: 'pattern-protein', color: '#D0312D', labelRu: 'ПРОТЕИН' },
    'Sayur & Buah': { icon: '🥦', symbol: '◐', pattern: 'pattern-fresh', color: '#3A5A69', labelRu: 'СВЕЖИЕ ПРОДУКТЫ' },
    'Bumbu & Instan': { icon: '🍜', symbol: '❖', pattern: 'pattern-spices', color: '#D49B35', labelRu: 'КОНЦЕНТРАТЫ' },
    'Camilan & Minuman': { icon: '☕', symbol: '◎', pattern: 'pattern-dairy', color: '#D49B35', labelRu: 'МОЛОКО И ЧАЙ' },
    'Mandi & Cuci': { icon: '🧼', symbol: '▤', pattern: 'pattern-hygiene', color: '#3A5A69', labelRu: 'САНИТАРИЯ' },
    'Lainnya': { icon: '📦', symbol: '◈', pattern: 'pattern-general', color: '#8C8C8C', labelRu: 'ПРОЧИЕ' }
  };

  // =========================================================================
  // APPLICATION STATE
  // =========================================================================
  const State = {
    cart: [],
    budgetLimit: 500000,
    selectedCategory: 'ALL',
    history: [],
    catalog: {},
    baselineTitle: 'Belanja Rantau - Bulan Lalu (September 2026)',
    activeTab: 'tabBelanja',

    // Form Temporary State
    formState: {
      id: null,
      name: '',
      category: 'Bahan Pokok',
      unit: 'pcs',
      qty: 1,
      unitPrice: 0,
      disc1: 0,
      disc2: 0
    }
  };

  // =========================================================================
  // LOCAL STORAGE PERSISTENCE (SRS F-06)
  // =========================================================================
  const Storage = {
    load() {
      try {
        const savedCart = localStorage.getItem('sg_cart');
        const savedBudget = localStorage.getItem('sg_budget');
        const savedHistory = localStorage.getItem('sg_history');
        const savedCatalog = localStorage.getItem('sg_catalog');
        const savedBaselineTitle = localStorage.getItem('sg_baseline_title');

        if (savedCart) State.cart = JSON.parse(savedCart);
        if (savedBudget) State.budgetLimit = parseFloat(savedBudget) || 500000;
        if (savedHistory) State.history = JSON.parse(savedHistory);
        else State.history = [...DEFAULT_HISTORY_PRESET];

        if (savedCatalog) State.catalog = JSON.parse(savedCatalog);
        else State.catalog = { ...DEFAULT_BASELINE_CATALOG };

        if (savedBaselineTitle) State.baselineTitle = savedBaselineTitle;
      } catch (e) {
        console.error('Failed reading localStorage', e);
        State.history = [...DEFAULT_HISTORY_PRESET];
        State.catalog = { ...DEFAULT_BASELINE_CATALOG };
      }
    },
    save() {
      try {
        localStorage.setItem('sg_cart', JSON.stringify(State.cart));
        localStorage.setItem('sg_budget', State.budgetLimit.toString());
        localStorage.setItem('sg_history', JSON.stringify(State.history));
        localStorage.setItem('sg_catalog', JSON.stringify(State.catalog));
        localStorage.setItem('sg_baseline_title', State.baselineTitle);
      } catch (e) {
        console.error('Failed saving localStorage', e);
      }
    }
  };

  // =========================================================================
  // FORMATTERS & UTILITIES
  // =========================================================================
  function formatRp(num) {
    if (isNaN(num) || num === null || num === undefined) num = 0;
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
  }

  function sanitizeKey(str) {
    return (str || '').toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function triggerHaptic(type = 'light') {
    if ('vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(25);
      else if (type === 'warning') navigator.vibrate([60, 40, 60]);
      else if (type === 'danger') navigator.vibrate([120, 60, 120]);
    }
  }

  function showToast(message, icon = 'check-circle') {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-msg');
    const iconEl = toast.querySelector('.toast-icon');
    if (msgEl) msgEl.textContent = message;
    if (iconEl) iconEl.setAttribute('data-lucide', icon);
    if (window.lucide) lucide.createIcons();

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // =========================================================================
  // F-03: KALKULATOR DISKON BERTINGKAT ENGINE
  // P_1 = P * (1 - d1/100)
  // P_2 = P_1 * (1 - d2/100)
  // Total hemat = P - P_2
  // =========================================================================
  function calculateTieredDiscount(originalPrice, disc1 = 0, disc2 = 0) {
    const p = Math.max(0, parseFloat(originalPrice) || 0);
    const d1 = Math.min(100, Math.max(0, parseFloat(disc1) || 0));
    const d2 = Math.min(100, Math.max(0, parseFloat(disc2) || 0));

    const step1Cut = (p * d1) / 100;
    const priceAfterStep1 = p - step1Cut;

    const step2Cut = (priceAfterStep1 * d2) / 100;
    const priceFinal = Math.max(0, priceAfterStep1 - step2Cut);

    const totalDiscountAmount = p - priceFinal;
    const effectiveDiscountPercent = p > 0 ? (totalDiscountAmount / p) * 100 : 0;

    return {
      originalPrice: p,
      disc1: d1,
      disc2: d2,
      step1Cut,
      priceAfterStep1,
      step2Cut,
      priceFinal,
      totalDiscountAmount,
      effectiveDiscountPercent: Math.round(effectiveDiscountPercent * 10) / 10
    };
  }

  // =========================================================================
  // F-04: KOMPARATOR HARGA REALTIME ENGINE
  // Bandingkan harga sekarang vs bulan lalu
  // =========================================================================
  function comparePriceWithPrevious(productName, currentUnitPrice) {
    const key = sanitizeKey(productName);
    const pCurrent = parseFloat(currentUnitPrice) || 0;

    // Check exact match or partial match in catalog
    let matchedItem = State.catalog[key];
    if (!matchedItem) {
      // Find fuzzy or substring key
      const keys = Object.keys(State.catalog);
      for (const k of keys) {
        if (key.includes(k) || k.includes(key)) {
          matchedItem = State.catalog[k];
          break;
        }
      }
    }

    if (!matchedItem || !matchedItem.price) {
      return {
        status: 'NEW',
        pastPrice: null,
        diffNominal: 0,
        diffPercent: 0,
        arrow: '★',
        badgeClass: 'new-item',
        label: 'Item Baru',
        description: 'Belum ada riwayat harga bulan lalu'
      };
    }

    const pastPrice = matchedItem.price;
    const diff = pCurrent - pastPrice;

    if (diff > 0) {
      const pct = Math.round((diff / pastPrice) * 100);
      return {
        status: 'UP',
        pastPrice,
        diffNominal: diff,
        diffPercent: pct,
        arrow: '↑',
        badgeClass: 'up',
        label: `↑ +${formatRp(diff)} (+${pct}%)`,
        description: `Naik Rp ${diff.toLocaleString('id-ID')} dibanding bulan lalu (${formatRp(pastPrice)})`
      };
    } else if (diff < 0) {
      const pct = Math.round((Math.abs(diff) / pastPrice) * 100);
      return {
        status: 'DOWN',
        pastPrice,
        diffNominal: diff,
        diffPercent: pct,
        arrow: '↓',
        badgeClass: 'down',
        label: `↓ -${formatRp(Math.abs(diff))} (-${pct}%)`,
        description: `Turun Rp ${Math.abs(diff).toLocaleString('id-ID')} lebih murah dari bln lalu (${formatRp(pastPrice)})`
      };
    } else {
      return {
        status: 'EQUAL',
        pastPrice,
        diffNominal: 0,
        diffPercent: 0,
        arrow: '=',
        badgeClass: 'equal',
        label: `= Stabil`,
        description: `Harga sama persis dengan bulan lalu (${formatRp(pastPrice)})`
      };
    }
  }

  // =========================================================================
  // F-02 & F-05: PENGENDALI ANGGARAN & KALKULASI TOTAL REALTIME
  // =========================================================================
  function calculateCartTotals() {
    let totalGross = 0;
    let totalDiscountSavings = 0;
    let totalNet = 0;
    let totalItems = 0;

    const categoryBreakdown = {};

    State.cart.forEach((item) => {
      const qty = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const d1 = parseFloat(item.disc1) || 0;
      const d2 = parseFloat(item.disc2) || 0;

      const calc = calculateTieredDiscount(unitPrice, d1, d2);
      const itemSubtotal = calc.priceFinal * qty;
      const itemSaved = calc.totalDiscountAmount * qty;

      totalGross += unitPrice * qty;
      totalDiscountSavings += itemSaved;
      totalNet += itemSubtotal;
      totalItems += 1;

      // Group category
      const cat = item.category || 'Lainnya';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + itemSubtotal;
    });

    const budget = State.budgetLimit || 500000;
    const remainingBudget = budget - totalNet;
    const budgetPercent = budget > 0 ? (totalNet / budget) * 100 : 0;

    return {
      totalGross,
      totalDiscountSavings,
      totalNet,
      totalItems,
      budget,
      remainingBudget,
      budgetPercent,
      categoryBreakdown
    };
  }

  function updateBudgetSafetyUI() {
    const totals = calculateCartTotals();

    // DOM Elements
    const cardEl = document.getElementById('budgetSafetyCard');
    const statusPill = document.getElementById('budgetStatusPill');
    const statusText = document.getElementById('budgetStatusText');
    const displayBudgetLimit = document.getElementById('displayBudgetLimit');
    const displayTotalCart = document.getElementById('displayTotalCart');
    const displayRemaining = document.getElementById('displayRemainingBudget');
    const displaySaved = document.getElementById('displayTotalSaved');
    const progressFill = document.getElementById('budgetProgressFill');
    const warningAlert = document.getElementById('budgetWarningAlert');
    const warningMsg = document.getElementById('budgetAlertMessage');

    const dockTotal = document.getElementById('dockTotalAmount');
    const dockQty = document.getElementById('dockItemCount');
    const navBadge = document.getElementById('navCartBadge');

    // Values
    displayBudgetLimit.textContent = formatRp(totals.budget);
    displayTotalCart.textContent = formatRp(totals.totalNet);
    displaySaved.textContent = formatRp(totals.totalDiscountSavings);
    dockTotal.textContent = formatRp(totals.totalNet);
    dockQty.textContent = totals.totalItems;
    navBadge.textContent = totals.totalItems;

    // Remaining text & color
    if (totals.remainingBudget >= 0) {
      displayRemaining.textContent = formatRp(totals.remainingBudget);
      displayRemaining.className = 'fig-val';
    } else {
      displayRemaining.textContent = `-${formatRp(Math.abs(totals.remainingBudget))}`;
      displayRemaining.className = 'fig-val text-rose';
    }

    // Progress bar width
    const cappedPercent = Math.min(100, Math.max(0, totals.budgetPercent));
    progressFill.style.width = `${cappedPercent}%`;

    // Safety Zones Determination (SRS F-05)
    // 0 - 75%: Aman (Green)
    // 75% - 90%: Waspada (Amber)
    // > 90% & Overbudget: Kritis / Bahaya (Red)
    cardEl.classList.remove('safe', 'warning', 'danger');
    statusPill.classList.remove('pill-warning', 'pill-danger');
    progressFill.classList.remove('fill-warning', 'fill-danger');
    warningAlert.classList.add('hidden');

    if (totals.totalNet === 0) {
      cardEl.classList.add('safe');
      statusText.textContent = 'Aman';
    } else if (totals.budgetPercent <= 75) {
      cardEl.classList.add('safe');
      statusText.textContent = 'Aman';
    } else if (totals.budgetPercent <= 90) {
      cardEl.classList.add('warning');
      statusPill.classList.add('pill-warning');
      progressFill.classList.add('fill-warning');
      statusText.textContent = 'Waspada 75%+';
      warningAlert.classList.remove('hidden');
      warningMsg.textContent = `Sisa kuota tinggal ${formatRp(totals.remainingBudget)} (${Math.round(100 - totals.budgetPercent)}%). Belanja bijak!`;
    } else if (totals.budgetPercent <= 100) {
      cardEl.classList.add('danger');
      statusPill.classList.add('pill-danger');
      progressFill.classList.add('fill-danger');
      statusText.textContent = 'Kritis 90%+';
      warningAlert.classList.remove('hidden');
      warningMsg.textContent = `🚨 Peringatan Dompet: Anggaran tersisa hanya ${formatRp(totals.remainingBudget)}! Cek kembali kebutuhan mendesak.`;
      triggerHaptic('warning');
    } else {
      cardEl.classList.add('danger');
      statusPill.classList.add('pill-danger');
      progressFill.classList.add('fill-danger');
      statusText.textContent = 'Over Budget!';
      warningAlert.classList.remove('hidden');
      warningMsg.textContent = `🛑 MELEBIHI ANGGARAN sebesar ${formatRp(Math.abs(totals.remainingBudget))}! Harap kurangi barang non-pokok.`;
      triggerHaptic('danger');
    }

    // Update Category Chips Counts
    const countAllEl = document.getElementById('countAll');
    if (countAllEl) countAllEl.textContent = State.cart.length;

    // Render Spending Breakdown in Anggaran Tab
    renderCategoryBreakdown(totals);
  }

  // Render Spending Bars on Tab Anggaran
  function renderCategoryBreakdown(totals) {
    const listEl = document.getElementById('categoryBarsList');
    if (!listEl) return;

    const breakdown = totals.categoryBreakdown;
    const categories = Object.keys(CATEGORY_MAP);

    let html = '';
    let hasItems = false;

    categories.forEach((cat) => {
      const amount = breakdown[cat] || 0;
      if (amount > 0) hasItems = true;
      const pct = totals.totalNet > 0 ? Math.round((amount / totals.totalNet) * 100) : 0;
      const meta = CATEGORY_MAP[cat] || { icon: '📦', color: '#94a3b8' };

      html += `
        <div class="cat-bar-item">
          <div class="cat-bar-header">
            <span>${meta.icon} ${cat}</span>
            <span class="font-mono">${formatRp(amount)} (${pct}%)</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width: ${pct}%; background-color: ${meta.color};"></div>
          </div>
        </div>
      `;
    });

    if (!hasItems) {
      html = '<p class="text-subtle text-center py-2" style="font-size: 12px;">Keranjang troli kosong. Masukkan barang untuk melihat grafik alokasi.</p>';
    }

    listEl.innerHTML = html;
  }

  // =========================================================================
  // RENDER CART ITEMS LIST (Ramah Jempol, No Desktop Horizontal Tables!)
  // =========================================================================
  function renderCartList() {
    const container = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('emptyCartState');

    if (State.cart.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      container.innerHTML = '';
      container.appendChild(emptyState);
      updateBudgetSafetyUI();
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Filter by selected category
    const filtered = State.cart.filter((item) => {
      if (State.selectedCategory === 'ALL') return true;
      return item.category === State.selectedCategory;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state" style="padding: 24px 0;">
          <p style="color: var(--text-muted); font-size: 13px;">Tidak ada barang di kategori "${State.selectedCategory}".</p>
        </div>
      `;
      updateBudgetSafetyUI();
      return;
    }

    let itemsHtml = '';

    filtered.forEach((item, idx) => {
      const catMeta = CATEGORY_MAP[item.category] || { icon: '📦', symbol: '◈', pattern: 'pattern-general', color: '#8C8C8C', labelRu: 'ПРОЧИЕ' };
      const comp = comparePriceWithPrevious(item.name, item.unitPrice);
      const discCalc = calculateTieredDiscount(item.unitPrice, item.disc1, item.disc2);
      const itemSubtotal = discCalc.priceFinal * item.qty;
      const serialNum = (idx + 1).toString().padStart(3, '0');

      // Build Discount Badge HTML if discounted (F-03)
      let discountBadgeHtml = '';
      if (item.disc1 > 0 || item.disc2 > 0) {
        let discLabel = `${item.disc1}%`;
        if (item.disc2 > 0) discLabel += ` + ${item.disc2}%`;
        discountBadgeHtml = `
          <div class="item-discount-row">
            <span class="discount-formula-badge">
              <span class="badge-icon-sq">DIS</span>
              DISKON ${discLabel} (EFEKTIF ${discCalc.effectiveDiscountPercent}%)
            </span>
            <span class="discount-saved-val">HEMAT ${formatRp(discCalc.totalDiscountAmount * item.qty)}</span>
          </div>
        `;
      }

      itemsHtml += `
        <div class="cart-item-card ${catMeta.pattern}" data-id="${item.id}">
          <!-- Technical Rivets -->
          <span class="card-rivet r-tl"></span>
          <span class="card-rivet r-tr"></span>
          <span class="card-rivet r-bl"></span>
          <span class="card-rivet r-br"></span>

          <!-- Factory Manifest Strip -->
          <div class="card-manifest-bar">
            <span class="manifest-num">MANIFES № ${serialNum}</span>
            <span class="manifest-cat-code">${catMeta.symbol} ${catMeta.labelRu || item.category.toUpperCase()}</span>
            <span class="manifest-batch">BATCH // 26-OKT</span>
          </div>

          <!-- Top Row -->
          <div class="card-top-row">
            <div class="item-main-details">
              <div class="item-icon-avatar" title="${item.category}">
                <span class="avatar-sym">${catMeta.symbol}</span>
                <span class="avatar-icon">${catMeta.icon}</span>
              </div>
              <div class="item-headings">
                <span class="item-category-tag">${item.category}</span>
                <h4 class="item-name">${escapeHtml(item.name)}</h4>
                <div class="item-unit-pricing">
                  <span class="unit-price-val">${formatRp(discCalc.priceFinal)} / ${item.unit}</span>
                  ${discCalc.totalDiscountAmount > 0 ? `<s class="strike-original">${formatRp(item.unitPrice)}</s>` : ''}
                  
                  <!-- F-04 Realtime Price Comparison Tag -->
                  <span class="price-comparator-tag ${comp.badgeClass}" title="${comp.description}">
                    ${comp.label}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="card-mini-actions">
              <button class="mini-icon-btn btn-edit-item" data-id="${item.id}" title="Edit Item" aria-label="Edit">
                <i data-lucide="pencil"></i>
              </button>
              <button class="mini-icon-btn danger btn-delete-item" data-id="${item.id}" title="Hapus Item" aria-label="Hapus">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>

          <!-- Discount Info (F-03) -->
          ${discountBadgeHtml}

          <!-- Bottom Stepper & Subtotal Row (F-02 Realtime) -->
          <div class="card-bottom-row">
            <!-- Mobile Friendly Stepper -->
            <div class="item-card-stepper">
              <button class="stepper-btn-mini btn-card-minus" data-id="${item.id}" aria-label="Kurang">
                <i data-lucide="minus"></i>
              </button>
              <span class="stepper-value-text">${item.qty} ${item.unit}</span>
              <button class="stepper-btn-mini btn-card-plus" data-id="${item.id}" aria-label="Tambah">
                <i data-lucide="plus"></i>
              </button>
            </div>

            <!-- Total Subtotal -->
            <div class="item-calculated-total">
              <span class="calc-total-label">SUBTOTAL ITEM</span>
              <span class="calc-total-amount">${formatRp(itemSubtotal)}</span>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = itemsHtml;
    if (window.lucide) lucide.createIcons();
    updateBudgetSafetyUI();
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // F-01, F-02, F-03: MODAL ADD/EDIT ITEM BOTTOM SHEET LOGIC
  // =========================================================================
  const itemModal = {
    backdrop: document.getElementById('itemModalBackdrop'),
    sheet: document.getElementById('itemModalSheet'),
    form: document.getElementById('itemForm'),
    title: document.getElementById('sheetTitle'),

    // Inputs
    idInput: document.getElementById('formItemId'),
    nameInput: document.getElementById('formItemName'),
    catInput: document.getElementById('formCategory'),
    unitInput: document.getElementById('formUnit'),
    qtyInput: document.getElementById('formQty'),
    unitPriceInput: document.getElementById('formUnitPrice'),
    disc1Input: document.getElementById('formDisc1'),
    disc2Input: document.getElementById('formDisc2'),

    // F-04 form indicator
    compareBadge: document.getElementById('formCompareBadge'),
    compareIcon: document.getElementById('formCompareIcon'),
    compareText: document.getElementById('formCompareText'),
    pastPriceNotice: document.getElementById('formPastPriceNotice'),
    pastPriceText: document.getElementById('formPastPriceText'),

    // F-03 breakdown elements
    discountBody: document.getElementById('discountBody'),
    discSummarySub: document.getElementById('discSummarySub'),
    calcPriceOriginal: document.getElementById('calcPriceOriginal'),
    calcStep1Row: document.getElementById('calcStep1Row'),
    calcValDisc1: document.getElementById('calcValDisc1'),
    calcStep2Row: document.getElementById('calcStep2Row'),
    calcValDisc2: document.getElementById('calcValDisc2'),
    calcPriceFinalUnit: document.getElementById('calcPriceFinalUnit'),
    calcEffectiveRate: document.getElementById('calcEffectiveRate'),

    // Subtotal preview
    subtotalFormula: document.getElementById('formSubtotalFormula'),
    subtotalAmount: document.getElementById('formSubtotalAmount'),

    // Autocomplete
    suggestions: document.getElementById('itemSuggestions'),

    open(editId = null) {
      this.resetForm();
      if (editId) {
        const item = State.cart.find((it) => it.id === editId);
        if (item) {
          this.title.textContent = 'Ubah Barang di Troli';
          this.idInput.value = item.id;
          this.nameInput.value = item.name;
          this.catInput.value = item.category;
          this.unitInput.value = item.unit;
          this.qtyInput.value = item.qty;
          this.unitPriceInput.value = item.unitPrice;
          this.disc1Input.value = item.disc1 || 0;
          this.disc2Input.value = item.disc2 || 0;

          // Select chip states
          updateChipSelection('#formCategoryChips .form-chip', item.category);
          updateChipSelection('#unitSelector .unit-btn', item.unit, 'data-unit');

          // If item has discounts, expand accordion
          if (item.disc1 > 0 || item.disc2 > 0) {
            this.discountBody.classList.remove('hidden');
          }
        }
      } else {
        this.title.textContent = 'Tambah Barang ke Troli';
      }

      this.recalculateForm();
      this.backdrop.classList.add('active');
      triggerHaptic('light');

      setTimeout(() => {
        if (!editId) this.nameInput.focus();
      }, 200);
    },

    close() {
      this.backdrop.classList.remove('active');
      this.suggestions.classList.add('hidden');
    },

    resetForm() {
      this.form.reset();
      this.idInput.value = '';
      this.catInput.value = 'Bahan Pokok';
      this.unitInput.value = 'pcs';
      this.qtyInput.value = '1';
      this.unitPriceInput.value = '';
      this.disc1Input.value = '0';
      this.disc2Input.value = '0';
      updateChipSelection('#formCategoryChips .form-chip', 'Bahan Pokok');
      updateChipSelection('#unitSelector .unit-btn', 'pcs', 'data-unit');
      updateChipSelection('.disc-presets-row .disc-chip', '0', 'data-disc');
      this.discountBody.classList.add('hidden');
      this.compareBadge.className = 'compare-badge-mini hidden';
      this.pastPriceNotice.classList.add('hidden');
      this.suggestions.classList.add('hidden');
    },

    recalculateForm() {
      const name = this.nameInput.value.trim();
      const unit = this.unitInput.value || 'pcs';
      const qty = parseFloat(this.qtyInput.value) || 0;
      const unitPrice = parseFloat(this.unitPriceInput.value) || 0;
      const disc1 = parseFloat(this.disc1Input.value) || 0;
      const disc2 = parseFloat(this.disc2Input.value) || 0;

      // F-03 Tiered Calculation
      const calc = calculateTieredDiscount(unitPrice, disc1, disc2);
      const subtotal = calc.priceFinal * qty;

      // Update Breakdown Box
      this.calcPriceOriginal.textContent = formatRp(calc.originalPrice);
      this.calcValDisc1.textContent = `- ${formatRp(calc.step1Cut)}`;
      this.calcValDisc2.textContent = `- ${formatRp(calc.step2Cut)}`;
      this.calcPriceFinalUnit.textContent = formatRp(calc.priceFinal);
      this.calcEffectiveRate.textContent = `Diskon Efektif: ${calc.effectiveDiscountPercent}% (Hemat ${formatRp(calc.totalDiscountAmount)}/satuan)`;

      // Accordion Subtitle
      if (disc1 === 0 && disc2 === 0) {
        this.discSummarySub.textContent = 'Tanpa Diskon';
      } else if (disc2 > 0) {
        this.discSummarySub.textContent = `Diskon Bertingkat ${disc1}% + ${disc2}% (Hemat ${calc.effectiveDiscountPercent}%)`;
      } else {
        this.discSummarySub.textContent = `Diskon Tunggal ${disc1}%`;
      }

      // Step rows visibility
      this.calcStep1Row.style.display = disc1 > 0 ? 'flex' : 'none';
      this.calcStep2Row.style.display = disc2 > 0 ? 'flex' : 'none';

      // Subtotal Preview (F-02)
      this.subtotalFormula.textContent = `${qty} ${unit} × ${formatRp(calc.priceFinal)}`;
      this.subtotalAmount.textContent = formatRp(subtotal);

      // F-04 Realtime Price Comparison Preview in Form
      if (name && unitPrice > 0) {
        const comp = comparePriceWithPrevious(name, unitPrice);
        this.compareBadge.className = `compare-badge-mini ${comp.badgeClass}`;
        this.compareIcon.textContent = comp.arrow;
        this.compareText.textContent = comp.label;
        this.compareBadge.classList.remove('hidden');

        if (comp.pastPrice) {
          this.pastPriceText.textContent = `Harga bulan lalu: ${formatRp(comp.pastPrice)} (${comp.description})`;
          this.pastPriceNotice.classList.remove('hidden');
        } else {
          this.pastPriceText.textContent = 'Belum pernah dibeli pada bulan lalu (Item Baru)';
          this.pastPriceNotice.classList.remove('hidden');
        }
      } else {
        this.compareBadge.classList.add('hidden');
        this.pastPriceNotice.classList.add('hidden');
      }
    }
  };

  function updateChipSelection(selector, value, attr = 'data-val') {
    document.querySelectorAll(selector).forEach((btn) => {
      if (btn.getAttribute(attr) === value) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // F-06: RIWAYAT & DATABASE BELANJA ACTIONS
  // =========================================================================
  function renderHistoryList() {
    const container = document.getElementById('historyListContainer');
    const statHistoryCount = document.getElementById('statHistoryCount');
    const statTotalSpend = document.getElementById('statTotalSpend');
    const statAvgSpend = document.getElementById('statAvgSpend');
    const baselineTitleEl = document.getElementById('baselineTitle');

    if (baselineTitleEl) baselineTitleEl.textContent = State.baselineTitle;

    if (!container) return;

    if (State.history.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state" style="padding: 20px 0;">
          <p style="color: var(--text-muted); font-size: 13px;">Belum ada riwayat belanja yang disimpan.</p>
        </div>
      `;
      if (statHistoryCount) statHistoryCount.textContent = '0';
      if (statTotalSpend) statTotalSpend.textContent = 'Rp 0';
      if (statAvgSpend) statAvgSpend.textContent = 'Rp 0';
      return;
    }

    let grandTotalSpend = 0;
    let historyHtml = '';

    State.history.forEach((sess) => {
      grandTotalSpend += sess.totalSpending || 0;

      // Items preview snippet
      const previewText = (sess.items || [])
        .slice(0, 4)
        .map((it) => `${it.name} (${it.qty} ${it.unit})`)
        .join(', ') + ((sess.items || []).length > 4 ? ` + ${(sess.items || []).length - 4} lainnya` : '');

      historyHtml += `
        <div class="history-card" data-id="${sess.id}">
          <div class="history-card-header">
            <div>
              <h4 class="history-date">${sess.formattedDate || sess.date}</h4>
              <span class="text-subtle" style="font-size: 11px;">${sess.title || 'Belanja Bulanan'}</span>
            </div>
            <span class="history-total">${formatRp(sess.totalSpending)}</span>
          </div>

          <div class="history-meta-row">
            <span>${sess.itemCount || (sess.items || []).length} Barang</span>
            <span class="text-emerald">Hemat Diskon: ${formatRp(sess.totalSaved || 0)}</span>
          </div>

          <div class="history-items-preview">
            ${escapeHtml(previewText)}
          </div>

          <div class="history-actions-row">
            <button class="btn-secondary-sm btn-load-to-cart" data-id="${sess.id}">
              <i data-lucide="shopping-cart"></i> Pakai Template Ini
            </button>
            <button class="btn-secondary-sm btn-set-baseline" data-id="${sess.id}">
              <i data-lucide="git-compare"></i> Set Pembanding (F-04)
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = historyHtml;
    if (window.lucide) lucide.createIcons();

    // Stats
    const count = State.history.length;
    const avg = count > 0 ? Math.round(grandTotalSpend / count) : 0;
    if (statHistoryCount) statHistoryCount.textContent = count;
    if (statTotalSpend) statTotalSpend.textContent = formatRp(grandTotalSpend);
    if (statAvgSpend) statAvgSpend.textContent = formatRp(avg);
  }

  // Checkout modal / finish shopping
  const finishModal = {
    backdrop: document.getElementById('finishModalBackdrop'),
    grandTotalEl: document.getElementById('receiptGrandTotal'),
    itemCountEl: document.getElementById('receiptItemCount'),
    savedAmountEl: document.getElementById('receiptSavedAmount'),
    verdictEl: document.getElementById('receiptBudgetVerdict'),
    dateEl: document.getElementById('receiptDate'),
    checkBaseline: document.getElementById('checkSetAsBaseline'),

    open() {
      if (State.cart.length === 0) {
        showToast('Keranjang belanja masih kosong!', 'alert-circle');
        return;
      }

      const totals = calculateCartTotals();
      const now = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const dateStr = now.toLocaleDateString('id-ID', options);

      this.dateEl.textContent = dateStr;
      this.grandTotalEl.textContent = formatRp(totals.totalNet);
      this.itemCountEl.textContent = `${totals.totalItems} Item`;
      this.savedAmountEl.textContent = formatRp(totals.totalDiscountSavings);

      if (totals.totalNet <= totals.budget) {
        this.verdictEl.textContent = 'Aman Terkendali ✅';
        this.verdictEl.className = 'text-emerald';
      } else {
        this.verdictEl.textContent = `Over +${formatRp(totals.totalNet - totals.budget)} ⚠️`;
        this.verdictEl.className = 'text-rose';
      }

      this.backdrop.classList.add('active');
      triggerHaptic('light');
    },

    close() {
      this.backdrop.classList.remove('active');
    },

    saveTransaction() {
      const totals = calculateCartTotals();
      const now = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const dateFormatted = now.toLocaleDateString('id-ID', options);
      const monthYear = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

      const newHistorySession = {
        id: 'hist-' + Date.now(),
        title: `Belanja Bulanan Kost - ${monthYear}`,
        date: now.toISOString().split('T')[0],
        formattedDate: dateFormatted,
        totalSpending: totals.totalNet,
        totalSaved: totals.totalDiscountSavings,
        budgetLimit: totals.budget,
        itemCount: totals.totalItems,
        items: JSON.parse(JSON.stringify(State.cart))
      };

      // Push to history
      State.history.unshift(newHistorySession);

      // If user checks "Jadikan basis komparasi harga", update master catalog (F-04, F-06)
      if (this.checkBaseline.checked) {
        State.cart.forEach((it) => {
          const key = sanitizeKey(it.name);
          const disc = calculateTieredDiscount(it.unitPrice, it.disc1, it.disc2);
          State.catalog[key] = {
            name: it.name,
            category: it.category,
            unit: it.unit,
            price: disc.priceFinal,
            month: monthYear
          };
        });
        State.baselineTitle = `Belanja Terakhir (${dateFormatted})`;
      }

      // Clear Cart
      State.cart = [];
      Storage.save();
      this.close();
      renderCartList();
      renderHistoryList();
      showToast('Belanja selesai & tersimpan ke riwayat!', 'check-circle');
    }
  };

  // Quick budget modal
  const budgetModal = {
    backdrop: document.getElementById('budgetModalBackdrop'),
    input: document.getElementById('quickBudgetInput'),

    open() {
      this.input.value = State.budgetLimit;
      this.backdrop.classList.add('active');
    },
    close() {
      this.backdrop.classList.remove('active');
    },
    apply() {
      const val = parseFloat(this.input.value) || 500000;
      State.budgetLimit = val;
      const mainInput = document.getElementById('inputBudgetLimit');
      if (mainInput) mainInput.value = val;
      Storage.save();
      updateBudgetSafetyUI();
      this.close();
      showToast(`Batas anggaran diatur ke ${formatRp(val)}`);
    }
  };

  // =========================================================================
  // EVENT LISTENERS & WIRING
  // =========================================================================
  function initEventListeners() {
    // Clock in status bar
    function updateClock() {
      const clockEl = document.getElementById('liveClock');
      if (!clockEl) return;
      const d = new Date();
      clockEl.textContent = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    }
    updateClock();
    setInterval(updateClock, 30000);

    // Bottom Navigation Bar Tabs
    document.querySelectorAll('.nav-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        switchTab(tabTarget);
      });
    });

    // Category Filter Chips in Cart
    document.getElementById('categoryChips').addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (!chip) return;
      document.querySelectorAll('#categoryChips .chip-btn').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      State.selectedCategory = chip.getAttribute('data-category');
      renderCartList();
      triggerHaptic('light');
    });

    // Reset Cart Button
    document.getElementById('btnResetCart').addEventListener('click', () => {
      if (State.cart.length === 0) return;
      if (confirm('Kosongkan semua barang dari keranjang belanja troli Anda?')) {
        State.cart = [];
        Storage.save();
        renderCartList();
        showToast('Keranjang belanja dikosongkan', 'rotate-ccw');
      }
    });

    // Tips Button
    document.getElementById('btnHelpTips').addEventListener('click', () => {
      switchTab('tabAnggaran');
      const tipsCard = document.querySelector('.student-tips-card');
      if (tipsCard) tipsCard.scrollIntoView({ behavior: 'smooth' });
    });

    // Quick Budget Edit Click on Header
    document.getElementById('btnQuickEditBudget').addEventListener('click', () => {
      budgetModal.open();
    });
    document.getElementById('btnCloseBudgetModal').addEventListener('click', () => {
      budgetModal.close();
    });
    document.getElementById('btnApplyQuickBudget').addEventListener('click', () => {
      budgetModal.apply();
    });
    document.querySelectorAll('#budgetModalSheet .preset-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        budgetModal.input.value = btn.getAttribute('data-amount');
      });
    });

    // Budget Tab Save
    document.getElementById('btnSaveBudget').addEventListener('click', () => {
      const val = parseFloat(document.getElementById('inputBudgetLimit').value) || 500000;
      State.budgetLimit = val;
      Storage.save();
      updateBudgetSafetyUI();
      showToast(`Anggaran berhasil disimpan: ${formatRp(val)}`);
      switchTab('tabBelanja');
    });

    document.querySelectorAll('#tabAnggaran .preset-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.getElementById('inputBudgetLimit').value = btn.getAttribute('data-amount');
      });
    });

    // Open Modal Add Item
    document.getElementById('btnOpenAddModal').addEventListener('click', () => {
      itemModal.open();
    });
    document.getElementById('btnEmptyAdd').addEventListener('click', () => {
      itemModal.open();
    });

    // Load Sample Data (Kost Template)
    document.getElementById('btnLoadSampleData').addEventListener('click', () => {
      loadKostTemplateData();
    });

    // Modal Close buttons
    document.getElementById('btnCloseItemModal').addEventListener('click', () => {
      itemModal.close();
    });
    document.getElementById('btnCancelModal').addEventListener('click', () => {
      itemModal.close();
    });

    // Modal Category selector
    document.getElementById('formCategoryChips').addEventListener('click', (e) => {
      const chip = e.target.closest('.form-chip');
      if (!chip) return;
      document.querySelectorAll('#formCategoryChips .form-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      itemModal.catInput.value = chip.getAttribute('data-val');
      triggerHaptic('light');
    });

    // Modal Unit selector
    document.getElementById('unitSelector').addEventListener('click', (e) => {
      const btn = e.target.closest('.unit-btn');
      if (!btn) return;
      document.querySelectorAll('#unitSelector .unit-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      itemModal.unitInput.value = btn.getAttribute('data-unit');
      itemModal.recalculateForm();
      triggerHaptic('light');
    });

    // Modal Stepper buttons
    document.getElementById('btnQtyMinus').addEventListener('click', () => {
      let val = parseFloat(itemModal.qtyInput.value) || 1;
      val = Math.max(0.5, val <= 1 ? val - 0.5 : val - 1);
      itemModal.qtyInput.value = val;
      itemModal.recalculateForm();
      triggerHaptic('light');
    });

    document.getElementById('btnQtyPlus').addEventListener('click', () => {
      let val = parseFloat(itemModal.qtyInput.value) || 0;
      val = val + 1;
      itemModal.qtyInput.value = val;
      itemModal.recalculateForm();
      triggerHaptic('light');
    });

    // Input changes triggers realtime recalculation
    ['input', 'change'].forEach((evt) => {
      itemModal.nameInput.addEventListener(evt, () => {
        handleNameInputAutocomplete();
        itemModal.recalculateForm();
      });
      itemModal.qtyInput.addEventListener(evt, () => itemModal.recalculateForm());
      itemModal.unitPriceInput.addEventListener(evt, () => itemModal.recalculateForm());
      itemModal.disc1Input.addEventListener(evt, () => itemModal.recalculateForm());
      itemModal.disc2Input.addEventListener(evt, () => itemModal.recalculateForm());
    });

    // Quick Rupiah price chips
    document.querySelectorAll('.quick-price-chips .add-price-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const add = parseFloat(chip.getAttribute('data-add')) || 0;
        const current = parseFloat(itemModal.unitPriceInput.value) || 0;
        itemModal.unitPriceInput.value = current + add;
        itemModal.recalculateForm();
        triggerHaptic('light');
      });
    });

    // Discount Accordion Toggle
    document.getElementById('btnToggleDiscount').addEventListener('click', () => {
      const isHidden = itemModal.discountBody.classList.contains('hidden');
      if (isHidden) {
        itemModal.discountBody.classList.remove('hidden');
      } else {
        itemModal.discountBody.classList.add('hidden');
      }
    });

    // Preset Diskon Chips
    document.querySelectorAll('.disc-presets-row .disc-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.disc-presets-row .disc-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');

        const val = chip.getAttribute('data-disc');
        if (val === '50+20') {
          itemModal.disc1Input.value = 50;
          itemModal.disc2Input.value = 20;
        } else if (val === '30+10') {
          itemModal.disc1Input.value = 30;
          itemModal.disc2Input.value = 10;
        } else if (val === '20+10') {
          itemModal.disc1Input.value = 20;
          itemModal.disc2Input.value = 10;
        } else {
          itemModal.disc1Input.value = parseFloat(val) || 0;
          itemModal.disc2Input.value = 0;
        }
        itemModal.recalculateForm();
        triggerHaptic('light');
      });
    });

    // Form Submit (Add / Edit Item)
    itemModal.form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveItemFromForm();
    });

    // Cart Items Interactive Delegation (Edit, Delete, Stepper + / -)
    const cartContainer = document.getElementById('cartItemsContainer');

    cartContainer.addEventListener('click', (e) => {
      // Plus button
      const btnPlus = e.target.closest('.btn-card-plus');
      if (btnPlus) {
        const id = btnPlus.getAttribute('data-id');
        modifyItemQty(id, 1);
        return;
      }

      // Minus button
      const btnMinus = e.target.closest('.btn-card-minus');
      if (btnMinus) {
        const id = btnMinus.getAttribute('data-id');
        modifyItemQty(id, -1);
        return;
      }

      // Edit button
      const btnEdit = e.target.closest('.btn-edit-item');
      if (btnEdit) {
        const id = btnEdit.getAttribute('data-id');
        itemModal.open(id);
        return;
      }

      // Delete button
      const btnDelete = e.target.closest('.btn-delete-item');
      if (btnDelete) {
        const id = btnDelete.getAttribute('data-id');
        deleteCartItem(id);
        return;
      }
    });

    // Finish Shopping Modal Trigger
    document.getElementById('btnFinishShopping').addEventListener('click', () => {
      finishModal.open();
    });
    document.getElementById('btnCloseFinishModal').addEventListener('click', () => {
      finishModal.close();
    });
    document.getElementById('btnCancelFinish').addEventListener('click', () => {
      finishModal.close();
    });
    document.getElementById('btnConfirmFinish').addEventListener('click', () => {
      finishModal.saveTransaction();
    });

    // History Item Delegations
    document.getElementById('historyListContainer').addEventListener('click', (e) => {
      // Load session back to cart as template
      const btnLoad = e.target.closest('.btn-load-to-cart');
      if (btnLoad) {
        const id = btnLoad.getAttribute('data-id');
        const sess = State.history.find((s) => s.id === id);
        if (sess && sess.items) {
          if (State.cart.length > 0) {
            if (!confirm('Ganti barang keranjang saat ini dengan template riwayat ini?')) return;
          }
          State.cart = sess.items.map((it) => ({
            ...it,
            id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)
          }));
          Storage.save();
          renderCartList();
          switchTab('tabBelanja');
          showToast(`Berhasil memuat ${State.cart.length} item dari riwayat!`);
        }
        return;
      }

      // Set session as F-04 comparator baseline
      const btnSetBaseline = e.target.closest('.btn-set-baseline');
      if (btnSetBaseline) {
        const id = btnSetBaseline.getAttribute('data-id');
        const sess = State.history.find((s) => s.id === id);
        if (sess && sess.items) {
          sess.items.forEach((it) => {
            const key = sanitizeKey(it.name);
            const disc = calculateTieredDiscount(it.unitPrice, it.disc1, it.disc2);
            State.catalog[key] = {
              name: it.name,
              category: it.category,
              unit: it.unit,
              price: disc.priceFinal,
              month: sess.formattedDate || sess.date
            };
          });
          State.baselineTitle = `Sesi ${sess.formattedDate || sess.date}`;
          Storage.save();
          renderHistoryList();
          renderCartList();
          showToast(`Basis komparasi harga diperbarui ke sesi ${sess.formattedDate}!`);
        }
        return;
      }
    });

    // Export Data JSON
    document.getElementById('btnExportData').addEventListener('click', () => {
      const exportPayload = {
        cart: State.cart,
        budgetLimit: State.budgetLimit,
        history: State.history,
        catalog: State.catalog,
        exportedAt: new Date().toISOString()
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute('download', `SmartGrocery_Backup_${Date.now()}.json`);
      dlAnchor.click();
      showToast('Cadangan data berhasil diunduh');
    });
  }

  // Handle Autocomplete Suggestions (F-01, F-04)
  function handleNameInputAutocomplete() {
    const val = itemModal.nameInput.value.trim().toLowerCase();
    const suggestionsEl = itemModal.suggestions;

    if (!val || val.length < 2) {
      suggestionsEl.classList.add('hidden');
      return;
    }

    const matchedKeys = Object.keys(State.catalog).filter((k) => k.includes(val));

    if (matchedKeys.length === 0) {
      suggestionsEl.classList.add('hidden');
      return;
    }

    let html = '';
    matchedKeys.slice(0, 4).forEach((k) => {
      const item = State.catalog[k];
      html += `
        <div class="autocomplete-item" data-key="${k}">
          <span class="autocomplete-name">${item.name}</span>
          <span class="autocomplete-price">${formatRp(item.price)} (${item.unit})</span>
        </div>
      `;
    });

    suggestionsEl.innerHTML = html;
    suggestionsEl.classList.remove('hidden');

    suggestionsEl.querySelectorAll('.autocomplete-item').forEach((row) => {
      row.addEventListener('click', () => {
        const key = row.getAttribute('data-key');
        const match = State.catalog[key];
        if (match) {
          itemModal.nameInput.value = match.name;
          itemModal.catInput.value = match.category;
          itemModal.unitInput.value = match.unit;
          itemModal.unitPriceInput.value = match.price;

          updateChipSelection('#formCategoryChips .form-chip', match.category);
          updateChipSelection('#unitSelector .unit-btn', match.unit, 'data-unit');

          suggestionsEl.classList.add('hidden');
          itemModal.recalculateForm();
          triggerHaptic('light');
        }
      });
    });
  }

  // Save Item (F-01)
  function saveItemFromForm() {
    const id = itemModal.idInput.value;
    const name = itemModal.nameInput.value.trim();
    const category = itemModal.catInput.value || 'Bahan Pokok';
    const unit = itemModal.unitInput.value || 'pcs';
    const qty = parseFloat(itemModal.qtyInput.value) || 1;
    const unitPrice = parseFloat(itemModal.unitPriceInput.value) || 0;
    const disc1 = parseFloat(itemModal.disc1Input.value) || 0;
    const disc2 = parseFloat(itemModal.disc2Input.value) || 0;

    if (!name) {
      alert('Nama produk tidak boleh kosong!');
      return;
    }

    if (unitPrice <= 0) {
      alert('Harga satuan barang harus lebih besar dari 0!');
      return;
    }

    if (id) {
      // Edit existing
      const idx = State.cart.findIndex((it) => it.id === id);
      if (idx !== -1) {
        State.cart[idx] = {
          ...State.cart[idx],
          name,
          category,
          unit,
          qty,
          unitPrice,
          disc1,
          disc2
        };
        showToast(`"${name}" berhasil diperbarui!`);
      }
    } else {
      // Add new
      const newItem = {
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        name,
        category,
        unit,
        qty,
        unitPrice,
        disc1,
        disc2
      };
      State.cart.push(newItem);
      showToast(`"${name}" dimasukkan ke troli!`);
    }

    Storage.save();
    itemModal.close();
    renderCartList();
    triggerHaptic('light');
  }

  // Modify Item Qty directly from list (F-02 Realtime)
  function modifyItemQty(id, delta) {
    const item = State.cart.find((it) => it.id === id);
    if (!item) return;

    let newQty = (parseFloat(item.qty) || 1) + delta;
    if (newQty <= 0) {
      deleteCartItem(id);
      return;
    }

    item.qty = Math.round(newQty * 10) / 10;
    Storage.save();
    renderCartList();
    triggerHaptic('light');
  }

  // Delete Cart Item
  function deleteCartItem(id) {
    const item = State.cart.find((it) => it.id === id);
    const itemName = item ? item.name : 'Barang';

    State.cart = State.cart.filter((it) => it.id !== id);
    Storage.save();
    renderCartList();
    showToast(`"${itemName}" dihapus dari keranjang`, 'trash-2');
    triggerHaptic('light');
  }

  // Load Preset Template Belanja Kost
  function loadKostTemplateData() {
    State.cart = [
      {
        id: 'item-demo-1',
        name: 'Beras Ramos 5kg',
        category: 'Bahan Pokok',
        unit: 'pack',
        qty: 1,
        unitPrice: 75000, // Naik dari 72rb bulan lalu (F-04 ↑)
        disc1: 0,
        disc2: 0
      },
      {
        id: 'item-demo-2',
        name: 'Minyak Goreng 2L',
        category: 'Bahan Pokok',
        unit: 'pack',
        qty: 1,
        unitPrice: 32500, // Turun dari 34rb bulan lalu (F-04 ↓)
        disc1: 0,
        disc2: 0
      },
      {
        id: 'item-demo-3',
        name: 'Telur Ayam Negeri',
        category: 'Lauk & Protein',
        unit: 'kg',
        qty: 1.5,
        unitPrice: 28500, // Stabil sama dengan bulan lalu (F-04 =)
        disc1: 0,
        disc2: 0
      },
      {
        id: 'item-demo-4',
        name: 'Indomie Goreng (Isi 5)',
        category: 'Bumbu & Instan',
        unit: 'pack',
        qty: 2,
        unitPrice: 16000, // Diskon bertingkat 20% + 10% (F-03)
        disc1: 20,
        disc2: 10
      },
      {
        id: 'item-demo-5',
        name: 'Rinso Deterjen Cair 750ml',
        category: 'Mandi & Cuci',
        unit: 'pack',
        qty: 1,
        unitPrice: 24000, // Diskon 50% + 20% promo cuci gudang! (F-03)
        disc1: 50,
        disc2: 20
      },
      {
        id: 'item-demo-6',
        name: 'Biskuit Khong Guan Mini', // Item baru belum pernah beli (F-04 ★)
        category: 'Camilan & Minuman',
        unit: 'pcs',
        qty: 1,
        unitPrice: 18500,
        disc1: 10,
        disc2: 0
      }
    ];

    Storage.save();
    renderCartList();
    showToast('Template Belanja Kost Rantau berhasil dimuat!');
    triggerHaptic('light');
  }

  // Tab Navigation Switching
  function switchTab(tabId) {
    State.activeTab = tabId;

    document.querySelectorAll('.tab-pane').forEach((pane) => {
      pane.classList.remove('active');
    });

    document.querySelectorAll('.nav-tab-btn').forEach((btn) => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const targetPane = document.getElementById(tabId);
    if (targetPane) {
      targetPane.classList.add('active');
    }

    if (tabId === 'tabRiwayat') {
      renderHistoryList();
    } else if (tabId === 'tabAnggaran') {
      const totals = calculateCartTotals();
      renderCategoryBreakdown(totals);
    } else if (tabId === 'tabBelanja') {
      renderCartList();
    }

    triggerHaptic('light');
  }

  // =========================================================================
  // BOOTSTRAP APP
  // =========================================================================
  function init() {
    Storage.load();
    initEventListeners();

    // Set initial input budget
    const budgetInput = document.getElementById('inputBudgetLimit');
    if (budgetInput) budgetInput.value = State.budgetLimit;

    renderCartList();
    renderHistoryList();
    updateBudgetSafetyUI();

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
