import { initializeApp } from "https://www.gstatic.com/firebasejs/9/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9/firebase-firestore.js";
import { firebaseConfig, lineConfig } from "/LINDSHOP/core/firebase-config.js";

// 1. 初始化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 測試用的產品數據
const MOCK_PRODUCTS = [
  { id: '1', name: '韓系極簡T恤', price: 299, imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3E產品圖片%3C/text%3E%3C/svg%3E' },
  { id: '2', name: '韓系包包', price: 599, imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3E產品圖片%3C/text%3E%3C/svg%3E' },
  { id: '3', name: '韓系鞋子', price: 399, imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3E產品圖片%3C/text%3E%3C/svg%3E' }
];

function loadUserData(userId) {
  console.log('User ID:', userId);
}

async function initLiff() {
  try {
    console.log('Initializing LIFF with ID:', lineConfig.liffId);
    await liff.init({ liffId: lineConfig.liffId });
    if (!liff.isLoggedIn()) {
      console.log('User not logged in, redirecting to login');
      liff.login();
    } else {
      const profile = await liff.getProfile();
      loadUserData(profile.userId);
      await loadProducts();
    }
  } catch (err) {
    console.error('LIFF initialization failed:', err);
    await loadProducts();
  }
}

async function loadProducts() {
  try {
    console.log('Starting to load products from Firestore...');
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productList = document.getElementById('productList');
    
    if (!productList) {
      console.error('productList element not found');
      return;
    }

    let products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    console.log('Loaded products from Firebase:', products.length);

    // 如果沒有從 Firebase 獲取到產品，使用測試數據
    if (products.length === 0) {
      console.warn('No products found in Firebase, using mock data');
      products = MOCK_PRODUCTS;
    }

    // 渲染產品
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
    console.log('Products rendered successfully');
  } catch (err) {
    console.error('Failed to load products:', err);
    // 加載失敗時顯示測試數據
    const productList = document.getElementById('productList');
    if (productList) {
      let html = '';
      MOCK_PRODUCTS.forEach(p => {
        html += `
          <div class="product-card group cursor-pointer" onclick="location.href='product.html?id=${p.id}'">
            <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
              <img src="${p.imageUrl}" class="w-full h-full object-cover">
            </div>
            <h3 class="text-[13px] font-medium truncate">${p.name}</h3>
            <p class="text-sm font-bold mt-1">$${p.price}</p>
          </div>
        `;
      });
      productList.innerHTML = html;
    }
  }
}

function renderSpecs(allSpecs, lastBoughtSpec) {
  const grid = document.getElementById('specGrid');
  if (!grid) return;
  
  allSpecs.forEach(spec => {
    const isLast = spec === lastBoughtSpec;
    grid.innerHTML += `
      <div class="border p-2 text-center rounded-lg text-sm transition ${isLast ? 'border-black bg-black text-white' : 'hover:border-gray-400'} relative">
        ${spec}
        ${isLast ? '<span class="absolute -top-1 -right-1">⭐</span>' : ''}
      </div>
    `;
  });
}

// 啟動應用
initLiff();
