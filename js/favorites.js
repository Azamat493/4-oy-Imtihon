document.addEventListener("DOMContentLoaded", () => {
  const getData = (key) => JSON.parse(localStorage.getItem(key) || "[]");
  const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  const favoriteFilled = `<svg width="20" height="20" fill="#ef4444" viewBox="0 0 20 20"><path opacity="0.9" d="M1.859 11.734L8.918 18.324a1.4 1.4 0 0 0 2.164 0l7.058-6.59C19.328 10.63 20 9.078 20 7.457V7.23c0-2.73-1.973-5.058-4.664-5.507a5.39 5.39 0 0 0-5.336 1.558A5.39 5.39 0 0 0 4.664 1.723C1.973 2.172 0 4.5 0 7.23v.227c0 1.621.672 3.172 1.859 4.277Z"/></svg>`;
  const favoriteEmpty = `<svg width="20" height="20" fill="#888888" viewBox="0 0 20 20"><path opacity="0.4" d="M1.859 11.734L8.918 18.324a1.4 1.4 0 0 0 2.164 0l7.058-6.59C19.328 10.63 20 9.078 20 7.457V7.23c0-2.73-1.973-5.058-4.664-5.507a5.39 5.39 0 0 0-5.336 1.558A5.39 5.39 0 0 0 4.664 1.723C1.973 2.172 0 4.5 0 7.23v.227c0 1.621.672 3.172 1.859 4.277Z"/></svg>`;

  const updateCounters = () => {
    const favCount = getData("favorites").length;
    const cart = getData("cart");
    const cartCount = cart.reduce((s, p) => s + (p.quantity || 1), 0);
    const favEls = ["favorites-counter-mobile", "favorites-counter-desktop"].map(id => document.getElementById(id));
    const cartEls = ["cart-counter-mobile", "cart-counter-desktop"].map(id => document.getElementById(id));
    favEls.forEach(el => el && (el.textContent = favCount));
    cartEls.forEach(el => el && (el.textContent = cartCount));
  };

  const toggleFavorite = (product, btn) => {
    let favs = getData("favorites");
    const exists = favs.some(p => p.id === product.id);
    favs = exists ? favs.filter(p => p.id !== product.id) : [...favs, product];
    btn.innerHTML = exists ? favoriteEmpty : favoriteFilled;
    saveData("favorites", favs);
    renderFavorites();
    updateCounters();
  };

  const addToCart = (product) => {
    const cart = getData("cart");
    if (cart.some(p => p.id === product.id)) return;
    cart.push({ ...product, quantity: 1 });
    saveData("cart", cart);
    updateCounters();
  };

  const stars = (r) => {
    const full = Math.floor(r || 0);
    const half = r % 1 >= 0.5;
    const make = (f) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="${f}"><path d="M10 14.392 15.15 17.5l-1.367-5.858 4.55-3.942-5.992-.508L10 1.667 7.658 7.192l-5.992.508 4.55 3.942L4.85 17.5z"/></svg>`;
    return make("#6682A9").repeat(full) + (half ? make("url(#halfGrad)") : "") + make("#ddd").repeat(5 - full - (half ? 1 : 0));
  };

  const createCard = (p) => {
    const favs = getData("favorites");
    const isFav = favs.some(f => f.id === p.id);
    const card = document.createElement("div");
    card.className = "rounded-lg shadow-sm hover:shadow-lg transition flex flex-col relative";
    const img = p.image_url || "https://via.placeholder.com/200x200";
    const desc = p.description || "Без описания";
    const price = p.price_uzs?.toLocaleString() || "0";
    const disc = p.discountPercent ? `<span class="absolute bottom-0 ml-3 bg-[#fff7fc] text-[#f00] w-[51px] h-[22px] rounded-[15px] font-bold text-base">-${p.discountPercent}%</span>` : "";
    const stock = p.inStock === false ? `<span class="bg-[#ffe2e5] font-bold text-sm text-[#f64e60] text-center w-[120px] h-[18px] rounded-[15px]">Нет в наличии</span>` : "";

    card.innerHTML = `
      <div class="overflow-hidden relative">
        ${disc}
        <img src="${img}" alt="${desc}" class="mx-auto h-44 sm:h-48 object-cover"/>
        <button class="absolute cursor-pointer top-2 right-2 p-1" data-fav>${isFav ? favoriteFilled : favoriteEmpty}</button>
      </div>
      <div class="p-2 flex-1 flex flex-col justify-between">
        <h3 class="text-[15px] font-normal text-black mb-1">${desc}</h3>
        ${p.rating ? `<div class="flex mb-1">${stars(p.rating)}</div>` : ""}
        ${stock}
        <div class="flex justify-between items-center mt-1">
          <div>
            <span class="font-bold text-base text-[#212427]">${price} сум</span>
            ${p.oldPrice ? `<span class="text-[13px] line-through text-gray-400">${p.oldPrice.toLocaleString()} сум</span>` : ""}
          </div>
          <button class="relative cursor-pointer" data-cart><img src="./images/Border.png" alt=""></button>
        </div>
      </div>`;

    const favBtn = card.querySelector("[data-fav]");
    favBtn.addEventListener("click", () => toggleFavorite(p, favBtn));

    const cartBtn = card.querySelector("[data-cart]");
    if (getData("cart").some(c => c.id === p.id)) {
      cartBtn.insertAdjacentHTML("beforeend", `<div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></div>`);
    }
    cartBtn.addEventListener("click", () => {
      addToCart(p);
      if (!cartBtn.querySelector("div"))
        cartBtn.insertAdjacentHTML("beforeend", `<div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></div>`);
    });

    return card;
  };

  const renderFavorites = () => {
    const container = document.getElementById("favorites-items");
    if (!container) return;
    const favs = getData("favorites");
    container.className = "grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
    container.innerHTML = "";
    favs.forEach(p => container.appendChild(createCard(p)));
    updateCounters();
  };

  const initSearch = () => {
    document.querySelectorAll("#search-input,#menu-search-input").forEach(inp =>
      inp?.addEventListener("input", () => {
        const val = inp.value.toLowerCase();
        const filtered = getData("favorites").filter(p => (p.description || "").toLowerCase().includes(val));
        const cont = document.getElementById("favorites-items");
        if (!cont) return;
        cont.innerHTML = "";
        filtered.forEach(p => cont.appendChild(createCard(p)));
      })
    );
  };

  window.addEventListener("storage", (e) => e.key === "favorites" && (renderFavorites(), updateCounters()));
  renderFavorites();
  initSearch();
  updateCounters();
});
