
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
}

function updateFavoritesCounter() {
  const total = getFavorites().length;
  const mobile = document.getElementById("favorites-counter-mobile");
  const desktop = document.getElementById("favorites-counter-desktop");
  if (mobile) mobile.textContent = total;
  if (desktop) desktop.textContent = total;
}

function toggleFavorite(product, icon) {
  const favorites = getFavorites();
  const index = favorites.findIndex((p) => p.id === product.id);

  if (index === -1) {
    favorites.push(product);
    icon.classList.remove("fa-regular", "text-gray-800");
    icon.classList.add("fa-solid", "text-red-500");
  } else {
    favorites.splice(index, 1);
    icon.classList.remove("fa-solid", "text-red-500");
    icon.classList.add("fa-regular", "text-gray-800");
  }

  saveFavorites(favorites);
}

function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
}

function updateCartCounter() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const mobile = document.getElementById("cart-counter-mobile");
  const desktop = document.getElementById("cart-counter-desktop");
  if (mobile) mobile.textContent = total;
  if (desktop) desktop.textContent = total;
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === product.id);

  if (existing) {
    existing.quantity += 1; 
  } else {
    cart.push({ ...product, quantity: 1 }); 
  }

  saveCart(cart);
  renderCart(); 
}


function createStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let html = "";

  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fa-solid fa-star text-yellow-400"></i>';
  }
  if (halfStar)
    html += '<i class="fa-solid fa-star-half-stroke text-yellow-400"></i>';
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="fa-regular fa-star text-yellow-400"></i>';
  }
  return html;
}


let allProducts = [];

function renderProducts(products) {
  const section = document.getElementById("products-section");
  if (!section) return;
  section.innerHTML = "";

  const favorites = getFavorites();

  products.forEach((product) => {
    const id = product.id || Math.random().toString();
    const desc = product.description || "Нет описания";

    const price = parseFloat(product.price_uzs);
    const safePrice = isNaN(price) ? 0 : price;

    const rating = Number(product.rating) || 0;
    const image =
      product.image_url || "https://via.placeholder.com/200x200?text=No+Image";

    const isFav = favorites.find((p) => p.id === product.id);

    const card = document.createElement("div");
    card.className =
      "rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col";

    card.innerHTML = `
      <div class="overflow-hidden relative">
        <img src="${image}" alt="${desc}" class="mx-auto h-44 sm:h-48 object-cover" />
        <button class="absolute top-2 right-2 text-2xl cursor-pointer transition-colors duration-300 p-1" data-action="favorite">
          <i class="${isFav ? "fa-solid text-red-500" : "fa-regular text-gray-800"} fa-heart"></i>
        </button>
      </div>
      <div class="p-3 flex flex-col flex-1">
        <h3 class="text-sm sm:text-base font-medium text-gray-700 mb-1 line-clamp-2">${desc}</h3>
        <div class="text-blue-600 font-semibold text-sm sm:text-base mb-2">${price.toLocaleString()} UZS</div>
        <div class="flex items-center mb-2 space-x-1">${createStars(rating)}</div>
        <button class="mt-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 rounded-lg text-sm sm:text-base transition" data-action="cart">
          В корзину
        </button>
      </div>
    `;

    const favBtn = card.querySelector('[data-action="favorite"] i');
    card
      .querySelector('[data-action="favorite"]')
      .addEventListener("click", () => toggleFavorite(product, favBtn));
    card
      .querySelector('[data-action="cart"]')
      .addEventListener("click", () => addToCart(product));

    section.appendChild(card);
  });

  updateFavoritesCounter();
  updateCartCounter();
}


async function fetchProducts() {
  try {
    const res = await fetch(
      "https://68fae18894ec96066023c657.mockapi.io/api/v2/products2"
    );
    const data = await res.json();
    allProducts = data.slice(0, 20);
    renderProducts(allProducts);
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
  }
}


function initSearch() {
  const inputs = [
    document.getElementById("search-input"),     
    document.getElementById("menu-search-input") 
  ].filter(Boolean);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const query = (input.value || "").toLowerCase();
      if (!allProducts || allProducts.length === 0) return;

      const filtered = allProducts.filter((p) =>
        (p.description || "").toLowerCase().includes(query)
      );
      renderProducts(filtered);
    });
  });
}


function closeMobileMenuOnLinkClick() {
  const menuToggle = document.getElementById("menu-toggle");
  if (!menuToggle) return;

  const links = document.querySelectorAll(".fixed a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (menuToggle.checked) menuToggle.checked = false;
    });
  });
}


fetchProducts();
updateFavoritesCounter();
updateCartCounter();
initSearch();
closeMobileMenuOnLinkClick();
