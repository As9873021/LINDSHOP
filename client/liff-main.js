// Firebase 配置直接內嵌
const firebaseConfig = {
  apiKey: "AIzaSyD-7mRcOze2du2Jqyy5aRV13lc0a7ys",
  authDomain: "shop-autopilot-system.firebaseapp.com",
  projectId: "shop-autopilot-system",
  storageBucket: "shop-autopilot-system.firebasestorage.app",
  messagingSenderId: "502644443592",
  appId: "1:502644443592:web:b50accae4965afc75e58fd"
};

const lineConfig = {
  liffId: "2008796603-pGlF9Ep0",
  channelAccessToken: "wcb3BPCz+RHFnpFLzXSEFy7JQ1Be2FQ3Mc3JNLhdY86/R8vA/N3gqD8i2bZUf0R8k5mm4XU:/ic7VJNg21SXrPMww+1P04FpJAtLYYRa2Z91EX23Hb"
};

// 測試產品數據
const MOCK_PRODUCTS = [
  { id: '1', name: '韓系極簡T恤', price: 299, imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3E韓系極簡T恤%3C/text%3E%3C/svg%3E', description: '高品質韓系新简風格T恤' },
  { id: '2', name: '韓系包包', price: 599, imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3E韓系包包%3C/text%3E%3C/svg%3E', description: '時尚韓系包包' },
  { id: '3', name: '韓系鞋子', price: 399, imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3E韓系鞋子%3C/text%3E%3C/svg%3E', description: '韓系極簡鞋子' }
];

const cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadUserData(userId) {
  console.log('User ID:', userId);
}

async function initLiff() {
  try {
    console.log('Initializing LIFF with ID:', lineConfig.liffId);
    if (typeof liff !== 'undefined') {
      await liff.init({ liffId: lineConfig.liffId });
      if (!liff.isLoggedIn()) {
        console.log('User not logged in');
      } else {
        const profile = await liff.getProfile();
        loadUserData(profile.userId);
      }
    } else {
      console.log('LIFF SDK not loaded');
    }
  } catch (err) {
    console.error('LIFF initialization failed:', err);
  }
  // 無論 LIFF 是否初始化成功，都要初始化頁面
  initPage();
}

function loadProducts() {
  console.log('Loading products...');
  // 直接返回模擬產品
  console.log('Products to render:', MOCK_PRODUCTS);
  return MOCK_PRODUCTS;
}

function loadProductDetail(productId) {
  return MOCK_PRODUCTS.find(p => p.id === productId);
}

async function renderHomePage() {
  const productList = document.getElementById('productList');
  if (!productList) {
    console.log('productList element not found');
    return;
  }
  
  console.log('Rendering home page...');
  const products = loadProducts();
  console.log('Products:', products);
  let html = '';
  products.forEach(p => {
    html += `
      <div class="product-card group cursor-pointer" onclick="location.href='product.html?id=${p.id}'">
        <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
          <img src="${p.imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3C/svg%3E'">
        </div>
        <h3 class="text-[13px] font-medium truncate">${p.name}</h3>
        <p class="text-sm font-bold mt-1">$${p.price}</p>
      </div>
    `;
  });
  productList.innerHTML = html;
  console.log('Home page rendered with', products.length, 'products');
}

async function renderProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  if (!productId) {
    location.href = 'index.html';
    return;
  }
  
  const product = loadProductDetail(productId);
  if (!product) return;
  
  document.getElementById('mainImg')?.setAttribute('src', product.imageUrl);
  document.getElementById('pName')?.textContent = product.name;
  document.getElementById('pPrice')?.textContent = `$${product.price}`;
  document.getElementById('pDesc')?.textContent = product.description || '';
  
  const addCartBtn = document.getElementById('addCartBtn');
  if (addCartBtn) {
    addCartBtn.onclick = () => {
      const spec = document.querySelector('[data-selected-spec]')?.getAttribute('data-selected-spec');
      cart.push({ id: productId, name: product.name, price: product.price, spec, qty: 1 });
      saveCart();
      alert('已添加到購物車');
    };
  }
  
  const specGrid = document.getElementById('specGrid');
  if (specGrid) {
    const specs = product.specs || ['-50', '0', '+50', '+100'];
    specGrid.innerHTML = '';
    specs.forEach(spec => {
      const btn = document.createElement('button');
      btn.textContent = spec;
      btn.className = 'border p-2 text-center rounded-lg text-sm hover:border-gray-400 transition';
      btn.onclick = () => {
        document.querySelectorAll('[data-selected-spec]').forEach(el => {
          el.removeAttribute('data-selected-spec');
          el.classList.remove('bg-black', 'text-white', 'border-black');
        });
        btn.setAttribute('data-selected-spec', spec);
        btn.classList.add('bg-black', 'text-white', 'border-black');
      };
      specGrid.appendChild(btn);
    });
  }
}

function renderCartPage() {
  const cartList = document.getElementById('cartList');
  if (!cartList) return;
  
  let total = 0;
  let html = '';
  cart.forEach((item, idx) => {
    total += item.price * (item.qty || 1);
    html += `
      <div class="border-b pb-4 mb-4">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-medium">${item.name}</p>
            <p class="text-sm text-gray-500">規格: ${item.spec || '-'}</p>
            <p class="text-sm font-bold mt-1">$${item.price} x ${item.qty || 1}</p>
          </div>
          <button onclick="removeCartItem(${idx})" class="text-red-500 text-sm">x</button>
        </div>
      </div>
    `;
  });
  cartList.innerHTML = html || '<p class="text-gray-500">購物車是空的</p>';
  
  const totalElement = document.getElementById('cartTotal');
  if (totalElement) {
    totalElement.textContent = `$${total}`;
  }
}

window.removeCartItem = function(idx) {
  cart.splice(idx, 1);
  saveCart();
  renderCartPage();
};

function initPage() {
  console.log('initPage called');
  const pathname = window.location.pathname;
  console.log('Current page:', pathname);
  
  if (pathname.includes('product.html')) {
    renderProductPage();
  } else if (pathname.includes('cart.html')) {
    renderCartPage();
  } else {
    renderHomePage();
  }
}

// 確保 DOM 準備好後才初始化
if (document.readyState === 'loading') {
  console.log('DOM loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', initLiff);
} else {
  console.log('DOM already loaded, initializing LIFF');
  initLiff();
}
