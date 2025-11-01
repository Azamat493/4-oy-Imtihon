
document.addEventListener("DOMContentLoaded", () => {

  const toId = (id) => (id === undefined || id === null ? "" : String(id));

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

  const favoriteFilledSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="#ef4444" xmlns="http://www.w3.org/2000/svg"><path opacity="0.9" d="M1.85938 11.7344L8.91797 18.3242C9.21094 18.5977 9.59766 18.75 10 18.75C10.4023 18.75 10.7891 18.5977 11.082 18.3242L18.1406 11.7344C19.3281 10.6289 20 9.07815 20 7.45706V7.23049C20 4.50003 18.0273 2.1719 15.3359 1.72268C13.5547 1.42581 11.7422 2.00784 10.4688 3.28128L10 3.75003L9.53125 3.28128C8.25781 2.00784 6.44531 1.42581 4.66406 1.72268C1.97266 2.1719 0 4.50003 0 7.23049V7.45706C0 9.07815 0.671875 10.6289 1.85938 11.7344Z"/></svg>`;
  const favoriteEmptySvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="#888888" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" d="M1.85938 11.7344L8.91797 18.3242C9.21094 18.5977 9.59766 18.75 10 18.75C10.4023 18.75 10.7891 18.5977 11.082 18.3242L18.1406 11.7344C19.3281 10.6289 20 9.07815 20 7.45706V7.23049C20 4.50003 18.0273 2.1719 15.3359 1.72268C13.5547 1.42581 11.7422 2.00784 10.4688 3.28128L10 3.75003L9.53125 3.28128C8.25781 2.00784 6.44531 1.42581 4.66406 1.72268C1.97266 2.1719 0 4.50003 0 7.23049V7.45706C0 9.07815 0.671875 10.6289 1.85938 11.7344Z"/></svg>`;

  function toggleFavorite(product, button) {
    const favorites = getFavorites();
    const pid = toId(product.id);
    const index = favorites.findIndex((p) => toId(p.id) === pid);

    if (index === -1) {
      favorites.push({ ...product, id: pid });
      if (button) button.innerHTML = favoriteFilledSvg;
    } else {
      favorites.splice(index, 1);
      if (button) button.innerHTML = favoriteEmptySvg;
    }

    saveFavorites(favorites);
    refreshFavoriteButtons();
  }

  function isProductFavorite(productId) {
    return getFavorites().some((p) => toId(p.id) === toId(productId));
  }

  function refreshFavoriteButtons() {
    document.querySelectorAll(".product-card").forEach((card) => {
      const pid = toId(card.dataset.id);
      const favBtn = card.querySelector('[data-action="favorite"]');
      if (!favBtn) return;
      if (isProductFavorite(pid)) favBtn.innerHTML = favoriteFilledSvg;
      else favBtn.innerHTML = favoriteEmptySvg;
    });
    updateFavoritesCounter();
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
    const pid = toId(product.id);
    const existing = cart.find((p) => toId(p.id) === pid);
    if (existing) {
      return false;
    } else {
      cart.push({ ...product, id: pid, quantity: 1 });
      saveCart(cart);
      return true;
    }
  }


  function fullStar() {
    return `<svg width="20" height="20" viewBox="0 0 20 20" fill="#6682A9" xmlns="http://www.w3.org/2000/svg"><path d="M10.0001 14.3916L15.1501 17.5L13.7834 11.6416L18.3334 7.69996L12.3417 7.19163L10.0001 1.66663L7.65841 7.19163L1.66675 7.69996L6.21675 11.6416L4.85008 17.5L10.0001 14.3916Z" fill="#6682A9"/></svg>`;
  }
  function emptyStar() {
    return `<svg width="20" height="20" viewBox="0 0 20 20" fill="#ddd" xmlns="http://www.w3.org/2000/svg"><path d="M10.0001 14.3916L15.1501 17.5L13.7834 11.6416L18.3334 7.69996L12.3417 7.19163L10.0001 1.66663L7.65841 7.19163L1.66675 7.69996L6.21675 11.6416L4.85008 17.5L10.0001 14.3916Z" fill="#ddd"/></svg>`;
  }
  function halfStar() {
    return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="halfGrad"><stop offset="50%" stop-color="#6682A9"/><stop offset="50%" stop-color="#ddd"/></linearGradient></defs><path d="M10.0001 14.3916L15.1501 17.5L13.7834 11.6416L18.3334 7.69996L12.3417 7.19163L10.0001 1.66663L7.65841 7.19163L1.66675 7.69996L6.21675 11.6416L4.85008 17.5L10.0001 14.3916Z" fill="url(#halfGrad)"/></svg>`;
  }
  function createStars(rating) {
    if (rating === undefined) return "";
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = "";
    for (let i = 0; i < full; i++) html += fullStar();
    if (half) html += halfStar();
    for (let i = 0; i < 5 - full - (half ? 1 : 0); i++) html += emptyStar();
    return html;
  }


  function createProductCard(product) {
    const pid = toId(product.id);
    const favorites = getFavorites();
    const isFav = favorites.some((p) => toId(p.id) === pid);
    const price = product.price_uzs || 0;
    const image = product.image_url || "https://via.placeholder.com/200x200";
    const desc = product.description || "Без описания";

    const card = document.createElement("div");
    card.className = "rounded-lg shadow-sm hover:shadow-lg transition-transform duration-300 flex flex-col relative product-card";
    card.dataset.id = pid;
    if (product.price_uzs !== undefined) card.dataset.price = product.price_uzs;

    const discountBadge = product.discountPercent
      ? `<span class="absolute bottom-0 ml-3 bg-[#fff7fc] font-bold text-base text-[#f00] font-family w-[51px] h-[22px] rounded-[15px]">-${product.discountPercent}%</span>`
      : "";

    const ratingHtml = product.rating !== undefined ? `<div class="flex">${createStars(product.rating)}</div>` : "";

    const stockHtml = product.inStock === false ? `<span class="bg-[#ffe2e5] font-bold text-sm text-center text-[#f64e60] font-family w-[120px] h-[18px] rounded-[15px]">Нет в наличии</span>` : "";

    card.innerHTML = `
      <div class="overflow-hidden relative">
        ${discountBadge}
        <img src="${image}" alt="${desc}" class="mx-auto h-44 sm:h-48 object-cover" />
        <button class="absolute top-2 right-2 cursor-pointer p-1" data-action="favorite">${isFav ? favoriteFilledSvg : favoriteEmptySvg}</button>
      </div>
      <div class="p-2 flex-1 flex flex-col justify-between">
        <h3 class="font-normal text-[15px] leading-[128%] text-black font-family mb-1 product-title">${desc}</h3>
        ${ratingHtml}
        ${stockHtml}
        <div class="flex justify-between items-center">
          <div class="flex flex-col items-start">
            <span class="font-bold text-base text-[#212427] font-family">${price.toLocaleString()} сум</span>
            ${product.oldPrice ? `<span class="font-normal text-[13px] line-through text-gray-400 font-family">${product.oldPrice.toLocaleString()} сум</span>` : ""}
          </div>
          <button class="relative cursor-pointer" data-action="add-to-cart">
            <img src="./images/Border.png" alt="">
          </button>
        </div>
      </div>
    `;

    const favBtn = card.querySelector('[data-action="favorite"]');
    if (favBtn) {
      favBtn.addEventListener("click", () => toggleFavorite({ ...product, id: pid }, favBtn));
    }

    const cartBtn = card.querySelector('[data-action="add-to-cart"]');
    const cart = getCart();
    const isInCart = cart.some((p) => toId(p.id) === pid);

    if (isInCart && cartBtn) {
      const circle = document.createElement("div");
      circle.innerHTML = `<i class="fa-solid fa-check"></i>`;
      circle.className = `absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs shadow-md`;
      cartBtn.appendChild(circle);
    }

    if (cartBtn) {
      cartBtn.addEventListener("click", () => {
        addToCart({ ...product, id: pid });
        if (!cartBtn.querySelector("div")) {
          const circle = document.createElement("div");
          circle.innerHTML = `<i class="fa-solid fa-check"></i>`;
          circle.className = `absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs shadow-md`;
          cartBtn.appendChild(circle);
        }
      });
    }

    return card;
  }

  function renderProductsByTags(products) {
    const containers = {
      popular: document.getElementById("popular-products"),
      bestseller: document.getElementById("bestseller-products"),
      new: document.getElementById("new-products"),
      discount: document.getElementById("discount-products"),
    };
    Object.values(containers).forEach((c) => {
      if (c) c.innerHTML = "";
    });
    products.forEach((p) => {
      if (!p.tags || !Array.isArray(p.tags)) return;
      p.tags.forEach((tag) => {
        const c = containers[tag];
        if (c) c.appendChild(createProductCard(p));
      });
    });

    refreshFavoriteButtons();
    updateCartCounter();
  }

  function initSearch(allProducts) {
    const inputs = [document.getElementById("search-input"), document.getElementById("menu-search-input")].filter(Boolean);
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        const q = (input.value || "").toLowerCase();
        renderProductsByTags(allProducts.filter((p) => (p.description || "").toLowerCase().includes(q)));
      });
    });
  }

  async function fetchProducts() {
    try {
      const res = await fetch("https://68fae18894ec96066023c657.mockapi.io/api/v2/products");
      const data = await res.json();
      renderProductsByTags(data);
      initSearch(data);
    } catch (e) {
      console.error("Ошибка загрузки товаров:", e);
    }
  }

  function closeMobileMenuOnLinkClick() {
    const menuToggle = document.getElementById("menu-toggle");
    if (!menuToggle) return;
    document.querySelectorAll(".fixed a").forEach((link) =>
      link.addEventListener("click", () => {
        if (menuToggle.checked) menuToggle.checked = false;
      })
    );
  }

  window.addEventListener("storage", (e) => {
    if (e.key === "favorites") {

      refreshFavoriteButtons();
    }
    if (e.key === "cart") {
      updateCartCounter();
    }
  });

  fetchProducts();
  updateFavoritesCounter();
  updateCartCounter();
  closeMobileMenuOnLinkClick();
});
