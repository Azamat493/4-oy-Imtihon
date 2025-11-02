
const SELECTORS = {
  counters: [
    "#cart-counter-desktop",
    "#cart-counter-mobile",
    ".cart-count",
    ".cart-counter",
    ".cart-counter-desktop",
  ],
  totals: [".cart-total", "#cart-total-header"],
  favoritesCounters: [
    ".favorites-counter",
    ".favorites-count",
    "#favorites-counter-mobile",
    "#favorites-counter-desktop",
  ],
};

function qAll(sel) {
  try {
    return Array.from(document.querySelectorAll(sel));
  } catch {
    return [];
  }
}

function setTextOnMany(selectors, value) {
  selectors.forEach((sel) => {
    qAll(sel).forEach((el) => {
      el.textContent = value;
    });
  });
}

function getFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem("favorites"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCounter();
  renderCart();
}

function updateFavoritesCounter() {
  const count = getFavorites().length;
  setTextOnMany(SELECTORS.favoritesCounters, count);
}

function getFavoriteSvg(isFav) {
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.9" d="M1.85938 11.7344L8.91797 18.3242C9.21094 18.5977 9.59766 18.75 10 18.75C10.4023 18.75 10.7891 18.5977 11.082 18.3242L18.1406 11.7344C19.3281 10.6289 20 9.07815 20 7.45706V7.23049C20 4.50003 18.0273 2.1719 15.3359 1.72268C13.5547 1.42581 11.7422 2.00784 10.4688 3.28128L10 3.75003L9.53125 3.28128C8.25781 2.00784 6.44531 1.42581 4.66406 1.72268C1.97266 2.1719 0 4.50003 0 7.23049V7.45706C0 9.07815 0.671875 10.6289 1.85938 11.7344Z" fill="${isFav ? '#ef4444' : '#888888'}" />
  </svg>`;
}

function toggleFavorite(product, button) {
  const favorites = getFavorites();
  const idx = favorites.findIndex((p) => p.id === product.id);
  let isFav;
  if (idx === -1) {
    favorites.push(product);
    isFav = true;
  } else {
    favorites.splice(idx, 1);
    isFav = false;
  }
  button.innerHTML = getFavoriteSvg(isFav);
  saveFavorites(favorites);
  updateFavoritesCounter();
}


let cart = [];

function loadCartFromStorage() {
  try {
    const raw = JSON.parse(localStorage.getItem("cart"));
    cart = Array.isArray(raw) ? raw : [];
  } catch {
    cart = [];
  }
}

function persistCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounters(); 
}


function updateCartCounters() {
  const totalItems = cart.length; 
  const totalPrice = cart.reduce(
    (s, it) => s + (Number(it.price_uzs || 0) * (parseInt(it.quantity || 1, 10) || 0)),
    0
  );

  setTextOnMany(SELECTORS.counters, totalItems);
  setTextOnMany(SELECTORS.totals, totalPrice.toLocaleString() + " сум");

  
  console.log("[cart] counters updated — kinds:", totalItems, "price:", totalPrice);
}


function addToCart(product, qty = 1) {
  const idx = cart.findIndex((p) => p.id === product.id);
  if (idx === -1) {
    cart.push(Object.assign({}, product, { quantity: qty }));
  } else {
    cart[idx].quantity = (parseInt(cart[idx].quantity || 0, 10) || 0) + qty;
  }
  persistCart();
  renderCart();
}

function removeFromCartById(productId) {
  const idx = cart.findIndex((p) => p.id === productId);
  if (idx > -1) {
    cart.splice(idx, 1); 
    persistCart();
    renderCart();
  }
}

function setQuantity(productId, quantity) {
  const idx = cart.findIndex((p) => p.id === productId);
  if (idx > -1) {
    if (quantity <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx].quantity = quantity;
    }
    persistCart();
    renderCart();
  }
}

function changeQuantity(productId, delta) {
  const idx = cart.findIndex((p) => p.id === productId);
  if (idx > -1) {
    const newQ = (parseInt(cart[idx].quantity || 1, 10) || 0) + delta;
    if (newQ <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx].quantity = newQ;
    }
    persistCart();
    renderCart();
  }
}


function renderCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  if (!cartItemsDiv) return;

  const favorites = getFavorites();
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="text-center text-gray-500 text-lg py-10">Корзина пуста 🛒</p>';
    updateCartCounters();
    return;
  }

  cart.forEach((product) => {
    const qty = parseInt(product.quantity || 1, 10) || 1;
    const price = Number(product.price_uzs || 0) || 0;
    const isFavorite = favorites.some((f) => f.id === product.id);

    const card = document.createElement("div");
    card.className = "flex flex-col md:flex-row justify-between gap-5 items-start sm:items-center border-b border-gray-200 pb-4 sm:pb-6";

    card.innerHTML = `
      <div class="flex items-start sm:items-center space-x-4 w-full md:w-2/3">
        <img src="${product.image_url || ''}" alt="${(product.description||'')}" class="w-40 h-40 object-contain rounded-md" />
        <div class="flex-1">
          <h3 class="text-sm md:text-base font-medium text-gray-900">${product.description || ''}</h3>
          <div class="flex items-center space-x-2 mt-1">
            <button data-action="favorite" class="p-1 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              ${getFavoriteSvg(isFavorite)}
            </button>
            <button data-action="remove" class="px-2 py-1 bg-red-600 text-white cursor-pointer rounded-full hover:bg-red-700 transition-colors">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-3 mt-3 sm:mt-0 w-full md:w-1/3 justify-between">
        <span class="font-bold text-sm sm:text-base">${price.toLocaleString()} сум</span>
        <div class="flex items-center space-x-1">
          <button data-action="decrease" class="px-2 py-1 cursor-pointer bg-gray-200 rounded hover:bg-gray-300 transition-colors">−</button>
          <span class="px-2 py-1 bg-blue-600 text-white rounded text-sm">${qty}</span>
          <button data-action="increase" class="px-2 py-1 bg-gray-200 cursor-pointer rounded hover:bg-gray-300 transition-colors">+</button>
        </div>
      </div>
    `;

    const removeBtn = card.querySelector('[data-action="remove"]');
    const incBtn = card.querySelector('[data-action="increase"]');
    const decBtn = card.querySelector('[data-action="decrease"]');
    const favBtn = card.querySelector('[data-action="favorite"]');

    removeBtn && removeBtn.addEventListener("click", () => removeFromCartById(product.id));
    incBtn && incBtn.addEventListener("click", () => changeQuantity(product.id, +1));
    decBtn && decBtn.addEventListener("click", () => changeQuantity(product.id, -1));
    favBtn && favBtn.addEventListener("click", (e) => toggleFavorite(product, e.currentTarget));

    cartItemsDiv.appendChild(card);
  });

  updateCartCounters();
  updateFavoritesCounter();
}


document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  updateCartCounters();
  updateFavoritesCounter();
  renderCart();

  window.cartAPI = {
    addToCart,
    removeFromCartById,
    setQuantity,
    getCart: () => cart.slice(),
  };
});
