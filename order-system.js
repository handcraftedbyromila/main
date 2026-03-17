// ============================================================
// ROMILA ORDER SYSTEM — order-system.js
// Include this script on every product page
// ============================================================

// ── FIREBASE CONFIG ─────────────────────────────────────────
// Single source of truth — real keys live here only.
// Product pages must NOT call firebase.initializeApp() themselves.
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBquB0qLjBU9tkmpFqs8l5C3X93gS3Q2vQ",
  authDomain:        "romila-shop.firebaseapp.com",
  projectId:         "romila-shop",
  storageBucket:     "romila-shop.appspot.com",
  messagingSenderId: "251855825998",
  appId:             "1:251855825998:web:9974a35f179fd5324d271f"
};

// Guard: only initialize if no app exists yet
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

const EMAILJS_SERVICE_ID  = "service_i2mew9k";
const EMAILJS_TEMPLATE_ID = "template_fodqow5";
const EMAILJS_PUBLIC_KEY  = "kjNZ-iu9CQF68Z_Vg";
emailjs.init(EMAILJS_PUBLIC_KEY);

// ── BUSINESS CONFIG ──────────────────────────────────────────
const ADMIN_EMAIL     = "handcraftedbyromila@gmail.com";
const UPI_ID          = "rnaveenahuja-1@okhdfcbank";
const WHATSAPP_NUMBER = "919911988358";

// ============================================================
// MODAL HTML — injected into every product page
// ============================================================
function injectOrderModal() {
  const html = `
  <!-- ORDER MODAL OVERLAY -->
  <div id="order-modal" class="fixed inset-0 z-[999] flex items-center justify-center p-4" style="display:none">
    <div id="order-backdrop" class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
    <div class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0c0a09] border border-stone-800 shadow-2xl">

      <!-- Modal Header -->
      <div class="sticky top-0 bg-[#0c0a09] border-b border-stone-900 px-8 py-6 flex justify-between items-center z-10">
        <div>
          <span class="text-[9px] uppercase tracking-[0.4em] text-stone-600 block mb-1">Place Your Order</span>
          <h2 id="modal-product-title" class="text-2xl font-serif italic text-white"></h2>
        </div>
        <button id="modal-close" class="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-white transition-colors text-xl">&times;</button>
      </div>

      <div class="px-8 py-6">

        <!-- UPI Payment Info -->
        <div class="border border-stone-800 bg-stone-950 p-6 mb-8">
          <span class="text-[9px] uppercase tracking-widest text-stone-500 mb-4 block">Step 1 — Pay via UPI</span>
          <div class="flex gap-6 items-start">
            <div class="flex-shrink-0 flex flex-col items-center gap-2">
              <div class="border border-stone-700 bg-white p-1.5">
                <img id="modal-qr-img" src="" alt="UPI QR" class="w-28 h-28 object-contain block">
              </div>
              <span class="text-[8px] uppercase tracking-widest text-stone-600">Amount pre-filled</span>
            </div>
            <div class="flex-1">
              <p class="text-stone-400 text-xs leading-relaxed mb-3">Scan with GPay, PhonePe, or Paytm — amount of <strong id="modal-price" class="text-white"></strong> is pre-filled automatically.</p>
              <div class="flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-2 mb-2">
                <span class="text-stone-300 text-[11px] font-mono">${UPI_ID}</span>
                <button onclick="copyModalUPI()" class="text-[9px] text-stone-500 hover:text-white transition-colors border-l border-stone-700 pl-2 uppercase tracking-wider">Copy</button>
              </div>
              <span id="modal-copy-confirm" class="text-[10px] text-green-500 block" style="opacity:0;transition:opacity 0.3s">Copied!</span>
              <a id="modal-upi-link" href="#" class="mt-3 inline-block text-[9px] uppercase tracking-widest text-stone-500 hover:text-white transition-colors border border-stone-800 px-3 py-2">
                Open in UPI App
              </a>
            </div>
          </div>
        </div>

        <!-- Order Form -->
        <div class="mb-6">
          <span class="text-[9px] uppercase tracking-widest text-stone-500 mb-6 block">Step 2 — Fill Your Details</span>

          <div id="order-form" class="space-y-5">

            <!-- Full Name -->
            <div>
              <label class="text-[9px] uppercase tracking-widest text-stone-500 mb-2 block">Full Name *</label>
              <input id="field-name" type="text" placeholder="e.g. Priya Sharma"
                class="w-full bg-stone-900 border border-stone-800 text-stone-200 text-sm px-4 py-3 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors">
            </div>

            <!-- Phone -->
            <div>
              <label class="text-[9px] uppercase tracking-widest text-stone-500 mb-2 block">Phone Number *</label>
              <input id="field-phone" type="tel" placeholder="10-digit mobile number"
                class="w-full bg-stone-900 border border-stone-800 text-stone-200 text-sm px-4 py-3 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors">
            </div>

            <!-- Email -->
            <div>
              <label class="text-[9px] uppercase tracking-widest text-stone-500 mb-2 block">Email Address *</label>
              <input id="field-email" type="email" placeholder="you@example.com"
                class="w-full bg-stone-900 border border-stone-800 text-stone-200 text-sm px-4 py-3 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors">
            </div>

            <!-- Address -->
            <div>
              <label class="text-[9px] uppercase tracking-widest text-stone-500 mb-2 block">Shipping Address *</label>
              <textarea id="field-address" rows="3" placeholder="House no., Street, Area, Landmark..."
                class="w-full bg-stone-900 border border-stone-800 text-stone-200 text-sm px-4 py-3 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors resize-none"></textarea>
            </div>

            <!-- City + Pincode -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[9px] uppercase tracking-widest text-stone-500 mb-2 block">City *</label>
                <input id="field-city" type="text" placeholder="City"
                  class="w-full bg-stone-900 border border-stone-800 text-stone-200 text-sm px-4 py-3 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors">
              </div>
              <div>
                <label class="text-[9px] uppercase tracking-widest text-stone-500 mb-2 block">Pincode *</label>
                <input id="field-pincode" type="text" placeholder="6-digit pincode"
                  class="w-full bg-stone-900 border border-stone-800 text-stone-200 text-sm px-4 py-3 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors">
              </div>
            </div>

            <!-- Product (auto-filled, readonly) -->
            <div>
              <label class="text-[9px] uppercase tracking-widest text-stone-500 mb-2 block">Product</label>
              <input id="field-product" type="text" readonly
                class="w-full bg-stone-950 border border-stone-800 text-stone-400 text-sm px-4 py-3 cursor-not-allowed">
            </div>

            <!-- Quantity -->
            <div>
              <label class="text-[9px] uppercase tracking-widest text-stone-500 mb-2 block">Quantity *</label>
              <select id="field-qty"
                class="w-full bg-stone-900 border border-stone-800 text-stone-200 text-sm px-4 py-3 focus:outline-none focus:border-stone-500 transition-colors">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>



            <!-- Notes -->
            <div>
              <label class="text-[9px] uppercase tracking-widest text-stone-500 mb-2 block">Notes <span class="text-stone-700">(optional)</span></label>
              <textarea id="field-notes" rows="2" placeholder="Any special instructions..."
                class="w-full bg-stone-900 border border-stone-800 text-stone-200 text-sm px-4 py-3 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors resize-none"></textarea>
            </div>

            <!-- Error Message -->
            <div id="form-error" class="hidden text-red-400 text-xs border border-red-900 bg-red-950/30 px-4 py-3"></div>

            <!-- Submit Button -->
            <button id="submit-order" onclick="submitOrder()"
              class="w-full py-5 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-stone-200 transition-all flex items-center justify-center gap-3">
              <span id="submit-text">Place Order</span>
              <span id="submit-spinner" class="hidden">
                <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SUCCESS MODAL -->
  <div id="success-modal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4" style="display:none">
    <div class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
    <div class="relative bg-[#0c0a09] border border-stone-800 p-12 max-w-md w-full text-center">
      <div class="w-16 h-16 border border-stone-700 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-white"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <span class="text-[9px] uppercase tracking-[0.5em] text-stone-600 mb-4 block">Order Confirmed</span>
      <h3 class="text-3xl font-serif italic text-white mb-4">Thank You!</h3>
      <p class="text-stone-400 text-sm font-light leading-relaxed mb-4">Your order has been placed successfully. You'll receive a confirmation email shortly.</p>
      <div id="success-order-id" class="text-stone-600 text-[10px] uppercase tracking-widest mb-8"></div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between text-[9px] uppercase tracking-widest text-stone-600 mb-3">
          <span>Order Placed</span><span>Dispatched</span><span>Delivered</span>
        </div>
        <div class="h-px bg-stone-800 relative">
          <div class="absolute left-0 top-0 h-px bg-white w-1/6"></div>
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          <div class="absolute left-1/2 top-1/2 -translate-y-1/2 w-2 h-2 bg-stone-700 rounded-full -translate-x-1/2"></div>
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-stone-700 rounded-full"></div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <a id="success-track-link" href="track.html" class="w-full py-3 border border-stone-700 text-[9px] uppercase tracking-widest text-stone-400 hover:text-white hover:border-white transition-all">Track Your Order</a>
        <button onclick="closeSuccess()" class="w-full py-3 bg-white text-black text-[9px] uppercase tracking-widest font-bold hover:bg-stone-200 transition-all">Continue Shopping</button>
      </div>
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  // Wire up events
  document.getElementById('order-backdrop').addEventListener('click', closeOrderModal);
  document.getElementById('modal-close').addEventListener('click', closeOrderModal);

  // Re-generate QR whenever quantity changes
  document.getElementById('field-qty').addEventListener('change', updateUpiQR);
}

// ── MODAL OPEN/CLOSE ─────────────────────────────────────────
let currentProduct = { title: '', price: '' };

function updateUpiQR() {
  const title    = currentProduct.title;
  const baseAmt  = currentProduct.price.replace(/[^\d]/g, ''); // "Rs. 359" → "359"
  const qty      = parseInt(document.getElementById('field-qty').value) || 1;
  const total    = parseInt(baseAmt) * qty;

  // Update price display
  const priceEl = document.getElementById('modal-price');
  if (qty > 1) {
    priceEl.textContent = `Rs. ${total} (${qty} × Rs. ${baseAmt})`;
  } else {
    priceEl.textContent = currentProduct.price;
  }

  // Regenerate QR with updated total
  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=Romila Handcrafted&am=${total}&cu=INR&tn=Order: ${title} x${qty}`;
  const qrApiUrl    = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}`;
  document.getElementById('modal-qr-img').src    = qrApiUrl;
  document.getElementById('modal-upi-link').href = upiDeepLink;
}

function openOrderModal(title, price) {
  currentProduct = { title, price };
  document.getElementById('modal-product-title').textContent = title;
  document.getElementById('field-product').value             = title;

  clearForm();
  updateUpiQR(); // generate QR for qty=1 on open

  const modal = document.getElementById('order-modal');
  modal.style.removeProperty('display');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  document.getElementById('order-modal').style.display = 'none';
  document.body.style.overflow = '';
}

function closeSuccess() {
  document.getElementById('success-modal').style.display = 'none';
  document.body.style.overflow = '';
}

// ── COPY UPI ─────────────────────────────────────────────────
function copyModalUPI() {
  navigator.clipboard.writeText(UPI_ID).then(() => {
    const el = document.getElementById('modal-copy-confirm');
    el.style.opacity = '1';
    setTimeout(() => el.style.opacity = '0', 2000);
  });
}

// ── VALIDATION ───────────────────────────────────────────────
function showError(msg) {
  const el = document.getElementById('form-error');
  el.textContent = msg;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function hideError() { document.getElementById('form-error').classList.add('hidden'); }

function validateForm() {
  const name       = document.getElementById('field-name').value.trim();
  const phone      = document.getElementById('field-phone').value.trim();
  const email      = document.getElementById('field-email').value.trim();
  const address    = document.getElementById('field-address').value.trim();
  const city       = document.getElementById('field-city').value.trim();
  const pincode    = document.getElementById('field-pincode').value.trim();
  if (!name)                              { showError('Please enter your full name.'); return false; }
  if (!/^[6-9]\d{9}$/.test(phone))       { showError('Please enter a valid 10-digit Indian phone number.'); return false; }
  if (!/\S+@\S+\.\S+/.test(email))       { showError('Please enter a valid email address.'); return false; }
  if (!address)                           { showError('Please enter your shipping address.'); return false; }
  if (!city)                              { showError('Please enter your city.'); return false; }
  if (!/^\d{6}$/.test(pincode))          { showError('Please enter a valid 6-digit pincode.'); return false; }
  // Basic spam check
  if (name.length > 100 || address.length > 500) { showError('Input too long. Please check your details.'); return false; }

  hideError();
  return true;
}


// ── TIMEOUT HELPER ───────────────────────────────────────────
function withTimeout(promise, ms, label) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout: ${label} took over ${ms/1000}s`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// ── SUBMIT ORDER ─────────────────────────────────────────────
async function submitOrder() {
  if (!validateForm()) return;

  const btn = document.getElementById('submit-order');
  btn.disabled = true;
  document.getElementById('submit-spinner').classList.remove('hidden');
  document.getElementById('submit-text').textContent = 'Placing Order…';

  try {
    const orderId = 'RM' + Date.now();

    // 1. Collect order data
    document.getElementById('submit-text').textContent = 'Saving order…';
    const orderData = {
      orderId,
      name:     document.getElementById('field-name').value.trim(),
      phone:    document.getElementById('field-phone').value.trim(),
      email:    document.getElementById('field-email').value.trim(),
      address:  document.getElementById('field-address').value.trim(),
      city:     document.getElementById('field-city').value.trim(),
      pincode:  document.getElementById('field-pincode').value.trim(),
      product:  document.getElementById('field-product').value,
      quantity: parseInt(document.getElementById('field-qty').value),
      notes:    document.getElementById('field-notes').value.trim(),
      status:   'Order Placed',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // 3. Save to Firestore
    await withTimeout(
      firebase.firestore().collection('orders').doc(orderId).set(orderData),
      15000, 'Firestore save'
    );

    // 4. Show success immediately
    closeOrderModal();
    document.getElementById('success-order-id').textContent = `Order ID: ${orderId}`;
    document.getElementById('success-track-link').href = `track.html?email=${encodeURIComponent(orderData.email)}`;
    const successModal = document.getElementById('success-modal');
    successModal.style.removeProperty('display');
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // 5. Send email in background
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:       ADMIN_EMAIL,
      order_id:       orderId,
      customer_name:  orderData.name,
      customer_phone: orderData.phone,
      customer_email: orderData.email,
      address:        `${orderData.address}, ${orderData.city} - ${orderData.pincode}`,
      product:        orderData.product,
      quantity:       orderData.quantity,
      notes:          orderData.notes || 'None',
    }).catch(err => console.warn('Email send failed (order still saved):', err));

  } catch (err) {
    console.error('Order submission error:', err.message);
    let msg = 'Something went wrong. Please try again.';
    if (err.message.includes('Firestore') || err.message.includes('save')) {
      msg = 'Could not save order. Check your internet and try again.';
    } else if (err.message.includes('Timeout')) {
      msg = 'Taking too long. Check your internet and try again.';
    }
    showError(msg);
    btn.disabled = false;
    document.getElementById('submit-text').textContent = 'Place Order';
    document.getElementById('submit-spinner').classList.add('hidden');
  }
}

// ── HELPERS ──────────────────────────────────────────────────
function clearForm() {
  ['field-name','field-phone','field-email','field-address','field-city','field-pincode','field-notes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('field-qty').value = '1';
  hideError();
  document.getElementById('submit-order').disabled = false;
  document.getElementById('submit-text').textContent = 'Place Order';
  document.getElementById('submit-spinner').classList.add('hidden');
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectOrderModal();
});
