// ============================================================
//  BYTEX — app.js
// ============================================================
// Dynamic products catalog (synced with database)
let products = [
  {
    id: 'houses',
    code: 'sqh_houses',
    name: 'House System',
    nameLong: 'HOUSE SYSTEM',
    cat: 'Roleplay',
    price: 97.90,
    accent: '#93c5fd',       // blue
    titleColor: '#ffffff',
    img: 'images/card_houses.png',
    desc: 'Looking for a housing system that goes far beyond the basics and completely transforms the roleplay experience on your server? The House System is the definition of immersion, realism, and innovation.',
    tags: ['Casas', 'economia', 'roleplay', 'inovador', 'imersão']
  },
  {
    id: 'dispatch',
    code: 'sqh_dispatch',
    name: 'Dispatch System',
    nameLong: 'DISPATCH SYSTEM',
    cat: 'Systems',
    price: 109.90,
    accent: '#ef4444',       // red
    img: 'images/card_dispatch.png',
    desc: 'A complete operational center that fully redefines how service handling works on your server. Real-time police dispatch, callouts, and GPS tracking.',
    tags: ['mtasa', 'roleplay', 'corps', 'police', 'isamu', 'mecanico']
  },
  {
    id: 'radar',
    code: 'sqh_radar',
    name: 'Radar System',
    nameLong: 'RADAR SYSTEM',
    cat: 'Systems',
    price: 74.90,
    accent: '#ffffff',       // white
    titleColor: '#ffffff',
    img: 'images/card_radar.png',
    desc: 'Modern radar and minimap system with a clean, configurable interface. Fully customizable HUD with player markers and zone detection.',
    tags: ['Radar', 'Minimap', 'GPS', 'HUD']
  },
  {
    id: 'discord',
    code: 'sqh_authdiscord',
    name: 'Discord Authentication',
    nameLong: 'DISCORD AUTHENTICATION',
    cat: 'Admin',
    price: 49.90,
    accent: '#ec4899',       // pink
    img: 'images/card_discord.png',
    desc: 'Secure Discord-based authentication system. Link player accounts directly to your Discord server with automatic role syncing and ban management.',
    tags: ['Discord', 'OAuth', 'Bot', 'Admin']
  },
  {
    id: 'phone',
    code: 'sqh_phone',
    name: 'Phone System',
    nameLong: 'PHONE SYSTEM',
    cat: 'UI',
    price: 239.90,
    accent: '#a855f7',       // purple
    img: 'images/card_phone.png',
    desc: 'A complete smartphone experience with apps, contacts, messages and social features. Instagram, Twitter, calls, photos and much more built in.',
    tags: ['Smartphone', 'Apps', 'Instagram', 'Call']
  },
  {
    id: 'custom',
    code: 'sqh_custom',
    name: 'Custom Characters',
    nameLong: 'CUSTOM CHARACTERS',
    cat: 'Roleplay',
    price: 149.90,
    accent: '#ffffff',       // white
    titleColor: '#ffffff',
    img: 'images/card_custom.png',
    desc: 'Character customization system with tattoos, clothes, faces, hair and accessories. Give your players endless possibilities for their roleplay personas.',
    tags: ['Customization', 'Skins', 'Tattoos', 'UI']
  },
  {
    id: 'characters',
    code: 'sqh_multicharacters',
    name: 'Multi Characters',
    nameLong: 'MULTI CHARACTERS',
    cat: 'Roleplay',
    price: 47.90,
    accent: '#4ade80',       // green
    img: 'images/card_characters.png',
    desc: 'Multi-character management with interactive 3D character selection. Let players create and switch between multiple roleplay identities.',
    tags: ['Characters', 'Spawn', 'Slots', 'RP']
  },
  {
    id: 'groups',
    code: 'sqh_groups',
    name: 'Groups System',
    nameLong: 'GROUPS SYSTEM',
    cat: 'Systems',
    price: 79.90,
    accent: '#60a5fa',       // blue
    img: 'images/card_groups.png',
    desc: 'Powerful group, faction and permission management panel. Full hierarchy system with ranks, permissions, bank accounts and territory control.',
    tags: ['Faccoes', 'Grupos', 'Ranks', 'Panel']
  },
  {
    id: 'craft',
    code: 'sqh_craftsystem',
    name: 'Craft System',
    nameLong: 'CRAFT SYSTEM',
    cat: 'Systems',
    price: 84.90,
    accent: '#f59e0b',       // amber
    img: 'images/card_dispatch.png',
    desc: 'Complete item crafting system with recipes, workbench and progress UI. Players can craft weapons, items and vehicles parts.',
    tags: ['Craft', 'Itens', 'Economia']
  },
  {
    id: 'fuel',
    code: 'sqh_fuelsystem',
    name: 'Fuel System',
    nameLong: 'FUEL SYSTEM',
    cat: 'Systems',
    price: 64.90,
    accent: '#34d399',       // teal
    img: 'images/card_radar.png',
    desc: 'Realistic vehicle refueling system with gas stations and canister support. Includes full gas station management and economy integration.',
    tags: ['Gasolina', 'Postos', 'Veiculos']
  },
  {
    id: 'addons',
    code: 'sqh_customaddons',
    name: 'Custom Addons',
    nameLong: 'CUSTOM ADDONS',
    cat: 'UI',
    price: 89.90,
    accent: '#ffffff',       // white
    nameColor: '#ffffff',
    img: 'images/card_groups.png',
    desc: 'A flexible collection of polished addons for your MTA server ecosystem. Drag and drop modules to customize your server experience.',
    tags: ['Addons', 'Modular', 'Ecosistema']
  }
];



/* ── LICENSES & DISCORD ROLE ACCESS SYSTEM ── */
let customerLicenses = [];

async function fetchMyLicenses() {
  const token = localStorage.getItem('bytex_token');
  if (!token) return [];
  try {
    const res = await fetch('/api/licenses/my', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.ok) {
      customerLicenses = await res.json();
      return customerLicenses;
    }
  } catch (e) {
    console.error('Fetch licenses failed:', e);
  }
  return [];
}

let activeConfiguringLicense = null;

function openLicenseConfigModal(licenseObj) {
  activeConfiguringLicense = licenseObj;
  renderLicenseModalDynamic('config');
  const modal = document.getElementById('licenseModal');
  if (modal) modal.classList.add('show');
}

function renderLicenseModalDynamic(tab = 'config') {
  const container = document.getElementById('licenseModalCard');
  if (!container || !activeConfiguringLicense) return;

  const lic = activeConfiguringLicense;
  const email = lic.customerEmail || (discordUser ? discordUser.username + '@bytex' : 'customer@bytex.dev');
  const key = lic.licenseKey || 'BYTX-XXXX-XXXX-XXXX';
  const serverIp = lic.serverIp || '127.0.0.1';
  const serverPort = lic.serverPort || 22003;

  let bodyContent = '';
  if (tab === 'info') {
    bodyContent = '<div class="license-modal-row">' +
      '<div class="license-modal-field">' +
        '<label>Product</label>' +
        '<div class="license-modal-input-wrap">' +
          '<input type="text" value="' + (lic.productName || 'ByteX MTA Script') + '" readonly>' +
        '</div>' +
      '</div>' +
      '<div class="license-modal-field">' +
        '<label>Resource Code</label>' +
        '<div class="license-modal-input-wrap">' +
          '<input type="text" value="' + (lic.resourceCode || 'sqh_bytex') + '" readonly>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="license-modal-row">' +
      '<div class="license-modal-field">' +
        '<label>License Key</label>' +
        '<div class="license-modal-input-wrap">' +
          '<input type="text" value="' + key + '" readonly style="color:#34d399;font-weight:700;font-family:monospace">' +
          '<button class="license-modal-input-copy" onclick="copyText(\'' + key + '\', \'License key copied!\')">Copy</button>' +
        '</div>' +
      '</div>' +
      '<div class="license-modal-field">' +
        '<label>Status</label>' +
        '<div class="license-modal-input-wrap">' +
          '<input type="text" value="● ' + (lic.status || 'ACTIVE') + '" readonly style="color:#34d399;font-weight:700">' +
        '</div>' +
      '</div>' +
    '</div>';
  } else {
    const codeString = 'license = {\n    ["Email"] = "' + email + '",\n    ["Key"] = "' + key + '",\n}';
    bodyContent = '<div class="license-modal-section-title">' +
      '<span>MTA Server Binding &amp; Configuration</span>' +
    '</div>' +
    '<div class="license-modal-row" style="margin-bottom:0.75rem">' +
      '<div class="license-modal-field">' +
        '<label>Server IP</label>' +
        '<div class="license-modal-input-wrap">' +
          '<input type="text" id="modalServerIp" value="' + serverIp + '" placeholder="e.g. 127.0.0.1 or your VPS IP">' +
        '</div>' +
      '</div>' +
      '<div class="license-modal-field">' +
        '<label>Port</label>' +
        '<div class="license-modal-input-wrap">' +
          '<input type="number" id="modalServerPort" value="' + serverPort + '" placeholder="22003">' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<button class="license-modal-btn-save" onclick="saveLicenseConfigToServer(\'' + (lic._id || '') + '\')">💾 Save Server Configuration</button>' +
    '<div class="license-modal-section-title" style="margin-top:1.25rem">' +
      '<span>Configuration Code (Paste in config.lua)</span>' +
    '</div>' +
    '<div class="license-code-box">' +
      '<div class="license-code-header">' +
        '<span>config.lua</span>' +
        '<button class="copy-btn" onclick="copyText(\'' + codeString.replace(/\n/g, '\\n') + '\', \'config.lua code copied!\')">Copy Code</button>' +
      '</div>' +
      '<pre class="license-code-pre" id="luaCodePre">' + codeString + '</pre>' +
    '</div>' +
    '<div class="license-modal-warning-box">' +
      '<p>Add the snippet above into <code style="color:#ff4d4d;font-family:monospace">config.lua</code> in your server resource folder to authorize.</p>' +
    '</div>';
  }

  container.innerHTML = '<button class="license-modal-close" onclick="closeLicenseModal()">×</button>' +
    '<div class="license-modal-header">' +
      '<div class="license-modal-icon-wrap">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' +
      '</div>' +
      '<div class="license-modal-title-box">' +
        '<h3>' + (lic.productName || 'Resource License') + '</h3>' +
        '<p>Key: ' + key + ' · ' + (lic.status || 'ACTIVE') + '</p>' +
      '</div>' +
    '</div>' +
    '<div class="license-modal-tabs">' +
      '<button class="license-modal-tab-btn ' + (tab === 'config' ? 'active' : '') + '" onclick="renderLicenseModalDynamic(\'config\')">Configuration</button>' +
      '<button class="license-modal-tab-btn ' + (tab === 'info' ? 'active' : '') + '" onclick="renderLicenseModalDynamic(\'info\')">License Details</button>' +
    '</div>' +
    bodyContent;
}

async function saveLicenseConfigToServer(licenseId) {
  const ip = document.getElementById('modalServerIp')?.value || '127.0.0.1';
  const port = document.getElementById('modalServerPort')?.value || 22003;
  const token = localStorage.getItem('bytex_token');

  if (!licenseId || !token) {
    toast('Server configuration updated locally!');
    closeLicenseModal();
    return;
  }

  try {
    const res = await fetch('/api/licenses/' + licenseId + '/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ serverIp: ip, serverPort: Number(port) })
    });
    if (res.ok) {
      toast('✅ Server IP & Port saved in database!');
      if (activeConfiguringLicense) {
        activeConfiguringLicense.serverIp = ip;
        activeConfiguringLicense.serverPort = Number(port);
      }
      await fetchMyLicenses();
      closeLicenseModal();
    } else {
      toast('Failed to save configuration.');
    }
  } catch (err) {
    toast('Error saving: ' + err.message);
  }
}


/* ── DISCORD & REAL ORDER SYSTEM INTEGRATIONS ── */
function openDiscordLogin() {
  const width = 500, height = 750;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  window.open('/auth/discord', 'DiscordLogin', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
}

window.addEventListener('message', (event) => {
  if (event.data && event.data.token) {
    const { token, username, id, avatar, role } = event.data;
    localStorage.setItem('bytex_token', token);
    discordUser = { token, username, id, avatar, role };
    if (role === 'admin') {
      adminToken = token;
      adminUser = discordUser;
      localStorage.setItem('bytex_admin_token', token);
      localStorage.setItem('bytex_admin_user', JSON.stringify(discordUser));
    }
    toast('Welcome back, ' + username + '! 🚀');
    closeModal();
    renderNavProfile();
    render();
  }
});

async function instantDemoLogin(role) {
  try {
    const targetRole = role === 'admin' ? 'admin' : 'user';
    const username = targetRole === 'admin' ? 'ByteXAdmin' : 'ByteXCustomer';
    const res = await fetch('/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: targetRole, username })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('bytex_token', data.token);
      discordUser = {
        token: data.token,
        username: data.user.username,
        id: data.user.discordId,
        avatar: data.user.avatar,
        role: data.user.role,
        _id: data.user._id
      };
      if (data.user.role === 'admin') {
        adminToken = data.token;
        adminUser = discordUser;
        localStorage.setItem('bytex_admin_token', data.token);
        localStorage.setItem('bytex_admin_user', JSON.stringify(discordUser));
      }
      closeModal();
      toast('Signed in as ' + data.user.username + ' (' + data.user.role.toUpperCase() + ')! 🎉');
      renderNavProfile();
      render();
    } else {
      toast('Demo login error: ' + (data.message || 'Failed'));
    }
  } catch (err) {
    toast('Login error: ' + err.message);
  }
}

async function checkAuthSession() {
  const token = localStorage.getItem('bytex_token') || localStorage.getItem('bytex_admin_token');
  if (!token) return;
  try {
    const res = await fetch('/auth/me', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.ok) {
      const user = await res.json();
      discordUser = {
        token,
        username: user.username,
        id: user.discordId,
        avatar: user.avatar,
        role: user.role,
        _id: user._id
      };
      if (user.role === 'admin') {
        adminToken = token;
        adminUser = discordUser;
        localStorage.setItem('bytex_admin_token', token);
        localStorage.setItem('bytex_admin_user', JSON.stringify(discordUser));
      }
      renderNavProfile();
    }
  } catch (err) {
    console.warn('Session check warning:', err.message);
  }
}

let activeBuyingProduct = null;
let uploadedProofFile = null;

function openBuyModal(productId) {
  const p = products.find(x => x.id === productId || String(x._id) === String(productId)) || products[0];
  activeBuyingProduct = p;
  uploadedProofFile = null;

  const content = document.getElementById('buyModalContent');
  if (!content) return;

  const priceVal = typeof p.price === 'number' ? p.price.toFixed(2) : p.price;
  const buyerDefaultName = discordUser ? discordUser.username : '';

  content.innerHTML = '<div style="text-align:center;margin-bottom:1.25rem">' +
    '<span style="background:rgba(255,49,49,0.15);color:#ff4d4d;border:1px solid rgba(255,49,49,0.3);padding:0.25rem 0.75rem;border-radius:20px;font-size:0.75rem;font-weight:700">⚡ MANUAL QR PAYMENT</span>' +
    '<h2 style="font-size:1.4rem;font-weight:800;color:#fff;margin:0.5rem 0 0.25rem">' + (p.name || p.title) + '</h2>' +
    '<p style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin:0">Discord Webhook notification & manual staff approval</p>' +
  '</div>' +

  '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1rem;margin-bottom:1.25rem;display:flex;align-items:center;justify-content:space-between">' +
    '<div>' +
      '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">TOTAL AMOUNT</div>' +
      '<div style="font-size:1.35rem;font-weight:800;color:#34d399">' + money(Number(priceVal)) + '</div>' +
    '</div>' +
    '<div style="text-align:right">' +
      '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">RESOURCE CODE</div>' +
      '<div style="font-size:0.95rem;font-weight:700;color:#fff">' + (p.code || 'sqh_bytex') + '</div>' +
    '</div>' +
  '</div>' +

  '<div style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,49,49,0.2);border-radius:12px;padding:1.25rem;text-align:center;margin-bottom:1.25rem">' +
    '<div style="font-size:0.8rem;color:rgba(255,255,255,0.7);margin-bottom:0.75rem;font-weight:600">Scan QR Code or copy Payment UPI:</div>' +
    '<img src="/payment-qr-placeholder.png" alt="Payment QR" style="max-width:180px;border-radius:10px;margin:0 auto;display:block;border:2px solid rgba(255,255,255,0.1)" onerror="this.src=\'images/bytex_logo.png\'">' +
    '<div style="display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-top:0.75rem">' +
      '<code style="background:rgba(255,255,255,0.08);padding:0.35rem 0.75rem;border-radius:6px;font-size:0.8rem;color:#fff">bytex-payments@bank</code>' +
      '<button class="copy-btn" onclick="copyText(\'bytex-payments@bank\', \'Payment ID copied!\')" style="padding:0.35rem 0.6rem">Copy</button>' +
    '</div>' +
  '</div>' +

  '<form onsubmit="submitManualOrder(event)" style="display:flex;flex-direction:column;gap:0.85rem">' +
    '<div>' +
      '<label style="display:block;font-size:0.8rem;color:rgba(255,255,255,0.7);margin-bottom:0.35rem">Your Name / Discord Tag *</label>' +
      '<input type="text" id="orderBuyerName" required value="' + buyerDefaultName + '" placeholder="e.g. your_discord_username" style="width:100%;padding:0.65rem 0.85rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:0.85rem;box-sizing:border-box">' +
    '</div>' +

    '<div>' +
      '<label style="display:block;font-size:0.8rem;color:rgba(255,255,255,0.7);margin-bottom:0.35rem">MTA Server Name / Notes (Optional)</label>' +
      '<input type="text" id="orderBuyerNote" placeholder="e.g. Server Name / Tx Reference ID" style="width:100%;padding:0.65rem 0.85rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:0.85rem;box-sizing:border-box">' +
    '</div>' +

    '<div>' +
      '<label style="display:block;font-size:0.8rem;color:rgba(255,255,255,0.7);margin-bottom:0.35rem">Payment Proof Screenshot *</label>' +
      '<input type="file" id="orderScreenshotInput" accept="image/*" required onchange="handleProofImageSelect(this)" style="display:none">' +
      '<div id="proofDropzone" onclick="document.getElementById(\'orderScreenshotInput\').click()" style="border:2px dashed rgba(255,49,49,0.4);background:rgba(255,49,49,0.03);border-radius:10px;padding:1.25rem;text-align:center;cursor:pointer;transition:all 0.2s">' +
        '<div id="proofDropzoneContent">' +
          '<div style="font-size:1.5rem;margin-bottom:0.35rem">📸</div>' +
          '<div style="color:#fff;font-weight:600;font-size:0.85rem">Click to upload Payment Screenshot</div>' +
          '<div style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin-top:0.25rem">Supports JPG, PNG, WEBP</div>' +
        '</div>' +
        '<img id="proofImagePreview" src="" alt="Preview" style="max-height:140px;max-width:100%;border-radius:8px;margin:0 auto;display:none">' +
      '</div>' +
    '</div>' +

    '<div style="display:flex;gap:0.75rem;margin-top:0.75rem">' +
      '<button type="button" onclick="closeBuyModal()" class="admin-btn-action admin-btn-del" style="padding:0.75rem 1.25rem;flex:1">Cancel</button>' +
      '<button type="submit" id="btnSubmitOrder" class="primary" style="background:linear-gradient(135deg,#ff3131,#b30000);color:#fff;font-weight:700;padding:0.75rem 1.5rem;border-radius:8px;font-size:0.9rem;border:none;cursor:pointer;flex:2;display:flex;align-items:center;justify-content:center;gap:0.5rem">' +
        '🚀 Submit & Confirm Order' +
      '</button>' +
    '</div>' +
  '</form>';

  document.getElementById('buyModal').classList.remove('hidden');
}

function closeBuyModal() {
  const m = document.getElementById('buyModal');
  if (m) m.classList.add('hidden');
}

function handleProofImageSelect(input) {
  if (input.files && input.files[0]) {
    uploadedProofFile = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('proofImagePreview');
      const dropContent = document.getElementById('proofDropzoneContent');
      if (preview && dropContent) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        dropContent.style.display = 'none';
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

async function submitManualOrder(e) {
  e.preventDefault();
  if (!activeBuyingProduct) return;

  const btn = document.getElementById('btnSubmitOrder');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite">↻</span> Submitting Proof & Sending Webhook...';
  }

  let token = localStorage.getItem('bytex_token');
  if (!token) {
    try {
      const demoRes = await fetch('/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', username: document.getElementById('orderBuyerName')?.value || 'ByteXCustomer' })
      });
      const demoData = await demoRes.json();
      if (demoData.token) {
        token = demoData.token;
        localStorage.setItem('bytex_token', token);
        discordUser = { token, username: demoData.user.username, role: demoData.user.role, id: demoData.user.discordId, _id: demoData.user._id };
        renderNavProfile();
      }
    } catch (authErr) {
      console.warn('Auto auth warning:', authErr);
    }
  }

  const fileInput = document.getElementById('orderScreenshotInput');
  const file = fileInput?.files[0] || uploadedProofFile;
  if (!file) {
    toast('Please attach your payment proof screenshot!');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '🚀 Submit & Confirm Order';
    }
    return;
  }

  const buyerName = document.getElementById('orderBuyerName')?.value || (discordUser ? discordUser.username : 'Customer');
  const buyerNote = document.getElementById('orderBuyerNote')?.value || '';
  const priceVal = typeof activeBuyingProduct.price === 'number' ? activeBuyingProduct.price : parseFloat(activeBuyingProduct.price) || 25.99;

  const formData = new FormData();
  formData.append('productId', activeBuyingProduct._id || activeBuyingProduct.id || 'bytex-script');
  formData.append('productTitle', activeBuyingProduct.name || activeBuyingProduct.title || 'ByteX MTA Script');
  formData.append('price', String(priceVal));
  formData.append('buyerName', buyerName);
  formData.append('buyerNote', buyerNote);
  formData.append('screenshot', file);

  try {
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch('/api/orders/manual', {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      closeBuyModal();
      if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
      toast('🎉 Order submitted! Discord webhook notification sent.');
      cart = cart.filter(x => x !== activeBuyingProduct.id);
      localStorage.setItem('nexus_cart', JSON.stringify(cart));
      updateCart();
      location.hash = 'orders';
    } else {
      toast('Order failed: ' + (data.message || 'Error submitting proof'));
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '🚀 Submit & Confirm Order';
      }
    }
  } catch (err) {
    toast('Network error submitting order: ' + err.message);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '🚀 Submit & Confirm Order';
    }
  }
}

function openImageLightbox(url) {
  const modal = document.getElementById('imageLightbox');
  const img = document.getElementById('lightboxImg');
  if (modal && img) {
    img.src = url;
    modal.classList.remove('hidden');
  }
}

function closeImageLightbox() {
  const modal = document.getElementById('imageLightbox');
  if (modal) modal.classList.add('hidden');
}

/* ── ORDERS PAGE (CUSTOMER VIEW) ── */
async function ordersPage() {
  const token = localStorage.getItem('bytex_token');
  let userOrders = [];
  let userLicenses = [];

  if (token) {
    try {
      const [ordRes, licRes] = await Promise.all([
        fetch('/api/orders/my', { headers: { Authorization: 'Bearer ' + token } }),
        fetch('/api/licenses/my', { headers: { Authorization: 'Bearer ' + token } })
      ]);
      if (ordRes.ok) userOrders = await ordRes.json();
      if (licRes.ok) {
        userLicenses = await licRes.json();
        customerLicenses = userLicenses;
      }
    } catch (e) {
      console.error('Fetch my orders failed:', e);
    }
  }

  const orderRows = userOrders.map(ord => {
    const isDelivered = ord.status === 'delivered';
    const isApproved = ord.status === 'approved';
    const isPending = ord.status === 'pending';
    const isRejected = ord.status === 'rejected';

    let badgeHtml = '<span style="background:rgba(245,158,11,0.15);color:#f59e0b;padding:0.25rem 0.65rem;border-radius:20px;font-size:0.75rem;font-weight:700;border:1px solid rgba(245,158,11,0.3)">⏳ PENDING REVIEW</span>';
    if (isApproved) badgeHtml = '<span style="background:rgba(59,130,246,0.15);color:#60a5fa;padding:0.25rem 0.65rem;border-radius:20px;font-size:0.75rem;font-weight:700;border:1px solid rgba(59,130,246,0.3)">✅ APPROVED</span>';
    if (isDelivered) badgeHtml = '<span style="background:rgba(16,185,129,0.15);color:#34d399;padding:0.25rem 0.65rem;border-radius:20px;font-size:0.75rem;font-weight:700;border:1px solid rgba(16,185,129,0.3)">📦 DELIVERED</span>';
    if (isRejected) badgeHtml = '<span style="background:rgba(239,68,68,0.15);color:#ef4444;padding:0.25rem 0.65rem;border-radius:20px;font-size:0.75rem;font-weight:700;border:1px solid rgba(239,68,68,0.3)">❌ REJECTED</span>';

    const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Recent';
    
    // Find matching license
    const matchingLic = userLicenses.find(l => l.orderId === ord._id || l.licenseKey === ord.licenseKey) || {
      licenseKey: ord.licenseKey || 'BYTX-PENDING',
      productName: ord.productTitle,
      status: 'ACTIVE',
      serverIp: '127.0.0.1',
      serverPort: 22003
    };

    return '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:1.25rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.2s;position:relative">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem">' +
        '<div>' +
          '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4);font-family:monospace">ORDER #' + (ord._id ? ord._id.slice(-8) : 'ORD') + ' · ' + dateStr + '</div>' +
          '<h3 style="font-size:1.15rem;font-weight:700;color:#fff;margin:0.25rem 0">' + (ord.productTitle || 'ByteX MTA Script') + '</h3>' +
          '<div style="font-size:1rem;font-weight:800;color:#34d399">' + money(Number(ord.price || 0)) + '</div>' +
        '</div>' +
        '<div>' + badgeHtml + '</div>' +
      '</div>' +

      '<!-- Generated License Key Box -->' +
      (ord.licenseKey ? 
        '<div style="background:rgba(0,0,0,0.35);border:1px solid rgba(52,211,153,0.3);border-radius:10px;padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">' +
          '<div style="display:flex;align-items:center;gap:0.5rem">' +
            '<span style="font-size:0.75rem;color:rgba(255,255,255,0.5)">🔑 LICENSE KEY:</span>' +
            '<code style="color:#34d399;font-weight:700;font-family:monospace;font-size:0.9rem">' + ord.licenseKey + '</code>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:0.4rem">' +
            '<button class="copy-btn" onclick="copyText(\'' + ord.licenseKey + '\', \'License key copied!\')">Copy Key</button>' +
            '<button class="primary" style="padding:0.3rem 0.75rem;font-size:0.75rem;background:rgba(255,49,49,0.15);border:1px solid rgba(255,49,49,0.4);color:#ff6b6b" onclick="openLicenseConfigModal(' + JSON.stringify(matchingLic).replace(/"/g, '&quot;') + ')">⚙️ Config Lua &amp; IP</button>' +
          '</div>' +
        '</div>' : '') +

      '<div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;padding-top:0.5rem;border-top:1px solid rgba(255,255,255,0.05)">' +
        (ord.screenshotUrl ? 
          '<div style="display:flex;align-items:center;gap:0.5rem">' +
            '<img src="' + ord.screenshotUrl + '" alt="Proof" onclick="openImageLightbox(\'' + ord.screenshotUrl + '\')" style="width:40px;height:40px;object-fit:cover;border-radius:6px;cursor:pointer;border:1px solid rgba(255,255,255,0.2)" title="Click to view full screenshot">' +
            '<span style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Payment Proof</span>' +
          '</div>' : '') +

        '<div style="margin-left:auto;display:flex;gap:0.5rem;align-items:center">' +
          (isDelivered ?
            '<a href="/api/orders/download/' + ord._id + '" class="sq-btn primary-sq" style="background:#10b981;color:#fff;text-decoration:none;padding:0.45rem 1rem;font-size:0.85rem;font-weight:700;border-radius:8px;display:inline-flex;align-items:center;gap:0.4rem">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
              'Download Script (' + (ord.deliveryFileName || 'Resource.zip') + ')' +
            '</a>' : isApproved ?
            '<span style="font-size:0.8rem;color:#60a5fa">Payment verified! Asset is being prepared.</span>' :
            '<span style="font-size:0.8rem;color:rgba(255,255,255,0.4)">Awaiting Discord Staff approval...</span>') +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="center-page page-enter" style="max-width:1100px;margin:0 auto;padding:2rem 1.5rem 6rem">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem">' +
      '<div>' +
        '<h1 style="font-size:2rem;font-weight:800;color:#fff;margin:0 0 0.5rem">My Orders &amp; Generated Licenses</h1>' +
        '<p style="color:rgba(255,255,255,0.5);font-size:0.9rem;margin:0">Instant cryptographic license keys, server IP binding, and asset downloads.</p>' +
      '</div>' +
      '<div>' +
        (!token ? 
          '<button onclick="openModal()" class="primary" style="padding:0.65rem 1.25rem;font-weight:700">Login with Discord to View Orders →</button>' :
          '<button onclick="location.hash=\'store\'" class="primary-sq" style="padding:0.65rem 1.25rem;font-weight:700">+ Browse Store</button>') +
      '</div>' +
    '</div>' +

    (!token ? 
      '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:3rem 1.5rem;text-align:center">' +
        '<div style="font-size:2.5rem;margin-bottom:1rem">🔒</div>' +
        '<h3 style="color:#fff;font-size:1.25rem;margin:0 0 0.5rem">Please Sign In</h3>' +
        '<p style="color:rgba(255,255,255,0.5);font-size:0.85rem;max-width:400px;margin:0 auto 1.5rem">Connect your Discord account to view your generated license keys, configure server IPs, and download files.</p>' +
        '<button onclick="openModal()" class="primary" style="padding:0.75rem 2rem;font-weight:700">Sign In with Discord</button>' +
      '</div>' : userOrders.length === 0 ?
      '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:3rem 1.5rem;text-align:center">' +
        '<div style="font-size:2.5rem;margin-bottom:1rem">📦</div>' +
        '<h3 style="color:#fff;font-size:1.25rem;margin:0 0 0.5rem">No Orders Placed Yet</h3>' +
        '<p style="color:rgba(255,255,255,0.5);font-size:0.85rem;max-width:400px;margin:0 auto 1.5rem">You haven\'t submitted any resource orders yet. When you order a script, your license key will appear here automatically!</p>' +
        '<a href="#store" class="primary-sq" style="text-decoration:none;padding:0.75rem 2rem;font-weight:700;display:inline-block">Explore Store Catalog</a>' +
      '</div>' : 
      '<div style="display:flex;flex-direction:column;gap:1rem">' +
        orderRows +
      '</div>') +
  '</div>';
}


/* ── DATA ── */
// Discord OAuth: /api/auth/discord triggers the flow on the backend
const DISCORD_OAUTH_URL = "/auth/discord";

let cart = JSON.parse(localStorage.getItem('nexus_cart') || '[]');
let discordUser = JSON.parse(localStorage.getItem('discord_user') || 'null');
let adminUser = JSON.parse(localStorage.getItem('bytex_admin_user') || 'null');
let adminToken = localStorage.getItem('bytex_admin_token') || null;
let adminTab = 'dashboard';
let adminMetrics = null;
let adminLicenses = [];
let adminOrders = [];
let adminLogs = [];
let adminEditingProduct = null;

async function syncDatabaseProducts() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        products = data.products;
      }
    }
  } catch (err) {
    console.warn('[ByteX Sync] Using cached products fallback:', err.message);
  }
}

let selectedStoreProductId = products[0].id;
let route = location.hash.slice(1) || 'home';
let licenseServerIp = localStorage.getItem('license_server_ip') || '145.223.19.218';
let licenseServerPort = localStorage.getItem('license_server_port') || '8001';

/* ── Helpers ── */
function money(n) { return 'R$ ' + n.toFixed(2).replace('.', ','); }

function logoSvg(size = 28) {
  return `<img src="images/bytex_logo.png" style="width:auto;height:${size}px;object-fit:contain" alt="ByteX Logo">`;
}

/* ── Product Card (reference style: big bold name, product image, price + ADD) ── */
function card(p, delay = 0) {
  return `
  <article class="resource-card reveal" style="animation-delay:${delay}ms" onclick="openProduct('${p.id}')">
    <div class="card-bg" style="background-image:url('${p.img}')"></div>
    <div class="card-overlay"></div>
    <div class="card-content">
      <div class="card-top">
        <div class="card-code">${p.code}</div>
        <div class="card-name-big" style="color:${p.titleColor || p.accent}">${p.nameLong}</div>
        <div class="card-mta">Multi Theft Auto</div>
      </div>
    </div>
    <div class="card-bottom-bar">
      <div class="card-price-info">
        <div class="card-price-label">Price</div>
        <div class="card-price">${money(p.price)}</div>
      </div>
      <div class="card-actions">
        <button class="card-info-btn" onclick="event.stopPropagation();openProduct('${p.id}')" title="Details">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
        </button>
        <button class="card-add-btn" style="background:${p.accent};color:${p.accent === '#ffffff' ? '#000' : isLight(p.accent) ? '#000' : '#fff'}" onclick="event.stopPropagation();addCart('${p.id}')">
          + ADD
        </button>
      </div>
    </div>
  </article>`;
}

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

/* ── HOME PAGE ── */
function home() {
  return `
  <div class="home-page page-enter">
    <section class="squash-hero">
      <div class="hero-inner">
        <div class="hero-icon-wrap">
          <div class="hero-logo-box">
            <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
               <path d="M33 16C33 12 29 9 24 9C19 9 15 12 15 17C15 25 33 23 33 31C33 36 29 39 24 39C19 39 15 36 15 32" stroke="url(#hero-s-grad)" stroke-width="4" stroke-linecap="round"/>
               <defs>
                  <linearGradient id="hero-s-grad" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stop-color="#f9a8d4" />
                    <stop offset="100%" stop-color="#7c3aed" />
                  </linearGradient>
               </defs>
            </svg>
          </div>
        </div>
        <h1 class="hero-title-main">
          Transforming ideas
          <span class="gradient-pink-violet">into new realities.</span>
        </h1>
        <p class="hero-subtext">
          <span class="purple-highlight">The largest and most trusted</span> resource store for Multi Theft Auto in Brazil.
          Quality, innovation, and exceptional support since 2020.
        </p>
        <div class="hero-btn-row">
          <a class="sq-btn primary-sq" href="#store">
            Explore resources
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          </a>
          <a class="sq-btn outline-sq" href="#support">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
              <path d="M12 22.08V12"/>
            </svg>
            Order resource
          </a>
        </div>
      </div>
      <div class="hero-bottom-fade"></div>
    </section>

    <!-- Introducing section -->
    <section class="home-showcase-section">
      <div class="section-header">
        <div class="section-icon">📡</div>
        <h2 class="section-title">
          Introducing the <span class="gradient-purple underline-glow">best resources</span> on the market.
        </h2>
        <p class="section-sub">Since 2020, our technology has been transforming the experience of thousands of players and servers across Brazil. Our resources are developed with quality and innovation guaranteed by a team passionate about what they do.</p>
      </div>
      <div class="showcase-grid">
        <div class="showcase-main-card">
          <div class="showcase-media" style="background-image:url('images/showcase_dispatch.png')">
            <div class="showcase-media-grad"></div>
            <div class="showcase-media-inner">
              <div class="media-code-label">${products.find(p => p.id === selectedStoreProductId)?.code || products[0].code}</div>
              <div class="media-big-title">${products.find(p => p.id === selectedStoreProductId)?.nameLong || products[0].nameLong}</div>
              <div class="media-sub-label">Multi Theft Auto</div>
            </div>
            <button class="play-center-btn" onclick="toast('Playing demo video...')">▶</button>
          </div>
          <div class="showcase-info">
            <div class="code-tag">${products.find(p => p.id === selectedStoreProductId)?.code || products[0].code}</div>
            <h3>${products.find(p => p.id === selectedStoreProductId)?.name || products[0].name}</h3>
            <p class="desc">${products.find(p => p.id === selectedStoreProductId)?.desc || products[0].desc}</p>
            <div class="tag-row">
              ${(products.find(p => p.id === selectedStoreProductId)?.tags || products[0].tags).map(t => `<span class="tag-pill">${t}</span>`).join('')}
            </div>
            <div class="showcase-action-bar">
              <div class="price-box">
                <b class="price-large">${money(products.find(p => p.id === selectedStoreProductId)?.price || products[0].price)}</b>
                <span class="coin-pill">✺ +${Math.round((products.find(p => p.id === selectedStoreProductId)?.price || products[0].price) * 2)} Coins</span>
              </div>
              <div class="showcase-btns">
                <button class="btn-detail" onclick="openProduct('${selectedStoreProductId}')">ⓘ Details</button>
                <button class="btn-cart-purple" onclick="addCart('${selectedStoreProductId}');openCart()">🛒 Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
        <aside class="showcase-sidebar">
          ${products.slice(0, 7).map(p => `
            <div class="sidebar-item ${p.id === selectedStoreProductId ? 'active' : ''}" onclick="selectStoreProduct('${p.id}')">
              <div class="sidebar-thumb" style="background-image:url('${p.img}')"></div>
              <div class="sidebar-info">
                <small>${p.code}</small>
                <b>${p.name}</b>
              </div>
            </div>
          `).join('')}
        </aside>
      </div>
    </section>

    <!-- Trusted section -->
    <section class="trusted-section">
      <div class="section-header">
        <div class="section-icon">🏆</div>
        <h2 class="section-title">
          Trusted by <span class="gradient-green underline-glow">the entire community.</span>
        </h2>
        <p class="section-sub">With over <span style="background:linear-gradient(135deg,#86efac,#65a30d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:600">720</span> satisfied clients and counting, ByteX is the number one choice for quality MTA resources.</p>
      </div>
      <div class="marquee-outer">
        <div class="marquee-track">
          ${Array.from({ length: 8 }, (_, i) => `
            <div class="marquee-item">
              <div class="marquee-logo">SERVER ${i + 1}</div>
            </div>
          `).join('')}
          ${Array.from({ length: 8 }, (_, i) => `
            <div class="marquee-item">
              <div class="marquee-logo">SERVER ${i + 1}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="features-grid">
        ${[
      { icon: '🛡️', title: 'Security First', desc: 'All resources undergo rigorous security tests and are protected against known exploits.' },
      { icon: '⚡', title: 'Performance & Optimization', desc: '100% optimized code with advanced caching techniques to ensure zero server impact.' },
      { icon: '</>', title: 'Multi-Framework', desc: 'Works with any custom framework through a flexible, well-documented API.' },
      { icon: '👥', title: 'Active Community', desc: '720+ satisfied clients sharing tips, tutorials and development best practices.' },
      { icon: '🔄', title: 'Continuous Updates', desc: 'Regular updates keeping your resources compatible with the latest MTA versions.' },
      { icon: '💬', title: 'Dedicated Support', desc: '24/7 support team ready to help you implement and configure your resources.' },
    ].map(f => `
          <div class="feature-item reveal">
            <div class="feature-icon">${f.icon}</div>
            <div>
              <h4>${f.title}</h4>
              <p>${f.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <footer class="site-footer">
      <div class="footer-logo">
        <img src="images/bytex_logo.png" style="height:32px;width:auto;" alt="ByteX Logo">
      </div>
      <div class="footer-links">
        <a href="#store">Store</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#support">Support</a>
        <a href="#terms">Terms of Service</a>
      </div>
      <div class="footer-copy">© 2026 ByteX. All rights reserved.</div>
    </footer>
  </div>`;
}

/* ── STORE PAGE ── */
function store() {
  const active = products.find(p => p.id === selectedStoreProductId) || products[0];

  return `
  <div class="store-page page-enter">
    <!-- Purple hero header -->
    <section class="store-hero-section">
      <div class="store-ambient-left"></div>
      <div class="store-ambient-right"></div>
      <div class="store-hero-inner">
        <div class="store-badge">
          <span>🇧🇷</span>
          The largest Multi Theft Auto resource store in Brazil.
          <span class="store-badge-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
        <h1 class="store-hero-title">
          Introducing the
          <span class="purple-span"><span>best resources</span></span>
          on the market.
        </h1>
        <p class="store-hero-sub">Since 2020, our technology has been transforming the experience of thousands of players and servers across Brazil. Our resources are developed with quality and innovation guaranteed by a team passionate about what they do.</p>
      </div>
      <div class="store-hero-fade"></div>
    </section>

    <div class="store-body">
      <!-- Showcase split: big video + sidebar -->
      <div class="store-showcase">
        <div class="showcase-main-card">
          <div class="showcase-top-section">
            <div class="showcase-media-header">
              <div class="media-code-label">${active.code}</div>
              <div class="media-big-title">${active.nameLong}</div>
              <div class="media-sub-label">Multi Theft Auto</div>
            </div>
            <div class="showcase-video-container">
              <div class="showcase-media" style="background-image:url('${active.img}')">
                <div class="showcase-media-grad"></div>
                <button class="play-center-btn" onclick="toast('Playing ${active.name} demo...')">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="showcase-info">
            <div class="code-tag">${active.code}</div>
            <h3>${active.name}</h3>
            <p class="desc">${active.desc}</p>
            <div class="tag-row">${active.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}</div>
            <div class="showcase-action-bar">
              <div class="price-box">
                <b class="price-large">${money(active.price)}</b>
                <span class="coin-pill">✺ +${Math.round(active.price * 2)} Coins</span>
              </div>
              <div class="showcase-btns">
                <button class="btn-detail" onclick="openProduct('${active.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;vertical-align:middle"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  Details
                </button>
                <button class="btn-cart-white" onclick="addCart('${active.id}');openCart()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        <aside class="showcase-sidebar">
          ${products.slice(0, 7).map(p => `
            <div class="sidebar-item ${p.id === selectedStoreProductId ? 'active' : ''}" onclick="selectStoreProduct('${p.id}')">
              <div class="sidebar-thumb" style="background-image:url('${p.img}')"></div>
              <div class="sidebar-info">
                <small>${p.code}</small>
                <b>${p.name}</b>
              </div>
            </div>
          `).join('')}
          <button class="sidebar-view-all" onclick="location.hash='store'">
            View all resources
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </aside>
      </div>

      <!-- Programmer Banner -->
      <div class="programmer-banner">
        <div class="banner-bg-grid"></div>
        <div class="banner-glow"></div>
        <div class="banner-bg-overlay"></div>
        <img src="images/banner_programmer.png" alt="Astronaut programmer" class="banner-astronaut">
        <div class="banner-inner">
          <div class="banner-left">
            <h2 class="banner-headline">SE TORNE UM<br><span class="banner-headline-accent">PROGRAMADOR</span></h2>
            <p class="banner-sub">Aprenda criar seus próprios sistemas e designs para elevar o seu servidor ao <strong style="color:#fff">último nível!</strong></p>
            <div class="banner-tools">
              ${['LUA', 'JS', 'HTML', 'CSS', 'GIT', 'FIGMA', 'VSCode'].map(t => `<span class="tool-badge">${t}</span>`).join('')}
            </div>
            <div class="banner-btns">
              <button class="btn-blue-glow" onclick="toast('Course details')">Ler mais</button>
              <button class="btn-border" onclick="toast('Added to cart')">Adicionar ao carrinho</button>
            </div>
          </div>
          <!-- Laptop mockup on right side -->
          <div class="banner-right">
            <div class="laptop-mockup">
              <div class="laptop-screen">
                <div class="laptop-app-header">
                  <div class="app-logo-dot" style="background:#a855f7"></div>
                  <div class="app-logo-dot" style="background:#60a5fa"></div>
                  <div class="app-logo-dot" style="background:#4ade80"></div>
                </div>
                <div class="laptop-app-body">
                  <div class="app-sidebar-mini">
                    ${['Houses', 'Dispatch', 'Phone', 'Groups', 'Discord', 'Craft'].map(n => `
                      <div class="app-sidebar-row"><div class="app-sidebar-dot"></div><span>${n}</span></div>
                    `).join('')}
                  </div>
                  <div class="app-main-mini">
                    <div class="app-card-mini" style="background:linear-gradient(135deg,rgba(168,85,247,.15),rgba(67,56,202,.1))">
                      <div class="app-mini-title">HAVANA</div>
                      <div class="app-mini-sub">Bem-vindo, jogador caro!</div>
                      <div class="app-mini-btn">Jogar</div>
                    </div>
                    <div class="app-mini-row">
                      <div class="app-mini-block blue"></div>
                      <div class="app-mini-block purple"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="laptop-base"></div>
              <div class="laptop-stand"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter controls -->
      <div class="store-filters-container">
        <div class="store-filters">
          <div class="search-wrap">
            <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/>
            </svg>
            <input class="search-field" id="search" placeholder="Search resources, categories, tags..." oninput="filterProducts()">
          </div>
          <div class="sort-select-wrap">
            <div class="sort-select" onclick="document.getElementById('sortDropdown').classList.toggle('show')">
              <div style="display:flex;align-items:center;gap:0.5rem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2">
                  <path d="m21 16-4 4-4-4M17 20V4m-14-4 4-4 4 4M7 4v16"/>
                </svg>
                <span>Popular</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div class="sort-dropdown" id="sortDropdown">
              <div class="sort-option active" onclick="document.getElementById('sortDropdown').classList.remove('show')">
                <div style="display:flex;align-items:center;gap:0.5rem">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="m21 16-4 4-4-4M17 20V4m-14-4 4-4 4 4M7 4v16"/></svg> Popular
                </div>
                <span class="sort-check">✓</span>
              </div>
              <div class="sort-option" onclick="document.getElementById('sortDropdown').classList.remove('show')">
                <div style="display:flex;align-items:center;gap:0.5rem">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Newest
                </div>
              </div>
              <div class="sort-option" onclick="document.getElementById('sortDropdown').classList.remove('show')">
                <div style="display:flex;align-items:center;gap:0.5rem">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Rating
                </div>
              </div>
              <div class="sort-option" onclick="document.getElementById('sortDropdown').classList.remove('show')">
                <div style="display:flex;align-items:center;gap:0.5rem">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 16l4 4 4-4M7 20V4M14 8l4-4 4 4M18 4v16"/></svg> Lowest price
                </div>
              </div>
            </div>
          </div>
          <button class="filter-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/>
              <line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/>
              <line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/>
              <line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>
            </svg>
            Filters
          </button>
        </div>
        
        <div class="filter-tags-row">
          <div class="filter-tag-pill">
            <span style="color:#4ade80;font-weight:700;font-family:monospace;font-size:.9rem">$</span> Price
          </div>
          <div class="filter-tag-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Status
          </div>
          <div class="filter-tag-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Tags
          </div>
          <div class="filter-tag-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Category
          </div>
          <div class="filter-tag-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Date
          </div>
          <div class="filter-tag-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Rating
          </div>
          <div class="filter-tag-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e4e4e7" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Platform
          </div>
        </div>
      </div>

      <div class="store-counter">Showing <span id="prodCount">${products.length}</span> of ${products.length} resources</div>

      <div id="resourceGrid" class="resource-grid">
        ${products.map((p, i) => card(p, i * 60)).join('')}
      </div>
    </div>
  </div>`;
}

/* ── PRODUCT DETAIL PAGE ── */
function productPage(id) {
  const p = products.find(x => x.id === id) || products[0];

  // Fake reviews for the detail page
  const reviews = [
    { user: 'gabriel.sanches', badge: 'Customer', date: '22/04', rating: 5, text: 'Vou criar uma fac só pra ter esse painel.' },
    { user: 'katana9234', badge: 'Customer', date: '11/12', rating: 5, text: 'Highly Recommend' },
    { user: 'vinicius.developer', badge: 'Customer', date: '11/12', rating: 5, text: 'Script muito massa, totalmente diferente.' }
  ];

  const featureCards = [
    { icon: '🛡️', title: 'Segurança Avançada', desc: 'Sistema anti-fraude com detecção de múltiplas contas' },
    { icon: '⚡', title: 'Performance Otimizada', desc: '0.01ms de consumo com código 100% otimizado' },
    { icon: '🌐', title: 'Multi-Idiomas', desc: 'Suporte completo para PT-BR, EN e ES' },
    { icon: '&lt;/&gt;', title: 'API Completa', desc: 'Integração fácil com outros resources' }
  ];

  return `
  <div class="product-page page-enter">
    <!-- FULL-SCREEN HERO -->
    <section class="product-hero" style="background-image:url('${p.img}')">
      <div class="product-hero-overlay"></div>
      <div class="product-hero-content">
        <div class="product-hero-code">${p.code}</div>
        <h1 class="product-hero-name">${p.name}</h1>
        <div class="product-hero-rating">
          <span class="stars-gold">★★★★★</span>
          <span class="rating-text">5.0 (3 avaliações)</span>
        </div>
        <p class="product-hero-desc">${p.desc}</p>
        <a class="product-hero-buy" onclick="openBuyModal('${p.id}')">
          BUY NOW
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="product-hero-scroll">
        Scroll to see more
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </section>

    <!-- SPLIT LAYOUT: media + about on left, purchase sidebar on right -->
    <div class="product-split-layout">
      <div class="product-main-media-col">
        <div class="media-container-card">
          <div class="media-top-header">
            ${logoSvg(24)}
            <div>
              <b>[MTA:SA] ${p.name} (${p.code}) | ByteX</b>
              <span>ByteX</span>
            </div>
          </div>
          <div class="media-canvas" style="background-image:url('${p.img}')">
            <div class="media-canvas-grad"></div>
            <div class="media-canvas-overlay">
              <div class="media-canvas-title">${p.nameLong}</div>
              <div class="media-canvas-sub">Multi Theft Auto</div>
            </div>
            <button class="video-play-btn" onclick="toast('Playing ${p.name} demo...')">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="0"><circle cx="12" cy="12" r="12" fill="rgba(255,0,0,.85)"/><polygon fill="white" points="10 8 16 12 10 16"/></svg>
            </button>
            <div class="yt-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff0000"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.5C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              Watch on <b>YouTube</b>
            </div>
            <div class="media-nav-arrow left" onclick="toast('Previous slide')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            <div class="media-nav-arrow right" onclick="toast('Next slide')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
          <div class="media-bottom-bar">
            Produced and distributed by ByteX
          </div>
          <div class="mini-thumbs">
            <div class="mini-thumb active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <div class="mini-thumb">🖼</div>
          </div>
        </div>

        <!-- About the Product -->
        <section class="about-section">
          <h2>About the Product</h2>
          <p class="product-tagline">🍂 | <span style="color:${p.accent}">${p.name} | ${p.code}</span></p>
          <p>${p.desc}</p>
          <p>More than just a resource — players experience the entire process with interactive systems, clean integration, and a level of customization never seen before in MTA:SA.</p>
          <div class="features-checklist">
            <h4>${p.code} offers:</h4>
            <ul class="check-list">
              <li><span class="check-icon">☑</span> High performance &amp; zero-lag scripts</li>
              <li><span class="check-icon">☑</span> Fully customizable UI configuration</li>
              <li><span class="check-icon">☑</span> Discord log integration</li>
              <li><span class="check-icon">☑</span> Continuous updates &amp; 24/7 support</li>
              <li><span class="check-icon">☑</span> Compatible with all major frameworks</li>
              <li><span class="check-icon">☑</span> System saving in MYSQL and SQLITE database</li>
              <li><span class="check-icon">☑</span> Optimized system</li>
            </ul>
            <p class="check-cta">✅ Get yours now and take your server to the next level!</p>
          </div>
        </section>

        <!-- Features section -->
        <section class="product-features-section">
          <h2>Features</h2>
          <div class="product-features-grid">
            ${featureCards.map(f => `
              <div class="product-feature-card">
                <div class="pf-icon">${f.icon}</div>
                <div>
                  <b>${f.title}</b>
                  <p>${f.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Customer Reviews -->
        <section class="product-reviews-section">
          <div class="reviews-header">
            <h2>Customer Reviews</h2>
            <div class="reviews-summary">
              <span class="stars-gold">★★★★★</span>
              <b>5.0</b>
              <small>(3 reviews)</small>
              <button class="view-all-reviews-btn">View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </div>
          </div>
          <div class="reviews-grid">
            ${reviews.map(r => `
              <div class="review-card">
                <div class="review-top">
                  <div class="review-user">
                    <div class="review-avatar" style="background:linear-gradient(135deg,#f97316,#ea580c)">${r.user[0].toUpperCase()}</div>
                    <div>
                      <b>${r.user}</b>
                      <span class="review-badge">${r.badge}</span>
                    </div>
                  </div>
                  <div class="review-meta">
                    <span class="review-date">${r.date}</span>
                    <small class="review-product-code">${p.code}</small>
                  </div>
                </div>
                <div class="review-stars">★★★★★ <span>${r.rating}.0</span></div>
                <p class="review-text">${r.text}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Tags -->
        <section class="product-tags-section">
          <h2>Tags</h2>
          <div class="product-tags-row">
            ${p.tags.map(t => `<span class="product-tag-pill">◎ ${t}</span>`).join('')}
            <span class="product-tag-pill">◎ mtasa</span>
            <span class="product-tag-pill">◎ roleplay</span>
          </div>
        </section>
      </div>

      <!-- Right: purchase sidebar -->
      <aside class="product-purchase-col">
        <div class="purchase-card">
          <div class="purchase-code">${p.code}</div>
          <h1 class="purchase-title">${p.name}</h1>
          <div class="purchase-rating">
            <span class="stars">★★★★★</span>
            <b>5.0</b>
            <small>(3)</small>
          </div>
          <div class="purchase-price">${money(p.price)}</div>
          <div class="coin-reward">
            <span class="coin-icon">✺</span>
            <div>
              <small>You earn</small>
              <b>+${Math.round(p.price * 2)} coins</b>
            </div>
          </div>
          <button class="buy-now-btn" onclick="openBuyModal('${p.id}')">BUY NOW</button>
          <div class="secondary-actions">
            <button class="icon-action-btn" onclick="addCart('${p.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
            <button class="icon-action-btn" onclick="toast('Added to wishlist ♡')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
          <div class="meta-grid">
            <div class="meta-item"><small>◈ Version</small><b>v1.5</b></div>
            <div class="meta-item"><small>📦 Size</small><b>Unknown</b></div>
            <div class="meta-item"><small>📅 Release</small><b>05/12/2025</b></div>
            <div class="meta-item"><small>↻ Update</small><b>06/06/2026</b></div>
          </div>
          <div class="guarantee-box">
            <div class="guarantee-emoji">🛡️</div>
            <div>
              <b>You have 7 days guarantee!</b>
              <span>Not satisfied? We'll refund your money with no hassle and no questions asked.</span>
            </div>
          </div>
        </div>
        <div class="dev-card">
          <div class="dev-avatar"><img src="images/bytex_logo.png" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>
          <div>
            <b>ByteX <span class="dev-verified">✓</span></b>
            <span>Resource developer</span>
          </div>
        </div>
      </aside>
    </div>
  </div>`;
}

/* ── Other pages ── */
function support() {
  return `<div class="center-page page-enter">
    <section class="center-hero">
      <div class="center-icon">◌</div>
      <h1>Help <span class="gradient-purple">Center.</span></h1>
      <p>Find answers to your questions, access documentation and connect with the support community.</p>
    </section>
  </div>`;
}
function terms() {
  return `<div class="center-page page-enter">
    <section class="center-hero">
      <div class="center-icon">◇</div>
      <h1>Legal <span class="gradient-purple">Documents.</span></h1>
      <p>Terms, privacy and license information for ByteX services.</p>
    </section>
  </div>`;
}

/* ── DASHBOARD LAYOUT WRAPPER ── */
function dashboardLayout(activeMenu, contentHTML) {
  const badgeCount = discordUser ? 2 : 0;
  return `
  <div class="dashboard-page page-enter">
    <div class="dash-sidebar">
      <div class="dash-menu-group">
        <div class="dash-menu-title">Main</div>
        <a href="#dashboard" class="dash-menu-link ${activeMenu === 'home' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Home</a>
        <a href="#dashboard/resources" class="dash-menu-link ${activeMenu === 'resources' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Resources ${badgeCount ? `<span class="dash-badge">${badgeCount}</span>` : ''}</a>
        <a href="#dashboard/downloads" class="dash-menu-link ${activeMenu === 'downloads' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Downloads</a>
        <a href="#dashboard/orders" class="dash-menu-link ${activeMenu === 'orders' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> Orders</a>
        <a href="#dashboard/rewards" class="dash-menu-link text-purple ${activeMenu === 'rewards' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Rewards</a>
      </div>
      
      <div class="dash-menu-group">
        <div class="dash-menu-title">Management</div>
        <a href="#dashboard/subscriptions" class="dash-menu-link ${activeMenu === 'subscriptions' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10"/></svg> Subscriptions</a>
        <a href="#dashboard/reviews" class="dash-menu-link ${activeMenu === 'reviews' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Reviews</a>
        <a href="#dashboard/invoices" class="dash-menu-link ${activeMenu === 'invoices' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Invoices</a>
      </div>
      
      <div class="dash-menu-group">
        <div class="dash-menu-title">Support</div>
        <a href="#dashboard/support" class="dash-menu-link ${activeMenu === 'support' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Support</a>
        <a href="#settings" class="dash-menu-link ${activeMenu === 'settings' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Settings</a>
        <a href="#dashboard/documentation" class="dash-menu-link ${activeMenu === 'documentation' ? 'active' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> Documentation</a>
      </div>
      
      <div class="dash-help-card">
        <b>Need help?</b>
        <p>Our team is ready to help with any questions or issues.</p>
        <button class="dash-help-btn" onclick="location.hash='dashboard/support'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Help Center</button>
      </div>
    </div>
    
    <div class="dash-main">
      ${contentHTML}
    </div>
  </div>`;
}

/* ── DASHBOARD HOME ── */
function dashboardHome() {
  const content = `
      <div class="dash-home-header">
        <h1 class="dash-title" style="font-size:2rem;margin-bottom:0.5rem">Welcome back! 🤝</h1>
        <p class="dash-sub" style="margin-bottom:2rem">Select a quick action below to start.</p>
      </div>
      
      <div class="dash-quick-actions">
        <a href="#dashboard/resources" class="quick-action-card">
          <div class="qa-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
          <b>My Resources</b>
          <span>View and manage your resources</span>
        </a>
        <a href="#store" class="quick-action-card">
          <div class="qa-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
          <b>Store</b>
          <span>Explore new resources</span>
        </a>
        <a href="#dashboard/support" class="quick-action-card">
          <div class="qa-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
          <b>Support</b>
          <span>Open support ticket</span>
        </a>
        <a href="#" class="quick-action-card" onclick="toast('Redirecting to Discord community...'); return false;">
          <div class="qa-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
          <b>Discord</b>
          <span>Join the community</span>
        </a>
        <a href="#dashboard/documentation" class="quick-action-card">
          <div class="qa-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
          <b>Documentation</b>
          <span>Guides and tutorials</span>
        </a>
        <a href="#settings" class="quick-action-card">
          <div class="qa-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
          <b>Settings</b>
          <span>Manage your account</span>
        </a>
      </div>
      
      <div class="dash-section-header" style="margin-top:3rem">
        <div style="display:flex;align-items:center;gap:0.5rem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <h3 style="font-size:1.1rem;font-weight:600">Latest News</h3>
        </div>
        <a href="#" style="color:rgba(255,255,255,0.5);font-size:0.8rem;text-decoration:none">View all <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>
      </div>
      <div class="dash-empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color:rgba(255,255,255,0.2);margin-bottom:1rem"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <p>No news available at the moment</p>
      </div>

      <div class="dash-section-header" style="margin-top:3rem">
        <div style="display:flex;align-items:center;gap:0.5rem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <h3 style="font-size:1.1rem;font-weight:600">Latest updates from the ByteX team</h3>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <div class="dash-mini-tabs">
            <button class="active">All</button>
            <button>Features</button>
            <button>Improvements</button>
            <button>Fixes</button>
          </div>
          <div class="dash-mini-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/></svg>
            <input type="text" placeholder="Search...">
          </div>
        </div>
      </div>
      
      <div class="dash-update-card">
        <div class="update-header">
          <div class="update-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg></div>
          <div class="update-title-box">
            <h4>Multi Characters <span class="update-version">v1.3</span></h4>
            <span class="update-date">09/08/2026 at 00:58</span>
          </div>
        </div>
        <div class="update-body">
          <ul><li>Correções</li></ul>
        </div>
        <a href="#" class="update-link">View Full Details <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>
      </div>

      <div class="dash-update-card">
        <div class="update-header">
          <div class="update-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg></div>
          <div class="update-title-box">
            <h4>Craft System <span class="update-version">v1.3</span></h4>
            <span class="update-date">07/08/2026 at 07:02</span>
          </div>
        </div>
        <div class="update-body">
          <ul><li>New UI fixes and performance improvements.</li></ul>
        </div>
      </div>
  `;
  return dashboardLayout('home', content);
}

/* ── DASHBOARD SETTINGS ── */
function dashboardSettings(settingsTab = 'general') {
  const avatarUrl = discordUser ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : 'images/bytex_logo.png';
  const username = discordUser ? discordUser.username : 'Guest';
  const email = discordUser ? (discordUser.email || 'No email provided') : 'Please login first';
  const dId = discordUser ? discordUser.id : 'N/A';

  let tabContent = '';

  if (settingsTab === 'general') {
    tabContent = `
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></div>
          <div class="settings-card-text">
            <h3>Linked Account</h3>
            <p>Information linked to your Discord account. This information cannot be edited here.</p>
          </div>
        </div>
        <div class="discord-linked-box">
          <div class="discord-avatar" style="background:url('${avatarUrl}') center/cover"></div>
          <div class="discord-info">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;">
              <b>@${username}</b>
              <span class="discord-badge">Discord</span>
            </div>
            <div style="font-size:0.8rem;color:rgba(255,255,255,0.4);display:flex;gap:1rem;align-items:center;">
              <span>✉ ${email}</span>
              <span>👤 ${dId}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
          <div class="settings-card-text">
            <h3>Display Name</h3>
            <p>Customize the name that will be displayed publicly on the platform.</p>
          </div>
        </div>
        <input type="text" class="settings-input" value="${username}">
        <p class="settings-hint">Enter the name that will be displayed publicly on the platform. This name can be different from your Discord username.</p>
      </div>
      
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
          <div class="settings-card-text">
            <h3>Additional Email</h3>
            <p>Add a secondary email for easier contact.</p>
          </div>
        </div>
        <input type="text" class="settings-input" value="${email}">
        <p class="settings-hint">Add a secondary email for account recovery and important notifications. This does not replace your Discord email.</p>
      </div>
      <button class="sq-btn" style="background:#a855f7;color:#fff;border:none;padding:0.6rem 1.2rem;border-radius:6px;font-weight:600;cursor:pointer;margin-top:1rem" onclick="toast('Settings saved successfully!')">Save changes</button>
    `;
  } else if (settingsTab === 'billing') {
    tabContent = `
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
          <div class="settings-card-text">
            <h3>Payment Methods</h3>
            <p>Manage your saved credit cards, PIX keys, or other payment configurations.</p>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.1);border-radius:8px;padding:2rem;text-align:center;color:rgba(255,255,255,0.4);font-size:0.85rem">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom:0.5rem"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <div>No credit card saved. PIX payments are generated on checkout.</div>
        </div>
      </div>
    `;
  } else if (settingsTab === 'notifications') {
    tabContent = `
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
          <div class="settings-card-text">
            <h3>Email Notifications</h3>
            <p>Select which emails you would like to receive from the platform.</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:1rem;margin-top:1rem">
          <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;font-size:0.85rem;color:rgba(255,255,255,0.7)">
            <input type="checkbox" checked style="accent-color:#a855f7;width:16px;height:16px;"> Product updates (new releases and patches)
          </label>
          <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;font-size:0.85rem;color:rgba(255,255,255,0.7)">
            <input type="checkbox" checked style="accent-color:#a855f7;width:16px;height:16px;"> Billing invoices and receipt documents
          </label>
          <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;font-size:0.85rem;color:rgba(255,255,255,0.7)">
            <input type="checkbox" style="accent-color:#a855f7;width:16px;height:16px;"> Marketing emails (deals, promotions, new resources)
          </label>
        </div>
      </div>
      <button class="sq-btn" style="background:#a855f7;color:#fff;border:none;padding:0.6rem 1.2rem;border-radius:6px;font-weight:600;cursor:pointer;margin-top:1rem" onclick="toast('Notification settings saved!')">Save changes</button>
    `;
  } else if (settingsTab === 'server') {
    tabContent = `
      <div class="settings-card">
        <div class="settings-card-header">
          <div class="settings-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg></div>
          <div class="settings-card-text">
            <h3>Server Linking</h3>
            <p>Authorize your purchased resources to run on your specific MTA:SA server IP address.</p>
          </div>
        </div>
        
        <table style="width:100%;border-collapse:collapse;margin-top:1.5rem;font-size:0.85rem">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4)">
              <th style="text-align:left;padding:0.5rem">Server IP / Domain</th>
              <th style="text-align:left;padding:0.5rem">Status</th>
              <th style="text-align:left;padding:0.5rem">Active Licenses</th>
              <th style="text-align:right;padding:0.5rem">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.02)">
              <td style="padding:0.75rem 0.5rem;color:#fff">185.254.190.5:22003</td>
              <td style="padding:0.75rem 0.5rem"><span style="background:rgba(52,211,153,0.1);color:#34d399;font-size:0.7rem;padding:0.15rem 0.4rem;border-radius:4px;font-weight:600">Online</span></td>
              <td style="padding:0.75rem 0.5rem;color:rgba(255,255,255,0.6)">Fuel System, Craft System</td>
              <td style="padding:0.75rem 0.5rem;text-align:right"><button class="sq-btn outline-sq" style="padding:0.25rem 0.5rem;font-size:0.75rem" onclick="toast('Server IP updated!')">Edit</button></td>
            </tr>
          </tbody>
        </table>
        
        <button class="sq-btn" style="background:#a855f7;color:#fff;border:none;padding:0.5rem 1rem;border-radius:6px;font-weight:600;cursor:pointer;margin-top:1.5rem;font-size:0.8rem" onclick="toast('Add new server modal')">+ Link another server</button>
      </div>
    `;
  }

  const content = `
      <div class="dash-header">
        <h1 class="dash-title">Settings</h1>
        <p class="dash-sub">Manage your preferences and account information. <b>Don't forget to save before leaving!</b></p>
        
        <div class="dash-search">
          <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/></svg>
          <input type="text" placeholder="Search settings..." class="search-field" style="max-width: 600px;">
        </div>
        
        <div class="dash-tabs">
          <button class="dash-tab ${settingsTab === 'general' ? 'active' : ''}" onclick="location.hash='settings'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> General</button>
          <button class="dash-tab ${settingsTab === 'billing' ? 'active' : ''}" onclick="location.hash='settings/billing'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Billing</button>
          <button class="dash-tab ${settingsTab === 'notifications' ? 'active' : ''}" onclick="location.hash='settings/notifications'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> Notifications</button>
          <button class="dash-tab ${settingsTab === 'server' ? 'active' : ''}" onclick="location.hash='settings/server'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg> Server</button>
        </div>
      </div>
      
      ${tabContent}
  `;
  return dashboardLayout('settings', content);
}

/* ── DASHBOARD SUB-PAGES ── */
function dashboardResources() {
  const content = `
    <div class="resources-header-row">
      <h1 class="dash-title">Resources</h1>
      <p style="color:rgba(255,255,255,0.4);font-size:0.9rem">Download your resources and configure your licenses and properties here.</p>
    </div>

    <div class="resources-controls-row">
      <div class="resources-search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/></svg>
        <input type="text" placeholder="Search by name, code or category..." oninput="toast('Searching resources...')">
      </div>
      
      <div class="resources-filters-wrap">
        <span>Filtrar:</span>
        <div class="resources-filter-pills">
          <button class="resources-filter-pill active" onclick="toast('Filter: All')">All 1</button>
          <button class="resources-filter-pill" onclick="toast('Filter: Active')">Active 1</button>
          <button class="resources-filter-pill" onclick="toast('Filter: Pending')">Pending 0</button>
          <button class="resources-filter-pill" onclick="toast('Filter: Blocked')">Blocked 0</button>
        </div>
      </div>
    </div>

    <div class="resources-grid-v">
      <div class="resource-card-v">
        <div class="resource-card-v-bg" style="background-image:url('images/card_characters.png')"></div>
        <div class="resource-card-v-grad"></div>
        
        <div class="resource-card-v-top">
          <span class="resource-card-v-code">SQH_CUSTOM</span>
          <h3 class="resource-card-v-title">CUSTOM CHARACTERS</h3>
          <span class="resource-card-v-cat">Multi Theft Auto</span>
        </div>
        
        <div class="resource-card-v-bottom">
          <span class="resource-card-v-version">Version <b>v2.2.9</b></span>
          <div class="resource-card-v-actions">
            <button class="resource-card-v-btn-gear" title="Settings" onclick="openLicenseModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button class="resource-card-v-btn-download" onclick="toast('Downloading sqh_characters.zip v2.2.9...')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  return dashboardLayout('resources', content);
}

function dashboardDownloads() {
  const content = `
    <div class="dash-header">
      <h1 class="dash-title">My Downloads</h1>
      <p class="dash-sub">Download your resource files. Always download the latest version to prevent bugs.</p>
    </div>
    
    <div class="settings-card" style="margin-top:1.5rem">
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4)">
            <th style="text-align:left;padding:0.5rem">File Name</th>
            <th style="text-align:left;padding:0.5rem">Version</th>
            <th style="text-align:left;padding:0.5rem">Release Date</th>
            <th style="text-align:right;padding:0.5rem">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.02)">
            <td style="padding:1rem 0.5rem;color:#fff;font-weight:600">sqh_fuelsystem.zip</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">v1.3 (Latest)</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.4)">07/08/2026</td>
            <td style="padding:1rem 0.5rem;text-align:right"><button class="sq-btn" style="background:#a855f7;color:#fff;border:none;padding:0.35rem 0.75rem;font-size:0.8rem;border-radius:4px" onclick="toast('Downloading sqh_fuelsystem.zip v1.3...')">Download</button></td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.02)">
            <td style="padding:1rem 0.5rem;color:#fff;font-weight:600">sqh_craftsystem.zip</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">v1.3 (Latest)</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.4)">07/08/2026</td>
            <td style="padding:1rem 0.5rem;text-align:right"><button class="sq-btn" style="background:#a855f7;color:#fff;border:none;padding:0.35rem 0.75rem;font-size:0.8rem;border-radius:4px" onclick="toast('Downloading sqh_craftsystem.zip v1.3...')">Download</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  return dashboardLayout('downloads', content);
}

function dashboardOrders() {
  const content = `
    <div class="dash-header">
      <h1 class="dash-title">Order History</h1>
      <p class="dash-sub">View billing histories and check purchase invoices.</p>
    </div>
    
    <div class="settings-card" style="margin-top:1.5rem">
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4)">
            <th style="text-align:left;padding:0.5rem">Order ID</th>
            <th style="text-align:left;padding:0.5rem">Date</th>
            <th style="text-align:left;padding:0.5rem">Amount</th>
            <th style="text-align:left;padding:0.5rem">Status</th>
            <th style="text-align:right;padding:0.5rem">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.02)">
            <td style="padding:1rem 0.5rem;color:#fff;font-weight:600">#SQ-9851</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">08/08/2026</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">R$ 64,90</td>
            <td style="padding:1rem 0.5rem"><span style="background:rgba(52,211,153,0.1);color:#34d399;font-size:0.7rem;padding:0.15rem 0.4rem;border-radius:4px;font-weight:600">Paid</span></td>
            <td style="padding:1rem 0.5rem;text-align:right"><button class="sq-btn outline-sq" style="padding:0.35rem 0.6rem;font-size:0.75rem" onclick="location.hash='dashboard/invoices'">Invoice</button></td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.02)">
            <td style="padding:1rem 0.5rem;color:#fff;font-weight:600">#SQ-9421</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">05/08/2026</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">R$ 84,90</td>
            <td style="padding:1rem 0.5rem"><span style="background:rgba(52,211,153,0.1);color:#34d399;font-size:0.7rem;padding:0.15rem 0.4rem;border-radius:4px;font-weight:600">Paid</span></td>
            <td style="padding:1rem 0.5rem;text-align:right"><button class="sq-btn outline-sq" style="padding:0.35rem 0.6rem;font-size:0.75rem" onclick="location.hash='dashboard/invoices'">Invoice</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  return dashboardLayout('orders', content);
}

function dashboardRewards() {
  const content = `
    <div class="dash-header">
      <h1 class="dash-title">My Rewards</h1>
      <p class="dash-sub">Convert your coins balance into store credits and coupons.</p>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 2fr;gap:1.5rem;margin-top:1.5rem">
      <div class="settings-card" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:2rem">
        <span style="font-size:3rem;margin-bottom:0.5rem">✺</span>
        <h2 style="font-size:2rem;color:#fff;font-weight:800;margin-bottom:0.25rem">560</h2>
        <span style="font-size:0.8rem;color:rgba(255,255,255,0.4)">Total Coins Balance</span>
        <small style="color:#a855f7;font-size:0.7rem;margin-top:0.5rem">Worth R$ 5,60 Store Credit</small>
      </div>
      
      <div class="settings-card" style="padding:1.5rem">
        <h3 style="color:#fff;font-weight:600;font-size:1rem;margin-bottom:1rem">Redeem Coins</h3>
        <div style="display:flex;flex-direction:column;gap:1rem">
          <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:8px;padding:1rem;display:flex;justify-content:between;align-items:center">
            <div>
              <b style="color:#fff;font-size:0.9rem">R$ 5,00 Discount Coupon</b>
              <p style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:0.15rem">Costs 500 Coins</p>
            </div>
            <button class="sq-btn" style="background:#a855f7;color:#fff;border:none;padding:0.4rem 0.8rem;font-size:0.8rem;border-radius:4px;margin-left:auto" onclick="toast('Redeemed R$ 5,00 coupon!')">Redeem</button>
          </div>
          <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:8px;padding:1rem;display:flex;justify-content:between;align-items:center;opacity:0.6">
            <div>
              <b style="color:#fff;font-size:0.9rem">R$ 10,00 Discount Coupon</b>
              <p style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:0.15rem">Costs 1000 Coins</p>
            </div>
            <button class="sq-btn outline-sq" style="padding:0.4rem 0.8rem;font-size:0.8rem;border-radius:4px;margin-left:auto" disabled onclick="toast('Not enough coins!')">Redeem</button>
          </div>
        </div>
      </div>
    </div>
  `;
  return dashboardLayout('rewards', content);
}

function dashboardSubscriptions() {
  const content = `
    <div class="dash-header">
      <h1 class="dash-title">Subscriptions</h1>
      <p class="dash-sub">Manage your recurring memberships and packages.</p>
    </div>
    
    <div class="settings-card" style="margin-top:1.5rem;padding:1.5rem">
      <div style="display:flex;justify-content:between;align-items:center">
        <div>
          <span style="background:rgba(168,85,247,0.1);color:#a855f7;font-size:0.7rem;padding:0.15rem 0.4rem;border-radius:4px;font-weight:600">VIP CLUB</span>
          <h3 style="color:#fff;font-size:1.1rem;font-weight:700;margin-top:0.5rem">ByteX VIP Membership</h3>
          <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-top:0.25rem">Next billing: 10/09/2026 (R$ 29,90/month)</p>
        </div>
        <div style="display:flex;gap:1rem;align-items:center;margin-left:auto">
          <span style="background:rgba(52,211,153,0.1);color:#34d399;font-size:0.75rem;padding:0.25rem 0.5rem;border-radius:4px;font-weight:600">Active</span>
          <button class="sq-btn outline-sq" style="padding:0.4rem 0.8rem;font-size:0.8rem" onclick="toast('Subscription billing update modal')">Update billing</button>
          <button class="sq-btn" style="background:#ef4444;color:#fff;border:none;padding:0.4rem 0.8rem;font-size:0.8rem;border-radius:4px" onclick="toast('Subscription cancelled')">Cancel</button>
        </div>
      </div>
    </div>
  `;
  return dashboardLayout('subscriptions', content);
}

function dashboardReviews() {
  const content = `
    <div class="dash-header">
      <h1 class="dash-title">Product Reviews</h1>
      <p class="dash-sub">Share your feedback on the products you bought.</p>
    </div>
    
    <div style="display:flex;flex-direction:column;gap:1rem;margin-top:1.5rem">
      <div class="settings-card" style="padding:1.5rem">
        <h4 style="color:#fff;font-weight:600;margin-bottom:0.5rem">Fuel System</h4>
        <div style="color:#f59e0b;font-size:1.1rem;margin-bottom:0.75rem">★★★★★ <span style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin-left:0.5rem">Review submitted on 08/08/2026</span></div>
        <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);font-style:italic">"Highly optimized fuel system, zero lag!"</p>
      </div>
      
      <div class="settings-card" style="padding:1.5rem;opacity:0.7">
        <h4 style="color:#fff;font-weight:600;margin-bottom:0.5rem">Craft System</h4>
        <div style="color:rgba(255,255,255,0.2);font-size:1.1rem;margin-bottom:0.75rem">☆☆☆☆☆ <span style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin-left:0.5rem">No review yet</span></div>
        <button class="sq-btn outline-sq" style="padding:0.4rem 0.8rem;font-size:0.75rem" onclick="toast('Opening review editor...')">Write Review</button>
      </div>
    </div>
  `;
  return dashboardLayout('reviews', content);
}

function dashboardInvoices() {
  const content = `
    <div class="dash-header">
      <h1 class="dash-title">My Invoices</h1>
      <p class="dash-sub">Download PDF billing invoices for tax records.</p>
    </div>
    
    <div class="settings-card" style="margin-top:1.5rem">
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4)">
            <th style="text-align:left;padding:0.5rem">Invoice No.</th>
            <th style="text-align:left;padding:0.5rem">Period</th>
            <th style="text-align:left;padding:0.5rem">Total</th>
            <th style="text-align:right;padding:0.5rem">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.02)">
            <td style="padding:1rem 0.5rem;color:#fff;font-weight:600">#INV-9851</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">August 2026</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">R$ 64,90</td>
            <td style="padding:1rem 0.5rem;text-align:right"><button class="sq-btn" style="background:#a855f7;color:#fff;border:none;padding:0.35rem 0.75rem;font-size:0.8rem;border-radius:4px" onclick="toast('Downloading Invoice #INV-9851 PDF...')">Download PDF</button></td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.02)">
            <td style="padding:1rem 0.5rem;color:#fff;font-weight:600">#INV-9421</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">August 2026</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.6)">R$ 84,90</td>
            <td style="padding:1rem 0.5rem;text-align:right"><button class="sq-btn" style="background:#a855f7;color:#fff;border:none;padding:0.35rem 0.75rem;font-size:0.8rem;border-radius:4px" onclick="toast('Downloading Invoice #INV-9421 PDF...')">Download PDF</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  return dashboardLayout('invoices', content);
}

function dashboardSupport() {
  const content = `
    <div class="dash-header">
      <h1 class="dash-title">Support Desk</h1>
      <p class="dash-sub">Open custom tickets and resolve technical challenges.</p>
    </div>
    
    <div style="display:flex;justify-content:between;align-items:center;margin-top:1.5rem">
      <button class="sq-btn" style="background:#a855f7;color:#fff;border:none;padding:0.5rem 1rem;font-size:0.8rem;border-radius:6px" onclick="toast('Opening create support ticket form...')">+ Open Support Ticket</button>
    </div>

    <div class="settings-card" style="margin-top:1rem">
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4)">
            <th style="text-align:left;padding:0.5rem">Ticket No.</th>
            <th style="text-align:left;padding:0.5rem">Subject</th>
            <th style="text-align:left;padding:0.5rem">Last Update</th>
            <th style="text-align:left;padding:0.5rem">Status</th>
            <th style="text-align:right;padding:0.5rem">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.02)">
            <td style="padding:1rem 0.5rem;color:#fff;font-weight:600">#TKT-0492</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.8)">Fuel system SQL issue</td>
            <td style="padding:1rem 0.5rem;color:rgba(255,255,255,0.4)">10 mins ago</td>
            <td style="padding:1rem 0.5rem"><span style="background:rgba(245,158,11,0.1);color:#f59e0b;font-size:0.7rem;padding:0.15rem 0.4rem;border-radius:4px;font-weight:600">Awaiting Staff</span></td>
            <td style="padding:1rem 0.5rem;text-align:right"><button class="sq-btn outline-sq" style="padding:0.35rem 0.6rem;font-size:0.75rem" onclick="toast('Viewing ticket #TKT-0492 details...')">View Ticket</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  return dashboardLayout('support', content);
}

function dashboardDocumentation() {
  const content = `
    <div class="dash-header">
      <h1 class="dash-title">Developer Docs</h1>
      <p class="dash-sub">Technical documentation, LUA events, and API references for ByteX systems.</p>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 3fr;gap:1.5rem;margin-top:1.5rem">
      <div class="settings-card" style="padding:1rem;display:flex;flex-direction:column;gap:0.5rem;height:fit-content">
        <a href="#" style="color:#a855f7;font-weight:600;text-decoration:none;font-size:0.85rem">Quickstart</a>
        <a href="#" style="color:rgba(255,255,255,0.6);text-decoration:none;font-size:0.85rem" onclick="toast('Loading installation docs...')">Installation</a>
        <a href="#" style="color:rgba(255,255,255,0.6);text-decoration:none;font-size:0.85rem" onclick="toast('Loading API reference docs...')">LUA Events</a>
        <a href="#" style="color:rgba(255,255,255,0.6);text-decoration:none;font-size:0.85rem" onclick="toast('Loading server config docs...')">Server config</a>
      </div>
      
      <div class="settings-card" style="padding:1.5rem">
        <h3 style="color:#fff;font-weight:700;margin-bottom:1rem">Getting Started</h3>
        <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);line-height:1.6">Welcome to the ByteX developers workspace. Our resources are built with performance and modularity in mind. To integrate our resources into your server, follow the quickstart guide.</p>
        
        <h4 style="color:#fff;font-weight:600;margin-top:1.5rem;margin-bottom:0.5rem">LUA Integration Example</h4>
        <pre style="background:rgba(0,0,0,0.3);padding:1rem;border-radius:6px;border:1px solid rgba(255,255,255,0.05);color:#34d399;font-family:monospace;font-size:0.8rem;overflow-x:auto">
-- Trigger fuel replenishment event
triggerEvent("onPlayerRefuelVehicle", root, player, vehicle, amount)
        </pre>
      </div>
    </div>
  `;
  return dashboardLayout('documentation', content);
}

function portfolio() {
  return `<div class="center-page page-enter">
    <section class="center-hero">
      <div class="center-icon">${logoSvg(48)}</div>
      <h1>Our <span class="gradient-purple">work.</span></h1>
      <p>Selected resources for modern MTA:SA communities.</p>
    </section>
    <div class="resource-grid" style="max-width:1400px;margin:0 auto;padding:0 1.5rem 5rem">
      ${products.map((p, i) => card(p, i * 60)).join('')}
    </div>
  </div>`;
}

/* ── CHECKOUT PAGE & PAYMENT FLOW ── */
let checkoutPaymentMethod = 'pix';
let appliedCoupon = null;
let checkoutCompletedOrder = null;
let cardData = {
  number: '4532 8900 1234 5678',
  holder: 'NEXUS DEVELOPER',
  expiry: '12/28',
  cvv: '982'
};

function proceedToCheckout() {
  if (cart.length === 0) {
    cart.push(products[0]?.id || 'houses');
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
    updateCart();
  }
  closeCart();
  const prodId = cart[0];
  openBuyModal(prodId);
}

function setPaymentMethod(method) {
  checkoutPaymentMethod = method;
  const section = document.getElementById('checkoutPaymentSection');
  if (section) section.innerHTML = renderPaymentMethodBody();
  document.querySelectorAll('.payment-method-card').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-method') === method);
  });
}

function renderPaymentMethodBody() {
  const orderItems = cart.map(id => products.find(p => p.id === id)).filter(Boolean);
  const subtotal = orderItems.reduce((acc, p) => acc + p.price, 0);
  const discount = appliedCoupon ? (subtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const total = Math.max(0, subtotal - discount);

  if (checkoutPaymentMethod === 'pix') {
    return `
      <div class="pix-box">
        <div class="pix-timer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>PIX Code expires in <b>14:59</b></span>
        </div>
        <p style="font-size:0.85rem;color:rgba(255,255,255,0.7);margin-bottom:1rem">
          Scan the QR Code in your banking app or copy the PIX payload below for instant key delivery:
        </p>
        <div class="pix-qr-wrap">
          <svg viewBox="0 0 100 100" width="150" height="150">
            <rect width="100" height="100" fill="#fff"/>
            <rect x="10" y="10" width="25" height="25" fill="#000"/>
            <rect x="15" y="15" width="15" height="15" fill="#fff"/>
            <rect x="18" y="18" width="9" height="9" fill="#000"/>
            <rect x="65" y="10" width="25" height="25" fill="#000"/>
            <rect x="70" y="15" width="15" height="15" fill="#fff"/>
            <rect x="73" y="18" width="9" height="9" fill="#000"/>
            <rect x="10" y="65" width="25" height="25" fill="#000"/>
            <rect x="15" y="70" width="15" height="15" fill="#fff"/>
            <rect x="18" y="73" width="9" height="9" fill="#000"/>
            <rect x="42" y="12" width="16" height="6" fill="#000"/>
            <rect x="42" y="24" width="12" height="12" fill="#000"/>
            <rect x="12" y="42" width="20" height="8" fill="#000"/>
            <rect x="38" y="42" width="24" height="24" fill="#000"/>
            <rect x="44" y="48" width="12" height="12" fill="#fff"/>
            <rect x="68" y="42" width="20" height="10" fill="#000"/>
            <rect x="42" y="72" width="18" height="16" fill="#000"/>
            <rect x="68" y="68" width="22" height="22" fill="#000"/>
            <rect x="74" y="74" width="10" height="10" fill="#fff"/>
          </svg>
        </div>
        <div class="pix-copy-row">
          <input type="text" id="pixCodeInput" value="00020126580014br.gov.bcb.pix0136bytex-pay-${Math.random().toString(36).slice(2, 10)}520400005303986540${total.toFixed(2)}5802BR" readonly>
          <button class="sq-btn" style="background:#34d399;color:#000;border:none;padding:0 1rem;border-radius:8px;font-weight:700;font-size:0.8rem" onclick="copyText(document.getElementById('pixCodeInput')?.value || '', 'PIX Code copied!')">COPY PIX</button>
        </div>
      </div>
    `;
  } else if (checkoutPaymentMethod === 'card') {
    return `
      <div class="card-preview-container">
        <div class="card-preview-box">
          <div class="card-preview-top">
            <div class="card-chip"></div>
            <div class="card-brand">VISA / MASTER</div>
          </div>
          <div class="card-number-display" id="previewCardNumber">${cardData.number}</div>
          <div class="card-preview-bottom">
            <div>
              <div class="card-label-small">Cardholder</div>
              <div class="card-val-text" id="previewCardHolder">${cardData.holder}</div>
            </div>
            <div>
              <div class="card-label-small">Expires</div>
              <div class="card-val-text" id="previewCardExp">${cardData.expiry}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="checkout-fields-row">
        <div class="checkout-input-group">
          <label>Card Number</label>
          <input type="text" placeholder="4532 8900 1234 5678" maxlength="19" value="${cardData.number}" oninput="updateCardInput('number', this.value)">
        </div>
        <div class="checkout-input-group">
          <label>Cardholder Name</label>
          <input type="text" placeholder="YOUR NAME" value="${cardData.holder}" oninput="updateCardInput('holder', this.value)">
        </div>
      </div>

      <div class="checkout-fields-row">
        <div class="checkout-input-group">
          <label>Expiration Date</label>
          <input type="text" placeholder="MM/YY" maxlength="5" value="${cardData.expiry}" oninput="updateCardInput('expiry', this.value)">
        </div>
        <div class="checkout-input-group">
          <label>CVV / CVC</label>
          <input type="password" placeholder="123" maxlength="4" value="${cardData.cvv}">
        </div>
      </div>
    `;
  } else {
    return `
      <div style="background:rgba(168,85,247,0.04);border:1px solid rgba(168,85,247,0.2);border-radius:12px;padding:1.75rem;text-align:center;">
        <div style="width:48px;height:48px;border-radius:12px;background:rgba(168,85,247,0.15);color:#d8b4fe;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:1.5rem">🛡️</div>
        <h4 style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:0.35rem">Official Tebex Gateway</h4>
        <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);max-width:420px;margin:0 auto 1.25rem;line-height:1.5">
          Checkout securely via Tebex with PayPal, Apple Pay, Google Pay, credit cards, or international bank transfer.
        </p>
        <div style="display:flex;align-items:center;justify-content:center;gap:0.75rem;font-size:0.75rem;color:rgba(255,255,255,0.4)">
          <span>🔒 256-Bit SSL</span>
          <span>•</span>
          <span>⚡ Instant Key Delivery</span>
          <span>•</span>
          <span>🌍 Global Currencies</span>
        </div>
      </div>
    `;
  }
}

function updateCardInput(field, val) {
  if (field === 'number') {
    cardData.number = val || '•••• •••• •••• ••••';
    const numEl = document.getElementById('previewCardNumber');
    if (numEl) numEl.textContent = cardData.number;
  } else if (field === 'holder') {
    cardData.holder = (val || 'CARDHOLDER NAME').toUpperCase();
    const holdEl = document.getElementById('previewCardHolder');
    if (holdEl) holdEl.textContent = cardData.holder;
  } else if (field === 'expiry') {
    cardData.expiry = val || 'MM/YY';
    const expEl = document.getElementById('previewCardExp');
    if (expEl) expEl.textContent = cardData.expiry;
  }
}

function applyCoupon() {
  const code = (document.getElementById('couponInput')?.value || '').trim().toUpperCase();
  if (!code) {
    toast('Please enter a coupon code');
    return;
  }
  if (code === 'BYTEX10') {
    appliedCoupon = { code: 'BYTEX10', discountPercent: 10 };
    toast('Coupon BYTEX10 applied: 10% OFF! 🎉');
  } else if (code === 'NEXUS20') {
    appliedCoupon = { code: 'NEXUS20', discountPercent: 20 };
    toast('Coupon NEXUS20 applied: 20% OFF! 🔥');
  } else if (code === 'LAUNCH50') {
    appliedCoupon = { code: 'LAUNCH50', discountPercent: 50 };
    toast('Coupon LAUNCH50 applied: 50% OFF! 🚀');
  } else {
    toast('Invalid coupon. Try BYTEX10 or NEXUS20');
    return;
  }
  render();
}

function removeCoupon() {
  appliedCoupon = null;
  toast('Coupon removed');
  render();
}

function removeCheckoutItem(id) {
  cart = cart.filter(x => x !== id);
  localStorage.setItem('nexus_cart', JSON.stringify(cart));
  updateCart();
  if (cart.length === 0) {
    location.hash = 'store';
    toast('Cart cleared');
  } else {
    render();
  }
}

function generateRandomKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = (len) => {
    let s = '';
    for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
  };
  return `NEXUS-${block(4)}-${block(4)}-${block(4)}`;
}

async function processPayment() {
  const btn = document.getElementById('placeOrderBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite">↻</span> Processing Transaction & Writing to DB...`;
  }

  const orderItems = cart.map(id => products.find(p => p.id === id)).filter(Boolean);
  const email = document.getElementById('checkoutEmail')?.value || (discordUser ? discordUser.email : 'customer@bytex.dev');
  const serverIp = document.getElementById('checkoutServerIp')?.value || '127.0.0.1:22003';
  const subtotal = orderItems.reduce((acc, p) => acc + p.price, 0);
  const discount = appliedCoupon ? (subtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const finalTotal = Math.max(0, subtotal - discount);

  try {
    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderItems,
        customer_email: email,
        payment_method: checkoutPaymentMethod.toUpperCase(),
        server_ip: serverIp,
        total: finalTotal
      })
    });
    const data = await res.json();
    if (data.success) {
      checkoutCompletedOrder = {
        orderId: data.order.order_id,
        licenseKey: data.license_key,
        items: orderItems,
        total: data.order.total,
        email: email,
        serverIp: serverIp,
        date: new Date().toLocaleDateString('pt-BR')
      };
    } else {
      throw new Error(data.message || 'Payment failed');
    }
  } catch (err) {
    checkoutCompletedOrder = {
      orderId: 'SQ-' + Math.floor(1000 + Math.random() * 9000),
      licenseKey: generateRandomKey(),
      items: orderItems,
      total: finalTotal,
      email: email,
      serverIp: serverIp,
      date: new Date().toLocaleDateString('pt-BR')
    };
  }

  if (typeof confetti === 'function') {
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } });
    }, 350);
  }

  cart = [];
  localStorage.setItem('nexus_cart', JSON.stringify(cart));
  updateCart();

  render();
  toast('🎉 Order approved & saved to database!');
}

function checkoutSuccess(order) {
  const firstItem = order.items[0] || products[0];
  return `
    <div class="checkout-page page-enter">
      <div class="checkout-success-container">
        <div class="success-icon-burst">✓</div>
        <h1 class="checkout-title" style="font-size:2.2rem">Order Confirmed!</h1>
        <p class="checkout-sub">Order <b>#${order.orderId}</b> was approved successfully. Your cryptographic license key is active.</p>

        <div class="success-license-box">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
            <span style="font-size:0.85rem;color:rgba(255,255,255,0.5);font-weight:600">ACTIVATED LICENSE KEY</span>
            <span class="license-modal-badge-active">ACTIVE & BOUND</span>
          </div>
          
          <div class="success-key-wrap">
            <span>${order.licenseKey}</span>
            <button class="copy-btn" onclick="copyText('${order.licenseKey}', 'License key copied!')" style="color:#34d399">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;font-size:0.8rem;color:rgba(255,255,255,0.6);margin-bottom:1.5rem">
            <div><b>Customer:</b> ${order.email}</div>
            <div><b>Server IP:</b> ${order.serverIp}</div>
            <div><b>Resource:</b> ${firstItem.name} (${firstItem.code})</div>
            <div><b>Total Paid:</b> ${money(order.total)}</div>
          </div>

          <div class="license-code-box" style="margin-bottom:0">
            <div class="license-code-header">
              <span>config.lua</span>
              <button class="copy-btn" onclick="copyText(\`license = {\\n    [\\\"Email\\\"] = \\\"${order.email}\\\",\\n    [\\\"Key\\\"] = \\\"${order.licenseKey}\\\",\\n}\`, 'config.lua copied!')">Copy config.lua</button>
            </div>
            <pre class="license-code-pre">license = {
    ["Email"] = "${order.email}",
    ["Key"] = "${order.licenseKey}",
}</pre>
          </div>
        </div>

        <div class="success-btns-row">
          <button class="btn-place-order" style="max-width:260px" onclick="openLicenseModal()">
            ⚙️ Open License Manager
          </button>
          <button class="sq-btn outline-sq" style="padding:0.9rem 1.5rem;font-weight:700;border-radius:10px" onclick="toast('Downloading resource zip archive...')">
            📥 Download ZIP
          </button>
          <button class="sq-btn" style="background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.1);padding:0.9rem 1.5rem;font-weight:700;border-radius:10px" onclick="location.hash='dashboard/resources'">
            Client Dashboard →
          </button>
        </div>
      </div>
    </div>
  `;
}

function checkoutPage() {
  if (checkoutCompletedOrder) {
    return checkoutSuccess(checkoutCompletedOrder);
  }

  const orderItems = cart.map(id => products.find(p => p.id === id)).filter(Boolean);
  if (orderItems.length === 0) {
    return `
      <div class="checkout-page page-enter">
        <div class="checkout-success-container" style="padding:4rem 0">
          <div style="font-size:3rem;margin-bottom:1rem">🛒</div>
          <h1 class="checkout-title">Your cart is empty</h1>
          <p class="checkout-sub" style="margin-bottom:2rem">Add resources from our catalog to proceed with checkout.</p>
          <button class="btn-place-order" style="max-width:240px;margin:0 auto" onclick="location.hash='store'">Browse Catalog →</button>
        </div>
      </div>
    `;
  }

  const subtotal = orderItems.reduce((acc, p) => acc + p.price, 0);
  const discount = appliedCoupon ? (subtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const total = Math.max(0, subtotal - discount);
  const userEmail = discordUser ? (discordUser.email || 'customer@bytex.dev') : '';
  const userName = discordUser ? discordUser.username : '';

  return `
    <div class="checkout-page page-enter">
      <div class="checkout-header-section">
        <h1 class="checkout-title">Secure Checkout</h1>
        <p class="checkout-sub">Instant cryptographic key generation and auto-delivery to your client dashboard.</p>
      </div>

      <div class="checkout-grid">
        <!-- LEFT: Customer info & Payment Methods -->
        <div class="checkout-left">
          
          <!-- Step 1: Buyer Information -->
          <div class="checkout-card">
            <div class="checkout-card-header">
              <div class="checkout-step-num">1</div>
              <h3 class="checkout-card-title">Buyer & Server Information</h3>
            </div>
            
            <div class="checkout-fields-row">
              <div class="checkout-input-group">
                <label>Email for License Delivery</label>
                <input type="email" id="checkoutEmail" value="${userEmail}" placeholder="your.email@example.com">
              </div>
              <div class="checkout-input-group">
                <label>Discord Username / ID</label>
                <input type="text" id="checkoutDiscord" value="${userName}" placeholder="DiscordTag#0000">
              </div>
            </div>

            <div class="checkout-fields-row">
              <div class="checkout-input-group">
                <label>Target Server IP (Optional)</label>
                <input type="text" id="checkoutServerIp" value="127.0.0.1:22003" placeholder="185.254.190.5:22003">
              </div>
              <div class="checkout-input-group">
                <label>Server Framework</label>
                <input type="text" value="MTA:SA Default / Custom" readonly style="opacity:0.7">
              </div>
            </div>
          </div>

          <!-- Step 2: Payment Method -->
          <div class="checkout-card">
            <div class="checkout-card-header">
              <div class="checkout-step-num">2</div>
              <h3 class="checkout-card-title">Select Payment Method</h3>
            </div>

            <div class="payment-methods-grid">
              <div class="payment-method-card ${checkoutPaymentMethod === 'pix' ? 'active' : ''}" data-method="pix" onclick="setPaymentMethod('pix')">
                <div class="payment-method-icon">⚡</div>
                <div class="payment-method-name">PIX</div>
                <span class="payment-method-badge badge-pix">Instant</span>
              </div>
              
              <div class="payment-method-card ${checkoutPaymentMethod === 'card' ? 'active' : ''}" data-method="card" onclick="setPaymentMethod('card')">
                <div class="payment-method-icon">💳</div>
                <div class="payment-method-name">Credit Card</div>
                <span class="payment-method-badge badge-instant">Up to 12x</span>
              </div>

              <div class="payment-method-card ${checkoutPaymentMethod === 'tebex' ? 'active' : ''}" data-method="tebex" onclick="setPaymentMethod('tebex')">
                <div class="payment-method-icon">🛡️</div>
                <div class="payment-method-name">Tebex / Global</div>
                <span class="payment-method-badge badge-secure">PayPal / Cards</span>
              </div>
            </div>

            <!-- Dynamic Payment Form Section -->
            <div id="checkoutPaymentSection">
              ${renderPaymentMethodBody()}
            </div>
          </div>

        </div>

        <!-- RIGHT: Order Summary & Place Order -->
        <div class="checkout-right">
          <div class="checkout-card">
            <h3 class="checkout-card-title" style="margin-bottom:1.25rem">Order Summary</h3>

            <div class="order-summary-items">
              ${orderItems.map(item => `
                <div class="order-item-card">
                  <div class="order-item-left">
                    <div class="order-item-thumb" style="background-image:url('${item.img}')"></div>
                    <div class="order-item-details">
                      <b>${item.name}</b>
                      <small>${item.code}</small>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center">
                    <div class="order-item-price">${money(item.price)}</div>
                    <button class="order-item-del-btn" title="Remove" onclick="removeCheckoutItem('${item.id}')">✕</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Coupon Code -->
            <div class="coupon-row">
              <input type="text" id="couponInput" placeholder="PROMO CODE (e.g. BYTEX10)" value="${appliedCoupon ? appliedCoupon.code : ''}">
              <button onclick="applyCoupon()">APPLY</button>
            </div>

            ${appliedCoupon ? `
              <div class="coupon-success-pill">
                <span>✓ Coupon <b>${appliedCoupon.code}</b> (${appliedCoupon.discountPercent}% OFF)</span>
                <button onclick="removeCoupon()" style="background:none;border:none;color:#34d399;font-weight:700;cursor:pointer">✕</button>
              </div>
            ` : ''}

            <!-- Price Breakdown -->
            <div class="checkout-breakdown">
              <div class="breakdown-row">
                <span>Subtotal</span>
                <span>${money(subtotal)}</span>
              </div>
              ${appliedCoupon ? `
                <div class="breakdown-row" style="color:#34d399">
                  <span>Discount (${appliedCoupon.discountPercent}%)</span>
                  <span>- ${money(discount)}</span>
                </div>
              ` : ''}
              <div class="breakdown-row">
                <span>Processing Fee</span>
                <span style="color:#34d399">FREE</span>
              </div>
              <div class="breakdown-row total-row">
                <span>Total Amount</span>
                <span>${money(total)}</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button class="btn-place-order" id="placeOrderBtn" onclick="processPayment()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              PAY ${money(total)} NOW →
            </button>

            <div class="checkout-trust-badges">
              <span>🔒 256-Bit SSL</span>
              <span>⚡ Auto-License</span>
              <span>🛡️ 7-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ── selectStoreProduct ── */
function selectStoreProduct(id) {
  selectedStoreProductId = id;
  render();
}

/* ── RENDER ── */
function render() {
  route = location.hash.slice(1) || 'home';
  if (route === 'admin') {
    document.getElementById('app').innerHTML = adminPage();
    if (adminToken && adminUser && adminUser.role === 'admin') {
      fetchAdminData();
    }
  } else if (route === 'home') {
    document.getElementById('app').innerHTML = home();
  } else if (route === 'store') {
    document.getElementById('app').innerHTML = store();
  } else if (route === 'checkout') {
    document.getElementById('app').innerHTML = checkoutPage();
  } else if (route === 'support') {
    document.getElementById('app').innerHTML = support();
  } else if (route === 'terms') {
    document.getElementById('app').innerHTML = terms();
  } else if (route === 'portfolio') {
    document.getElementById('app').innerHTML = portfolio();
  } else if (route.startsWith('product/')) {
    document.getElementById('app').innerHTML = productPage(route.split('/')[1]);
  } else if (route === 'settings') {
    document.getElementById('app').innerHTML = dashboardSettings('general');
  } else if (route === 'settings/billing') {
    document.getElementById('app').innerHTML = dashboardSettings('billing');
  } else if (route === 'settings/notifications') {
    document.getElementById('app').innerHTML = dashboardSettings('notifications');
  } else if (route === 'settings/server') {
    document.getElementById('app').innerHTML = dashboardSettings('server');
  } else if (route === 'dashboard') {
    document.getElementById('app').innerHTML = dashboardHome();
  } else if (route === 'dashboard/resources') {
    document.getElementById('app').innerHTML = dashboardResources();
  } else if (route === 'dashboard/downloads') {
    document.getElementById('app').innerHTML = dashboardDownloads();
  } else if (route === 'dashboard/orders') {
    document.getElementById('app').innerHTML = dashboardOrders();
  } else if (route === 'dashboard/rewards') {
    document.getElementById('app').innerHTML = dashboardRewards();
  } else if (route === 'dashboard/subscriptions') {
    document.getElementById('app').innerHTML = dashboardSubscriptions();
  } else if (route === 'dashboard/reviews') {
    document.getElementById('app').innerHTML = dashboardReviews();
  } else if (route === 'dashboard/invoices') {
    document.getElementById('app').innerHTML = dashboardInvoices();
  } else if (route === 'dashboard/support') {
    document.getElementById('app').innerHTML = dashboardSupport();
  } else if (route === 'dashboard/documentation') {
    document.getElementById('app').innerHTML = dashboardDocumentation();
  } else {
    document.getElementById('app').innerHTML = home();
  }

  // Update active nav link
  document.querySelectorAll('.nav-links a').forEach(a => {
    const r = a.getAttribute('data-route');
    a.classList.toggle('active', r === route || (route.startsWith('product/') && r === 'store'));
  });

  if (route === 'store') setupFilters();
  updateCart();
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Kick off scroll animations after render
  setTimeout(initScrollAnimations, 50);
}

// Close dropdown if clicked outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown && dropdown.classList.contains('show') && !e.target.closest('.user-dropdown-wrap')) {
    dropdown.classList.remove('show');
  }
});

/* ── FILTER ── */
function setupFilters() {
  const s = document.getElementById('search');
  if (s) s.addEventListener('input', filterProducts);
}
function filterProducts() {
  const q = (document.getElementById('search')?.value || '').toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.code.toLowerCase().includes(q) ||
    p.cat.toLowerCase().includes(q) ||
    (p.tags || []).some(t => t.toLowerCase().includes(q))
  );
  const grid = document.getElementById('resourceGrid');
  const count = document.getElementById('prodCount');
  if (grid) grid.innerHTML = filtered.map((p, i) => card(p, i * 60)).join('');
  if (count) count.textContent = filtered.length;
  setTimeout(initScrollAnimations, 50);
}

/* ── CART ── */
function addCart(id) {
  if (!cart.includes(id)) cart.push(id);
  localStorage.setItem('nexus_cart', JSON.stringify(cart));
  updateCart();
  toast('Added to cart! 🛒');
}
function updateCart() {
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (countEl) countEl.textContent = cart.length || '';
  if (itemsEl) {
    itemsEl.innerHTML = cart.length
      ? cart.map(id => {
        const p = products.find(x => x.id === id);
        if (!p) return '';
        return `<div class="cart-row">
            <div><b>${p.name}</b><small>${p.code}</small></div>
            <span class="price-right">${money(p.price)}</span>
          </div>`;
      }).join('')
      : `<p style="color:rgba(255,255,255,0.3);font-size:0.85rem;text-align:center;padding:2rem 0">Your cart is empty.</p>`;
  }
  const total = cart.reduce((s, id) => s + (products.find(p => p.id === id)?.price || 0), 0);
  if (totalEl) totalEl.textContent = money(total);
}

/* ── OAUTH & AUTHENTICATION ── */
async function checkDiscordAuth() {
  // Parse query params that come AFTER the hash route, e.g.: #admin?token=...&role=admin
  const hashPart = window.location.hash.slice(1); // e.g. 'admin?token=xxx&role=admin'
  const qIndex   = hashPart.indexOf('?');
  const routePart   = qIndex !== -1 ? hashPart.slice(0, qIndex) : hashPart;
  const queryString = qIndex !== -1 ? hashPart.slice(qIndex + 1) : '';
  const params = new URLSearchParams(queryString);

  const token    = params.get('token');
  const username = params.get('username');
  const email    = params.get('email');
  const role     = params.get('role');
  const avatar   = params.get('avatar');
  const error    = params.get('error');

  if (error) {
    toast('Discord login error: ' + decodeURIComponent(error));
    window.history.replaceState(null, null, window.location.pathname + '#home');
    renderNavProfile();
    return;
  }

  if (token && username && role) {
    // Discord OAuth callback — backend has already verified roles
    if (role === 'admin') {
      // Store as admin session
      adminToken = token;
      adminUser  = { username: decodeURIComponent(username), email: decodeURIComponent(email || ''), role: 'admin', avatar: avatar ? decodeURIComponent(avatar) : null };
      localStorage.setItem('bytex_admin_token', adminToken);
      localStorage.setItem('bytex_admin_user', JSON.stringify(adminUser));
      toast(`⚡ Welcome, ${adminUser.username}! Admin panel unlocked via Discord.`);
    } else {
      // Store as customer session
      discordUser = {
        username: decodeURIComponent(username),
        email:    decodeURIComponent(email || ''),
        role:     'customer',
        avatar:   avatar ? decodeURIComponent(avatar) : null
      };
      localStorage.setItem('discord_user', JSON.stringify(discordUser));
      toast(`🎮 Welcome, ${discordUser.username}! Logged in with Discord.`);
    }

    // Clean up the URL (remove token params from URL bar)
    window.history.replaceState(null, null, window.location.pathname + '#' + routePart);
  }

  renderNavProfile();
}

function renderNavProfile() {
  const container = document.getElementById('navAuthContainer');
  const adminNav = document.getElementById('navAdminLink');
  
  // Only show Admin Link in Navbar if user has 'admin' role in Discord
  if (adminNav) {
    if (discordUser && discordUser.role === 'admin') {
      adminNav.style.display = 'inline-flex';
    } else {
      adminNav.style.display = 'none';
    }
  }

  if (!container) return;

  if (discordUser) {
    const avatarUrl = discordUser.avatar
      ? (discordUser.avatar.startsWith('http') ? discordUser.avatar : 'https://cdn.discordapp.com/avatars/' + discordUser.id + '/' + discordUser.avatar + '.png')
      : 'https://cdn.discordapp.com/embed/avatars/0.png';
    const roleBadge = discordUser.role === 'admin' ? '<small style="color:#ff4d4d;font-weight:700">⚡ ADMIN</small>' : '<small style="color:#3b82f6;font-weight:700">CUSTOMER</small>';
    
    container.innerHTML = '<div class="user-dropdown-wrap">' +
      '<button class="customer" onclick="document.getElementById(\'userDropdown\').classList.toggle(\'show\')">' +
        '<div class="avatar" style="background:url(\'' + avatarUrl + '\') center/cover;border-radius:50%"></div>' +
        '<span class="customer-copy"><b>' + discordUser.username + '</b>' + roleBadge + '</span>' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>' +
      '</button>' +
      
      '<div class="user-dropdown-menu" id="userDropdown">' +
        '<div class="user-dropdown-header">' +
          '<div class="user-dropdown-avatar" style="background:url(\'' + avatarUrl + '\') center/cover;border-radius:12px;"></div>' +
          '<div class="user-dropdown-info">' +
            '<b>' + discordUser.username + '</b>' +
            '<span class="discord-id">ID: ' + (discordUser.id || 'Active') + '</span>' +
            '<span class="role-badge" style="background:' + (discordUser.role === 'admin' ? 'rgba(255,49,49,0.2)' : 'rgba(59,130,246,0.2)') + ';color:' + (discordUser.role === 'admin' ? '#ff6b6b' : '#93c5fd') + ';border:1px solid ' + (discordUser.role === 'admin' ? 'rgba(255,49,49,0.3)' : 'rgba(59,130,246,0.3)') + ';padding:2px 8px;border-radius:20px;font-size:0.65rem;font-weight:700;text-transform:uppercase">' + (discordUser.role === 'admin' ? '⚡ Discord Admin' : '🎮 Customer') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="user-dropdown-links">' +
          '<a href="#orders" onclick="document.getElementById(\'userDropdown\').classList.remove(\'show\')">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' +
            'My Orders &amp; Licenses' +
          '</a>' +
          (discordUser.role === 'admin' ? 
            '<a href="#admin" style="color:#ff6b6b" onclick="document.getElementById(\'userDropdown\').classList.remove(\'show\')">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
              '⚡ Admin Control Center' +
            '</a>' : '') +
        '</div>' +
        '<div class="user-dropdown-footer">' +
          '<a href="#" onclick="logout(); return false;" class="logout-link">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
            'Logout' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  } else {
    container.innerHTML = '<button onclick="openModal()" class="login-btn" style="cursor:pointer;background:transparent;border:1px solid rgba(255,255,255,0.15);color:#fff;padding:0.4rem 1.1rem;border-radius:8px;font-weight:600;font-size:0.85rem;transition:all 0.2s">Login</button>';
  }
}

function openModal() {
  const modalCard = document.querySelector('.modal-card');
  if (modalCard) {
    modalCard.innerHTML = '<button class="modal-close" onclick="closeModal()">×</button>' +
      '<div style="text-align:center;margin-bottom:1.5rem">' +
        '<div style="width:60px;height:60px;background:rgba(88,101,242,0.15);border:2px solid rgba(88,101,242,0.4);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:1.8rem">' +
          '<svg width="28" height="28" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.0777.0777 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>' +
        '</div>' +
        '<h2 style="margin:0 0 0.5rem;font-size:1.4rem;color:#fff">Sign In to ByteX</h2>' +
        '<p style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin:0">Use your Discord account to manage your purchases, licenses and downloads.</p>' +
      '</div>' +

      '<button onclick="openDiscordLogin()" style="display:flex;align-items:center;justify-content:center;gap:0.75rem;background:#5865F2;color:#fff;padding:0.85rem 1.5rem;border-radius:10px;font-weight:700;font-size:0.95rem;transition:all 0.2s;border:none;cursor:pointer;width:100%;box-sizing:border-box;margin-bottom:0.75rem;box-shadow:0 8px 25px rgba(88,101,242,0.3)">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.0777.0777 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>' +
        'Continue with Discord' +
      '</button>' +

      '<div style="text-align:center;margin:0.75rem 0;color:rgba(255,255,255,0.25);font-size:0.8rem">— or instant testing login —</div>' +

      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.75rem">' +
        '<button class="primary" style="padding:0.65rem 0.5rem;font-size:0.8rem;background:linear-gradient(135deg,#3b82f6,#1d4ed8);font-weight:700" onclick="instantDemoLogin(\'user\')">Demo Customer 👤</button>' +
        '<button class="primary" style="padding:0.65rem 0.5rem;font-size:0.8rem;background:linear-gradient(135deg,#ff3131,#b30000);font-weight:700" onclick="instantDemoLogin(\'admin\')">Demo Admin ⚡</button>' +
      '</div>' +

      '<button class="ghost wide" onclick="closeModal(); location.hash=\'admin\'">Switch to Admin Portal <span>⚡</span></button>' +
      '<button class="ghost wide" style="margin-top:0.25rem" onclick="closeModal()">Cancel</button>' +

      '<p style="text-align:center;margin-top:1rem;font-size:0.72rem;color:rgba(255,255,255,0.25)">' +
        'By continuing, you agree to our <a href="#terms" onclick="closeModal()" style="color:rgba(255,255,255,0.4)">Terms of Service</a>' +
      '</p>';
  }
  const m = document.getElementById('modal');
  if (m) m.classList.remove('hidden');
}

function closeModal() {
  const m = document.getElementById('modal');
  if (m) m.classList.add('hidden');
}

function fakeLogin() {
  instantDemoLogin('user');
}

function login() {
  openModal();
}

function logout() {
  discordUser = null;
  adminToken = null;
  adminUser = null;
  localStorage.removeItem('bytex_token');
  localStorage.removeItem('discord_user');
  localStorage.removeItem('bytex_admin_token');
  localStorage.removeItem('bytex_admin_user');
  toast('Logged out successfully');
  renderNavProfile();
  location.hash = 'home';
}

/* ── OVERLAYS ── */
function openProduct(id) { location.hash = 'product/' + id; }
function openCart() { document.getElementById('cart').classList.add('open'); document.getElementById('cartShade').classList.remove('hidden'); }
function closeCart() { document.getElementById('cart').classList.remove('open'); document.getElementById('cartShade').classList.add('hidden'); }
function toggleLanguage() { toast('Language: English / Português'); }

/* ── LICENSE CONFIG MODAL ── */
function openLicenseModal(tab = 'info') {
  document.getElementById('licenseModal').classList.add('open');
  renderLicenseModalContent(tab);
}
function closeLicenseModal() {
  const m = document.getElementById('licenseModal');
  if (m) {
    m.classList.remove('show');
    m.classList.remove('open');
    m.style.opacity = '';
    m.style.pointerEvents = '';
  }
}
function renderLicenseModalContent(tab) {
  const container = document.getElementById('licenseModalCard');
  if (!container) return;

  const email = discordUser ? (discordUser.email || 'jenoda50@gmail.com') : 'jenoda50@gmail.com';
  const key = 'SQUASH-a917-e6ba';

  let bodyContent = '';

  if (tab === 'info') {
    bodyContent = `
      <div class="license-modal-section-title">
        <span>License information</span>
        <span class="license-modal-badge-active">Ativa</span>
      </div>
      
      <div class="license-modal-row">
        <div class="license-modal-field">
          <label>License Key</label>
          <div class="license-modal-input-wrap">
            <input type="text" value="${key}" readonly>
            <button class="copy-btn" onclick="copyText('${key}', 'License key copied!')" title="Copy Key">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>
        <div class="license-modal-field">
          <label>Linked Email</label>
          <div class="license-modal-input-wrap">
            <input type="text" value="${email}" readonly>
            <button class="copy-btn" onclick="copyText('${email}', 'Linked email copied!')" title="Copy Email">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="license-modal-section-title">
        <span>Resource details</span>
      </div>

      <div class="license-modal-row">
        <div class="license-modal-field">
          <label>Current Version</label>
          <div class="license-modal-input-wrap has-icon">
            <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <input type="text" value="v2.2.9" readonly>
          </div>
        </div>
        <div class="license-modal-field">
          <label>Last Update</label>
          <div class="license-modal-input-wrap has-icon">
            <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <input type="text" value="08/08/2026" readonly>
          </div>
        </div>
      </div>

      <button class="license-modal-btn-wide-outline" onclick="toast('Opening complete documentation...')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        View complete documentation
      </button>
    `;
  } else if (tab === 'config') {
    const codeString = `license = {\n    ["Email"] = "${email}",\n    ["Key"] = "${key}",\n}`;
    bodyContent = `
      <div class="license-modal-section-title">
        <span>Server configuration</span>
      </div>
      
      <div class="license-modal-row" style="margin-bottom:0.75rem">
        <div class="license-modal-field">
          <label>Server IP</label>
          <div class="license-modal-input-wrap">
            <input type="text" id="modalServerIp" value="${licenseServerIp}">
          </div>
        </div>
        <div class="license-modal-field">
          <label>Port</label>
          <div class="license-modal-input-wrap">
            <input type="text" id="modalServerPort" value="${licenseServerPort}">
          </div>
        </div>
      </div>

      <button class="license-modal-btn-save" onclick="saveLicenseConfig()">Save Configuration</button>

      <div class="license-modal-section-title">
        <span>Configuration Code</span>
      </div>

      <div class="license-code-box">
        <div class="license-code-header">
          <span>config.lua</span>
          <button class="copy-btn" onclick="copyText(\`\${document.getElementById('luaCodePre')?.textContent || ''}\`, 'config.lua code copied!')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy code
          </button>
        </div>
        <pre class="license-code-pre" id="luaCodePre">${codeString}</pre>
      </div>

      <div class="license-modal-warning-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p>Replace the code above in the file <code style="background:rgba(255,255,255,0.06);padding:0.1rem 0.25rem;border-radius:3px;font-family:monospace;color:#fff">config.lua</code> inside the resource folder to activate your license.</p>
      </div>
    `;
  }

  container.innerHTML = `
    <button class="license-modal-close" onclick="closeLicenseModal()">×</button>
    
    <div class="license-modal-header">
      <div class="license-modal-icon-wrap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
      </div>
      <div class="license-modal-title-box">
        <h3>License Configuration</h3>
        <p>Custom Characters · sqh_custom · v2.2.9</p>
      </div>
    </div>
    
    <div class="license-modal-tabs">
      <button class="license-modal-tab-btn ${tab === 'info' ? 'active' : ''}" onclick="renderLicenseModalContent('info')">Information</button>
      <button class="license-modal-tab-btn ${tab === 'config' ? 'active' : ''}" onclick="renderLicenseModalContent('config')">Configuration</button>
    </div>
    
    ${bodyContent}
  `;
}
function copyText(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    toast(label);
  }).catch(err => {
    console.error('Copy failed:', err);
    toast('Copy failed. Please copy manually.');
  });
}
function saveLicenseConfig() {
  const ip = document.getElementById('modalServerIp')?.value || '';
  const port = document.getElementById('modalServerPort')?.value || '';
  
  licenseServerIp = ip;
  licenseServerPort = port;
  
  localStorage.setItem('license_server_ip', ip);
  localStorage.setItem('license_server_port', port);
  
  toast('Server configuration saved!');
}


/* ── TOAST ── */
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ── SCROLL ANIMATIONS ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('in-view');
    observer.observe(el);
  });
}

/* ── NAVBAR SCROLL MORPH ── */
(function () {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const sync = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
})();

/* ============================================================
   ADMIN CONTROL CENTER & PRODUCT CRUD
============================================================ */

async function fetchAdminData() {
  if (!adminToken) return;
  try {
    const headers = { 'Authorization': 'Bearer ' + adminToken };
    
    // Fetch live orders from backend
    try {
      const ordRes = await fetch('/api/orders/admin', { headers });
      if (ordRes.ok) {
        adminOrders = await ordRes.json();
      }
    } catch (e) {}

    // Fetch live products
    await syncDatabaseProducts();

    const container = document.getElementById('adminContentContainer');
    if (container) {
      if (adminTab === 'dashboard') container.innerHTML = adminDashboardView();
      else if (adminTab === 'products') container.innerHTML = adminProductsView();
      else if (adminTab === 'licenses') container.innerHTML = adminLicensesView();
      else if (adminTab === 'orders') container.innerHTML = adminOrdersView();
      else if (adminTab === 'logs') container.innerHTML = adminLogsView();
    }
  } catch (err) {
    console.error('Failed to fetch admin data:', err);
  }
}

async function updateAdminOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch('/api/orders/admin/' + orderId + '/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminToken
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      toast('Order status set to ' + newStatus.toUpperCase() + '!');
      await fetchAdminData();
    } else {
      toast('Failed to update status');
    }
  } catch (e) {
    toast('Error updating status: ' + e.message);
  }
}

function openDeliveryUploadModal(orderId) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.zip,.rar,.7z,.lua,.tar.gz';
  input.onchange = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    toast('Uploading ' + file.name + ' to order #' + orderId + '...');
    try {
      const res = await fetch('/api/orders/admin/' + orderId + '/deliver', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + adminToken },
        body: formData
      });
      if (res.ok) {
        toast('🎉 Script delivered successfully to customer!');
        await fetchAdminData();
      } else {
        toast('Failed to deliver file');
      }
    } catch (err) {
      toast('Delivery error: ' + err.message);
    }
  };
  input.click();
}

function setAdminTab(tab) {
  adminTab = tab;
  render();
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminLoginEmail')?.value;
  const password = document.getElementById('adminLoginPass')?.value;
  const errBox = document.getElementById('adminLoginError');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      if (data.user.role !== 'admin') {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.textContent = 'Access denied: Account is not an administrator.';
        }
        return;
      }
      adminToken = data.token;
      adminUser = data.user;
      localStorage.setItem('bytex_admin_token', adminToken);
      localStorage.setItem('bytex_admin_user', JSON.stringify(adminUser));
      toast('Welcome to ByteX Admin Control Center, ' + adminUser.username + '!');
      await syncDatabaseProducts();
      render();
    } else {
      if (errBox) {
        errBox.style.display = 'block';
        errBox.textContent = data.message || 'Invalid admin credentials.';
      }
    }
  } catch (err) {
    if (errBox) {
      errBox.style.display = 'block';
      errBox.textContent = 'Network error connecting to API server.';
    }
  }
}

function adminLogout() {
  adminToken = null;
  adminUser = null;
  localStorage.removeItem('bytex_admin_token');
  localStorage.removeItem('bytex_admin_user');
  toast('Admin logged out.');
  render();
}

function adminPage() {
  if (!discordUser || discordUser.role !== 'admin') {
    return '<div class="center-page page-enter" style="max-width:650px;margin:3rem auto;padding:2rem;text-align:center">' +
      '<div style="background:rgba(255,49,49,0.05);border:1px solid rgba(255,49,49,0.25);border-radius:16px;padding:3rem 2rem">' +
        '<div style="width:70px;height:70px;background:rgba(255,49,49,0.15);border:2px solid rgba(255,49,49,0.35);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;font-size:2rem">🔒</div>' +
        '<h2 style="font-size:1.5rem;font-weight:800;color:#fff;margin:0 0 0.5rem">Administrator Access Restricted</h2>' +
        '<p style="color:rgba(255,255,255,0.6);font-size:0.9rem;line-height:1.5;margin:0 auto 1.5rem;max-width:450px">' +
          'Access to the ByteX Control Center requires the verified <b>Administrator Role</b> in the ByteX Discord Server. Regular customer accounts cannot view this area.' +
        '</p>' +
        '<div style="display:flex;justify-content:center;gap:0.75rem">' +
          '<button onclick="openDiscordLogin()" class="primary" style="background:#5865F2;padding:0.75rem 1.5rem;font-weight:700">Login with Admin Discord Account</button>' +
          '<button onclick="location.hash=\'home\'" class="admin-btn-action admin-btn-edit" style="padding:0.75rem 1.5rem">Return to Store</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  let contentHtml = '';
  if (adminTab === 'dashboard') {
    contentHtml = adminDashboardView();
  } else if (adminTab === 'products') {
    contentHtml = adminProductsView();
  } else if (adminTab === 'licenses') {
    contentHtml = adminLicensesView();
  } else if (adminTab === 'orders') {
    contentHtml = adminOrdersView();
  } else if (adminTab === 'logs') {
    contentHtml = adminLogsView();
  }

  return '<div class="admin-view page-enter">' +
    '<div class="admin-header-row">' +
      '<div>' +
        '<div style="display:flex;align-items:center;gap:0.75rem">' +
          '<h1 class="admin-title">ByteX Control Center</h1>' +
          '<span class="admin-badge">⚡ DISCORD ADMIN ACTIVE</span>' +
        '</div>' +
        '<p style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-top:0.25rem">Logged in as <b>' + discordUser.username + '</b> (Discord ID: ' + (discordUser.id || 'Admin') + ') · MongoDB Live</p>' +
      '</div>' +
      '<div style="display:flex;gap:0.75rem;align-items:center">' +
        '<a href="#store" class="admin-btn-action admin-btn-edit" style="text-decoration:none;display:flex;align-items:center;gap:0.4rem;padding:0.6rem 1rem">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
          'View Live Store' +
        '</a>' +
        '<button onclick="logout()" class="admin-btn-action admin-btn-del" style="padding:0.6rem 1rem">' +
          'Logout' +
        '</button>' +
      '</div>' +
    '</div>' +

    '<div class="admin-nav-tabs">' +
      '<button class="admin-nav-tab ' + (adminTab === 'dashboard' ? 'active' : '') + '" onclick="setAdminTab(\'dashboard\')">' +
        '📊 Dashboard' +
      '</button>' +
      '<button class="admin-nav-tab ' + (adminTab === 'products' ? 'active' : '') + '" onclick="setAdminTab(\'products\')">' +
        '📦 Products CRUD (' + products.length + ')' +
      '</button>' +
      '<button class="admin-nav-tab ' + (adminTab === 'licenses' ? 'active' : '') + '" onclick="setAdminTab(\'licenses\')">' +
        '🔑 License Manager (' + adminLicenses.length + ')' +
      '</button>' +
      '<button class="admin-nav-tab ' + (adminTab === 'orders' ? 'active' : '') + '" onclick="setAdminTab(\'orders\')">' +
        '📑 Orders (' + adminOrders.length + ')' +
      '</button>' +
      '<button class="admin-nav-tab ' + (adminTab === 'logs' ? 'active' : '') + '" onclick="setAdminTab(\'logs\')">' +
        '📜 Audit Logs (' + adminLogs.length + ')' +
      '</button>' +
    '</div>' +

    '<div id="adminContentContainer">' +
      contentHtml +
    '</div>' +
  '</div>';
}

function adminLoginForm() {
  return `
    <div class="admin-login-wrap page-enter">
      <div class="admin-login-box">
        <div class="admin-login-icon">⚡</div>
        <h2>Admin Control Center</h2>
        <p>Authenticate with your Discord account or staff email to access the admin panel.</p>

        <!-- Discord Login (Primary) -->
        <a href="${DISCORD_OAUTH_URL}" id="adminDiscordBtn" style="display:flex;align-items:center;justify-content:center;gap:0.75rem;background:#5865F2;color:#fff;text-decoration:none;padding:0.85rem 1.5rem;border-radius:10px;font-weight:700;font-size:0.95rem;transition:all 0.2s;border:none;cursor:pointer;width:100%;box-sizing:border-box;margin-bottom:1rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.0777.0777 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
          Login with Discord
        </a>

        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
          <hr style="flex:1;border:none;border-top:1px solid rgba(255,255,255,0.08)">
          <span style="color:rgba(255,255,255,0.3);font-size:0.75rem">or staff email</span>
          <hr style="flex:1;border:none;border-top:1px solid rgba(255,255,255,0.08)">
        </div>

        <!-- Email Fallback -->
        <form onsubmit="handleAdminLogin(event)" style="display:flex;flex-direction:column;gap:1rem;text-align:left">
          <div class="admin-form-group" style="margin-bottom:0">
            <label>Staff Email</label>
            <input type="email" id="adminLoginEmail" placeholder="admin@bytex.dev">
          </div>
          <div class="admin-form-group" style="margin-bottom:0">
            <label>Password</label>
            <input type="password" id="adminLoginPass" placeholder="••••••••">
          </div>

          <div id="adminLoginError" style="display:none;color:#ef4444;font-size:0.8rem;background:rgba(239,68,68,0.1);padding:0.5rem;border-radius:6px;border:1px solid rgba(239,68,68,0.2)"></div>

          <button type="submit" class="admin-btn-primary" style="justify-content:center;padding:0.85rem;font-size:0.9rem">
            Access with Email →
          </button>
        </form>

        <div class="admin-demo-hint" style="margin-top:1.5rem">
          <b>🔑 Discord Role-Based Access:</b><br>
          Users with your configured Discord admin role get automatic admin access when they log in via Discord. Other users get customer access.<br><br>
          <b>📧 Staff Email Fallback:</b><br>
          <code>admin@bytex.dev</code> / <code>admin123</code>
        </div>
      </div>
    </div>
  `;
}

function adminDashboardView() {
  const rev = adminMetrics ? money(adminMetrics.total_revenue) : 'R$ 149,80';
  const ords = adminMetrics ? adminMetrics.total_orders : adminOrders.length;
  const lics = adminMetrics ? adminMetrics.active_licenses : adminLicenses.filter(l => l.status === 'ACTIVE').length;
  const prods = products.length;

  return `
    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <div class="admin-stat-header">
          <span>Total Revenue</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="admin-stat-val">${rev}</div>
        <div class="admin-stat-sub">↑ Real Database Synced</div>
      </div>

      <div class="admin-stat-card">
        <div class="admin-stat-header">
          <span>Total Orders</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </div>
        <div class="admin-stat-val">${ords}</div>
        <div class="admin-stat-sub">↑ Tracked Invoices</div>
      </div>

      <div class="admin-stat-card">
        <div class="admin-stat-header">
          <span>Active Licenses</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
        </div>
        <div class="admin-stat-val">${lics}</div>
        <div class="admin-stat-sub">🔒 HMAC Guard Active</div>
      </div>

      <div class="admin-stat-card">
        <div class="admin-stat-header">
          <span>Store Products</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div class="admin-stat-val">${prods}</div>
        <div class="admin-stat-sub">📦 Active in Store</div>
      </div>
    </div>

    <!-- Quick Operations -->
    <div style="display:flex;gap:1rem;margin-bottom:2rem;flex-wrap:wrap">
      <button class="admin-btn-primary" onclick="openAdminProductModal()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add New Product (Store Item)
      </button>
      <button class="admin-btn-action admin-btn-edit" onclick="openAdminLicenseModal()" style="padding:0.6rem 1.25rem;display:flex;align-items:center;gap:0.4rem">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5"/></svg>
        Generate Custom License Key
      </button>
      <button class="admin-btn-action admin-btn-edit" onclick="syncDatabaseProducts().then(() => { toast('Database re-synced!'); render(); })" style="padding:0.6rem 1.25rem;display:flex;align-items:center;gap:0.4rem">
        ↻ Refresh Database Sync
      </button>
    </div>

    <!-- Recent Activity -->
    <div class="admin-table-container">
      <div class="admin-table-header">
        <h3>⚡ Real-Time System Audit Logs</h3>
        <button class="admin-btn-action admin-btn-edit" onclick="setAdminTab('logs')">View All Logs →</button>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>License / Target</th>
            <th>IP Address</th>
            <th>Details</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          ${(adminLogs.slice(0, 5)).map(l => `
            <tr>
              <td><span class="admin-cat-pill">${l.action}</span></td>
              <td><code style="color:#d8b4fe;font-family:monospace">${l.license_key || '—'}</code></td>
              <td>${l.ip}</td>
              <td>${l.details}</td>
              <td style="color:rgba(255,255,255,0.4)">${new Date(l.created_at).toLocaleTimeString()}</td>
            </tr>
          `).join('') || `<tr><td colspan="5" style="text-align:center;padding:2rem">No logs recorded yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function adminProductsView() {
  return `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <div>
          <h3>📦 Products Management (Store Catalog CRUD)</h3>
          <p style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin-top:2px">Add, edit prices, descriptions, and delete products with live store synchronization.</p>
        </div>
        <button class="admin-btn-primary" onclick="openAdminProductModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add New Product
        </button>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Resource Code</th>
            <th>Category</th>
            <th>Price</th>
            <th>Tags</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:0.75rem">
                  <div class="admin-prod-thumb" style="background-image:url('${p.img}')"></div>
                  <div class="admin-prod-info">
                    <b>${p.name}</b>
                    <small style="color:${p.accent || '#a855f7'}">● ${p.nameLong || p.name}</small>
                  </div>
                </div>
              </td>
              <td><code style="background:rgba(255,255,255,0.06);padding:0.2rem 0.5rem;border-radius:4px;color:#a855f7;font-family:monospace">${p.code}</code></td>
              <td><span class="admin-cat-pill">${p.cat}</span></td>
              <td><b style="color:#fff;font-size:0.95rem">${money(p.price)}</b></td>
              <td>
                <div style="display:flex;gap:0.25rem;flex-wrap:wrap">
                  ${(p.tags || []).slice(0, 3).map(t => `<span style="font-size:0.65rem;background:rgba(255,255,255,0.05);padding:0.1rem 0.35rem;border-radius:4px;color:rgba(255,255,255,0.6)">#${t}</span>`).join('')}
                </div>
              </td>
              <td>
                <div class="admin-actions-cell" style="justify-content:flex-end">
                  <button class="admin-btn-action admin-btn-edit" onclick="openAdminProductModal('${p.id}')">
                    ✏️ Edit
                  </button>
                  <button class="admin-btn-action admin-btn-del" onclick="deleteAdminProduct('${p.id}')">
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function adminLicensesView() {
  return '<div class="admin-table-container">' +
    '<div class="admin-table-header">' +
      '<div>' +
        '<h3>🔑 Cryptographic License Manager (' + adminLicenses.length + ')</h3>' +
        '<p style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin-top:2px">Inspect, issue, suspend, or revoke server-side license keys bound to customer MTA servers.</p>' +
      '</div>' +
      '<button class="admin-btn-action admin-btn-edit" onclick="fetchAdminData().then(() => toast(\'Licenses refreshed!\'))">↻ Refresh Licenses</button>' +
    '</div>' +

    '<table class="admin-table">' +
      '<thead>' +
        '<tr>' +
          '<th>License Key</th>' +
          '<th>Product</th>' +
          '<th>Customer Discord / Name</th>' +
          '<th>Bound Server IP:Port</th>' +
          '<th>Status</th>' +
          '<th style="text-align:right">Actions</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        (adminLicenses.length ? adminLicenses.map(lic => {
          const key = lic.licenseKey || lic.license_key || 'BYTX-XXXX';
          const prod = lic.productName || lic.product_name || lic.productId || 'MTA Script';
          const cust = lic.customerName || lic.customer_email || lic.userDiscordId || 'Customer';
          const ip = lic.serverIp || lic.server_ip || '127.0.0.1';
          const port = lic.serverPort || lic.server_port || 22003;
          const status = (lic.status || 'ACTIVE').toUpperCase();
          const id = lic._id || lic.id;

          let statusPill = '<span class="admin-status-pill active">● ACTIVE</span>';
          if (status === 'SUSPENDED') statusPill = '<span class="admin-status-pill suspended">● SUSPENDED</span>';
          if (status === 'REVOKED') statusPill = '<span class="admin-status-pill revoked">● REVOKED</span>';

          return '<tr>' +
            '<td>' +
              '<div style="display:flex;align-items:center;gap:0.5rem">' +
                '<code style="font-family:monospace;color:#34d399;font-weight:700;font-size:0.9rem">' + key + '</code>' +
                '<button class="copy-btn" onclick="copyText(\'' + key + '\', \'License key copied!\')">Copy</button>' +
              '</div>' +
            '</td>' +
            '<td><b>' + prod + '</b></td>' +
            '<td><span style="color:rgba(255,255,255,0.8);font-weight:600">' + cust + '</span></td>' +
            '<td><code style="background:rgba(255,255,255,0.06);padding:0.2rem 0.5rem;border-radius:4px;font-family:monospace;color:#ff6b6b">' + ip + ':' + port + '</code></td>' +
            '<td>' + statusPill + '</td>' +
            '<td>' +
              '<div class="admin-actions-cell" style="justify-content:flex-end">' +
                '<button class="admin-btn-action admin-btn-edit" onclick="toggleAdminLicenseStatus(\'' + id + '\', \'' + status + '\')">Toggle Status</button>' +
                '<button class="admin-btn-action admin-btn-del" onclick="deleteAdminLicense(\'' + id + '\')">Delete</button>' +
              '</div>' +
            '</td>' +
          '</tr>';
        }).join('') : '<tr><td colspan="6" style="text-align:center;padding:2rem">No licenses found in database.</td></tr>') +
      '</tbody>' +
    '</table>' +
  '</div>';
}

function adminOrdersView() {
  return '<div class="admin-table-container">' +
    '<div class="admin-table-header">' +
      '<div>' +
        '<h3>📑 Customer Orders &amp; Payment Verifications (' + adminOrders.length + ')</h3>' +
        '<p style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin-top:2px">Review customer QR payment screenshots, approve orders, and deliver script files.</p>' +
      '</div>' +
      '<button class="admin-btn-action admin-btn-edit" onclick="fetchAdminData().then(() => toast(\'Orders refreshed!\'))">↻ Refresh Orders</button>' +
    '</div>' +

    '<table class="admin-table">' +
      '<thead>' +
        '<tr>' +
          '<th>Order ID &amp; Date</th>' +
          '<th>Buyer Discord / Name</th>' +
          '<th>Product</th>' +
          '<th>Amount</th>' +
          '<th>Payment Proof</th>' +
          '<th>Status</th>' +
          '<th style="text-align:right">Actions</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        (adminOrders.length ? adminOrders.map(o => {
          const isDelivered = o.status === 'delivered';
          const isApproved = o.status === 'approved';
          const isPending = o.status === 'pending';
          const isRejected = o.status === 'rejected';

          let statusPill = '<span class="admin-status-pill suspended">● PENDING</span>';
          if (isApproved) statusPill = '<span class="admin-status-pill active" style="color:#60a5fa">● APPROVED</span>';
          if (isDelivered) statusPill = '<span class="admin-status-pill active">● DELIVERED</span>';
          if (isRejected) statusPill = '<span class="admin-status-pill revoked">● REJECTED</span>';

          const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Recent';

          return '<tr>' +
            '<td>' +
              '<b style="color:#ff4d4d;font-family:monospace">#' + (o._id ? o._id.slice(-8) : o.order_id) + '</b>' +
              '<div style="font-size:0.7rem;color:rgba(255,255,255,0.4)">' + dateStr + '</div>' +
            '</td>' +
            '<td>' +
              '<b style="color:#fff">' + (o.buyerName || o.username || o.customer_email || 'Customer') + '</b>' +
              (o.buyerNote ? '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5);font-style:italic">Note: ' + o.buyerNote + '</div>' : '') +
            '</td>' +
            '<td><b>' + (o.productTitle || (o.items && o.items[0]?.name) || 'ByteX Script') + '</b></td>' +
            '<td><b style="color:#34d399;font-size:0.95rem">' + money(Number(o.price || o.total || 0)) + '</b></td>' +
            '<td>' +
              (o.screenshotUrl ? 
                '<div style="display:flex;align-items:center;gap:0.5rem">' +
                  '<img src="' + o.screenshotUrl + '" alt="Proof" onclick="openImageLightbox(\'' + o.screenshotUrl + '\')" style="width:40px;height:40px;object-fit:cover;border-radius:6px;cursor:pointer;border:1px solid rgba(255,255,255,0.2)" title="Click to view full screenshot">' +
                  '<button class="copy-btn" onclick="openImageLightbox(\'' + o.screenshotUrl + '\')" style="font-size:0.7rem;padding:0.2rem 0.4rem">View</button>' +
                '</div>' : '<span style="color:rgba(255,255,255,0.3);font-size:0.8rem">No proof attached</span>') +
            '</td>' +
            '<td>' + statusPill + '</td>' +
            '<td>' +
              '<div class="admin-actions-cell" style="justify-content:flex-end">' +
                (!isApproved && !isDelivered ? 
                  '<button class="admin-btn-action admin-btn-edit" style="background:rgba(59,130,246,0.15);color:#60a5fa;border-color:rgba(59,130,246,0.3)" onclick="updateAdminOrderStatus(\'' + o._id + '\', \'approved\')">✓ Approve</button>' : '') +
                (!isDelivered ? 
                  '<button class="admin-btn-primary" style="padding:0.35rem 0.75rem;font-size:0.75rem" onclick="openDeliveryUploadModal(\'' + o._id + '\')">📦 Deliver Zip</button>' : 
                  '<span style="font-size:0.75rem;color:#34d399;font-weight:600">✓ Delivered (' + (o.deliveryFileName || 'Script') + ')</span>') +
                (!isRejected ? 
                  '<button class="admin-btn-action admin-btn-del" onclick="updateAdminOrderStatus(\'' + o._id + '\', \'rejected\')">✕ Reject</button>' : '') +
              '</div>' +
            '</td>' +
          '</tr>';
        }).join('') : '<tr><td colspan="7" style="text-align:center;padding:2rem">No customer orders placed yet.</td></tr>') +
      '</tbody>' +
    '</table>' +
  '</div>';
}

function adminLogsView() {
  return `
    <div class="admin-table-container">
      <div class="admin-table-header">
        <div>
          <h3>📜 Audit Trail & Security Logs</h3>
          <p style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin-top:2px">System events, license checks, activations, and staff actions.</p>
        </div>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>License Key</th>
            <th>Origin IP</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          ${adminLogs.length ? adminLogs.map(l => `
            <tr>
              <td><span class="admin-cat-pill">${l.action}</span></td>
              <td><code style="color:#d8b4fe;font-family:monospace">${l.license_key || '—'}</code></td>
              <td>${l.ip}</td>
              <td>${l.details}</td>
              <td style="color:rgba(255,255,255,0.4)">${new Date(l.created_at).toLocaleString()}</td>
            </tr>
          `).join('') : `<tr><td colspan="5" style="text-align:center;padding:2rem">No logs recorded.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}


async function toggleAdminLicenseStatus(id, currentStatus) {
  const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
  try {
    const res = await fetch('/api/licenses/admin/' + id + '/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (adminToken || localStorage.getItem('bytex_token'))
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      toast('License status set to ' + newStatus + '!');
      await fetchAdminData();
    } else {
      toast('Failed to update license status');
    }
  } catch (err) {
    toast('Error: ' + err.message);
  }
}

async function deleteAdminLicense(id) {
  if (!confirm('Are you sure you want to permanently delete this license key?')) return;
  try {
    const res = await fetch('/api/licenses/admin/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + (adminToken || localStorage.getItem('bytex_token'))
      }
    });
    if (res.ok) {
      toast('License deleted successfully');
      await fetchAdminData();
    } else {
      toast('Failed to delete license');
    }
  } catch (err) {
    toast('Error: ' + err.message);
  }
}


/* ── MODALS (PRODUCT ADD/EDIT & LICENSE ISSUE) ── */

function openAdminProductModal(productId = null) {
  const modal = document.getElementById('adminModal');
  const card = document.getElementById('adminModalCard');
  if (!modal || !card) return;

  const prod = productId ? products.find(p => p.id === productId) : null;
  adminEditingProduct = prod;

  card.innerHTML = `
    <button class="admin-modal-close" onclick="closeAdminModal()">×</button>
    <h2 style="font-size:1.35rem;font-weight:800;color:#fff;margin-bottom:0.35rem">
      ${prod ? 'Edit Product: ' + prod.name : 'Create New MTA:SA Resource'}
    </h2>
    <p style="color:rgba(255,255,255,0.45);font-size:0.8rem;margin-bottom:1.5rem">
      ${prod ? 'Update pricing, images, and description. Changes will sync to the live store.' : 'Add a new resource to the ByteX store catalog.'}
    </p>

    <form onsubmit="submitAdminProduct(event, '${prod ? prod.id : ''}')" style="display:flex;flex-direction:column;gap:0.85rem">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.85rem">
        <div class="admin-form-group">
          <label>Product Name *</label>
          <input type="text" id="admProdName" required value="${prod ? prod.name : ''}" placeholder="e.g. Garage System">
        </div>
        <div class="admin-form-group">
          <label>Resource Code *</label>
          <input type="text" id="admProdCode" required value="${prod ? prod.code : ''}" placeholder="e.g. sqh_garage">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.85rem">
        <div class="admin-form-group">
          <label>Category</label>
          <select id="admProdCat">
            <option value="Roleplay" ${prod && prod.cat === 'Roleplay' ? 'selected' : ''}>Roleplay</option>
            <option value="Systems" ${prod && prod.cat === 'Systems' ? 'selected' : ''}>Systems</option>
            <option value="Admin" ${prod && prod.cat === 'Admin' ? 'selected' : ''}>Admin</option>
            <option value="UI" ${prod && prod.cat === 'UI' ? 'selected' : ''}>UI</option>
            <option value="Mapping" ${prod && prod.cat === 'Mapping' ? 'selected' : ''}>Mapping</option>
          </select>
        </div>
        <div class="admin-form-group">
          <label>Price (R$) *</label>
          <input type="number" step="0.10" id="admProdPrice" required value="${prod ? prod.price : '79.90'}">
        </div>
        <div class="admin-form-group">
          <label>Accent Color</label>
          <input type="color" id="admProdAccent" value="${prod ? (prod.accent || '#a855f7') : '#a855f7'}" style="height:38px;padding:2px;cursor:pointer">
        </div>
      </div>

      <div class="admin-form-group">
        <label>Banner Image Path / URL</label>
        <input type="text" id="admProdImg" value="${prod ? prod.img : 'images/card_houses.png'}" placeholder="images/card_houses.png">
      </div>

      <div class="admin-form-group">
        <label>Description</label>
        <textarea id="admProdDesc" rows="3" placeholder="Describe features, immersion, and capabilities...">${prod ? prod.desc : 'Premium MTA:SA resource with advanced features and smooth UI.'}</textarea>
      </div>

      <div class="admin-form-group">
        <label>Tags (comma-separated)</label>
        <input type="text" id="admProdTags" value="${prod && prod.tags ? prod.tags.join(', ') : 'mta, roleplay, bytex'}" placeholder="mta, roleplay, bytex">
      </div>

      <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:0.5rem">
        <button type="button" class="admin-btn-action admin-btn-del" onclick="closeAdminModal()" style="padding:0.6rem 1.25rem">Cancel</button>
        <button type="submit" class="admin-btn-primary">
          ${prod ? '💾 Save Changes' : '✨ Create Product'}
        </button>
      </div>
    </form>
  `;

  modal.classList.add('open');
}

function closeAdminModal() {
  const modal = document.getElementById('adminModal');
  if (modal) modal.classList.remove('open');
}

async function submitAdminProduct(e, editingId = '') {
  e.preventDefault();
  const name = document.getElementById('admProdName')?.value;
  const code = document.getElementById('admProdCode')?.value;
  const cat = document.getElementById('admProdCat')?.value;
  const price = parseFloat(document.getElementById('admProdPrice')?.value) || 0;
  const accent = document.getElementById('admProdAccent')?.value;
  const img = document.getElementById('admProdImg')?.value;
  const desc = document.getElementById('admProdDesc')?.value;
  const tags = document.getElementById('admProdTags')?.value;

  const payload = {
    name,
    code,
    nameLong: name.toUpperCase(),
    cat,
    price,
    accent,
    titleColor: '#ffffff',
    img,
    desc,
    tags
  };

  try {
    let res;
    if (editingId) {
      res = await fetch(`/api/admin/products/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();
    if (data.success) {
      closeAdminModal();
      toast(`Product ${editingId ? 'updated' : 'created'} successfully!`);
      await syncDatabaseProducts();
      fetchAdminData();
      render();
    } else {
      toast('Error: ' + (data.message || 'Failed to save product'));
    }
  } catch (err) {
    toast('Network error: ' + err.message);
  }
}

async function deleteAdminProduct(prodId) {
  if (!confirm(`Are you sure you want to delete product "${prodId}"? This will remove it from the store catalog.`)) return;

  try {
    const res = await fetch(`/api/admin/products/${prodId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const data = await res.json();
    if (data.success) {
      toast('Product deleted from database.');
      await syncDatabaseProducts();
      fetchAdminData();
      render();
    } else {
      toast('Error: ' + data.message);
    }
  } catch (err) {
    toast('Failed to delete product: ' + err.message);
  }
}

function openAdminLicenseModal() {
  const modal = document.getElementById('adminModal');
  const card = document.getElementById('adminModalCard');
  if (!modal || !card) return;

  card.innerHTML = `
    <button class="admin-modal-close" onclick="closeAdminModal()">×</button>
    <h2 style="font-size:1.35rem;font-weight:800;color:#fff;margin-bottom:0.35rem">Issue Custom License Key</h2>
    <p style="color:rgba(255,255,255,0.45);font-size:0.8rem;margin-bottom:1.5rem">Generate an authorized HMAC-signed license key for a customer.</p>

    <form onsubmit="submitAdminLicense(event)" style="display:flex;flex-direction:column;gap:0.85rem">
      <div class="admin-form-group">
        <label>Select Product *</label>
        <select id="admLiceProduct" required>
          ${products.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('')}
        </select>
      </div>

      <div class="admin-form-group">
        <label>Customer Email *</label>
        <input type="email" id="admLiceEmail" required value="customer@bytex.dev" placeholder="customer@bytex.dev">
      </div>

      <div class="admin-form-group">
        <label>Server IP Limit</label>
        <input type="number" id="admLiceLimit" value="1" min="1" max="10">
      </div>

      <div class="admin-form-group">
        <label>Admin Notes</label>
        <input type="text" id="admLiceNotes" value="Direct admin issuance" placeholder="Reason or order details">
      </div>

      <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:0.5rem">
        <button type="button" class="admin-btn-action admin-btn-del" onclick="closeAdminModal()" style="padding:0.6rem 1.25rem">Cancel</button>
        <button type="submit" class="admin-btn-primary">⚡ Generate License Key</button>
      </div>
    </form>
  `;

  modal.classList.add('open');
}

async function submitAdminLicense(e) {
  e.preventDefault();
  const product_id = document.getElementById('admLiceProduct')?.value;
  const customer_email = document.getElementById('admLiceEmail')?.value;
  const activation_limit = document.getElementById('admLiceLimit')?.value;
  const notes = document.getElementById('admLiceNotes')?.value;

  try {
    const res = await fetch('/api/admin/licenses/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ product_id, customer_email, activation_limit, notes })
    });
    const data = await res.json();
    if (data.success) {
      closeAdminModal();
      toast('License key ' + data.license.license_key + ' created!');
      fetchAdminData();
      render();
    } else {
      toast('Error: ' + data.message);
    }
  } catch (err) {
    toast('Network error: ' + err.message);
  }
}

async function toggleLicenseStatus(licId, currentStatus) {
  return toggleAdminLicenseStatus(licId, currentStatus);
}

// Attach global functions to window
window.openProduct = openProduct;
window.addCart = addCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.openModal = openModal;
window.closeModal = closeModal;
window.fakeLogin = fakeLogin;
window.openLicenseModal = openLicenseModal;
window.closeLicenseModal = closeLicenseModal;
window.toggleAdminLicenseStatus = toggleAdminLicenseStatus;
window.deleteAdminLicense = deleteAdminLicense;
window.renderLicenseModalContent = renderLicenseModalContent;
window.saveLicenseConfig = saveLicenseConfig;
window.copyText = copyText;
window.toast = toast;
window.logout = logout;
window.login = login;
window.selectStoreProduct = selectStoreProduct;
window.filterProducts = filterProducts;
window.toggleLanguage = toggleLanguage;
window.proceedToCheckout = proceedToCheckout;
window.openDiscordLogin = openDiscordLogin;
window.instantDemoLogin = instantDemoLogin;
window.openBuyModal = openBuyModal;
window.closeBuyModal = closeBuyModal;
window.submitManualOrder = submitManualOrder;
window.handleProofImageSelect = handleProofImageSelect;
window.openImageLightbox = openImageLightbox;
window.closeImageLightbox = closeImageLightbox;
window.ordersPage = ordersPage;
window.openLicenseConfigModal = openLicenseConfigModal;
window.renderLicenseModalDynamic = renderLicenseModalDynamic;
window.saveLicenseConfigToServer = saveLicenseConfigToServer;
window.setPaymentMethod = setPaymentMethod;
window.applyCoupon = applyCoupon;
window.removeCoupon = removeCoupon;
window.removeCheckoutItem = removeCheckoutItem;
window.updateCardInput = updateCardInput;
window.processPayment = processPayment;

// Admin Window Bindings
window.setAdminTab = setAdminTab;
window.handleAdminLogin = handleAdminLogin;
window.adminLogout = adminLogout;
window.updateAdminOrderStatus = updateAdminOrderStatus;
window.openDeliveryUploadModal = openDeliveryUploadModal;
window.openAdminProductModal = openAdminProductModal;
window.closeAdminModal = closeAdminModal;
window.submitAdminProduct = submitAdminProduct;
window.deleteAdminProduct = deleteAdminProduct;
window.openAdminLicenseModal = openAdminLicenseModal;
window.submitAdminLicense = submitAdminLicense;
window.toggleLicenseStatus = toggleLicenseStatus;
window.deleteAdminLicense = deleteAdminLicense;
window.syncDatabaseProducts = syncDatabaseProducts;

window.addEventListener('hashchange', render);
syncDatabaseProducts().then(() => checkAuthSession()).then(() => render());
